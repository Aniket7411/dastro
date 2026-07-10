function normalizeApiBase(value) {
  const trimmed = String(value ?? '').trim().replace(/\/+$/, '');
  // Allow VITE_API_URL with or without a trailing /api segment.
  return trimmed.replace(/\/api$/i, '');
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

export default API_BASE;
