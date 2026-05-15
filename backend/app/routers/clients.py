from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Client
from app.schemas import ClientCreate, ClientResponse
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/clients", tags=["clients"]) #
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(
            credentials.credentials,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"]
        )
        user_id = payload.get("sub") 
        
        if user_id is None:
            print("DEBUG: El token no contiene 'sub'")
            raise HTTPException(status_code=401, detail="Token inválido")
            
        return str(user_id)
    except Exception as e:
        print(f"DEBUG Error en JWT: {e}")
        raise HTTPException(status_code=401, detail="Not authenticated")

@router.post("", response_model=ClientResponse, status_code=201)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    if db.query(Client).filter(Client.email == client.email, Client.user_id == user_id).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese email")

    new = Client(**client.model_dump(), user_id=user_id)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("", response_model=list[ClientResponse])
def display_clients(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    return db.query(Client).filter(Client.user_id == user_id).all()


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    client = db.query(Client).filter(
        Client.id == client_id,
        Client.user_id == user_id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client