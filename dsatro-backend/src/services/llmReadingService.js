import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../config/logger.js';
import { getFallbackReading } from '../data/fallbackReadings.js';
import { getSunSignFromDob } from '../utils/sunSignFromDob.js';

/** Default model — higher free-tier RPM than gemini-2.0-flash / pro */
export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Brain 2 — narrator only. All astrological facts arrive pre-verified from
 * astrologyService.getVerifiedFacts() (Brain 1: local ephemeris + astrologyapi.com).
 * Gemini's only job is to phrase them warmly — it must never calculate or invent a fact.
 */
const ASTROLOGY_SYSTEM_INSTRUCTION = `You are the DS Astrology preliminary-reading writer, on Damini Shukla's consultation team.
You do NOT calculate anything. All astrological facts given to you below are already verified —
treat them as true, never contradict, invent, or add numbers to them.
Your only job is to phrase the given facts into a warm, positive, simple reading for an Indian caller,
in both English and easy Hindi (Devanagari script).
Do NOT predict death, illness, accidents, or disasters. Do NOT invent specific past traumatic events.
Do NOT make medical, legal, or financial promises. Keep the whole reading under 150 words.
Always follow the exact output format in the user message.`;

function getGeminiModelName() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

function getGeminiTimeoutMs() {
  return parseInt(process.env.FREE_CONSULTATION_LLM_TIMEOUT_MS || '10000', 10);
}

