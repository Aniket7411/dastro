import mongoose from 'mongoose';

const consultationCategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: 'fa-star' },
  description: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ConsultationCategory
  || mongoose.model('ConsultationCategory', consultationCategorySchema);
