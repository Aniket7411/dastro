import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String, required: true },
  phone: { type: String }, // alias for mobile
  countryCode: { type: String, default: '+91' },
  dob: String,
  tob: String,
  pob: String, // place of birth
  location: String,
  consultationType: String,
  message: String,
  amount: { type: Number },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
  transactionId: { type: String },
  status: {
    type: String,
    default: 'Pending',
    enum: ['pending', 'Pending', 'contacted', 'Confirmed', 'completed', 'Completed', 'cancelled', 'Cancelled'],
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  preferredDatetime: { type: Date },
  notes: { type: String },
  bookedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model("Consultation", ConsultationSchema);

export default Consultation;
