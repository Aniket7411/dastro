import { useState } from 'react';
import KundaliChart from './KundaliChart';
import { DateTime } from 'luxon';
import toast from '../../utils/toast';
import API_BASE from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';

function KundaliTool({ onBack, image }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', dob: '', tob: '', lat: '', lon: '', place: '', gender: 'Male'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleLocationSearch = async (val) => {
    setQuery(val);
    if (val.length < 3) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) { console.error("Geocoding Error:", err); }
    finally { setSearching(false); }
  };

  const selectLocation = (loc) => {
    const label = loc.display_name.split(',').slice(0, 3).join(', ');
    setFormData({ ...formData, lat: loc.lat, lon: loc.lon, place: label });
    setQuery(label); setSuggestions([]);
  };

  const calculate = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lon) { toast.error("Please select a valid birth place."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tools/kundali`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
      setActiveTab('chart');
      toast.success("Kundali generated!");
    } catch (err) { toast.error("Failed to generate report"); }
    finally { setLoading(false); }
  };

  const interpretations = {
    'Aries': { lord: 'Mars', text: 'Natural leaders, full of energy and courage. You approach life with enthusiasm and a pioneering spirit.' },
    'Taurus': { lord: 'Venus', text: 'Steady, reliable, and deeply connected to comfort and beauty. You value stability and loyalty above all.' },
    'Gemini': { lord: 'Mercury', text: 'Intellectual, communicative, and versatile. Your mind is always racing with new ideas and connections.' },
    'Cancer': { lord: 'Moon', text: 'Deeply intuitive and emotional. You are the nurturer of the zodiac, valuing home, family, and emotional security.' },
    'Leo': { lord: 'Sun', text: 'Confident, charismatic, and naturally creative. You enjoy being in the spotlight and inspiring others.' },
    'Virgo': { lord: 'Mercury', text: 'Practical, analytical, and detail-oriented. You find beauty in order and strive for perfection in all you do.' },
    'Libra': { lord: 'Venus', text: 'Diplomatic, artistic, and social. You are constantly seeking balance, harmony, and deeper connections.' },
    'Scorpio': { lord: 'Mars', text: 'Intense, mysterious, and profoundly emotional. You possess great willpower and a transformative spirit.' },
    'Sagittarius': { lord: 'Jupiter', text: 'Optimistic, adventurous, and philosophical. You are a seeker of truth and higher knowledge.' },
    'Capricorn': { lord: 'Saturn', text: 'Ambitious, disciplined, and traditional. You are the master builder, aiming for the summit of success.' },
    'Aquarius': { lord: 'Saturn', text: 'Progressive, independent, and humanitarian. You think outside the box and value intellectual freedom.' },
    'Pisces': { lord: 'Jupiter', text: 'Empathetic, artistic, and spiritual. You possess a vivid imagination and a deep connection to the unseen.' }
  };

  if (result) {
    return (
      <div className="kundali-results-page animated fadeIn">
        <div className="container py-4 py-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
            {onBack && (
              <button className="btn-back-tool-dark" onClick={onBack}>
                <i className="fas fa-arrow-left me-2"></i> Back to Tools
              </button>
            )}
            <h2 className="results-header-title mb-0">{result.name}'s Vedic Chart</h2>
            <button className="btn-calculate-premium py-2 px-4" style={{ fontSize: '14px' }} onClick={() => setResult(null)}>New Calculation</button>
          </div>

          <div className="results-nav-tabs mb-5">
            {['Basic', 'Chart', 'Planets', 'Report'].map(tab => (
              <button key={tab} className={`nav-tab-item ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.toLowerCase())}>{tab}</button>
            ))}
          </div>

          <div className="tab-content-area">
            {activeTab === 'basic' && (
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="premium-result-card p-4 h-100">
                    <h5 className="card-sub-title mb-4">Birth Particulars</h5>
                    <div className="info-grid">
                      <div className="grid-row"><span>Date</span><strong>{result.dob ? DateTime.fromISO(result.dob).toLocaleString(DateTime.DATE_MED) : 'N/A'}</strong></div>
                      <div className="grid-row"><span>Time</span><strong>{result.tob || 'N/A'}</strong></div>
                      <div className="grid-row"><span>Location</span><strong>{result.place || 'Unknown'}</strong></div>
                      <div className="grid-row"><span>Coordinates</span><strong>{result.lat}°N, {result.lon}°E</strong></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="premium-result-card p-4 h-100">
                    <h5 className="card-sub-title mb-4">Panchang Status</h5>
                    <div className="info-grid">
                      <div className="grid-row"><span>Nakshatra</span><strong>{result.nakshatra} ({result.nakshatraPada})</strong></div>
                      <div className="grid-row"><span>Tithi</span><strong>{result.tithi}</strong></div>
                      <div className="grid-row"><span>Yoga</span><strong>{result.yoga}</strong></div>
                      <div className="grid-row"><span>Vara</span><strong>{result.vara}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="chart-display-container text-center py-4">
                <div className="premium-result-card d-inline-block p-4 p-md-5" style={{ maxWidth: '600px' }}>
                  <h4 className="card-sub-title mb-2">Lagna Chart (D1)</h4>
                  <p className="small text-muted mb-4">Traditional Vedic Square Format</p>
                  <div className="mx-auto" style={{ maxWidth: '450px' }}>
                    <KundaliChart planets={result.planetaryPositions} ascendantSign={result.ascendant} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planets' && (
              <div className="premium-result-card p-4">
                <h5 className="card-sub-title mb-4">Planetary Positions</h5>
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead><tr><th>Planet</th><th>Sign</th><th>Lord</th><th>Degree</th><th>House</th><th>Retro</th></tr></thead>
                    <tbody>
                      {result.planetaryPositions.map(p => (
                        <tr key={p.name}>
                          <td className="fw-bold">{p.name}</td>
                          <td className="text-bronze-accent">{p.sign}</td>
                          <td>{p.signLord || interpretations[p.sign]?.lord || '-'}</td>
                          <td>{p.degree?.toFixed(2)}°</td>
                          <td>{p.house}</td>
                          <td>{p.isRetrograde ? <span className="text-danger">Yes</span> : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'report' && (
              <div className="premium-result-card p-4 p-md-5">
                <div className="report-hero text-center mb-5">
                   <span className="badge-cosmic-light mb-3">Core Identity</span>
                   <h2 className="display-6 fw-bold" style={{ color: '#65250c' }}>{result.ascendant} Ascendant</h2>
                </div>
                <div className="row g-4 mb-5">
                  {[
                    { label: 'Ascendant Lord', value: result.ascendantLord || 'N/A' },
                    { label: 'Moon Sign', value: result.moonSign },
                    { label: 'Nakshatra', value: result.nakshatra }
                  ].map(item => (
                    <div className="col-md-4" key={item.label}>
                      <div className="identity-box">
                        <span className="box-lbl">{item.label}</span>
                        <div className="box-val">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="personality-analysis p-4" style={{ background: '#faf7f4', borderRadius: '15px' }}>
                  <h5 className="fw-bold mb-3" style={{ color: '#9c5a1e' }}>Personality Blueprint:</h5>
                  <p style={{ lineHeight: '1.8', color: '#4a372d' }}>{interpretations[result.ascendant]?.text}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
          
          .kundali-results-page {
            background: #ffffff;
            min-height: 100vh;
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .btn-back-tool-dark {
            background: #ffefd6;
            border: 1px solid #f3e5d8;
            color: #9c5a1e;
            padding: 10px 24px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
          }

          .results-header-title {
            font-family: 'Playfair Display', serif;
            font-weight: 800;
            color: #65250c;
          }

          .results-nav-tabs {
            display: flex;
            gap: 15px;
            border-bottom: 2px solid #ffefd6;
            overflow-x: auto;
          }

          .nav-tab-item {
            background: none;
            border: none;
            padding: 12px 30px;
            font-weight: 700;
            color: #9c847b;
            cursor: pointer;
            transition: 0.3s;
            white-space: nowrap;
          }
          .nav-tab-item.active {
            color: #c6843f;
            border-bottom: 4px solid #c6843f;
          }

          .premium-result-card {
            background: #ffffff;
            border-radius: 24px;
            border: 1px solid #f3e5d8;
            box-shadow: 0 15px 35px rgba(198,132,63,0.05);
          }

          .card-sub-title {
            font-family: 'Playfair Display', serif;
            color: #65250c;
            font-weight: 800;
            font-size: 26px;
          }

          .info-grid .grid-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #faf7f4;
          }
          .info-grid .grid-row:last-child { border-bottom: none; }
          .info-grid .grid-row span { color: #9c847b; font-weight: 500; }
          .info-grid .grid-row strong { color: #65250c; }

          .premium-table { width: 100%; border-collapse: collapse; }
          .premium-table th { text-align: left; padding: 15px; color: #9c5a1e; font-weight: 700; background: #faf7f4; font-size: 15px; text-transform: uppercase; }
          .premium-table td { padding: 15px; border-bottom: 1px solid #f3e5d8; color: #4a372d; font-size: 17px; }
          .text-bronze-accent { color: #c6843f; font-weight: 700; }

          .identity-box { background: #ffefd6; padding: 25px; border-radius: 20px; text-align: center; border: 1px solid #f3e5d8; }
          .box-lbl { display: block; font-size: 13px; text-transform: uppercase; color: #9c5a1e; font-weight: 700; margin-bottom: 8px; }
          .box-val { font-size: 26px; font-weight: 800; color: #65250c; }

          .badge-cosmic-light { background: #ffefd6; color: #c6843f; padding: 8px 24px; border-radius: 50px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        `}</style>
      </div>
    );
  }

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
            {image && (
              <div className="shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-[18%] shadow-2xl">
                  <img src={image} alt="Tool Image" className="w-full h-full object-cover scale-105" />
                </div>
              </div>
            )}
            <div>
              <h1 className="mb-3 font-serif text-3xl font-black leading-tight sm:text-4xl lg:text-[2.2rem] text-white">
                Free Kundli Online
              </h1>
              <p className="mb-4 text-sm leading-relaxed text-white/85 sm:text-[1rem] text-white">
                Generate your detailed Vedic birth chart. Our high-precision algorithm reveals your personality, destiny, and planetary strengths based on ancient wisdom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 items-start justify-center bg-white px-4 pt-8 pb-32 sm:px-6 sm:pt-10 sm:pb-32 lg:items-center lg:px-10 lg:pt-14 lg:pb-28">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-[#f3e5d8] bg-white p-6 shadow-[0_8px_28px_rgba(198,132,63,0.09)] sm:p-8">
            <h2 className="mb-6 text-center font-serif text-lg font-extrabold text-[#65250c]">
              Birth Details
            </h2>
            <form onSubmit={calculate} className="flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Full Name</label>
                <input
                  className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]"
                  type="text" placeholder="Enter your name"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Gender</label>
                  <select
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors focus:border-[#c6843f]"
                    value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} required
                  >
                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Date of Birth</label>
                  <input
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors focus:border-[#c6843f]"
                    type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Time of Birth</label>
                  <input
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors focus:border-[#c6843f]"
                    type="time" value={formData.tob} onChange={e => setFormData({ ...formData, tob: e.target.value })} required
                  />
                </div>
                <div className="relative">
                  <label className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">Birth Place</label>
                  <input
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-2 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]"
                    type="text" placeholder="Search city..." value={query} onChange={e => handleLocationSearch(e.target.value)} required
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#f3e5d8] bg-white shadow-xl z-50">
                      {suggestions.map((loc, i) => (
                        <div
                          key={i}
                          className="cursor-pointer border-b border-[#f3e5d8]/50 px-3 py-2 text-sm text-[#65250c] hover:bg-[#ffefd6]/50 last:border-b-0"
                          onClick={() => selectLocation(loc)}
                        >
                          {loc.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(198,132,63,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(198,132,63,0.3)] disabled:opacity-70 disabled:hover:translate-y-0"
                type="submit" disabled={loading}
              >
                {loading ? 'Creating Chart...' : 'Generate My Kundli'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KundaliTool;
