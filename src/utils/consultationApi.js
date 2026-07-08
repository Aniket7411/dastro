import { useState, useEffect, useCallback, useMemo } from 'react';
import API_BASE from './api';

const CACHE_TTL_MS = 60_000;
let sharedCache = {
  key: '',
  data: null,
  fetchedAt: 0,
  promise: null,
};

export function invalidateConsultationCache() {
  sharedCache = { key: '', data: null, fetchedAt: 0, promise: null };
}

function buildCatalogQuery(filters = {}) {
  const params = new URLSearchParams();
  const {
    categories = [],
    durations = [],
    badges = [],
    minPrice,
    maxPrice,
    search = '',
    sortBy = 'sortOrder',
    sortOrder = 'asc',
  } = filters;

  if (categories.length) params.set('category', categories.join(','));
  if (durations.length) params.set('duration', durations.join(','));
  if (badges.length) params.set('badge', badges.join(','));
  if (minPrice != null && minPrice !== '') params.set('minPrice', String(minPrice));
  if (maxPrice != null && maxPrice !== '') params.set('maxPrice', String(maxPrice));
  if (search.trim()) params.set('q', search.trim());
  if (sortBy) params.set('sortBy', sortBy);
  if (sortOrder) params.set('sortOrder', sortOrder);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchConsultationCatalog(filters = {}, { force = false } = {}) {
  const query = buildCatalogQuery(filters);
  const cacheKey = query || 'all';
  const now = Date.now();

  if (
    !force
    && sharedCache.key === cacheKey
    && sharedCache.data
    && now - sharedCache.fetchedAt < CACHE_TTL_MS
  ) {
    return sharedCache.data;
  }

  if (!force && sharedCache.promise && sharedCache.key === cacheKey) {
    return sharedCache.promise;
  }

  sharedCache.key = cacheKey;
  sharedCache.promise = fetch(`${API_BASE}/api/consultations/services${query}`)
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || data.error || 'Failed to load consultation catalog');
      }
      const result = {
        categories: data.categories || [],
        services: data.services || [],
        total: data.total ?? (data.services || []).length,
        filters: data.filters || null,
        appliedFilters: data.appliedFilters || null,
      };
      sharedCache.data = result;
      sharedCache.fetchedAt = Date.now();
      return result;
    })
    .finally(() => {
      sharedCache.promise = null;
    });

  return sharedCache.promise;
}

export async function fetchConsultationService(serviceId) {
  const res = await fetch(`${API_BASE}/api/consultations/services/${encodeURIComponent(serviceId)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Service not found');
  }
  return data.service;
}

export function useConsultationCatalog(filters = {}) {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [filterMeta, setFilterMeta] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = useMemo(
    () => JSON.stringify(filters),
    [
      filters.categories,
      filters.durations,
      filters.badges,
      filters.minPrice,
      filters.maxPrice,
      filters.search,
      filters.sortBy,
      filters.sortOrder,
    ]
  );

  const reload = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConsultationCatalog(filters, { force });
      setCategories(data.categories);
      setServices(data.services);
      setFilterMeta(data.filters);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
      setCategories([]);
      setServices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    reload(false);
  }, [reload]);

  return { categories, services, filterMeta, total, loading, error, reload };
}

export function useConsultationService(serviceId) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchConsultationService(serviceId);
        if (!cancelled) setService(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [serviceId]);

  return { service, loading, error };
}

export function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const HOME_CONSULTATION_FALLBACK_IMG = '/images/consultation_banner.png';

/** Map API consultation service → home card / carousel slide shape */
export function mapConsultationServiceToHomeCard(service) {
  const priceValue = Number(service?.price) || 0;
  const mrp = Number(service?.mrp) || 0;

  return {
    id: service?.id || service?.slug,
    title: service?.title || '',
    short: service?.short || '',
    img: service?.img || HOME_CONSULTATION_FALLBACK_IMG,
    desc: service?.desc || '',
    duration: service?.duration || '',
    price: service?.priceLabel || (priceValue > 0 ? `₹${priceValue.toLocaleString('en-IN')}` : ''),
    priceValue,
    mrp,
    badge: service?.badge || '',
    link: `/book-consultation/${service?.id || service?.slug}`,
  };
}
