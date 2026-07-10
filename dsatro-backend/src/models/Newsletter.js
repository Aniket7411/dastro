import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Subscribed', 'Unsubscribed'],
    default: 'Subscribed'
  }
}, { timestamps: true });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);
