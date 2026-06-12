import json
import io
import aiohttp
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.api.endpoints.auth import get_current_user
from app.services.key_manager import key_manager
from app.core.config import settings

try:
    from docx import Document
except ImportError:
    Document = None

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    current_resume_text: str
    target_role: Optional[str] = "Software Engineer"
    missing_keywords: Optional[list[str]] = []

class GenerateDocxRequest(BaseModel):
    resume_text: str

async def call_gemini_chat(api_key: str, prompt: str) -> str:
    if not api_key:
        api_key = key_manager.get_next_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, json=payload, timeout=30) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if text.startswith("```json"):
                        text = text.replace("```json", "").replace("```", "").strip()
                    return text
                else:
                    error_text = await resp.text()
                    raise HTTPException(status_code=500, detail=f"Gemini API Error: {error_text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def resume_chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""
You are an expert ATS-focused Resume Builder AI. The user wants to update their resume.
Current Resume Text:
```
{request.current_resume_text}
```

Target Role: {request.target_role}
Missing Keywords they should include: {', '.join(request.missing_keywords)}

User Request: {request.message}

Please apply the user's request to the resume text. Improve phrasing, ensure strong action verbs, and try to naturally incorporate any missing keywords if relevant to the user's request. 

Respond with ONLY a JSON object in the following format. Do not use markdown blocks outside the JSON:
{{
  "response_message": "A brief, encouraging message to the user explaining what you updated.",
  "updated_resume_text": "The full, complete updated resume text, ready to be put into a DOCX file."
}}
"""
    result_text = await call_gemini_chat(key_manager.get_next_key(), prompt)
    
    try:
        result_json = json.loads(result_text)
        return result_json
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")

@router.post("/generate-docx")
async def generate_docx(request: GenerateDocxRequest, current_user: dict = Depends(get_current_user)):
    if Document is None:
        raise HTTPException(status_code=500, detail="python-docx library is not installed.")

    document = Document()
    
    # Simple formatting: assume paragraphs are separated by double newlines or single newlines
    paragraphs = request.resume_text.split('\n')
    for p in paragraphs:
        if p.strip():
            document.add_paragraph(p.strip())
            
    file_stream = io.BytesIO()
    document.save(file_stream)
    file_stream.seek(0)
    
    return StreamingResponse(
        file_stream, 
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f"attachment; filename=Optimized_Resume.docx"
        }
    )
