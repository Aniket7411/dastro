import Notification from '../models/Notification.js';

const MAX_NOTIFICATIONS = 500;

export const notify = async ({ title, message, type = 'system', icon = 'fa-bell', color = 'blue', link = 'dashboard', meta = {} }) => {
  try {
    await Notification.create({ title, message, type, icon, color, link, meta });
    const count = await Notification.countDocuments();
    if (count > MAX_NOTIFICATIONS) {
      const oldest = await Notification.find().sort({ createdAt: 1 }).limit(count - MAX_NOTIFICATIONS);
      if (oldest.length) await Notification.deleteMany({ _id: { $in: oldest.map((n) => n._id) } });
    }
  } catch (err) {
    console.error('[notify] Failed to create notification:', err.message);
  }
};
