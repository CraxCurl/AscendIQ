# AscendIQ

AscendIQ is an AI-powered career operating system that analyzes profiles, generates personalized roadmaps, matches opportunities, and provides mentor-guided interview prep.

## Features

- **Profile Analysis:** Upload your resume and/or describe yourself to get AI-generated career health scores and skill gaps.
- **Personalized Roadmaps:** AI-generated 90-day growth roadmaps based on your target role.
- **Opportunity Matching:** Prioritized openings matching your skills.
- **Resume Optimization:** ATS readiness, missing keywords, and rewrite suggestions.
- **Interview Prep:** Custom practice questions and behavioral story bank based on your experience.
- **Premium Design System:** A futuristic black/glassmorphism UI across the entire application.
- **Secure Authentication:** Resend-powered Email OTP authentication (login & registration).

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Three Fiber.
- **Backend:** FastAPI, Python, Resend (Email OTPs), JWT.
- **Storage:** Local JSON storage (ready to migrate to MongoDB/Motor).

## Prerequisites

- Node.js >= 18
- Python >= 3.10
- Resend Account (for email OTPs)

## Setup & Run

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory:
   ```env
   # JWT Configuration
   JWT_SECRET_KEY=your_super_secret_jwt_key
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440

   # Resend Configuration (Email OTPs)
   RESEND_API_KEY=re_your_resend_api_key
   RESEND_FROM_EMAIL=noreply@stigz.xyz  # or your verified domain
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Authentication

AscendIQ uses passwordless Email OTP for authentication via **Resend**.
- Users can register by providing their Full Name, Email, and Password, which triggers a 6-digit OTP sent to their email.
- Upon successful verification, an account is created and a JWT is issued.
- **Dev Mode:** In development (`NODE_ENV=development`), you can use the **Sandbox Login** button to instantly log in as a test user (`sandbox@ascendiq.dev`) without checking email.

## API Endpoints

- `POST /api/auth/register`: Create a new account (requires OTP verification first via `/send-otp` and `/verify-otp`).
- `POST /api/auth/login`: Login with email and password.
- `POST /api/auth/send-otp`: Sends a 6-digit OTP to the provided email via Resend.
- `POST /api/auth/verify-otp`: Verifies the provided OTP.
- `POST /api/auth/sandbox-login`: Instantly issues a token for the sandbox user (dev only).
- `POST /api/intake`: Submit profile details and resume for AI analysis.
