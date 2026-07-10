import mongoose from 'mongoose';

const InstructorSchema = new mongoose.Schema({
  name: { type: String },
  bio: { type: String },
  image: { type: String },
}, { _id: false });

const CurriculumModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [{ type: String }],
}, { _id: false });

const BatchDetailsSchema = new mongoose.Schema({
  startDate: { type: String },
  classCount: { type: Number },
  classDuration: { type: String },
  platform: { type: String },
}, { _id: false });

const FaqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  category: { type: String, default: 'Astrology' },
  tier: { type: String, default: '' },
  description: { type: String },
  longDesc: { type: String },
  topics: [{ type: String }],
  price: { type: Number, default: null },
  mrp: { type: Number, default: null },
  validityDays: { type: Number, default: null },
  thumbnailUrl: { type: String },
  courseType: { type: String, enum: ['Live', 'Recorded'], default: 'Recorded' },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Master', 'Advanced', 'All Levels'],
    default: 'Beginner',
  },
  instructor: { type: mongoose.Schema.Types.Mixed, default: '' },
  duration: { type: String },
  modulesCount: { type: Number },
  curriculum: [CurriculumModuleSchema],
  learningOutcomes: [{ type: String }],
  batchDetails: BatchDetailsSchema,
  faqs: [FaqSchema],
  testimonials: [{ type: mongoose.Schema.Types.Mixed }],
  launchDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

CourseSchema.index({ isActive: 1, courseType: 1, createdAt: -1 });
CourseSchema.index({ isActive: 1, category: 1, createdAt: -1 });

export default mongoose.model('Course', CourseSchema);
