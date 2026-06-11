from copy import deepcopy
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Optional

from pymongo import ASCENDING, MongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.core.config import settings

_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
    return _client


def get_users_collection():
    return get_client()[settings.DATABASE_NAME]["users"]


def get_analyses_collection():
    return get_client()[settings.DATABASE_NAME]["analyses"]


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _clean(document: Optional[dict]) -> Optional[dict]:
    if not document:
        return None
    cleaned = deepcopy(document)
    cleaned.pop("_id", None)
    return cleaned


def _hash_otp(email: str, code: str) -> str:
    return sha256(f"{email.lower()}:{code}:{settings.JWT_SECRET_KEY}".encode("utf-8")).hexdigest()


def init_db() -> None:
    users = get_users_collection()
    analyses = get_analyses_collection()
    users.create_index([("email", ASCENDING)], unique=True)
    analyses.create_index([("email", ASCENDING)], unique=True)


def ping() -> None:
    get_client().admin.command("ping")


def get_user(email: str) -> Optional[dict]:
    users = get_users_collection()
    return _clean(users.find_one({"email": email.lower()}))


def create_user(email: str, hashed_password: str, full_name: Optional[str] = None, is_verified: bool = False) -> dict:
    users = get_users_collection()
    normalized_email = email.lower()
    now = _utcnow()
    user = {
        "email": normalized_email,
        "full_name": full_name,
        "hashed_password": hashed_password,
        "auth_provider": "password",
        "providers": ["password"],
        "firebase_uid": None,
        "photo_url": None,
        "is_verified": is_verified,
        "created_at": now,
        "updated_at": now,
        "last_login_at": None,
        "verification": None,
    }

    try:
        users.insert_one(user)
    except DuplicateKeyError as exc:
        raise ValueError("exists") from exc
    except PyMongoError:
        raise

    return _clean(user)


def replace_unverified_user(email: str, hashed_password: str, full_name: str) -> dict:
    users = get_users_collection()
    normalized_email = email.lower()
    now = _utcnow()
    result = users.find_one_and_update(
        {"email": normalized_email, "is_verified": {"$ne": True}},
        {
            "$set": {
                "full_name": full_name,
                "hashed_password": hashed_password,
                "auth_provider": "password",
                "providers": ["password"],
                "updated_at": now,
            },
            "$setOnInsert": {
                "email": normalized_email,
                "is_verified": False,
                "created_at": now,
                "last_login_at": None,
                "verification": None,
                "firebase_uid": None,
                "photo_url": None,
            },
        },
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return _clean(result)


def upsert_firebase_user(email: str, firebase_uid: str, full_name: Optional[str], photo_url: Optional[str] = None) -> dict:
    users = get_users_collection()
    normalized_email = email.lower()
    now = _utcnow()
    result = users.find_one_and_update(
        {"email": normalized_email},
        {
            "$set": {
                "email": normalized_email,
                "firebase_uid": firebase_uid,
                "full_name": full_name,
                "photo_url": photo_url,
                "is_verified": True,
                "email_verified_at": now,
                "last_login_at": now,
                "updated_at": now,
            },
            "$setOnInsert": {
                "hashed_password": None,
                "auth_provider": "google",
                "created_at": now,
            },
            "$addToSet": {"providers": "google"},
            "$unset": {"verification": ""},
        },
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return _clean(result)


def mark_login(email: str) -> None:
    users = get_users_collection()
    users.update_one(
        {"email": email.lower()},
        {"$set": {"last_login_at": _utcnow(), "updated_at": _utcnow()}},
    )


def store_otp(email: str, code: str) -> None:
    users = get_users_collection()
    normalized_email = email.lower()
    users.update_one(
        {"email": normalized_email},
        {
            "$set": {
                "verification": {
                    "code_hash": _hash_otp(normalized_email, code),
                    "expires_at": _utcnow() + timedelta(minutes=10),
                    "sent_at": _utcnow(),
                    "attempts": 0,
                },
                "updated_at": _utcnow(),
            }
        },
    )


def verify_otp(email: str, code: str) -> bool:
    users = get_users_collection()
    normalized_email = email.lower()
    user = users.find_one({"email": normalized_email})
    verification = (user or {}).get("verification")
    if not verification:
        return False

    expires_at = verification.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if not expires_at or _utcnow() > expires_at:
        delete_otp(normalized_email)
        return False

    if verification.get("attempts", 0) >= 5:
        delete_otp(normalized_email)
        return False

    if verification.get("code_hash") != _hash_otp(normalized_email, code):
        users.update_one(
            {"email": normalized_email},
            {"$inc": {"verification.attempts": 1}, "$set": {"updated_at": _utcnow()}},
        )
        return False

    users.update_one(
        {"email": normalized_email},
        {
            "$set": {
                "is_verified": True,
                "email_verified_at": _utcnow(),
                "updated_at": _utcnow(),
            },
            "$unset": {"verification": ""},
        },
    )
    return True


def delete_otp(email: str) -> None:
    users = get_users_collection()
    users.update_one(
        {"email": email.lower()},
        {"$unset": {"verification": ""}, "$set": {"updated_at": _utcnow()}},
    )


def save_analysis(email: str, profile: dict, analysis: dict) -> dict:
    analyses = get_analyses_collection()
    normalized_email = email.lower()
    now = _utcnow()
    record = {
        "email": normalized_email,
        "profile": profile,
        "analysis": analysis,
        "updated_at": now,
    }
    analyses.update_one(
        {"email": normalized_email},
        {"$set": record, "$setOnInsert": {"created_at": now}},
        upsert=True,
    )
    return _clean(record)


def get_analysis(email: str) -> Optional[dict]:
    analyses = get_analyses_collection()
    return _clean(analyses.find_one({"email": email.lower()}))
