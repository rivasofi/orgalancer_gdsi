from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas.financial_profile import FinancialConfig, FinancialConfigResponse
from app.models import FinancialConfiguration

router = APIRouter(prefix="/finances", tags=["finances"])


@router.post("/{user_id}", response_model=FinancialConfigResponse, status_code=201)
def edit_financial_profile(user_id: str, data: FinancialConfig, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.id == user_id).first()
    if not user_exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    config = db.query(FinancialConfiguration).filter(FinancialConfiguration.user_id == user_id).first()

    if config:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(config, key, value)
    else:
        config = FinancialConfiguration(user_id=user_id, **data.model_dump())
        db.add(config)

    db.commit()
    db.refresh(config)
    return config


@router.get("/{user_id}", response_model=FinancialConfigResponse)
def get_financial_profile(user_id: str, db: Session = Depends(get_db)):
    config = db.query(FinancialConfiguration).filter(FinancialConfiguration.user_id == user_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuración financiera no encontrada")
    return config
