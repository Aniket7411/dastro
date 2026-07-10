import mongoose from 'mongoose';

const astrologerSchema = new mongoose.Schema(
  {
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:       { type: String, required: true },
    role:               { type: String, default: 'Vedic Astrologer', trim: true },
    experience:         { type: Number, default: 5, min: 0 },
    bio:                { type: String, default: '', trim: true },
    rating:             { type: Number, default: 4.5, min: 0, max: 5 },
    reviews:            { type: Number, default: 0, min: 0 },
    languages:          [{ type: String, trim: true }],
    specialties:        [{ type: String, trim: true }],
    image:              { type: String, default: '' },
    isActive:           { type: Boolean, default: true },
    isSuspended:        { type: Boolean, default: false },
    suspendedReason:    { type: String, default: '' },
    isOnline:           { type: Boolean, default: false },
    onlineAt:           { type: Date },
    order:              { type: Number, default: 0 },
    // null = use global LiveSettings value
    freeMinutesOverride: { type: Number, default: null, min: 0 },
    sessionCount:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Sparse index not needed since email is required and unique is already defined in schema fields.

export default mongoose.model('Astrologer', astrologerSchema);
