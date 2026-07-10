import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  provider: { type: String, default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  rawWebhookEvents: { type: Array, default: [] },
  amount: { type: Number, required: true },
  originalAmount: { type: Number },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String },
  guestDetails: {
    name: String,
    email: String,
    mobile: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
