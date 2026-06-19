import { useState } from 'react';
import API_BASE from '../../utils/api.js';

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

function NumerologyTool({ onBack }) {
  const [formData, setFormData] = useState({ name: '', dob: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      <div className="shrink-0 bg-gradient-to-br from-[#c6843f] to-[#65250c] px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:w-[38%] lg:flex-col lg:justify-center lg:px-10 lg:py-14 xl:px-14">
        <div className="mx-auto w-full max-w-xs lg:max-w-none">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              ← Back to Tools
            </button>
          )}
          {!result ? (
            <>
              <div className="mb-3 text-2xl">🔢</div>
              <h1 className="mb-3 font-serif text-2xl font-black leading-tight sm:text-3xl lg:text-[1.875rem]">
                Numerology Calculator
              </h1>
              <p className="text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                Unlock the vibrational power of your numbers. Discover your Radical, Destiny, and Name numbers based on Chaldean &amp; Vedic systems.
              </p>
            </>
          ) : (
            <>
              <div className="mb-3 text-4xl">🔢</div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">Your Radical Number</p>
              <h1 className="mb-2 font-serif text-5xl font-black leading-none">{result.radical}</h1>
              {fav.planet && <p className="mb-5 text-sm text-white/80">Ruled by {fav.planet}</p>}
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                ↺ Calculate New
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 lg:items-center lg:px-10 lg:py-14">
        {!result ? (
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-[#f3e5d8] bg-white p-6 shadow-[0_8px_28px_rgba(198,132,63,0.09)] sm:p-8">
              <h2 className="mb-6 text-center font-serif text-lg font-extrabold text-[#65250c]">
                Your Details
              </h2>
              <form onSubmit={calculate} className="flex flex-col gap-5">
                <Field label="Full Name">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="e.g. Aniket Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Field>
                <Field label="Date of Birth">
                  <input
                    className={inputCls}
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </Field>
                {error && <p className="text-center text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Calculating…' : 'Calculate My Numbers'}
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
                    ['Planet', ICONS.planet, fav.planet],
                    ['Stone', ICONS.stones, fav.stones],
                    ['Lucky Days', ICONS.days, fav.days],
                    ['Colors', ICONS.color, fav.color],
                    ['Dates', ICONS.dates, fav.dates],
                    ['Letters', ICONS.alphabets, fav.alphabets],
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
                    <div className="text-base font-extrabold tracking-wide text-[#65250c]">{fav.mantra}</div>
                    <div className="mt-1.5 text-[0.6875rem] text-[#9c5a1e]">
                      Chant 108 times every {fav.fast} morning
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NumerologyTool;
