/** Western sun sign → Hindi rashi (सूर्य राशि) */
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

export function formatRashiLabel(sunSign, rashiHi) {
  const hi = rashiHi || getRashiHi(sunSign);
  if (!sunSign) return hi || '—';
  if (!hi) return sunSign;
  return `${sunSign} · ${hi}`;
}
