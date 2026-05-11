"""Chat routes for tariff calculation explanations."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatCalculateRequest, ChatCalculateResponse
from app.services.claude_chat_service import claude_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/calculate", response_model=ChatCalculateResponse, status_code=200)
async def calculate_with_explanation(
    request: ChatCalculateRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate tariff and get Claude's friendly explanation.
    
    This endpoint:
    1. Takes user_id and hours_worked
    2. Calculates the tariff in real-time
    3. Gets exchange rate from DolarApi.com
    4. Asks Claude to explain the result
    5. Returns both calculation and explanation
    
    Example request:
    ```json
    {
        "user_id": "freelancer_ars",
        "hours_worked": 8
    }
    ```
    
    Example response:
    ```json
    {
        "user_id": "freelancer_ars",
        "hours_worked": 8,
        "freelancer_name": "freelancer_ars",
        "explanation": "Great! For 8 hours at your rate...",
        "calculation": {
            "user_id": "freelancer_ars",
            "hours_worked": 8,
            "hourly_rate_usd": 75.50,
            ...
        }
    }
    ```
    """
    try:
        logger.info(f"📨 Chat calculate request: {request.user_id}, {request.hours_worked} hours")
        
        # Call service to calculate and get explanation
        result = await claude_service.calculate_and_explain(
            db=db,
            user_id=request.user_id,
            hours_worked=request.hours_worked
        )
        
        logger.info(f"✅ Chat calculate success for {request.user_id}")
        
        return ChatCalculateResponse(
            user_id=result['user_id'],
            hours_worked=result['hours_worked'],
            freelancer_name=result['freelancer_name'],
            explanation=result['explanation'],
            calculation=result['calculation']
        )
    
    except ValueError as e:
        logger.error(f"❌ Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate tariff: {str(e)}"
        )
