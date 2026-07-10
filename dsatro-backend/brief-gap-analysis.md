# DS Astro Institute — Brief vs. Actual Codebase: Gap Analysis

Cross-check of `overallbrief.md` against the real backend (`/backend`) and frontend (`/frontend`) code as of 2026-07-04.

**Reality check up front:** the brief describes a from-scratch "student portal" build on Postgres/Supabase. The actual project is a much larger, already-mature multi-vertical platform (consultations, live astrologer chat, shop, blogs, jobs, tools, coupons, offers, leads/CRM) built on **MongoDB/Mongoose, not PostgreSQL**, with route names and data flows that differ from the brief throughout. Most core functionality exists — it's just structured differently and has real gaps in a few specific spots.

Legend: ✅ Done · 🟡 Partial · ❌ Missing

---

## 🔴 Top structural mismatches (read first)

- **Database is MongoDB, not PostgreSQL/Supabase-as-DB.** `package.json` has `mongoose`, not `pg`; all models are Mongoose schemas. Supabase is used only for file/video storage. Brief's entire Phase 1–2 assumes Postgres tables.
- **JWT is stored in `localStorage` on the frontend, not in memory** — `StudentLogin.jsx`, `AdminLogin.jsx`. The brief explicitly calls this out as the thing to avoid.
- **Online payments are globally switched off**: `frontend/src/config/payments.js` → `ONLINE_PAYMENT_ENABLED = false`. The whole Buy Now → Razorpay → verify pipeline (Phase 5/10) is code-complete but dormant; the live site runs an enquiry/lead-capture flow instead.
- **Almost every route path differs from the brief's literal paths** (table further down) — functionality mostly exists, just at different URLs.
- **Extra "admin approval" gate** sits between payment success and video access (`accessApproved`/`accessStatus`) that the brief never describes — a paid, enrolled student can still be 403'd on videos until an admin approves them.
- **Guest checkout is supported** (`optionalAuth`) — brief assumes login is required before `create-order`.

---

## Phase 1 — Environment Setup

- 🟡 Express deps: `express, dotenv, jsonwebtoken, nodemailer, cors, razorpay` present; `pg` absent (Mongo instead); `bcrypt` swapped for `bcryptjs`.
- ❌ Postgres/Supabase-as-DB: DB is MongoDB (`server.js` → `mongoose.connect`). Supabase used for storage only.
- ✅ Bunny.net config present (`BUNNY_API_KEY`, `BUNNY_LIBRARY_ID`, `BUNNY_TOKEN_KEY`), `src/utils/bunnyHelper.js`.
- ✅ Razorpay config present, `src/utils/razorpayConfig.js`.
- ✅ Gmail/nodemailer config present, `src/utils/sendEmail.js`.
- ✅ `.env` + `.gitignore` correctly set up.
- 🟡 Deployment target is ambiguous — `vercel.json` points to serverless `api/index.js`, but `ecosystem.config.cjs` (PM2) also exists, suggesting two competing deployment paths rather than the brief's clean Vercel+Railway split.

## Phase 2 — Database Design

All five core "tables" exist as Mongoose collections with the required fields, generally extended well beyond the brief's minimal spec:

- ✅ `users` — name, email, passwordHash, role (student/admin), createdAt.
- ✅ `courses` — title, description, price, validityDays, thumbnailUrl, isActive, createdAt + many extra fields (mrp, level, curriculum, FAQs).
- ✅ `course_videos` — courseId, title, bunnyVideoId, sortOrder + multi-provider fields (VdoCipher, Supabase storage path).
- ✅ `enrollments` — userId, courseId, validUntil, purchasedAt + extra `accessApproved`/`accessStatus`/`progress` fields not in the brief.
- ✅ `orders` — userId, courseId, razorpayOrderId, paymentStatus, amount, createdAt + coupon/discount fields.
- ✅ `consultations` — userId, courseId, preferredDatetime, notes, status, bookedAt + payment fields for a separate paid-consultation flow.
- ✅ Seed scripts exist for admin user / test course / test video (`seedStudent.js`, `seedCourseCatalog.js`, `seedRealCourses.js`).

