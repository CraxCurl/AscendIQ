import json
import google.generativeai as genai

from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_analysis(profile):
    prompt = f"""
Analyze this student profile and return ONLY valid JSON.

Profile:
{json.dumps(profile)}

Return:
{{
  "user_summary":"",
  "career_health_score":0,
  "strengths":[],
  "weaknesses":[],
  "roadmap":[]
}}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)