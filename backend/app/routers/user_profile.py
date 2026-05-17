import os
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import ProfileResponse, ProfileUpdate
from app.routers.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

AVATAR_DIR = "static/avatars"
ALLOWED_MIME = {"image/jpeg", "image/png", "image/gif"}
MAX_BYTES = 2 * 1024 * 1024
_COMPLETION_FIELDS = (
    "full_name", "email", "avatar_url", "phone", 
    "country", "specialty", "years_of_experience",
)

os.makedirs(AVATAR_DIR, exist_ok=True)


# --- Endpoints ---

@router.get("/me", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
):
    return _map_to_response(current_user)


@router.put("/me", response_model=ProfileResponse)
async def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return _map_to_response(current_user)


@router.post("/me/avatar", response_model=ProfileResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    _validate_avatar(file, content)

    if current_user.avatar_url:
        _delete_file_safely(current_user.avatar_url)

    ext = (file.filename or "img").rsplit(".", 1)[-1].lower()
    filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    save_path = os.path.join(AVATAR_DIR, filename)

    with open(save_path, "wb") as buf:
        buf.write(content)

    current_user.avatar_url = f"static/avatars/{filename}"
    db.commit()
    db.refresh(current_user)
    return _map_to_response(current_user)


# --- Utilities ---

def _calculate_completion(user: User) -> int:
    filled = sum(
        1 for field in _COMPLETION_FIELDS
        if getattr(user, field, None) and str(getattr(user, field)).strip()
    )
    return round((filled / len(_COMPLETION_FIELDS)) * 100)

def _map_to_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        id=user.id,
        profession=user.profession,
        completion_percentage=_calculate_completion(user),
        **{field: getattr(user, field) for field in _COMPLETION_FIELDS},
    )

def _validate_avatar(file: UploadFile, content: bytes) -> None:
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Formato no permitido. Usá PNG, JPG o GIF.",
        )
    if len(content) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="La imagen no puede superar los 2 MB.",
        )

def _delete_file_safely(path: str) -> None:
    clean = path.lstrip("/")
    if os.path.exists(clean):
        try:
            os.remove(clean)
        except OSError:
            pass