## Phase 3 — Authentication

- ✅ `POST /api/auth/login` — `authController.js:login`.
- ✅ Auth middleware — `authMiddleware.js:protect` (+ `adminAuth` variant).
- ✅ `GET /api/auth/me` — `authController.js:getMe`.
- ⚠️ **Finding:** JWT secret has a hardcoded fallback (`'astro-admin-secret-2026'`) repeated in 3 files — if `JWT_SECRET` env var is ever unset in production, tokens sign with a secret baked into source. Violates Phase 15's "don't hardcode anything."

## Phase 4 — Courses & Catalogue

All items done, at the correct or near-correct paths:

- ✅ `GET /api/courses` (public, active-only) — `courseController.js:getActiveCourses`.
- ✅ `GET /api/courses/:id` — `getCourseById` (supports id or slug).
- ✅ `POST/PUT/DELETE /api/admin/courses` — create/update/soft-delete (`isActive:false`, never hard-deleted).
- ✅ Admin add video / reorder / delete video — all present in `courseController.js`.

## Phase 5 — Payment Flow

- ✅ `POST /api/payment/create-order` — but 🟡 allows **guest checkout** via `optionalAuth`, contradicting brief's "student must be logged in."
- ✅ `POST /api/payment/verify` — HMAC signature verification, creates enrollment with `validUntil`.
- ✅ Auto-generate + hash password, send credentials email on success.
- 🟡 Payment failure: order marked `failed` and JSON returned, but **no failure email is sent**.
- 🟡 Webhook exists but at `POST /api/webhooks/razorpay`, not `/api/payment/webhook` — functionally solid (HMAC + idempotency check), just a different URL than the brief specifies.

## Phase 6 — Secure Video Streaming

- ❌ **No dedicated `GET /api/video/token/:videoId` route exists.** Signed URLs are instead embedded directly in the response of `GET /api/student/course/:courseId/videos`.
- ✅ Enrollment + `validUntil` check happens before signing (`getCourseVideos`).
- 🟡 Signed URL expiry is **2 hours** (`getBunnyPlaybackInfo(..., 7200)`), or **1 hour** on the public preview path — brief asks for ~3 hours.
- ✅ Fresh URL generated every request, nothing cached.
- ⚠️ **Finding:** if Supabase-hosted video signed-URL generation fails, the code falls back to returning the **raw unsigned** video URL (`courseController.js` `resolveVideoPlayback`) — a potential unprotected-URL leak.

## Phase 7 — Student Portal APIs

- 🟡 Dashboard exists as `GET /api/student/courses` (not `/api/student/dashboard`) — same data, different path.
- 🟡 Course detail is **split** across `getCourseDetails` and `getCourseVideos` instead of one endpoint.
- 🟡 Book consultation is `POST /api/student/consultations` (not `/book-consultation`) — sends admin email only, **no confirmation email to the student**.
- ❌ **`GET /api/student/consultations` (student viewing their own booking) does not exist.**

## Phase 8 — Admin Panel APIs

- 🟡 `GET /api/admin/users` (not `/students`) — returns enrolled courses but **not `valid_until` per course**, only `accessStatus`.
- ❌ **No way for admin to directly set/extend a student's `valid_until` date.** Existing endpoints (`/enrollments/:id/access`, `/approve`) only toggle enable/disable/suspend flags — this breaks the brief's Test Plan item "extend a student's validity from admin panel."
- ✅ `GET /api/admin/orders`, `GET/PUT /api/admin/consultations` — present and working.
- 🟡 Banner CRUD exists at `/api/admin/banners` (pluralized) — done.
- ❌ **Announcement feature does not exist at all** — no model, controller, or route (repo-wide search confirms zero matches).

## Phase 9 — Email Automation

