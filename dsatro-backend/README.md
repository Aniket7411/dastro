# Astrology Backend

Node.js + Express API for DS Astrology (courses, consultations, blogs, payments, free consultation AI, live chat).

## Quick start (local)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment file

Copy the example and fill in your values:

```bash
copy .env.example .env
```

Minimum required for local dev:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your-secret
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash
```

### 3. Verify Gemini (optional but recommended)

```bash
npm run verify:gemini
```

You should see:

```text
✅ CONNECTION SUCCESSFUL
📡 ACTIVE MODEL: gemini-2.0-flash
```

### 4. Start the server

**Development** (auto-restart on file changes):

```bash
npm run dev
```

**Production-style**:

```bash
npm start
```

Server runs at **http://localhost:5000**

Health check: **http://localhost:5000/health**

On startup you should see:

- `🚀 Server live on port 5000`
- `✅ MongoDB Connected`
- `✅ CONNECTION SUCCESSFUL` (Gemini)
- `✅ Supabase Storage configured`

## Free consultation (Gemini AI)

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/free-consultation/auth/login` | Public | Counsellor login |
| `POST /api/free-consultation/leads` | Counsellor token | Submit lead → AI reading |
| `GET /api/admin/free-consultation/leads` | Admin | List leads |
| `GET /api/admin/free-consultation/leads/export` | Admin | Export to Excel |

**Env vars:**

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
FREE_CONSULTATION_LLM_TIMEOUT_MS=10000
GEMINI_MAX_RETRIES=3
COUNSELLOR_BOOTSTRAP_EMAIL=...
COUNSELLOR_BOOTSTRAP_PASSWORD=...
```

If Gemini fails at runtime, readings fall back to sign-based templates automatically.

## Deploy to Render

1. Push to GitHub (`git push origin main`)
2. In **Render → Environment**, add the same vars as `.env` (especially `GEMINI_API_KEY`, `GEMINI_MODEL`, `MONGO_URI`, `JWT_SECRET`, email SMTP vars)
3. Render auto-deploys on push

**Render email tip:** Gmail SMTP often fails on cloud hosts — use Brevo/SendGrid with `SMTP_HOST`, `SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASS`.

## Useful scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |
| `npm run verify:gemini` | Test Gemini API without starting server |
| `npm run seed:course-catalog` | Seed course catalog |
| `node test-email.js` | Test SMTP credentials |
| `node seedBlogs.js` | Seed sample published blogs |

## Project structure

- `server.js` — HTTP server, Socket.io, startup checks
- `src/app.js` — Express middleware and routes
- `src/services/llmReadingService.js` — Gemini AI readings
- `src/controllers/` — Route handlers
- `project-frontend-backend-contract.md` — Full API contract for frontend
