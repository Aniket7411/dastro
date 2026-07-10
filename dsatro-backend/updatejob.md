# Job Applications & Recruiter Admin — Backend Update Notes

## Changes made

### 1. `JobApplication` model (`src/models/JobApplication.js`)
- Added optional `jobId` (`ObjectId` ref `Job`) so applicants map to a posting, not only `appliedRole` text.

### 2. `POST /api/jobs/apply`
- Accepts `jobId` from careers form.
- Resolves `appliedRole` from the job title when `jobId` is sent.
- Backfills `jobId` from `appliedRole` title when only role name is provided (legacy clients).

### 3. `GET /api/jobs` (admin with `Authorization` header)
- Each job now includes `applicantCount`.
- Count includes applications linked by `jobId` **or** legacy `appliedRole === job.title`.

### 4. `GET /api/jobs/applications` (admin)
- New query param: `jobId` — filters applicants for that position (includes legacy role-title matches).
- Existing `role`, `status`, `search` params still work.

## Resume URLs

Applications may store:
- **Supabase public URL** — `https://....supabase.co/storage/v1/object/public/...`
- **Legacy local path** — `/uploads/resumes/resume-....pdf` (served at `GET /uploads/...`)

Frontend must **not** prefix `API_BASE` on absolute URLs.

## Status values

`JobApplication.status` enum includes: `New`, `Pending`, `Reviewed`, `Shortlisted`, `Interviewing`, `Selected`, `Rejected`, `Hired`.

Default for new applications: `New`.

## Deploy / restart

After pulling these changes:
1. Restart the backend server (no migration script required — `jobId` is optional).
2. Rebuild/restart the frontend.

## Optional data cleanup (MongoDB)

To link old applications to jobs by title:

```js
db.jobapplications.find({ jobId: { $in: [null, undefined] } }).forEach((app) => {
  const job = db.jobs.findOne({ title: app.appliedRole });
  if (job) {
    db.jobapplications.updateOne({ _id: app._id }, { $set: { jobId: job._id } });
  }
});
```

## API examples

```http
GET /api/jobs
Authorization: Bearer <adminToken>
```

```json
{
  "success": true,
  "jobs": [
    {
      "_id": "...",
      "title": "Senior Vedic Astrologer",
      "applicantCount": 3,
      "salaryRange": "₹50k – ₹90k / month"
    }
  ]
}
```

```http
GET /api/jobs/applications?jobId=<jobObjectId>
Authorization: Bearer <adminToken>
```

```http
POST /api/jobs/apply
Content-Type: application/json

{
  "fullName": "Aniket Sharma",
  "email": "user@example.com",
  "phone": "8318825828",
  "jobId": "<jobObjectId>",
  "appliedRole": "Senior Vedic Astrologer",
  "resumeUrl": "https://....supabase.co/.../resume.pdf"
}
```
