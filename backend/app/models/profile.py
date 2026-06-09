from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class Project(BaseModel):
    title: str
    description: str
    technologies: List[str]
    link: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: str
    year: Optional[int] = None

class UserProfile(BaseModel):
    user_id: str
    full_name: str
    email: str
    target_role: str
    resume_text: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    skills: List[str] = []
    projects: List[Project] = []
    certifications: List[Certification] = []
    experience_level: str = "Student/Entry Level"

class SkillMatrix(BaseModel):
    technical_skills: Dict[str, int]
    soft_skills: Dict[str, int]
    competency_breakdown: Dict[str, str]

class CareerHealthScore(BaseModel):
    total_score: int
    technical_skills: int
    project_quality: int
    resume_quality: int
    interview_readiness: int
    industry_exposure: int

class AssessmentResult(BaseModel):
    skill_matrix: SkillMatrix
    strengths: List[str]
    weaknesses: List[str]
    missing_skills: List[str]
    recommended_technologies: List[str]
    health_score: CareerHealthScore
