import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0,
  },
  usageLimit: {
    type: Number,
    default: 0,
    min: 0,
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  courseId: {
    type: String,
    default: null,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
