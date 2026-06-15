import API_BASE from './api';

/** Categories aligned with backend contract (blog.md) */
export const BLOG_CATEGORIES = [
  'Vedic Astrology',
  'Tarot',
  'Numerology',
  'Spiritual Remedies',
  'Career & Finance',
  'Love & Relationships',
];

async function parseJsonResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an invalid response');
  }
  return res.json();
}

/**
 * @param {{ category?: string; search?: string; limit?: number }} params
 * @returns {Promise<object[]>}
 */
export async function fetchBlogs({ category, search, limit } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (search?.trim()) params.set('search', search.trim());
  if (limit) params.set('limit', String(limit));

  const qs = params.toString();
  const url = `${API_BASE}/api/blogs${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = await parseJsonResponse(res);

  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || 'Failed to load blogs');
  }

  return Array.isArray(json.blogs) ? json.blogs : [];
}

/**
 * @param {string} slug
 * @returns {Promise<object>}
 */
export async function fetchBlogBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  const json = await parseJsonResponse(res);

  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || 'Blog not found');
  }

  if (!json.blog) {
    throw new Error('Blog not found');
  }

  return json.blog;
}

export function formatBlogDate(value, style = 'short') {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  if (style === 'chip') {
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  }

  if (style === 'long') {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return date.toLocaleDateString();
}

export function blogExcerpt(blog, max = 160) {
  const text = (blog?.excerpt || '').trim();
  if (text) return text.length > max ? `${text.slice(0, max)}…` : text;
  return '';
}
