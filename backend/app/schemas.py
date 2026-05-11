"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional


class FreelancerConfigBase(BaseModel):
    """Base schema for freelancer configuration."""
    
    hourly_rate: float
    currency: str
    country: Optional[str] = None

    @field_validator('hourly_rate')
    @classmethod
    def validate_rate(cls, v: float) -> float:
        """Validate that hourly rate is positive."""
        if v <= 0:
            raise ValueError('Hourly rate must be positive')
        return v

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate that currency is supported."""
        valid_currencies = ['USD', 'ARS', 'EUR', 'CLP', 'MXN', 'BRL', 'COP', 'PEN']
        if v not in valid_currencies:
            raise ValueError(f'Unsupported currency. Valid options: {", ".join(valid_currencies)}')
        return v.upper()


class FreelancerConfigCreate(FreelancerConfigBase):
    """Schema for creating freelancer configuration."""
    pass


class FreelancerConfigUpdate(BaseModel):
    """Schema for updating freelancer configuration."""
    
    hourly_rate: Optional[float] = None
    currency: Optional[str] = None
    country: Optional[str] = None

    @field_validator('hourly_rate')
    @classmethod
    def validate_rate(cls, v: Optional[float]) -> Optional[float]:
        """Validate that hourly rate is positive if provided."""
        if v is not None and v <= 0:
            raise ValueError('Hourly rate must be positive')
        return v

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: Optional[str]) -> Optional[str]:
        """Validate that currency is supported if provided."""
        if v is not None:
            valid_currencies = ['USD', 'ARS', 'EUR', 'CLP', 'MXN', 'BRL', 'COP', 'PEN']
            if v not in valid_currencies:
                raise ValueError(f'Unsupported currency. Valid options: {", ".join(valid_currencies)}')
            return v.upper()
        return v


class FreelancerConfigResponse(FreelancerConfigBase):
    """Schema for freelancer configuration response."""
    
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExchangeRateSchema(BaseModel):
    """Schema for exchange rate."""
    
    from_currency: str
    to_currency: str
    rate: float
    created_at: datetime
    updated_at: datetime

    @field_validator('from_currency', 'to_currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate currency format."""
        return v.upper()

    class Config:
        from_attributes = True


class ExchangeRateCreateUpdate(BaseModel):
    """Schema for creating/updating exchange rate."""
    
    from_currency: str
    to_currency: str
    rate: float

    @field_validator('from_currency', 'to_currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate currency format."""
        return v.upper()

    @field_validator('rate')
    @classmethod
    def validate_rate(cls, v: float) -> float:
        """Validate that rate is positive."""
        if v <= 0:
            raise ValueError('Exchange rate must be positive')
        return v
