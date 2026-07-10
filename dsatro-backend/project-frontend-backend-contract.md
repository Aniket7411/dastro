# DS Astro — Frontend–Backend API Contract

**Date:** 2026-06-11  
**Updated:** Complete endpoint list derived from all frontend pages.

---

## Requirement Match

| Requirement | Frontend status | Backend requirement |
|---|---|---|
| Main navigation | Aligned. SHOP, About, Contact all enabled. | No backend dependency. |
| Live courses listing | `/live-courses` filters `courseType = Live`. | `GET /api/courses` returns `courseType`, price, thumbnail, description. |
| Live course detail | `/courses/:id` enquiry-only UI for Live courses. | `GET /api/courses/:id` returns full details, curriculum, batch, FAQs. |
| Live enquiry form | 7-field enquiry: name, phone, email, city, age, interest, notes. | `POST /api/leads` stores `leadType = LIVE COURSE LEAD`. |
| Recorded courses listing | `/recorded-courses` filters recorded. Shows price, coupon, timer. | `GET /api/courses` returns price, modules count, level, duration. |
| Recorded course payment | Checkout modal → create order → Razorpay → verify. | `POST /api/payment/create-order`, `POST /api/payment/verify`. |
| Coupon system | Coupon box on recorded course detail page. | `POST /api/coupons/validate`, admin coupon CRUD. |
| 5-hour offer timer | Component `CourseTimer` with local countdown. | No backend unless timer must be server-controlled. |
| Student login | `/login` with forgot/reset password flow. | Student auth endpoints. |
| Student dashboard | Profile, enrolled courses, validity, materials, banners, offers. | Student dashboard endpoints. |
| Secured video player | Auth-gated, signed Bunny/VdoCipher URLs, watermark, progress tracking. | Secure playback URL generation per-session. |
| Free consultation CTA | "BOOK YOUR 1 FREE CONSULTATION" in CoursePlayer. | `POST /api/student/consultations`. |
| Consultation services | Service listing with paid Razorpay booking flow. | `POST /api/leads`, `POST /api/leads/verify-payment`. |
| Failed payment lead | PaymentFailed page and payment.failed handler. | `POST /api/leads/payment-failed`. |
| Shop / Shopify handoff | `/shop` reads Shopify URL from settings. | `GET /api/settings` returns `shopifyStoreUrl`. |
| Admin leads | Filter by type, status, payment status. | `GET /api/leads?type=&status=&paymentStatus=&search=&_limit=`. |
| Admin courses | Course CRUD + video management (Bunny + VdoCipher). | Full admin course and video endpoints. |
| Admin coupons | CRUD for discount codes. | Coupon endpoints with usage limits. |
| Admin students | View registered students, enrolled courses count. | `GET /api/admin/users`. |
| Admin consultations | View/manage free consultations booked by students. | `GET /api/admin/consultations`, `PUT /api/admin/consultations/:id`. |
| Admin orders | View all recorded course purchases. | `GET /api/admin/orders`. |
| Admin blog/articles | Full blog CRUD for admin, public listing and detail. | Blog endpoints (admin + public). |
| Admin jobs | Job posting CRUD + application management. | Jobs and applications endpoints. |
| Admin newsletter | Subscriber list with status toggle. | `GET /api/newsletter`, `PUT /api/newsletter/:id/status`. |
| Admin settings | Site config: name, social links, Razorpay key, Shopify URL. | `GET /api/settings`, `PUT /api/settings`. |
| Admin stats dashboard | 7 stat cards: purchases, consultations, enquiries, failed payments, total leads, articles, jobs. | `GET /api/admin/stats` returns all required counts. |
| Careers page | Public job listing + application form. | `GET /api/jobs`, `POST /api/jobs/apply`. |
| Email notifications | Admin email on paid consultation + paid recorded course. | Backend sends after payment verification. |

---

## Environment Variables

Backend `.env`:

```env
BUNNY_API_KEY=
BUNNY_LIBRARY_ID=
BUNNY_TOKEN_KEY=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=
FRONTEND_URL=http://localhost:5173
EMAIL_FROM=DS Institute <no-reply@dsinstitute.com>
SHOPIFY_STORE_URL=https://your-store.myshopify.com
VDOCIPHER_API_SECRET=
```

