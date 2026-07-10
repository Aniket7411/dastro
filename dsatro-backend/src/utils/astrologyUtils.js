import { NodeJHora } from "@node-jhora/core";
import { DateTime } from "luxon";
import logger from '../config/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// --- Ephemeris Path Resolution (critical for Vercel serverless) ---
// In serverless environments, relative paths break. We resolve the
// de440s.bsp location explicitly from this file's own URL.
const __filename = fileURLToPath(import.meta.url);
const __dirname_util = dirname(__filename);


if (!process.env.NODE_JHORA_EPHE_PATH) {
  // From: backend/src/utils/astrologyUtils.js
  // To:   backend/node_modules/@node-jhora/ephe/
  const epheDir = join(__dirname_util, '../../node_modules/@node-jhora/ephe');
  const bspFile = join(epheDir, 'de440s.bsp');

  if (existsSync(bspFile)) {
    process.env.NODE_JHORA_EPHE_PATH = bspFile; // must be the FILE path, not directory
    logger.info(`✅ Ephemeris path auto-resolved: ${bspFile}`);
  } else {
    logger.error(`❌ de440s.bsp not found at: ${bspFile}`);
  }
}

// On Vercel, each cold start gets a fresh module scope.
// The singleton pattern still works — it caches within a single warm invocation burst.
let jhoraInstance = null;

/**
 * Ensures a singleton instance of the NodeJHora engine is initialized.
 * Safe for serverless: re-initializes if instance was garbage-collected.
 * @param {Object} location - Default location for initialization.
 * @returns {Promise<NodeJHora>}
 */
export const getJHora = async (location = { latitude: 0, longitude: 0 }) => {
  // Re-initialize if instance is stale or not yet created
  if (jhoraInstance) return jhoraInstance;

  try {
    logger.info("Initializing NodeJHora Engine...");
    jhoraInstance = new NodeJHora(location, { ayanamsaOrder: 1 });
    await jhoraInstance.init();
    logger.info("NodeJHora Engine initialized successfully.");
    return jhoraInstance;
  } catch (error) {
    jhoraInstance = null; // Reset so next request retries
    logger.error("Failed to initialize NodeJHora:", error);
    throw error;
  }
};

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const SIGN_LORDS = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
  'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

export const getSignFromLong = (longitude) => {
  const normalized = ((longitude % 360) + 360) % 360;
  return ZODIAC_SIGNS[Math.floor(normalized / 30)];
};

export const getHouseFromLong = (longitude, ascendantLong) => {
  const planetSignIdx = Math.floor(longitude / 30);
  const ascSignIdx = Math.floor(ascendantLong / 30);
  return ((planetSignIdx - ascSignIdx + 12) % 12) + 1;
};

export const calculateReduction = (num, keepMaster = true) => {
  while (num > 9) {
    if (keepMaster && [11, 22, 33].includes(num)) return num;
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};
