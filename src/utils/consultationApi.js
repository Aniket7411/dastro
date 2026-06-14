import { useState, useEffect, useCallback, useMemo } from 'react';
import API_BASE from './api';

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

export async function fetchConsultationCatalog(filters = {}) {
  const res = await fetch(`${API_BASE}/api/consultations/services${buildCatalogQuery(filters)}`);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || data.error || 'Failed to load consultation catalog');
  }
  return {
    categories: data.categories || [],
    services: data.services || [],
    total: data.total ?? (data.services || []).length,
    filters: data.filters || null,
    appliedFilters: data.appliedFilters || null,
  };
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

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConsultationCatalog(filters);
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
    reload();
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
