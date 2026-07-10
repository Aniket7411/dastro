import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  type: {
    type: String,
    // Course         = Live course enquiry (no payment)
    // Recorded-Course= Recorded course purchase/interest (paid flow)
    // Course-Inquiry = Legacy alias for Recorded-Course (kept for backward compat)
    // Consultation   = Direct paid consultation booking
    // Webinar        = Paid webinar registration
    // Home-Enroll    = Homepage enrollment enquiry
    // Contact        = General contact form
    enum: ['Webinar', 'Course', 'Consultation', 'Home-Enroll', 'Contact', 'Course-Inquiry', 'Recorded-Course'],
    required: true
  },
  leadType: { type: String },
  courseName: { type: String },
  courseType: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  consultationType: { type: String },
  serviceId: { type: String },
  bookingMode: {
    type: String,
    enum: ['pay_now', 'pay_later'],
  },
  quotedAmount: { type: Number },
  dob: { type: String },
  tob: { type: String },
  pob: { type: String },
  city: { type: String },
  age: { type: mongoose.Schema.Types.Mixed },
  interest: { type: String },
  message: { type: String },
  amount: { type: Number },
  paymentFor: { type: String },
  paymentStatus: { type: String, default: 'PENDING' },
  status: { type: String, default: 'Pending' },
  orderId: { type: String },
  transactionId: { type: String },
  failureReason: { type: String },
  razorpayError: { type: mongoose.Schema.Types.Mixed },
  /** Server-set moment the lead form was received (falls back to createdAt for legacy rows) */
  submittedAt: { type: Date, default: Date.now },
  /** User account auto-created when this lead was submitted */
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountCreated: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
