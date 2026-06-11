import random
import resend
from app.core.config import settings

# Configure Resend
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

def generate_code() -> str:
    return f"{random.randint(100000, 999999)}"

def send_otp_email(email: str, code: str, full_name: str | None = None) -> None:
    if not settings.RESEND_API_KEY:
        print(f"WARNING: No RESEND_API_KEY set. OTP for {email} is {code}")
        return

    greeting = f"Hi {full_name}," if full_name else "Hi there,"
    html_content = f"""
    <div style="margin:0;padding:32px;background:#020617;font-family:Inter,Arial,sans-serif;color:#e2e8f0;">
      <div style="max-width:600px;margin:0 auto;border:1px solid #1e293b;border-radius:18px;overflow:hidden;background:#0f172a;">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#4f46e5,#7c3aed,#f43f5e);">
          <h1 style="margin:0;color:white;font-size:28px;letter-spacing:-0.02em;">AscendIQ</h1>
          <p style="margin:8px 0 0;color:#eef2ff;font-size:14px;">Verify your account to unlock your AI career dashboard.</p>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;color:#cbd5e1;font-size:16px;">{greeting}</p>
          <p style="margin:0 0 22px;color:#94a3b8;line-height:1.6;font-size:15px;">
            Use this one-time code to finish creating your AscendIQ account. We only ask for this during registration.
          </p>
          <div style="text-align:center;margin:28px 0;">
            <div style="display:inline-block;background:#111827;border:1px solid #334155;border-radius:14px;padding:18px 26px;">
              <div style="font-size:34px;letter-spacing:8px;font-weight:800;color:#ffffff;">{code}</div>
            </div>
          </div>
          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
            This code expires in 10 minutes. If you did not try to create an AscendIQ account, you can safely ignore this email.
          </p>
        </div>
        <div style="padding:18px 32px;border-top:1px solid #1e293b;color:#64748b;font-size:12px;">
          AscendIQ Career OS
        </div>
      </div>
    </div>
    """

    resend.Emails.send({
        "from": settings.RESEND_FROM_EMAIL,
        "to": [email],
        "subject": "Verify your AscendIQ account",
        "html": html_content
    })
