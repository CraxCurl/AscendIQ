import aiohttp
from typing import List, Dict, Any
from app.core.config import settings

PROXYCURL_BASE_URL = "https://nubela.co/proxycurl/api/v2/linkedin"

async def get_profile_data(linkedin_url: str) -> Dict[str, Any]:
    if not settings.PROXYCURL_API_KEY:
        return {}
    
    headers = {'Authorization': f'Bearer {settings.PROXYCURL_API_KEY}'}
    params = {'url': linkedin_url, 'skills': 'include'}
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(PROXYCURL_BASE_URL, headers=headers, params=params, timeout=30) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return {
                        "experiences": data.get("experiences", []),
                        "education": data.get("education", []),
                        "skills": data.get("skills", []),
                        "headline": data.get("headline", "")
                    }
                else:
                    return {}
        except Exception:
            return {}

# We could add a search endpoint here if needed, but for the beta we can also
# allow the user to provide a mentor's LinkedIn URL directly to map their path.
