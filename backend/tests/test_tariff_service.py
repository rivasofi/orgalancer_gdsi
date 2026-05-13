"""Tests for TariffCalculationService."""

import pytest
from sqlalchemy.orm import Session
from app.services.tariff_service import TariffCalculationService
from app.models import FreelancerProfile, ExchangeRate


class TestTariffCalculationService:
    """Tests for TariffCalculationService."""
    
    @pytest.mark.asyncio
    async def test_calculate_tariff_usd_freelancer(self, db: Session):
        """Test calculating tariff for USD freelancer (no conversion needed)."""
        service = TariffCalculationService()
        
        # Create USD freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_usd',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        # Calculate tariff
        result = await service.calculate_tariff(db, 'freelancer_usd', 8.0)
        
        assert result['user_id'] == 'freelancer_usd'
        assert result['hours_worked'] == 8.0
        assert result['hourly_rate_usd'] == 100.0
        assert result['currency'] == 'USD'
        assert result['exchange_rate'] == 1.0
        assert result['total_usd'] == 800.0
        assert result['total_local'] == 800.0
    
    @pytest.mark.asyncio
    async def test_calculate_tariff_freelancer_not_found(self, db: Session):
        """Test calculating tariff for non-existent freelancer."""
        service = TariffCalculationService()
        
        with pytest.raises(ValueError) as exc_info:
            await service.calculate_tariff(db, 'nonexistent', 8.0)
        
        assert "not found" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_calculate_tariff_exchange_rate_not_found(self, db: Session):
        """Test calculating tariff when exchange rate doesn't exist (DolarApi only)."""
        service = TariffCalculationService()
        
        # Create freelancer with unsupported currency
        freelancer = FreelancerProfile(
            user_id='freelancer_eur',
            hourly_rate=75.50,
            currency='EUR',
            country='Spain'
        )
        db.add(freelancer)
        db.commit()
        
        # This should fail (DolarApi only supports ARS and USD)
        with pytest.raises(ValueError) as exc_info:
            await service.calculate_tariff(db, 'freelancer_eur', 8.0)
        
        # Error should mention currency not supported or dolarapi error
        error_msg = str(exc_info.value).lower()
        assert "not supported" in error_msg or "dolarapi" in error_msg or "eur" in error_msg
    
    @pytest.mark.asyncio
    async def test_calculate_tariff_with_dolarapi(self, db: Session):
        """Test that tariff uses DolarApi oficial (APPI) rate for ARS."""
        service = TariffCalculationService()
        
        # Create ARS freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_ars_db',
            hourly_rate=75.50,
            currency='ARS',
            country='Argentina'
        )
        db.add(freelancer)
        db.commit()
        
        # Calculate tariff (will use DolarApi Dólar Blue rate for ARS)
        result = await service.calculate_tariff(db, 'freelancer_ars_db', 8.0)
        
        assert result['user_id'] == 'freelancer_ars_db'
        assert result['hours_worked'] == 8.0
        assert result['hourly_rate_usd'] == 75.50
        assert result['currency'] == 'ARS'
        # Should use the DolarApi Dólar Blue rate which is ~1405.0
        # (average of compra: 1395 and venta: 1415)
        assert result['exchange_rate'] == 1405.0
    
    @pytest.mark.asyncio
    async def test_calculate_tariff_invalid_hours(self, db: Session):
        """Test calculating tariff with invalid hours."""
        service = TariffCalculationService()
        
        # Create freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_test',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        # Test negative hours
        with pytest.raises(ValueError) as exc_info:
            await service.calculate_tariff(db, 'freelancer_test', -5.0)
        
        assert "greater than 0" in str(exc_info.value)
        
        # Test zero hours
        with pytest.raises(ValueError):
            await service.calculate_tariff(db, 'freelancer_test', 0.0)
    
    @pytest.mark.asyncio
    async def test_get_tariff_estimate(self, db: Session):
        """Test getting tariff estimate."""
        service = TariffCalculationService()
        
        # Create freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_est',
            hourly_rate=100.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        estimate = await service.get_tariff_estimate(db, 'freelancer_est', 10.0)
        
        assert estimate['total_usd'] == 1000.0
        assert estimate['user_id'] == 'freelancer_est'
    
    @pytest.mark.asyncio
    async def test_tariff_breakdown_structure(self, db: Session):
        """Test that tariff breakdown has required fields."""
        service = TariffCalculationService()
        
        # Create ARS freelancer (non-USD, to test DolarApi integration)
        freelancer = FreelancerProfile(
            user_id='freelancer_bd',
            hourly_rate=50.0,
            currency='ARS',
            country='Argentina'
        )
        db.add(freelancer)
        
        # Add cached rate to DB as fallback
        rate = ExchangeRate(
            from_currency='USD',
            to_currency='ARS',
            rate=870.50
        )
        db.add(rate)
        db.commit()
        
        result = await service.calculate_tariff(db, 'freelancer_bd', 5.0)
        
        # Check breakdown structure
        breakdown = result['breakdown']
        assert 'hourly_rate_usd' in breakdown
        assert 'exchange_rate' in breakdown
        assert 'hourly_rate_local' in breakdown
        assert 'hours_worked' in breakdown
        assert 'total_usd' in breakdown
        assert 'total_local' in breakdown
        assert 'currency' in breakdown
        assert 'source' in breakdown
        # Source should indicate Dólar Blue
        source_lower = breakdown['source'].lower()
        assert 'blue' in source_lower

