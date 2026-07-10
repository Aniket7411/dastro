import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
    senderRole:  { type: String, enum: ['user', 'astrologer', 'system'], required: true },
    senderName:  { type: String, required: true, trim: true },
    content:     { type: String, required: true, maxlength: 2000, trim: true },
    timestamp:   { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
