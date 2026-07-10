

DS ASTRO INSTITUTE

STUDENT PORTAL — COMPLETE BUILD WORKFLOW

Sequential execution order for IT Developer  |  No deadlines — just do it in order


FRONTEND
React.js + Tailwind CSS	BACKEND
Node.js + Express + PostgreSQL	SERVICES
Bunny.net · Razorpay · Nodemailer


PHASE 1  ›  ENVIRONMENT SETUP

📌  Complete ALL of these before writing any product code. No skipping.

1	Create GitHub repository with two folders inside: /client (React) and /server (Node)
2	Initialize React app inside /client using Vite — install Tailwind CSS
3	Initialize Node.js + Express app inside /server — install dependencies: express, pg, bcrypt, jsonwebtoken, nodemailer, cors, dotenv, razorpay
4	Set up PostgreSQL database — use Supabase free tier for cloud DB (easiest to start)
5	Create Bunny.net account — go to Stream section — create a new Video Library — copy API key
6	In Bunny.net Stream settings: DISABLE MP4 fallback download — ENABLE token authentication — set Allowed Referrers to your domain only
7	Create Razorpay account — go to test mode — copy Key ID and Key Secret
8	Set up Gmail account for transactional emails — enable 2FA — create App Password
9	Create a .env file in /server — add all keys: DB connection string, JWT secret, Bunny API key, Razorpay keys, Gmail app password — add .env to .gitignore immediately
10	Deploy skeleton /client to Vercel and /server to Railway — confirm both are live before moving on


PHASE 2  ›  DATABASE DESIGN

📌  Create all tables first. Do not start building APIs until every table exists.

1	Create table: users — columns: id, name, email, password_hash, role (student / admin), created_at
2	Create table: courses — columns: id, title, description, price, validity_days, thumbnail_url, is_active, created_at
3	Create table: course_videos — columns: id, course_id, title, bunny_video_id, sort_order
4	Create table: enrollments — columns: id, user_id, course_id, valid_until, purchased_at
5	Create table: orders — columns: id, user_id, course_id, razorpay_order_id, payment_status, amount, created_at
6	Create table: consultations — columns: id, user_id, course_id, preferred_datetime, notes, status, booked_at
7	Insert one admin user manually into users table with role = admin and a hashed password
8	Insert one test course with one test video entry — use a dummy Bunny video ID for now


PHASE 3  ›  BACKEND — AUTHENTICATION

1	Build POST /api/auth/login — accept email + password — validate against users table — return signed JWT token on success
2	Build auth middleware — a function that reads JWT from request header and verifies it — attach user info to request object — use this on every protected route
3	Build GET /api/auth/me — protected route — returns logged in user's name and role — frontend uses this to decide what to show


PHASE 4  ›  BACKEND — COURSES & CATALOGUE

1	Build GET /api/courses — returns all active courses (is_active = true) — this is PUBLIC, no login required — used on the website course listing page
2	Build GET /api/courses/:id — returns one course's full detail — PUBLIC — used on course detail page
3	Build POST /api/admin/courses — admin only — creates a new course — accepts title, description, price, validity_days, thumbnail_url
4	Build PUT /api/admin/courses/:id — admin only — updates any course field
5	Build DELETE /api/admin/courses/:id — admin only — sets is_active = false (soft delete, never hard delete)
6	Build POST /api/admin/courses/:id/videos — admin only — accepts title and bunny_video_id — saves to course_videos table with sort_order
7	Build PUT /api/admin/courses/:id/videos/reorder — admin only — accepts new sort_order array — updates order in DB
8	Build DELETE /api/admin/courses/:id/videos/:vid — admin only — removes video record from DB


PHASE 5  ›  BACKEND — PAYMENT FLOW

🚫  This is the most critical flow. Test every step in Razorpay test mode before going live.

