# Free Consultation Lead Funnel

**DS Astrology — Implementation Blueprint**  
**Version:** 1.1  
**Status:** Planning  
**Audience:** Sales / counsellor team · IT / development  
**Confidential — internal use only**

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Funnel overview (7 stages)](#2-funnel-overview-7-stages)
3. [Brand & compliance guardrails](#3-brand--compliance-guardrails)
4. [Lead capture form schema](#4-lead-capture-form-schema)
5. [Technical architecture](#5-technical-architecture)
6. [AI reading specification](#6-ai-reading-specification)
7. [Fallback reading (when AI fails)](#7-fallback-reading-when-ai-fails)
8. [NeoDove export](#8-neodove-export)
9. [Counsellor call script](#9-counsellor-call-script)
10. [Design decisions (v1)](#10-design-decisions-v1)
11. [Open decisions](#11-open-decisions)
12. [External services required](#12-external-services-required)
13. [Integration with existing codebase](#13-integration-with-existing-codebase)
14. [Suggested implementation phases](#14-suggested-implementation-phases)

---

## 1. Executive summary

### One-line system

> Viral astrology video → caller dials in for a free reading → counsellor captures details on a DS-branded web tool → AI generates a warm preliminary reading on screen → counsellor delivers it and closes on a paid consultation, demo class, or course → lead is exported to NeoDove for follow-up.

### Purpose

A new **lead-generation and conversion system** from first social-media view to final paid sale. Written for:

- **Sales / counsellor team** — how the live call works
- **IT team** — what to build, without breaking the current website

### v1 scope

| In scope | Out of scope (later) |
|----------|----------------------|
| Counsellor web form + login | Auto-dialer / IVR integration |
| Lead save to database | NeoDove direct API push |
| AI preliminary reading + fallback | WhatsApp bot automation |
| Admin export to NeoDove Excel format | Caller ID / telephony webhooks |
| Manual inbound calls (counsellor answers phone) | Fear-based or medical predictions |

---

## 2. Funnel overview (7 stages)

| Stage | Name | Owner | What happens | System action |
|-------|------|-------|--------------|---------------|
| 0 | Content engine | Marketing | Reels / Shorts end with CTA: “Call now for a FREE live consultation.” Single phone / WhatsApp shown. | None (organic traffic) |
| 1 | Inbound call | Counsellor | Viewer calls. Counsellor answers with approved opening (§9). | None |
| 2 | Lead capture | Counsellor + IT tool | Counsellor fills DS-branded form live on call. Consent read aloud + ticked before submit. | `POST /api/free-consultation/leads` |
| 3 | AI preliminary reading | System | On submit: save lead → call LLM → return formatted reading on same page (~8–10 s). | LLM API + fallback |
| 4 | Deliver reading | Counsellor | Reads lucky number, colour, nature, current phase from screen. Uses deflections for “how do you know?” | Display only |
| 5 | The close | Counsellor | Sells “specificity gap”: free read is general; full chart needs birth time + Damini ma’am. Offers consultation / demo / course. | Optional: link to existing booking |
| 6 | NeoDove follow-up | Ops + counsellor | Lead exported to NeoDove Excel format. Status tracked (called / interested / converted). | Admin export button |

---

## 3. Brand & compliance guardrails

These protect the brand, Damini ma’am’s name, and ad/payment accounts (Meta, YouTube, Razorpay, WhatsApp Business suspend accounts for misrepresentation).

### How the team introduces itself

Counsellors say they are **“from Damini ma’am’s consultation team”**, offering a **free preliminary reading**. Truthful, legally safer, and sets up the paid close.

### Consent (DPDP Act 2023)

Counsellor **must read aloud** and **tick consent** before submit:

> **“Aapki di gayi details hum aapko astrology consultation aur DS Astrology ki services ke baare mein contact karne ke liye use karenge. Kya aap iske liye sahmat hain?”** → tick **Yes**.

### What we never do

- Never claim the counsellor is a trained astrologer.
- Never generate frightening predictions (death, illness, accidents) or invent specific past traumas.
- Never give medical, legal, or financial guarantees.
- See [§6 AI prompt guardrails](#6-ai-reading-specification).

---

## 4. Lead capture form schema

DS-branded form filled **during the live call** by the counsellor (not self-serve public form).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Text | Yes | As on records |
| Mobile Number | Phone (10-digit) | Yes | Primary key for dedup |
| WhatsApp Number | Phone + “same as mobile?” toggle | Yes | Used for follow-up |
| Age | Number | Yes | Auto-calc from DOB if possible |
| Gender | Male / Female / Other | Yes | — |
| Date of Birth | Date picker | Yes | — |
| Time of Birth | Time picker + “unknown” option | Recommended | Needed for paid full chart |
| Place of Birth | Text (city, state) | Yes | — |
| Marital Status | Single / Married / Other | Yes | — |
| Reason for Calling | Short text (caller’s words) | Yes | **Biggest driver of the close** |
| Consent | Checkbox | Yes | Must be ticked to submit (DPDP) |
| Counsellor Name / ID | Auto from login | Yes | Lead ownership in NeoDove |

---

## 5. Technical architecture

### 5.1 High-level flow

```
Counsellor browser (leads.dsastrology.com)
    → POST /api/free-consultation/leads
        → (a) Validate + save lead to MongoDB (always first)
        → (b) Call LLM API with prompt template
        → (c) Return reading JSON to same page
    → Admin panel: filter + export NeoDove .xlsx
```

### 5.2 Layer recommendations

| Layer | Approach |
|-------|----------|
| **Frontend** | New isolated route/module: counsellor SPA on subdomain (e.g. `leads.dsastrology.com`). Responsive. Per-counsellor login. **Do not modify** public Home / Courses pages. |
| **Backend** | Extend existing Node.js/Express backend with **new routes + model fields**, not changes to existing lead payment flows. |
| **Database** | Extend MongoDB `Lead` collection (new `type: 'Free-Consultation'`) or separate `FreeConsultationLead` collection to avoid breaking admin filters. |
| **LLM** | Server-side only. Paid API recommended (OpenAI / Anthropic / Gemini). Timeout ≈ 8–10 s. |
| **Admin** | Extend `AdminLeads` or new admin tab: view, filter by date/counsellor, export NeoDove format. Reuse existing `exceljs` export pattern. |
| **Hosting** | HTTPS. API keys in backend `.env` only — never in browser. |

### 5.3 Reading generation — request flow

1. Counsellor submits form → backend validates required fields + consent.
2. Backend **stores lead immediately** (no lead lost if AI fails).
3. Backend fills prompt template (§6) and calls LLM API (timeout ≈ 8–10 s).
4. **Success** → return formatted reading to page.
5. **Timeout / error / refusal** → return fallback reading (§7). Log failure for monitoring.

### 5.4 Suggested API endpoints (new, additive)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/free-consultation/auth/login` | Counsellor login |
| `POST` | `/api/free-consultation/leads` | Create lead + generate reading |
| `GET` | `/api/admin/free-consultation/leads` | List / filter (admin) |
| `GET` | `/api/admin/free-consultation/export` | NeoDove Excel download |

---

## 6. AI reading specification

### Prompt template

Send to LLM with form placeholders filled in:

```
You are writing a short, warm, encouraging PRELIMINARY Vedic-astrology reading for a caller,
based only on their name and date of birth. Audience is Indian; tone is warm, positive and
specific-sounding. Do NOT predict death, illness, accidents or disasters. Do NOT invent specific
past traumatic events. Keep it general but personal.

Caller: Name {name}; DOB {dob}; Time of birth {tob or 'unknown'}; Gender {gender};
Reason for calling {reason}.

Return ONLY this format, nothing else:

Lucky Number: …  |  Lucky Colour: …
Your Nature (2–3 warm lines about their temperament and strengths).
Your Current Phase (2–3 lines about the general energy around this period of life, gently
touching their reason for calling in a hopeful way).
What Your Full Chart Will Reveal (2–3 lines: to answer their specific questions on {reason},
and to give exact timing and remedies, a complete reading needs their birth TIME and a live
session with the astrologer).
```

### On-screen display (4 blocks)

1. Lucky Number | Lucky Colour  
2. Your Nature  
3. Your Current Phase  
4. What Your Full Chart Will Reveal *(built-in bridge to the close)*

---

## 7. Fallback reading (when AI fails)

**Critical for live calls** — counsellor must never see a blank screen.

| Condition | Action |
|-----------|--------|
| LLM slow (>10 s) | Return fallback immediately |
| LLM error / refusal | Return fallback |
| Empty response | Return fallback |

**Fallback logic:** Compute sun sign from DOB (reuse existing `astrologyUtils` / zodiac helpers in backend). Return one of **12 pre-written warm templates** (one per rashi/sign). Log AI failure for IT monitoring.

**Owner:** Content team writes 12 fallback readings before go-live (see [§11](#11-open-decisions)).

---

## 8. NeoDove export

NeoDove imports leads via **Excel/CSV**. v1 uses manual export (reliable). Direct API push can be evaluated later.

### Export column mapping

| NeoDove column | Source field |
|----------------|--------------|
| Name | Full Name |
| Mobile Number | Mobile Number |
| Alternate/WhatsApp | WhatsApp Number |
| Lead Source | Fixed: `Free Consultation – Social` |
| Notes / Remarks | Age, Gender, DOB, TOB, Place, Marital status, Reason (combined) |
| Owner / Agent | Counsellor Name / ID |
| Status | Fixed: `New` (updated inside NeoDove) |

> **Before go-live:** Confirm exact column headers against your live NeoDove import template.

### NeoDove API vs Excel

| Approach | v1 | Later |
|----------|----|-------|
| Excel export from admin | ✅ Recommended | Keep as backup |
| NeoDove REST API | ❌ Not required | If plan supports it |

---

## 9. Counsellor call script

### Opening

> “Namaste! DS Astrology mein aapka swagat hai. Main Damini ma’am ki consultation team se baat kar raha/rahi hoon. Aaj main aapko ek free preliminary reading dunga/dungi — bas shuru karne se pehle aapki kuch details le leta/leti hoon.”

### While filling the form

- Collect details conversationally.
- Read consent line before submit.
- Ask reason warmly: *“Aap khaas kis cheez ke baare mein jaanna chahte hain — career, rishtey, paisa, ya kuch aur?”*

### Deflections (“why / how do you know?”)

- *“Ye aapke naam aur date of birth ke basis pe ek general reading hai — isliye ye sirf ek jhalak hai.”*
- *“Aapke exact answers aapke full chart mein hain.”*
- *“Uske liye aapka birth time chahiye hota hai, aur Damini ma’am khud aapki kundli dekhti hain.”*
- Never bluff astrology knowledge.

### The close

> “Jo maine abhi bataya wo ek general reading thi. Aapke asli sawaalon ke jawaab, sahi timing aur remedies — ye sab aapke poore chart mein hote hain, jo Damini ma’am khud live dekhti hain. Main aapke liye wo consultation book kar deta/deti hoon?”

Offer based on interest: (1) paid live consultation, (2) demo class, (3) course. Update status in NeoDove.

---

## 10. Design decisions (v1)

### a) Honest team introduction (not “I am an astrologer”)

A salesperson claiming to be a trained astrologer is exposed on recorded calls and risks ad/payment account bans. The “consultation team” framing is safer and converts better.

### b) Warm reading, not fear-based

Fear-based closes drive refunds and screenshots. Mainstream LLM APIs often refuse fear content, breaking the live call flow. Warm + curiosity (“your full chart holds the real answers”) closes as well with lower risk.

---

## 11. Open decisions

| # | Decision | Owner | Notes |
|---|----------|-------|-------|
| 1 | Which LLM provider + monthly budget | IT + management | See [§12](#12-external-services-required) |
| 2 | NeoDove Excel headers | Ops | Match live NeoDove account |
| 3 | Paid consultation / demo / course pricing in script | Sales | For close step |
| 4 | Subdomain + DNS | IT | e.g. `leads.dsastrology.com` |
| 5 | 12 fallback sign readings (content) | Content / astrology team | Hindi or Hinglish? |
| 6 | Counsellor accounts | Admin | Who creates / disables logins |

---

## 12. External services required

### Required for v1

| Service | Role | Notes |
|---------|------|-------|
| **LLM API (pick one)** | Generate preliminary reading | **OpenAI** (GPT-4o mini / GPT-4o), **Anthropic** (Claude), or **Google Gemini**. Paid tier recommended for reliability; free tiers have rate limits and refusals. Keys in backend `.env` only. |
| **NeoDove** | CRM + follow-up pipeline | Existing or new account. v1 = **Excel import** (no API required). Counsellors/ops use NeoDove UI for status updates. |
| **Dedicated phone number** | Inbound calls from ads | Telecom / business line (not a dev API). Same number on all social CTAs. Optional: **WhatsApp Business** number for “call or WhatsApp” CTA. |
| **MongoDB** | Lead storage | ✅ **Already in project** — extend schema, do not replace. |
| **Backend hosting** | API + LLM proxy | ✅ **Already deployed** — add new routes. |
| **Frontend hosting + DNS** | Counsellor subdomain | e.g. Vercel/Render + `leads.dsastrology.com` subdomain. |
| **HTTPS / SSL** | Secure form | ✅ Via hosting provider. |

### Already in project (reuse, no new vendor)

| Service | Current use |
|---------|-------------|
| **Razorpay** | Paid consultation / course close (existing checkout) |
| **SMTP / email** | Admin notifications (existing `sendEmail.js`) |
| **NodeJHora / ephemeris** | Sun-sign calculation for fallback readings (`astrologyUtils.js`) |
| **exceljs** | Admin lead Excel export (`leadController.js`) |

### Optional / phase 2 (not required for v1)

| Service | When |
|---------|------|
| **NeoDove REST API** | If plan includes API and ops wants auto-push |
| **Twilio / Exotel / Knowlarity** | If you want call tracking, IVR, or click-to-call later |
| **WhatsApp Business API** | Automated follow-up messages (separate from manual WhatsApp) |
| **Meta / YouTube APIs** | Not needed — marketing posts are manual |

### LLM provider comparison (quick reference)

| Provider | Env variable (example) | Pros | Cons |
|----------|------------------------|------|------|
| OpenAI | `OPENAI_API_KEY` | Fast, widely used, good instruction following | Cost per token |
| Anthropic | `ANTHROPIC_API_KEY` | Strong safety / refusal handling | Slightly higher latency |
| Google Gemini | `GEMINI_API_KEY` | Competitive pricing | Rate limits on free tier |

**Recommendation:** Start with **one** provider in staging; keep fallback templates so switching providers does not break live calls.

---

## 13. Integration with existing codebase

**Principle: additive only — no changes to public checkout, course player, or existing lead payment flows.**

| Existing piece | Path | How this feature uses it |
|--------------|------|--------------------------|
| Lead model | `backend/src/models/leadModel.js` | Add new `type` enum value `Free-Consultation` **or** new collection to avoid breaking `AdminLeads` filters |
| Lead API | `backend/src/controllers/leadController.js` | **New controller** `freeConsultationController.js` — do not mix with Razorpay lead creation |
| Admin leads UI | `frontend/src/pages/AdminLeads.jsx` | New filter tab or separate `AdminFreeConsultationLeads.jsx` |
| Excel export | `leadController.js` (exceljs) | Copy pattern for NeoDove column layout |
| Zodiac / sun sign | `backend/src/utils/astrologyUtils.js` | Fallback reading sign detection |
| Auth | `authMiddleware.js` | **New** counsellor role + JWT (separate from admin/student) |

### New frontend modules (isolated)

```
frontend/src/
  pages/counsellor/          # Counsellor login + live form + reading display
  components/free-consultation/
backend/src/
  controllers/freeConsultationController.js
  models/FreeConsultationLead.js   # optional separate model
  routes/freeConsultationRoutes.js
  services/llmReadingService.js
  data/fallbackReadings.js       # 12 sign templates
```

---

## 14. Suggested implementation phases

### Phase 1 — Foundation (no AI)

- Counsellor auth + lead form
- Save to DB with consent validation
- Admin list view

### Phase 2 — AI reading

- LLM service + prompt + timeout
- Reading display on counsellor page
- Error logging

### Phase 3 — Fallback + export

- 12 sign-based fallback templates
- NeoDove Excel export
- Dedup by mobile number

### Phase 4 — Ops polish

- Counsellor dashboard stats
- Optional NeoDove API
- Subdomain + production keys

---

## Document history

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | — | Original team rollout draft |
| 1.1 | Jul 2026 | Restructured for IT; mapped to existing codebase; external services table; phased plan |
| 1.2 | Jul 2026 | **Implemented** — counsellor desk, Gemini API, admin NeoDove export |

---

## Implementation status (v1.2)

### Routes

| URL | Who |
|-----|-----|
| `/counsellor/login` | Counsellor sign-in |
| `/counsellor/desk` | Live call form + AI reading |
| Admin → **Free Consultation** | Lead list + NeoDove export |

### Backend API (new, isolated)

| Method | Endpoint |
|--------|----------|
| `POST` | `/api/free-consultation/auth/login` |
| `POST` | `/api/free-consultation/leads` |
| `GET` | `/api/admin/free-consultation/leads` |
| `GET` | `/api/admin/free-consultation/export` |
| `POST` | `/api/admin/counsellors` |

### Environment variables (backend `.env`)

```env
GEMINI_API_KEY=your-key-from-google-ai-studio
GEMINI_MODEL=gemini-1.5-flash
FREE_CONSULTATION_LLM_TIMEOUT_MS=10000
GEMINI_MAX_RETRIES=3

COUNSELLOR_BOOTSTRAP_EMAIL=counsellor@example.com
COUNSELLOR_BOOTSTRAP_PASSWORD=your-secure-password
COUNSELLOR_BOOTSTRAP_NAME=Counsellor Name
```

Restart the backend after adding these keys.

---

*DS Astrology · Internal Blueprint · Confidential*
