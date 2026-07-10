import mongoose from 'mongoose';

const CourseMaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  fileUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CourseMaterial', CourseMaterialSchema);
