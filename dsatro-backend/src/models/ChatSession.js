import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema(
  {
    astrologerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Astrologer', required: true, index: true },
    userName:             { type: String, required: true, trim: true },
    userEmail:            { type: String, trim: true, default: '' },
    userPhone:            { type: String, trim: true, default: '' },
    freeMinutesAllotted:  { type: Number, default: 3 },
    status:               { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting', index: true },
    endedBy:              { type: String, enum: ['user', 'astrologer', 'system', ''], default: '' },
    startedAt:            { type: Date },
    endedAt:              { type: Date },
    messageCount:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

// For paginated session history queries
chatSessionSchema.index({ createdAt: -1 });
chatSessionSchema.index({ astrologerId: 1, createdAt: -1 });

export default mongoose.model('ChatSession', chatSessionSchema);
