import uuid
from sqlalchemy import Column, String
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    profession = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)