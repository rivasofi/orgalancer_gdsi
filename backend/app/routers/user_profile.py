import os
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/users", tags=["users"])

AVATAR_DIR = "static/avatars"
ALLOWED_MIME = {"image/jpeg", "image/png", "image/gif"}
MAX_BYTES = 2 * 1024 * 1024
_PROFILE_FIELDS = (
    "full_name", "email", "avatar_url", "phone", 
    "country", "specialty", "years_of_experience",
)

os.makedirs(AVATAR_DIR, exist_ok=True)


# --- Routes ---

@router.get("/me/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = _get_user_or_404(db, user_id)
    return _map_to_response(user)


@router.put("/profile/{user_id}", response_model=ProfileResponse)
async def update_profile(user_id: str, data: ProfileUpdate, db: Session = Depends(get_db)):
    user = _get_user_or_404(db, user_id)
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return _map_to_response(user)


@router.post("/avatar/{user_id}", response_model=ProfileResponse)
async def upload_avatar(user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = _get_user_or_404(db, user_id)
    content = await file.read()
    
    _validate_file(file, content)

    if user.avatar_url:
        _delete_file_safely(user.avatar_url)

    extension = (file.filename or "img").rsplit(".", 1)[-1].lower()
    filename = f"{user_id}_{uuid.uuid4().hex[:8]}.{extension}"
    save_path = os.path.join(AVATAR_DIR, filename)

    with open(save_path, "wb") as buffer:
        buffer.write(content)

    user.avatar_url = f"static/avatars/{filename}"
    db.commit()
    db.refresh(user)
    return _map_to_response(user)


# --- Utilities ---

def _get_user_or_404(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

def _calculate_completion(user: User) -> int:
    filled = sum(
        1 for field in _PROFILE_FIELDS 
        if getattr(user, field, None) and str(getattr(user, field)).strip()
    )
    return round((filled / len(_PROFILE_FIELDS)) * 100)

def _map_to_response(user: User) -> ProfileResponse:
    data = {field: getattr(user, field) for field in _PROFILE_FIELDS}
    return ProfileResponse(
        id=user.id,
        profession=user.profession,
        completion_percentage=_calculate_completion(user),
        **data
    )

def _validate_file(file: UploadFile, content: bytes):
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato no permitido. Usá PNG, JPG o GIF."
        )
    if len(content) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La imagen no puede superar los 2 MB."
        )

def _delete_file_safely(path: str):
    clean_path = path.lstrip("/")
    if os.path.exists(clean_path):
        try:
            os.remove(clean_path)
        except OSError:
            pass