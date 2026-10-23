# ApplyAI — AI-Powered Job Application Tracker

A full-stack SaaS portfolio project where users paste a job description and resume, get an AI match score, receive rewritten bullet-point suggestions, and track every application through a Kanban pipeline — all stored in MongoDB with full history.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)

## Demo Credentials

```
Email:    demo@applyai.io
Password: demo123
```

Run `npm run seed` after starting MongoDB to populate demo data.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Match Scoring** | Analyzes resume vs. job description — score, strengths, gaps, keywords |
| **Resume Rewriting** | AI suggests improved bullet points aligned to each JD |
| **Kanban Pipeline** | Drag applications: Saved → Applied → Interview → Offer → Rejected |
| **Full History** | Every status change and AI analysis logged with timestamps |
| **Resume Parser** | Paste raw resume text — AI structures it into skills, experience, education |
| **Rate Limiting** | AI endpoints protected per-user to control API costs |

---

## Architecture

```
applyai/
├── client/                    # React + Vite + Redux Toolkit
│   └── src/
│       ├── api/client.js      # Axios instance with JWT interceptors
│       ├── store/             # Redux slices (applications, resume)
│       ├── hooks/useAIAnalysis.js
│       ├── components/
│       │   ├── KanbanBoard/   # Pipeline board + cards
│       │   ├── ResumeEditor/  # Resume input + bullet suggestions
│       │   └── MatchScore/    # AI score ring + analysis panel
│       └── pages/
│           ├── Dashboard.jsx
│           ├── NewApplication.jsx
│           └── ApplicationDetail.jsx
├── server/                    # Node.js + Express
│   └── src/
│       ├── config/            # MongoDB + OpenAI clients
│       ├── models/            # User, Resume, Application
│       ├── controllers/       # Route handlers
│       ├── routes/            # auth, resume, application, ai
│       ├── services/ai.service.js  # All OpenAI logic
│       └── middleware/        # JWT auth + AI rate limiting
└── docker-compose.yml         # MongoDB container
```

### System Architecture

The React client sends requests through the shared Axios client. The Express API checks database availability for API routes, then applies authentication and AI rate limits where required. Data is stored in MongoDB; AI features use OpenAI when configured and otherwise return mock responses.

```mermaid
flowchart LR
    subgraph Client["Browser — React + Vite"]
        UI["Pages and components"]
        State["Auth context + Redux state"]
        API["Axios API client<br/>attaches JWT"]
        UI <--> State
        UI --> API
    end

    subgraph Server["Node.js + Express API"]
        App["Express app<br/>JSON parsing + route mounting"]
        DBCheck["Database availability check"]
        Guards["Route middleware<br/>JWT auth / AI rate limit<br/>(where required)"]
        Controllers["Route controllers"]
        AIService["AI service"]
        App --> DBCheck --> Guards --> Controllers
        Controllers --> AIService
    end

    DB[("MongoDB<br/>users, resumes, applications")]
    OpenAI["OpenAI GPT-4o-mini"]
    Mock["Mock AI responses"]

    API <-->|"HTTP / JSON"| App
    Controllers <-->|"read / write"| DB
    AIService -->|"API key configured"| OpenAI
    AIService -->|"no API key"| Mock
    OpenAI --> AIService
    Mock --> AIService
```

### Application Workflow

Analysis is optional: users can save an application without running it. When they analyze first, the result is shown in the form and included with the application when saved. Dragging a card to another Kanban column updates its status and records the change in application history.

```mermaid
flowchart TD
    Start([User signs in]) --> Resume["New application page<br/>loads saved resume"]
    Resume --> Enter["Enter company, role,<br/>job description and details"]
    Enter --> AnalyzeChoice{"Analyze resume match?"}

    AnalyzeChoice -->|"Yes"| Analyze["POST /api/ai/analyze"]
    Analyze --> Guard["Check MongoDB, JWT<br/>and AI rate limit"]
    Guard --> AI["Analyze resume against job description<br/>OpenAI or mock mode"]
    AI --> Result["Show match score<br/>and bullet suggestions"]
    Result --> SaveChoice{"Save application?"}

    AnalyzeChoice -->|"No"| SaveChoice
    SaveChoice -->|"Yes"| Create["POST /api/applications"]
    Create --> Store["Save application and resume snapshot<br/>with creation/analysis history"]
    Store --> Board["Dashboard / Kanban board"]
    SaveChoice -->|"No"| Enter

    Board --> Drag["Move application to another status"]
    Drag --> Update["PUT /api/applications/:id"]
    Update --> History["Update status and append<br/>status-change history"]
    History --> Board
```

---

## Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Docker)
- OpenAI API key (optional — runs in mock mode without it)

### 1. Install

```bash
npm install
npm run install:all
```

### 2. Start MongoDB (required)

The API **will not work** without MongoDB. Pick one option:

**Option A — Docker (recommended)**
```bash
docker compose up -d
```

**Option B — MongoDB Atlas (free cloud)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy your connection string into `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/applyai
   ```

**Option C — Local MongoDB**
Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and ensure it is running on port `27017`.

### 3. Configure

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your OpenAI key:

```
OPENAI_API_KEY=sk-your-key-here
```

> Without an API key, the app works in **mock mode** with realistic sample AI responses.

### 4. Seed Demo Data

```bash
npm run seed
```

### 5. Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register + auto-create resume profile |
| `POST` | `/api/auth/login` | Login, receive JWT |
| `GET` | `/api/resume` | Get user's resume |
| `PUT` | `/api/resume` | Update resume |
| `POST` | `/api/resume/parse` | AI-parse raw resume text |
| `GET` | `/api/applications` | List all applications |
| `POST` | `/api/applications` | Create application with AI analysis |
| `PUT` | `/api/applications/:id` | Update status (logs history) |
| `POST` | `/api/ai/analyze` | Score resume vs. job description |
| `POST` | `/api/ai/rewrite` | Rewrite resume bullets for a JD |
| `GET` | `/api/applications/stats` | Dashboard statistics |

---

## Tech Stack

**Frontend:** React 19, Redux Toolkit, React Router v7, Axios, Tailwind CSS v4, Vite, Lucide Icons

**Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, express-rate-limit, OpenAI SDK

**Database:** MongoDB with indexed schemas for users, resumes, and applications with embedded history

---

## Portfolio Highlights

This project demonstrates skills valued by international tech companies:

- Full-stack SaaS architecture with clean separation (controllers, services, routes)
- Real AI integration with graceful mock fallback for demos without API keys
- Redux state management with async thunks
- MongoDB schema design with embedded history arrays for audit trails
- Rate limiting on expensive AI endpoints
- Professional dark-theme UI with Kanban drag-and-drop
- JWT authentication with protected routes on both client and server

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| **502 Bad Gateway** on `/api/*` | Backend not running or crashed | Run `npm run dev:server` in a separate terminal. Check terminal for errors. |
| **503 Database unavailable** | MongoDB not running | Start MongoDB (`docker compose up -d`) or set a valid `MONGODB_URI` in `server/.env` |
| **AI mock mode** | No OpenAI key | Add `OPENAI_API_KEY` to `server/.env` (optional — app works without it) |

Verify backend health: http://localhost:5000/api/health — should show `"database": "connected"`.

---

## License

MIT
