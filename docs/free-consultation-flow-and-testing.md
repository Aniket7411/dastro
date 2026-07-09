# Free Consultation — Flow & Testing Guide

**For counsellors, admins, and developers** — understand the full journey and confirm everything works before deploy.

Related docs:
- [Setup guide](./free-consultation-setup-guide.md) — Gemini key, env vars, counsellor account
- [Funnel blueprint](./free-consultation-funnel.md) — product spec

---

## 1. Who uses what

| Role | URL | Purpose |
|------|-----|---------|
| **Counsellor** | `/counsellor/login` → `/counsellor/desk` | Live call: capture lead + read AI reading |
| **Admin** | `/admin` → **Free Consultation** tab | View leads, export NeoDove Excel |
| **Caller** | Phone only | No self-serve form — counsellor fills details |

---

## 2. End-to-end flow (simple)

```
┌─────────────────┐
│ Marketing reel  │  "Call now for FREE consultation"
└────────┬────────┘
         ▼
┌─────────────────┐
│ Inbound call    │  Counsellor answers (script in funnel doc §9)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Counsellor login│  /counsellor/login (email + password)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Lead desk       │  /counsellor/desk — fill form during call
│                 │  • Read consent aloud → tick checkbox
│                 │  • Submit
└────────┬────────┘
         ▼
┌─────────────────┐
│ Backend         │  1. Save lead to MongoDB (always)
│                 │  2. Call Gemini AI (with retry)
│                 │  3. If AI fails → sign template fallback
└────────┬────────┘
         ▼
┌─────────────────┐
│ Reading panel   │  Lucky number, nature, phase, chart teaser
│ on desk         │  Badge: "AI generated" or "Template reading"
└────────┬────────┘
         ▼
┌─────────────────┐
│ Counsellor      │  Read reading → close on paid consultation /
│ closes call     │  demo / course
└────────┬────────┘
         ▼
┌─────────────────┐
│ Admin export    │  Free Consultation tab → NeoDove .xlsx
└────────┬────────┘
         ▼
┌─────────────────┐
│ NeoDove CRM     │  Follow-up, status updates
└─────────────────┘
```

---

## 3. Technical flow (developer view)

```
Counsellor browser
    │
    ├─ POST /api/free-consultation/auth/login
    │       → JWT counsellorToken (12h)
    │
    └─ POST /api/free-consultation/leads  (Bearer token)
            │
            ├─ Validate form + consent
            ├─ INSERT FreeConsultationLead (MongoDB)
            ├─ llmReadingService.generatePreliminaryReading()
            │     ├─ Gemini generateContent (retry on 429)
            │     └─ OR fallbackReadings.js by sun sign
            └─ JSON { reading, usedFallback }

Admin browser
    ├─ GET /api/admin/free-consultation/leads
    └─ GET /api/admin/free-consultation/export  → .xlsx
```

**Startup (backend):** `listModels` check only — does **not** use generation quota.

**Verify anytime:**
```powershell
cd backend
npm run verify:gemini
```

---

## 4. Counsellor login

1. Open `/counsellor/login`
2. Enter email + password (eye icon toggles show/hide password)
3. On success → redirected to `/counsellor/desk`
4. Token stored in `localStorage` as `counsellorToken`

**First account:** Set `COUNSELLOR_BOOTSTRAP_*` in `backend/.env` — auto-created on first login if DB has zero counsellors.

**Extra accounts:** Admin API `POST /api/admin/counsellors` (see setup guide).

---

## 5. Pre-deploy checklist (local)

Run frontend + backend locally. Tick each item.

### A. Backend & Gemini

- [ ] `backend/.env` has `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-1.5-flash`
- [ ] `npm run verify:gemini` → `✅ CONNECTION SUCCESSFUL`
- [ ] `npm run dev` (backend) → Gemini banner shows connected
- [ ] MongoDB connected

### B. Counsellor login & desk

