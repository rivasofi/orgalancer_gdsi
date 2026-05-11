"""SQLAlchemy models for the application."""

from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base


class FreelancerProfile(Base):
    """Model for freelancer financial configuration."""
    
    __tablename__ = "freelancer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    currency = Column(String, default="USD", nullable=False)
    country = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<FreelancerProfile(user_id={self.user_id}, hourly_rate={self.hourly_rate} {self.currency})>"


class ExchangeRate(Base):
    """Model for storing exchange rates between currencies."""
    
    __tablename__ = "exchange_rates"

    id = Column(Integer, primary_key=True, index=True)
    from_currency = Column(String, nullable=False, index=True)
    to_currency = Column(String, nullable=False, index=True)
    rate = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Unique constraint on currency pair
    __table_args__ = (
        UniqueConstraint('from_currency', 'to_currency', name='uq_currency_pair'),
    )

    def __repr__(self):
        return f"<ExchangeRate({self.from_currency}/{self.to_currency} = {self.rate})>"
