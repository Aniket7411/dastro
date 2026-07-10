import { useState, useEffect, useCallback, useRef } from 'react';
import API_BASE from '../utils/api';
import { resolveCourseDuration } from '../utils/courseDuration';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min public courses
const CATEGORIES_TTL_MS = 10 * 60 * 1000;
/** Per-query cache so Live + Recorded (and other keys) don't overwrite each other. */
const cacheByKey = new Map();
let categoriesCache = { data: null, fetchedAt: 0, promise: null };

function getCacheEntry(key) {
  return cacheByKey.get(key) || { data: null, fetchedAt: 0, promise: null };
}

function setCacheEntry(key, patch) {
  cacheByKey.set(key, { ...getCacheEntry(key), ...patch });
}

function buildQuery({ courseType, category, limit } = {}) {
  const params = new URLSearchParams();
  if (courseType === 'Live' || courseType === 'Recorded') params.set('courseType', courseType);
  if (category && category !== 'All') params.set('category', category);
  if (limit) params.set('limit', String(limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function mapCourseFromApi(course) {
  const courseType = course.courseType || 'Recorded';
  const instructorName = typeof course.instructor === 'string'
    ? course.instructor
    : course.instructor?.name || '';

  return {
    id: course._id,
    slug: course.slug || course._id,
    title: course.title,
    shortDesc: course.description || '',
    longDesc: course.longDesc || course.description || '',
    image: course.thumbnailUrl || '/images/vedic_thumbnail.png',
    duration: resolveCourseDuration(course),
    topics: Array.isArray(course.topics) ? course.topics : [],
    schedule: courseType === 'Recorded' ? 'Self-Paced' : 'Upcoming Batch',
    level: course.level || 'Beginner',
    instructor: instructorName,
    modulesCount: course.modulesCount || course.videoCount || 0,
    category: course.category || 'Astrology',
    tier: course.tier || '',
    price: course.price,
    mrp: course.mrp || 0,
    createdAt: course.createdAt || null,
    courseType,
    isPremium: courseType === 'Recorded' && Number(course.price) > 0,
  };
}

export async function fetchCourses(options = {}, { force = false } = {}) {
  const query = buildQuery(options);
  const cacheKey = query || 'all';
  const now = Date.now();
  const entry = getCacheEntry(cacheKey);

  if (!force && entry.data && now - entry.fetchedAt < CACHE_TTL_MS) {
    return entry.data;
  }

  if (!force && entry.promise) {
    return entry.promise;
  }

  const promise = fetch(`${API_BASE}/api/courses${query}`)
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load courses');
      const courses = (data.courses || []).map(mapCourseFromApi);
      setCacheEntry(cacheKey, { data: courses, fetchedAt: Date.now(), promise: null });
      return courses;
    })
    .catch((err) => {
      setCacheEntry(cacheKey, { promise: null });
      throw err;
    });

  setCacheEntry(cacheKey, { promise });
  return promise;
}

export function invalidateCoursesCache() {
  cacheByKey.clear();
  categoriesCache = { data: null, fetchedAt: 0, promise: null };
}

export function useCourses(options = {}) {
  const { courseType, category, limit } = options;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const optionsRef = useRef({ courseType, category, limit });
  optionsRef.current = { courseType, category, limit };

  const reload = useCallback(async (force = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses(optionsRef.current, { force });
      setCourses(data);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload(false);
  }, [courseType, category, limit, reload]);

  return { courses, loading, error, reload };
}

export async function fetchCourseCategories({ force = false } = {}) {
  const now = Date.now();
  if (!force && categoriesCache.data && now - categoriesCache.fetchedAt < CATEGORIES_TTL_MS) {
    return categoriesCache.data;
  }
  if (!force && categoriesCache.promise) return categoriesCache.promise;

  categoriesCache.promise = fetch(`${API_BASE}/api/courses/categories`)
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load categories');
      const cats = data.categories || [];
      categoriesCache = { data: cats, fetchedAt: Date.now(), promise: null };
      return cats;
    })
    .catch((err) => {
      categoriesCache = { ...categoriesCache, promise: null };
      throw err;
    });

  return categoriesCache.promise;
}

export function useCourseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCourseCategories()
      .then((cats) => { if (!cancelled) setCategories(cats); })
      .catch(() => { if (!cancelled) setCategories([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}

export async function fetchCourseBySlugOrId(idOrSlug) {
  const res = await fetch(`${API_BASE}/api/courses/${encodeURIComponent(idOrSlug)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Course not found');
  }
  return {
    course: data.course,
    videos: data.videos || [],
    previewVideos: data.previewVideos || [],
    lessonCount: data.lessonCount ?? data.course?.modulesCount ?? (data.videos || []).length,
  };
}
