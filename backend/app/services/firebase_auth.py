from typing import Any, Dict

import firebase_admin
from firebase_admin import auth, credentials

from app.core.config import settings

# Initialize Firebase Admin app if it hasn't been initialized
if not firebase_admin._apps:
    if settings.FIREBASE_SERVICE_ACCOUNT_PATH:
        cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, options={"projectId": settings.FIREBASE_PROJECT_ID})
    else:
        # Initialize without credentials but with the project ID to allow token verification
        firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token.
    Returns the decoded token claims if valid.
    """
    return auth.verify_id_token(id_token)
