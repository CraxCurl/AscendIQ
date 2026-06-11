import json
import asyncio
import aiohttp
from app.core.config import settings

# --- Fallback and Normalization Logic (Kept Intact) ---
ROLE_BASELINES = {
    "ai": ["Python", "Machine Learning", "Deep Learning", "Data Science", "TensorFlow", "PyTorch", "NLP"],
    "ml": ["Python", "Machine Learning", "Deep Learning", "Data Science", "TensorFlow", "PyTorch", "NLP"],
    "data": ["Python", "SQL", "Data Analysis", "Statistics", "Visualization", "Machine Learning"],
    "web": ["HTML", "CSS", "JavaScript", "React", "Node.js", "APIs", "Git"],
    "software": ["Data Structures", "Algorithms", "Python", "Java", "Git", "System Design"],
}

def _clamp_score(value, default=0):
    try:
        return max(0, min(100, int(round(float(value)))))
    except (TypeError, ValueError):
        return default

def _score_or_default(value, default):
    score = _clamp_score(value, default)
    return default if score == 0 and default > 0 else score

def _as_list(value):
    if isinstance(value, list):
        return [item for item in value if item not in (None, "")]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []

def _profile_text(profile):
    return " ".join(
        str(profile.get(key, "") or "")
        for key in ("about_yourself", "resume_text", "target_role")
    ).lower()

def _role_skills(target_role):
    role = (target_role or "").lower()
    for keyword, skills in ROLE_BASELINES.items():
        if keyword in role:
            return skills
    return ["Communication", "Projects", "Problem Solving", "Git", "Domain Knowledge"]

def _skill_score(skill, profile):
    haystack = _profile_text(profile)
    listed_skills = " ".join(profile.get("skills") or []).lower()
    needle = skill.lower()
    if needle in haystack or needle in listed_skills:
        return 75
    related_terms = {
        "machine learning": ["ml", "artificial intelligence"],
        "deep learning": ["neural", "tensorflow", "pytorch"],
        "data science": ["data", "pandas", "numpy"],
        "javascript": ["js", "react", "node"],
        "communication": ["club", "hackathon", "presentation"],
    }.get(needle, [])
    return 60 if any(term in haystack for term in related_terms) else 25

