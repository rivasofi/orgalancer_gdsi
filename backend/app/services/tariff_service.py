"""Tariff calculation service for freelancers."""

import httpx
import logging
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models import FreelancerProfile, ExchangeRate

logger = logging.getLogger(__name__)

DOLARAPI_BASE_URL = "https://dolarapi.com/v1"


class TariffCalculationService:
    """Service for calculating freelancer tariffs with currency conversion."""
    
    async def get_exchange_rate_from_dolarapi(self, to_currency: str) -> float:
        """
        Get real-time exchange rate from DolarApi.com.
        
        Args:
            to_currency: Target currency (e.g., 'ARS', 'EUR', 'BRL')
        
        Returns:
            float: Exchange rate (USD → to_currency)
        
        Raises:
            Exception: If API fails or currency not found
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{DOLARAPI_BASE_URL}/dolares",
                    timeout=10
                )
                response.raise_for_status()
                
                data = response.json()
                logger.info(f"✅ Fetched rates from DolarApi for {to_currency}")
                
                # Find the rate for this currency
                for rate_data in data:
                    if rate_data.get('moneda', '').upper() == to_currency.upper():
                        compra = rate_data.get('compra', 0)
                        venta = rate_data.get('venta', 0)
                        # Use average of compra/venta
                        avg_rate = (compra + venta) / 2 if compra and venta else 0
                        
                        if avg_rate > 0:
                            logger.info(f"🔄 Exchange rate USD→{to_currency}: {avg_rate}")
                            return avg_rate
                
                raise ValueError(f"Currency {to_currency} not found in DolarApi")
        
        except httpx.TimeoutException:
            logger.error(f"❌ DolarApi timeout for {to_currency}")
            raise
        except Exception as e:
            logger.error(f"❌ Failed to fetch rate from DolarApi: {e}")
            raise
    
    def get_exchange_rate_from_db(self, db: Session, to_currency: str) -> float:
        """
        Get exchange rate from database (fallback).
        
        Args:
            db: SQLAlchemy session
            to_currency: Target currency
        
        Returns:
            float: Exchange rate or None
        """
        try:
            rate = db.query(ExchangeRate).filter(
                ExchangeRate.from_currency == 'USD',
                ExchangeRate.to_currency == to_currency.upper()
            ).first()
            
            if rate:
                logger.info(f"📦 Using cached rate from DB: USD→{to_currency} = {rate.rate}")
                return rate.rate
            
            return None
        except Exception as e:
            logger.error(f"❌ Error getting rate from DB: {e}")
            return None
    
    async def get_exchange_rate(self, db: Session, to_currency: str) -> float:
        """
        Get exchange rate with fallback strategy.
        
        1. Try DolarApi (real-time)
        2. Fallback to DB (cached)
        3. Error if both fail
        """
        # Try DolarApi first (real-time)
        try:
            rate = await self.get_exchange_rate_from_dolarapi(to_currency)
            return rate
        except Exception as e:
            logger.warning(f"⚠️  DolarApi failed: {e}. Trying fallback to DB...")
            
            # Fallback to DB
            db_rate = self.get_exchange_rate_from_db(db, to_currency)
            if db_rate:
                return db_rate
            
            # Both failed
            raise ValueError(
                f"Could not get exchange rate for {to_currency}. "
                f"DolarApi unavailable and no cached rate in DB. "
                f"Please sync rates using POST /api/rates/sync"
            )
    
    async def calculate_tariff(
        self,
        db: Session,
        user_id: str,
        hours_worked: float
    ) -> dict:
        """
        Calculate freelancer tariff in their local currency.
        
        Gets exchange rate directly from DolarApi.com (real-time).
        Falls back to cached rates in DB if API fails.
        
        Args:
            db: SQLAlchemy session
            user_id: Freelancer user ID
            hours_worked: Number of hours worked
        
        Returns:
            dict: {
                'user_id': str,
                'hours_worked': float,
                'hourly_rate_usd': float,
                'currency': str,
                'exchange_rate': float,
                'hourly_rate_local': float,
                'total_usd': float,
                'total_local': float,
                'breakdown': {...}
            }
        
        Raises:
            ValueError: If freelancer not found, exchange rate not found, or invalid hours
        """
        # Validate hours worked
        if hours_worked <= 0:
            raise ValueError("Hours worked must be greater than 0")
        
        # Get freelancer profile
        freelancer = db.query(FreelancerProfile).filter(
            FreelancerProfile.user_id == user_id
        ).first()
        
        if not freelancer:
            raise ValueError(f"Freelancer with user_id '{user_id}' not found")
        
        # If freelancer uses USD, no conversion needed
        if freelancer.currency.upper() == 'USD':
            total = Decimal(str(freelancer.hourly_rate)) * Decimal(str(hours_worked))
            
            return {
                'user_id': user_id,
                'hours_worked': hours_worked,
                'hourly_rate_usd': float(freelancer.hourly_rate),
                'currency': 'USD',
                'exchange_rate': 1.0,
                'hourly_rate_local': float(freelancer.hourly_rate),
                'total_usd': float(total),
                'total_local': float(total),
                'breakdown': {
                    'hourly_rate_usd': float(freelancer.hourly_rate),
                    'exchange_rate': 1.0,
                    'hourly_rate_local': float(freelancer.hourly_rate),
                    'hours_worked': hours_worked,
                    'total_usd': float(total),
                    'total_local': float(total),
                    'currency': 'USD',
                    'source': 'No conversion (already in USD)',
                    'note': 'No conversion needed (already in USD)'
                }
            }
        
        # Get exchange rate from DolarApi (with fallback to DB)
        try:
            exchange_rate_value = await self.get_exchange_rate(db, freelancer.currency)
        except Exception as e:
            raise ValueError(str(e))
        
        # Calculate tariffs
        hourly_rate_usd = Decimal(str(freelancer.hourly_rate))
        rate = Decimal(str(exchange_rate_value))
        hours = Decimal(str(hours_worked))
        
        hourly_rate_local = hourly_rate_usd * rate
        total_usd = hourly_rate_usd * hours
        total_local = hourly_rate_local * hours
        
        logger.info(
            f"✅ Calculated tariff for {user_id}: "
            f"${total_usd} USD = {freelancer.currency} {total_local}"
        )
        
        return {
            'user_id': user_id,
            'hours_worked': hours_worked,
            'hourly_rate_usd': float(hourly_rate_usd),
            'currency': freelancer.currency,
            'exchange_rate': float(exchange_rate_value),
            'hourly_rate_local': float(hourly_rate_local),
            'total_usd': float(total_usd),
            'total_local': float(total_local),
            'breakdown': {
                'hourly_rate_usd': float(hourly_rate_usd),
                'exchange_rate': float(exchange_rate_value),
                'hourly_rate_local': float(hourly_rate_local),
                'hours_worked': hours_worked,
                'total_usd': float(total_usd),
                'total_local': float(total_local),
                'currency': freelancer.currency,
                'formula': f"${hourly_rate_usd} USD/hr × {rate} rate × {hours}h = {freelancer.currency} {total_local}",
                'source': 'DolarApi.com (real-time) or cached'
            }
        }
    
    async def get_tariff_estimate(
        self,
        db: Session,
        user_id: str,
        hours_estimate: float
    ) -> dict:
        """Get a tariff estimate without persisting (same as calculate_tariff)."""
        return await self.calculate_tariff(db, user_id, hours_estimate)


# Global service instance
tariff_service = TariffCalculationService()
