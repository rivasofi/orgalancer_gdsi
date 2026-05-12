from pydantic import BaseModel, field_validator
from typing import ClassVar


class FinancialConfig(BaseModel):
    coin_type: str
    hourly_rate: float
    profit_margin: float

    VALID_COINS: ClassVar[list[str]] = [
        'USD',
        'EUR',
        'GBP',
        'ARS',
        'MXN',
        'CLP',
        'COP',
        'BRL',
        'JPY'
    ]

    @field_validator("coin_type")
    @classmethod
    def validate_coin(cls, v):
        coin = v.strip().upper()
        if not coin:
            raise ValueError("El tipo de moneda no puede estar vacío")
        if coin not in cls.VALID_COINS:
            raise ValueError(f"El tipo de moneda debe ser uno de: {', '.join(cls.VALID_COINS)}")
        return coin

    @field_validator("hourly_rate")
    @classmethod
    def validate_rate(cls, v):
        if v <= 0:
            raise ValueError("La tarifa horaria debe ser un valor positivo mayor a cero")
        return v

    @field_validator("profit_margin")
    @classmethod
    def validate_margin(cls, v):
        if v < 0 or v >= 100:
            raise ValueError("El margen de beneficio debe ser un valor entre 0 y 100")
        return v

class FinancialConfigResponse(BaseModel):
    coin_type: str
    hourly_rate: float
    profit_margin: float

    class Config:
        from_attributes = True