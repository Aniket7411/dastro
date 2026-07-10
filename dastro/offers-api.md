# Site Offers API Contract

Promotional offers for the public site popup (coupons, first chat free, thumbnails) and admin management.

**Base URL (dev):** `http://localhost:5000`  
**API prefix:** `/api/offers`  
**Vite proxy (dev):** `/api/offers` → `http://localhost:5000/api/offers`

---

## Offer object shape

| Field           | Type     | Required | Notes |
|-----------------|----------|----------|-------|
| `_id`           | string   | auto     | MongoDB ID |
| `title`         | string   | yes      | Headline in popup |
| `subtitle`      | string   | no       | Short line under title |
| `description`   | string   | no       | Body text in card |
| `type`          | string   | no       | See types below (default `custom`) |
| `discount`      | string   | no       | Display badge e.g. `20% OFF`, `₹500 OFF` |
| `discountValue` | number   | no       | Numeric value for % or ₹ |
| `couponCode`    | string   | no       | Uppercased on save; copy button in popup |
| `thumbnail`     | string   | no       | Image URL (upload via `/api/upload/image`) |
| `ctaLabel`      | string   | no       | Button text (default `Claim Offer`) |
| `ctaLink`       | string   | no       | Internal path e.g. `/book-consultation` |
| `showOnSite`    | boolean  | no       | Default `true` — include in public popup |
| `priority`      | number   | no       | Higher shows first (default `0`) |
| `validFrom`     | ISO date | no       | Default now |
| `validTill`     | ISO date | yes      | Offer hidden after this date |
| `isActive`      | boolean  | no       | Default `true` |
| `createdAt`     | ISO date | auto     | |
| `updatedAt`     | ISO date | auto     | |

### Offer types

| `type`              | Use case |
|---------------------|----------|
| `money_coupon`      | ₹ discount + optional coupon code |
| `first_chat_free`   | First consultation chat free |
| `percentage_off`    | Percentage discount |
| `fixed_discount`    | Flat ₹ amount off |
| `custom`            | Any other promotion |

---

## Public endpoint (no auth)

### List active site offers

**`GET /api/offers`**

Returns offers where:

- `isActive: true`
- `showOnSite: true`
- `validFrom <= now`
- `validTill >= now`

Sorted by `priority` desc, then `validTill` asc.

**Response (`200`):**

```json
{
  "success": true,
  "offers": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "offerId": "674a1b2c3d4e5f6789012345",
      "title": "First Chat FREE",
      "subtitle": "New seekers only",
      "description": "Book your first astrology chat at no cost.",
      "type": "first_chat_free",
      "discount": "FREE",
      "discountValue": 0,
      "couponCode": "",
      "thumbnail": "https://example.com/offers/chat-free.png",
      "ctaLabel": "Book now",
      "ctaLink": "/book-consultation",
      "validTill": "2026-12-31T00:00:00.000Z",
      "validFrom": "2026-06-01T00:00:00.000Z",
      "priority": 10
    }
  ]
}
```

**Frontend popup behaviour:**

- Fetches on main layout pages only (`MainLayout`)
- Modal opens ~1.4s after load if `offers.length > 0`
- Dismissed offer IDs stored in `sessionStorage` (`site-offers-dismissed-ids`)
- No popup when API returns `[]`

---

## Admin endpoints (Bearer token)

**Header:** `Authorization: Bearer <adminToken>`

### List all offers

**`GET /api/offers/admin`**

```json
{ "success": true, "offers": [ /* all offers, including inactive */ ] }
```

### Create offer

**`POST /api/offers`**

```json
{
  "title": "₹500 off courses",
  "subtitle": "Use code at checkout",
  "description": "Valid on all recorded courses.",
  "type": "money_coupon",
  "discount": "₹500 OFF",
  "discountValue": 500,
  "couponCode": "ASTRO500",
  "thumbnail": "https://your-cdn/offers/500.png",
  "ctaLabel": "Browse courses",
  "ctaLink": "/courses",
  "showOnSite": true,
  "priority": 5,
  "validFrom": "2026-06-15",
  "validTill": "2026-12-31",
  "isActive": true
}
```

**Response (`201`):** `{ "success": true, "offer": { ... } }`

### Update offer

**`PUT /api/offers/:id`** — same body fields (all optional)

### Delete offer

**`DELETE /api/offers/:id`**

```json
{ "success": true, "message": "Offer removed" }
```

---

## Thumbnail upload (admin)

Use existing upload endpoint:

```http
POST /api/upload/image
Authorization: Bearer <adminToken>
Content-Type: multipart/form-data

file: <image>
folder: offers
```

Response includes `publicUrl` — paste into `thumbnail` when creating/updating an offer.

---

## Student dashboard (existing)

**`GET /api/student/offers`** (authenticated student)

Returns active offers (not limited to `showOnSite`). Response shape extended with new fields but keeps `offerId`, `title`, `discount`, `validTill` for backward compatibility.

---

## Backend files (already added)

| File | Purpose |
|------|---------|
| `backend/src/models/Offer.js` | Mongoose schema |
| `backend/src/controllers/offerController.js` | CRUD handlers |
| `backend/src/routes/offerRoutes.js` | Routes |
| `backend/src/app.js` | Mounts `/api/offers` |

**Restart backend** after deploying these changes.

---

## Frontend files

| File | Purpose |
|------|---------|
| `src/pages/AdminOffers.jsx` | Admin CRUD + thumbnail upload |
| `src/components/offers/SiteOffersModal.jsx` | Tailwind popup (no Bootstrap) |
| `src/utils/offerApi.js` | API helpers |
| `src/layouts/MainLayout.jsx` | Renders popup on main site pages |
| `src/pages/AdminDashboard.jsx` | Nav tab **Site Offers** |

---

## Quick test

```bash
# Public (empty until you create offers)
curl http://localhost:5000/api/offers

# Admin list
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/offers/admin
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Popup never shows | `offers: []` | Create offer in Admin → Site Offers; set Active + Show in popup + future validTill |
| Popup showed once, not again | Session dismiss | Close tab or clear `sessionStorage.site-offers-dismissed-ids` |
| 404 on `/api/offers` | Backend not restarted | Restart `backend` server |
| Thumbnail upload fails | Not logged in as admin | Use admin token; check `/api/upload/image` |