function getGeminiMaxRetries() {
  return Math.min(Math.max(parseInt(process.env.GEMINI_MAX_RETRIES || '3', 10) || 3, 0), 5);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPronoun(gender = '') {
  const g = String(gender).toLowerCase();
  if (g === 'female') return { cap: 'Her', lower: 'her' };
  if (g === 'male') return { cap: 'His', lower: 'his' };
  return { cap: 'Their', lower: 'their' };
}

function factsToReadingFields(facts) {
  return {
    luckyNumber: facts.luckyNumber || '',
    luckyColour: facts.luckyColour || '',
    luckyColourHi: facts.luckyColourHi || '',
    sunSign: facts.sunSign || '',
    rashiHi: facts.rashiHi || '',
    moonSign: facts.moonSign || '',
    nakshatra: facts.nakshatra || '',
    mahadashaPlanet: facts.mahadashaPlanet || '',
    mahadashaPlanetHi: facts.mahadashaPlanetHi || '',
  };
}

/** The real nature/personality content — moon (Vedic rashi) preferred over sun. */
function primaryRashiReport(facts) {
  return facts.moonRashiReport || facts.sunRashiReport || '';
}

function buildNarrationPrompt(leadInput, facts) {
  const pronoun = getPronoun(leadInput.gender);
  const reason = leadInput.reasonForCalling || 'their question';
  const report = primaryRashiReport(facts);
  const reportPlanet = facts.moonRashiReport ? 'Moon (Vedic Rashi)' : 'Sun';

  const dashaLine = facts.mahadashaPlanet
    ? `Current Mahadasha (planetary period): ${facts.mahadashaPlanet}`
    : 'Current Mahadasha: not available';

  return `VERIFIED DATA (already calculated/written by our astrology data provider — do not
change, contradict, or invent facts beyond what's given):
  Name: ${leadInput.name || 'Caller'}
  Sun sign: ${facts.sunSign}
  ${facts.moonSign ? `Moon sign/Rashi: ${facts.moonSign}${facts.nakshatra ? ` (Nakshatra: ${facts.nakshatra})` : ''}` : 'Moon sign/Rashi: not available (birth time unknown)'}
  ${dashaLine}
  Lucky Number: ${facts.luckyNumber}
  Lucky Colour: ${facts.luckyColour}
  Reason for call: ${reason}

  Real personality report (source: astrology data provider, based on ${reportPlanet} rashi —
  treat as verified ground truth, condense it, do not add new personality traits of your own):
  """
  ${report || 'not available'}
  """

RULES:
  - Your "Nature" section must be a warm, condensed rephrasing of the personality report above —
    do not invent temperament details that aren't in that report. If the report says "not
    available", write 1-2 general warm lines from the Sun/Moon sign instead.
  - Warm, hopeful, simple. No fear (no death/illness/accident), no invented past events, no
    medical/legal/financial promises.
  - Use ONLY the facts and report given above. If a line says "not available", skip it gracefully
    instead of making one up.
  - End on the specificity gap: exact answers, timing and remedies on "${reason}" need birth time
    (if it was marked unavailable) and Damini ma'am's live full reading.

Return ONLY this exact structure, nothing else:

[ENGLISH]
${pronoun.cap} Nature: (2-3 warm lines — condensed from the real personality report above)
${pronoun.cap} Current Phase: (2-3 lines about this period of life, from the Mahadasha if available, gently touching "${reason}" in a hopeful way)
What ${pronoun.cap} Chart Will Reveal: (2-3 lines — exact answers on "${reason}", timing & remedies need birth time + a live session)

[HINDI]
आपका स्वभाव: (2-3 lines in Hindi — warm, simple Hindi, same meaning as above)
आपका वर्तमान चरण: (2-3 lines in Hindi about the current life phase)
पूरी कुंडली क्या बताएगी: (2-3 lines in Hindi — full kundli with janam samay and live session needed)`;
}

function parseSectionFields(section, lang) {
  if (!section) return { nature: '', currentPhase: '', fullChartReveal: '' };

  if (lang === 'hi') {
    const natureMatch = section.match(/आपका स्वभाव[:\s]*([\s\S]*?)(?=आपका वर्तमान चरण|$)/);
    const phaseMatch = section.match(/आपका वर्तमान चरण[:\s]*([\s\S]*?)(?=पूरी कुंडली|$)/);
    const revealMatch = section.match(/पूरी कुंडली क्या बताएगी[:\s]*([\s\S]*?)$/);
    return {
      nature: (natureMatch?.[1] || '').trim(),
      currentPhase: (phaseMatch?.[1] || '').trim(),
      fullChartReveal: (revealMatch?.[1] || '').trim(),
    };
  }

  const natureMatch = section.match(/(?:Your|Her|His|Their) Nature[:\s]*([\s\S]*?)(?=(?:Your|Her|His|Their) Current Phase|$)/i);
  const phaseMatch = section.match(/(?:Your|Her|His|Their) Current Phase[:\s]*([\s\S]*?)(?=What (?:Your|Her|His|Their) (?:Full )?Chart|$)/i);
  const revealMatch = section.match(/What (?:Your|Her|His|Their) (?:Full )?Chart Will Reveal[:\s]*([\s\S]*?)$/i);
  return {
    nature: (natureMatch?.[1] || '').trim(),
    currentPhase: (phaseMatch?.[1] || '').trim(),
    fullChartReveal: (revealMatch?.[1] || '').trim(),
  };
}

export function parseNarrativeText(text) {
  if (!text) return null;

  const englishSection = text.match(/\[ENGLISH\]([\s\S]*?)(?=\[HINDI\]|$)/i)?.[1] || '';
  const hindiSection = text.match(/\[HINDI\]([\s\S]*?)$/i)?.[1] || '';

  const en = parseSectionFields(englishSection, 'en');
  const hi = parseSectionFields(hindiSection, 'hi');

  if (!en.nature && !hi.nature) return null;

  return {
    natureEn: en.nature,
    natureHi: hi.nature,
    currentPhaseEn: en.currentPhase,
    currentPhaseHi: hi.currentPhase,
    fullChartRevealEn: en.fullChartReveal,
    fullChartRevealHi: hi.fullChartReveal,
    nature: en.nature,
    currentPhase: en.currentPhase,
    fullChartReveal: en.fullChartReveal,
    rawText: text.trim(),
  };
}

function truncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).replace(/\s+\S*$/, '')}…`;
}

/** Level 2 fallback — Brain 1 facts are verified but Gemini failed. No AI, fixed sentence templates. */
function buildFactsOnlyReading(leadInput, facts) {
  const reason = leadInput.reasonForCalling || 'the area you asked about';
  const report = primaryRashiReport(facts);

  const natureEn = report
    ? truncate(report, 400)
    : facts.moonSign
      ? `Your Moon sign is ${facts.moonSign}${facts.nakshatra ? `, in ${facts.nakshatra} Nakshatra` : ''}. This shapes your inner nature and emotions.`
      : `Your Sun sign is ${facts.sunSign}. This shapes your core nature and outlook on life.`;
  // No Gemini available in this fallback to translate — Hindi line stays a short generic pointer.
  const natureHi = facts.moonSign
    ? `आपकी चंद्र राशि ${facts.moonSign} है${facts.nakshatra ? `, नक्षत्र ${facts.nakshatra}` : ''} — यह आपके स्वभाव और भावनाओं को आकार देती है।`
    : `आपकी राशि ${facts.sunSign} है, जो आपके स्वभाव और जीवन के प्रति नजरिए को दर्शाती है।`;

  const currentPhaseEn = facts.mahadashaPlanet
    ? `You are currently in the Mahadasha of ${facts.mahadashaPlanet} — a period whose lessons and opportunities connect closely with ${reason}.`
    : `This is an important phase of growth, especially regarding ${reason}.`;
  const currentPhaseHi = facts.mahadashaPlanet
    ? `अभी आप ${facts.mahadashaPlanetHi || facts.mahadashaPlanet} की महादशा में हैं, जो ${reason} से जुड़े अनुभवों और अवसरों को प्रभावित करती है।`
    : `यह ${reason} के लिए एक महत्वपूर्ण और विकास भरा समय है।`;

  const fullChartRevealEn = `For exact timing and personalised remedies on ${reason}, your full birth chart and a live session with Damini ma'am will give clear answers.`;
  const fullChartRevealHi = `${reason} पर सटीक समय और व्यक्तिगत उपाय जानने के लिए पूरी जन्म कुंडली और दामिनी मैम के साथ लाइव सत्र जरूरी है।`;

  return {
    ...factsToReadingFields(facts),
    natureEn,
    natureHi,
    currentPhaseEn,
    currentPhaseHi,
    fullChartRevealEn,
    fullChartRevealHi,
    nature: natureEn,
    currentPhase: currentPhaseEn,
    fullChartReveal: fullChartRevealEn,
    source: 'facts-only',
    rawText: '',
  };
}