def _fallback_analysis(profile, raw=None):
    raw = raw or {}
    target_role = profile.get("target_role") or "your target role"
    role_skills = _role_skills(target_role)
    skill_gaps = [
        {"skill": skill, "current": _skill_score(skill, profile), "target": 85}
        for skill in role_skills[:6]
    ]

    text = _profile_text(profile)
    skills_count = len(profile.get("skills") or [])
    project_signal = 65 if any(word in text for word in ("project", "app", "tracker", "application")) else 35
    certification_signal = 70 if any(word in text for word in ("certificate", "certification", "google", "ibm")) else 30
    hackathon_signal = 70 if "hackathon" in text else 25
    resume_signal = 65 if profile.get("resume_text") else 45
    skill_signal = min(85, 35 + skills_count * 8 + sum(1 for gap in skill_gaps if gap["current"] >= 60) * 5)

    ats_score = _clamp_score((resume_signal + skill_signal + project_signal) / 3)
    interview_readiness = _clamp_score((skill_signal + project_signal + hackathon_signal) / 3)
    career_health = _clamp_score((ats_score + interview_readiness + certification_signal) / 3)
    completed = sum(1 for gap in skill_gaps if gap["current"] >= gap["target"] - 10)
    roadmap_progress = _clamp_score((completed / max(len(skill_gaps), 1)) * 100)

    missing_keywords = [gap["skill"] for gap in skill_gaps if gap["current"] < 70][:5]
    roadmap = [
        {
            "title": "Strengthen role fundamentals",
            "status": "current",
            "date": "Days 1-15",
            "description": f"Close the biggest gaps for {target_role}: {', '.join(missing_keywords[:3]) or 'core role skills'}.",
        },
        {
            "title": "Build one proof-heavy project",
            "status": "upcoming",
            "date": "Days 16-35",
            "description": "Create a deployable project with a README, metrics, and clear technical decisions.",
        },
        {
            "title": "Optimize resume and portfolio",
            "status": "upcoming",
            "date": "Days 36-50",
            "description": "Add role keywords, measurable outcomes, GitHub links, and concise project impact bullets.",
        },
        {
            "title": "Apply to targeted opportunities",
            "status": "upcoming",
            "date": "Days 51-70",
            "description": "Apply to internships, hackathons, and open-source programs aligned with your strongest skills.",
        },
        {
            "title": "Run mock interviews",
            "status": "upcoming",
            "date": "Days 71-90",
            "description": "Practice technical explanations, coding rounds, and behavioral stories from your projects.",
        },
    ]

    return {
        "user_summary": raw.get("user_summary")
        or f"{profile.get('full_name') or 'This learner'} is preparing for {target_role} with visible signals across skills, projects, and career exploration.",
        "radar": [
            {"subject": "Technical", "score": skill_signal},
            {"subject": "Projects", "score": project_signal},
            {"subject": "Resume", "score": ats_score},
            {"subject": "Interview", "score": interview_readiness},
            {"subject": "Exposure", "score": max(certification_signal, hackathon_signal)},
        ],
        "skill_gaps": skill_gaps,
        "stats": {
            "career_health_score": career_health,
            "roadmap_progress": roadmap_progress,
            "ats_score": ats_score,
            "interview_readiness": interview_readiness,
        },
        "priorities": [
            f"Add proof for {missing_keywords[0] if missing_keywords else role_skills[0]} through a small project or case study.",
            "Rewrite resume bullets to include outcomes, tools, and measurable impact.",
            "Practice explaining one project end-to-end for interviews.",
        ],
        "strategic_plan": [
            {
                "title": "Close the highest-value skill gap",
                "description": f"Focus first on {missing_keywords[0] if missing_keywords else role_skills[0]} because it appears frequently in {target_role} roles.",
                "impact": "High",
            },
            {
                "title": "Turn projects into evidence",
                "description": "Document problem, approach, stack, tradeoffs, and result for each project.",
                "impact": "High",
            },
            {
                "title": "Sharpen application readiness",
                "description": "Align resume keywords, portfolio links, and interview stories before applying broadly.",
                "impact": "Medium",
            },
        ],
        "signals": {
            "best_opportunity_match": f"Entry-level {target_role} internships and hackathons",
            "resume_blocker": missing_keywords[0] if missing_keywords else "Add measurable project outcomes",
            "interview_focus": "Project walkthroughs and fundamentals",
            "next_milestone": roadmap[0]["title"],
            "risk": "Skill claims need stronger proof if projects are not documented.",
        },
        "roadmap": roadmap,
        "opportunities": [
            {"title": f"{target_role} Internship", "type": "Internship", "provider": "Early-career teams", "match": career_health, "focus": "Role-aligned experience"},
            {"title": "Student Hackathon", "type": "Hackathon", "provider": "University and online communities", "match": max(60, hackathon_signal), "focus": "Project proof"},
            {"title": "Open Source Starter Issues", "type": "Open Source", "provider": "GitHub", "match": max(55, skill_signal), "focus": "Collaboration"},
        ],
        "resume_feedback": {
            "ats_score": ats_score,
            "keyword_coverage": _clamp_score(100 - len(missing_keywords) * 10),
            "project_proof": project_signal,
            "missing_keywords": missing_keywords,
            "suggestions": [
                "Add target-role keywords naturally in skills and project bullets.",
                "Quantify project outcomes where possible.",
                "Keep each project bullet focused on action, tool, and result.",
            ],
        },
        "interview_prep": {
            "ml_fundamentals": skill_signal,
            "coding_readiness": _clamp_score((skill_signal + project_signal) / 2),
            "story_bank": project_signal,
            "questions": [
                {"type": "Technical", "prompt": f"Explain a core {target_role} concept you used in a project."},
                {"type": "Project", "prompt": "Walk through your strongest project from problem to result."},
                {"type": "Behavioral", "prompt": "Tell me about a time you learned a new tool quickly."},
            ],
        },
    }

