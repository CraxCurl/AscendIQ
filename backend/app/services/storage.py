import json
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any, Dict, Optional

DATA_DIR = Path(__file__).resolve().parents[2] / "storage"
DATA_FILE = DATA_DIR / "ascendiq_data.json"
_lock = Lock()


def _empty_store() -> Dict[str, Any]:
    return {"users": {}, "analyses": {}}


def _load() -> Dict[str, Any]:
    if not DATA_FILE.exists():
        return _empty_store()

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return _empty_store()

    data.setdefault("users", {})
    data.setdefault("analyses", {})
    return data


def _save(data: Dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)


def get_user(email: str) -> Optional[dict]:
    with _lock:
        return deepcopy(_load()["users"].get(email.lower()))


def create_user(email: str, hashed_password: str) -> dict:
    normalized_email = email.lower()
    with _lock:
        data = _load()
        if normalized_email in data["users"]:
            raise ValueError("exists")

        user = {
            "email": normalized_email,
            "hashed_password": hashed_password,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        data["users"][normalized_email] = user
        _save(data)
        return deepcopy(user)


def save_analysis(email: str, profile: dict, analysis: dict) -> dict:
    normalized_email = email.lower()
    record = {
        "profile": profile,
        "analysis": analysis,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    with _lock:
        data = _load()
        data["analyses"][normalized_email] = record
        _save(data)
        return deepcopy(record)


def get_analysis(email: str) -> Optional[dict]:
    with _lock:
        return deepcopy(_load()["analyses"].get(email.lower()))
