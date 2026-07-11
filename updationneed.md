DS ASTROLOGY
Free Consultation — Lead Funnel
IT Build Specification
Version 1.1  ·  The “Two-Brain” Accuracy Upgrade
Prepared for the DS Astrology IT / development team
Confidential — Internal Use Only
Part A · In Plain Words (read this first)
Before the technical detail, here is the whole system in everyday language so you understand what you are 
building and why. You do not need to know astrology to build this — you only need to know the flow.
The system in one sentence
A person watches our astrology video on Instagram or YouTube, calls our number for a “free reading,” our 
counsellor types their basic details into a web page, the page instantly shows a warm little reading for the 
counsellor to read aloud, and that reading is used to convince the person to book a paid session with Damini 
ma’am.
What actually happens, step by step
1. A caller dials in after seeing our video. A counsellor (our sales person, not an astrologer) picks up.
2. The counsellor opens our web tool and types the caller’s name, date of birth, birth time, birth place, and 
what they want help with (career, marriage, money, etc.).
3. The moment they press submit, the tool prepares a short, friendly reading — lucky number, lucky colour, 
a few lines about the person’s nature, and their current life phase — and shows it on screen.
4. The counsellor reads it out warmly, then says the real, detailed answers need Damini ma’am’s full 
reading — and books the paid session. That’s the sale.
5. The lead is saved and later exported to our follow-up tool (NeoDove).
Why we are making a new version (v1.1)
In version 1.0 we asked an AI (Google’s Gemini) to “do the astrology.” The problem: an AI language model 
does not actually calculate anything — it just writes text that sounds right. So the readings came out 
inconsistent and often wrong. If the same person called twice, they could get a different lucky number. On a 
recorded call, under Damini ma’am’s real name, that looks bad.
The fix, in one line
Use TWO brains instead of one — a proper astrology calculator (that does real maths) works out the facts, and 
the AI only writes those real facts into warm, simple language. Calculator for numbers, AI for words.
That is the entire v1.1 change. Everything below is the detail of how to wire those two brains together. The 
rest of the system — the form, the database, the follow-up export — barely changes.
Part B · What Changes in v1.1 (the technical summary)
Version 1.0 (current) Version 1.1 (this document)
Who does the astrology The LLM (Gemini) is asked to both 
calculate and write
A calculation API does the maths; the LLM 
only writes
Source of the values Invented by the model — inconsistent Real ephemeris calculation — consistent & 
repeatable
Lucky number / colour Made up by the LLM Deterministic (numerology from DOB/name) 
— same every time
LLM’s job Everything Narrator only: turn verified facts into warm 
lines
Fallback Sun-sign template on failure Two-level fallback (calc fail → LLM fail)
Note: swapping Gemini for a different LLM (Claude, GPT, etc.) does not fix this on its own — no language 
model calculates a chart. The calculation engine is the actual fix.
Part C · System Architecture
The two-brain flow
The counsellor’s browser talks to our backend. On submit, the backend does four things in order:
6. Save the lead to the database immediately (so no lead is ever lost, even if everything after fails).
7. Call the Astrology Calculation API (Brain 1) with the birth details → receive verified chart facts as JSON.
8. Call the LLM API (Brain 2), passing it those JSON facts → receive the warm, formatted reading.
9. Return the reading to the same page for the counsellor to read aloud.
Counsellor form (browser)
        |
        v
  BACKEND API  ──(1)──►  Database   (save lead first, always)
        |
        ├──(2)──►  BRAIN 1: Astrology Calculation API
        |               returns → rashi, nakshatra, sun sign,
        |                          mahadasha, lucky number/colour (JSON)
        |
        └──(3)──►  BRAIN 2: LLM API
                        input  → the JSON facts above
                        output → warm 4-block reading (text)
                                        |
                                        v
                          (4) shown on counsellor's screen
