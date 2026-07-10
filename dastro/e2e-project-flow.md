# DS Astro Platform - E2E Project Flow For Manual Testing

Last updated: 2026-06-03

## Purpose

Use this document to manually test the website after the latest merge. It explains how the project works end to end, what has been implemented so far, what each user/admin flow should do, and what still needs close verification.

## Local Setup

Backend:

```powershell
cd C:\Users\sharm\OneDrive\Desktop\Astrology\backend
npm.cmd run dev
```

Expected backend:

- Server runs on `http://localhost:5000`.
- `/health` returns success.
- MongoDB connection log appears.
- Bunny.net connection log appears:
  - success means Bunny API keys are working.
  - `401` means Bunny API key/library/token configuration is wrong.

Frontend:

```powershell
cd C:\Users\sharm\OneDrive\Desktop\Astrology\frontend
npm.cmd run dev
```

Expected frontend:

- Vite usually opens on `http://localhost:5173`.
- Frontend API calls use `http://localhost:5000` in local mode.

## Main Business Engines

The platform currently has these primary flows:

1. Live courses: lead generation only, no direct payment.
2. Recorded courses: paid purchase, student onboarding, secured video access.
3. Consultations: paid booking with Razorpay.
4. Shop: Shopify-managed flow, not fully built inside this repo.
5. Admin panel: leads, consultations, courses, coupons, content/admin management.

## Public Website Flow

### 1. Home Page

Start from:

```text
/
```

Check:

- Header navigation loads.
- Main homepage sections render.
- Links to courses, consultations, shop, student login, and contact pages work.
- No broken images in first viewport.

Expected:

- User can navigate to main business sections.

### 2. Live Course / Course Enquiry Flow

Pages:

```text
/courses
/courses/:courseId
```

User flow:

1. Open courses listing.
2. Select a live/non-premium course.
3. Open course detail.
4. Click enquiry CTA.
5. Fill name, phone, email, city/interest style fields.
6. Submit enquiry.

Expected:

- No payment is required.
- Lead should be stored in admin lead section.
- Lead should be identifiable as course/live course enquiry.

Need to verify manually:

- Correct lead type/status appears in admin.
- Required validation works.
- User gets success feedback.

### 3. Recorded Course Purchase Flow

Pages:

```text
/courses
/courses/:courseId
```

User flow:

1. Open a premium/recorded course detail page.
2. Confirm course price is visible.
3. Confirm 5-hour countdown timer appears near payment/enroll area.
4. Optionally apply coupon.
5. Click Buy/Enroll/Payment CTA.
6. Complete Razorpay payment.
7. Backend verifies payment.
8. Backend creates or updates student account.
9. Backend creates enrollment.
10. Backend sends student credentials email.
11. Admin receives course purchase email.

Expected:

- Successful payment creates active enrollment.
- Student can log in and see the purchased course.
- Course validity is shown.
- Course videos become available only to enrolled student.

Need to verify manually:

- Coupon discount is actually applied to final payment amount.
- Coupon usage count updates after successful payment.
- Failed payment is captured in admin with correct status.
- Abandoned payment is captured if required.
- Credentials email arrives.
- Admin purchase email arrives.

## Student Flow

### 1. Student Login

Page:

```text
/student-login
```

Flow:

1. Enter student email/mobile and password.
2. Submit login.
3. On success, student token is saved.
4. Student is redirected to dashboard.

Expected:

- Purchased courses appear in student dashboard.
- Invalid credentials show a proper error.

### 2. Forgot Password / OTP Reset

Flow:

1. Open student login.
2. Click Forgot Password.
3. Enter registered email.
4. Submit.
5. Check email for OTP.
6. Enter OTP and new password.
7. Login with new password.

Expected:

- OTP email is sent.
- OTP expires after configured time.
- New password works after reset.

Need to verify manually:

- SMTP settings are correct.
- Email lands in inbox and not spam.

### 3. Student Dashboard

Expected dashboard items:

- Purchased courses.
- Course validity.
- Course progress.
- Promotional/banner sections.
- New course/offer/merchandise sections if configured.

Need to verify manually:

- Dashboard does not show expired enrollments.
- Dashboard gracefully handles no purchased courses.

### 4. Student Course Player

Page:

```text
/course-player/:courseId
```

Flow:

1. Login as enrolled student.
2. Open purchased course.
3. Select video.
4. Watch video.
5. Book included/free consultation if needed.

Expected:

- Video loads from signed Bunny.net embed URL.
- Direct raw video URL is not exposed as plain upload file.
- Right-click is blocked inside player wrapper.
- Moving watermark is visible with student email/mobile.
- Progress API is called when selecting/watching video.
- Free consultation CTA appears inside course player.

Important security note:

- Browser screenshot/screen recording cannot be fully prevented by normal web code.
- Current implementation improves protection with Bunny signed URLs and watermark.
- DRM-level protection needs DRM-capable provider/setup.

## Consultation Flow

### 1. Consultation Listing

Pages:

```text
/book-consultation
/consultations
```

Flow:

1. Open consultation listing.
2. Check consultation cards.
3. Confirm service name, duration, and price are visible.
4. Click View Page or Book Now.

Expected:

- Detail route opens for each service.
- Book Now opens booking form/payment flow.

### 2. Paid Consultation Booking

Pages:

```text
/book-consultation/:serviceId
/consultations/:serviceId
```

Flow:

