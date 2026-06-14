# Webhook Implementation Guide

This document explains how to add webhooks for the DS Institute project so external services can notify our backend about important events.

## Why We Need Webhooks

Webhooks help the backend receive automatic updates when something happens outside our app.

Common examples in this project:

- Razorpay confirms payment success or failure.
- Bunny.net finishes processing an uploaded video.
- Bunny.net reports video upload, encoding, or availability status.

Without webhooks, the frontend has to keep checking manually. With webhooks, the provider directly informs our backend.

## Recommended Backend Endpoints

Create separate webhook routes in the backend:

```txt
POST /api/webhooks/razorpay
POST /api/webhooks/bunny
```

Keep these routes public, but protected with signature/secret verification.

## Environment Variables

Add these in backend `.env`:

```env
RAZORPAY_WEBHOOK_SECRET=
BUNNY_WEBHOOK_SECRET=
WEBHOOK_BASE_URL=https://your-live-domain.com
```

Use different secrets for local, staging, and production.

## Razorpay Webhook Flow

### Events To Enable In Razorpay

Recommended Razorpay events:

```txt
payment.captured
payment.failed
order.paid
refund.processed
```

### Razorpay Dashboard Setup

In Razorpay dashboard:

```txt
Settings > Webhooks > Add New Webhook
```

Webhook URL:

```txt
https://your-live-domain.com/api/webhooks/razorpay
```

Add the webhook secret and save the same value in backend `.env` as:

```env
RAZORPAY_WEBHOOK_SECRET=
```

### Important Security Rule

Razorpay signature verification must use the raw request body.

Do not verify after JSON parsing only.

### Express Example

```js
import crypto from 'crypto';
import express from 'express';

const router = express.Router();

router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString());

    switch (event.event) {
      case 'payment.captured':
      case 'order.paid':
        // Mark payment/order as successful.
        // Enroll student or activate course access here.
        break;

      case 'payment.failed':
        // Mark payment as failed.
        break;

      case 'refund.processed':
        // Update refund status.
        break;

      default:
        // Store unhandled event for debugging if needed.
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(500).json({ success: false });
  }
});

export default router;
```

## Bunny.net Webhook Flow

Use Bunny webhook when uploaded videos need backend status updates after upload/encoding.

Example use cases:

- Video uploaded but still processing.
- Video is ready to play.
- Video failed processing.
- Store final video ID, playback URL, duration, thumbnail, or status.

### Suggested Bunny Webhook URL

```txt
https://your-live-domain.com/api/webhooks/bunny
```

### Bunny Event Handling

Exact Bunny payload may differ based on Stream settings, so log the first real event in staging before final mapping.

Recommended database fields for course videos:

```js
{
  title: String,
  provider: 'bunny',
  videoId: String,
  playbackUrl: String,
  status: 'uploading' | 'processing' | 'ready' | 'failed',
  duration: Number,
  thumbnailUrl: String,
  sortOrder: Number
}
```

### Bunny Express Example

```js
import express from 'express';

const router = express.Router();

router.post('/bunny', express.json(), async (req, res) => {
  try {
    const secret = req.headers['x-webhook-secret'];

    if (process.env.BUNNY_WEBHOOK_SECRET && secret !== process.env.BUNNY_WEBHOOK_SECRET) {
      return res.status(401).json({ success: false, message: 'Unauthorized webhook' });
    }

    const payload = req.body;

    console.log('Bunny webhook received:', payload);

    const videoId = payload.videoId || payload.guid || payload.id;
    const status = payload.status || payload.event || payload.state;

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Missing video ID' });
    }

    // Find the course video by Bunny video ID.
    // Update video status based on Bunny event.
    // Example:
    // - processing
    // - ready
    // - failed

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Bunny webhook error:', error);
    return res.status(500).json({ success: false });
  }
});

export default router;
```

## Important Backend Rules

Always follow these:

- Return `200` quickly after processing the event.
- Verify signature or secret before updating the database.
- Make webhook processing idempotent.
- Do not create duplicate enrollments if the same event comes twice.
- Store provider event ID if available.
- Log failed webhook events for debugging.
- Never depend only on frontend payment success page.

## Suggested Database Tracking

For payments:

```js
{
  provider: 'razorpay',
  orderId: String,
  paymentId: String,
  status: 'created' | 'paid' | 'failed' | 'refunded',
  rawWebhookEvents: Array
}
```

For video:

```js
{
  provider: 'bunny',
  videoId: String,
  status: 'uploading' | 'processing' | 'ready' | 'failed',
  rawWebhookEvents: Array
}
```

## Testing Checklist

Before going live:

- Start backend locally.
- Use ngrok or a deployed staging URL.
- Configure webhook URL in Razorpay/Bunny dashboard.
- Trigger test payment or test upload.
- Confirm backend receives event.
- Confirm signature/secret verification works.
- Confirm database updates correctly.
- Confirm duplicate webhook event does not create duplicate records.
- Confirm frontend shows correct final status.

## Production Checklist

Before production:

- Add webhook secrets in production `.env`.
- Use HTTPS URL only.
- Enable only required events.
- Add logging for failed events.
- Add retry-safe database updates.
- Confirm webhook route is not blocked by auth middleware.
- Confirm webhook route is still protected by provider signature/secret.

## Final Expected Flow

### Payment

```txt
Student pays
Razorpay sends webhook
Backend verifies signature
Backend marks payment paid
Backend activates course/access
Frontend dashboard shows updated access
```

### Video

```txt
Admin uploads video
Bunny processes video
Bunny sends webhook
Backend updates video status
Admin sees ready/failed status
Student sees video only when ready
```

