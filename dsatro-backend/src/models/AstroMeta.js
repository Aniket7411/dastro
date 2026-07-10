import mongoose from 'mongoose';

const AstroMetaSchema = new mongoose.Schema({
  type: { type: String, required: true, index: true }, // 'moon_phase', 'radical_number', 'zodiac_sign'
  key: { type: String, required: true, index: true },  // '1', 'Aries', 'New Moon'
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('AstroMeta', AstroMetaSchema);