---

## Common Response Shape

```json
{
  "success": true,
  "message": "Optional message"
}
```

Top-level fields like `course`, `courses`, `leadId`, `orderId`, `keyId`, `amount`, `currency` must remain as top-level (not nested in `data`) for frontend compatibility.

---

## Public Course APIs

### `GET /api/courses`

Returns all active courses (Live + Recorded).

```json
{
  "success": true,
  "courses": [
    {
      "_id": "course_id",
      "title": "Medical Astrology Mastery",
      "description": "Short description",
      "thumbnailUrl": "/images/vedic_thumbnail.png",
      "price": 7200,
      "courseType": "Live",
      "validityDays": 180,
      "level": "Beginner",
      "instructor": "Instructor Name",
      "duration": "2 months",
      "modulesCount": 15,
      "videoCount": 20,
      "isActive": true
    }
  ]
}
```

`courseType` must be exactly `"Live"` or `"Recorded"`.

### `GET /api/courses/:courseId`

Returns full course detail including videos list (no signed URLs here).

```json
{
  "success": true,
  "course": {
    "_id": "course_id",
    "title": "Medical Astrology Mastery",
    "description": "Full description",
    "thumbnailUrl": "https://...",
    "price": 7200,
    "courseType": "Recorded",
    "validityDays": 180,
    "level": "Advanced",
    "instructor": {
      "name": "Instructor Name",
      "bio": "Short bio",
      "image": "https://..."
    },
    "topics": ["Topic 1", "Topic 2"],
    "longDesc": "Long HTML or text description",
    "curriculum": [
      { "title": "Module 1", "lessons": ["Lesson 1", "Lesson 2"] }
    ],
    "learningOutcomes": ["Outcome 1", "Outcome 2"],
    "batchDetails": {
      "startDate": "2026-07-06",
      "classCount": 20,
      "classDuration": "1 hour",
      "platform": "Zoom"
    },
    "faqs": [
      { "question": "Question?", "answer": "Answer." }
    ],
    "testimonials": [],
    "isActive": true
  },
  "videos": [
    {
      "_id": "video_id",
      "title": "Lesson 1",
      "sortOrder": 1,
      "videoProvider": "bunny",
      "bunnyVideoId": "bunny_video_id"
    }
  ]
}
```

---

## Lead APIs

### `POST /api/leads` — Universal Lead Create

**Live course enquiry payload:**

```json
{
  "name": "Aniket Sharma",
  "phone": "9876543210",
  "email": "aniket@example.com",
  "type": "Course-Inquiry",
  "courseName": "Medical Astrology Mastery",
  "courseType": "Live",
  "city": "Delhi",
  "age": 28,
  "interest": "Career astrology",
  "message": "Please call after 6 PM"
}
```

Backend must set: `leadType = LIVE COURSE LEAD`, `status = ENQUIRY RECEIVED`, `paymentStatus = NOT REQUIRED`.

**Recorded course enquiry payload (when payment not enabled):**

```json
{
  "name": "Aniket Sharma",
  "phone": "9876543210",
  "email": "aniket@example.com",
  "type": "Course-Inquiry",
  "leadType": "RECORDED COURSE LEAD",
  "status": "ENQUIRY RECEIVED",
  "paymentStatus": "NOT REQUIRED",
  "courseName": "Vedic Fundamentals",
  "courseId": "course_id",
  "courseType": "Recorded",
  "dob": "28",
  "pob": "Delhi",
  "message": "Interest: career\nNotes: Call after 6 PM"
}
```

**Consultation paid attempt payload:**

```json
{
  "name": "Aniket Sharma",
  "email": "aniket@example.com",
  "phone": "9876543210",
  "amount": 3600,
  "type": "Consultation",
  "consultationType": "Career Consultation",
  "dob": "1995-01-01",
  "tob": "10:30",
  "pob": "Delhi",
  "message": "Need career guidance"
}
```

**Response for paid consultation (Razorpay order):**