1	Build POST /api/payment/create-order — student must be logged in — creates a Razorpay order using course price — saves order to orders table with status = pending — returns order ID to frontend
2	Build POST /api/payment/verify — receives Razorpay payment details from frontend — verifies the payment signature using Razorpay secret — if valid: mark order as success, create enrollment record with valid_until = now + course validity_days
3	On successful enrollment: auto-generate a random password — hash it — save to user record — send login credentials email to student
4	On payment failure: return clear failure response — frontend shows failure page
5	Build POST /api/payment/webhook — Razorpay webhook as backup — handles cases where user closes browser before verify fires — use this to catch any missed successful payments


PHASE 6  ›  BACKEND — SECURE VIDEO STREAMING

🚫  NEVER put Bunny.net video IDs or URLs directly in frontend code. ALL video access goes through this API only.

1	Build GET /api/video/token/:videoId — protected route — first check: is this student enrolled in the course this video belongs to? — second check: is valid_until date still in the future? — if both pass: generate a Bunny.net signed URL with 3 hour expiry — return signed URL to frontend
2	If enrollment check fails: return 403 Forbidden — frontend shows 'Access Expired' or 'Not Enrolled' message
3	Never cache or store the signed URL — generate fresh on every request — this ensures expired students cannot reuse old URLs


PHASE 7  ›  BACKEND — STUDENT PORTAL APIs

1	Build GET /api/student/dashboard — protected — returns list of all courses this student is enrolled in, each with valid_until date and course title/thumbnail
2	Build GET /api/student/course/:id — protected — checks enrollment + validity — if valid: returns ordered list of video titles and their IDs (NOT Bunny video IDs) — if expired: returns 403
3	Build POST /api/student/book-consultation — protected — saves consultation request to DB with preferred datetime and notes — sends email notification to admin
4	Build GET /api/student/consultations — protected — returns student's consultation booking details and status


PHASE 8  ›  BACKEND — ADMIN PANEL APIs

1	Build GET /api/admin/students — admin only — returns all students with name, email, enrolled courses, valid_until dates
2	Build PUT /api/admin/enrollment/:id — admin only — allows manual update of valid_until date (extend or revoke access)
3	Build GET /api/admin/orders — admin only — returns all orders with status, student name, course, amount, date
4	Build GET /api/admin/consultations — admin only — returns all consultation bookings
5	Build PUT /api/admin/consultations/:id — admin only — mark consultation as completed or cancelled
6	Build POST /api/admin/banner — admin only — save promotional banner image URL and text to a settings table
7	Build GET /api/admin/banner — returns current active banner — used in student dashboard
8	Build POST /api/admin/announcement — admin only — saves a text announcement — returned to all logged-in students


PHASE 9  ›  EMAIL AUTOMATION

1	Build email: Payment Success — subject: 'Your DS Astro Course Access is Ready' — body: student name, course name, login URL, email address, temporary password, note to change password on first login
2	Build email: Payment Failed — subject: 'Payment Unsuccessful' — body: short message with link to try again
3	Build email: Consultation Booking Confirmation — to student — confirms booking received, date/time requested
4	Build email: Consultation Alert — to admin email — notifies that a student has booked a consultation with their name, course, and preferred time
5	Build cron job (runs daily): check enrollments expiring in 7 days — send reminder email to those students with link to renew or buy new course


PHASE 10  ›  FRONTEND — PUBLIC WEBSITE

📌  Build all pages with DS Astro brand. Keep logo, colors, and font in a single theme config file so it can be reused for the Finance Institute later.

▸ Homepage
1	Hero section: institute name, tagline, two CTA buttons — 'Explore Courses' and 'Student Login'
2	Brief about section: what DS Astro Institute offers
3	Course preview strip: show 2–3 featured course cards with name, price, and Buy Now button
4	Footer: contact, social links, copyright

▸ Course Catalogue Page
1	Fetch all active courses from GET /api/courses and display as cards
2	Each card shows: course thumbnail, title, short description, price, validity period (e.g. 90 days access), Buy Now button
3	Clicking a card or Buy Now goes to the Course Detail page

▸ Course Detail Page
1	Full course description, what is covered, who it is for
2	Price, validity, and what is included (e.g. recorded sessions + 1 free consultation)
3	Buy Now button — if student is already logged in and enrolled, show 'Go to My Course' instead

