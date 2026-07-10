import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "Full-time", "Remote", "Freelance"
  salary: { type: String, default: '' },
  salaryRange: { type: String, default: '' },
  postedAt: { type: Date },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  skills: [{ type: String }],
  qualifications: [{ type: String }],
  specialization: { type: String },
  icon: { type: String, default: 'sparkles' }, // Icon identifier for frontend
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
