import { ZODIAC_SIGNS } from './astrologyUtils.js';

const SIGN_RANGES = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

function parseDob(dobStr) {
  if (!dobStr) return null;
  if (dobStr.includes('/')) {
    const [day, month, year] = dobStr.split('/').map((p) => parseInt(p, 10));
    if (!day || !month || !year) return null;
    return { day, month };
  }
  const d = new Date(dobStr);
  if (Number.isNaN(d.getTime())) return null;
  return { day: d.getUTCDate(), month: d.getUTCMonth() + 1 };
}

function isInRange(month, day, start, end) {
  const [sm, sd] = start;
  const [em, ed] = end;
  const afterStart = month > sm || (month === sm && day >= sd);
  const beforeEnd = month < em || (month === em && day <= ed);
  if (sm <= em) return afterStart && beforeEnd;
  return afterStart || beforeEnd;
}

export function getSunSignFromDob(dobStr) {
  const parsed = parseDob(dobStr);
  if (!parsed) return ZODIAC_SIGNS[0];

  const match = SIGN_RANGES.find((r) => isInRange(parsed.month, parsed.day, r.start, r.end));
  return match?.sign || 'Aries';
}

/** Hindi rashi name from Western sun sign */
export const RASHI_HI = {
  Aries: 'मेष',
  Taurus: 'वृषभ',
  Gemini: 'मिथुन',
  Cancer: 'कर्क',
  Leo: 'सिंह',
  Virgo: 'कन्या',
  Libra: 'तुला',
  Scorpio: 'वृश्चिक',
  Sagittarius: 'धनु',
  Capricorn: 'मकर',
  Aquarius: 'कुंभ',
  Pisces: 'मीन',
};

export function getRashiHi(sunSign) {
  if (!sunSign) return '';
  return RASHI_HI[sunSign] || '';
}

/** Hindi name for the first colour word of a numerology colour string (e.g. "Orange, Gold" -> "नारंगी") */
const COLOUR_HI = {
  Red: 'लाल',
  Orange: 'नारंगी',
  Yellow: 'पीला',
  Golden: 'सुनहरा',
  Gold: 'सुनहरा',
  Green: 'हरा',
  Blue: 'नीला',
  'Light Blue': 'हल्का नीला',
  White: 'सफेद',
  Grey: 'स्लेटी',
  Pink: 'गुलाबी',
  Black: 'काला',
  'Dark Blue': 'गहरा नीला',
  Multicolor: 'बहुरंगी',
  'Light Shades': 'हल्के रंग',
};

export function getColourHi(colour) {
  if (!colour) return '';
  const first = colour.split(',')[0].trim();
  return COLOUR_HI[first] || '';
}

export function calcAgeFromDob(dobStr) {
  const detail = getAgeDetailFromDob(dobStr);
  return detail.valid ? detail.years : null;
}

export function getAgeDetailFromDob(dobStr) {
  if (!dobStr) {
    return { years: null, months: null, display: '', valid: false };
  }

  let d;
  if (dobStr.includes('/')) {
    const [day, month, year] = dobStr.split('/').map((p) => parseInt(p, 10));
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(`${dobStr}T12:00:00`);
  }
  if (Number.isNaN(d.getTime())) {
    return { years: null, months: null, display: '', valid: false };
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (d > today) {
    return { years: null, months: null, display: 'Future date', valid: false };
  }

  let years = today.getFullYear() - d.getFullYear();
  let monthDiff = today.getMonth() - d.getMonth();
  if (today.getDate() < d.getDate()) monthDiff -= 1;
  if (monthDiff < 0) {
    years -= 1;
    monthDiff += 12;
  }

  if (years >= 1) {
    return {
      years,
      months: null,
      display: `${years} year${years !== 1 ? 's' : ''}`,
      valid: true,
    };
  }

  let totalMonths = (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth());
  if (today.getDate() < d.getDate()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;

  const display = totalMonths === 0
    ? 'Less than 1 month'
    : `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;

  return {
    years: 0,
    months: totalMonths,
    display,
    valid: true,
  };
}

export function formatLeadAge(lead) {
  if (!lead) return '—';
  if (lead.ageDisplay) return lead.ageDisplay;
  if (lead.age > 0) return `${lead.age} year${lead.age !== 1 ? 's' : ''}`;
  if (lead.age === 0) {
    if (lead.ageMonths > 0) return `${lead.ageMonths} month${lead.ageMonths !== 1 ? 's' : ''}`;
    return 'Less than 1 month';
  }
  return lead.age != null ? String(lead.age) : '—';
}
