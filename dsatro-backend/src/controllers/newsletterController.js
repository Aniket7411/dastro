import Newsletter from '../models/Newsletter.js';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import { notify } from '../utils/notify.js';

// Validation Schema for subscribe
const subscribeSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.'
  })
});

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { error } = subscribeSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if subscriber already exists
  let subscriber = await Newsletter.findOne({ email: normalizedEmail });

  if (subscriber) {
    if (subscriber.status === 'Subscribed') {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    } else {
      // Re-subscribe if previously unsubscribed
      subscriber.status = 'Subscribed';
      await subscriber.save();
      notify({
        title: 'Newsletter Re-subscription',
        message: `${normalizedEmail} re-subscribed to the newsletter`,
        type: 'newsletter',
        icon: 'fa-envelope',
        color: 'emerald',
        link: 'newsletter',
        meta: { email: normalizedEmail },
      });
      return res.status(200).json({
        success: true,
        message: 'Thank you for re-subscribing to our newsletter!'
      });
    }
  }

  // Create new subscriber
  await Newsletter.create({ email: normalizedEmail });

  notify({
    title: 'New Newsletter Subscriber',
    message: `${normalizedEmail} subscribed to the newsletter`,
    type: 'newsletter',
    icon: 'fa-envelope',
    color: 'emerald',
    link: 'newsletter',
    meta: { email: normalizedEmail },
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing to our newsletter!'
  });
});

// @desc    Get all newsletter subscribers (Admin only)
// @route   GET /api/newsletter
export const getSubscribers = asyncHandler(async (req, res) => {
  const { startDate, endDate, email, status } = req.query;
  const filter = {};

  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (email) {
    filter.email = { $regex: email, $options: 'i' };
  }
  if (status) {
    filter.status = status;
  }

  const subscribers = await Newsletter.find(filter).sort({ createdAt: -1 });
  res.json({
    success: true,
    subscribers: subscribers.map((sub) => ({
      _id: sub._id,
      email: sub.email,
      status: sub.status,
      subscribedAt: sub.createdAt,
    })),
  });
});

// @desc    Update subscriber status (Admin only)
// @route   PUT /api/newsletter/:id/status
export const updateSubscriberStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Subscribed', 'Unsubscribed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid subscriber status');
  }

  const subscriber = await Newsletter.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!subscriber) {
    res.status(404);
    throw new Error('Subscriber not found');
  }

  res.json({ success: true, message: 'Status updated successfully', subscriber });
});

// @desc    Delete subscriber (Admin only)
// @route   DELETE /api/newsletter/:id
export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Newsletter.findById(req.params.id);
  if (!subscriber) {
    res.status(404);
    throw new Error('Subscriber not found');
  }

  await subscriber.deleteOne();
  res.json({ success: true, message: 'Subscriber removed' });
});
