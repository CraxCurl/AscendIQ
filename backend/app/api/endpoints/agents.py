import asyncio

from fastapi import APIRouter, Depends

from app.api.endpoints.auth import get_current_user
from app.models.profile import UserProfile
from app.services import storage
from app.services.gemini_analysis import generate_analysis

router = APIRouter()

@router.post("/analyze")
async def analyze_profile(profile: UserProfile, current_user: dict = Depends(get_current_user)):
    profile_data = profile.model_dump()
    profile_data["email"] = current_user["email"]
    profile_data["user_id"] = current_user["email"]
    analysis = await asyncio.to_thread(generate_analysis, profile_data)
    record = storage.save_analysis(current_user["email"], profile_data, analysis)
    return {"status": "success", **record}
