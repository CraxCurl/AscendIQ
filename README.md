# SkillForge

SkillForge is an AI-powered career operating system for students and early-career professionals. It combines a FastAPI backend with a React/Vite frontend to collect a learner profile, analyze career readiness, generate growth roadmaps, recommend opportunities, review resumes, and prepare interview material.

The backend currently exposes the API surface for authentication, profile upload, roadmap, opportunity matching, and a multi-agent mentor analysis flow. The frontend provides the landing page, profile intake screen, dashboard, and roadmap UI.

## Features

- AI career profile analysis for a target role
- Career Health Score and competency breakdown models
- Personalized roadmap generation
- Opportunity recommendations for internships, hackathons, and open-source programs
- Resume enhancement and ATS-style feedback
- Interview preparation material generation
- React dashboard with competency radar, score cards, and action items

## Tech Stack

### Backend

- Python 3.11
- FastAPI
- Uvicorn
- Pydantic and pydantic-settings
- Google Gemini via `google-generativeai`
- MongoDB client libraries: `motor` and `pymongo`
- Firebase Admin SDK
- Resume parsing dependencies: `python-docx` and `PyMuPDF`

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React
- Framer Motion
- Firebase client SDK
- TanStack Query
- Axios

## Project Structure

```text
SkillForge/
+-- backend/
|   +-- app/
|   |   +-- api/endpoints/
|   |   |   +-- agents.py
|   |   |   +-- auth.py
|   |   |   +-- opportunities.py
|   |   |   +-- profile.py
|   |   |   +-- roadmap.py
|   |   +-- core/config.py
|   |   +-- models/profile.py
|   |   +-- services/
|   |       +-- agent_service.py
|   |       +-- mentor_agent.py
|   +-- main.py
|   +-- requirements.txt
|   +-- testmongo.py
+-- frontend/
    +-- src/
    |   +-- components/
    |   |   +-- AppShell.tsx
    |   +-- pages/
    |   |   +-- Dashboard.tsx
    |   |   +-- InterviewPrep.tsx
    |   |   +-- Landing.tsx
    |   |   +-- Opportunities.tsx
    |   |   +-- ProfileUpload.tsx
    |   |   +-- ResumeOptimization.tsx
    |   |   +-- Roadmap.tsx
    |   +-- App.tsx
    |   +-- index.css
    |   +-- main.tsx
    +-- package.json
    +-- tailwind.config.js
    +-- postcss.config.js
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm
- MongoDB connection string
- Google Gemini API key
- Optional: Firebase service account JSON for Firebase Admin features

## Clone and Start Working

Use these steps when setting up the project on a new machine.

### 1. Clone the repository

```powershell
git clone <repository-url>
cd SkillForge
```

Replace `<repository-url>` with the actual Git remote URL.

### 2. Create backend environment variables

Create `backend/.env`:

```env
PROJECT_NAME=SkillForge
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=skillforge
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=
FIREBASE_SERVICE_ACCOUNT_PATH=
```

If Firebase Admin features are needed, place the service account JSON somewhere local and set `FIREBASE_SERVICE_ACCOUNT_PATH` to that path. Keep `.env` files and service account JSON files private.

### 3. Install backend dependencies

```powershell
cd backend
python -m venv ..\.venv
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

On macOS/Linux, activate the virtual environment with:

```bash
source ../.venv/bin/activate
```

### 4. Start the backend

From `backend/` with the virtual environment active:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Check the API docs at `http://localhost:8000/docs`.

### 5. Install frontend dependencies

Open a second terminal from the project root:

```powershell
cd frontend
npm install
```

### 6. Start the frontend

```powershell
npm run dev
```

Open `http://localhost:5173`.

### 7. Before making changes

- Create a feature branch: `git checkout -b feature/your-change-name`
- Keep secrets out of commits. The root `.gitignore` already excludes `.env`, `.venv`, `node_modules`, `dist`, and Firebase service account JSON files.
- Run `npx vite build` from `frontend/` to verify the frontend bundle.
- Run backend smoke checks by starting FastAPI and opening `http://localhost:8000/docs`.

## Backend Setup

From the project root:

```powershell
cd backend
python -m venv ..\.venv
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
PROJECT_NAME=SkillForge
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=skillforge
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=
FIREBASE_SERVICE_ACCOUNT_PATH=
```

If you use a Firebase service account, set `FIREBASE_SERVICE_ACCOUNT_PATH` to the local JSON path. Do not commit real `.env` files, API keys, or service account JSON files.

Run the API:

```powershell
uvicorn main:app --reload
```

The API will be available at:

- `http://localhost:8000`
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Frontend Setup

From the project root:

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server usually runs at:

```text
http://localhost:5173
```

## Running the Full App

Start the backend in one terminal:

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
(make sure u installed the dependencies as mentioned above)
uvicorn main:app --reload
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.

## API Overview

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | API welcome message |
| `POST` | `/api/auth/login` | Placeholder login endpoint |
| `POST` | `/api/auth/signup` | Placeholder signup endpoint |
| `POST` | `/api/profile/upload` | Accepts a structured user profile |
| `POST` | `/api/profile/resume` | Accepts a resume file upload |
| `POST` | `/api/agents/analyze` | Runs the mentor analysis pipeline |
| `GET` | `/api/roadmap/` | Placeholder roadmap endpoint |
| `GET` | `/api/opportunities/match` | Placeholder opportunity matching endpoint |

Example mentor analysis payload:

```json
{
  "user_id": "user_123",
  "full_name": "Alex Carter",
  "email": "alex@example.com",
  "target_role": "AI Engineer",
  "resume_text": "Built ML projects using Python and TensorFlow...",
  "github_url": "https://github.com/alex",
  "linkedin_url": "https://linkedin.com/in/alex",
  "skills": ["Python", "Machine Learning", "React"],
  "projects": [
    {
      "title": "Resume Analyzer",
      "description": "AI tool for resume scoring.",
      "technologies": ["Python", "FastAPI", "Gemini"],
      "link": "https://example.com"
    }
  ],
  "certifications": [
    {
      "name": "Machine Learning Specialization",
      "issuer": "Coursera",
      "year": 2025
    }
  ],
  "experience_level": "Student/Entry Level"
}
```

## Current Implementation Notes

- The AI mentor pipeline is implemented in `backend/app/services/mentor_agent.py` and delegates to agents in `backend/app/services/agent_service.py`.
- Gemini responses are expected to be valid JSON. If the model returns malformed JSON, the current implementation may raise a parsing error.
- Several API routes are placeholders and return simple success or empty-list responses.
- The frontend profile upload currently simulates analysis and routes to the dashboard after a delay.
- The dashboard, roadmap, opportunities, resume optimization, and interview prep pages currently display sample data.
- `npm run build` runs `tsc && vite build`, but this project currently does not include a `tsconfig.json`. Until TypeScript config is added, use `npx vite build` for bundle verification.

## Security Notes

- Keep `backend/.env` out of version control.
- Keep Firebase service account files out of version control.
- Restrict CORS origins before deploying; the current backend allows all origins for local development.
- Avoid logging API keys, service account contents, or full resume text in production logs.

## Suggested Next Steps

- Connect the frontend profile upload flow to `/api/profile/upload` and `/api/agents/analyze`.
- Add resilient JSON extraction and validation around Gemini responses.
- Persist profiles and analysis results in MongoDB.
- Replace placeholder auth routes with Firebase authentication verification.
- Add backend tests for API contracts and agent response parsing.
- Add a `tsconfig.json` so `npm run build` can run TypeScript checks before Vite builds.
