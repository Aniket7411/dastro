# Blog API Contract

This document describes the backend endpoints for the public `/blogs` page and admin blog management.

**Base URL (development):** `http://localhost:5000`  
**API prefix:** `/api/blogs`  
**Fallback (if proxy strips `/api`):** `/blogs` — both are mounted in the backend.

---

## Why `/blogs` may show nothing on the frontend

1. **No published blogs in the database** — `GET /api/blogs` only returns blogs where `isPublished: true`. Drafts are hidden from the public list.
2. **Wrong API URL** — frontend must call `GET /api/blogs`, not the React route `/blogs`.
3. **Wrong response key** — the list is under `blogs`, not `data`, `articles`, or `results`.
4. **CORS / base URL** — set `VITE_API_URL` (or equivalent) to your backend origin, e.g. `http://localhost:5000` in dev.

**Quick check:**

```bash
curl http://localhost:5000/api/blogs
```

Expected when empty:

```json
{ "success": true, "blogs": [] }
```

Create at least one blog with `"isPublished": true` via the admin API (see below).

---

## Blog object shape

| Field         | Type       | Required | Notes                                      |
|---------------|------------|----------|--------------------------------------------|
| `_id`         | string     | auto     | MongoDB ID — use for admin update/delete   |
| `title`       | string     | yes      |                                            |
| `slug`        | string     | yes      | URL-safe unique identifier for detail page |
| `content`     | string     | yes      | Full HTML or markdown body                 |
| `excerpt`     | string     | no       | Short summary for cards                    |
| `author`      | string     | no       | Defaults to `"Admin"`                      |
| `category`    | string     | yes      | See categories below                       |
| `image`       | string     | no       | Image URL (relative or absolute)           |
| `tags`        | string[]   | no       | e.g. `["astrology", "vedic"]`              |
| `isPublished` | boolean    | no       | Default `false` — must be `true` for public list |
| `createdAt`   | ISO date   | auto     |                                            |
| `updatedAt`   | ISO date   | auto     |                                            |

**Categories used by the frontend:**

- `Vedic Astrology`
- `Tarot`
- `Numerology`
- `Spiritual Remedies`
- `Career & Finance`
- `Love & Relationships`

---

## Public endpoints (no auth)

### 1. List published blogs

**Endpoint:** `GET /api/blogs`

**Query parameters (all optional):**

| Param      | Example              | Description                          |
|------------|----------------------|--------------------------------------|
| `category` | `Vedic Astrology`    | Filter by exact category name        |
| `search`   | `moon`               | Case-insensitive search in title, excerpt, content |
| `limit`    | `6`                  | Max number of blogs to return        |

**Example requests:**

```
GET /api/blogs
GET /api/blogs?category=Tarot
GET /api/blogs?search=vedic&limit=10
```

**Success response (`200`):**

