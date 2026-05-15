from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Client
from app.schemas import ClientCreate, ClientResponse

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("", response_model=ClientResponse, status_code=201)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    if db.query(Client).filter(Client.email == client.email).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese email")

    new = Client(**client.model_dump())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("", response_model=list[ClientResponse])
def display_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: str, db: Session = Depends(get_db)):
    cliente = db.query(Client).filter(Client.id == client_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente