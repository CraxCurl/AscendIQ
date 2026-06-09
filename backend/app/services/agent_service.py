import google.generativeai as genai
import json
from app.core.config import settings
from app.models.profile import UserProfile, AssessmentResult

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

class SkillAssessmentAgent:
    async def analyze(self, profile: UserProfile) -> AssessmentResult:
        prompt = f"""
        Analyze the following career profile for the target role: {profile.target_role}.
        Profile Data:
        Skills: {profile.skills}
        Projects: {profile.projects}
        Certifications: {profile.certifications}
        Resume Content: {profile.resume_text[:2000] if profile.resume_text else "N/A"}

        Generate a comprehensive skill assessment in JSON format with the following structure:
        {{
            "skill_matrix": {{
                "technical_skills": {{"skill_name": rating_0_10}},
                "soft_skills": {{"skill_name": rating_0_10}},
                "competency_breakdown": {{"area": "description"}}
            }},
            "strengths": [],
            "weaknesses": [],
            "missing_skills": [],
            "recommended_technologies": [],
            "health_score": {{
                "total_score": 0-100,
                "technical_skills": 0-100,
                "project_quality": 0-100,
                "resume_quality": 0-100,
                "interview_readiness": 0-100,
                "industry_exposure": 0-100
            }}
        }}
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(json_str)
        return AssessmentResult(**data)

class CareerRoadmapAgent:
    async def generate_roadmap(self, profile: UserProfile, assessment: AssessmentResult):
        prompt = f"""
        Generate a personalized career roadmap for {profile.target_role} based on these assessments:
        Strengths: {assessment.strengths}
        Weaknesses: {assessment.weaknesses}
        Missing Skills: {assessment.missing_skills}

        Return a JSON object with:
        {{
            "milestones": [{{ "title": "", "description": "", "duration": "" }}],
            "weekly_objectives": [],
            "monthly_goals": [],
            "recommended_courses": [],
            "project_ideas": [],
            "growth_plan": {{
                "30_days": "",
                "90_days": "",
                "6_months": "",
                "1_year": ""
            }}
        }}
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(json_str)

class OpportunityAgent:
    async def get_opportunities(self, profile: UserProfile):
        prompt = f"""
        Recommend 5 relevant opportunities (internships, hackathons, open source) for a {profile.target_role} with these skills: {profile.skills}.
        Return a JSON list of objects:
        {{
            "title": "",
            "type": "Internship|Hackathon|OS Program",
            "provider": "",
            "match_score": 0-100,
            "link": ""
        }}
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(json_str)

class InterviewPrepAgent:
    async def get_prep_material(self, profile: UserProfile):
        prompt = f"""
        Generate interview preparation material for {profile.target_role}.
        Include: 3 Technical Qs, 2 HR Qs, 1 Coding Challenge.
        Return JSON structure:
        {{
            "technical_questions": [{{ "question": "", "model_answer": "" }}],
            "hr_questions": [{{ "question": "", "model_answer": "" }}],
            "coding_challenge": {{ "title": "", "description": "", "solution_hint": "" }},
            "readiness_score": 0-100
        }}
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(json_str)

class ResumeEnhancementAgent:
    async def enhance(self, profile: UserProfile):
        prompt = f"""
        Perform ATS analysis on this resume for {profile.target_role}: {profile.resume_text[:2000]}.
        Identify missing keywords and suggest improvements.
        Return JSON structure:
        {{
            "ats_score": 0-100,
            "missing_keywords": [],
            "bullet_point_improvements": [{{ "original": "", "improved": "" }}],
            "structural_suggestions": []
        }}
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(json_str)
