import { useState } from 'react';
import API_BASE from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';

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

function HoroscopeTool({ onBack, image }) {
  const navigate = useNavigate();
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
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row animated fadeIn">
      {/* Left hero panel */}
      <div className="relative shrink-0 bg-gradient-to-br from-[#c6843f] to-[#65250c] px-6 pt-16 pb-8 text-white sm:px-8 sm:pt-20 sm:pb-10 lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:px-10 lg:py-14 xl:px-14">
        <button
          onClick={onBack || (() => navigate('/free-tools'))}
          className="absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 z-10"
        >
          ← Back to Tools
        </button>
        <div className="mx-auto w-full max-w-2xl">
          
          <div className="flex flex-col items-center gap-6 text-center">
            {!selected ? (
              <>
                {image && (
                <div className="shrink-0">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-[18%] shadow-2xl">
                    <img src={image} alt="Tool Image" className="w-full h-full object-cover scale-105" />
                  </div>
                </div>
                )}
                <div>
                  <h1 className="mb-3 font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.2rem] text-white">
                    Daily Horoscope
                  </h1>
                  <p className="mb-4 text-sm leading-relaxed text-white/85 sm:text-[1rem] text-white">
                    Reveal what the stars have in store for you. Choose your sign below to receive your personalized
                    cosmic guidance and planetary insights for today.
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full text-center">
                <div className="mb-4 flex justify-center">
                  <div className="text-white/90 [&>svg]:h-24 [&>svg]:w-24">
                    {svgFigures[selected.name]}
                  </div>
                </div>
                <h1 className="mb-2 font-serif text-4xl font-black leading-tight sm:text-5xl">{selected.name}</h1>
                <p className="mb-6 text-sm text-white/80">Guided by the celestial alignment of {prediction?.date || 'Today'}.</p>
                <button
                  onClick={() => { setSelected(null); setPrediction(null); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
                >
                  ↺ Choose Another Sign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-32 lg:items-center lg:px-10 lg:pt-14 lg:pb-28">
        <div className="w-full max-w-2xl">
          {!selected ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {signs.map((sign) => (
                <div
                  key={sign.name}
                  onClick={() => fetchHoroscope(sign)}
                  className="group cursor-pointer rounded-2xl border border-[#f3e5d8] bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#c6843f] hover:shadow-[0_12px_24px_rgba(198,132,63,0.1)]"
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffefd6] [&>svg]:h-10 [&>svg]:w-10">
                    {svgFigures[sign.name]}
                  </div>
                  <div className="mb-0.5 text-sm font-extrabold text-[#65250c] sm:text-base">{sign.name}</div>
                  <div className="text-[0.6875rem] font-medium text-[#9c847b]">{sign.dates}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl">
              {loading || !prediction ? (
                <div className="py-12 text-center text-[#65250c]">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#c6843f] border-r-transparent"></div>
                  <h4 className="font-serif font-bold">Consulting the Cosmic Alignment...</h4>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#f3e5d8] bg-white p-6 shadow-[0_8px_28px_rgba(198,132,63,0.09)] sm:p-8">
                  <div className="mb-5 border-b border-[#f3e5d8] pb-5 text-center">
                    <span className="mb-2 inline-block rounded-full bg-[#ffefd6] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-widest text-[#9c5a1e]">
                      Cosmic Guidance
                    </span>
                    <h2 className="mb-1 font-serif text-2xl font-black text-[#65250c] sm:text-3xl">Daily Predictions</h2>
                    <div className="text-sm font-semibold text-[#c6843f]">{prediction.date || 'Today'}</div>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-3 font-serif text-lg font-bold text-[#65250c]">General Outlook</h3>
                    <p className="text-sm leading-relaxed text-[#65250c]/85">{prediction.prediction}</p>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#f1e4d8] bg-[#faf7f4] p-4">
                      <h3 className="mb-2 font-serif text-base font-bold text-[#65250c]">Personal Growth</h3>
                      <p className="text-xs leading-relaxed text-[#65250c]/70">Expect clarity in your decisions today. The stars favor internal reflection and setting new intentions.</p>
                    </div>
                    <div className="rounded-xl border border-[#f1e4d8] bg-[#faf7f4] p-4">
                      <h3 className="mb-2 font-serif text-base font-bold text-[#65250c]">Social Energy</h3>
                      <p className="text-xs leading-relaxed text-[#65250c]/70">A conversation with a peer might lead to an unexpected breakthrough. Stay open and communicative.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#f3e5d8] pt-5 text-center">
                    <div className="rounded-xl bg-[#ffefd6] p-3">
                      <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Lucky Number</div>
                      <div className="text-lg font-black text-[#65250c]">9</div>
                    </div>
                    <div className="rounded-xl bg-[#ffefd6] p-3">
                      <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Lucky Color</div>
                      <div className="text-lg font-black text-[#65250c]">Golden Brown</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HoroscopeTool;