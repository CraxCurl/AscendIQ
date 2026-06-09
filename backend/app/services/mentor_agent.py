from app.services.agent_service import (
    SkillAssessmentAgent,
    CareerRoadmapAgent,
    OpportunityAgent,
    InterviewPrepAgent,
    ResumeEnhancementAgent
)
from app.models.profile import UserProfile
import json

class MentorAgent:
    def __init__(self):
        self.skill_agent = SkillAssessmentAgent()
        self.roadmap_agent = CareerRoadmapAgent()
        self.opportunity_agent = OpportunityAgent()
        self.interview_agent = InterviewPrepAgent()
        self.resume_agent = ResumeEnhancementAgent()

    async def get_comprehensive_guidance(self, profile: UserProfile):
        # 1. Skill Assessment
        assessment = await self.skill_agent.analyze(profile)

        # 2. Roadmap Generation
        roadmap = await self.roadmap_agent.generate_roadmap(profile, assessment)

        # 3. Opportunity Matching
        opportunities = await self.opportunity_agent.get_opportunities(profile)

        # 4. Resume Analysis
        resume_feedback = await self.resume_agent.enhance(profile)

        # 5. Interview Prep
        interview_prep = await self.interview_agent.get_prep_material(profile)

        # 6. Strategic Synthesis (The Mentor's core job)
        strategic_plan = self._synthesize(assessment, roadmap, opportunities, profile)

        return {
            "assessment": assessment.dict(),
            "roadmap": roadmap,
            "opportunities": opportunities,
            "resume_feedback": resume_feedback,
            "interview_prep": interview_prep,
            "strategic_plan": strategic_plan
        }

    def _synthesize(self, assessment, roadmap, opportunities, profile):
        # High level logic to prioritize actions
        top_opportunity = opportunities[0] if opportunities else "N/A"
        return {
            "highest_impact_steps": assessment.missing_skills[:3],
            "priority_level": "High",
            "estimated_score_improvement": 15,
            "summary": f"Your current health score is {assessment.health_score.total_score}. Focus on {assessment.missing_skills[0] if assessment.missing_skills else 'improving your projects'} to increase your readiness. We've matched you with a {top_opportunity['type'] if isinstance(top_opportunity, dict) else 'new opportunity'} at {top_opportunity['provider'] if isinstance(top_opportunity, dict) else 'Top Tech'}."
        }
