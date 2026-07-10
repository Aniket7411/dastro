import mongoose from 'mongoose';

const OFFER_TYPES = [
  'money_coupon',
  'first_chat_free',
  'percentage_off',
  'fixed_discount',
  'custom',
];

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    type: {
      type: String,
      enum: OFFER_TYPES,
      default: 'custom',
    },
    /** Display label e.g. "20% OFF", "₹500 OFF", "First Chat FREE" */
    discount: { type: String, default: '', trim: true },
    discountValue: { type: Number, default: 0 },
    couponCode: { type: String, default: '', trim: true, uppercase: true },
    thumbnail: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Claim Offer', trim: true },
    ctaLink: { type: String, default: '', trim: true },
    showOnSite: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

OfferSchema.index({ isActive: 1, showOnSite: 1, validTill: 1, priority: -1 });

export { OFFER_TYPES };
export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
