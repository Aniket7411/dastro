import logger from '../config/logger.js';

const BASE_URL = 'https://json.astrologyapi.com/v1';
const DEFAULT_TIMEOUT_MS = 6000;

/** DS Astrology only serves Indian callers — IST has no DST, so this is safe to hardcode. */
export const INDIA_TZONE = 5.5;

function getApiKey() {
  return process.env.ASTROLOGYAPI_KEY?.trim();
}

function getTimeoutMs() {
  return parseInt(process.env.ASTROLOGYAPI_TIMEOUT_MS || String(DEFAULT_TIMEOUT_MS), 10);
}

async function callAstrologyApi(endpoint, body) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('ASTROLOGYAPI_KEY is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'x-astrologyapi-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`[${res.status}] astrologyapi ${endpoint}: ${text.slice(0, 300)}`);
    }

    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`astrologyapi ${endpoint} timed out after ${getTimeoutMs()}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * City/place name -> coordinates, via astrologyapi.com's geo_details endpoint.
 * Returns null (never throws) so callers can degrade gracefully.
 */
export async function geocodePlace(place) {
  if (!place?.trim()) return null;

  try {
    const data = await callAstrologyApi('geo_details', { place: place.trim(), maxRows: 1 });
    const match = data?.geonames?.[0];
    if (!match) return null;

    return {
      lat: parseFloat(match.latitude),
      lon: parseFloat(match.longitude),
      timezoneId: match.timezone_id || '',
      placeName: match.place_name || place,
    };
  } catch (error) {
    logger.warn(`astrologyapi geo_details failed: ${error.message}`);
    return null;
  }
}

/**
 * Current running Vimshottari Mahadasha for a birth datetime + location.
 * Returns null (never throws) so callers can degrade gracefully.
 */
export async function getCurrentMahadasha({ day, month, year, hour, min, lat, lon, tzone = INDIA_TZONE }) {
  try {
    const data = await callAstrologyApi('current_vdasha', { day, month, year, hour, min, lat, lon, tzone });
    const major = data?.major || (Array.isArray(data) ? data[0] : null);
    if (!major?.planet) return null;

    return {
      planet: major.planet,
      start: major.start || '',
      end: major.end || '',
    };
  } catch (error) {
    logger.warn(`astrologyapi current_vdasha failed: ${error.message}`);
    return null;
  }
}

/**
 * Real descriptive personality text for a planet's rashi (sign placement), straight from
 * astrologyapi.com's own content — not LLM-invented. Used for "sun" and "moon".
 * Returns null (never throws) so callers can degrade gracefully.
 */
export async function getRashiReport(planetName, { day, month, year, hour, min, lat, lon, tzone = INDIA_TZONE }) {
  try {
    const data = await callAstrologyApi(`general_rashi_report/${planetName}`, {
      day, month, year, hour, min, lat, lon, tzone,
    });
    const text = data?.rashi_report?.trim();
    if (!text) return null;
    return text;
  } catch (error) {
    logger.warn(`astrologyapi general_rashi_report/${planetName} failed: ${error.message}`);
    return null;
  }
}

function maskApiKey(key = '') {
  const trimmed = String(key).trim();
  if (trimmed.length <= 12) return '***';
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}

/**
 * Manual/startup health check — makes one real (credit-consuming) geo_details call
 * for a known city to confirm the key is valid and the account is live.
 */
export async function checkAstrologyApiConnection() {
  const apiKey = getApiKey();
  const timeoutMs = getTimeoutMs();

  if (!apiKey) {
    return {
      ok: false,
      configured: false,
      timeoutMs,
      message: 'ASTROLOGYAPI_KEY is not set',
      hint: 'Add ASTROLOGYAPI_KEY to backend/.env — free consultation will skip Mahadasha and use local facts only',
    };
  }

  try {
    const data = await callAstrologyApi('geo_details', { place: 'Mumbai', maxRows: 1 });
    const match = data?.geonames?.[0];

    if (!match) {
      return {
        ok: false,
        configured: true,
        timeoutMs,
        keyHint: maskApiKey(apiKey),
        message: 'Key accepted but geo_details returned no results — unexpected response shape',
        hint: 'Check astrologyapi.com dashboard for account/plan status',
      };
    }

    return {
      ok: true,
      configured: true,
      timeoutMs,
      keyHint: maskApiKey(apiKey),
      message: `API key valid — test lookup for "Mumbai" returned lat=${match.latitude}, lon=${match.longitude}`,
      hint: '',
    };
  } catch (error) {
    const lower = error.message.toLowerCase();
    let hint = 'Check ASTROLOGYAPI_KEY in backend/.env';
    if (lower.includes('401') || lower.includes('403') || lower.includes('unauthor')) {
      hint = 'Key looks invalid/expired — copy a fresh token from your astrologyapi.com dashboard';
    } else if (lower.includes('402') || lower.includes('credit') || lower.includes('insufficient')) {
      hint = 'Key is valid but out of credits — top up on astrologyapi.com';
    }

    return {
      ok: false,
      configured: true,
      timeoutMs,
      keyHint: maskApiKey(apiKey),
      message: error.message,
      hint,
    };
  }
}

/**
 * Free startup log — checks the env var is present only, no network call, no credit spent.
 * For a real connection test (does spend 1 credit) use `npm run verify:astrologyapi`.
 */
export function logAstrologyApiConfigured() {
  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('⚠️  ASTROLOGYAPI_KEY not set — free consultation will skip Mahadasha, local facts only');
    return;
  }
  logger.info(`🪐 astrologyapi.com key configured (${maskApiKey(apiKey)}) — run "npm run verify:astrologyapi" to test the connection`);
}

/** Pretty terminal log block (server startup + verify script). */
export function logAstrologyApiStatus(result) {
  const line = '------------------------------------------';
  logger.info(line);
  logger.info('🪐 Astrology Backend: Verifying astrologyapi.com connection...');

  if (result.ok) {
    logger.info('✅ CONNECTION SUCCESSFUL');
    logger.info(`🔑 KEY: ${result.keyHint}`);
    logger.info(`⏱️  TIMEOUT: ${result.timeoutMs}ms`);
    logger.info(`   ${result.message}`);
    logger.info('   Free consultation readings will include Mahadasha from astrologyapi.com');
  } else if (!result.configured) {
    logger.warn('⚠️  astrologyapi.com not configured');
    logger.warn(`   ${result.hint || result.message}`);
  } else {
    logger.error('❌ CONNECTION ERROR');
    logger.error(`   Key: ${result.keyHint}`);
    logger.error(`   ${result.message}`);
    if (result.hint) {
      logger.warn(`   💡 ${result.hint}`);
    }
    logger.warn('   Free consultation will proceed without Mahadasha until this is fixed');
  }

  logger.info(line);
}
