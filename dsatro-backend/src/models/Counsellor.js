import mongoose from 'mongoose';

const counsellorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    active: { type: Boolean, default: true },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Counsellor || mongoose.model('Counsellor', counsellorSchema);
