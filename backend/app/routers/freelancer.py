"""Router for freelancer financial configuration endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FreelancerProfile
from app.schemas import (
    FreelancerConfigCreate,
    FreelancerConfigUpdate,
    FreelancerConfigResponse,
    TariffCalculationRequest,
    TariffCalculationResponse
)
from app.services.tariff_service import tariff_service

router = APIRouter(
    prefix="/api/freelancer",
    tags=["freelancer"],
)


@router.post("/config", response_model=FreelancerConfigResponse, status_code=status.HTTP_201_CREATED)
def create_freelancer_config(
    config: FreelancerConfigCreate,
    user_id: str,  # In real app, this would come from JWT token
    db: Session = Depends(get_db)
):
    """Create a new freelancer configuration."""
    # Check if freelancer already exists
    existing = db.query(FreelancerProfile).filter(
        FreelancerProfile.user_id == user_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Freelancer with user_id '{user_id}' already exists"
        )
    
    # Create new freelancer profile
    freelancer = FreelancerProfile(
        user_id=user_id,
        hourly_rate=config.hourly_rate,
        currency=config.currency,
        country=config.country
    )
    
    db.add(freelancer)
    db.commit()
    db.refresh(freelancer)
    
    return freelancer


@router.get("/config/{user_id}", response_model=FreelancerConfigResponse)
def get_freelancer_config(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get freelancer configuration by user_id."""
    freelancer = db.query(FreelancerProfile).filter(
        FreelancerProfile.user_id == user_id
    ).first()
    
    if not freelancer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Freelancer with user_id '{user_id}' not found"
        )
    
    return freelancer


@router.put("/config/{user_id}", response_model=FreelancerConfigResponse)
def update_freelancer_config(
    user_id: str,
    config: FreelancerConfigUpdate,
    db: Session = Depends(get_db)
):
    """Update freelancer configuration."""
    freelancer = db.query(FreelancerProfile).filter(
        FreelancerProfile.user_id == user_id
    ).first()
    
    if not freelancer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Freelancer with user_id '{user_id}' not found"
        )
    
    # Update only provided fields
    if config.hourly_rate is not None:
        freelancer.hourly_rate = config.hourly_rate
    if config.currency is not None:
        freelancer.currency = config.currency
    if config.country is not None:
        freelancer.country = config.country
    
    db.commit()
    db.refresh(freelancer)
    
    return freelancer


@router.delete("/config/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_freelancer_config(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Delete freelancer configuration."""
    freelancer = db.query(FreelancerProfile).filter(
        FreelancerProfile.user_id == user_id
    ).first()
    
    if not freelancer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Freelancer with user_id '{user_id}' not found"
        )
    
    db.delete(freelancer)
    db.commit()
    
    return None


@router.post("/calculate", response_model=TariffCalculationResponse)
async def calculate_freelancer_tariff(
    request: TariffCalculationRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate freelancer tariff in their local currency.
    
    This endpoint:
    1. Gets freelancer profile with hourly rate and currency
    2. Fetches REAL-TIME exchange rate from DolarApi.com
    3. Falls back to cached rates in DB if API unavailable
    4. Calculates total: hourly_rate × exchange_rate × hours_worked
    5. Returns detailed breakdown
    
    Request body:
        {
            "user_id": "freelancer_001",
            "hours_worked": 8.5
        }
    
    Response:
        {
            "user_id": "freelancer_001",
            "hours_worked": 8.5,
            "hourly_rate_usd": 75.50,
            "currency": "ARS",
            "exchange_rate": 870.50,
            "hourly_rate_local": 65713.75,
            "total_usd": 641.75,
            "total_local": 558166.875,
            "breakdown": {...}
        }
    
    Raises:
        HTTPException: If freelancer not found, exchange rate not found, or invalid hours
    """
    try:
        result = await tariff_service.calculate_tariff(
            db,
            request.user_id,
            request.hours_worked
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating tariff: {str(e)}"
        )

