# Coupon API Contract

This document describes the backend endpoints needed to support coupon validation from the course detail page and coupon management from the admin panel.

## 1. Validate Coupon

**Endpoint:** `POST /api/coupons/validate`

**Request body:**
```json
{
  "code": "DSASTRO30",
  "courseId": "astrology-course-01"
}
```

**Response:**
- `200 OK` on success
- `200 OK` on invalid coupon with `success: false`

**Success response example:**
```json
{
  "success": true,
  "coupon": {
    "code": "DSASTRO30",
    "discountType": "percentage",
    "discountValue": 30,
    "minPurchase": 1500,
    "usageLimit": 100,
    "active": true
  }
}
```

**Failure response example:**
```json
{
  "success": false,
  "message": "Coupon code is invalid or expired"
}
```

## 2. List Coupons

**Endpoint:** `GET /api/coupons`

**Headers:**
- `Authorization: Bearer <adminToken>`

**Response example:**
```json
{
  "success": true,
  "coupons": [
    {
      "_id": "abc123",
      "code": "DSASTRO30",
      "discountType": "percentage",
      "discountValue": 30,
      "minPurchase": 1500,
      "usageLimit": 100,
      "active": true
    }
  ]
}
```

## 3. Create Coupon

**Endpoint:** `POST /api/coupons`

**Headers:**
- `Authorization: Bearer <adminToken>`

**Request body:**
```json
{
  "code": "DSASTRO30",
  "discountType": "percentage",
  "discountValue": 30,
  "minPurchase": 1500,
  "usageLimit": 100,
  "active": true
}
```

**Success response example:**
```json
{
  "success": true,
  "coupon": {
    "_id": "abc123",
    "code": "DSASTRO30"
  }
}
```

## 4. Update Coupon

**Endpoint:** `PUT /api/coupons/:id`

**Headers:**
- `Authorization: Bearer <adminToken>`

**Request body:**
```json
{
  "code": "DSASTRO30",
  "discountType": "fixed",
  "discountValue": 500,
  "minPurchase": 1200,
  "usageLimit": 50,
  "active": false
}
```

**Success response example:**
```json
{
  "success": true,
  "coupon": {
    "_id": "abc123",
    "code": "DSASTRO30"
  }
}
```

## 5. Delete Coupon

**Endpoint:** `DELETE /api/coupons/:id`

**Headers:**
- `Authorization: Bearer <adminToken>`

**Success response example:**
```json
{
  "success": true,
  "message": "Coupon deleted"
}
```

## Notes

- The coupon validation endpoint should return the coupon payload only if the code is valid, active, and any minimum purchase or course restrictions are satisfied.
- The admin coupon endpoints should be protected with authentication.
- `courseId` is optional for coupons that are global, but the frontend sends it to support course-specific rules.
