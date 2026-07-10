import asyncHandler from 'express-async-handler';
import ConsultationCategory from '../models/ConsultationCategory.js';
import ConsultationService from '../models/ConsultationService.js';
import { buildPublicCatalog, formatPriceLabel, syncCatalogFromStatic } from '../services/consultationCatalogDb.js';
import { cacheClear } from '../utils/ttlCache.js';

const clearCatalogCache = () => cacheClear('consultations');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** GET /api/admin/consultation-catalog */
export const getAdminCatalog = asyncHandler(async (req, res) => {
  const catalog = await buildPublicCatalog({ includeInactive: true });
  res.json({ success: true, ...catalog });
});

/** POST /api/admin/consultation-catalog/resync — force-reload src/data/consultationCatalog.js into the DB */
export const resyncCatalog = asyncHandler(async (req, res) => {
  const result = await syncCatalogFromStatic();
  clearCatalogCache();
  res.json({ success: true, ...result });
});

/** POST /api/admin/consultation-categories */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description, sortOrder, isActive, slug } = req.body;
  if (!name?.trim()) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const categorySlug = slug?.trim() || slugify(name);
  const existing = await ConsultationCategory.findOne({ slug: categorySlug });
  if (existing) {
    res.status(409);
    throw new Error('Category slug already exists');
  }

  const category = await ConsultationCategory.create({
    slug: categorySlug,
    name: name.trim(),
    icon: icon || 'fa-star',
    description: description || '',
    sortOrder: Number(sortOrder) || 0,
    isActive: isActive !== false,
  });

  clearCatalogCache();
  res.status(201).json({ success: true, category });
});

/** PUT /api/admin/consultation-categories/:slug */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await ConsultationCategory.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, icon, description, sortOrder, isActive } = req.body;
  if (name !== undefined) category.name = name.trim();
  if (icon !== undefined) category.icon = icon;
  if (description !== undefined) category.description = description;
  if (sortOrder !== undefined) category.sortOrder = Number(sortOrder) || 0;
  if (isActive !== undefined) category.isActive = Boolean(isActive);

  await category.save();
  clearCatalogCache();
  res.json({ success: true, category });
});

/** DELETE /api/admin/consultation-categories/:slug */
export const deleteCategory = asyncHandler(async (req, res) => {
  const serviceCount = await ConsultationService.countDocuments({ categorySlug: req.params.slug });
  if (serviceCount > 0) {
    res.status(400);
    throw new Error('Remove or reassign services in this category first');
  }

  const category = await ConsultationCategory.findOneAndDelete({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  clearCatalogCache();
  res.json({ success: true });
});

/** POST /api/admin/consultation-services */
export const createService = asyncHandler(async (req, res) => {
  const {
    categorySlug, title, short, desc, price, mrp, duration,
    badge, badgeColor, img, highlights, sortOrder, isActive, slug,
  } = req.body;

  if (!categorySlug || !title?.trim() || !desc?.trim()) {
    res.status(400);
    throw new Error('Category, title, and description are required');
  }

  const category = await ConsultationCategory.findOne({ slug: categorySlug });
  if (!category) {
    res.status(400);
    throw new Error('Category not found');
  }

  const serviceSlug = slug?.trim() || slugify(title);
  const existing = await ConsultationService.findOne({ slug: serviceSlug });
  if (existing) {
    res.status(409);
    throw new Error('Service slug already exists');
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    res.status(400);
    throw new Error('Valid price is required');
  }

  const numericMrp = mrp !== undefined ? Number(mrp) : 0;
  if (Number.isNaN(numericMrp) || numericMrp < 0) {
    res.status(400);
    throw new Error('Valid MRP is required');
  }

  const service = await ConsultationService.create({
    slug: serviceSlug,
    categorySlug,
    title: title.trim(),
    short: short?.trim() || title.trim(),
    desc: desc.trim(),
    price: numericPrice,
    mrp: numericMrp,
    duration: duration || '',
    badge: badge || '',
    badgeColor: badgeColor || 'purple',
    img: img || '',
    highlights: Array.isArray(highlights) ? highlights : [],
    sortOrder: Number(sortOrder) || 0,
    isActive: isActive !== false,
  });

  clearCatalogCache();
  res.status(201).json({
    success: true,
    service: { ...service.toObject(), priceLabel: formatPriceLabel(service.price) },
  });
});

/** PUT /api/admin/consultation-services/:slug */
export const updateService = asyncHandler(async (req, res) => {
  const service = await ConsultationService.findOne({ slug: req.params.slug });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const fields = [
    'categorySlug', 'title', 'short', 'desc', 'duration',
    'badge', 'badgeColor', 'img', 'sortOrder',
  ];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      service[field] = req.body[field];
    }
  }

  if (req.body.price !== undefined) {
    const numericPrice = Number(req.body.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      res.status(400);
      throw new Error('Valid price is required');
    }
    service.price = numericPrice;
  }

  if (req.body.mrp !== undefined) {
    const numericMrp = Number(req.body.mrp);
    if (Number.isNaN(numericMrp) || numericMrp < 0) {
      res.status(400);
      throw new Error('Valid MRP is required');
    }
    service.mrp = numericMrp;
  }

  if (req.body.highlights !== undefined) {
    service.highlights = Array.isArray(req.body.highlights) ? req.body.highlights : [];
  }

  if (req.body.isActive !== undefined) {
    service.isActive = Boolean(req.body.isActive);
  }

  if (req.body.categorySlug) {
    const category = await ConsultationCategory.findOne({ slug: req.body.categorySlug });
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }
  }

  await service.save();
  clearCatalogCache();
  res.json({
    success: true,
    service: { ...service.toObject(), priceLabel: formatPriceLabel(service.price) },
  });
});

/** DELETE /api/admin/consultation-services/:slug */
export const deleteService = asyncHandler(async (req, res) => {
  const service = await ConsultationService.findOneAndDelete({ slug: req.params.slug });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  clearCatalogCache();
  res.json({ success: true });
});