function isRetryableGeminiError(message = '') {
  const lower = message.toLowerCase();
  return lower.includes('429')
    || lower.includes('quota')
    || lower.includes('rate limit')
    || lower.includes('resource exhausted')
    || lower.includes('too many requests');
}

function maskApiKey(key = '') {
  const trimmed = String(key).trim();
  if (trimmed.length <= 12) return '***';
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}

function classifyGeminiError(message = '') {
  const lower = message.toLowerCase();
  if (isRetryableGeminiError(message)) {
    return {
      code: 'quota',
      hint: 'Enable billing in Google AI Studio or use GEMINI_MODEL=gemini-1.5-flash (avoid gemini-2.0-flash on free tier)',
    };
  }
  if (lower.includes('401') || lower.includes('403') || lower.includes('api key')) {
    return {
      code: 'auth',
      hint: 'Create or copy a valid key from https://aistudio.google.com/apikey and set GEMINI_API_KEY in backend/.env',
    };
  }
  if (lower.includes('not found') || lower.includes('404')) {
    return {
      code: 'model',
      hint: `Model not available — try GEMINI_MODEL=${DEFAULT_GEMINI_MODEL}`,
    };
  }
  return {
    code: 'unknown',
    hint: 'Check GEMINI_API_KEY and GEMINI_MODEL in backend/.env',
  };
}

/**
 * Lightweight API check — lists models (does NOT consume generate_content quota).
 */
async function verifyGeminiApiKey(apiKey, modelName) {
  const url = `${GEMINI_MODELS_URL}?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[${res.status}] ${body.slice(0, 400)}`);
  }

  const data = await res.json();
  const models = Array.isArray(data.models) ? data.models : [];
  const target = `models/${modelName}`;
  const modelAvailable = models.some((m) => m.name === target || m.name === modelName);

  return {
    modelCount: models.length,
    modelAvailable,
    checkMethod: 'listModels',
  };
}

async function callGeminiOnce(prompt, { modelName, timeoutMs }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: ASTROLOGY_SYSTEM_INSTRUCTION,
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gemini request timed out')), timeoutMs);
  });

  const result = await Promise.race([
    model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
    timeoutPromise,
  ]);

  const text = result.response?.text()?.trim();
  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  return text;
}

/**
 * Generate with exponential backoff on 429 / rate-limit errors.
 */
async function callGemini(prompt) {
  const modelName = getGeminiModelName();
  const timeoutMs = getGeminiTimeoutMs();
  const maxRetries = getGeminiMaxRetries();
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await callGeminiOnce(prompt, { modelName, timeoutMs });
    } catch (error) {
      lastError = error;
      const retryable = isRetryableGeminiError(error.message);
      if (!retryable || attempt >= maxRetries) {
        throw error;
      }
      const delayMs = Math.min(1000 * 2 ** attempt, 8000);
      logger.warn(`Gemini rate limit — retry ${attempt + 1}/${maxRetries} in ${delayMs}ms`);
      await sleep(delayMs);
    }
  }

  throw lastError || new Error('Gemini request failed');
}

