import { useState } from 'react';
import API_BASE from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import TranslateButton from './TranslateButton';

const ICONS = {
  planet: '🪐', stones: '💎', days: '📅', color: '🎨',
  fast: '🌙', dates: '🗓️', alphabets: '🔤',
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">{label}</label>
    {children}
  </div>
);

const inputCls = 'w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]';

function NumerologyTool({ onBack, image = '/images/numerology.jpg' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', dob: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState(null);

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLang('en');
    setTranslations(null);
    try {
      const res = await fetch(`${API_BASE}/api/tools/numerology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const fav = result?.favourable || {};

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">

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
            {image && (
              <div className="shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-[18%] shadow-2xl">
                  <img src={image} alt="Tool Image" className="w-full h-full object-cover scale-105" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center">
              {!result ? (
                <>
                  <h1 className="mb-3 font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.2rem] text-white">
                    Numerology Calculator
                  </h1>
                  <p className="mb-4 text-sm leading-relaxed text-white/85 sm:text-[1rem] text-white">
                    Unlock the vibrational power of your numbers. Discover your Radical, Destiny, and Name numbers based on Chaldean &amp; Vedic systems.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 text-4xl">🔢</div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">Your Radical Number</p>
                  <h1 className="mb-2 font-serif text-5xl font-black leading-none">{result.radical}</h1>
                  {fav.planet && (
                    <p className="mb-5 text-sm text-white/80">
                      Ruled by {lang === 'hi' && translations ? translations[0] : fav.planet}
                    </p>
                  )}
                  <button
                    onClick={() => { setResult(null); setLang('en'); setTranslations(null); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
                  >
                    ↺ Calculate New
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-32 lg:items-center lg:px-10 lg:pt-14 lg:pb-28">
        {!result ? (
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-[#f3e5d8] bg-white p-6 shadow-[0_8px_28px_rgba(198,132,63,0.09)] sm:p-8">
              <h2 className="mb-6 text-center font-serif text-lg font-extrabold text-[#65250c]">
                Your Details
              </h2>
              <form onSubmit={calculate} className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Full Name</label>
                  <input
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]"
                    type="text"
                    placeholder="e.g. Aniket Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Date of Birth</label>
                  <input
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors focus:border-[#c6843f]"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>
                {error && <p className="text-center text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(198,132,63,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(198,132,63,0.3)] disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? 'Calculating...' : 'Calculate My Numbers'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            {/* Core numbers */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {[
                { n: result.radical, label: 'Radical No.', sub: 'Birth Day' },
                { n: result.destiny, label: 'Destiny No.', sub: 'Life Path' },
                { n: result.nameNumber, label: 'Name No.', sub: 'Chaldean' },
              ].map(({ n, label, sub }) => (
                <div key={label} className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                  <div className="text-[1.75rem] font-black leading-none text-[#9c5a1e]">{n}</div>
                  <div className="mt-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-[#9c5a1e]">{label}</div>
                  <div className="text-[0.625rem] text-[#9c847b]">{sub}</div>
                </div>
              ))}
            </div>

            {/* Auspicious details */}
            {fav.planet && (
              <div className="rounded-2xl border border-[#f3e5d8] bg-white p-5 shadow-[0_4px_16px_rgba(198,132,63,0.07)] sm:p-6">
                <h3 className="mb-4 font-serif text-base font-bold text-[#65250c]">✦ Auspicious Details</h3>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {[
                    ['Planet', ICONS.planet, lang === 'hi' && translations ? translations[0] : fav.planet],
                    ['Stone', ICONS.stones, lang === 'hi' && translations ? translations[1] : fav.stones],
                    ['Lucky Days', ICONS.days, lang === 'hi' && translations ? translations[2] : fav.days],
                    ['Colors', ICONS.color, lang === 'hi' && translations ? translations[3] : fav.color],
                    ['Dates', ICONS.dates, fav.dates],
                    ['Letters', ICONS.alphabets, lang === 'hi' && translations ? translations[4] : fav.alphabets],
                  ].map(([label, icon, value]) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-[#f3e5d8] bg-[#fffaf4] p-2.5">
                      <span className="text-base">{icon}</span>
                      <div className="min-w-0">
                        <div className="text-[0.5625rem] font-bold uppercase tracking-wider text-[#9c5a1e]">{label}</div>
                        <div className="truncate text-xs font-bold text-[#65250c]">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {fav.mantra && (
                  <div className="mt-4 rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-4 text-center">
                    <div className="mb-1 text-lg">🕉️</div>
                    <div className="mb-1 text-[0.625rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Sacred Mantra</div>
                    <div className="text-base font-extrabold tracking-wide text-[#65250c]">
                      {lang === 'hi' && translations ? translations[5] : fav.mantra}
                    </div>
                    <div className="mt-1.5 text-[0.6875rem] text-[#9c5a1e]">
                      Chant 108 times every {lang === 'hi' && translations ? translations[6] : fav.fast} morning
                    </div>
                  </div>
                )}
              </div>
            )}

            <TranslateButton
              texts={[
                fav.planet || '',
                fav.stones || '',
                fav.days || '',
                fav.color || '',
                fav.alphabets || '',
                fav.mantra || '',
                fav.fast || ''
              ]}
              lang={lang}
              setLang={setLang}
              translations={translations}
              onTranslate={(t) => setTranslations(t)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NumerologyTool;
