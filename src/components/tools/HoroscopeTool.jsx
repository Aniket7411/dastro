import { useState } from 'react';
import API_BASE from '../../utils/api.js';

const svgFigures = {
  Aries: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="30" rx="10" ry="8" fill="#c6843f" opacity="0.25"/>
        <path d="M22 26 C14 20 12 10 20 10 C26 10 24 18 22 26" strokeWidth="2.2" fill="none"/>
        <path d="M42 26 C50 20 52 10 44 10 C38 10 40 18 42 26" strokeWidth="2.2" fill="none"/>
        <ellipse cx="32" cy="31" rx="9" ry="8" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="28.5" cy="29" r="1.5" fill="#65250c"/>
        <circle cx="35.5" cy="29" r="1.5" fill="#65250c"/>
        <ellipse cx="32" cy="33" rx="3" ry="1.8" fill="#c6843f" opacity="0.5"/>
        <circle cx="30.5" cy="33" r="0.8" fill="#65250c"/>
        <circle cx="33.5" cy="33" r="0.8" fill="#65250c"/>
        <ellipse cx="22.5" cy="30" rx="2.5" ry="3.5" fill="#e8c49a" strokeWidth="1.5" transform="rotate(-10 22.5 30)"/>
        <ellipse cx="41.5" cy="30" rx="2.5" ry="3.5" fill="#e8c49a" strokeWidth="1.5" transform="rotate(10 41.5 30)"/>
        <path d="M27 39 C27 44 24 48 22 50"/>
        <path d="M37 39 C37 44 40 48 42 50"/>
        <path d="M25 39 Q32 43 39 39" fill="none"/>
      </g>
    </svg>
  ),
  Taurus: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="33" rx="11" ry="10" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M21 26 C18 16 24 12 27 20" strokeWidth="2.2" fill="none"/>
        <path d="M43 26 C46 16 40 12 37 20" strokeWidth="2.2" fill="none"/>
        <ellipse cx="20" cy="30" rx="3" ry="4" fill="#e8c49a" strokeWidth="1.5"/>
        <ellipse cx="44" cy="30" rx="3" ry="4" fill="#e8c49a" strokeWidth="1.5"/>
        <circle cx="28" cy="30" r="2" fill="#65250c"/>
        <circle cx="36" cy="30" r="2" fill="#65250c"/>
        <circle cx="28.7" cy="29.3" r="0.7" fill="#fff"/>
        <circle cx="36.7" cy="29.3" r="0.7" fill="#fff"/>
        <ellipse cx="32" cy="37" rx="5" ry="3.5" fill="#c6843f" opacity="0.4" strokeWidth="1.5"/>
        <circle cx="30" cy="37" r="1" fill="#65250c"/>
        <circle cx="34" cy="37" r="1" fill="#65250c"/>
      </g>
    </svg>
  ),
  Gemini: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="24" cy="26" r="8" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="40" cy="26" r="8" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="21" cy="24" r="1.2" fill="#65250c"/>
        <circle cx="27" cy="24" r="1.2" fill="#65250c"/>
        <path d="M21 29 Q24 31.5 27 29" strokeWidth="1.5" fill="none"/>
        <circle cx="37" cy="24" r="1.2" fill="#65250c"/>
        <circle cx="43" cy="24" r="1.2" fill="#65250c"/>
        <path d="M37 29 Q40 31.5 43 29" strokeWidth="1.5" fill="none"/>
        <line x1="24" y1="34" x2="24" y2="50"/>
        <line x1="40" y1="34" x2="40" y2="50"/>
        <line x1="24" y1="38" x2="40" y2="38"/>
        <line x1="24" y1="44" x2="40" y2="44"/>
        <line x1="24" y1="50" x2="20" y2="54"/>
        <line x1="24" y1="50" x2="28" y2="54"/>
        <line x1="40" y1="50" x2="36" y2="54"/>
        <line x1="40" y1="50" x2="44" y2="54"/>
      </g>
    </svg>
  ),
  Cancer: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="34" rx="14" ry="10" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M20 34 Q32 28 44 34" stroke="#c6843f" strokeWidth="1.2" fill="none"/>
        <path d="M21 37 Q32 31 43 37" stroke="#c6843f" strokeWidth="1" fill="none"/>
        <line x1="26" y1="24" x2="24" y2="18" strokeWidth="1.8"/>
        <circle cx="24" cy="17" r="2.5" fill="#65250c"/>
        <line x1="38" y1="24" x2="40" y2="18" strokeWidth="1.8"/>
        <circle cx="40" cy="17" r="2.5" fill="#65250c"/>
        <path d="M18 30 C10 26 8 22 12 20 C15 18 18 22 18 26" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M18 30 C10 32 7 29 9 26" strokeWidth="1.5" fill="none"/>
        <path d="M46 30 C54 26 56 22 52 20 C49 18 46 22 46 26" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M46 30 C54 32 57 29 55 26" strokeWidth="1.5" fill="none"/>
        <line x1="24" y1="43" x2="20" y2="50"/>
        <line x1="28" y1="44" x2="26" y2="52"/>
        <line x1="36" y1="44" x2="38" y2="52"/>
        <line x1="40" y1="43" x2="44" y2="50"/>
      </g>
    </svg>
  ),
  Leo: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="30" r="16" fill="#c6843f" opacity="0.22" stroke="none"/>
        <path d="M32 14 C28 10 20 12 20 18" strokeWidth="1.8"/>
        <path d="M32 14 C36 10 44 12 44 18" strokeWidth="1.8"/>
        <path d="M16 24 C12 22 10 28 14 30" strokeWidth="1.8"/>
        <path d="M48 24 C52 22 54 28 50 30" strokeWidth="1.8"/>
        <path d="M18 38 C14 40 16 46 20 44" strokeWidth="1.8"/>
        <path d="M46 38 C50 40 48 46 44 44" strokeWidth="1.8"/>
        <circle cx="32" cy="30" r="11" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="27.5" cy="27" r="2" fill="#65250c"/>
        <circle cx="36.5" cy="27" r="2" fill="#65250c"/>
        <circle cx="28.2" cy="26.3" r="0.7" fill="#fff"/>
        <circle cx="37.2" cy="26.3" r="0.7" fill="#fff"/>
        <path d="M30 32 L32 30 L34 32" fill="#c6843f" strokeWidth="1.2"/>
        <path d="M28 35 Q32 38 36 35" strokeWidth="1.5" fill="none"/>
        <line x1="20" y1="32" x2="27" y2="33" strokeWidth="1"/>
        <line x1="20" y1="34" x2="27" y2="34" strokeWidth="1"/>
        <line x1="44" y1="32" x2="37" y2="33" strokeWidth="1"/>
        <line x1="44" y1="34" x2="37" y2="34" strokeWidth="1"/>
      </g>
    </svg>
  ),
  Virgo: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 22 C20 12 28 8 32 8 C36 8 44 12 44 22" fill="#c6843f" opacity="0.3" strokeWidth="1.8"/>
        <path d="M20 22 C18 30 18 40 20 48" strokeWidth="1.5"/>
        <ellipse cx="32" cy="26" rx="11" ry="13" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M26 22 Q28.5 20 31 22" strokeWidth="1.5" fill="none"/>
        <path d="M33 22 Q35.5 20 38 22" strokeWidth="1.5" fill="none"/>
        <circle cx="28.5" cy="23" r="1.5" fill="#65250c"/>
        <circle cx="35.5" cy="23" r="1.5" fill="#65250c"/>
        <path d="M31 26 L32 29 L33 26" strokeWidth="1.2" fill="none"/>
        <path d="M28 32 Q32 35 36 32" strokeWidth="1.5" fill="none"/>
        <path d="M29 32 Q32 30 35 32" strokeWidth="1.2" fill="none"/>
        <line x1="32" y1="39" x2="32" y2="46"/>
        <path d="M16 56 C18 46 26 44 32 46 C38 44 46 46 48 56" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="44" cy="18" r="3" fill="#c6843f" opacity="0.5" strokeWidth="1.2"/>
        <circle cx="44" cy="18" r="1.2" fill="#9c5a1e"/>
      </g>
    </svg>
  ),
  Libra: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="28" x2="52" y2="28" strokeWidth="2.2"/>
        <line x1="32" y1="16" x2="32" y2="52" strokeWidth="2.2"/>
        <circle cx="32" cy="16" r="3" fill="#c6843f" strokeWidth="1.8"/>
        <line x1="16" y1="28" x2="14" y2="36" strokeWidth="1.5"/>
        <line x1="16" y1="28" x2="22" y2="36" strokeWidth="1.5"/>
        <path d="M12 36 Q18 42 24 36" fill="#e8c49a" strokeWidth="1.8"/>
        <line x1="48" y1="28" x2="46" y2="36" strokeWidth="1.5"/>
        <line x1="48" y1="28" x2="52" y2="36" strokeWidth="1.5"/>
        <path d="M44 38 Q50 44 56 38" fill="#e8c49a" strokeWidth="1.8"/>
        <line x1="26" y1="52" x2="38" y2="52" strokeWidth="2"/>
        <path d="M32 8 L33 11 L36 11 L34 13 L35 16 L32 14 L29 16 L30 13 L28 11 L31 11 Z" fill="#c6843f" opacity="0.6" stroke="none"/>
      </g>
    </svg>
  ),
  Scorpio: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="22" rx="10" ry="7" fill="#e8c49a" strokeWidth="1.8"/>
        <ellipse cx="32" cy="32" rx="8" ry="5" fill="#e8c49a" strokeWidth="1.6"/>
        <ellipse cx="32" cy="40" rx="6" ry="4" fill="#e8c49a" strokeWidth="1.5"/>
        <path d="M32 44 C36 46 40 50 38 54 C36 57 32 56 32 52 C32 50 36 50 36 52" strokeWidth="2" fill="none"/>
        <path d="M36 52 L40 56" strokeWidth="2.2"/>
        <path d="M22 20 C16 16 12 10 16 8 C19 6 22 10 22 16" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M22 20 C14 22 11 28 14 28" strokeWidth="1.5" fill="none"/>
        <path d="M42 20 C48 16 52 10 48 8 C45 6 42 10 42 16" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M42 20 C50 22 53 28 50 28" strokeWidth="1.5" fill="none"/>
        <line x1="23" y1="26" x2="16" y2="32" strokeWidth="1.5"/>
        <line x1="23" y1="30" x2="15" y2="36" strokeWidth="1.5"/>
        <line x1="41" y1="26" x2="48" y2="32" strokeWidth="1.5"/>
        <line x1="41" y1="30" x2="49" y2="36" strokeWidth="1.5"/>
        <circle cx="28" cy="20" r="1.5" fill="#65250c"/>
        <circle cx="36" cy="20" r="1.5" fill="#65250c"/>
      </g>
    </svg>
  ),
  Sagittarius: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="28" cy="42" rx="14" ry="9" fill="#e8c49a" strokeWidth="1.8"/>
        <line x1="18" y1="50" x2="16" y2="58" strokeWidth="1.8"/>
        <line x1="22" y1="51" x2="20" y2="59" strokeWidth="1.8"/>
        <line x1="34" y1="51" x2="36" y2="59" strokeWidth="1.8"/>
        <line x1="38" y1="50" x2="40" y2="58" strokeWidth="1.8"/>
        <path d="M28 34 C26 28 28 22 32 20 C36 18 40 20 40 26 C40 30 36 34 32 34" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="36" cy="16" r="7" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="33.5" cy="14" r="1.2" fill="#65250c"/>
        <circle cx="38.5" cy="14" r="1.2" fill="#65250c"/>
        <path d="M33 18 Q36 20 39 18" strokeWidth="1.2" fill="none"/>
        <path d="M14 10 C16 18 16 26 14 34" strokeWidth="1.8" fill="none"/>
        <line x1="14" y1="22" x2="42" y2="14" strokeWidth="1.5"/>
        <path d="M42 14 L38 12 M42 14 L38 16" strokeWidth="1.5"/>
      </g>
    </svg>
  ),
  Capricorn: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="22" rx="10" ry="9" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M24 14 C22 8 26 4 28 10" strokeWidth="2" fill="none"/>
        <path d="M40 14 C42 8 38 4 36 10" strokeWidth="2" fill="none"/>
        <circle cx="28" cy="20" r="1.8" fill="#65250c"/>
        <circle cx="36" cy="20" r="1.8" fill="#65250c"/>
        <path d="M28 30 C28 34 30 36 32 36 C34 36 36 34 36 30" fill="#e8c49a" strokeWidth="1.5"/>
        <path d="M30 36 C30 40 32 42 32 42" strokeWidth="1.5"/>
        <path d="M22 38 C18 40 14 46 16 52 C18 58 24 56 24 50 C24 46 20 46 20 50" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M42 38 C46 40 50 46 48 52 C46 58 40 56 40 50 C40 46 44 46 44 50" fill="#e8c49a" strokeWidth="1.8"/>
        <path d="M22 30 Q32 36 42 30 L42 38 Q32 44 22 38 Z" fill="#e8c49a" strokeWidth="1.6"/>
        <ellipse cx="22" cy="24" rx="2.5" ry="3.5" fill="#e8c49a" strokeWidth="1.5" transform="rotate(-15 22 24)"/>
        <ellipse cx="42" cy="24" rx="2.5" ry="3.5" fill="#e8c49a" strokeWidth="1.5" transform="rotate(15 42 24)"/>
      </g>
    </svg>
  ),
  Aquarius: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="16" r="7" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="29.5" cy="14" r="1.2" fill="#65250c"/>
        <circle cx="34.5" cy="14" r="1.2" fill="#65250c"/>
        <path d="M29 18 Q32 20 35 18" strokeWidth="1.2" fill="none"/>
        <line x1="32" y1="23" x2="32" y2="38" strokeWidth="1.8"/>
        <path d="M32 26 C28 26 22 28 20 32" strokeWidth="1.8"/>
        <path d="M32 26 C36 24 42 24 44 28" strokeWidth="1.8"/>
        <path d="M16 32 C14 34 14 40 16 42 L22 42 C24 40 24 34 22 32 Z" fill="#e8c49a" strokeWidth="1.8"/>
        <line x1="16" y1="36" x2="22" y2="36" strokeWidth="1.2"/>
        <path d="M14 44 Q18 48 22 44 Q26 40 30 44 Q34 48 38 44 Q42 40 46 44 Q50 48 54 44" strokeWidth="2" fill="none"/>
        <path d="M14 50 Q18 54 22 50 Q26 46 30 50 Q34 54 38 50 Q42 46 46 50 Q50 54 54 50" stroke="#c6843f" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <line x1="30" y1="38" x2="26" y2="50" strokeWidth="1.8"/>
        <line x1="34" y1="38" x2="38" y2="50" strokeWidth="1.8"/>
      </g>
    </svg>
  ),
  Pisces: (
    <svg viewBox="0 0 64 64" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#9c5a1e" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 22 C18 16 26 14 34 18 C40 22 44 20 50 16 C46 22 48 28 44 30 C38 32 30 30 24 26 C18 22 14 26 14 22 Z" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="40" cy="20" r="2" fill="#65250c"/>
        <circle cx="40.7" cy="19.3" r="0.7" fill="#fff"/>
        <path d="M50 16 C52 12 54 12 54 16 C54 20 52 20 50 16" fill="#e8c49a" strokeWidth="1.5"/>
        <line x1="20" y1="32" x2="44" y2="32" strokeWidth="2.2"/>
        <circle cx="32" cy="32" r="3" fill="#c6843f" strokeWidth="1.5"/>
        <path d="M50 42 C46 48 38 50 30 46 C24 42 20 44 14 48 C18 42 16 36 20 34 C26 32 34 34 40 38 C46 42 50 38 50 42 Z" fill="#e8c49a" strokeWidth="1.8"/>
        <circle cx="24" cy="44" r="2" fill="#65250c"/>
        <circle cx="24.7" cy="43.3" r="0.7" fill="#fff"/>
        <path d="M14 48 C12 52 10 52 10 48 C10 44 12 44 14 48" fill="#e8c49a" strokeWidth="1.5"/>
        <circle cx="44" cy="14" r="2" stroke="#c6843f" opacity="0.5"/>
        <circle cx="48" cy="10" r="1.5" stroke="#c6843f" opacity="0.4"/>
      </g>
    </svg>
  ),
};

