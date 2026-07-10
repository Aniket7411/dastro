import mongoose from 'mongoose';

// Singleton — only one document will ever exist (fetched with findOne())
const liveSettingsSchema = new mongoose.Schema(
  {
    freeMinutes:                    { type: Number, default: 3, min: 0, max: 60 },
    isPaymentEnforced:              { type: Boolean, default: false },
    chatEnabled:                    { type: Boolean, default: true },
    maxConcurrentUsersPerAstrologer:{ type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model('LiveSettings', liveSettingsSchema);
