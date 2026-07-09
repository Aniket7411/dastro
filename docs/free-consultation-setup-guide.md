# Free Consultation Funnel — Setup & Testing Guide

**Simple guide for developers** — Gemini API key, counsellor login, and end-to-end testing.

For the full product blueprint, see [free-consultation-funnel.md](./free-consultation-funnel.md).

For **end-to-end flow + pre-deploy testing checklist**, see [free-consultation-flow-and-testing.md](./free-consultation-flow-and-testing.md).

---

## 1. What this feature does (30-second overview)

```
Social media ad / reel
    → Caller phones in
    → Counsellor opens the desk tool in browser
    → Fills caller details + consent
    → Backend saves lead + calls Gemini AI
    → Reading appears on screen (lucky number, nature, phase, close script)
    → Counsellor reads it and offers paid consultation / course
    → Admin exports leads to NeoDove Excel
```

**Important:** The AI key lives **only on the backend**. The counsellor browser never sees `GEMINI_API_KEY`.

---

## 2. URLs you will use

| Who | URL (local dev) |
|-----|-----------------|
| Counsellor login | http://localhost:5173/counsellor/login |
| Counsellor desk (form + reading) | http://localhost:5173/counsellor/desk |
| Admin → Free Consultation leads | http://localhost:5173/admin → **Free Consultation** tab |

**Backend API base:** `http://localhost:5000/api`

---

## 3. Get a Gemini API key (Google AI Studio)

1. Open **Google AI Studio**: https://aistudio.google.com/apikey  
2. Sign in with your Google account.  
3. Click **Create API key** (pick an existing Google Cloud project or create one).  
4. Copy the key — it looks like `AIzaSy...`  
5. Keep it private. Do **not** put it in the frontend or commit it to Git.

**Tip:** Use a paid / billing-enabled Google Cloud project for live counsellor calls. Free tier can hit rate limits during testing.

---

## 4. Add the key to the backend

Edit **`backend/.env`** (not frontend). Add or update:

```env
# ─── Free Consultation / Gemini ─────────────────────────
GEMINI_API_KEY=AIzaSyYOUR_KEY_HERE
GEMINI_MODEL=gemini-1.5-flash
FREE_CONSULTATION_LLM_TIMEOUT_MS=10000
GEMINI_MAX_RETRIES=3

# ─── First counsellor account (auto-created once) ───────
COUNSELLOR_BOOTSTRAP_EMAIL=counsellor@yourdomain.com
COUNSELLOR_BOOTSTRAP_PASSWORD=YourSecurePassword123
COUNSELLOR_BOOTSTRAP_NAME=Test Counsellor

# Required for login tokens (should already exist)
JWT_SECRET=your-existing-jwt-secret
MONGO_URI=your-existing-mongodb-uri
```

Reference copy is in **`backend/.env.example`**.

### Restart the backend

After changing `.env`, stop and start the backend:

```powershell
cd backend
npm run dev
```

You should see `Server live on port 5000` and MongoDB connected.

---

## 5. Create a counsellor account

There are **two ways**.

### Option A — Bootstrap (easiest for first account)

1. Set `COUNSELLOR_BOOTSTRAP_EMAIL`, `COUNSELLOR_BOOTSTRAP_PASSWORD`, and `COUNSELLOR_BOOTSTRAP_NAME` in `backend/.env`.  
2. Restart backend.  
3. On **first counsellor login**, if the database has **zero** counsellors, the server creates this account automatically.

Then log in at `/counsellor/login` with that email and password.

### Option B — Admin API (extra counsellors)

Use this after you already have an **admin** account.

1. Log in to admin: `/admin/login`  
2. Copy your admin JWT from browser DevTools → Application → Local Storage → `adminToken`  
3. Create a counsellor:

```powershell
curl -X POST http://localhost:5000/api/admin/counsellors `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" `
  -d "{\"name\":\"Priya Sharma\",\"email\":\"priya@yourdomain.com\",\"password\":\"SecurePass123\"}"
