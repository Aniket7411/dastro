# Supabase setup (server-side — same pattern as your last project)

Uploads no longer use frontend anon keys. The **backend** uploads files with the **service role key**, then saves the public URL in MongoDB.

## Backend `.env` (required)

Add to `backend/.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key
SUPABASE_STORAGE_BUCKET=course-images
```

Get keys from **Supabase Dashboard → Project Settings → API**:
- **Project URL** → `SUPABASE_URL`
- **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY` — never expose in frontend

Optional:

```env
SUPABASE_MAX_VIDEO_MB=500
```

Restart the backend after changing `.env`.

## Storage bucket

Create a **public** bucket named `course-images` (or match `SUPABASE_STORAGE_BUCKET`).

Folders used automatically:
- `thumbnails/` — course images
- `videos/` — course videos
- `resumes/` — job applications

Service role bypasses RLS — no storage policies needed for uploads.

## Upload API routes

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /api/upload/status` | Public | Check if Supabase is configured |
| `POST /api/upload/image` | Admin | Course thumbnail |
| `POST /api/upload/video` | Admin | Course video |
| `POST /api/upload/resume` | Public | Careers resume |

## User flows

### Admin course thumbnail
1. Admin selects image → loader shows
2. Frontend → `POST /api/upload/image` → backend → Supabase
3. URL returned → saved in form → on course save → MongoDB `thumbnailUrl`

### Admin course video (Supabase provider)
1. Video file selected / queued
2. Backend uploads to Supabase on save
3. `videoUrl` stored in MongoDB `CourseVideo`

### Careers resume
1. Applicant selects resume → loader shows
2. Frontend → `POST /api/upload/resume` → Supabase
3. On submit → `resumeUrl` sent as JSON → MongoDB `JobApplication.resumeUrl`

## Verify

1. Fill `backend/.env` with service role key
2. Restart backend (`npm run dev` in backend folder)
3. Admin → Courses → status banner should show **Server upload configured**
4. Upload a thumbnail — should succeed without 403 RLS errors
