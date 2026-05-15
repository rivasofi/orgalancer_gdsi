from pydantic import BaseModel, field_validator
from app.models import ContractType, ProjectState
from datetime import date

class ProjectCreate(BaseModel):
    user_id: str
    client_id: str
    name: str
    contract_type: ContractType
    estimated_budget: float
    deadline: date | None = None

    @field_validator("contract_type")
    @classmethod
    def validate_contract_type(cls, v):
        if not isinstance(v, ContractType):
            raise ValueError("El tipo de contrato debe ser un valor válido")
        return v
    
    @field_validator("estimated_budget")
    @classmethod
    def validate_budget(cls, v):
        if v < 0:
            raise ValueError("El presupuesto estimado debe ser un valor positivo")
        return v
    
    @field_validator("deadline")
    @classmethod
    def validate_deadline(cls, v):
        if v is None:       
            return v
        if v < date.today():
            raise ValueError("La fecha límite no puede ser anterior a la fecha actual")
        return v

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    client_id: str
    name: str
    contract_type: ContractType
    estimated_budget: float
    deadline: date
    state: ProjectState

    class Config:
        from_attributes = True