- 🟡 Payment success email — sent, subject line differs from brief's wording.
- ❌ **Payment failed email — not implemented.**
- ❌ **Consultation booking confirmation to student — not implemented** (admin-only alert exists).
- ✅ Consultation alert to admin — implemented.
- ❌ **Daily cron job for 7-day expiry reminders — does not exist.** No `node-cron`/scheduler dependency anywhere in the repo, no reminder email template.

## Phase 10 — Frontend: Public Website

- ✅ Homepage — hero (though CTA is "Book Consultation" not literally "Student Login"), about section, footer all present.
- ✅ Course preview strip — shows 4 cards (brief says 2–3), CTA is "Explore" not "Buy Now" since payments are off.
- 🟡 Course Catalogue — fetches and renders correctly, but CTA reads "Enquire" (payments disabled), no explicit validity-period text on cards.
- 🟡 Course Detail Page — **missing the "Go to My Course" branch** for already-enrolled logged-in students; always shows checkout/enquiry regardless of enrollment status.
- ✅ Checkout/Payment/Success/Failed pages — fully coded, just dormant behind the payments flag.
- 🟡 Student Login — works, but **stores JWT in `localStorage`, not memory** (explicit brief violation).

## Phase 11 — Frontend: Student Portal

- 🟡 Student Dashboard — enrolled course cards + validity pill exist, but **the "Enter Course" button is not disabled when validity has actually expired** (only disabled pre-admin-approval) — a direct brief violation.
- 🟡 Promotional banner — rendered as a card grid, not the "full-width banner image" the brief describes; functionally equivalent, visually different.
- ❌ **Dismissable announcement top bar — does not exist** anywhere in the frontend (matches backend gap).
- 🟡 Course Video Page (`CoursePlayer.jsx`) — the most spec-faithful area, with concrete gaps:
  - ❌ No per-video `GET /api/video/token/:videoId` fetch pattern — all video URLs come back in one bulk call.
  - 🟡 Keyboard blocking covers F12/Ctrl+S/Ctrl+Shift+I/J/C but **not Ctrl+U** (explicitly required by the brief).
  - 🟡 `pointer-events:none` is not applied to the video container (reasonable — would break playback controls — but diverges from spec wording).
  - 🟡 Visibility-API pause only works for native `<video>`; iframe-embedded (Bunny/VdoCipher) video is blurred+shielded instead of truly paused.
  - ✅ Watermark overlay with student identity, low opacity — done well.
  - ✅ Right-click disabled — done.
- 🟡 Free Consultation Booking — form and submit work, but **no display of a previously-booked consultation** (`GET /api/student/consultations` is never called from this page, consistent with that endpoint not existing on the backend).

## Phase 12 — Frontend: Admin Panel

- 🟡 Admin Login — works, but **no `GET /api/auth/me` role verification** on the frontend; `AdminDashboard.jsx` only checks token *presence*, not role.
- ✅ Admin Dashboard Home — summary cards + quick links, done.
- ✅ Course Manager — done, full CRUD + soft delete.
- ✅ Video Manager — done (up/down arrows, not drag-and-drop, which the brief allows either way).
- ❌ **Student Manager has no "Edit Validity" date picker and no "Revoke Access" button** — only a binary enable/disable/suspend toggle exists (`CourseAccessModals.jsx`), not date-based validity control. Matches the backend gap in Phase 8.
- 🟡 Orders — list works, well beyond spec even, but **no status filter control** (search box only).
- ✅ Consultations — list + mark done/cancel via status dropdown, done.
- 🟡 Banner CRUD done; **announcement text entry/clear does not exist** (matches backend/Phase 11 gap).

## Phase 13 — Security Lockdown

