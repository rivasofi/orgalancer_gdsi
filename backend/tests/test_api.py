"""Integration tests for API endpoints."""

import sys
import os

# Add backend directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from main import app
from app.database import Base, get_db
from app.models import FreelancerProfile, ExchangeRate

# Setup test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    """Setup and teardown test database for all tests."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    """Get test database session."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


class TestFreelancerEndpoints:
    """Tests for freelancer configuration endpoints."""

    def test_create_freelancer_config(self, db):
        """Test creating a freelancer configuration."""
        response = client.post(
            "/api/freelancer/config?user_id=user_test_001",
            json={
                "hourly_rate": 75.50,
                "currency": "USD",
                "country": "Argentina"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == "user_test_001"
        assert data["hourly_rate"] == 75.50
        assert data["currency"] == "USD"
        assert data["country"] == "Argentina"

    def test_get_freelancer_config(self, db):
        """Test getting freelancer configuration."""
        # First create one
        client.post(
            "/api/freelancer/config?user_id=user_test_002",
            json={
                "hourly_rate": 100.0,
                "currency": "EUR",
                "country": "Spain"
            }
        )
        
        # Then retrieve it
        response = client.get("/api/freelancer/config/user_test_002")
        
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "user_test_002"
        assert data["hourly_rate"] == 100.0
        assert data["currency"] == "EUR"

    def test_get_nonexistent_freelancer(self):
        """Test getting a freelancer that doesn't exist."""
        response = client.get("/api/freelancer/config/nonexistent_user")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_update_freelancer_config(self, db):
        """Test updating freelancer configuration."""
        # Create first
        client.post(
            "/api/freelancer/config?user_id=user_test_003",
            json={
                "hourly_rate": 50.0,
                "currency": "USD",
                "country": "Mexico"
            }
        )
        
        # Update
        response = client.put(
            "/api/freelancer/config/user_test_003",
            json={
                "hourly_rate": 75.0,
                "currency": "MXN"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["hourly_rate"] == 75.0
        assert data["currency"] == "MXN"
        assert data["country"] == "Mexico"  # Unchanged

    def test_duplicate_freelancer_creation(self, db):
        """Test that creating duplicate freelancer fails."""
        # Create first
        client.post(
            "/api/freelancer/config?user_id=user_test_004",
            json={
                "hourly_rate": 50.0,
                "currency": "USD"
            }
        )
        
        # Try to create same user again
        response = client.post(
            "/api/freelancer/config?user_id=user_test_004",
            json={
                "hourly_rate": 75.0,
                "currency": "USD"
            }
        )
        
        assert response.status_code == 409  # Conflict
        assert "already exists" in response.json()["detail"].lower()

    def test_delete_freelancer_config(self, db):
        """Test deleting freelancer configuration."""
        # Create first
        client.post(
            "/api/freelancer/config?user_id=user_test_005",
            json={
                "hourly_rate": 50.0,
                "currency": "USD"
            }
        )
        
        # Delete
        response = client.delete("/api/freelancer/config/user_test_005")
        assert response.status_code == 204
        
        # Verify it's deleted
        response = client.get("/api/freelancer/config/user_test_005")
        assert response.status_code == 404


class TestExchangeRateEndpoints:
    """Tests for exchange rate endpoints."""

    def test_create_exchange_rate(self, db):
        """Test creating an exchange rate."""
        response = client.post(
            "/api/rates/exchange",
            json={
                "from_currency": "USD",
                "to_currency": "ARS",
                "rate": 850.50
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["from_currency"] == "USD"
        assert data["to_currency"] == "ARS"
        assert data["rate"] == 850.50

    def test_get_exchange_rate(self, db):
        """Test getting a specific exchange rate."""
        # Create first
        client.post(
            "/api/rates/exchange",
            json={
                "from_currency": "USD",
                "to_currency": "EUR",
                "rate": 0.92
            }
        )
        
        # Retrieve
        response = client.get("/api/rates/exchange?from_currency=USD&to_currency=EUR")
        
        assert response.status_code == 200
        data = response.json()
        assert data["from_currency"] == "USD"
        assert data["to_currency"] == "EUR"
        assert data["rate"] == 0.92

    def test_get_nonexistent_exchange_rate(self):
        """Test getting exchange rate that doesn't exist."""
        response = client.get("/api/rates/exchange?from_currency=XXX&to_currency=YYY")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_get_all_rates(self, db):
        """Test getting all exchange rates."""
        # Create multiple rates
        rates = [
            {"from_currency": "USD", "to_currency": "ARS", "rate": 850.0},
            {"from_currency": "USD", "to_currency": "EUR", "rate": 0.92},
            {"from_currency": "USD", "to_currency": "GBP", "rate": 0.79},
        ]
        
        for rate in rates:
            client.post("/api/rates/exchange", json=rate)
        
        # Get all
        response = client.get("/api/rates/all")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3

    def test_update_exchange_rate(self, db):
        """Test updating an exchange rate."""
        # Create first
        client.post(
            "/api/rates/exchange",
            json={
                "from_currency": "USD",
                "to_currency": "BRL",
                "rate": 5.10
            }
        )
        
        # Update by creating again (upsert behavior)
        response = client.post(
            "/api/rates/exchange",
            json={
                "from_currency": "USD",
                "to_currency": "BRL",
                "rate": 5.25
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["rate"] == 5.25


class TestHealthAndRoot:
    """Tests for health and root endpoints."""

    def test_root_endpoint(self):
        """Test root endpoint."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "OrgaLancer" in data["message"]

    def test_health_endpoint(self):
        """Test health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
