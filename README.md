# AscendIQ

AscendIQ is an AI-powered career operating system for students and early-career professionals. It combines a FastAPI backend, MongoDB persistence, Groq-powered analysis, Resend email verification, and a React/Vite frontend to turn a user's resume and self-description into live career analytics.

## Features

- Registration with one-time email OTP verification
- Password login after verification, with no OTP required for normal login
- Google sign-in through Firebase Authentication
- MongoDB-backed users, verification state, and AI analysis records
- Resume upload support for PDF and DOCX
- Required onboarding after login: upload a resume or describe yourself
- Multi-agent AI career analytics for dashboard, roadmap, opportunities, resume, LeetCode practice, and interview prep
- LeetCode Analyzer Agent powered by the bundled `backend/app/data/leetcode_problems.json` dataset
- AI-generated career health score, skill gaps, action plan, opportunity matches, ATS feedback, and interview practice
- Developer sandbox login for local testing

## Tech Stack

### Backend

- Python 3.11+ recommended
- FastAPI and Uvicorn
- PyMongo and Motor dependencies
- MongoDB
- Firebase Authentication for Google sign-in
- Gemini API keys for multi-agent analysis
- Groq configuration support
- Resend email API
- JWT authentication
- bcrypt password hashing
- pypdf and python-docx for resume parsing

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- React Three Fiber
- Recharts
- Lucide React

## Project Structure

```text
AscendIQ/
|-- backend/
|   |-- app/
|   |   |-- api/endpoints/
|   |   |   |-- auth.py
|   |   |   |-- agents.py
|   |   |   |-- profile.py
|   |   |   |-- roadmap.py
|   |   |   |-- opportunities.py
|   |   |-- core/config.py
|   |   |-- models/profile.py
|   |   |-- services/
|   |       |-- gemini_analysis.py
|   |       |-- otp_service.py
|   |       |-- storage.py
|   |   |-- data/leetcode_problems.json
|   |-- main.py
|   |-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- analysis.tsx
|   |   |-- api.ts
|   |   |-- auth.tsx
|   |   |-- App.tsx
|   |-- package.json
|   |-- vite.config.ts
|-- README.md
```

## Environment Variables

Create `backend/.env`:

```env
PROJECT_NAME=AscendIQ
PORT=8000

MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ascendiq

API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

GEMINI_API_KEY=default_gemini_key
PROFILE_AGENT_API_KEY=key_for_profile_strategist
SKILL_ROADMAP_AGENT_API_KEY=key_for_skill_roadmap
RESUME_ATS_AGENT_API_KEY=key_for_resume_ats
OPPORTUNITY_INTERVIEW_AGENT_API_KEY=key_for_opportunity_interview
LEETCODE_AGENT_API_KEY=key_for_leetcode_analyzer
MASTER_AGENT_API_KEY=key_for_master_synthesis
GEMINI_MODEL=gemini-2.5-flash

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=AscendIQ <noreply@yourdomain.com>

FIREBASE_PROJECT_ID=ascendiq

JWT_SECRET=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

The six Gemini keys can also be named `AI_AGENT_1_API_KEY` through `AI_AGENT_5_API_KEY` and `AI_MASTER_API_KEY`, or `API_KEY_1` through `API_KEY_6`. If a specialist key is missing, AscendIQ falls back to `GEMINI_API_KEY`; if that is also missing or an API call fails, deterministic local fallback logic still returns usable analytics.

Create `frontend/.env` if you want to override the local backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## MongoDB Structure

AscendIQ uses two primary collections in `DATABASE_NAME`.

### `users`

```js
{
  email: "user@example.com",
  full_name: "User Name",
  hashed_password: "...",
  auth_provider: "password",
  providers: ["password", "google"],
  firebase_uid: null,
  photo_url: null,
  is_verified: true,
  created_at: ISODate,
  updated_at: ISODate,
  last_login_at: ISODate | null,
  email_verified_at: ISODate | null,
  verification: null
}
```

During registration, `verification` temporarily stores a hashed OTP, expiry time, sent time, and attempt count. Raw OTP codes are never stored.

Google sign-in users are stored in the same collection. For those accounts, `is_verified` is set to `true`, `providers` includes `"google"`, `firebase_uid` stores the Firebase user id, and `photo_url` stores the Google profile image when available. If a password account later signs in with Google using the same email, AscendIQ links Google metadata onto the same MongoDB user document.

### `analyses`

```js
{
  email: "user@example.com",
  profile: {
    full_name: "...",
    target_role: "...",
    about_yourself: "...",
    resume_text: "...",
    skills: []
  },
  analysis: {
    stats: {},
    radar: [],
    skill_gaps: [],
    roadmap: [],
    opportunities: [],
    resume_feedback: {},
    interview_prep: {},
    leetcode_plan: {},
    agent_reports: [],
    agent_pipeline: {}
  },
  created_at: ISODate,
  updated_at: ISODate
}
```

## Authentication Flow

1. User registers with full name, email, and password.
2. Backend creates or updates an unverified MongoDB user.
3. Backend sends a Resend email containing a six-digit OTP.
4. User verifies the OTP.
5. Backend marks `is_verified=true`.
6. User logs in with email and password.
7. Login does not send OTP after the account is verified.

## Google Sign-In Flow

1. Frontend opens Firebase Google sign-in popup.
2. Firebase returns an ID token.
3. Frontend sends the ID token to `/api/auth/firebase-login`.
4. Backend verifies the token against Firebase project `ascendiq`.
5. Backend upserts the user in MongoDB with the same structure as normal users.
6. Backend issues the normal AscendIQ JWT used by protected routes.

For local development, make sure `localhost` is added as an authorized domain in Firebase Authentication settings.

## Run Locally

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

API docs:

```text
http://localhost:8000/docs
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Main API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create or update an unverified user and send registration OTP |
| `POST` | `/api/auth/send-otp` | Resend registration OTP for an existing unverified user |
| `POST` | `/api/auth/verify-otp` | Verify registration OTP and activate account |
| `POST` | `/api/auth/login` | Login verified user with email and password |
| `POST` | `/api/auth/firebase-login` | Verify Firebase Google ID token and issue AscendIQ JWT |
| `POST` | `/api/auth/sandbox-login` | Local development sandbox login |
| `GET` | `/api/auth/me` | Return current authenticated user |
| `POST` | `/api/profile/analyze-intake` | Upload resume/about-yourself and generate AI analytics |
| `GET` | `/api/profile/me/analysis` | Return current user's latest stored analysis |

## Local Development Notes

- MongoDB must be reachable from `MONGODB_URL` for registration and login to work.
- Resend is only required for real email OTP delivery. Without `RESEND_API_KEY`, the backend prints the OTP to the server console.
- The frontend requires profile onboarding before dashboard access.
- Root-level `node_modules`, root package locks, Vite builds, Python caches, and old JSON storage are intentionally ignored or removed. Runtime dependencies live under `frontend/` and `backend/`.

## Verification Commands

```powershell
cd frontend
npm run build
```

```powershell
cd backend
.\.venv\Scripts\python.exe -m compileall app main.py
```