def normalize_analysis(profile, analysis):
    normalized = _fallback_analysis(profile, analysis if isinstance(analysis, dict) else {})
    if not isinstance(analysis, dict):
        return normalized
    for key in ("user_summary", "priorities"):
        if analysis.get(key):
            normalized[key] = analysis[key]
    if isinstance(analysis.get("stats"), dict):
        normalized["stats"].update({
            key: _score_or_default(analysis["stats"].get(key), value)
            for key, value in normalized["stats"].items()
        })
    elif analysis.get("career_health_score"):
        normalized["stats"]["career_health_score"] = _clamp_score(analysis.get("career_health_score"))
    if _as_list(analysis.get("radar")) and any(_clamp_score(item.get("score")) > 0 for item in analysis["radar"] if isinstance(item, dict)):
        normalized["radar"] = analysis["radar"]
    if _as_list(analysis.get("skill_gaps")) and any(_clamp_score(item.get("current")) > 0 for item in analysis["skill_gaps"] if isinstance(item, dict)):
        normalized["skill_gaps"] = analysis["skill_gaps"]
    for key in ("strategic_plan", "opportunities"):
        if _as_list(analysis.get(key)):
            normalized[key] = analysis[key]
    if isinstance(analysis.get("signals"), dict):
        normalized["signals"].update({key: value for key, value in analysis["signals"].items() if value})
    if isinstance(analysis.get("resume_feedback"), dict):
        normalized["resume_feedback"].update({key: value for key, value in analysis["resume_feedback"].items() if value not in (None, "")})
        for key in ("ats_score", "keyword_coverage", "project_proof"):
            normalized["resume_feedback"][key] = _score_or_default(
                analysis["resume_feedback"].get(key),
                normalized["resume_feedback"][key],
            )
    if isinstance(analysis.get("interview_prep"), dict):
        normalized["interview_prep"].update({key: value for key, value in analysis["interview_prep"].items() if value not in (None, "")})
        for key in ("ml_fundamentals", "coding_readiness", "story_bank"):
            normalized["interview_prep"][key] = _score_or_default(
                analysis["interview_prep"].get(key),
                normalized["interview_prep"][key],
            )
    roadmap = _as_list(analysis.get("roadmap"))
    if roadmap:
        normalized_roadmap = [
            {
                "title": item.get("title") or item.get("milestone") or f"Milestone {index + 1}",
                "status": item.get("status") or ("current" if index == 0 else "upcoming"),
                "date": item.get("date") or item.get("duration") or f"Phase {index + 1}",
                "description": item.get("description") or item.get("details") or "Complete this milestone to improve role readiness.",
            }
            for index, item in enumerate(roadmap)
            if isinstance(item, dict) and (item.get("title") or item.get("milestone") or item.get("description") or item.get("details"))
        ]
        normalized["roadmap"] = normalized_roadmap or normalized["roadmap"]
    return normalized

# --- Parallel Agent Logic ---

async def call_agent(session, api_key, prompt, label):
    if not api_key:
        api_key = settings.GEMINI_API_KEY # Fallback if specific key is missing
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
    }
    try:
        async with session.post(url, json=payload, timeout=30) as resp:
            if resp.status == 200:
                data = await resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if text.startswith("```json"):
                    text = text.replace("```json", "").replace("```", "").strip()
                return {label: json.loads(text)}
            else:
                return {label: {}}
    except Exception:
        return {label: {}}

