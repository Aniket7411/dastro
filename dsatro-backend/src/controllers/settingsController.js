import Settings from '../models/Settings.js';
import { isPaymentEnabled, getRazorpayConfig } from '../utils/razorpayConfig.js';
import { cacheClear, cacheGet, cacheSet } from '../utils/ttlCache.js';

const SETTINGS_CACHE_NS = 'settings';
const SETTINGS_TTL_MS = 60_000;

const buildPublicSettings = (settings) => {
  const paymentEnabled = isPaymentEnabled();
  let razorpayKeyId = settings.razorpayKeyId || '';
  if (paymentEnabled) {
    try {
      razorpayKeyId = getRazorpayConfig().keyId;
    } catch {
      razorpayKeyId = '';
    }
  }

  return {
    siteName: settings.siteName,
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address,
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    youtubeUrl: settings.youtubeUrl || '',
    youtubeUnfilteredUrl: settings.youtubeUnfilteredUrl || '',
    twitterUrl: settings.twitterUrl || '',
    whatsappNumber: settings.whatsappNumber || '',
    razorpayKeyId: paymentEnabled ? razorpayKeyId : '',
    shopifyStoreUrl: settings.shopifyStoreUrl || process.env.SHOPIFY_STORE_URL || '',
    googleAnalyticsId: settings.googleAnalyticsId || '',
    maintenanceMode: settings.maintenanceMode ?? false,
    announcementText: settings.announcementText || '',
    paymentEnabled,
    paymentMode: paymentEnabled ? 'checkout' : 'lead_capture',
  };
};

// @desc    Get all settings
// @route   GET /api/settings
export const getSettings = async (req, res) => {
  try {
    const isPublic = !req.headers.authorization;
    const cacheKey = isPublic ? 'public' : 'authed';
    const cached = cacheGet(SETTINGS_CACHE_NS, cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const settings = await Settings.getSettings();
    const payload = isPublic
      ? { success: true, settings: buildPublicSettings(settings) }
      : {
          success: true,
          settings: {
            ...buildPublicSettings(settings),
            updatedAt: settings.updatedAt,
          },
        };

    cacheSet(SETTINGS_CACHE_NS, cacheKey, payload, SETTINGS_TTL_MS);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.getSettings();

    const fieldsToUpdate = [
      'siteName', 'siteTitle', 'siteDescription', 'contactEmail',
      'contactPhone', 'address', 'facebookUrl', 'instagramUrl',
      'youtubeUrl', 'youtubeUnfilteredUrl', 'twitterUrl', 'whatsappNumber', 'razorpayKeyId',
      'shopifyStoreUrl', 'googleAnalyticsId', 'maintenanceMode',
      'announcementText',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    settings.updatedAt = Date.now();
    await settings.save();
    cacheClear(SETTINGS_CACHE_NS);

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
