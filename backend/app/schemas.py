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


class TariffCalculationRequest(BaseModel):
    """Request schema for tariff calculation."""
    
    user_id: str
    hours_worked: float

    @field_validator('hours_worked')
    @classmethod
    def validate_hours(cls, v: float) -> float:
        """Validate that hours worked is positive."""
        if v <= 0:
            raise ValueError('Hours worked must be greater than 0')
        return v


class TariffBreakdown(BaseModel):
    """Detailed breakdown of tariff calculation."""
    
    hourly_rate_usd: float
    exchange_rate: float
    hourly_rate_local: float
    hours_worked: float
    total_usd: float
    total_local: float
    currency: Optional[str] = None
    formula: Optional[str] = None
    note: Optional[str] = None


class TariffCalculationResponse(BaseModel):
    """Response schema for tariff calculation."""
    
    user_id: str
    hours_worked: float
    hourly_rate_usd: float
    currency: str
    exchange_rate: float
    hourly_rate_local: float
    total_usd: float
    total_local: float
    breakdown: TariffBreakdown


class ChatCalculateRequest(BaseModel):
    """Request schema for chat tariff calculation."""
    
    user_id: str
    hours_worked: float
    
    @field_validator('user_id')
    @classmethod
    def validate_user_id(cls, v: str) -> str:
        """Validate that user_id is not empty."""
        if not v or not v.strip():
            raise ValueError('user_id cannot be empty')
        return v.strip()
    
    @field_validator('hours_worked')
    @classmethod
    def validate_hours(cls, v: float) -> float:
        """Validate that hours_worked is positive."""
        if v <= 0:
            raise ValueError('hours_worked must be greater than 0')
        return v


class ChatCalculateResponse(BaseModel):
    """Response schema for chat tariff calculation."""
    
    user_id: str
    hours_worked: float
    freelancer_name: str
    explanation: str
    calculation: TariffCalculationResponse

