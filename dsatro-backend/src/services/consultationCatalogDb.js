import ConsultationCategory from '../models/ConsultationCategory.js';
import ConsultationService from '../models/ConsultationService.js';
import { CONSULTATION_CATEGORIES } from '../data/consultationCatalog.js';

let catalogSchemaReady = false;

/** Migrate legacy categoryId/cards schema and drop stale indexes before sync. */
async function ensureConsultationCatalogSchema() {
  if (catalogSchemaReady) return;

  const collection = ConsultationCategory.collection;
  const indexes = await collection.indexes();

  if (indexes.some((idx) => idx.name === 'categoryId_1')) {
    await collection.dropIndex('categoryId_1');
  }

  await collection.updateMany(
    {
      categoryId: { $exists: true, $ne: null },
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    },
    [{ $set: { slug: '$categoryId' } }]
  );

  const duplicateSlugs = await collection.aggregate([
    { $match: { slug: { $exists: true, $nin: [null, ''] } } },
    { $group: { _id: '$slug', ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();

  for (const group of duplicateSlugs) {
    const [, ...duplicateIds] = group.ids.sort((a, b) => String(a).localeCompare(String(b)));
    if (duplicateIds.length) {
      await collection.deleteMany({ _id: { $in: duplicateIds } });
    }
  }

  await collection.deleteMany({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  });

  await ConsultationCategory.syncIndexes();
  catalogSchemaReady = true;
}

export const formatPriceLabel = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export const parseMultiQueryParam = (value) => {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  return String(value).split(',').map((v) => v.trim()).filter(Boolean);
};

const matchesSearch = (service, search) => {
  if (!search) return true;
  const needle = search.toLowerCase();
  return [service.title, service.short, service.desc, service.category, service.badge]
    .some((field) => String(field || '').toLowerCase().includes(needle));
};

export const applyServiceFilters = (services, filters = {}) => {
  const {
    categorySlugs = [],
    durations = [],
    badges = [],
    minPrice,
    maxPrice,
    search = '',
  } = filters;

  return services.filter((svc) => {
    if (categorySlugs.length && !categorySlugs.includes(svc.categoryId)) return false;
    if (durations.length && !durations.includes(svc.duration)) return false;
    if (badges.length && !badges.includes(svc.badge)) return false;
    if (minPrice != null && Number(svc.price) < Number(minPrice)) return false;
    if (maxPrice != null && Number(svc.price) > Number(maxPrice)) return false;
    if (!matchesSearch(svc, search)) return false;
    return true;
  });
};

export const sortServices = (services, sortBy = 'sortOrder', sortOrder = 'asc') => {
  const dir = sortOrder === 'desc' ? -1 : 1;
  const list = [...services];
  list.sort((a, b) => {
    if (sortBy === 'price') {
      return (Number(a.price) - Number(b.price)) * dir;
    }
    if (sortBy === 'title') {
      return String(a.title).localeCompare(String(b.title)) * dir;
    }
    if (sortBy === 'createdAt') {
      return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * dir;
    }
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDiff !== 0) return orderDiff * dir;
    return String(a.title).localeCompare(String(b.title)) * dir;
  });
  return list;
};

export const buildFilterMeta = (services, categories) => {
  const durationCounts = {};
  const badgeCounts = {};

  for (const svc of services) {
    if (svc.duration) {
      durationCounts[svc.duration] = (durationCounts[svc.duration] || 0) + 1;
    }
    if (svc.badge) {
      badgeCounts[svc.badge] = (badgeCounts[svc.badge] || 0) + 1;
    }
  }

  const prices = services.map((s) => Number(s.price)).filter((p) => !Number.isNaN(p));
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  return {
    categories: categories
      .map((cat) => ({
        id: cat.slug,
        name: cat.name,
        count: services.filter((s) => s.categoryId === cat.slug).length,
      }))
      .filter((c) => c.count > 0),
    durations: Object.entries(durationCounts)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    badges: Object.entries(badgeCounts)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    priceRange: { min, max },
  };
};

const groupServicesByCategory = (services, categories) => {
  const byCategory = services.reduce((acc, svc) => {
    if (!acc[svc.categoryId]) acc[svc.categoryId] = [];
    acc[svc.categoryId].push({
      id: svc.id,
      title: svc.title,
      short: svc.short,
      desc: svc.desc,
      price: svc.price,
      priceLabel: svc.priceLabel,
      mrp: svc.mrp,
      duration: svc.duration,
      badge: svc.badge,
      badgeColor: svc.badgeColor,
      img: svc.img,
      highlights: svc.highlights,
      sortOrder: svc.sortOrder,
      isActive: svc.isActive,
    });
    return acc;
  }, {});

  return categories
    .filter((cat) => byCategory[cat.slug]?.length > 0)
    .map((cat) => ({
      id: cat.slug,
      slug: cat.slug,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive !== false,
      cards: byCategory[cat.slug] || [],
    }));
};

export const formatServiceDoc = (service, categoryName = '') => ({
  id: service.slug,
  slug: service.slug,
  categoryId: service.categorySlug,
  category: categoryName,
  title: service.title,
  short: service.short || service.title,
  desc: service.desc,
  price: service.price,
  priceLabel: formatPriceLabel(service.price),
  mrp: service.mrp || 0,
  duration: service.duration || '',
  badge: service.badge || '',
  badgeColor: service.badgeColor || 'purple',
  img: service.img || '',
  highlights: service.highlights || [],
  sortOrder: service.sortOrder ?? 0,
  isActive: service.isActive !== false,
  createdAt: service.createdAt || null,
});

export const buildPublicCatalog = async ({
  includeInactive = false,
  categorySlugs = [],
  durations = [],
  badges = [],
  minPrice,
  maxPrice,
  search = '',
  sortBy = 'sortOrder',
  sortOrder = 'asc',
} = {}) => {
  const catFilter = includeInactive ? {} : { isActive: true };
  const svcFilter = includeInactive ? {} : { isActive: true };

  const [categories, services] = await Promise.all([
    ConsultationCategory.find(catFilter).sort({ sortOrder: 1, name: 1 }).lean(),
    ConsultationService.find(svcFilter).sort({ sortOrder: 1, title: 1 }).lean(),
  ]);

  const categoryNameBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  const formattedServices = services.map((s) =>
    formatServiceDoc(s, categoryNameBySlug[s.categorySlug] || '')
  );

  const filterMeta = buildFilterMeta(formattedServices, categories);

  const filteredServices = sortServices(
    applyServiceFilters(formattedServices, {
      categorySlugs,
      durations,
      badges,
      minPrice,
      maxPrice,
      search,
    }),
    sortBy,
    sortOrder
  );

  const publicCategories = groupServicesByCategory(filteredServices, categories);

  return {
    categories: publicCategories,
    services: filteredServices,
    total: filteredServices.length,
    filters: filterMeta,
    appliedFilters: {
      category: categorySlugs,
      duration: durations,
      badge: badges,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
      search: search || '',
      sortBy,
      sortOrder,
    },
  };
};

export const getActiveServiceBySlug = async (slug) => {
  const service = await ConsultationService.findOne({ slug, isActive: true }).lean();
  if (!service) return null;
  const category = await ConsultationCategory.findOne({ slug: service.categorySlug }).lean();
  return formatServiceDoc(service, category?.name || '');
};

/** Force a full resync of the static catalog file into the DB. Slow (~22 upserts) — call sparingly (startup, admin action), never per-request. */
export const syncCatalogFromStatic = async () => {
  await ensureConsultationCatalogSchema();

  await Promise.all(
    CONSULTATION_CATEGORIES.map((cat, ci) =>
      ConsultationCategory.findOneAndUpdate(
        { slug: cat.id },
        {
          $set: {
            slug: cat.id,
            name: cat.name,
            icon: cat.icon,
            description: cat.description,
            sortOrder: ci,
            isActive: true,
          },
          $unset: { categoryId: '', cards: '' },
        },
        { upsert: true, new: true, strict: false }
      )
    )
  );

  await Promise.all(
    CONSULTATION_CATEGORIES.flatMap((cat) =>
      cat.cards.map(async (card, si) => {
        const existing = await ConsultationService.findOne({ slug: card.id }).lean();
        const keepCustomImage = existing?.img && /^https?:\/\//i.test(existing.img);

        return ConsultationService.findOneAndUpdate(
          { slug: card.id },
          {
            slug: card.id,
            categorySlug: cat.id,
            title: card.title,
            short: card.short || card.title,
            desc: card.desc,
            price: card.price,
            mrp: card.mrp || 0,
            duration: card.duration || '',
            badge: card.badge || '',
            badgeColor: card.badgeColor || 'purple',
            img: keepCustomImage ? existing.img : (card.img || ''),
            highlights: card.highlights || [],
            sortOrder: si,
            isActive: cat.id !== 'testing',
          },
          { upsert: true, new: true }
        );
      })
    )
  );

  const count = await ConsultationService.countDocuments();
  return { synced: true, count };
};

let catalogSyncPromise = null;
let catalogKnownNonEmpty = false;

/**
 * Syncs the static catalog into the DB once per server process (memoized).
 * Prefer seedCatalogFromStaticIfEmpty on public request paths — a full sync is expensive.
 */
export const ensureCatalogSynced = () => {
  if (!catalogSyncPromise) {
    catalogSyncPromise = syncCatalogFromStatic()
      .then((result) => {
        catalogKnownNonEmpty = true;
        return result;
      })
      .catch((err) => {
        catalogSyncPromise = null; // allow a retry on the next request if this attempt failed
        throw err;
      });
  }
  return catalogSyncPromise;
};

/**
 * Hot-path safe: only runs the expensive catalog upsert when the collection is empty.
 * After the first successful non-empty check, subsequent calls are free in-memory.
 */
export const seedCatalogFromStaticIfEmpty = async () => {
  if (catalogKnownNonEmpty) return { synced: false, skipped: true };

  const count = await ConsultationService.estimatedDocumentCount();
  if (count > 0) {
    catalogKnownNonEmpty = true;
    return { synced: false, count };
  }

  return ensureCatalogSynced();
};
