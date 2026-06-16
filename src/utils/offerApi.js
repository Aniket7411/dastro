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

export async function fetchPublicOffers() {
  const res = await fetch(`${API_BASE}/api/offers`, { cache: 'no-store' });
  const json = await parseJson(res);
  return Array.isArray(json.offers) ? json.offers : [];
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