▸ Checkout & Payment Page
1	Call POST /api/payment/create-order on page load — get Razorpay order ID
2	Open Razorpay payment modal with order ID
3	On payment success from Razorpay: call POST /api/payment/verify — if verified: redirect to Success page — if failed: redirect to Failed page

▸ Payment Success Page
1	Show: 'Payment Successful! Check your email for your login credentials' with the registered email shown
2	Link back to homepage and Student Login page

▸ Payment Failed Page
1	Show: 'Something went wrong with your payment. Please try again.'
2	Retry button that takes them back to the course detail page

▸ Student Login Page
1	Simple login form: email + password
2	Calls POST /api/auth/login — on success stores JWT in memory (not localStorage) — redirects to student dashboard
3	Show clear error message if credentials are wrong


PHASE 11  ›  FRONTEND — STUDENT PORTAL

▸ Student Dashboard
1	After login: fetch GET /api/student/dashboard — show enrolled course cards
2	Each course card shows: thumbnail, course name, validity date, and Enter Course button
3	If valid_until is in the past: show 'Access Expired' badge — disable Enter Course button — do not show videos
4	Promotional banner section: fetch GET /api/admin/banner — display full-width banner image with text below course cards
5	Announcement strip: fetch latest announcement from admin — show as a dismissable top bar in the portal

▸ Course Video Page
1	Fetch ordered video list from GET /api/student/course/:id
2	Display as a sidebar list of lesson titles — clicking a lesson loads its video
3	For each video: call GET /api/video/token/:videoId — receive signed Bunny.net URL — load it into the Bunny embed player via iframe
4	Do NOT show the raw Bunny video URL anywhere in the DOM or source code
5	Disable right-click on the entire video page
6	Block keyboard shortcuts: F12, Ctrl+S, Ctrl+U, Ctrl+Shift+I — add event listeners for these
7	Add CSS: user-select: none and pointer-events: none on the video container
8	Add Visibility API listener: when user switches tab or minimises window, pause the video immediately
9	Add a transparent watermark overlay on top of the video showing the student's email address in faint text — this deters screen recording sharing

▸ Free Consultation Booking
1	Below the video lesson list: show a section titled 'Book Your Free Astro Consultation with Damini Mam'
2	Add a note in italics: 'We recommend booking this consultation only after you have completed the full course, so you can discuss your chart and clear all doubts.'
3	Booking form: preferred date, preferred time, any notes or questions
4	On submit: call POST /api/student/book-consultation — show confirmation message: 'Your consultation request has been received. Damini Mam will confirm the slot shortly.'
5	Show previously booked consultation details if one already exists (from GET /api/student/consultations)


PHASE 12  ›  FRONTEND — ADMIN PANEL

📌  Admin panel is a separate login. Admin role is checked on every API call server-side. Never rely only on frontend role checks.

▸ Admin Login
1	Separate login page at /admin/login — same API (POST /api/auth/login) — after login check role from GET /api/auth/me — if not admin: redirect away

▸ Admin Dashboard Home
1	Summary cards: total students, active enrollments, total orders, pending consultations
2	Quick links to each admin section

▸ Course Manager
1	List all courses with active/inactive toggle, edit button, delete button
2	Add Course form: title, description, price, validity days, thumbnail image upload
3	Edit Course: pre-filled form with all existing data
4	Each course has a Manage Videos button that opens the video manager for that course

▸ Video Manager (per course)
1	List all videos for a course in order with drag-to-reorder or up/down arrows
2	Upload Video: admin enters video title — uploads video file to Bunny.net via Bunny API — on upload complete: save bunny_video_id and title to DB
3	Delete video: removes from DB and optionally from Bunny library

▸ Student Manager
1	List all students: name, email, enrolled courses, valid_until date
2	Edit Validity button: opens a date picker — admin sets new valid_until — calls PUT /api/admin/enrollment/:id
3	Revoke Access button: sets valid_until to today — student immediately loses access

