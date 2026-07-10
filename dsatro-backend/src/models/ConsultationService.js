import mongoose from 'mongoose';

const consultationServiceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  categorySlug: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  short: { type: String, default: '' },
  desc: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, default: 0, min: 0 },
  duration: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeColor: { type: String, default: 'purple' },
  img: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ConsultationService
  || mongoose.model('ConsultationService', consultationServiceSchema);
