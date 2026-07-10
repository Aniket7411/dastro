import Offer from '../models/Offer.js';
import asyncHandler from 'express-async-handler';
import { cacheClear, cacheGet, cacheSet } from '../utils/ttlCache.js';

const OFFERS_CACHE_NS = 'offers';
const OFFERS_TTL_MS = 30_000;

const activePublicFilter = () => {
  const now = new Date();
  return {
    isActive: true,
    showOnSite: true,
    validTill: { $gte: now },
    validFrom: { $lte: now },
  };
};

const mapPublicOffer = (o) => ({
  _id: o._id,
  offerId: o._id,
  title: o.title,
  subtitle: o.subtitle || '',
  description: o.description || '',
  type: o.type,
  discount: o.discount || '',
  discountValue: o.discountValue ?? 0,
  couponCode: o.couponCode || '',
  thumbnail: o.thumbnail || '',
  ctaLabel: o.ctaLabel || 'Claim Offer',
  ctaLink: o.ctaLink || '',
  validTill: o.validTill,
  validFrom: o.validFrom,
  priority: o.priority ?? 0,
});

/** @route GET /api/offers */
export const getPublicOffers = asyncHandler(async (req, res) => {
  const cached = cacheGet(OFFERS_CACHE_NS, 'public');
  if (cached) return res.json(cached);

  const offers = await Offer.find(activePublicFilter())
    .sort({ priority: -1, validTill: 1, createdAt: -1 })
    .lean();

  const payload = { success: true, offers: offers.map(mapPublicOffer) };
  cacheSet(OFFERS_CACHE_NS, 'public', payload, OFFERS_TTL_MS);
  res.json(payload);
});

/** @route GET /api/offers/admin */
export const getAdminOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({}).sort({ priority: -1, createdAt: -1 });
  res.json({ success: true, offers });
});

/** @route POST /api/offers */
export const createOffer = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    description,
    type,
    discount,
    discountValue,
    couponCode,
    thumbnail,
    ctaLabel,
    ctaLink,
    showOnSite,
    priority,
    validFrom,
    validTill,
    isActive,
  } = req.body;

  if (!title?.trim()) {
    res.status(400);
    throw new Error('Title is required');
  }
  if (!validTill) {
    res.status(400);
    throw new Error('Valid till date is required');
  }

  const offer = await Offer.create({
    title: title.trim(),
    subtitle: subtitle || '',
    description: description || '',
    type: type || 'custom',
    discount: discount || '',
    discountValue: Number(discountValue) || 0,
    couponCode: couponCode ? String(couponCode).trim().toUpperCase() : '',
    thumbnail: thumbnail || '',
    ctaLabel: ctaLabel || 'Claim Offer',
    ctaLink: ctaLink || '',
    showOnSite: showOnSite !== false,
    priority: Number(priority) || 0,
    validFrom: validFrom ? new Date(validFrom) : new Date(),
    validTill: new Date(validTill),
    isActive: isActive !== false,
  });

  cacheClear(OFFERS_CACHE_NS);
  res.status(201).json({ success: true, offer });
});

/** @route PUT /api/offers/:id */
export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }

  const fields = [
    'title',
    'subtitle',
    'description',
    'type',
    'discount',
    'discountValue',
    'couponCode',
    'thumbnail',
    'ctaLabel',
    'ctaLink',
    'showOnSite',
    'priority',
    'validFrom',
    'validTill',
    'isActive',
  ];

  fields.forEach((key) => {
    if (req.body[key] === undefined) return;
    if (key === 'couponCode') {
      offer.couponCode = req.body.couponCode ? String(req.body.couponCode).trim().toUpperCase() : '';
      return;
    }
    if (key === 'discountValue' || key === 'priority') {
      offer[key] = Number(req.body[key]) || 0;
      return;
    }
    if (key === 'validFrom' || key === 'validTill') {
      offer[key] = new Date(req.body[key]);
      return;
    }
    offer[key] = req.body[key];
  });

  const updated = await offer.save();
  cacheClear(OFFERS_CACHE_NS);
  res.json({ success: true, offer: updated });
});

/** @route DELETE /api/offers/:id */
export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }
  await offer.deleteOne();
  cacheClear(OFFERS_CACHE_NS);
  res.json({ success: true, message: 'Offer removed' });
});
