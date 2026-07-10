import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema(
  {
    luckyNumber: String,
    luckyColour: String,
    luckyColourHi: String,
    nature: String,
    natureEn: String,
    natureHi: String,
    currentPhase: String,
    currentPhaseEn: String,
    currentPhaseHi: String,
    fullChartReveal: String,
    fullChartRevealEn: String,
    fullChartRevealHi: String,
    sunSign: String,
    rashiHi: String,
    moonSign: String,
    nakshatra: String,
    mahadashaPlanet: String,
    mahadashaPlanetHi: String,
    source: { type: String, enum: ['ai', 'facts-only', 'fallback'], default: 'fallback' },
    rawText: String,
  },
  { _id: false },
);

const freeConsultationLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    sameWhatsappAsMobile: { type: Boolean, default: false },
    age: { type: Number, required: true, min: 0 },
    ageMonths: { type: Number, min: 0, max: 11 },
    ageDisplay: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: String, required: true },
    tob: { type: String, default: '' },
    tobUnknown: { type: Boolean, default: false },
    pob: { type: String, required: true, trim: true },
    pobLat: { type: Number },
    pobLon: { type: Number },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Other'], required: true },
    reasonForCalling: { type: String, required: true, trim: true },
    consent: { type: Boolean, required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor', required: true },
    counsellorName: { type: String, required: true },
    counsellorEmail: { type: String, trim: true, lowercase: true, default: '' },
    reading: readingSchema,
    aiError: { type: String, default: '' },
    neoDoveStatus: { type: String, default: 'New' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

freeConsultationLeadSchema.index({ mobile: 1, createdAt: -1 });
freeConsultationLeadSchema.index({ counsellorId: 1, createdAt: -1 });

export default mongoose.models.FreeConsultationLead
  || mongoose.model('FreeConsultationLead', freeConsultationLeadSchema);
