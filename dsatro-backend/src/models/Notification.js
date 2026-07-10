import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['lead', 'job_application', 'newsletter', 'payment_success', 'payment_failed', 'system'],
      default: 'system',
    },
    icon:   { type: String, default: 'fa-bell' },
    color:  { type: String, default: 'blue' },
    isRead: { type: Boolean, default: false },
    link:   { type: String, default: 'dashboard' },
    meta:   { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
