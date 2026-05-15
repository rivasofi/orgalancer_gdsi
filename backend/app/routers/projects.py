from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, Client, User
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == project.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    client = db.query(Client).filter(Client.id == project.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    data = project.model_dump()
    new = Project(**data, state="active")
    try:
        db.add(new)
        db.commit()
        db.refresh(new)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al crear el proyecto: " + str(e))
    return new

@router.get("/", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects