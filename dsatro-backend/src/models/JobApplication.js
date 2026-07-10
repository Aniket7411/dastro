import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, default: '' },
  totalExperience: { type: String, default: '' },
  specialization: { type: String, default: '' },
  languages: { type: String },
  coverLetter: { type: String },
  resumeUrl: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  appliedRole: { type: String, default: '' },
  status: {
    type: String,
    enum: ['New', 'Pending', 'Reviewed', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected', 'Hired'],
    default: 'New',
  },
  appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);
