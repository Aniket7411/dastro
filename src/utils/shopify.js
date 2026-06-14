const DEFAULT_SHOPIFY_MESSAGE = 'Shopify store URL is not configured yet. Add VITE_SHOPIFY_STORE_URL when the store is ready.';

export const getShopifyStoreUrl = (storeUrl = '') => {
  const configuredUrl = storeUrl || import.meta.env.VITE_SHOPIFY_STORE_URL || '';
  return configuredUrl.trim();
};

export const buildShopifyUrl = (path = '', storeUrl = '') => {
  const normalizedStoreUrl = getShopifyStoreUrl(storeUrl);
  if (!normalizedStoreUrl) return '';

  const cleanBase = normalizedStoreUrl.replace(/\/$/, '');
  const cleanPath = path ? `/${String(path).replace(/^\//, '')}` : '';
  return `${cleanBase}${cleanPath}`;
};

export const openShopifyStore = ({ path = '', storeUrl = '', toast, message = DEFAULT_SHOPIFY_MESSAGE } = {}) => {
  const url = buildShopifyUrl(path, storeUrl);
  if (!url) {
    if (toast) toast(message);
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};
