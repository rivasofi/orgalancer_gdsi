import re
from typing import Optional
from pydantic import BaseModel, field_validator

_VALID_YEARS = {"0-1", "1-3", "3-5", "5-10", "10+"}
_PHONE_RE = re.compile(r"^\+?[\d\s\-\(\)]{6,20}$")

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    profession: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    specialty: Optional[str] = None
    years_of_experience: Optional[str] = None

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip() if v else v

    @field_validator("profession")
    @classmethod
    def profession_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("La profesión no puede estar vacía")
        return v.strip() if v else v

    @field_validator("phone")
    @classmethod
    def phone_format(cls, v: Optional[str]) -> Optional[str]:
        if v and v.strip():
            if not _PHONE_RE.match(v.strip()):
                raise ValueError("El teléfono no tiene un formato válido")
            return v.strip()
        return None

    @field_validator("years_of_experience")
    @classmethod
    def years_valid(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in _VALID_YEARS:
            raise ValueError(f"Años de experiencia debe ser uno de: {', '.join(sorted(_VALID_YEARS))}")
        return v or None


class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    profession: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    specialty: Optional[str] = None
    years_of_experience: Optional[str] = None
    completion_percentage: int

    class Config:
        from_attributes = True