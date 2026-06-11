import json
import urllib.request
from functools import lru_cache
from typing import Any, Dict

import jwt

from app.core.config import settings

FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"


@lru_cache(maxsize=1)
def _firebase_certs() -> Dict[str, str]:
    with urllib.request.urlopen(FIREBASE_CERTS_URL, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    header = jwt.get_unverified_header(id_token)
    cert = _firebase_certs().get(header.get("kid"))
    if not cert:
        _firebase_certs.cache_clear()
        cert = _firebase_certs().get(header.get("kid"))

    if not cert:
        raise ValueError("Firebase signing certificate was not found.")

    return jwt.decode(
        id_token,
        cert,
        algorithms=["RS256"],
        audience=settings.FIREBASE_PROJECT_ID,
        issuer=f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}",
    )