```json
{
  "success": true,
  "blogs": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "title": "Understanding Vedic Astrology",
      "slug": "understanding-vedic-astrology",
      "content": "Full article content...",
      "excerpt": "Short summary for the card",
      "author": "Admin",
      "category": "Vedic Astrology",
      "image": "https://example.com/images/blog1.png",
      "tags": ["astrology", "vedic"],
      "isPublished": true,
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** `content` is included in the list response. For lighter payloads, the frontend can ignore it on the listing page and fetch the full post on the detail page.

---

### 2. Get single blog by slug

**Endpoint:** `GET /api/blogs/:slug`

Use the `slug` field from the list (not `_id`).

**Example:**

```
GET /api/blogs/understanding-vedic-astrology
```

**Success response (`200`):**

```json
{
  "success": true,
  "blog": {
    "_id": "674a1b2c3d4e5f6789012345",
    "title": "Understanding Vedic Astrology",
    "slug": "understanding-vedic-astrology",
    "content": "Full article content...",
    "excerpt": "Short summary",
    "author": "Admin",
    "category": "Vedic Astrology",
    "image": "https://example.com/images/blog1.png",
    "tags": ["astrology", "vedic"],
    "isPublished": true,
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

**Error response (`404`):**

```json
{
  "success": false,
  "data": null,
  "error": "Blog not found"
}
```

**Detail page route suggestion:** `/blogs/:slug` → fetch `GET /api/blogs/${slug}`.

---

## Admin endpoints (require admin token)

**Login:** `POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "admin" }
}
```

**Header for all admin blog routes:**

```
Authorization: Bearer <token>
```

---

### 3. List all blogs (including drafts)

**Endpoint:** `GET /api/blogs/admin`

**Success response (`200`):**

```json
{
  "success": true,
  "blogs": [ /* published + unpublished */ ]
}
```

---

### 4. Create blog

**Endpoint:** `POST /api/blogs`

**Request body:**

```json
{
  "title": "Understanding Vedic Astrology",
  "slug": "understanding-vedic-astrology",
  "content": "Full HTML or markdown content",
  "excerpt": "Short summary",
  "category": "Vedic Astrology",
  "image": "/images/blog1.png",
  "tags": ["astrology", "vedic"],
  "isPublished": true
}
```

**Success response (`201`):**

```json
{
  "success": true,
  "blog": { /* created blog */ }
}
```

**Error (`400`) — duplicate slug:**

```json
{
  "success": false,
  "error": "Blog with this slug already exists"
}
```

---

### 5. Update blog

**Endpoint:** `PUT /api/blogs/:id`

Use MongoDB `_id`, not `slug`.

**Request body:** same fields as create (all optional except what you want to change).

**Success response (`200`):**

```json
{
  "success": true,
  "blog": { /* updated blog */ }
}
```

---

### 6. Delete blog

**Endpoint:** `DELETE /api/blogs/:id`

**Success response (`200`):**

```json
{
  "success": true,
  "message": "Blog removed"
}
```

---

## Frontend integration examples

### Environment variable

```env
VITE_API_URL=http://localhost:5000
```

### Fetch blog list (React / fetch)

```js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchBlogs({ category, search, limit } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (limit) params.set('limit', String(limit));

  const res = await fetch(`${API}/api/blogs?${params}`);
  const json = await res.json();

  if (!json.success) throw new Error(json.error || 'Failed to load blogs');
  return json.blogs; // ← use this array, not json.data
}
```

### Fetch single blog

```js
async function fetchBlogBySlug(slug) {
  const res = await fetch(`${API}/api/blogs/${slug}`);
  const json = await res.json();

  if (!json.success) throw new Error(json.error || 'Blog not found');
  return json.blog; // ← singular key
}
```

### Listing page checklist

- [ ] Call `GET ${API}/api/blogs` on mount
- [ ] Read `response.blogs` (array)
- [ ] Show empty state when `blogs.length === 0`
- [ ] Link each card to `/blogs/${blog.slug}`
- [ ] Use `blog.image`, `blog.excerpt`, `blog.category`, `blog.createdAt` for cards
- [ ] Optional: filter UI sends `?category=` query to the same endpoint

### Detail page checklist

- [ ] Read `slug` from route params
- [ ] Call `GET ${API}/api/blogs/${slug}`
- [ ] Read `response.blog` (single object)
- [ ] Render `blog.content` (HTML or markdown depending on how admin saves it)

---

## Error format (all routes)

```json
{
  "success": false,
  "data": null,
  "error": "Error message here"
}
```

HTTP status codes: `400` validation/conflict, `401`/`403` auth, `404` not found, `500` server error.

---

## Route summary

| Method | Path              | Auth   | Purpose                    |
|--------|-------------------|--------|----------------------------|
| GET    | `/api/blogs`      | Public | List published blogs       |
| GET    | `/api/blogs/:slug`| Public | Single blog by slug        |
| GET    | `/api/blogs/admin`| Admin  | List all blogs             |
| POST   | `/api/blogs`      | Admin  | Create blog                |
| PUT    | `/api/blogs/:id`  | Admin  | Update blog by `_id`       |
| DELETE | `/api/blogs/:id`  | Admin  | Delete blog by `_id`       |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Empty page, no errors | `blogs: []` — nothing published | Create blogs with `isPublished: true` |
| Network error / CORS | Wrong `VITE_API_URL` or origin not allowed | Set backend `ALLOWED_ORIGINS` to include frontend URL |
| 404 on fetch | Hitting `/blogs` instead of `/api/blogs` | Use full API path with base URL |
| Data undefined | Reading `data` instead of `blogs` / `blog` | Match response keys above |
| Detail 404 | Using `_id` in URL instead of `slug` | Detail route uses `slug` |
| Admin list works, public empty | Blogs saved as drafts | Set `isPublished: true` on create or update |
