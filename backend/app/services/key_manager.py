import random
from app.core.config import settings

class KeyManager:
    def __init__(self):
        # Collect all configured API keys
        all_keys = [
            settings.GEMINI_API_KEY,
            settings.PROFILE_AGENT_API_KEY,
            settings.SKILL_ROADMAP_AGENT_API_KEY,
            settings.RESUME_ATS_AGENT_API_KEY,
            settings.OPPORTUNITY_INTERVIEW_AGENT_API_KEY,
            settings.LEETCODE_AGENT_API_KEY,
            settings.MASTER_AGENT_API_KEY
        ]
        # Filter out empty or None keys
        self.keys = [k for k in all_keys if k and isinstance(k, str) and k.strip()]
        self._index = 0

    def get_next_key(self) -> str:
        """Returns the next available API key in a round-robin fashion."""
        if not self.keys:
            return ""
        
        key = self.keys[self._index]
        self._index = (self._index + 1) % len(self.keys)
        return key

    def get_random_key(self) -> str:
        """Returns a random available API key."""
        if not self.keys:
            return ""
        return random.choice(self.keys)

# Global instance
key_manager = KeyManager()
