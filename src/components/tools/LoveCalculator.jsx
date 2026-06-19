import { useState } from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';
import API_BASE from '../../utils/api.js';

const emptyPartner = () => ({ name: '', dob: '', tob: '12:00', place: '', lat: '', lon: '' });

const inputCls = 'w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]';
const labelCls = 'mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]';

function PartnerCard({ label, data, onChange }) {
  return (
    <div className="rounded-2xl border border-[#f3e5d8] bg-white p-4 shadow-[0_4px_16px_rgba(198,132,63,0.07)] sm:p-5">
      <h4 className="mb-4 font-serif text-base font-extrabold text-[#65250c]">{label}</h4>
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            className={inputCls}
            type="text"
            placeholder="Enter full name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input
              className={inputCls}
              type="date"
              value={data.dob}
              onChange={(e) => onChange({ ...data, dob: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Birth Time</label>
            <input
              className={inputCls}
              type="time"
              value={data.tob}
              onChange={(e) => onChange({ ...data, tob: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Birth Place</label>
          <PlaceAutocomplete
            value={data.place}
            placeholder="Search city or town…"
            onChange={(text) => onChange({ ...data, place: text, lat: '', lon: '' })}
            onSelect={({ lat, lon, label: loc }) => onChange({ ...data, place: loc, lat, lon })}
          />
          {data.lat && (
            <p className="mt-1 text-[0.6875rem] font-semibold text-green-600">✓ Location verified</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LoveCalculator({ onBack }) {
  const [partnerA, setPartnerA] = useState(emptyPartner());
  const [partnerB, setPartnerB] = useState(emptyPartner());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = () =>
    partnerA.lat && partnerA.lon && partnerB.lat && partnerB.lon &&
    partnerA.dob && partnerB.dob && partnerA.name && partnerB.name;

  const calculate = async (e) => {
    e.preventDefault();
    if (!isValid()) { setError('Please select both birth places from the dropdown.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/tools/love-compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerA: { name: partnerA.name, dob: partnerA.dob, tob: partnerA.tob, lat: partnerA.lat, lon: partnerA.lon },
          partnerB: { name: partnerB.name, dob: partnerB.dob, tob: partnerB.tob, lat: partnerB.lat, lon: partnerB.lon },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Calculation failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed.');
    } finally {
      setLoading(false);
    }
  };

  const score = result?.score || 0;
  const scoreColor = score > 80 ? '#c6843f' : score > 60 ? '#9c5a1e' : '#65250c';

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
              <div className="mb-3 text-2xl">💞</div>
              <h1 className="mb-3 font-serif text-2xl font-black leading-tight sm:text-3xl lg:text-[1.875rem]">
                Love Compatibility
              </h1>
              <p className="text-sm leading-relaxed text-white/85 sm:text-[0.9375rem]">
                Explore the celestial bond between two souls. Vedic Synastry analyses Moon signs and planetary alignments to reveal your destiny score.
              </p>
            </>
          ) : (
            <>
              <div className="mb-3 text-4xl">💞</div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-white/70">Destiny Match Score</p>
              <h1 className="mb-1 font-serif text-5xl font-black leading-none" style={{ color: '#fff' }}>
                {score}%
              </h1>
              <p className="mb-5 text-sm text-white/80">{result.partnerA?.sign} Moon ♥ {result.partnerB?.sign} Moon</p>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                ↺ Try Another
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 py-8 sm:px-6 sm:py-10 lg:items-center lg:overflow-y-auto lg:px-10 lg:py-14">
        {!result ? (
          <div className="w-full max-w-2xl">
            <form onSubmit={calculate}>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PartnerCard label="👤 Partner One" data={partnerA} onChange={setPartnerA} />
                <PartnerCard label="👤 Partner Two" data={partnerB} onChange={setPartnerB} />
              </div>
              {error && <p className="mb-3 text-center text-xs text-red-600">{error}</p>}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Consulting Stars…' : 'Check Compatibility Score'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            {/* Score progress */}
            <div className="mb-5 rounded-2xl border border-[#f3e5d8] bg-[#fffaf4] p-5 text-center sm:p-6">
              <span className="inline-block rounded-full bg-[#fff3e0] px-3 py-1 text-[0.6875rem] font-extrabold uppercase tracking-widest text-[#9c5a1e]">
                Destiny Match
              </span>
              <div className="my-3 font-serif text-5xl font-black leading-none" style={{ color: scoreColor }}>
                {score}%
              </div>
              <div className="mx-auto mb-3 h-2 w-full max-w-[240px] overflow-hidden rounded-full bg-[#f3e5d8]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${score}%`, background: scoreColor }}
                />
              </div>
              <h2 className="mb-1 font-serif text-xl font-bold text-[#65250c]">
                {result.partnerA?.name} &amp; {result.partnerB?.name}
              </h2>
              <p className="text-sm font-semibold text-[#9c5a1e]">
                {result.partnerA?.sign} Moon ♥ {result.partnerB?.sign} Moon
              </p>
            </div>

            {/* Cosmic interpretation */}
            {result.analysis && (
              <div className="mb-4 rounded-2xl border border-[#f3e5d8] bg-white p-4 shadow-[0_4px_16px_rgba(198,132,63,0.06)] sm:p-5">
                <h3 className="mb-2.5 font-serif text-sm font-bold text-[#65250c]">✦ Cosmic Interpretation</h3>
                <p className="text-sm italic leading-relaxed text-[#4a372d]">"{result.analysis}"</p>
              </div>
            )}

            {/* Traits */}
            {result.traits?.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {result.traits.map((t, i) => (
                  <div key={i} className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                    <div className="mb-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-[#9c5a1e]">{t.label}</div>
                    <div className="text-xs font-bold text-[#65250c]">{t.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 text-center">
              <button
                onClick={() => setResult(null)}
                className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] px-6 py-2 text-xs font-bold uppercase tracking-wide text-[#9c5a1e] transition hover:bg-[#f3e5d8]"
              >
                ↺ Try Someone Else
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveCalculator;
