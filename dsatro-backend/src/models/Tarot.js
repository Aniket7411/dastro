import mongoose from 'mongoose';

const tarotSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameShort: { type: String, required: true },
  value: { type: String, required: true },
  valueInt: { type: Number, required: true },
  suit: { type: String },
  arcana: { type: String, enum: ['Major', 'Minor'], required: true },
  meaningUpright: { type: String, required: true },
  meaningReversed: { type: String, required: true },
  description: { type: String },
  symbol: { type: String },
}, { timestamps: true });

const Tarot = mongoose.model('Tarot', tarotSchema);

export default Tarot;
