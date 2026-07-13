import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PlaceAutocomplete from './PlaceAutocomplete';
import API_BASE from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import TranslateButton from './TranslateButton';

const emptyPartner = () => ({ name: '', dob: '', tob: '12:00', place: '', lat: '', lon: '' });

const inputCls = 'w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]';
const labelCls = 'mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]';

function PartnerCard({ label, icon, iconColor, data, onChange }) {
  return (
    <div className="rounded-2xl border border-[#f3e5d8] bg-white p-4 shadow-[0_4px_16px_rgba(198,132,63,0.07)] sm:p-5">
      <h4 className="mb-4 flex items-center gap-2 font-serif text-base font-extrabold text-[#65250c]">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm text-white"
          style={{ background: iconColor }}
        >
          <i className={`fas ${icon}`}></i>
        </span>
        {label}
      </h4>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

function LoveCalculator({ onBack, image = '/images/love_compatibility.jpg' }) {
  const navigate = useNavigate();
  const [partnerA, setPartnerA] = useState(emptyPartner());
  const [partnerB, setPartnerB] = useState(emptyPartner());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState(null);
  const reportRef = useRef(null);
  const pdfReportRef = useRef(null);

  const isValid = () =>
    partnerA.lat && partnerA.lon && partnerB.lat && partnerB.lon &&
    partnerA.dob && partnerB.dob && partnerA.name && partnerB.name;

  const calculate = async (e) => {
    e.preventDefault();
    if (!isValid()) { setError('Please select both birth places from the dropdown.'); return; }
    setLoading(true);
    setError('');
    setLang('en');
    setTranslations(null);
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

  const downloadReport = async () => {
    if (!pdfReportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(pdfReportRef.current, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${result.partnerA?.name || 'Partner1'}-${result.partnerB?.name || 'Partner2'}-compatibility.pdf`);
    } catch (err) {
      console.error(err);
      setError('Could not download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

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
            <div>
              {!result ? (
                <>
                  <h1 className="mb-3 font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.2rem] text-white">
                    Love Compatibility
                  </h1>
                  <p className="mb-4 text-sm leading-relaxed text-white/85 sm:text-[1rem] text-white">
                    Explore the celestial bond between two souls. Vedic Synastry analyses Moon signs and planetary alignments to reveal your destiny score.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-white/70">Destiny Match Score</p>
                  <h1 className="mb-1 font-serif text-5xl font-black leading-none" style={{ color: '#fff' }}>
                    {score}%
                  </h1>
                  <p className="mb-5 text-sm text-white/80">{result.partnerA?.sign} Moon ♥ {result.partnerB?.sign} Moon</p>
                  <button
                    onClick={() => { setResult(null); setLang('en'); setTranslations(null); }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
                  >
                    ↺ Try Another
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-32 lg:items-center lg:overflow-y-auto lg:px-10 lg:pt-14 lg:pb-28">
        {!result ? (
          <div className="w-full max-w-2xl">
            <form onSubmit={calculate}>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PartnerCard label="Partner One" icon="fa-mars" iconColor="#3b82f6" data={partnerA} onChange={setPartnerA} />
                <PartnerCard label="Partner Two" icon="fa-venus" iconColor="#ec4899" data={partnerB} onChange={setPartnerB} />
              </div>
              {error && <p className="mb-3 text-center text-xs text-red-600">{error}</p>}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(198,132,63,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(198,132,63,0.3)] disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? 'Consulting Stars...' : 'Check Compatibility Score'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <div ref={reportRef} className="bg-white">
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
                <p className="text-sm italic leading-relaxed text-[#4a372d]">
                  "{lang === 'hi' && translations ? translations[0] : result.analysis}"
                </p>
              </div>
            )}

            {/* Traits */}
            {result.traits?.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {result.traits.map((t, i) => (
                  <div key={i} className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] p-3 text-center">
                    <div className="mb-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-[#9c5a1e]">{t.label}</div>
                    <div className="text-xs font-bold text-[#65250c]">
                      {lang === 'hi' && translations ? translations[i + 1] : t.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>

            <TranslateButton
              texts={[
                result.analysis || '',
                ...(result.traits ? result.traits.map((t) => t.value) : [])
              ]}
              lang={lang}
              setLang={setLang}
              translations={translations}
              onTranslate={(t) => setTranslations(t)}
            />

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={downloadReport}
                disabled={downloading}
                className="rounded-xl bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] px-6 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? 'Preparing…' : '⬇ Download Report'}
              </button>
              <button
                onClick={() => { setResult(null); setLang('en'); setTranslations(null); }}
                className="rounded-xl border border-[#f3e5d8] bg-[#fff8ef] px-6 py-2 text-xs font-bold uppercase tracking-wide text-[#9c5a1e] transition hover:bg-[#f3e5d8]"
              >
                ↺ Try Someone Else
              </button>
            </div>
            {/* Hidden printable report layout */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '794px',
                zIndex: -9999,
                pointerEvents: 'none',
                overflow: 'hidden'
              }}
            >
              <div 
                ref={pdfReportRef} 
                style={{
                  width: '794px',
                  minHeight: '1123px',
                  padding: '60px 80px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  fontFamily: 'sans-serif',
                  color: '#4a372d'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #c6843f', paddingBottom: '16px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ height: '48px', width: '48px', borderRadius: '9999px', backgroundColor: '#65250c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontFamily: 'serif', fontSize: '20px', fontWeight: '900' }}>DS</div>
                    <div>
                      <h1 style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#65250c', textTransform: 'uppercase', margin: 0 }}>DS Astrology Institute</h1>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9c5a1e', fontWeight: '600', margin: 0 }}>Vedic Synastry &amp; Cosmic Alignment</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#65250c', margin: 0 }}>LOVE COMPATIBILITY REPORT</p>
                    <p style={{ fontSize: '10px', color: '#666666', margin: 0 }}>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Title Section */}
                <div style={{ textAlign: 'center', margin: '32px 0' }}>
                  <span style={{ display: 'inline-block', borderRadius: '9999px', backgroundColor: '#fff3e0', padding: '4px 16px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9c5a1e', marginBottom: '8px' }}>
                    Celestial Match
                  </span>
                  <h2 style={{ fontFamily: 'serif', fontSize: '30px', fontWeight: '900', color: '#65250c', margin: '8px 0', lineHeight: '1.3' }}>
                    {result.partnerA?.name} &amp; {result.partnerB?.name}
                  </h2>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#9c5a1e', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                    {result.partnerA?.sign} Moon &amp; {result.partnerB?.sign} Moon
                  </p>
                </div>

                {/* Score Box */}
                <div style={{ margin: '32px 0', borderRadius: '16px', border: '2px solid #f3e5d8', backgroundColor: '#fffaf4', padding: '32px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9c5a1e', marginBottom: '12px', marginTop: 0, lineHeight: '1.3' }}>Destiny Compatibility Score</p>
                  <div style={{ fontFamily: 'serif', fontSize: '72px', fontWeight: '900', lineHeight: '1.3', margin: '24px 0 16px 0', color: scoreColor }}>
                    {score}%
                  </div>
                  <div style={{ marginLeft: 'auto', marginRight: 'auto', height: '10px', width: '100%', maxWidth: '320px', overflow: 'hidden', borderRadius: '9999px', backgroundColor: '#f3e5d8', margin: '24px auto 16px auto' }}>
                    <div
                      style={{ height: '100%', borderRadius: '9999px', width: `${score}%`, backgroundColor: scoreColor }}
                    />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#65250c', marginTop: '16px', marginBottom: 0, lineHeight: '1.4' }}>
                    {score >= 80 ? 'A deeply blessed, highly harmonious cosmic connection!' : score >= 60 ? 'A balanced relationship with strong potential for mutual growth.' : 'Requires understanding, patience, and conscious communication.'}
                  </p>
                </div>

                {/* Interpretation */}
                {result.analysis && (
                  <div style={{ margin: '32px 0', borderRadius: '16px', border: '1px solid #f3e5d8', backgroundColor: '#ffffff', padding: '24px' }}>
                    <h3 style={{ marginBottom: '12px', fontFamily: 'serif', fontSize: '16px', fontWeight: 'bold', color: '#65250c', borderBottom: '1px solid #f3e5d8', paddingBottom: '8px', marginTop: 0 }}>✦ Cosmic Synastry Analysis</h3>
                    <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, color: '#4a372d', margin: 0 }}>
                      "{lang === 'hi' && translations ? translations[0] : result.analysis}"
                    </p>
                  </div>
                )}

                {/* Pillars / Traits */}
                {result.traits?.length > 0 && (
                  <div style={{ margin: '32px 0' }}>
                    <h3 style={{ marginBottom: '12px', fontFamily: 'serif', fontSize: '16px', fontWeight: 'bold', color: '#65250c', borderBottom: '1px solid #f3e5d8', paddingBottom: '8px', marginTop: 0 }}>✦ Key Compatibility Metrics</h3>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
                      {result.traits.map((t, i) => (
                        <div key={i} style={{ flex: 1, borderRadius: '12px', border: '1px solid #f3e5d8', backgroundColor: '#fff8ef', padding: '16px', textAlign: 'center' }}>
                          <div style={{ marginBottom: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9c5a1e' }}>{t.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: '#65250c' }}>
                            {lang === 'hi' && translations ? translations[i + 1] : t.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ borderTop: '1px solid #f3e5d8', paddingTop: '24px', marginTop: '48px', textAlign: 'center', fontSize: '10px', color: '#666666' }}>
                  <p style={{ margin: '0 0 4px 0' }}>This is an automated Vedic compatibility analysis based on planetary synastry calculations.</p>
                  <p style={{ fontWeight: '600', color: '#9c5a1e', margin: 0 }}>DS Astrology Institute © {new Date().getFullYear()} • www.dsastrology.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveCalculator;
