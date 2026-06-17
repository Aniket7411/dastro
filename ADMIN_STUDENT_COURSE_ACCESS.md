# Admin Guide: Enable Student Course Access

**DS Astro Institute — manual confirmation for external payments & access control**

Last updated: June 2026

---

## Quick answer

Go to **Admin → Operations → Orders** (now titled **Course Access & Orders**).

| Student situation | What you do |
|-------------------|-------------|
| Submitted **Enquire Now** (no online payment) | Click **Confirm & Enable** after receiving external payment (UPI, bank, cash, etc.) |
| Paid online but lessons locked | Click **Enable** |
| Need to lock lessons temporarily | Click **Disable** |
| Need to fully block the course | Click **Suspend** |

**Enable** and **Confirm & Enable** both email the student their **login email + password**.

---

## Why this exists

Online Razorpay checkout may be disabled during setup. Students can still enquire on recorded courses. When payment is collected externally, the admin confirms it in the **Orders** tab — no Razorpay required.

---

## Step-by-step: External payment (UPI / bank / cash)

1. Student submits **Enquire Now** on a recorded course.
2. Lead appears in **Lead Pipeline → Recorded Courses** AND in **Orders** with:
   - Payment: **ENQUIRY**
   - Course access: **Not granted**
3. Collect payment externally.
4. Open **Admin → Operations → Orders**.
5. Find the student row → click **Confirm & Enable**.
6. Optional prompts:
   - Amount received (INR)
   - Admin note (UPI ref, transaction ID, etc.)
7. System automatically:
   - Creates student account (if new)
   - Creates enrollment with **Enabled** access
   - Records an external order
   - **Emails login credentials** to the student

---

## Access actions explained

| Action | Effect on student | Email sent? |
|--------|-------------------|-------------|
| **Confirm & Enable** | Grants access from an enquiry row | Yes — email + new password |
| **Enable** | Unlocks lesson videos | Yes — email + new password |
| **Disable** | Keeps enrollment; locks lesson videos | No |
| **Suspend** | Removes active access (course hidden from dashboard) | No |

---

## Access status labels

| Status | Meaning |
|--------|---------|
| **Not granted** | Enquiry only — no enrollment yet |
| **Pending** | Enrolled but waiting for admin enable (e.g. after online payment when auto-locked) |
| **Enabled** | Full lesson access |
| **Disabled** | Enrolled but lessons locked |
| **Suspended** | Access revoked |

---

## Payment source labels

| Label | Meaning |
|-------|---------|
| **Enquiry** | Student enquired; not yet confirmed |
| **External** | Admin confirmed offline payment |
| **Online** | Razorpay purchase |

---

## What the student receives by email

Subject: *Welcome to DS Astro Institute — Your Login Credentials*

Contains:
- Student login email
- Temporary password
- Link to student login page

Students should change their password after first login.

**Requires** `EMAIL_USER` and `EMAIL_PASS` in `backend/.env`.

---

## What the student sees

### Before enable
- Dashboard: **Awaiting approval** / **Pending**
- Course player: locked with message to wait for admin

### After enable
- Dashboard: **Continue** button
- Course player: full lessons

### If disabled
- Dashboard: **Access disabled**
- Course player: locked — contact support message

### If suspended
- Course removed from active dashboard list

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No rows in Orders | Ensure recorded course enquiries exist; refresh page |
| **Confirm & Enable** fails — course not found | Enquiry must include a valid `courseId`; re-submit from course page |
| Email not received | Check `EMAIL_USER`, `EMAIL_PASS`, spam folder; verify SMTP in backend logs |
| Student can't login | Click **Enable** again to resend a new password |
| Online payment row shows Pending | Click **Enable** after verifying payment |

---

## Admin panel location

```
Admin Dashboard
└── Operations
    └── Orders  ← Course Access & Orders
        ├── Enquiry rows     → Confirm & Enable
        └── Enrollment rows  → Enable / Disable / Suspend
```

---

## Technical reference

| API | Purpose |
|-----|---------|
| `GET /api/admin/orders` | List enquiries + enrollments |
| `POST /api/admin/leads/:id/confirm-access` | Confirm external payment |
| `PUT /api/admin/enrollments/:id/access` | `{ "action": "enable" \| "disable" \| "suspend" }` |
| `PUT /api/admin/enrollments/:id/approve` | Legacy alias for enable |

---

## Recommended workflow

1. Student enquires on recorded course.
2. Team collects payment externally.
3. Admin opens **Orders** → **Confirm & Enable**.
4. Student receives credentials email.
5. Student logs in and starts lessons.
6. Use **Disable** / **Suspend** only when access must be revoked.
