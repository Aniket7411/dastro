import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  author: { type: String, default: 'Admin' },
  category: { type: String, required: true },
  image: { type: String }, // URL to image
  tags: [String],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