```json
{
  "success": true,
  "leadId": "lead_id",
  "orderId": "order_razorpay_id",
  "keyId": "rzp_test_xxx",
  "amount": 360000,
  "currency": "INR",
  "name": "Aniket Sharma",
  "email": "aniket@example.com",
  "phone": "9876543210",
  "isMock": false
}
```

> `isMock: true` tells frontend to skip the real Razorpay modal and simulate a successful payment for local testing (when `RAZORPAY_KEY_ID` is not set).

**Free/enquiry leads (no `amount`):** just return `{ "success": true, "leadId": "lead_id" }`.

---

### `POST /api/leads/verify-payment`

Used for paid consultations.

```json
{
  "leadId": "lead_id",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature"
}
```

Backend behavior:
- Verify Razorpay HMAC signature.
- Mark lead `paymentStatus = PAID`, `status = Consultation Lead - Paid`.
- Store `razorpay_payment_id`, `razorpay_order_id`.
- Send admin email with booking details.

Response: `{ "success": true }`.

---

### `POST /api/leads/payment-failed`

```json
{
  "leadId": "lead_id_optional",
  "orderId": "order_xxx",
  "courseId": "course_id_optional",
  "courseName": "Recorded Course Name",
  "consultationType": "Career Consultation",
  "paymentFor": "Recorded Course",
  "status": "Recorded Course Lead - Failed Payment",
  "paymentStatus": "FAILED",
  "failureReason": "Payment declined",
  "razorpayError": {
    "code": "BAD_REQUEST_ERROR",
    "description": "Payment failed",
    "source": "customer",
    "step": "payment_authentication",
    "reason": "payment_failed"
  }
}
```

Backend behavior:
- If `leadId` provided → update that lead.
- Else find lead by `orderId` → update.
- Else create minimal failed-payment record.
- Do NOT send paid notification email.

---

### `GET /api/leads`

Query params: `type`, `status`, `paymentStatus`, `search`, `_limit`, `_t` (cache-busting).

```json
{
  "success": true,
  "leads": [
    {
      "_id": "lead_id",
      "name": "Aniket Sharma",
      "phone": "9876543210",
      "email": "aniket@example.com",
      "type": "Consultation",
      "leadType": "LIVE COURSE LEAD",
      "status": "ENQUIRY RECEIVED",
      "paymentStatus": "NOT REQUIRED",
      "courseName": "Medical Astrology",
      "amount": 0,
      "razorpay_payment_id": "",
      "createdAt": "2026-06-01T10:00:00.000Z"
    }
  ]
}
```

### `PUT /api/leads/:id/status`

```json
{ "status": "Confirmed" }
```

Valid status values:
- `Enquiry Received`
- `Confirmed`
- `In Progress`
- `Done`
- `Not Interested`
- `LIVE COURSE LEAD`
- `Consultation Lead - Not Paid`
- `Consultation Lead - Paid`
- `Recorded Course Lead - Payment Initiated`
- `Recorded Course Lead - Paid`
- `Recorded Course Lead - Failed Payment`

### `DELETE /api/leads/:id`

Response: `{ "success": true }`.

---

## Payment Mode (Lead Capture vs Checkout)

### `GET /api/payment/status` (public)

Returns whether Razorpay keys are configured on the backend.

```json
{
  "success": true,
  "paymentEnabled": false,
  "mode": "lead_capture",
  "keyId": "",
  "message": "Lead capture mode — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env to enable checkout."
}
```

**Frontend behavior:**
- `paymentEnabled: false` → Live **and** Recorded courses show **ENQUIRE NOW**; leads stored for sales callbacks.
- `paymentEnabled: true` → Live stays enquiry-only; Recorded shows **BUY NOW** + Razorpay checkout.

`GET /api/settings` (public) also returns `paymentEnabled`, `paymentMode`, and `razorpayKeyId` when payment is active.

---

## Recorded Course Payment APIs

### `POST /api/payment/create-order`

Headers: `Authorization: Bearer <studentToken>` (optional)