```

Success response:

```json
{
  "success": true,
  "counsellor": { "id": "...", "name": "Priya Sharma", "email": "priya@yourdomain.com" }
}
```

---

## 6. Run locally (frontend + backend)

**Terminal 1 — backend**

```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 — frontend**

```powershell
cd frontend
npm install
npm run dev
```

Frontend proxies `/api` → `http://localhost:5000` (see `vite.config.js`).  
Leave `VITE_API_URL` empty in frontend for local dev.

---

## 7. Test the full flow (step by step)

### Step 1 — Counsellor login

1. Open http://localhost:5173/counsellor/login  
2. Enter bootstrap email + password.  
3. You should land on **/counsellor/desk**.

**Fails?** Check backend logs, MongoDB connection, and that bootstrap env vars are set.

### Step 2 — Submit a test lead

On the desk page, fill the form (example):

| Field | Example |
|-------|---------|
| Name | Rahul Verma |
| Mobile | 9876543210 |
| WhatsApp | same as mobile ✓ |
| DOB | 1995-06-15 |
| Place of birth | Lucknow, UP |
| Gender | Male |
| Marital status | Single |
| Reason for calling | Career growth and job change |
| Consent | ✓ ticked |

Click **Save & generate reading**.

Wait ~5–10 seconds.

### Step 3 — Check the reading panel

At the top you should see **Preliminary reading** with four blocks:

1. Lucky number & colour  
2. Your nature  
3. Your current phase  
4. What your full chart will reveal  

**Badge meanings:**

| Badge | Meaning |
|-------|---------|
| **AI generated** (green) | Gemini worked ✅ |
| **Template reading** (amber) | Fallback used — Gemini failed or timed out ⚠️ |

If you see **Template reading**, the lead is still saved; fix Gemini config (Section 8).

### Step 4 — Verify in admin

1. Open http://localhost:5173/admin/login → sign in as admin.  
2. Go to **Free Consultation** tab.  
3. Your test lead should appear (name, mobile, counsellor, date).  
4. Click **Export NeoDove** to download `.xlsx` and confirm columns.

---

## 8. How to verify Gemini is working

### Quick check (terminal on backend start)

Restart the backend, or run the standalone verifier:

```powershell
cd backend
npm run verify:gemini
```

You should see a banner like:

```
------------------------------------------
🔮 Checking Astrology Backend — Gemini connection...
✅ Gemini Connected!
📡 Model: gemini-1.5-flash
🔑 Key: AIzaSy...xxxx
⏱️  Timeout: 10000ms
   Free consultation readings will use AI (fallback on errors)
------------------------------------------
```

**429 quota error?** Startup check no longer uses generation quota (it lists models only). If readings still fail:

1. In `backend/.env` set `GEMINI_MODEL=gemini-1.5-flash` (not `gemini-2.0-flash`)
2. Enable billing in [Google AI Studio](https://aistudio.google.com/)
3. Use a key from https://aistudio.google.com/apikey (usually starts with `AIzaSy...`)
4. Generation retries automatically up to `GEMINI_MAX_RETRIES` (default 3) on rate limits
5. Run `npm run verify:gemini` again

### Quick check (UI)

Submit a lead → reading shows **AI generated** (not Template reading).

### API check (see raw response)

After counsellor login, submit via desk UI and open **Network** tab in DevTools:

- Request: `POST /api/free-consultation/leads`  
- Response should include:

```json
{
  "success": true,
  "usedFallback": false,
  "reading": {
    "luckyNumber": "...",
    "luckyColour": "...",
    "nature": "...",
    "currentPhase": "...",
    "fullChartReveal": "...",
    "sunSign": "Gemini",
    "source": "ai"
  }
}
```

If `"usedFallback": true` or `"source": "fallback"`, Gemini did not produce a valid reading.

### Common Gemini failure causes

| Symptom | Fix |
|---------|-----|
| Always **Template reading** | `GEMINI_API_KEY` missing, wrong, or backend not restarted |
| Timeout | Increase `FREE_CONSULTATION_LLM_TIMEOUT_MS` or check network |
| Rate limit / quota | Enable billing in Google Cloud or wait and retry |
| Wrong model | Try `GEMINI_MODEL=gemini-2.0-flash` (default) or `gemini-1.5-flash` |

Check backend console for lines like:

```
Free consultation AI fallback: GEMINI_API_KEY is not configured
```

---

## 9. Overall technical flow

```
┌─────────────────────┐
│ Counsellor browser  │
│ /counsellor/desk    │
└──────────┬──────────┘
           │ POST /api/free-consultation/leads
           │ (Bearer counsellorToken)
           ▼
┌─────────────────────┐
│ Backend             │
│ freeConsultation    │
│ Controller          │
├─────────────────────┤
│ 1. Validate form    │
│ 2. Save lead → Mongo │
│ 3. Call Gemini      │──► Google Gemini API
│ 4. Parse reading    │     (GEMINI_API_KEY)
│ 5. On error →       │
│    fallback template│
└──────────┬──────────┘
           │ JSON reading
           ▼
┌─────────────────────┐
│ ReadingPanel on     │
│ counsellor screen   │
└─────────────────────┘
```

**Key files**

| Part | Path |
|------|------|
| Gemini service | `backend/src/services/llmReadingService.js` |
| API controller | `backend/src/controllers/freeConsultationController.js` |
| Routes | `backend/src/routes/freeConsultationRoutes.js` |
| Fallback texts | `backend/src/data/fallbackReadings.js` |
| Counsellor UI | `frontend/src/pages/counsellor/` |
| Admin leads | `frontend/src/pages/AdminFreeConsultationLeads.jsx` |

---

## 10. Counsellor call flow (what humans do)

1. **Opening** — “DS Astrology mein swagat hai, main Damini ma’am ki consultation team se…”  
2. **Form** — Collect details while on call.  
3. **Consent** — Read consent line aloud; tick checkbox before submit.  
4. **Reading** — Read lucky number, nature, phase from screen.  
5. **Close** — “Ye general reading thi; asli jawab full chart + birth time se…” → offer consultation / demo / course.  
6. **Follow-up** — Admin exports to NeoDove; ops updates status there.

Full script: [free-consultation-funnel.md §9](./free-consultation-funnel.md#9-counsellor-call-script).

---

## 11. Production checklist

- [ ] `GEMINI_API_KEY` set on **backend host** (Render / VPS `.env`)  
- [ ] `JWT_SECRET` and `MONGO_URI` set  
- [ ] Bootstrap counsellor created OR admin created counsellors via API  
- [ ] Frontend `VITE_API_URL` points to production backend (no trailing `/api`)  
- [ ] Test one real lead → **AI generated** badge  
- [ ] Admin export downloads NeoDove `.xlsx`  
- [ ] Counsellor URL shared with team (e.g. `https://yoursite.com/counsellor/login`)

---

## 12. Quick troubleshooting

| Problem | What to do |
|---------|------------|
| Cannot log in as counsellor | Check bootstrap env vars; ensure MongoDB running; try login once to trigger bootstrap |
| 401 on submit lead | Log out and log in again (token expired after 12h) |
| Always fallback reading | Fix Gemini key + restart backend |
| Admin tab empty | Submit a test lead first; check date filters |
| Frontend cannot reach API | Local: backend on port 5000; prod: check `VITE_API_URL` |

---

## 13. Security reminders

- Never commit `backend/.env` to Git.  
- Never put `GEMINI_API_KEY` in frontend code or Vercel env.  
- Rotate keys if leaked.  
- Use strong counsellor passwords; create separate accounts per person via admin API.

---

*DS Astrology · Internal · Last updated Jul 2026*