Components at a glance
Layer Recommended approach
Frontend Responsive single-page form on a DS subdomain (e.g. leads.dsastrology.com). Per
counsellor login. Works on mobile & desktop.
Backend / API Node.js/Express or Python/FastAPI. Endpoints: receive-lead, generate-reading, export. 
Orchestrates Brain 1 → Brain 2.
Brain 1 — Calculation Third-party Vedic astrology API (see Part D). Returns chart facts as JSON. Replaces ‘ask 
the AI to calculate’.
Brain 2 — Narrative Paid LLM API (Gemini/OpenAI/Anthropic). Writes only — never calculates. Prompt in Part 
E.
Layer
Recommended approach
Database
Managed SQL/NoSQL (PostgreSQL or Firebase). One ‘leads’ table. Excel is export-only, 
never the source of truth.
Admin panel
Password-protected: view/filter leads, one-click export to NeoDove .xlsx.
Hosting
Standard cloud (Vercel/Render/AWS). HTTPS on. All API keys server-side only — never in 
the browser.
Part D · Brain 1 — The Astrology Calculation Engine
This is the new piece. Instead of asking an AI to “do astrology,” we call a real calculation service that computes 
the chart from birth details using an astronomical ephemeris — the same kind of engine desktop Kundli 
software uses internally.
Why an API, not desktop Kundli software
Windows apps (Kundli, Parashara’s Light, Jagannatha Hora) are built for a human clicking, not for a live web 
call. Automating them is fragile, hard to scale, and a licensing grey area. A Vedic astrology API gives the 
identical calculations as clean JSON, made to be called from our backend.
What we need to fetch
Our free reading is deliberately light, so we only need a few values per caller:
• Sun sign — from date of birth alone.
• Moon sign (Rashi) + Nakshatra — needs date + time + place of birth.
• Current Mahadasha — the running planetary period (drives the ‘current phase’ lines).
• Lucky Number + Lucky Colour — from the numerology endpoint (or computed in code from DOB/name).
If birth time is unknown, degrade gracefully: use sun sign + numerology only, and skip moon sign / dasha. The 
reading still works.
Provider shortlist (verify live pricing on their sites)
Provider
Best for
Notes
Prokerala API
Easiest, low-risk start
Trusted India source, JSON, free plan + wallet-priced 
tiers, Vedic + numerology.
AstrologyAPI.com (Vedic 
Rishi)
Most comprehensive
Used by AstroTalk & Shaadi.com. Vedic, dasha, KP, 
numerology; can connect our own LLM.
VedicAstroAPI
Calc + AI in one vendor
Vedic + built-in AI chat with bring-your-own-LLM, 21 
languages incl. Hindi.
RoxyAPI
Highest stated accuracy
Calculations verified vs NASA JPL Horizons; AI-friendly 
JSON; from ~$39/mo.
Vedika.io
No subscription
Pay-per-call (~$0.006 per kundli call).
Recommendation for us
Start with Prokerala or AstrologyAPI.com — best India fit and both have the numerology values we need. 
Consider VedicAstroAPI if we later want the calculation and the Hindi narrative from a single vendor. 
Whatever we pick, the rest of this build does not change — only the one calculation call does.
Deterministic values — the quiet credibility fix
Lucky Number and Lucky Colour are pure numerology from the date of birth. Pull them from the API’s 
numerology endpoint (or compute in code). Because they are calculated, the same caller always gets the 
same values — which removes the biggest ‘this feels made up’ tell. These never touch the LLM.
Part E · Brain 2 — The LLM Narrative Layer (revised)
The LLM’s job is now narrow and safe: take the verified facts and phrase them warmly. It must not calculate, 
add numbers, or contradict the data. This both fixes accuracy and stops the model from refusing (it is no 
longer being asked to predict).
Revised prompt template
Fill the { } placeholders from Brain 1’s JSON, then send to the LLM:
You are the DS Astrology preliminary-reading writer. You do NOT
calculate anything. All astrological facts below are already
verified — treat them as true, never contradict or add to them.
Your only job: phrase them into a warm, positive, simple reading
for an Indian caller (easy Hindi-friendly English).
VERIFIED DATA (from calculation engine):
  Name:            {name}
  Sun sign:        {sun_sign}
  Moon sign/Rashi: {moon_sign}
  Nakshatra:       {nakshatra}
  Current Dasha:   {mahadasha}
  Lucky Number:    {lucky_number}
  Lucky Colour:    {lucky_colour}
  Reason for call: {reason}
RULES:
  - Warm, hopeful, simple. No fear (no death/illness/accident),
    no invented past events, no medical/legal/financial promises.
  - Use ONLY facts in VERIFIED DATA. Invent no numbers.
  - End on the 'specificity gap': real answers, timing and
    remedies need birth time + Damini ma'am's live full reading.
OUTPUT — exactly this format, nothing else:
  Lucky Number: {lucky_number}  |  Lucky Colour: {lucky_colour}
  Your Nature: (2-3 warm lines from moon sign / nakshatra)
  Your Current Phase: (2-3 lines from current dasha, gently
     touching {reason} in a hopeful way)
  What Your Full Chart Will Reveal: (2-3 lines — exact answers
     on {reason}, timing & remedies need birth time + live session)
