import mongoose from 'mongoose';

const CourseVideoSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, default: 0 },
  bunnyVideoId: { type: String, required: false },
  vdoCipherVideoId: { type: String, required: false },
  videoUrl: { type: String, default: '' },
  storagePath: { type: String, default: '' },
  storageBucket: { type: String, default: '' },
  videoProvider: { type: String, enum: ['supabase', 'bunny', 'vdocipher'], default: 'supabase' },
  bunnyLibraryId: { type: String, default: '' },
  bunnyStatus: { type: Number, default: null },
  bunnyEncodeProgress: { type: Number, default: null },
  status: { type: String, enum: ['uploading', 'processing', 'ready', 'failed'], default: 'uploading' },
  rawWebhookEvents: { type: Array, default: [] },
  sourceType: { type: String, enum: ['supabase', 'bunny-id', 'upload'], default: 'supabase' },
  sortOrder: { type: Number, default: 0 },
  /** public = intro/preview on course page; enrolled = full lessons after purchase */
  visibility: { type: String, enum: ['public', 'enrolled'], default: 'enrolled' },
  createdAt: { type: Date, default: Date.now }
});

CourseVideoSchema.index({ courseId: 1 });

export default mongoose.model('CourseVideo', CourseVideoSchema);
