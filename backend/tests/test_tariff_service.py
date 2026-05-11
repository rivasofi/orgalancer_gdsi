"""Tests for TariffCalculationService."""

import pytest
from sqlalchemy.orm import Session
from app.services.tariff_service import TariffCalculationService
from app.models import FreelancerProfile, ExchangeRate


class TestTariffCalculationService:
    """Tests for TariffCalculationService."""
    
    def test_calculate_tariff_usd_freelancer(self, db: Session):
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
        result = service.calculate_tariff(db, 'freelancer_usd', 8.0)
        
        assert result['user_id'] == 'freelancer_usd'
        assert result['hours_worked'] == 8.0
        assert result['hourly_rate_usd'] == 100.0
        assert result['currency'] == 'USD'
        assert result['exchange_rate'] == 1.0
        assert result['total_usd'] == 800.0
        assert result['total_local'] == 800.0
    
    def test_calculate_tariff_with_conversion(self, db: Session):
        """Test calculating tariff with currency conversion."""
        service = TariffCalculationService()
        
        # Create ARS freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_ars',
            hourly_rate=75.50,
            currency='ARS',
            country='Argentina'
        )
        db.add(freelancer)
        
        # Create USD→ARS exchange rate
        rate = ExchangeRate(
            from_currency='USD',
            to_currency='ARS',
            rate=870.50
        )
        db.add(rate)
        db.commit()
        
        # Calculate tariff
        result = service.calculate_tariff(db, 'freelancer_ars', 8.0)
        
        assert result['user_id'] == 'freelancer_ars'
        assert result['hours_worked'] == 8.0
        assert result['hourly_rate_usd'] == 75.50
        assert result['currency'] == 'ARS'
        assert result['exchange_rate'] == 870.50
        
        # Check calculations
        expected_local_hourly = 75.50 * 870.50  # 65738.75
        expected_total_usd = 75.50 * 8.0  # 604.0
        expected_total_local = expected_local_hourly * 8.0  # 525910.0
        
        assert abs(result['hourly_rate_local'] - expected_local_hourly) < 0.01
        assert abs(result['total_usd'] - expected_total_usd) < 0.01
        assert abs(result['total_local'] - expected_total_local) < 0.01
    
    def test_calculate_tariff_freelancer_not_found(self, db: Session):
        """Test calculating tariff for non-existent freelancer."""
        service = TariffCalculationService()
        
        with pytest.raises(ValueError) as exc_info:
            service.calculate_tariff(db, 'nonexistent', 8.0)
        
        assert "not found" in str(exc_info.value)
    
    def test_calculate_tariff_exchange_rate_not_found(self, db: Session):
        """Test calculating tariff when exchange rate doesn't exist."""
        service = TariffCalculationService()
        
        # Create freelancer without exchange rate
        freelancer = FreelancerProfile(
            user_id='freelancer_eur',
            hourly_rate=75.50,
            currency='EUR',
            country='Spain'
        )
        db.add(freelancer)
        db.commit()
        
        with pytest.raises(ValueError) as exc_info:
            service.calculate_tariff(db, 'freelancer_eur', 8.0)
        
        assert "not found" in str(exc_info.value).lower()
    
    def test_calculate_tariff_invalid_hours(self, db: Session):
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
            service.calculate_tariff(db, 'freelancer_test', -5.0)
        
        assert "greater than 0" in str(exc_info.value)
        
        # Test zero hours
        with pytest.raises(ValueError):
            service.calculate_tariff(db, 'freelancer_test', 0.0)
    
    def test_get_tariff_estimate(self, db: Session):
        """Test getting tariff estimate (should be same as calculate_tariff)."""
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
        
        estimate = service.get_tariff_estimate(db, 'freelancer_est', 10.0)
        
        assert estimate['total_usd'] == 1000.0
        assert estimate['user_id'] == 'freelancer_est'
    
    def test_tariff_breakdown_structure(self, db: Session):
        """Test that tariff breakdown has required fields."""
        service = TariffCalculationService()
        
        # Create freelancer
        freelancer = FreelancerProfile(
            user_id='freelancer_bd',
            hourly_rate=50.0,
            currency='USD',
            country='USA'
        )
        db.add(freelancer)
        db.commit()
        
        result = service.calculate_tariff(db, 'freelancer_bd', 5.0)
        
        # Check breakdown structure
        breakdown = result['breakdown']
        assert 'hourly_rate_usd' in breakdown
        assert 'exchange_rate' in breakdown
        assert 'hourly_rate_local' in breakdown
        assert 'hours_worked' in breakdown
        assert 'total_usd' in breakdown
        assert 'total_local' in breakdown
        assert 'currency' in breakdown
