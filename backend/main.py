from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.database import engine, Base
import app.models  # noqa: F401 — necesario para que Base registre los modelos

Base.metadata.create_all(bind=engine)  # Crea las tablas si no existen

app = FastAPI(title="Orgalancer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # En prod: dominio de Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}