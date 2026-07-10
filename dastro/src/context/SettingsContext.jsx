import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import API_BASE from '../utils/api';
import { runWhenIdle } from '../utils/loadScript';

const SettingsContext = createContext();

const CACHE_KEY = 'ds_site_settings_v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min
/** Defer behind page-critical fetches; static pages wait even longer. */
const FETCH_IDLE_TIMEOUT_MS = 4500;
const FETCH_IDLE_STATIC_MS = 12000;

const STATIC_SETTINGS_PATHS = [
  '/about',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/blog',
  '/free-tools',
  '/numerology',
  '/tarot',
  '/love',
  '/careers',
];

function settingsIdleTimeoutMs() {
  try {
    const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    if (STATIC_SETTINGS_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
      return FETCH_IDLE_STATIC_MS;
    }
  } catch {
    // ignore
  }
  return FETCH_IDLE_TIMEOUT_MS;
}

function readCachedSettings() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.settings || !parsed?.fetchedAt) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.settings;
  } catch {
    return null;
  }
}

function writeCachedSettings(settings) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ settings, fetchedAt: Date.now() })
    );
  } catch {
    // ignore quota / private mode
  }
}

function applyDocumentMeta(settings) {
  if (!settings) return;
  if (settings.siteTitle) {
    document.title = settings.siteTitle;
  }
  if (settings.siteDescription) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings.siteDescription;
  }
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => readCachedSettings());
  const [loading, setLoading] = useState(() => !readCachedSettings());
  const inFlight = useRef(null);

  const fetchSettings = useCallback(async ({ force = false } = {}) => {
    if (!force) {
      const fresh = readCachedSettings();
      if (fresh) {
        setSettings(fresh);
        setLoading(false);
        return fresh;
      }
      if (inFlight.current) return inFlight.current;
    }

    inFlight.current = (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings`);
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          console.warn('Settings API unavailable; using defaults.');
          return null;
        }
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          writeCachedSettings(data.settings);
          applyDocumentMeta(data.settings);
          return data.settings;
        }
        return null;
      } catch (err) {
        console.error('Error fetching settings:', err);
        return null;
      } finally {
        setLoading(false);
        inFlight.current = null;
      }
    })();

    return inFlight.current;
  }, []);

  useEffect(() => {
    const cached = readCachedSettings();
    if (cached) {
      applyDocumentMeta(cached);
      setSettings(cached);
      setLoading(false);
    }

    // Idle/deferred — does not compete with page-critical fetches.
    return runWhenIdle(() => {
      fetchSettings({ force: false });
    }, settingsIdleTimeoutMs());
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: () => fetchSettings({ force: true }) }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