Guardrails retained from v1.0 (compliance)
No frightening predictions, no invented traumas, no guarantees. Counsellors are “from Damini ma’am’s 
consultation team,” never “an astrologer.” DPDP consent line must be read and the consent box ticked before 
submit. These protect our Meta / YouTube / Razorpay / WhatsApp accounts and are non-negotiable in the 
build.
Part F · Lead Capture Form (unchanged — for reference)
The counsellor fills this live during the call. Birth time and reason-for-calling are the two critical additions from 
the first idea.
Field Type Required Notes
Full Name Text Yes As on records
Mobile Number Phone (10-digit) Yes Primary key for dedup
WhatsApp Number Phone + ‘same as mobile?’ Yes Used for follow-up
Age Number Yes Auto-calc from DOB
Gender Male / Female / Other Yes —
Date of Birth Date picker Yes Drives sun sign + numerology
Field
Type
Required
Notes
Time of Birth
Time picker + ‘unknown’
Recommended
Needed for moon sign & dasha
Place of Birth
Text (city, state)
Yes
Needed for accurate calc (lat/long)
Marital Status
Single / Married / Other
Yes
—
Reason for Calling
Short text
Yes
Biggest driver of the close
Consent
Checkbox
Yes
Must be ticked to submit (DPDP)
Counsellor Name / ID
Auto from login
Yes
Lead ownership in NeoDove
Build tip: the calculation API needs latitude/longitude, not a city name. Use the provider’s location-search 
endpoint (Prokerala, VedicAstroAPI and others include one) to turn “Lucknow, UP” into coordinates + 
timezone.
Part G · Data, Fallback, Export & Security
Reading-generation request flow
10.
11.
12.
13.
14.
Validate required fields + consent on submit.
Save the lead to the database immediately (never lose a lead).
Call Brain 1 (calculation API) with a short timeout (~5–8s).
Fill the Part E prompt with the returned JSON and call Brain 2 (LLM), timeout ~8–10s.
On success → show the reading. On any failure → fallback below.
Two-level fallback (critical — this is a live call)
Never let the counsellor see a blank screen
Level 1 — Calculation API fails: compute the sun sign from DOB in code (no external call) and use a stored, 
warm, pre-written template for that sign. Level 2 — LLM fails but calc succeeded: drop the verified values into 
a fixed text template (no AI wording needed). Log every failure so IT can monitor reliability of each brain 
separately.
NeoDove export schema
NeoDove column
Source field
Name
Full Name
Mobile Number
Mobile Number
Alternate/WhatsApp
WhatsApp Number
Lead Source
Fixed: “Free Consultation – Social”
Notes / Remarks
Age, Gender, DOB, TOB, Place, Marital status, Reason (combined)
Owner / Agent
Counsellor Name / ID
Status
Fixed: “New” (updated later in NeoDove)
Confirm exact headers against the live NeoDove import template before go-live. For v1 use the reliable 
Excel/CSV export; if the NeoDove plan supports an API, IT can later switch to an automatic push with no other 
change.
Security & configuration
• All API keys (calculation API + LLM) live server-side only — never shipped to the browser.
• HTTPS everywhere. Per-counsellor login. Store the DPDP consent flag + timestamp with each lead.
• Keep provider keys in environment variables / a secrets manager, not in code.
Part H · Suggested Build Sequence
15.
16.
17.
18.
19.
20.
Form + database + save-lead endpoint — get leads captured and stored first.
Integrate Brain 1 — sign up for one calculation API, wire the call, confirm the JSON we get back.
Integrate Brain 2 — feed that JSON into the revised prompt, render the 4-block reading on screen.
Fallbacks + logging — sun-sign templates and the values-only template.
Admin panel + NeoDove export — view/filter/export.
Polish — branding, mobile layout, consent capture, monitoring.
Part I · Open Decisions to Finalise
• Which calculation API (start with Prokerala or AstrologyAPI.com) and which LLM API + monthly budget.
• Confirm exact NeoDove Excel import headers against the live account.
• Final pricing for paid consultation / demo / course tiers to put in the counsellor script.
• Domain/subdomain for the form and who hosts it.
• Who writes the 12 fallback sign-based templates.
DS Astrology · Internal Build Specification · Version 1.1 · Confidential