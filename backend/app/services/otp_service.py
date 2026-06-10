import random
import resend
from datetime import datetime, timezone, timedelta
from app.core.config import settings
from app.services import storage

# Configure Resend
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

def generate_code() -> str:
    return f"{random.randint(100000, 999999)}"

def store_otp(email: str, code: str) -> None:
    storage.store_otp(email, code)

def get_otp(email: str) -> dict | None:
    return storage.get_otp(email)

def delete_otp(email: str) -> None:
    storage.delete_otp(email)

def send_otp_email(email: str, code: str) -> None:
    if not settings.RESEND_API_KEY:
        print(f"WARNING: No RESEND_API_KEY set. OTP for {email} is {code}")
        return

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 10px;">
        <h1 style="color: #fff; text-align: center; margin-bottom: 30px;">AscendIQ</h1>
        <div style="background-color: #111; padding: 30px; border-radius: 8px; border: 1px solid #333; text-align: center;">
            <p style="color: #aaa; font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
            <h2 style="color: #fff; font-size: 36px; letter-spacing: 5px; margin: 0; padding: 15px; background: #222; border-radius: 6px; display: inline-block;">{code}</h2>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This code will expire in 10 minutes.</p>
        </div>
    </div>
    """

    resend.Emails.send({
        "from": settings.RESEND_FROM_EMAIL,
        "to": [email],
        "subject": "Your AscendIQ Verification Code",
        "html": html_content
    })