/**
 * Startup / manual health check — listModels only (no generation quota).
 */
export async function checkGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = getGeminiModelName();
  const timeoutMs = getGeminiTimeoutMs();

  if (!apiKey) {
    return {
      ok: false,
      configured: false,
      model: modelName,
      timeoutMs,
      checkMethod: 'none',
      message: 'GEMINI_API_KEY is not set',
      hint: 'Add GEMINI_API_KEY to backend/.env — free consultation will use fallback templates only',
    };
  }

  try {
    const verification = await verifyGeminiApiKey(apiKey, modelName);

    if (!verification.modelAvailable) {
      return {
        ok: false,
        configured: true,
        model: modelName,
        timeoutMs,
        keyHint: maskApiKey(apiKey),
        checkMethod: verification.checkMethod,
        code: 'model',
        message: `Model "${modelName}" not found in API (${verification.modelCount} models listed)`,
        hint: `Set GEMINI_MODEL=${DEFAULT_GEMINI_MODEL} in backend/.env`,
      };
    }

    return {
      ok: true,
      configured: true,
      model: modelName,
      timeoutMs,
      keyHint: maskApiKey(apiKey),
      checkMethod: verification.checkMethod,
      message: 'API key valid — model available',
      hint: '',
    };
  } catch (error) {
    const classified = classifyGeminiError(error.message);
    return {
      ok: false,
      configured: true,
      model: modelName,
      timeoutMs,
      keyHint: maskApiKey(apiKey),
      checkMethod: 'listModels',
      code: classified.code,
      message: error.message,
      hint: classified.hint,
    };
  }
}

/** Pretty terminal log block (server startup + verify script). */
export function logGeminiStatus(result) {
  const line = '------------------------------------------';
  logger.info(line);
  logger.info('🔮 Astrology Backend: Verifying Gemini connection...');

  if (result.ok) {
    logger.info('✅ CONNECTION SUCCESSFUL');
    logger.info(`📡 ACTIVE MODEL: ${result.model}`);
    logger.info(`🔑 KEY: ${result.keyHint}`);
    logger.info(`⏱️  TIMEOUT: ${result.timeoutMs}ms`);
    logger.info(`   Verified via ${result.checkMethod} (no generation quota used)`);
    logger.info('   Free consultation readings use AI with retry + fallback on errors');
  } else if (!result.configured) {
    logger.warn('⚠️  Gemini not configured');
    logger.warn(`   ${result.hint || result.message}`);
  } else {
    logger.error('❌ CONNECTION ERROR');
    logger.error(`   Model: ${result.model} | Key: ${result.keyHint}`);
    if (result.code === 'quota') {
      logger.error('   Cause: Rate limit / quota exceeded (429)');
    }
    logger.error(`   ${result.message}`);
    if (result.hint) {
      logger.warn(`   💡 ${result.hint}`);
    }
    logger.warn('   Free consultation will use sign templates until Gemini works');
  }

  logger.info(line);
}

/**
 * Two-brain reading generation.
 * `facts` comes from astrologyService.getVerifiedFacts() (Brain 1 — local ephemeris +
 * astrologyapi.com). This function (Brain 2) only narrates those facts via Gemini.
 *
 * Fallback ladder:
 *   facts available + Gemini OK      -> AI narration around verified facts   (source: 'ai')
 *   facts available, Gemini fails    -> fixed template from verified facts   (source: 'facts-only')
 *   facts themselves unavailable     -> generic per-sun-sign template        (source: 'fallback')
 */
export async function generatePreliminaryReading(leadInput, facts) {
  if (!facts?.sunSign) {
    logger.warn('Free consultation: no verified facts available, using sun-sign fallback');
    const computedSunSign = getSunSignFromDob(leadInput.dob);
    return { ...getFallbackReading(computedSunSign), aiError: 'Astrology facts unavailable' };
  }

  const prompt = buildNarrationPrompt(leadInput, facts);

  try {
    const rawText = await callGemini(prompt);
    const narrative = parseNarrativeText(rawText);

    if (!narrative) {
      throw new Error('Could not parse Gemini response');
    }

    return {
      ...factsToReadingFields(facts),
      ...narrative,
      source: 'ai',
      aiError: '',
    };
  } catch (error) {
    logger.warn(`Free consultation AI narration failed, using facts-only template: ${error.message}`);
    return {
      ...buildFactsOnlyReading(leadInput, facts),
      aiError: error.message,
    };
  }
}
