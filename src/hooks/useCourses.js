import { useState, useEffect, useCallback, useRef } from 'react';
import API_BASE from '../utils/api';
import { resolveCourseDuration } from '../utils/courseDuration';

const CACHE_TTL_MS = 60_000;
let sharedCache = {
  key: '',
  data: null,
  fetchedAt: 0,
  promise: null,
};

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
    price: course.price,
    courseType,
    isPremium: courseType === 'Recorded' && Number(course.price) > 0,
  };
}

export async function fetchCourses(options = {}, { force = false } = {}) {
  const query = buildQuery(options);
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
  sharedCache.promise = fetch(`${API_BASE}/api/courses${query}`)
    .then(async (res) => {
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load courses');
      const courses = (data.courses || []).map(mapCourseFromApi);
      sharedCache.data = courses;
      sharedCache.fetchedAt = Date.now();
      return courses;
    })
    .finally(() => {
      sharedCache.promise = null;
    });

  return sharedCache.promise;
}

export function invalidateCoursesCache() {
  sharedCache = { key: '', data: null, fetchedAt: 0, promise: null };
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

export async function fetchCourseCategories() {
  const res = await fetch(`${API_BASE}/api/courses/categories`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to load categories');
  return data.categories || [];
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
  return { course: data.course, videos: data.videos || [] };
}
