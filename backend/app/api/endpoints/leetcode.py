import json
import os
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.endpoints.auth import get_current_user
from app.services import storage

router = APIRouter()

LEETCODE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "leetcode_problems.json")
_leetcode_data = None

def get_leetcode_data():
    global _leetcode_data
    if _leetcode_data is None:
        try:
            with open(LEETCODE_FILE, "r", encoding="utf-8") as f:
                _leetcode_data = json.load(f)
        except Exception:
            _leetcode_data = []
    return _leetcode_data

class SolveRequest(BaseModel):
    problem_id: str

@router.get("/recommendations")
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    analysis = storage.get_analysis(current_user["email"])
    if not analysis or not analysis.get("profile"):
        raise HTTPException(status_code=404, detail="Profile not found. Please analyze your profile first.")
    
    profile = analysis["profile"]
    skills = [s.lower() for s in profile.get("skills", [])]
    target_role = profile.get("target_role", "").lower()
    
    problems = get_leetcode_data()
    
    # Recommendation logic: match skills with topics
    recommended = []
    for p in problems:
        topics = str(p.get("Topics", "")).lower()
        
        # Base topics to always include for fundamental practice
        is_fundamental = "arrays" in topics or "strings" in topics or "hash table" in topics
        
        if any(skill in topics for skill in skills) or is_fundamental or target_role in topics:
            recommended.append(p)
            if len(recommended) >= 20: # Return top 20 questions
                break
                
    # Fallback if no matches
    if not recommended and problems:
        recommended = problems[:20]
        
    solved = storage.get_solved_leetcode(current_user["email"])
    
    return {
        "recommended": recommended,
        "solved": solved
    }

@router.post("/solve")
async def mark_solved(request: SolveRequest, current_user: dict = Depends(get_current_user)):
    # Assuming problem_id is stringified
    storage.mark_leetcode_solved(current_user["email"], str(request.problem_id))
    return {"status": "success", "problem_id": request.problem_id}

@router.get("/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    solved = storage.get_solved_leetcode(current_user["email"])
    return {"solved": solved}