- ✅ Video routes check enrollment + validity before responding.
- ❌ **No rate limiting on `POST /api/auth/login`.** Only a global 1000-req/15-min limiter across all `/api/*` exists; a separate `apiLimiter` (100/15min) is wired only into `toolsRoutes.js`, never auth. Brute-force login is effectively unthrottled.
- 🟡 Input validation — no raw-SQL injection surface (it's Mongo), but `joi` validation is only used on 2 of ~15 controllers; no global sanitization middleware (e.g. `express-mongo-sanitize`), leaving a theoretical NoSQL-operator-injection surface on fields like `email` in login lookups.
- 🟡 CORS — allows the configured origin list, but **also unconditionally allows any origin when `NODE_ENV==='development'`**, any `localhost`/`127.0.0.1` origin, and any request with no `Origin` header. `.env` doesn't currently define `ALLOWED_ORIGINS` at all, so behavior depends entirely on `NODE_ENV` being set correctly in production.
- 🟡 Frontend keyboard/CSS/visibility/watermark protections — see Phase 11 details above (Ctrl+U gap, iframe pause gap).
- N/A HTTPS enforcement, Bunny dashboard settings — not verifiable from source, left to hosting platform/Bunny dashboard.

## Phase 14 — Testing

Not run as part of this audit (would require live environment + test Razorpay flow). Flagging that two test-plan items are currently **guaranteed to fail** given the gaps above:
- ❌ "Extend a student's validity from admin panel" — no such control exists (Phase 8/12 gap).
- ❌ "Manually set valid_until to yesterday, confirm Access Expired + Enter Course disabled" — dashboard doesn't disable the button on expiry (Phase 11 gap).

## Phase 15 — Launch

- 🟡 Env vars mostly centralized, except the hardcoded JWT fallback secret.
- 🟡 CORS/Bunny-referrer-to-live-domain mechanism exists via `.env` but is currently unset, and the `NODE_ENV` dev-bypass could defeat it if misconfigured at launch.
- ✅ Razorpay test→live switch is clean — purely driven by whether the key starts with `rzp_live_`, no code change needed.

---

## Route-path mismatches at a glance

| Brief's path | Actual path |
|---|---|
| `GET /api/student/dashboard` | `GET /api/student/courses` |
| `POST /api/student/book-consultation` | `POST /api/student/consultations` |
| `GET /api/student/consultations` | *(does not exist)* |
| `GET /api/video/token/:videoId` | *(does not exist — bundled into `/api/student/course/:id/videos`)* |
| `PUT /api/admin/enrollment/:id` | `PUT /api/admin/enrollments/:id/access` / `/approve` (no validUntil control) |
| `GET /api/admin/students` | `GET /api/admin/users` |
| `POST/GET /api/admin/banner` | `POST/GET /api/admin/banners` |
| `POST /api/payment/webhook` | `POST /api/webhooks/razorpay` |
| `POST /api/admin/announcement` | *(does not exist)* |

---

## Priority punch-list (highest impact first)

1. **Add admin "extend/revoke validity" control** — real gap in both API (Phase 8) and UI (Phase 12); breaks a core admin workflow and a test-plan item.
2. **Disable "Enter Course" when `valid_until` has passed** on the student dashboard — currently only gated on admin-approval, not expiry.
3. **Add login rate limiting** (5 attempts/15min/IP) — currently unthrottled beyond a generic global cap.
4. **Move JWT to in-memory storage on the frontend**, and remove the hardcoded JWT secret fallback on the backend.
5. **Add the missing emails**: payment-failure, student consultation confirmation, 7-day expiry reminder (needs a cron job — none exists today).
6. **Decide on the announcement-strip feature** — either build it (backend model/route + frontend dismissable bar) or formally drop it from scope.
7. **Add `GET /api/student/consultations`** so students can see their existing booking, and wire it into the frontend.
8. Tighten CORS so the `NODE_ENV==='development'` bypass can't accidentally ship to production with an open origin policy.
9. Decide/confirm intentionally: MongoDB instead of Postgres, guest checkout, and the admin-approval gate before video access — these are large deliberate-looking deviations from the brief that should be signed off rather than silently carried forward.