1. Open consultation detail.
2. Fill required form fields.
3. Click booking/payment CTA.
4. Razorpay order is created.
5. Complete payment.
6. Payment is verified.
7. Consultation record is marked paid.
8. Admin receives email notification.

Expected:

- Paid consultation enters admin consultation dashboard.
- Payment status becomes completed/paid.
- Transaction ID is stored.

Need to verify manually:

- Rs. 1 test consultation works.
- Failed payment status is captured.
- Abandoned payment intent is captured if required.
- Admin notification email arrives.

## Admin Flow

### 1. Admin Login

Page:

```text
/admin-login
```

Flow:

1. Login with admin credentials.
2. Admin token is saved.
3. Admin dashboard opens.

Expected:

- Protected admin APIs return data only with admin token.
- Without token, admin APIs return `401 Unauthorized`.

### 2. Admin Dashboard

Check:

- Dashboard stats load.
- Leads section loads.
- Consultations section loads.
- Courses/LMS Studio loads.
- Coupons section loads.
- Other admin sections do not crash.

Need to verify manually:

- Paid/unpaid statuses are visible and understandable.
- Filters/search work.
- Export actions work.

### 3. Admin Course Management / LMS Studio

Page:

```text
Admin Dashboard -> Courses / LMS Studio
```

Flow to create course:

1. Click New Course.
2. Enter title, description, price, validity.
3. Optionally enter thumbnail URL.
4. Add initial video by Bunny ID/URL or file upload.
5. Submit.

Expected:

- Loading overlay stays until course and video upload finish.
- If video upload fails, course modal stays open and lets admin retry.
- Course table shows correct video count.

Flow to edit course:

1. Click edit icon on course row.
2. Confirm existing videos are shown.
3. Edit course details.
4. Add/update/replace/delete video.

Expected:

- Existing Bunny video ID is visible.
- Copy ID button works.
- Preview button opens signed admin preview.
- Replace file updates video.
- Delete uses UI confirmation modal.

Flow to manage videos:

1. Click video/manage icon on course row.
2. See posted videos.
3. Add new video.
4. Edit existing video.
5. Preview existing video.
6. Delete video.

Expected:

- Posted video count updates.
- Course table video count updates.
- Bunny GUID remains visible for admin.

### 4. Admin Coupons

Flow:

1. Open admin coupons section.
2. Create coupon.
3. Edit coupon.
4. Disable coupon.
5. Delete coupon.
6. Apply coupon on course detail page.

Expected:

- Public coupon validation works.
- Invalid/expired coupon shows error.
- Course-specific coupon works only for matching course.

Need to verify manually:

- Discount affects final recorded-course payment amount.
- Usage count increments after successful payment.

### 5. Admin Consultation Management

Flow:

1. Book a consultation from public site.
2. Open admin consultations.
3. Verify new record appears.
4. Complete payment.
5. Verify paid status/transaction ID.

Expected:

- Paid consultation is visible.
- Admin notification email is sent.

## Backend API Smoke Checklist

Run these after backend starts:

```powershell
Invoke-RestMethod http://localhost:5000/health
Invoke-RestMethod http://localhost:5000/api/courses
Invoke-RestMethod http://localhost:5000/api/consultations/stats
```

Expected:

- Health returns success.
- Courses return `videoCount`.
- Consultation stats return total.

Protected routes without token should return `401`:

```powershell
Invoke-RestMethod http://localhost:5000/api/admin/stats
Invoke-RestMethod http://localhost:5000/api/student/courses
```

## Environment Variables To Confirm

Backend `.env` must include valid values:

```text
MONGO_URI
JWT_SECRET
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
EMAIL_USER
EMAIL_PASS
ADMIN_EMAIL
BUNNY_API_KEY
BUNNY_LIBRARY_ID
BUNNY_TOKEN_KEY
```

Do not commit `.env`.

## What Is Implemented So Far

- Admin LMS Studio UI improved.
- Course create/edit and video management improved.
- Bunny.net upload/ID/save/preview/playback implemented.
- Backend Bunny connection check added.
- Signed Bunny URLs added for student playback and admin preview.
- Student watermark and right-click block added.
- Course table video count fixed.
- Student forgot/reset password flow added.
- Paid consultation Razorpay flow added.
- Admin email notification paths added.
- Coupon frontend/admin/backend foundation added.
- Premium course countdown timer added.
- Latest main branch work has been merged into local main.

## Known Pending Items

1. Full manual browser QA.
2. Razorpay Rs. 1 consultation live test.
3. Recorded course purchase full test.
4. Coupon discount final payment integration verification.
5. Failed/abandoned payment lead capture verification.
6. Email delivery verification.
7. Final Shopify shop link/integration.
8. DRM decision if stronger screen recording protection is required.
9. Admin paid/unpaid status UX review.

## Suggested Manual Test Order

1. Start backend and frontend.
2. Test public homepage/navigation.
3. Test consultation listing/detail.
4. Test Rs. 1 consultation payment.
5. Test admin login and consultation record.
6. Test admin course create with Bunny video.
7. Test admin video preview/copy/edit/delete.
8. Test recorded course purchase.
9. Test student login/dashboard/course player.
10. Test forgot password OTP.
11. Test coupon creation and coupon apply.
12. Test lead/admin status coverage.

## Sign-Off Notes

Before telling TL it is ready for their testing:

- Confirm no critical console errors.
- Confirm no broken navigation.
- Confirm one payment success path works.
- Confirm one payment failure/cancel path is captured or list it as pending.
- Confirm one Bunny video plays for admin and student.
- Confirm one admin notification email arrives.