const signs = [
  { name: 'Aries',       sym: '♈', dates: 'Mar 21 – Apr 19' },
  { name: 'Taurus',      sym: '♉', dates: 'Apr 20 – May 20' },
  { name: 'Gemini',      sym: '♊', dates: 'May 21 – Jun 20' },
  { name: 'Cancer',      sym: '♋', dates: 'Jun 21 – Jul 22' },
  { name: 'Leo',         sym: '♌', dates: 'Jul 23 – Aug 22' },
  { name: 'Virgo',       sym: '♍', dates: 'Aug 23 – Sep 22' },
  { name: 'Libra',       sym: '♎', dates: 'Sep 23 – Oct 22' },
  { name: 'Scorpio',     sym: '♏', dates: 'Oct 23 – Nov 21' },
  { name: 'Sagittarius', sym: '♐', dates: 'Nov 22 – Dec 21' },
  { name: 'Capricorn',   sym: '♑', dates: 'Dec 22 – Jan 19' },
  { name: 'Aquarius',    sym: '♒', dates: 'Jan 20 – Feb 18' },
  { name: 'Pisces',      sym: '♓', dates: 'Feb 19 – Mar 20' },
];

function HoroscopeTool({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHoroscope = async (sign) => {
    setLoading(true);
    setSelected(sign);
    setPrediction(null);
    try {
      const res = await fetch(`${API_BASE}/api/tools/horoscope/${sign.name}`);
      const data = await res.json();
      if (data?.prediction) setPrediction(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="horoscope-tool-container animated fadeIn">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">

          {/* LEFT HERO PANEL */}
          {!selected ? (
            <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white">
              <div className="hero-content mx-auto" style={{ maxWidth: '480px' }}>
                {onBack && (
                  <button className="btn-back-tool mb-4" onClick={onBack}>
                    <i className="fas fa-chevron-left me-2"></i> Back to Tools
                  </button>
                )}
                <h1 className="display-4 fw-bold mb-3 hero-title">Daily Horoscope</h1>
                <p className="hero-desc mb-5">
                  Reveal what the stars have in store for you. Choose your sign below to receive your personalized 
                  cosmic guidance and planetary insights for today.
                </p>
                <div className="decor-icons">☀️ 🌙 ✨ 🌟</div>
              </div>
            </div>
          ) : (
            <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white text-center">
              <div className="mx-auto" style={{ maxWidth: '480px' }}>
                <div className="selected-sign-icon mb-4">
                  <div className="selected-svg-wrap">{svgFigures[selected.name]}</div>
                </div>
                <h1 className="display-4 fw-bold mb-2 hero-title">{selected.name}</h1>
                <p className="hero-desc mb-5">Guided by the celestial alignment of {prediction?.date || 'Today'}.</p>
                <button className="btn-change-sign" onClick={() => { setSelected(null); setPrediction(null); }}>
                  <i className="fas fa-sync-alt me-2"></i> Choose Another Sign
                </button>
              </div>
            </div>
          )}

          {/* RIGHT CONTENT PANEL */}
          <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white-content">
            {!selected ? (
              <div className="zodiac-selection-grid w-100" style={{ maxWidth: '720px' }}>
                <div className="row g-3 g-md-4">
                  {signs.map((sign) => (
                    <div key={sign.name} className="col-4 col-md-3">
                      <div className="zodiac-card-premium" onClick={() => fetchHoroscope(sign)}>
                        <div className="zodiac-card-icon">
                          {svgFigures[sign.name]}
                        </div>
                        <div className="zodiac-card-name">{sign.name}</div>
                        <div className="zodiac-card-dates">{sign.dates}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="horoscope-report w-100" style={{ maxWidth: '680px' }}>
                {loading || !prediction ? (
                  <div className="text-center p-5">
                    <div className="spinner-border text-bronze mb-4" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <h4 className="text-muted font-heading">Consulting the Cosmic Alignment...</h4>
                  </div>
                ) : (
                  <div className="prediction-box animated fadeInUp">
                    <div className="prediction-header mb-5 border-bottom pb-4">
                      <span className="badge-cosmic">Cosmic Guidance</span>
                      <h2 className="prediction-h1 mt-3">Daily Predictions</h2>
                      <div className="prediction-date-label">{prediction.date || 'Today'}</div>
                    </div>

                    <div className="prediction-body">
                      <div className="prediction-section mb-5">
                        <h3 className="section-title mb-3"><i className="fas fa-star me-2"></i> General Outlook</h3>
                        <p className="prediction-text">{prediction.prediction}</p>
                      </div>

                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="prediction-section card-insight p-4">
                            <h3 className="section-title-sm mb-2">Personal Growth</h3>
                            <p className="prediction-text-sm">Expect clarity in your decisions today. The stars favor internal reflection and setting new intentions.</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="prediction-section card-insight p-4">
                            <h3 className="section-title-sm mb-2">Social Energy</h3>
                            <p className="prediction-text-sm">A conversation with a peer might lead to an unexpected breakthrough. Stay open and communicative.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="prediction-footer mt-5 pt-4 border-top">
                      <div className="row g-3 text-center">
                        <div className="col-6">
                          <div className="lucky-stat">
                            <span className="stat-label">Lucky Number</span>
                            <span className="stat-value">9</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="lucky-stat">
                            <span className="stat-label">Lucky Color</span>
                            <span className="stat-value">Golden Brown</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        .horoscope-tool-container {
          font-family: 'Be Vietnam Pro', sans-serif;
          overflow-x: hidden;
        }

        .bg-bronze-hero {
          background: linear-gradient(to right, #c6843f, #9c5a1e);
          position: relative;
        }

        .bg-white-content {
          background-color: #ffffff;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 4.8rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .hero-desc {
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          line-height: 1.7;
          opacity: 0.95;
          font-weight: 500;
        }

        .btn-back-tool {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 8px 24px;
          border-radius: 4px;
          font-size: 16px;
          transition: 0.3s;
          font-weight: 500;
        }
        .btn-back-tool:hover { background: rgba(255,255,255,0.25); }

        .btn-change-sign {
          background: #ffffff;
          border: none;
          color: #9c5a1e;
          padding: 12px 30px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 700;
          transition: 0.3s;
        }
        .btn-change-sign:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        /* Selected sign SVG on left panel — white tinted */
        .selected-sign-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .selected-svg-wrap svg {
          width: 100px;
          height: 100px;
          filter: brightness(0) invert(1);
          opacity: 0.92;
        }

        /* Zodiac Cards */
        .zodiac-card-premium {
          background: #ffffff;
          padding: 22px 10px 16px;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid #f3e5d8;
        }
        .zodiac-card-premium:hover {
          transform: translateY(-10px);
          border-color: #c6843f;
          box-shadow: 0 20px 40px rgba(198,132,63,0.1);
        }
        .zodiac-card-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ffefd6;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zodiac-card-icon svg {
          width: 46px;
          height: 46px;
        }
        .zodiac-card-name {
          font-weight: 800;
          color: #65250c;
          font-size: 18px;
          margin-bottom: 2px;
        }
        .zodiac-card-dates {
          font-size: 13px;
          color: #9c847b;
          font-weight: 500;
        }

        /* Prediction Styles */
        .prediction-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #65250c;
          margin: 0;
        }
        .badge-cosmic {
          background: #ffefd6;
          color: #9c5a1e;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .prediction-date-label {
          color: #9c5a1e;
          font-weight: 600;
          font-size: 16px;
          margin-top: 8px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #65250c;
          font-weight: 700;
        }
        .section-title-sm {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #65250c;
          font-weight: 700;
        }
        .prediction-text {
          font-size: 18px;
          line-height: 24px;
          color: rgba(101, 37, 12, 0.85);
          text-align: justify;
        }
        .prediction-text-sm {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(101, 37, 12, 0.7);
        }
        .card-insight {
          background: #faf7f4;
          border-radius: 12px;
          border: 1px solid #f1e4d8;
        }
        .lucky-stat {
          padding: 15px;
          background: #ffefd6;
          border-radius: 8px;
        }
        .stat-label { display: block; font-size: 13px; color: #9c5a1e; text-transform: uppercase; margin-bottom: 5px; font-weight: 700; }
        .stat-value { font-weight: 800; color: #65250c; font-size: 20px; }

        .text-bronze { color: #c6843f; }
        .font-heading { font-family: 'Playfair Display', serif; }

        @media (max-width: 991px) {
          .hero-title { font-size: 28px; }
          .prediction-h1 { font-size: 26px; }
          .zodiac-card-icon { width: 60px; height: 60px; }
          .zodiac-card-icon svg { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
}

export default HoroscopeTool;