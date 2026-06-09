from fastapi import APIRouter, UploadFile, File
from app.models.profile import UserProfile

router = APIRouter()

@router.post("/upload")
async def upload_profile(profile: UserProfile):
    return {"status": "success", "user_id": profile.user_id}

@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):
    return {"filename": file.filename}
