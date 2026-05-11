"""Tariff calculation service for freelancers."""

import logging
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models import FreelancerProfile, ExchangeRate

logger = logging.getLogger(__name__)


class TariffCalculationService:
    """Service for calculating freelancer tariffs with currency conversion."""
    
    def calculate_tariff(
        self,
        db: Session,
        user_id: str,
        hours_worked: float
    ) -> dict:
        """
        Calculate freelancer tariff in their local currency.
        
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
                'breakdown': {
                    'hourly_rate_usd': float,
                    'exchange_rate': float,
                    'hourly_rate_local': float,
                    'hours_worked': float,
                    'total_usd': float,
                    'total_local': float
                }
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
                    'note': 'No conversion needed (already in USD)'
                }
            }
        
        # Get exchange rate USD → freelancer's currency
        exchange_rate = db.query(ExchangeRate).filter(
            ExchangeRate.from_currency == 'USD',
            ExchangeRate.to_currency == freelancer.currency.upper()
        ).first()
        
        if not exchange_rate:
            raise ValueError(
                f"Exchange rate from USD to {freelancer.currency} not found. "
                f"Please sync exchange rates using POST /api/rates/sync"
            )
        
        # Calculate tariffs
        hourly_rate_usd = Decimal(str(freelancer.hourly_rate))
        rate = Decimal(str(exchange_rate.rate))
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
            'exchange_rate': float(exchange_rate.rate),
            'hourly_rate_local': float(hourly_rate_local),
            'total_usd': float(total_usd),
            'total_local': float(total_local),
            'breakdown': {
                'hourly_rate_usd': float(hourly_rate_usd),
                'exchange_rate': float(exchange_rate.rate),
                'hourly_rate_local': float(hourly_rate_local),
                'hours_worked': hours_worked,
                'total_usd': float(total_usd),
                'total_local': float(total_local),
                'currency': freelancer.currency,
                'formula': f"${hourly_rate_usd} USD/hr × {rate} rate × {hours}h = {freelancer.currency} {total_local}"
            }
        }
    
    def get_tariff_estimate(
        self,
        db: Session,
        user_id: str,
        hours_estimate: float
    ) -> dict:
        """Get a tariff estimate without persisting (same as calculate_tariff)."""
        return self.calculate_tariff(db, user_id, hours_estimate)


# Global service instance
tariff_service = TariffCalculationService()
