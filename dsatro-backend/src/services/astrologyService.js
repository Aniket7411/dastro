import { DateTime } from 'luxon';
import { getJHora, getSignFromLong, calculateReduction } from '../utils/astrologyUtils.js';
import { MOON_PHASES, NUMEROLOGY_DATA, ZODIAC_DATA } from '../config/tools.js';
import { getSunSignFromDob, getRashiHi, getColourHi } from '../utils/sunSignFromDob.js';
import { geocodePlace, getCurrentMahadasha, getRashiReport } from './astrologyApiClient.js';
import logger from '../config/logger.js';

const PLANET_HI = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'बृहस्पति',
  Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

class AstrologyService {
  
  async getMoonData({ name, dob, tob, lat, lon, timezone = 'UTC' }) {
    const [year, month, day] = dob.split('-').map(Number);
    const [hour, minute] = (tob || "12:00").split(':').map(Number);
    
    const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone }).toUTC();
    const location = { latitude: parseFloat(lat || 0), longitude: parseFloat(lon || 0) };
    
    const jhora = await getJHora(location);
    const planets = jhora.getPlanets(dt);
    const sun = planets.find(p => p.name === 'Sun');
    const moon = planets.find(p => p.name === 'Moon');

    const diff = (moon.longitude - sun.longitude + 360) % 360;
    const phaseIndex = Math.floor(diff / 45) + 1;

    return {
      name: name || "Valued User",
      moonSign: getSignFromLong(moon.longitude),
      moonDegree: parseFloat((moon.longitude % 30).toFixed(2)),
      phase: { 
        ...MOON_PHASES[phaseIndex], 
        number: phaseIndex, 
        actualDiff: parseFloat(diff.toFixed(2)) 
      }
    };
  }

  getNumerologyData({ name, dob }) {
    const safeName = name || "Valued User";
    const [year, month, day] = dob.split('-').map(Number);
    
    const radical = calculateReduction(day, false);
    const totalDob = day + month + year.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    const destiny = calculateReduction(totalDob, false);
    
    const getLetterValueChaldean = (char) => {
      const v = { a:1, i:1, j:1, q:1, y:1, b:2, k:2, r:2, c:3, g:3, l:3, s:3, d:4, m:4, t:4, e:5, h:5, n:5, x:5, u:6, v:6, w:6, o:7, z:7, f:8, p:8 };
      return v[char.toLowerCase()] || 0;
    };

    const nameValue = safeName.split('').reduce((sum, char) => sum + getLetterValueChaldean(char), 0);
    const nameNumber = calculateReduction(nameValue, false);

    const details = NUMEROLOGY_DATA[radical] || NUMEROLOGY_DATA[1];

    return {
      name: safeName, 
      dob, 
      radical, 
      destiny, 
      nameNumber,
      favourable: { 
        ...details, 
        number: `${radical}, ${radical === 9 ? 1 : radical + 1}` 
      }
    };
  }

  async getZodiacData(dob) {
    const [year, month, day] = dob.split('-').map(Number);
    const dt = DateTime.fromObject({ year, month, day, hour: 12 }, { zone: 'utc' });
    const jhora = await getJHora();
    const sun = jhora.getPlanets(dt).find(p => p.name === 'Sun');
    const sign = getSignFromLong(sun.longitude);
    const signData = ZODIAC_DATA[sign] || {};

    return { 
      sign,
      longitude: parseFloat(sun.longitude.toFixed(2)),
      degree: parseFloat((sun.longitude % 30).toFixed(2)),
      ...signData
    };
  }

  async getKundaliData({ dob, tob, lat, lon, name, place, timezone = 'Asia/Kolkata' }) {
    const [year, month, day] = dob.split('-').map(Number);
    const [hour, minute] = tob.split(':').map(Number);
    const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone }).toUTC();
    const jhora = await getJHora({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    
    const planets  = jhora.getPlanets(dt);
    const houseInfo = jhora.getHouses(dt);
    const panchanga = jhora.getPanchanga ? jhora.getPanchanga(dt) : null;

    const SIGN_LORDS = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };

    const ascendant = getSignFromLong(houseInfo.ascendant);
    
    return {
      name, dob, tob,
      place:  place || 'Not specified',
      lat:    parseFloat(lat).toFixed(4),
      lon:    parseFloat(lon).toFixed(4),
      ascendant,
      ascendantLord: SIGN_LORDS[ascendant] || 'Unknown',
      moonSign:     getSignFromLong(planets.find(p => p.name === 'Moon')?.longitude || 0),
      // Panchanga attributes — exact NodeJHora field names
      nakshatra: panchanga?.nakshatra?.name || 'Unknown',
      nakshatraPada: panchanga?.nakshatra?.pada || null,
      tithi:     panchanga?.tithi?.name    || 'Unknown',
      yoga:      panchanga?.yoga?.name     || 'Unknown',
      karan:     panchanga?.karana?.name   || 'Unknown',
      vara:      panchanga?.vara?.name     || 'Unknown',
      planetaryPositions: planets.map(p => ({
        name:        p.name,
        sign:        getSignFromLong(p.longitude),
        signLord:    SIGN_LORDS[getSignFromLong(p.longitude)],
        degree:      parseFloat((p.longitude % 30).toFixed(2)),
        house:       ((Math.floor(p.longitude / 30) - Math.floor(houseInfo.ascendant / 30) + 12) % 12) + 1,
        isRetrograde: p.speed < 0
      }))
    };
  }

  /**
   * Assembles verified astrology facts for a free-consultation lead. Sun sign label and
   * numerology are computed locally (free, instant). The actual descriptive "nature" content
   * — sun_rashi_report and moon_rashi_report — comes from astrologyapi.com's own content, not
   * invented by the LLM. Moon sign/nakshatra (local ephemeris) and current Mahadasha
   * (astrologyapi.com) are added only if birth time + place are known.
   * Never throws — each optional fact degrades to '' on failure so the LLM narrator
   * always has at least a sun sign + numerology to work with.
   */
  async getVerifiedFacts({ name, dob, tob, tobUnknown, pob, pobLat, pobLon, gender }) {
    const sunSign = getSunSignFromDob(dob);
    const numerology = this.getNumerologyData({ name, dob });
    const [year, month, day] = dob.split('-').map(Number);
    const hasTob = !tobUnknown && Boolean(tob);
    const hasCoords = Number.isFinite(pobLat) && Number.isFinite(pobLon);

    const facts = {
      sunSign,
      rashiHi: getRashiHi(sunSign),
      luckyNumber: String(numerology.radical),
      luckyColour: numerology.favourable?.color || '',
      luckyColourHi: getColourHi(numerology.favourable?.color),
      moonSign: '',
      nakshatra: '',
      mahadashaPlanet: '',
      mahadashaPlanetHi: '',
      sunRashiReport: '',
      moonRashiReport: '',
    };

    // Sun's rashi barely moves within a single day, so fetch its real astrologyapi.com
    // content even when birth time/place are unknown — a neutral India location is fine.
    const [tobHour, tobMinute] = hasTob ? tob.split(':').map(Number) : [12, 0];
    facts.sunRashiReport = await getRashiReport('sun', {
      day, month, year,
      hour: tobHour,
      min: tobMinute,
      lat: hasCoords ? pobLat : 28.6139,
      lon: hasCoords ? pobLon : 77.2090,
    }) || '';

    if (!hasTob || !pob) return facts;

    // Prefer coordinates the counsellor already picked from the place-autocomplete
    // dropdown (precise, free) over re-geocoding the place name via astrologyapi.com
    // (imprecise for ambiguous town names, and costs a credit).
    const geo = hasCoords ? { lat: pobLat, lon: pobLon } : await geocodePlace(pob);
    if (!geo) return facts;

    try {
      const kundali = await this.getKundaliData({ dob, tob, lat: geo.lat, lon: geo.lon, name, place: pob });
      facts.moonSign = kundali.moonSign || '';
      facts.nakshatra = kundali.nakshatra || '';
    } catch (error) {
      logger.warn(`Local kundali calc failed for free-consultation lead: ${error.message}`);
    }

    const [dasha, moonReport] = await Promise.all([
      getCurrentMahadasha({ day, month, year, hour: tobHour, min: tobMinute, lat: geo.lat, lon: geo.lon }),
      getRashiReport('moon', { day, month, year, hour: tobHour, min: tobMinute, lat: geo.lat, lon: geo.lon }),
    ]);

    if (dasha) {
      facts.mahadashaPlanet = dasha.planet;
      facts.mahadashaPlanetHi = PLANET_HI[dasha.planet] || dasha.planet;
    }
    facts.moonRashiReport = moonReport || '';

    return facts;
  }

  async calculateLoveCompatibility(partnerA, partnerB) {
    // 1. Get Moon Signs for both
    const dataA = await this.getKundaliData(partnerA);
    const dataB = await this.getKundaliData(partnerB);

    const signA = dataA.moonSign;
    const signB = dataB.moonSign;

    // 2. Simplified Ashtakoota-inspired scoring
    // In a full production env, you'd calculate Nakshatras here.
    // For this tool, we'll use Sign-Lord Compatibility
    
    // Use ZODIAC_DATA for element lookup — no local static objects
    const elementA = ZODIAC_DATA[signA]?.element;
    const elementB = ZODIAC_DATA[signB]?.element;

    let score = 50;
    if (elementA === elementB) score += 30;
    else if ((elementA === 'Fire' && elementB === 'Air') || (elementA === 'Air' && elementB === 'Fire')) score += 20;
    else if ((elementA === 'Earth' && elementB === 'Water') || (elementA === 'Water' && elementB === 'Earth')) score += 20;
    else score -= 10;

    // Final normalization
    const finalScore = Math.min(Math.max(score, 10), 99);
    
    let message = "A challenging but rewarding journey ahead.";
    if (finalScore > 80) message = "A divine connection with deep emotional harmony.";
    else if (finalScore > 60) message = "Great potential for a stable and fulfilling relationship.";

    return {
      partnerA: { name: dataA.name, sign: signA },
      partnerB: { name: dataB.name, sign: signB },
      score: finalScore,
      analysis: message,
      traits: [
        { label: "Emotional Bond", value: finalScore > 70 ? "Strong" : "Developing" },
        { label: "Communication", value: elementA === elementB ? "Seamless" : "Requires Effort" },
        { label: "Stability", value: elementA === 'Earth' || elementB === 'Earth' ? "Grounded" : "Fluid" }
      ]
    };
  }
}

export default new AstrologyService();
