import cron from 'node-cron';
import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import { sendExpiryReminderEmail } from '../utils/sendEmail.js';
import logger from '../config/logger.js';

const LIFETIME_YEAR_CUTOFF = 2090;

export const sendExpiryReminders = async () => {
  if (mongoose.connection.readyState !== 1) {
    logger.warn('Expiry reminder cron skipped: database not connected.');
    return;
  }

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const dueEnrollments = await Enrollment.find({
    isActive: true,
    reminderSentAt: null,
    validUntil: { $gte: now, $lte: sevenDaysFromNow },
  })
    .populate('userId', 'name email')
    .populate('courseId', 'title validityDays');

  for (const enrollment of dueEnrollments) {
    const isLifetime = enrollment.courseId?.validityDays === 0
      || new Date(enrollment.validUntil).getFullYear() >= LIFETIME_YEAR_CUTOFF;
    if (isLifetime || !enrollment.userId?.email) continue;

    try {
      await sendExpiryReminderEmail(
        enrollment.userId.email,
        enrollment.userId.name,
        enrollment.courseId?.title,
        enrollment.validUntil
      );
      enrollment.reminderSentAt = new Date();
      await enrollment.save();
      logger.info(`Expiry reminder sent to ${enrollment.userId.email} for course ${enrollment.courseId?.title || enrollment.courseId}`);
    } catch (error) {
      logger.error(`Expiry reminder failed for enrollment ${enrollment._id}: ${error.message}`);
    }
  }
};

export const startExpiryReminderCron = () => {
  // Runs daily at 9:00 AM IST
  cron.schedule('0 9 * * *', () => {
    sendExpiryReminders().catch((error) => {
      logger.error(`Expiry reminder cron run failed: ${error.message}`);
    });
  }, { timezone: 'Asia/Kolkata' });

  logger.info('Expiry reminder cron scheduled (daily 09:00 IST).');
};
