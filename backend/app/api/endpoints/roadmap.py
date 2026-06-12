import json
import asyncio
import aiohttp
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File

from app.api.endpoints.auth import get_current_user
from app.services import storage
from app.api.endpoints.profile import _extract_resume_text
from app.services.gemini_analysis import call_agent
from app.services.key_manager import key_manager
from app.core.config import settings

router = APIRouter()

async def generate_mapped_career_path(user_profile: dict, mentor_resume_text: str) -> dict:
    prompt = f"""
    You are an expert career advisor.
    The user is currently starting their career: {json.dumps(user_profile, indent=2)}
    
    They admire a senior professional whose resume/experience is detailed here:
    
    {mentor_resume_text}
    
    Based on the mentor's actual career path, map out a recommended step-by-step career timeline for the user so they can reach a similar level.
    Return ONLY a valid JSON object matching this schema exactly:
    {{
      "mentor_headline": "Short professional headline based on their resume (e.g., Senior Software Engineer)",
      "timeline": [
        {{
          "step": 1,
          "role_title": "Entry Level Role",
          "duration": "1-2 years",
          "key_skills_to_acquire": ["Skill A", "Skill B"],
          "description": "What to focus on during this phase to mirror the mentor's early steps."
        }}
      ]
    }}
    """
    
    async with aiohttp.ClientSession() as session:
        api_key = key_manager.get_next_key()
        res = await call_agent(session, api_key, prompt, "career_path")
        return res.get("career_path", {"timeline": []})

@router.post("/career-path")
async def generate_career_path(mentor_resume: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    analysis = storage.get_analysis(current_user["email"])
    if not analysis or not analysis.get("profile"):
        raise HTTPException(status_code=404, detail="Profile not found. Please analyze your profile first.")
    
    user_profile = analysis["profile"]
    
    # 1. Parse mentor resume text
    try:
        mentor_resume_text = await _extract_resume_text(mentor_resume)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    if not mentor_resume_text or len(mentor_resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract enough text from the provided resume. Please try another file.")
        
    # 2. Analyze with Gemini
    career_path_plan = await generate_mapped_career_path(user_profile, mentor_resume_text)
    
    return career_path_plan

from pydantic import BaseModel

class ExploreMilestoneRequest(BaseModel):
    title: str
    description: str

class UpdateRoadmapRequest(BaseModel):
    roadmap: list

@router.post("/explore-milestone")
async def explore_milestone(request: ExploreMilestoneRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""
    You are an expert career coach. The user is currently focusing on this specific milestone in their career roadmap:
    Title: {request.title}
    Description: {request.description}
    
    Provide a short, highly actionable guide on exactly how the user should start and what they should do to complete this milestone. Include 3-4 specific steps and a list of 2-3 suitable learning resources or links (like YouTube searches, specific documentation, or platforms).
    
    Return ONLY a valid JSON object matching this schema exactly:
    {{
      "overview": "A brief 2-sentence encouraging overview of what this milestone entails.",
      "action_steps": ["Step 1...", "Step 2...", "Step 3..."],
      "resources": [
        {{"title": "Resource Name", "url": "https://..."}}
      ]
    }}
    """
    
    async with aiohttp.ClientSession() as session:
        api_key = key_manager.get_next_key()
        res = await call_agent(session, api_key, prompt, "exploration")
        return res.get("exploration", {
            "overview": "Focus on the core concepts mentioned in the milestone.",
            "action_steps": ["Search for tutorials online.", "Practice the concepts.", "Build a small project."],
            "resources": []
        })

@router.put("/update-roadmap")
async def update_roadmap(request: UpdateRoadmapRequest, current_user: dict = Depends(get_current_user)):
    analysis = storage.get_analysis(current_user["email"])
    if not analysis or not analysis.get("analysis"):
        raise HTTPException(status_code=404, detail="Analysis not found.")
    
    # Update the roadmap array in the stored analysis
    analysis["analysis"]["roadmap"] = request.roadmap
    storage.save_analysis(current_user["email"], analysis.get("profile", {}), analysis["analysis"])
    
    return {"status": "success", "roadmap": request.roadmap}

@router.get("/")
async def get_roadmap():
    return {"roadmap": []}
