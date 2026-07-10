import API_BASE from './api';

export const OFFER_TYPES = [
  { value: 'money_coupon', label: 'Money coupon (₹ off + code)' },
  { value: 'first_chat_free', label: 'First chat free' },
  { value: 'percentage_off', label: 'Percentage discount' },
  { value: 'fixed_discount', label: 'Fixed amount discount' },
  { value: 'custom', label: 'Custom offer' },
];

export const OFFER_TYPE_LABELS = Object.fromEntries(
  OFFER_TYPES.map((t) => [t.value, t.label])
);

async function parseJson(res) {
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || json.message || 'Request failed');
  }
  return json;
}

const PUBLIC_OFFERS_CACHE_KEY = 'ds_public_offers_v1';
const PUBLIC_OFFERS_TTL_MS = 10 * 60 * 1000; // 10 min
let publicOffersInFlight = null;

function readOffersCache() {
  try {
    const raw = sessionStorage.getItem(PUBLIC_OFFERS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.offers) || !parsed?.fetchedAt) return null;
    if (Date.now() - parsed.fetchedAt > PUBLIC_OFFERS_TTL_MS) return null;
    return parsed.offers;
  } catch {
    return null;
  }
}

function writeOffersCache(offers) {
  try {
    sessionStorage.setItem(
      PUBLIC_OFFERS_CACHE_KEY,
      JSON.stringify({ offers, fetchedAt: Date.now() })
    );
  } catch {
    // ignore quota / private mode
  }
}

/** Marketing surfaces where the offers modal is useful. */
export const OFFERS_MODAL_PATH_PREFIXES = [
  '/',
  '/live-courses',
  '/recorded-courses',
  '/courses',
  '/consultations',
  '/book-consultation',
  '/shop',
  '/astro-shop',
  '/astrologer',
  '/live',
  '/webinar',
];

export function shouldLoadOffersModal(pathname = '') {
  const path = (pathname.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  if (path === '/') return true;
  // Skip auth / account / legal / tools / admin surfaces
  const blocked = [
    '/about',
    '/contact',
    '/blog',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
    '/login',
    '/dashboard',
    '/student',
    '/admin',
    '/counsellor',
    '/astrologer-dashboard',
    '/astrologer-login',
    '/free-tools',
    '/numerology',
    '/tarot',
    '/love',
    '/careers',
  ];
  if (blocked.some((p) => path === p || path.startsWith(`${p}/`))) return false;
  return OFFERS_MODAL_PATH_PREFIXES.some(
    (p) => p !== '/' && (path === p || path.startsWith(`${p}/`))
  );
}

export async function fetchPublicOffers({ force = false } = {}) {
  if (!force) {
    const cached = readOffersCache();
    if (cached) return cached;
    if (publicOffersInFlight) return publicOffersInFlight;
  }

  publicOffersInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/offers`);
      const json = await parseJson(res);
      const offers = Array.isArray(json.offers) ? json.offers : [];
      writeOffersCache(offers);
      return offers;
    } finally {
      publicOffersInFlight = null;
    }
  })();

  return publicOffersInFlight;
}

export async function fetchAdminOffers(token) {
  const res = await fetch(`${API_BASE}/api/offers/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const json = await parseJson(res);
  return Array.isArray(json.offers) ? json.offers : [];
}

export async function saveOffer(token, payload, id) {
  const url = id ? `${API_BASE}/api/offers/${id}` : `${API_BASE}/api/offers`;
  const res = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await parseJson(res);
  return json.offer;
}

export async function deleteOffer(token, id) {
  const res = await fetch(`${API_BASE}/api/offers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res);
}

export function offerBadge(type) {
  switch (type) {
    case 'money_coupon':
      return 'Coupon';
    case 'first_chat_free':
      return 'Free chat';
    case 'percentage_off':
      return '% Off';
    case 'fixed_discount':
      return '₹ Off';
    default:
      return 'Offer';
  }
}

export function formatOfferDiscount(offer) {
  if (offer.discount?.trim()) return offer.discount;
  if (offer.type === 'first_chat_free') return 'First chat FREE';
  if (offer.type === 'percentage_off' && offer.discountValue) return `${offer.discountValue}% OFF`;
  if (offer.discountValue) return `₹${offer.discountValue} OFF`;
  return '';
}

export function formatOfferDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DISMISS_KEY = 'site-offers-dismissed-ids';

export function getDismissedOfferIds() {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function dismissOfferIds(ids) {
  const prev = getDismissedOfferIds();
  const next = [...new Set([...prev, ...ids.map(String)])];
  sessionStorage.setItem(DISMISS_KEY, JSON.stringify(next));
}

export function filterVisibleOffers(offers) {
  const dismissed = new Set(getDismissedOfferIds());
  return offers.filter((o) => !dismissed.has(String(o._id || o.offerId)));
}
