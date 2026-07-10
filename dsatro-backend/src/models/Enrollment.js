import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  validUntil: { type: Date, required: true },
  purchasedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  /** Admin must approve before main lesson videos unlock (intro stays public). */
  accessApproved: { type: Boolean, default: false },
  /** Set once a 7-day-expiry reminder email has been sent, to avoid duplicate sends. */
  reminderSentAt: { type: Date, default: null },
  progress: {
    completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseVideo' }],
    videoProgress: {
      type: Map,
      of: Number,
      default: {},
    },
  }
});

export default mongoose.model('Enrollment', EnrollmentSchema);