```json
{
  "courseId": "course_id",
  "name": "Aniket Sharma",
  "email": "aniket@example.com",
  "mobile": "9876543210",
  "couponCode": "CREATOR20"
}
```

Response:

```json
{
  "success": true,
  "leadId": "lead_id",
  "purchaseId": "purchase_id",
  "orderId": "order_xxx",
  "keyId": "rzp_test_xxx",
  "amount": 720000,
  "currency": "INR",
  "name": "Aniket Sharma",
  "email": "aniket@example.com",
  "phone": "9876543210",
  "isMock": false
}
```

Backend behavior:
- Validate course exists and `courseType = Recorded`.
- Apply coupon discount if `couponCode` provided.
- Create purchase attempt with `paymentStatus = PENDING`.
- Create/update lead as `Recorded Course Lead - Payment Initiated`.
- Create Razorpay order.
- Return `isMock: true` when no real Razorpay keys configured.

### `POST /api/payment/verify`

```json
{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature",
  "email": "aniket@example.com",
  "name": "Aniket Sharma"
}
```

Backend behavior:
- Verify Razorpay HMAC signature.
- Mark purchase `paymentStatus = PAID`.
- Mark lead as `Recorded Course Lead - Paid`.
- Create student account if not exists (generate username + password).
- Link purchased course to student with validity from `course.validityDays`.
- Send student credentials email.
- Send admin paid-purchase notification email.

Response: `{ "success": true, "studentCreated": true }`.

---

## Coupon APIs

### `POST /api/coupons/validate`

```json
{
  "code": "CREATOR20",
  "courseId": "course_id",
  "purchaseAmount": 7200
}
```

Response:

```json
{
  "success": true,
  "coupon": {
    "code": "CREATOR20",
    "discountType": "percentage",
    "discountValue": 20,
    "discountAmount": 1440,
    "finalAmount": 5760
  }
}
```

### Admin Coupon CRUD (all require admin token)

- `GET /api/coupons`
- `POST /api/coupons`
- `PUT /api/coupons/:id`
- `DELETE /api/coupons/:id`

Coupon model:

```json
{
  "_id": "coupon_id",
  "code": "CREATOR20",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 1000,
  "usageLimit": 100,
  "usedCount": 5,
  "active": true,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

`discountType`: `"percentage"` or `"fixed"`.

---

## Student APIs

### `POST /api/student/login`

```json
{ "email": "student@example.com", "password": "generated-pass" }
```

Response:

```json
{
  "success": true,
  "token": "jwt_token",
  "student": {
    "_id": "student_id",
    "name": "Aniket Sharma",
    "email": "student@example.com",
    "mobile": "9876543210"
  }
}
```

### `POST /api/student/forgot-password`

```json
{ "email": "student@example.com" }
```

### `POST /api/student/reset-password`

```json
{ "token": "reset_token", "newPassword": "new_password" }
```

### `POST /api/student/logout`

Headers: `Authorization: Bearer <token>`

### Dashboard endpoints (all require `Authorization: Bearer <token>`)

- `GET /api/student/profile`
- `PUT /api/student/profile`
- `GET /api/student/courses`
- `GET /api/student/banners`
- `GET /api/student/merchandise`
- `GET /api/student/new-courses`
- `GET /api/student/offers`

**`GET /api/student/profile` response:**

```json
{
  "success": true,
  "profile": {
    "_id": "student_id",
    "name": "Aniket Sharma",
    "email": "student@example.com",
    "mobile": "9876543210",
    "enrolledCoursesCount": 2
  }
}
```

**`GET /api/student/courses` response:**

```json
{
  "success": true,
  "courses": [
    {
      "_id": "course_id",
      "title": "Recorded Course",
      "thumbnailUrl": "https://...",
      "progress": 45,
      "validUntil": "2026-12-31",
      "totalVideos": 20,
      "completedVideos": 9
    }
  ]
}
```

### Course player endpoints (all require token)

- `GET /api/student/course/:id`
- `GET /api/student/course/:id/videos` — returns signed/secured playback URLs
- `GET /api/student/course/:id/validity`
- `GET /api/student/course/:id/materials`
- `POST /api/student/video/progress`
- `POST /api/student/consultations`

**`GET /api/student/course/:id/videos` response:**

```json
{
  "success": true,
  "videos": [
    {
      "_id": "video_id",
      "title": "Lesson 1",
      "sortOrder": 1,
      "duration": 1800,
      "videoProvider": "bunny",
      "bunnyVideoId": "bunny_video_id",
      "signedEmbedUrl": "https://iframe.mediadelivery.net/embed/lib/vid?token=xxx&expires=1234567890",
      "isCompleted": false,
      "progressSeconds": 120
    }
  ]
}
```

For VdoCipher videos, return instead:

```json
{
  "videoProvider": "vdocipher",
  "vdocipherVideoId": "vdo_video_id",
  "otp": "generated_otp",
  "playbackInfo": "generated_playback_info"
}
```

**`GET /api/student/course/:id/validity` response:**

```json
{
  "success": true,
  "validity": {
    "validFrom": "2026-01-01",
    "validTill": "2027-01-01",
    "daysRemaining": 204
  }
}
```

**`POST /api/student/video/progress` payload:**

```json
{
  "courseId": "course_id",
  "videoId": "video_id",
  "isCompleted": true
}
```

**`POST /api/student/consultations` payload:**

```json
{
  "courseId": "course_id",
  "preferredDatetime": "2026-06-20T10:30:00",
  "notes": "Focus on career prediction",
  "mobile": "9876543210"
}
```

---

## Admin Course & Video APIs

All require `Authorization: Bearer <adminToken>`.

### Course CRUD

- `GET /api/courses` — public, no auth needed
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:id`
- `DELETE /api/admin/courses/:id`

