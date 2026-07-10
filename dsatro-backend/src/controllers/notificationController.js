import Notification from '../models/Notification.js';
import asyncHandler from 'express-async-handler';

// GET /api/admin/notifications?limit=30
export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  const [notifications, unreadCount] = await Promise.all([
    Notification.find().sort({ createdAt: -1 }).limit(limit),
    Notification.countDocuments({ isRead: false }),
  ]);
  res.json({ success: true, notifications, unreadCount });
});

// GET /api/admin/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  res.json({ success: true, count });
});

// PUT /api/admin/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true });
});

// PUT /api/admin/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

// DELETE /api/admin/notifications (clear all)
export const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({});
  res.json({ success: true });
});

// DELETE /api/admin/notifications/:id
export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
