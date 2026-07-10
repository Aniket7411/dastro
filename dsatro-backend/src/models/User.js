import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  mobile: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
