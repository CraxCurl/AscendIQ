import aiohttp
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List

from app.api.endpoints.auth import get_current_user
from app.services import storage
from app.core.config import settings

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' or 'bot'
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/chat")
async def interview_chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    record = storage.get_analysis(current_user["email"])
    if not record or "analysis" not in record:
        raise HTTPException(status_code=400, detail="Profile analysis is required to use the interview bot.")
    
    profile = record.get("profile", {})
    analysis = record.get("analysis", {})
    
    target_role = profile.get("target_role", "a tech role")
    user_summary = analysis.get("user_summary", "")
    interview_prep = analysis.get("interview_prep", {})
    
    questions = interview_prep.get("questions", [])
    questions_text = "\n".join([f"- {q.get('type', 'Question')}: {q.get('prompt', '')}" for q in questions])
    
    system_prompt = f"""
    You are an expert technical interview coach for AscendIQ. You are conducting a mock interview with a candidate for a {target_role} position.
    
    Candidate Summary: {user_summary}
    
    Here are the suggested practice questions based on their profile. You can use these or invent your own:
    {questions_text}
    
    Roleplay as the interviewer. Keep your responses concise, conversational, and constructive. 
    Ask questions one at a time. If the user asks for feedback, provide helpful critique on their last answer.
    Never break character.
    """
    
    gemini_contents = []
    for msg in request.messages:
        role = "model" if msg.role == "bot" else "user"
        gemini_contents.append({"role": role, "parts": [{"text": msg.content}]})

    # If messages are empty, the user might just be connecting. We can have the bot send the first message.
    if not gemini_contents:
        gemini_contents.append({"role": "user", "parts": [{"text": "Hi, I'm ready to start the interview."}]})

    payload = {
        "contents": gemini_contents,
        "systemInstruction": {
            "role": "user",
            "parts": [{"text": system_prompt}]
        },
        "generationConfig": {
            "temperature": 0.7,
        }
    }

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload, timeout=30) as resp:
            if resp.status != 200:
                error_text = await resp.text()
                print("Gemini API Error:", error_text)
                raise HTTPException(status_code=502, detail="Failed to communicate with AI service.")
            
            data = await resp.json()
            try:
                reply = data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError):
                reply = "I'm sorry, I couldn't process that response."
                
            return {"reply": reply}
