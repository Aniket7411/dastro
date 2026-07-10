import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'DS Astrology' },
  siteTitle: { type: String, default: 'DS Astrology - Cosmic Guidance & Astrology' },
  siteDescription: { type: String, default: 'Explore the cosmic mysteries with DS Astrology.' },
  contactEmail: { type: String, default: 'info@dsastroinstitute.com' },
  contactPhone: { type: String, default: '+91 75709 72970' },
  address: { type: String, default: 'Varanasi, Uttar Pradesh, India' },
  
  // Social Media
  facebookUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },

  // API Keys (Masked in frontend usually)
  razorpayKeyId: { type: String, default: '' },
  shopifyStoreUrl: { type: String, default: '' },
  googleAnalyticsId: { type: String, default: '' },

  // UI Settings
  maintenanceMode: { type: Boolean, default: false },

  // Student portal announcement strip (empty string = no announcement shown)
  announcementText: { type: String, default: '' },

  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// We only ever want one settings document
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', SettingsSchema);
