/**
 * Tiny process-local TTL cache for hot public read endpoints (home page).
 * Not shared across Render instances — that's fine for short TTLs.
 */

const stores = new Map();

const getStore = (namespace) => {
  if (!stores.has(namespace)) stores.set(namespace, new Map());
  return stores.get(namespace);
};

export const cacheGet = (namespace, key) => {
  const store = getStore(namespace);
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
};

export const cacheSet = (namespace, key, value, ttlMs = 30_000) => {
  const store = getStore(namespace);
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

export const cacheDel = (namespace, key) => {
  getStore(namespace).delete(key);
};

export const cacheClear = (namespace) => {
  if (namespace) {
    stores.delete(namespace);
    return;
  }
  stores.clear();
};

/** Stable cache key from a plain object / query. */
export const cacheKeyFrom = (parts) =>
  typeof parts === 'string' ? parts : JSON.stringify(parts ?? {});
