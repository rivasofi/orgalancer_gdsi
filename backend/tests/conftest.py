"""Test configuration and fixtures."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from app.database import Base, get_db
from app.models import FreelancerProfile, ExchangeRate
from main import app


# Use in-memory SQLite database for tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override get_db dependency for testing."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create test database tables
Base.metadata.create_all(bind=engine)

# Override the dependency in FastAPI app for TestClient
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def db():
    """Provide test database session."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    """Provide TestClient with overridden dependencies."""
    return TestClient(app)
