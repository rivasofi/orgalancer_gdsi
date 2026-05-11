"""Unit tests for database models."""

import pytest
from app.models import FreelancerProfile, ExchangeRate


class TestFreelancerProfile:
    """Tests for FreelancerProfile model."""

    def test_create_freelancer(self, db):
        """Test creating a new freelancer profile."""
        freelancer = FreelancerProfile(
            user_id="user123",
            hourly_rate=50.0,
            currency="USD",
            country="Argentina"
        )
        db.add(freelancer)
        db.commit()

        assert freelancer.id is not None
        assert freelancer.user_id == "user123"
        assert freelancer.hourly_rate == 50.0
        assert freelancer.currency == "USD"
        assert freelancer.country == "Argentina"
        assert freelancer.created_at is not None
        assert freelancer.updated_at is not None

    def test_freelancer_unique_user_id(self, db):
        """Test that user_id must be unique."""
        freelancer1 = FreelancerProfile(
            user_id="user456",
            hourly_rate=40.0,
            currency="USD"
        )
        db.add(freelancer1)
        db.commit()

        freelancer2 = FreelancerProfile(
            user_id="user456",
            hourly_rate=60.0,
            currency="ARS"
        )
        db.add(freelancer2)
        
        # Should raise integrity error
        with pytest.raises(Exception):
            db.commit()

    def test_update_freelancer(self, db):
        """Test updating freelancer profile."""
        freelancer = FreelancerProfile(
            user_id="user789",
            hourly_rate=40.0,
            currency="USD"
        )
        db.add(freelancer)
        db.commit()

        # Update the freelancer
        freelancer.hourly_rate = 60.0
        db.commit()

        # Retrieve and verify
        retrieved = db.query(FreelancerProfile).filter_by(user_id="user789").first()
        assert retrieved is not None
        assert retrieved.hourly_rate == 60.0

    def test_freelancer_defaults(self, db):
        """Test default values for freelancer profile."""
        freelancer = FreelancerProfile(
            user_id="user999",
            hourly_rate=50.0
        )
        db.add(freelancer)
        db.commit()

        assert freelancer.currency == "USD"
        assert freelancer.country is None

    def test_freelancer_repr(self):
        """Test string representation of freelancer."""
        freelancer = FreelancerProfile(
            user_id="user001",
            hourly_rate=100.0,
            currency="EUR"
        )
        repr_str = repr(freelancer)
        assert "user001" in repr_str
        assert "100.0" in repr_str
        assert "EUR" in repr_str


class TestExchangeRate:
    """Tests for ExchangeRate model."""

    def test_create_exchange_rate(self, db):
        """Test creating a new exchange rate."""
        rate = ExchangeRate(
            from_currency="USD",
            to_currency="ARS",
            rate=850.0
        )
        db.add(rate)
        db.commit()

        assert rate.id is not None
        assert rate.from_currency == "USD"
        assert rate.to_currency == "ARS"
        assert rate.rate == 850.0
        assert rate.created_at is not None
        assert rate.updated_at is not None

    def test_exchange_rate_unique_pair(self, db):
        """Test that currency pair must be unique."""
        rate1 = ExchangeRate(
            from_currency="USD",
            to_currency="EUR",
            rate=0.92
        )
        db.add(rate1)
        db.commit()

        rate2 = ExchangeRate(
            from_currency="USD",
            to_currency="EUR",
            rate=0.93
        )
        db.add(rate2)

        # Should raise integrity error
        with pytest.raises(Exception):
            db.commit()

    def test_update_exchange_rate(self, db):
        """Test updating exchange rate."""
        rate = ExchangeRate(
            from_currency="EUR",
            to_currency="GBP",
            rate=0.86
        )
        db.add(rate)
        db.commit()

        # Update the rate
        rate.rate = 0.87
        db.commit()

        # Retrieve and verify
        retrieved = db.query(ExchangeRate).filter_by(
            from_currency="EUR",
            to_currency="GBP"
        ).first()
        assert retrieved is not None
        assert retrieved.rate == 0.87

    def test_get_exchange_rate(self, db):
        """Test retrieving exchange rate."""
        rate = ExchangeRate(
            from_currency="USD",
            to_currency="MXN",
            rate=17.50
        )
        db.add(rate)
        db.commit()

        # Retrieve the rate
        retrieved = db.query(ExchangeRate).filter_by(
            from_currency="USD",
            to_currency="MXN"
        ).first()

        assert retrieved is not None
        assert retrieved.rate == 17.50

    def test_exchange_rate_repr(self):
        """Test string representation of exchange rate."""
        rate = ExchangeRate(
            from_currency="GBP",
            to_currency="JPY",
            rate=168.5
        )
        repr_str = repr(rate)
        assert "GBP" in repr_str
        assert "JPY" in repr_str
        assert "168.5" in repr_str

    def test_multiple_exchange_rates(self, db):
        """Test storing multiple exchange rates."""
        rates = [
            ExchangeRate(from_currency="USD", to_currency="EUR", rate=0.92),
            ExchangeRate(from_currency="USD", to_currency="GBP", rate=0.79),
            ExchangeRate(from_currency="USD", to_currency="JPY", rate=149.50),
        ]
        for rate in rates:
            db.add(rate)
        db.commit()

        # Verify all rates are stored
        all_rates = db.query(ExchangeRate).all()
        assert len(all_rates) == 3


class TestRelationships:
    """Test interactions between models."""

    def test_freelancer_and_rates_independent(self, db):
        """Test that freelancer and rates can exist independently."""
        freelancer = FreelancerProfile(
            user_id="user111",
            hourly_rate=75.0,
            currency="USD"
        )
        db.add(freelancer)

        rate = ExchangeRate(
            from_currency="USD",
            to_currency="ARS",
            rate=900.0
        )
        db.add(rate)
        db.commit()

        # Both should exist independently
        retrieved_freelancer = db.query(FreelancerProfile).filter_by(user_id="user111").first()
        retrieved_rate = db.query(ExchangeRate).filter_by(
            from_currency="USD",
            to_currency="ARS"
        ).first()

        assert retrieved_freelancer is not None
        assert retrieved_rate is not None