**`POST/PUT /api/admin/courses` payload:**

```json
{
  "title": "Medical Astrology Mastery",
  "description": "Course description",
  "courseType": "Recorded",
  "price": 7200,
  "validityDays": 180,
  "thumbnailUrl": "/images/vedic_thumbnail.png"
}
```

### Video Management

- `POST /api/admin/courses/:courseId/videos` — add video by ID/URL
- `POST /api/admin/courses/:courseId/videos/upload` — upload video file
- `PUT /api/admin/courses/:courseId/videos/:videoId` — update video
- `DELETE /api/admin/courses/:courseId/videos/:videoId`
- `GET /api/admin/courses/:courseId/videos/:videoId/preview` — get signed preview URL

**Add video payload (no file):**

```json
{
  "title": "Lesson 1",
  "videoProvider": "bunny",
  "bunnyVideoId": "bunny_video_id",
  "sortOrder": 1
}
```

For VdoCipher:

```json
{
  "title": "Lesson 1",
  "videoProvider": "vdocipher",
  "vdocipherVideoId": "vdo_video_id",
  "videoId": "vdo_video_id",
  "sortOrder": 1
}
```

**Video model (stored in DB):**

```json
{
  "_id": "video_id",
  "courseId": "course_id",
  "title": "Lesson 1",
  "sortOrder": 1,
  "videoProvider": "bunny",
  "bunnyVideoId": "bunny_video_id",
  "vdocipherVideoId": "",
  "duration": 1800,
  "status": "ready",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

Bunny integration uses: `BUNNY_API_KEY`, `BUNNY_LIBRARY_ID`, `BUNNY_TOKEN_KEY` for signed URLs.

VdoCipher integration uses: `VDOCIPHER_API_SECRET` for OTP generation.

---

## Admin Stats

### `GET /api/admin/stats`

```json
{
  "success": true,
  "stats": {
    "recordedCoursePurchases": 20,
    "paidConsultations": 12,
    "liveCourseEnquiries": 40,
    "failedPayments": 5,
    "totalLeads": 120,
    "activeArticles": 8,
    "jobOpenings": 3
  }
}
```

---

## Admin Users (Students)

### `GET /api/admin/users`

```json
{
  "success": true,
  "users": [
    {
      "_id": "student_id",
      "name": "Aniket Sharma",
      "email": "student@example.com",
      "mobile": "9876543210",
      "enrolledCourses": [
        { "_id": "course_id", "title": "Medical Astrology Mastery" }
      ],
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Admin Consultations (Free — Student-Booked)

### `GET /api/admin/consultations`

```json
{
  "success": true,
  "consultations": [
    {
      "_id": "consult_id",
      "studentId": "student_id",
      "studentName": "Aniket Sharma",
      "courseId": "course_id",
      "courseName": "Medical Astrology",
      "mobile": "9876543210",
      "preferredDatetime": "2026-06-20T10:30:00",
      "notes": "Career focus",
      "status": "Pending",
      "createdAt": "2026-06-10T00:00:00.000Z"
    }
  ]
}
```

### `PUT /api/admin/consultations/:id`

```json
{ "status": "Confirmed" }
```

Valid status values: `Pending`, `Confirmed`, `Completed`, `Cancelled`.

---

## Admin Orders (Course Purchases)

### `GET /api/admin/orders`

```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "guestDetails": {
        "name": "Aniket Sharma",
        "email": "student@example.com",
        "phone": "9876543210"
      },
      "userId": {
        "_id": "student_id",
        "name": "Aniket Sharma",
        "email": "student@example.com"
      },
      "courseId": {
        "_id": "course_id",
        "title": "Medical Astrology Mastery"
      },
      "amount": 7200,
      "paymentStatus": "PAID",
      "razorpay_payment_id": "pay_xxx",
      "razorpay_order_id": "order_xxx",
      "createdAt": "2026-06-01T00:00:00.000Z"
    }
  ]
}
```

---

## Blog / Articles APIs

### Public

- `GET /api/blogs` — list published blogs (supports `?category=&search=&limit=`)
- `GET /api/blogs/:slug` — single blog detail

**`GET /api/blogs` response:**

```json
{
  "success": true,
  "blogs": [
    {
      "_id": "blog_id",
      "title": "Understanding Vedic Astrology",
      "slug": "understanding-vedic-astrology",
      "excerpt": "Short summary",
      "category": "Vedic Astrology",
      "image": "/images/blog1.png",
      "tags": ["astrology", "vedic"],
      "isPublished": true,
      "createdAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

### Admin (all require admin token)

- `GET /api/blogs/admin` — list all blogs (published + drafts)
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

**Blog create/update payload:**

```json
{
  "title": "Understanding Vedic Astrology",
  "slug": "understanding-vedic-astrology",
  "content": "Full HTML/markdown content",
  "excerpt": "Short summary",
  "category": "Vedic Astrology",
  "image": "/images/blog1.png",
  "tags": ["astrology", "vedic"],
  "isPublished": true
}
```

Categories used by frontend: `Vedic Astrology`, `Tarot`, `Numerology`, `Spiritual Remedies`, `Career & Finance`, `Love & Relationships`.

---

## Jobs & Careers APIs

### Public

- `GET /api/jobs` — list active job openings

**Response:**

```json
{
  "success": true,
  "jobs": [
    {
      "_id": "job_id",
      "title": "Astrology Instructor",
      "location": "Remote / Delhi",
      "type": "Full-Time",
      "department": "Education",
      "description": "Job description",
      "requirements": ["Req 1", "Req 2"],
      "salaryRange": "₹30,000 - ₹50,000/month",
      "isActive": true,
      "postedAt": "2026-06-01T00:00:00.000Z"
    }
  ]
}
```

- `POST /api/jobs/apply` — submit job application

**Apply payload (multipart/form-data for resume upload):**

```json
{
  "jobId": "job_id",
  "name": "Aniket Sharma",
  "email": "aniket@example.com",
  "phone": "9876543210",
  "coverLetter": "I am applying because...",
  "resumeUrl": "https://...(optional if file uploaded)"
}
```

### Admin (all require admin token)

- `GET /api/jobs` — all jobs including inactive
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `GET /api/jobs/applications?role=&status=&search=`
- `PUT /api/jobs/applications/:id`
- `DELETE /api/jobs/applications/:id`

**Job create/update payload:**

```json
{
  "title": "Astrology Instructor",
  "location": "Remote / Delhi",
  "type": "Full-Time",
  "department": "Education",
  "description": "Full description",
  "requirements": ["3+ years astrology", "Teaching experience"],
  "salaryRange": "₹30,000 - ₹50,000/month",
  "isActive": true
}
```

**Application status values:** `New`, `Reviewed`, `Shortlisted`, `Rejected`, `Hired`.

---

## Newsletter API

### `GET /api/newsletter?status=`

```json
{
  "success": true,
  "subscribers": [
    {
      "_id": "sub_id",
      "email": "user@example.com",
      "status": "Subscribed",
      "subscribedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

`status` filter: `Subscribed` or `Unsubscribed`.

### `POST /api/newsletter/subscribe` (public)

```json
{ "email": "user@example.com" }
```

### `PUT /api/newsletter/:id/status` (admin)

```json
{ "status": "Unsubscribed" }
```

---

## Settings API

### `GET /api/settings` (public read)

```json
{
  "success": true,
  "settings": {
    "siteName": "DS Institute",
    "siteTitle": "DS Institute — Astrology Learning Platform",
    "siteDescription": "Learn Vedic astrology with India's top institute.",
    "contactEmail": "info@dsinstitute.com",
    "contactPhone": "+91 75709 72970",
    "address": "India",
    "facebookUrl": "https://facebook.com/dsinstitute",
    "instagramUrl": "https://instagram.com/dsinstitute",
    "youtubeUrl": "https://youtube.com/@dsinstitute",
    "twitterUrl": "",
    "whatsappNumber": "917570972970",
    "razorpayKeyId": "rzp_live_xxx",
    "shopifyStoreUrl": "https://your-store.myshopify.com",
    "googleAnalyticsId": "G-XXXXXXXX",
    "maintenanceMode": false
  }
}
```

> **Note:** `razorpayKeyId` here is safe to expose publicly (it's the publishable key). `RAZORPAY_KEY_SECRET` must never leave the backend.

### `PUT /api/settings` (admin only)

Accepts the full settings object above. Returns `{ "success": true }`.

---

## Admin Content Manager (Banners & Materials)

All require admin token.

- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PUT /api/admin/banners/:id`
- `DELETE /api/admin/banners/:id`

**Banner model:**

```json
{
  "_id": "banner_id",
  "title": "New Batch Starting",
  "imageUrl": "/images/banner.jpg",
  "link": "/live-courses",
  "isActive": true,
  "order": 1
}
```

- `GET /api/admin/course-materials`
- `POST /api/admin/course-materials`
- `PUT /api/admin/course-materials/:id`
- `DELETE /api/admin/course-materials/:id`

**Material model:**

```json
{
  "_id": "material_id",
  "courseId": "course_id",
  "title": "Study Notes PDF",
  "fileUrl": "https://...",
  "type": "PDF",
  "order": 1
}
```

---

## Email Notifications

Backend must send admin email **only for paid actions**:

1. **Paid consultation:** after `POST /api/leads/verify-payment` success.
2. **Paid recorded course:** after `POST /api/payment/verify` success.

Do not send instant email for live course enquiries unless requested.

**Admin email content:**
- Customer name, phone, email
- Product/service/course name
- Amount paid
- Razorpay Payment ID, Order ID
- Timestamp

**Student email on course purchase:**
- Login URL
- Generated email/username
- Generated password
- Course name and validity

---

## Backend Build Priority

1. Confirm `courseType` is exactly `"Live"` or `"Recorded"`.
2. Implement `POST /api/leads/payment-failed`.
3. `POST /api/payment/create-order` must return `leadId`, `isMock` flag.
4. `POST /api/payment/verify` must create student account + send credentials email.
5. Bunny/VdoCipher signed playback URLs with expiry per session.
6. `GET /api/admin/stats` must include all 7 stat fields.
7. `GET /api/leads` must support `?paymentStatus=`, `?_limit=`, `?type=` filters.
8. `GET /api/admin/users` must return `enrolledCourses` array.
9. `GET /api/settings` must return `shopifyStoreUrl` and `razorpayKeyId`.
10. All blog, jobs, newsletter, orders endpoints must be operational before go-live.
