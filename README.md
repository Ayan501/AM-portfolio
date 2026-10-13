# AM-portfolio

Personal portfolio for Ayan Mansoori. The site is built with React, TypeScript, and Vite, with a responsive project and skills showcase, education and certificates, and an animated hero visual.

## Project structure

- `frontend/` — portfolio website and locally answered portfolio assistant.
- `backend/` — optional FastAPI contact-form service and legacy Gemini chat endpoint.
- `frontend/src/data/portfolio.ts` — update profile, projects, skills, education, and certificates here.
- `frontend/public/images/` — profile images and other public images.

The portfolio assistant answers from the information in the frontend portfolio data. It does not require an LLM API key or a running backend. The contact form uses the optional FastAPI backend and needs working SMTP configuration to deliver messages.

## Run locally

### Frontend

Requirements: Node.js 20 or later.

```powershell
cd frontend
npm ci
npm run dev
```

The development server runs at `http://localhost:5173`.

### Optional backend (contact form)

Requirements: Python 3.11 or later.

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set SMTP credentials and `CONTACT_EMAIL` in `backend/.env` to enable contact-form delivery. Never commit `.env` files or publish secrets.

## Build and check

```powershell
cd frontend
npm ci
npm run build
```

The build runs the TypeScript checks before creating production files in `frontend/dist/`.

Backend tests can be run from `backend/` after installing requirements:

```powershell
python -m pytest -q
```

## Deploy

### Static portfolio

Deploy `frontend/` as the project root on a static hosting provider. Use:

- Build command: `npm run build`
- Output directory: `dist`

The portfolio content and assistant work as a static site. No API key is required.

### Contact form

To deliver contact-form submissions, deploy `backend/` to a Python ASGI host using:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Configure the backend's SMTP environment variables and set `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin. Set `VITE_API_BASE_URL` to the backend origin in the frontend hosting provider before building. Without the optional backend, visitors can still use the direct email link.
