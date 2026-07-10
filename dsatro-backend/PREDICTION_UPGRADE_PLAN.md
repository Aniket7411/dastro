# Free Consultation Reading — "Two-Brain" Upgrade Plan

Companion to [`updationneed.md`](../frontend/updationneed.md) (v1.1 spec). That doc describes the
target architecture in general terms; this doc maps it onto the **actual code that exists today**,
picks `astrologyapi.com` as the Brain 1 provider, and lists exactly what has to change.

Status: **planning only — nothing built yet.**

---

## 1. What already exists (audit)

The form → save-lead → admin panel → NeoDove export pipeline described in Parts F/G/H of the spec
is **already fully built**. Nothing needed there. The only weak link is the reading itself.

| Spec expectation | Reality in this repo |
|---|---|
| Brain 1 (calculator) computes facts | **Does not exist for this flow.** `freeConsultationController.js:submitFreeConsultationLead` calls `generatePreliminaryReading()` directly — no calculation step. |
| Brain 2 (LLM) only phrases pre-verified facts | `llmReadingService.js` asks Gemini to invent Rashi, lucky colour, "nature", and "current phase" from a free-text prompt ([llmReadingService.js:17-39](src/services/llmReadingService.js#L17-L39)). Only the **sun sign** is computed independently ([sunSignFromDob.js](src/utils/sunSignFromDob.js)), and only as a fallback-path input, not as ground truth fed to the LLM. |
| Deterministic lucky number/colour | **Broken today.** The prompt template never asks Gemini for a lucky number, but `parseReadingText` tries to parse one anyway ([llmReadingService.js:152](src/services/llmReadingService.js#L152)) — `luckyNumber` is silently always empty in production. |
| Two-level fallback | Only **one** level exists: any Gemini failure → generic sun-sign template ([fallbackReadings.js](src/data/fallbackReadings.js)). There's no "calc succeeded, LLM failed → format calc data directly" path, because there's no calc step to have succeeded. |
| A real ephemeris/calculation engine | **Already built, just not connected to this flow.** `astrologyService.js` + `astrologyUtils.js` wrap `@node-jhora/core` (JPL DE440s ephemeris) and already compute Moon sign, Nakshatra, Ascendant, planetary positions, and numerology (radical/destiny number) for the Kundli and Love-Match tools ([astrologyService.js:82-124](src/services/astrologyService.js#L82-L124)). |
| Mahadasha (current planetary period) | **Not implemented anywhere in the codebase.** This is the one real calculation gap. |
| Lat/lon from place name | **Not implemented for this flow.** The lead form only stores `pob` as free text ([FreeConsultationLead.js:38](src/models/FreeConsultationLead.js#L38)); nothing geocodes it. The Kundli tool requires the caller to already have lat/lon — it doesn't solve this either. |

**Bottom line:** this is not a greenfield "add Brain 1" project. It's (a) wiring the free-consultation
flow up to the calculation logic that already exists in-house, (b) filling the one real gap
(Mahadasha + geocoding), and (c) rewriting the LLM prompt so it narrates instead of invents.

---

## 2. Where astrologyapi.com fits

Since you're set on `astrologyapi.com`, here's what it should and shouldn't be used for, given what's
already built in-house:

| Fact needed | Source | Why |
|---|---|---|
| Sun sign | **Keep local** (`getSunSignFromDob`) | Pure date-range lookup, zero cost, zero latency, already correct. No reason to pay a credit for this. |
| Moon sign, Nakshatra, Ascendant | **Keep local** (`astrologyService.getKundaliData` via NodeJHora) | Already computed from a real ephemeris (JPL DE440s) for the Kundli tool — this is a legitimate "Brain 1", not the LLM guessing. Reusing it avoids per-call API cost and an extra network hop on a live sales call. |
| Lucky number / lucky colour | **Keep local** (`astrologyService.getNumerologyData`) | Already deterministic numerology from DOB/name, matching the spec's "quiet credibility fix" requirement exactly (Part D). |
| **Current Mahadasha** | **astrologyapi.com** (`vimsottari` / `current_chardasha` family of endpoints) | The one fact with no local implementation. This is the actual reason to bring in a paid vendor. |
| Geocoding (place name → lat/lon/timezone) | **astrologyapi.com's location endpoint if it has adequate India coverage; otherwise a separate lightweight geocoder** | Confirm during the API spike (Section 6) — astrologyapi.com's own docs are gated behind per-endpoint pages I can't fully verify without an account/Postman collection. |

This makes astrologyapi.com's role narrow and specific — one dasha call per lead — rather than
replicating calculations we've already paid engineering time to build correctly. It also matches the
spec's own framing in Part D ("Whatever we pick, the rest of the build does not change — only the one
calculation call does").

**Open decision for you:** if you'd rather have *all* astrological facts (sun/moon/nakshatra/numerology
included) come from astrologyapi.com for vendor-consistency and easier support/debugging — accepting
the extra credits cost and latency — that's a reasonable alternative. Flagging as Section 8.

---

## 3. Target flow for this feature only

```
Counsellor form (unchanged)
        |
        v
submitFreeConsultationLead()                    [freeConsultationController.js]
        |
        ├─(1)─► FreeConsultationLead.create()     — save lead immediately (unchanged, already correct)
        |
        ├─(2)─► BRAIN 1a (local): astrologyService
        |         - getSunSignFromDob(dob)
        |         - geocode(pob) → lat/lon/tzone         [NEW]
        |         - getKundaliData(...)  → moonSign, nakshatra   (skip if tobUnknown)
        |         - getNumerologyData(...) → luckyNumber, luckyColour
        |
        ├─(3)─► BRAIN 1b (astrologyapi.com): getCurrentMahadasha(dob, tob, lat, lon, tzone)
        |         (skip if tobUnknown or geocode failed — dasha needs birth time)
        |
        ├─(4)─► BRAIN 2 (Gemini): narrate the verified JSON from (2)+(3) — new prompt, Part E style
        |
        └─(5)─► Save reading + return to counsellor screen
```

Fallback ladder (per spec Part G, currently missing level 2):
- **Level 0 (happy path):** local calc + astrologyapi.com dasha + Gemini narration.
- **Level 1 — astrologyapi.com fails or times out:** proceed with local facts only (sun sign, moon
  sign/nakshatra if birth time known, lucky number/colour); Gemini narrates without a Mahadasha line.
- **Level 2 — Gemini fails but local/astrologyapi.com facts succeeded:** drop the verified JSON straight
  into a fixed text template (no AI). *This is the level that's entirely missing today* — right now any
  Gemini failure discards everything and falls back to a generic sun-sign-only template even if real
  facts were already computed.
- **Level 3 — everything fails:** existing generic sun-sign template (`fallbackReadings.js`), unchanged.

---

## 4. Concrete file changes

| File | Change |
|---|---|
| `src/services/astrologyService.js` | Add `geocodePlace(pob)` (Section 6) and a thin wrapper that assembles the "Brain 1 facts" object for a lead (sun sign + moon sign + nakshatra + numerology), reusing existing methods. |
| `src/services/astrologyApiClient.js` *(new)* | Thin client for astrologyapi.com: Basic Auth header from env vars, POST to the dasha endpoint, timeout ~5-8s, typed error so the controller can distinguish "vendor down" from "bad input". |
| `src/services/llmReadingService.js` | Replace `PROMPT_TEMPLATE`/`fillPrompt` with the Part E "verified-data" prompt — Gemini receives JSON facts and only phrases them. Remove Gemini's responsibility for Rashi/lucky colour/lucky number entirely (always computed, never asked of the LLM). Add the Level 2 fixed-template fallback. |
| `src/data/fallbackReadings.js` | Keep as Level 3 (unchanged). Add a new lightweight Level-2 template formatter (values → sentences, no AI, no per-sign copy needed since real values are known). |
| `src/models/FreeConsultationLead.js` | Extend `readingSchema` with `moonSign`, `nakshatra`, `mahadasha`, and change `source` enum from `['ai','fallback']` to `['ai','fallback-l1','fallback-l2','fallback-l3']` (or similar) so the admin panel / logs can distinguish *which* brain failed. |
| `src/controllers/freeConsultationController.js` | Orchestration only — call the new Brain 1 assembler, then astrologyapi.com dasha call, then Brain 2; pass richer `reading` object through to the response (already mostly pass-through). |
| `.env` / `.env.example` | Add `ASTROLOGYAPI_USER_ID`, `ASTROLOGYAPI_API_KEY`, `ASTROLOGYAPI_TIMEOUT_MS`. Server-side only, per spec's security requirement (Part G). |
| Geocoding provider | New env var(s) once Section 6 is resolved. |

No changes needed to: the lead form fields (Part F is already fully implemented, including the
"unknown birth time" checkbox), the admin panel, or the NeoDove export — all confirmed already built.

---

## 5. Gaps that block a clean implementation (need answers before coding)

1. **Geocoding.** astrologyapi.com's calculation endpoints need lat/lon + UTC offset, not a city
   string. The form only captures free-text `pob`. Need to confirm whether astrologyapi.com's own
   location-search endpoint has good Indian town/city coverage, or whether we need a separate
   geocoder (e.g. a static Indian-cities lookup table, or a small geocoding API). This is the single
   biggest technical unknown in this plan — recommend spiking it first (Section 7, Phase 1).
2. **astrologyapi.com exact request/response shape for Mahadasha.** Their docs are split across
   many gated per-endpoint pages (`current_chardasha`, `major_vdasha`, etc.) that aren't fully
   readable without a signed-in account/Postman collection. Needs a short hands-on spike once you
   have API credentials, before the client code is written for real.
3. **Existing `luckyNumber` bug.** Fixing this is a side effect of this upgrade (lucky number becomes
   a real computed value, sourced locally, never from the LLM) — no separate fix needed, but flagging
   so it's not mistaken for new scope.

---

## 6. Env vars to add

```
ASTROLOGYAPI_USER_ID=
ASTROLOGYAPI_API_KEY=
ASTROLOGYAPI_TIMEOUT_MS=6000
# Only if astrologyapi.com's own geocoding is insufficient:
GEOCODING_PROVIDER_API_KEY=
```

All server-side only (already the existing convention in this repo — `GEMINI_API_KEY` is handled the
same way).

---

## 7. Suggested build sequence

1. **Spike (0.5–1 day):** sign up for astrologyapi.com sandbox (50 free credits), confirm the exact
   dasha endpoint + request/response shape, and confirm whether its geocoding covers our caller base
   (mostly Tier-2/3 India towns from Instagram/YouTube leads). This resolves the two open gaps above
   before any production code is written.
2. **Brain 1 wiring:** build `astrologyApiClient.js`, extend `astrologyService.js` with the facts
   assembler, add geocoding.
3. **Brain 2 rewrite:** new Part-E-style prompt in `llmReadingService.js`, driven entirely by the
   Brain 1 JSON.
4. **Fallback Level 2:** fixed-template formatter for "calc succeeded, LLM failed".
5. **Model + admin panel:** extend `readingSchema`, verify the counsellor-facing reading screen and
   admin lead detail view render the new fields (moon sign, nakshatra, mahadasha) sensibly.
6. **Load/latency test:** confirm total request time (local calc + astrologyapi.com + Gemini) stays
   acceptable for a live call — spec targets ~5-8s calc timeout + ~8-10s LLM timeout; with a real
   external vendor now in the path this needs to be measured, not assumed.

---

## 8. Decisions for you to confirm

- **Scope of astrologyapi.com:** dasha-only (recommended, Section 2) vs. all facts including
  sun/moon/nakshatra/numerology re-sourced from the vendor instead of the existing local engine.
- **Geocoding approach:** astrologyapi.com's own location endpoint vs. a separate geocoder — pending
  the Section 7 spike.
- **Budget:** astrologyapi.com is credits/pay-per-call (no monthly minimum) — fine for variable call
  volume, but worth setting an expected leads/month number so we can estimate monthly cost once
  per-call credit pricing for the dasha endpoint is confirmed in the spike.