▸ Orders
1	List all orders: student name, course, amount, payment status, date
2	Filter by status: success / failed / pending

▸ Consultations
1	List all consultation bookings: student name, course, requested date/time, notes
2	Mark as Done or Cancel buttons

▸ Banner & Announcements
1	Upload a banner image and enter banner text — this appears on every student's dashboard
2	Type an announcement text — this shows as the top bar strip in student portal — can be cleared when not needed


PHASE 13  ›  SECURITY LOCKDOWN

🚫  Do this as a dedicated pass — do not mix into other phases. Go through every item.

1	Bunny.net dashboard: confirm Token Authentication is ON for the video library	⚠ Must be done in Bunny settings panel
2	Bunny.net dashboard: confirm Allowed Referrers is set to your domain only — no wildcard	⚠ Critical — blocks hotlinking
3	Bunny.net dashboard: confirm MP4 fallback download is DISABLED	⚠ This is the main download prevention
4	Backend: every route that returns video data or token must first verify enrollment AND valid_until before doing anything else	⚠ No exceptions
5	Backend: add rate limiting on POST /api/auth/login — max 5 attempts per 15 minutes per IP — return 429 after limit	⚠ Prevents brute force
6	Backend: validate and sanitize all inputs on every POST and PUT endpoint — never pass raw user input into SQL queries — use parameterized queries only	⚠ SQL injection prevention
7	Backend: add CORS config — only allow requests from your exact frontend domain
8	Frontend: add event listeners to block F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I on the video page
9	Frontend: CSS on video container — user-select: none, -webkit-user-select: none, pointer-events on controls only
10	Frontend: Visibility API — document.addEventListener visibilitychange — if document.hidden is true: pause video
11	Frontend: watermark overlay — position absolute over video — show student email in very low opacity text — update dynamically from logged in user data
12	Confirm HTTPS is enforced on all deployed URLs — no HTTP fallback


PHASE 14  ›  TESTING — DO EVERY ITEM

🚫  Do not skip any test. Each one covers a different failure scenario.

1	Go to course catalogue page — confirm all active courses display correctly
2	Click Buy Now — complete a test payment using Razorpay test card (4111 1111 1111 1111)
3	Check that success email arrives with login URL, email, and password
4	Log in with the credentials from the email — confirm login works
5	Confirm enrolled course appears on dashboard with correct valid_until date
6	Enter course — confirm video list loads — play a video — confirm it streams correctly
7	Open browser dev tools network tab while video plays — confirm no direct MP4 URL is visible
8	Right-click on video — confirm no context menu or download option appears
9	Try to open the Bunny signed URL in a new tab — it should expire and fail within 3 hours
10	Manually set valid_until to yesterday in DB — reload student portal — confirm course shows 'Access Expired' and videos are inaccessible
11	Book a consultation — confirm booking saved — confirm both student and admin get emails
12	Log in as admin — create a new course, add a video, set validity
13	Extend a student's validity from admin panel — confirm student can access course again
14	Try to access a protected API route without a JWT token — confirm 401 is returned
15	Try to access an admin route as a student — confirm 403 is returned
16	Try more than 5 wrong logins — confirm you get locked out
17	Test on Chrome, Safari, Firefox, and mobile (iPhone and Android)


PHASE 15  ›  LAUNCH

1	Set all environment variables in Vercel dashboard (frontend) and Railway dashboard (backend) — do not hard-code anything
2	Point your domain to Vercel frontend — add custom domain in Vercel settings
3	Update Bunny.net Allowed Referrers to the live domain
4	Update CORS config in backend to the live frontend domain
5	Switch Razorpay from test mode to live mode — update Key ID and Key Secret in production .env
6	Do one real payment end to end with a real card — confirm everything works on live
7	Log in as admin on live site — confirm admin panel works fully
8	Set up UptimeRobot (free) to monitor your backend URL — alerts you if server goes down
9	Save all credentials, API keys, and admin URLs in a secure shared document and hand over to institute owner


DS Astro Institute  —  Confidential Internal Document  —  May 2026
