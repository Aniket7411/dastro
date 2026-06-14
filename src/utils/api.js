/**
 * Central API base URL.
 *
 * Local dev  → VITE_API_URL is empty; Vite proxy rewrites:
 *   /api/*          → http://localhost:5000/api/*
 *   /_/backend/api/* → http://localhost:5000/api/*
 *
 * Production → Set VITE_API_URL=/_/backend in your deploy env.
 *   All fetch(`${API_BASE}/api/...`) calls become /_/backend/api/...
 *   which Netlify (or the experimental service router) forwards to the backend.
 */
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    
    // If we are explicitly on a local dev setup
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // return 'http://localhost:5000';
          return 'https://dsatro-backend.onrender.com';

    }
    
    // For live/production or custom IP accessed via HTTP, 
    // we return empty string to use relative paths (e.g., /api/...)
    // This allows the production reverse proxy or Vite proxy to handle routing
    // and avoids ERR_SSL_PROTOCOL_ERROR from hardcoded ports.
    return '';
  }

  // return 'http://localhost:5000';
    return 'https://dsatro-backend.onrender.com';

};

const API_BASE = getApiBase();

export default API_BASE;
