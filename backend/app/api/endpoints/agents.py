from fastapi import APIRouter
from app.services.mentor_agent import MentorAgent
from app.models.profile import UserProfile

router = APIRouter()
mentor = MentorAgent()

@router.post("/analyze")
async def analyze_profile(profile: UserProfile):
    guidance = await mentor.get_comprehensive_guidance(profile)
    return guidance
