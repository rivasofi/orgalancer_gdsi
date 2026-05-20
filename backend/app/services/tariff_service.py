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
    
    async def get_exchange_rate_from_dolarapi(self, to_currency: str) -> dict:
        """
        Get real-time exchange rate from DolarApi.com (Dólar Blue).
        
        Uses /v1/dolares/blue endpoint for Argentine Peso (ARS).
        Dólar Blue is the parallel market rate for USD→ARS.
        
        Args:
            to_currency: Target currency (e.g., 'ARS')
        
        Returns:
            dict: {'rate': float, 'source': str, 'nombre': str}
        
        Raises:
            Exception: If API fails or currency not supported
        """
        try:
            # Only support ARS (uses Dólar Blue)
            if to_currency.upper() != 'ARS':
                raise ValueError(f"Currency {to_currency} not supported (only ARS with Dólar Blue)")
            
            async with httpx.AsyncClient() as client:
                # Get Dólar Blue directly from the endpoint
                response = await client.get(
                    f"{DOLARAPI_BASE_URL}/dolares/blue",
                    timeout=10
                )
                response.raise_for_status()
                
                rate_data = response.json()
                logger.info(f"✅ Fetched Dólar Blue from DolarApi")
                
                # Parse single rate object
                compra = rate_data.get('compra', 0)
                venta = rate_data.get('venta', 0)
                avg_rate = (compra + venta) / 2 if compra and venta else 0
                
                if avg_rate <= 0:
                    raise ValueError(f"Invalid rate data from DolarApi: compra={compra}, venta={venta}")
                
                selected_rate = {
                    'rate': avg_rate,
                    'source': rate_data.get('casa', 'blue'),
                    'nombre': rate_data.get('nombre', 'Dólar Blue')
                }
                
                logger.info(f"💵 Using {selected_rate['nombre']}: ${selected_rate['rate']:.2f} ARS/USD")
                return selected_rate
        
        except httpx.TimeoutException:
            logger.error(f"❌ DolarApi timeout")
            raise
        except Exception as e:
            logger.error(f"❌ Failed to fetch Dólar Blue from DolarApi: {e}")
            raise
    
    def get_exchange_rate_from_db(self, db: Session, to_currency: str) -> dict:
        """
        Get exchange rate from database (fallback).
        
        Args:
            db: SQLAlchemy session
            to_currency: Target currency
        
        Returns:
            dict: {'rate': float, 'source': str} or None
        """
        try:
            rate = db.query(ExchangeRate).filter(
                ExchangeRate.from_currency == 'USD',
                ExchangeRate.to_currency == to_currency.upper()
            ).first()
            
            if rate:
                logger.info(f"📦 Using cached rate from DB: USD→{to_currency} = {rate.rate}")
                return {'rate': rate.rate, 'source': 'Cached from Database'}
            
            return None
        except Exception as e:
            logger.error(f"❌ Error getting rate from DB: {e}")
            return None
    
    async def get_exchange_rate(self, db: Session, to_currency: str) -> dict:
        """
        Get exchange rate from DolarApi only (real-time).
        
        For ARS, prioritizes APPI (Dólar APPI).
        
        Returns dict with:
            - rate: float
            - source: str (e.g., 'Oficial', 'Mayorista')
        """
        # Use DolarApi only (real-time, no fallback to database)
        rate_info = await self.get_exchange_rate_from_dolarapi(to_currency)
        return rate_info
    
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
            rate_info = await self.get_exchange_rate(db, freelancer.currency)
            exchange_rate_value = rate_info['rate']
            rate_source = rate_info['source']
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
            f"${total_usd} USD = {freelancer.currency} {total_local} "
            f"(using {rate_source})"
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
                'source': rate_source
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