async def generate_analysis(profile):
    profile_json = json.dumps(profile)
    
    # Define specialized prompts for the 5 agents
    prompt_resume = f"""
Analyze this profile specifically for Resume & ATS matching. Return ONLY valid JSON:
Profile: {profile_json}
{{
  "resume_feedback": {{"ats_score": 0, "keyword_coverage": 0, "project_proof": 0, "missing_keywords": [], "suggestions": []}},
  "user_summary": "Short 1-sentence professional summary"
}}
"""
    prompt_skills = f"""
Analyze this profile for Technical Skills & Leetcode Readiness. Return ONLY valid JSON:
Profile: {profile_json}
{{
  "radar": [{{"subject": "Technical", "score": 0}}, {{"subject": "Projects", "score": 0}}, {{"subject": "Resume", "score": 0}}, {{"subject": "Interview", "score": 0}}, {{"subject": "Exposure", "score": 0}}],
  "skill_gaps": [{{"skill": "", "current": 0, "target": 85}}],
  "stats": {{"interview_readiness": 0}}
}}
"""
    prompt_roadmap = f"""
Analyze this profile and generate a Career Roadmap & Priorities.
IMPORTANT: Write detailed 2-3 sentence paragraphs for every description and priority. Do not use short bullet points.
Return ONLY valid JSON:
Profile: {profile_json}
{{
  "roadmap": [{{"title": "", "status": "current", "date": "Days 1-15", "description": "Detailed 2-3 sentence paragraph..."}}],
  "strategic_plan": [{{"title": "", "description": "Detailed 2-3 sentence paragraph...", "impact": "High"}}],
  "priorities": ["Detailed 2-3 sentence paragraph priority 1", "Detailed 2-3 sentence paragraph priority 2"],
  "stats": {{"roadmap_progress": 0, "career_health_score": 0}}
}}
"""
    prompt_opportunities = f"""
Analyze this profile and suggest relevant Opportunities (Internships, Hackathons, Open Source).
IMPORTANT: For the 'signals' section, write a detailed, 2-3 sentence paragraph for each signal. Do not use short bullet points.
Return ONLY valid JSON:
Profile: {profile_json}
{{
  "opportunities": [{{"title": "", "type": "", "provider": "", "match": 0, "focus": "", "link": ""}}],
  "signals": {{"best_opportunity_match": "Detailed 2-3 sentence paragraph...", "resume_blocker": "Detailed 2-3 sentence paragraph...", "next_milestone": "Detailed 2-3 sentence paragraph...", "risk": "Detailed 2-3 sentence paragraph..."}}
}}
"""
    prompt_interview = f"""
Analyze this profile and generate tailored Interview Prep material.
IMPORTANT: For the 'signals' section, write a detailed, 2-3 sentence paragraph for the signal. Do not use short bullet points.
Return ONLY valid JSON:
Profile: {profile_json}
{{
  "interview_prep": {{"ml_fundamentals": 0, "coding_readiness": 0, "story_bank": 0, "questions": [{{"type": "Technical", "prompt": ""}}]}},
  "signals": {{"interview_focus": "Detailed 2-3 sentence paragraph..."}}
}}
"""

    async with aiohttp.ClientSession() as session:
        # Fire off all 5 API calls concurrently
        tasks = [
            call_agent(session, settings.PROFILE_AGENT_API_KEY, prompt_resume, "resume"),
            call_agent(session, settings.LEETCODE_AGENT_API_KEY, prompt_skills, "skills"),
            call_agent(session, settings.SKILL_ROADMAP_AGENT_API_KEY, prompt_roadmap, "roadmap"),
            call_agent(session, settings.OPPORTUNITY_INTERVIEW_AGENT_API_KEY, prompt_opportunities, "opportunities"),
            call_agent(session, settings.RESUME_ATS_AGENT_API_KEY, prompt_interview, "interview")
        ]
        
        results = await asyncio.gather(*tasks)
        
        # Combine the results into a single context block
        combined_context = {}
        for res in results:
            combined_context.update(res)

        # Master Agent Prompt to synthesize the final JSON structure using the combined context
        prompt_master = f"""
Synthesize the following sub-analysis JSONs into one perfectly structured final JSON profile analysis.
Do not hallucinate new data; just merge and format these results:
Sub-analysis pieces: {json.dumps(combined_context)}

Return this exact JSON shape. Do not leave numeric fields at 0 unless there is no evidence:
{{
  "user_summary":"",
  "radar":[{{"subject":"Technical","score":0}},{{"subject":"Projects","score":0}},{{"subject":"Resume","score":0}},{{"subject":"Interview","score":0}},{{"subject":"Exposure","score":0}}],
  "skill_gaps":[{{"skill":"","current":0,"target":85}}],
  "stats":{{"career_health_score":0,"roadmap_progress":0,"ats_score":0,"interview_readiness":0}},
  "priorities":[],
  "strategic_plan":[{{"title":"","description":"","impact":"High"}}],
  "signals":{{"best_opportunity_match":"","resume_blocker":"","interview_focus":"","next_milestone":"","risk":""}},
  "roadmap":[{{"title":"","status":"current|upcoming|completed","date":"Days 1-15","description":""}}],
  "opportunities":[{{"title":"","type":"","provider":"","match":0,"focus":"","link":""}}],
  "resume_feedback":{{"ats_score":0,"keyword_coverage":0,"project_proof":0,"missing_keywords":[],"suggestions":[]}},
  "interview_prep":{{"ml_fundamentals":0,"coding_readiness":0,"story_bank":0,"questions":[{{"type":"","prompt":""}}]}}
}}
"""
        master_key = settings.MASTER_AGENT_API_KEY or settings.GEMINI_API_KEY
        master_res = await call_agent(session, master_key, prompt_master, "final")
        
        analysis = master_res.get("final", {})

    return normalize_analysis(profile, analysis)
