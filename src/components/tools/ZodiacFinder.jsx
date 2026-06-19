import { useState } from 'react';
import API_BASE from '../../utils/api.js';

const inputCls = 'w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors focus:border-[#c6843f]';
const labelCls = 'mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]';

function ZodiacFinder({ onBack }) {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findSign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/tools/zodiac`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Calculation failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  };

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
              <div className="mb-3 text-2xl">☀️</div>
              <h1 className="mb-3 font-serif text-2xl font-black leading-tight sm:text-3xl lg:text-[1.875rem]">
                Sun Sign Finder
              </h1>
              <p className="text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                Reveal your solar identity. Our Vedic engine calculates your sun sign based on solar ecliptic positions at the exact time of your birth.
              </p>
            </>
          ) : (
            <>
              <div className="mb-2 text-5xl">{result.symbol}</div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">Your Sun Sign</p>
              <h1 className="mb-2 font-serif text-3xl font-black leading-tight">{result.sign}</h1>
              <p className="mb-5 text-sm text-white/80">{result.dates}</p>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                ↺ Find Another Sign
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
                Birth Information
              </h2>
              <form onSubmit={findSign} className="flex flex-col gap-5">
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input
                    className={inputCls}
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-center text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Calculating…' : 'Reveal My Sign'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="mb-4 rounded-2xl border border-[#f3e5d8] bg-[#fffaf4] p-5 text-center sm:p-6">
              <span className="inline-block rounded-full bg-[#fff3e0] px-3 py-1 text-[0.6875rem] font-extrabold uppercase tracking-widest text-[#9c5a1e]">
                {result.element} · {result.quality}
              </span>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#65250c] sm:text-2xl">
                The {result.sign} Personality
              </h2>
              {result.description && (
                <p className="mt-2 text-sm italic leading-relaxed text-[#4a372d]">"{result.description}"</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Traits */}
              {result.traits?.length > 0 && (
                <div className="rounded-2xl border border-[#f3e5d8] bg-white p-4 shadow-[0_4px_16px_rgba(198,132,63,0.06)] sm:p-5">
                  <h3 className="mb-3 font-serif text-sm font-bold text-[#65250c]">◈ Key Traits</h3>
                  <div className="flex flex-col gap-1.5">
                    {result.traits.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-[#fffaf4] px-3 py-1.5">
                        <span className="text-xs text-[#c6843f]">◈</span>
                        <span className="text-xs font-medium text-[#65250c]">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attributes */}
              <div className="flex flex-col gap-3">
                {result.ruler && (
                  <div className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                    <div className="mb-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#9c5a1e]">Ruling Planet</div>
                    <div className="text-sm font-extrabold text-[#65250c]">{result.ruler}</div>
                  </div>
                )}
                {result.color && (
                  <div className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                    <div className="mb-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#9c5a1e]">Lucky Color</div>
                    <div className="text-sm font-extrabold text-[#65250c]">{result.color}</div>
                  </div>
                )}
                {result.lucky?.length > 0 && (
                  <div className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                    <div className="mb-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#9c5a1e]">Lucky Numbers</div>
                    <div className="text-sm font-extrabold text-[#65250c]">{result.lucky.join(', ')}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ZodiacFinder;
