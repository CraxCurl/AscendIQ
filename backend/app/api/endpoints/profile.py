import asyncio
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.endpoints.auth import get_current_user
from app.models.profile import UserProfile
from app.services import storage
from app.services.gemini_analysis import generate_analysis, normalize_analysis

router = APIRouter()


def _parse_json_list(value: Optional[str]) -> List[str]:
    if not value:
        return []
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, list) else []
    except json.JSONDecodeError:
        return [item.strip() for item in value.split(",") if item.strip()]


async def _extract_resume_text(file: UploadFile) -> str:
    content = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".pdf") or file.content_type == "application/pdf":
        from io import BytesIO

        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="PDF parsing is not installed on the backend. Install pypdf or use the describe-yourself field.",
            ) from exc

        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if filename.endswith(".docx") or file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        from io import BytesIO

        try:
            from docx import Document
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="DOCX parsing is not installed on the backend. Install python-docx or use the describe-yourself field.",
            ) from exc

        document = Document(BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Please upload a PDF or DOCX resume.",
    )


@router.post("/upload")
async def upload_profile(profile: UserProfile):
    return {"status": "success", "user_id": profile.user_id}


@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):
    resume_text = await _extract_resume_text(file)
    return {"filename": file.filename, "characters": len(resume_text), "resume_text": resume_text[:4000]}


@router.post("/analyze-intake")
async def analyze_intake(
    full_name: str = Form(""),
    target_role: str = Form(...),
    about_yourself: str = Form(""),
    github_url: str = Form(""),
    linkedin_url: str = Form(""),
    skills: str = Form("[]"),
    resume: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    resume_text = ""
    if resume and resume.filename:
        resume_text = await _extract_resume_text(resume)

    if not resume_text.strip() and not about_yourself.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a resume or describe yourself so AscendIQ can build your analytics.",
        )

    profile = {
        "user_id": current_user["email"],
        "full_name": full_name.strip() or current_user["email"].split("@")[0],
        "email": current_user["email"],
        "target_role": target_role.strip(),
        "about_yourself": about_yourself.strip(),
        "resume_text": resume_text[:12000],
        "github_url": github_url.strip() or None,
        "linkedin_url": linkedin_url.strip() or None,
        "skills": _parse_json_list(skills),
        "projects": [],
        "certifications": [],
        "experience_level": "Student/Entry Level",
    }

    analysis = await asyncio.to_thread(generate_analysis, profile)
    record = storage.save_analysis(current_user["email"], profile, analysis)
    return {"status": "success", **record}


@router.get("/me/analysis")
async def get_my_analysis(current_user: dict = Depends(get_current_user)):
    record = storage.get_analysis(current_user["email"])
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile analysis is required before opening the dashboard.",
        )
    record["analysis"] = normalize_analysis(record.get("profile", {}), record.get("analysis", {}))
    return record