- [ ] `/counsellor/login` loads
- [ ] Show/hide password works
- [ ] Login with bootstrap credentials succeeds
- [ ] Redirect to `/counsellor/desk`
- [ ] Logout returns to login

### C. Submit test lead

Use fake test data:

| Field | Test value |
|-------|------------|
| Name | Test User |
| Mobile | 9876543210 |
| DOB | 1990-05-20 |
| Place | Delhi |
| Reason | Career guidance |
| Consent | ✓ |

- [ ] Submit succeeds (toast)
- [ ] Reading panel appears at top
- [ ] Badge shows **AI generated** (green) — if Gemini works
- [ ] OR **Template reading** (amber) — acceptable if quota issue; fix model before go-live
- [ ] All 4 reading blocks have text

### D. Admin

- [ ] Admin login works
- [ ] **Free Consultation** tab shows test lead
- [ ] Search / date filter works
- [ ] **Export NeoDove** downloads `.xlsx`
- [ ] Excel has Name, Mobile, WhatsApp, Lead Source, Notes, Owner, Status

### E. Edge cases

- [ ] Submit without consent → blocked
- [ ] Invalid mobile (not 10 digits) → error
- [ ] Expired token (clear `counsellorToken` in DevTools) → redirect to login
- [ ] Gemini down / wrong key → lead still saved, template reading shown

---

## 6. Production deploy checklist

### Backend (e.g. Render)

Add env vars:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
FREE_CONSULTATION_LLM_TIMEOUT_MS=10000
GEMINI_MAX_RETRIES=3
COUNSELLOR_BOOTSTRAP_EMAIL=...
COUNSELLOR_BOOTSTRAP_PASSWORD=...
COUNSELLOR_BOOTSTRAP_NAME=...
JWT_SECRET=...
MONGO_URI=...
```

- [ ] Deploy backend
- [ ] Check deploy logs for `✅ CONNECTION SUCCESSFUL`
- [ ] Run `npm run verify:gemini` against production if SSH available, or submit one test lead

### Frontend (e.g. Vercel)

```env
VITE_API_URL=https://your-backend-host.com
```

- [ ] Deploy frontend
- [ ] Open `https://yoursite.com/counsellor/login`
- [ ] Full test lead on production desk
- [ ] Admin export on production

### Security

- [ ] `GEMINI_API_KEY` only on backend — never in frontend env
- [ ] Strong counsellor passwords
- [ ] HTTPS on both frontend and API
- [ ] Share counsellor URL only with team (not public nav)

---

## 7. How to confirm “ready for live calls”

| Check | Pass criteria |
|-------|----------------|
| Gemini | `verify:gemini` OK + test lead shows **AI generated** |
| Lead save | Lead visible in admin within seconds |
| Fallback | If AI fails, template reading still shows (no blank screen) |
| Export | NeoDove file opens and columns look correct |
| Counsellor UX | Login, form, reading, logout smooth on mobile + desktop |

**Go-live signal:** One counsellor completes a full mock call (login → form → reading → close) on staging/production without errors.

---

## 8. Quick reference — URLs & APIs

| What | Path |
|------|------|
| Counsellor login | `/counsellor/login` |
| Counsellor desk | `/counsellor/desk` |
| Admin leads | Admin → Free Consultation |
| Login API | `POST /api/free-consultation/auth/login` |
| Submit lead | `POST /api/free-consultation/leads` |
| List leads | `GET /api/admin/free-consultation/leads` |
| Export | `GET /api/admin/free-consultation/export` |
| Create counsellor | `POST /api/admin/counsellors` |

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| 429 on readings | `GEMINI_MODEL=gemini-1.5-flash`, enable billing, retry |
| Startup OK but AI fails | Model has no generation quota — change model |
| Template reading always | Check backend logs; run `verify:gemini` |
| Login fails | Bootstrap env vars; MongoDB up |
| 401 on submit | Re-login counsellor |
| Export empty | Submit lead first; check date filters |

---

*DS Astrology · Internal · Jul 2026*
