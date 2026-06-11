import random
import resend
from app.core.config import settings



def generate_code() -> str:
    return f"{random.randint(100000, 999999)}"

def send_otp_email(email: str, code: str, full_name: str | None = None, purpose: str = "registration") -> None:
    if not settings.RESEND_API_KEY:
        print(f"WARNING: No RESEND_API_KEY set. OTP for {email} is {code}")
        return

    greeting = f"Hi {full_name}," if full_name else "Hi there,"
    is_reset = purpose == "password_reset"
    headline = "Reset your AscendIQ password" if is_reset else "Verify your account to unlock your AI career dashboard."
    body = (
        "Use this one-time code to reset your AscendIQ password. If you did not request a reset, you can ignore this email."
        if is_reset
        else "Use this one-time code to finish creating your AscendIQ account. We only ask for this during registration."
    )
    subject = "Reset your AscendIQ password" if is_reset else "Verify your AscendIQ account"
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#000000;font-family:Inter,Arial,sans-serif;color:#ffffff;-webkit-font-smoothing:antialiased;">
      <div style="padding:20px;max-width:600px;margin:0 auto;">
        <div style="border:1px solid rgba(255,255,255,0.1);border-radius:20px;overflow:hidden;background:#0a0a0a;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          <div style="padding:30px 24px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <div style="display:inline-block;padding:6px 14px;border-radius:9999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);margin-bottom:16px;">
              <span style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.6);">AscendIQ Intelligence</span>
            </div>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.03em;">{headline}</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px;color:rgba(255,255,255,0.9);font-size:15px;">{greeting}</p>
            <p style="margin:0 0 24px;color:rgba(255,255,255,0.5);line-height:1.6;font-size:14px;">
              {body}
            </p>
            <div style="text-align:center;margin:24px 0;">
              <div style="display:inline-block;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);border-radius:16px;padding:16px 24px;box-shadow:inset 0 2px 4px rgba(255,255,255,0.02);">
                <div style="font-size:32px;letter-spacing:8px;font-weight:800;color:#ffffff;text-shadow:0 0 20px rgba(255,255,255,0.3);margin-right:-8px;">{code}</div>
              </div>
            </div>
            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;text-align:center;">
              This code expires securely in 10 minutes.
            </p>
          </div>
          <div style="padding:20px 24px;background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);font-size:12px;text-align:center;">
            AscendIQ Career OS
          </div>
        </div>
      </div>
    </body>
    </html>
    """

    resend.api_key = settings.RESEND_API_KEY
    result = resend.Emails.send({
        "from": f"AscendIQ <{settings.RESEND_FROM_EMAIL}>",
        "to": [email],
        "subject": subject,
        "html": html_content
    })
    if isinstance(result, dict) and result.get("error"):
        raise RuntimeError(str(result["error"]))
