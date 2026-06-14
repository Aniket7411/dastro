import { useState } from 'react';
import API_BASE from '../../utils/api.js';


const ICONS = {
  planet:'🪐', sign:'♑', stones:'💎', days:'📅', color:'🎨',
  god:'🙏', fast:'🌙', dates:'🗓️', direction:'🧭', alphabets:'🔤', number:'✨',
};

function NumerologyTool({ onBack }) {
  const [formData, setFormData] = useState({ name:'', dob:'' });
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const calculate = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/tools/numerology`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message || 'Calculation failed'); }
    finally { setLoading(false); }
  };

  const fav = result?.favourable || {};

  return (
    <div className="numerology-tool-container animated fadeIn">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">

          {/* LEFT HERO PANEL */}
          {!result ? (
            <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white">
              <div className="hero-content mx-auto" style={{ maxWidth: '480px' }}>
                {onBack && (
                  <button className="btn-back-tool mb-4" onClick={onBack}>
                    <i className="fas fa-chevron-left me-2"></i> Back to Tools
                  </button>
                )}
                <h1 className="display-4 fw-bold mb-3 hero-title">Numerology Calculator</h1>
                <p className="hero-desc mb-5">
                  Unlock the vibrational power of your numbers. Our Chaldean & Vedic system analyzes your Radical, Destiny, and Name numbers to guide your life path.
                </p>
                <div className="decor-icons">🔢 ✨ 🕉️ 🌟</div>
              </div>
            </div>
          ) : (
            <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white text-center">
              <div className="mx-auto" style={{ maxWidth: '480px' }}>
                <div className="selected-sign-icon mb-4">
                  <div className="selected-svg-wrap" style={{ fontSize: '80px' }}>🔢</div>
                </div>
                <h1 className="display-4 fw-bold mb-2 hero-title">Number {result.radical}</h1>
                <p className="hero-desc mb-5">Ruled by {fav.planet}. Your life's vibration is set.</p>
                <button className="btn-change-sign" onClick={() => setResult(null)}>
                  <i className="fas fa-sync-alt me-2"></i> Calculate New
                </button>
              </div>
            </div>
          )}

          {/* RIGHT CONTENT PANEL */}
          <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white-content">
            {!result ? (
              <div className="w-100" style={{ maxWidth: '500px' }}>
                <div className="prediction-box animated fadeInUp p-4 p-md-5" style={{ borderRadius: '20px', border: '1px solid #f3e5d8', boxShadow: '0 20px 40px rgba(198,132,63,0.1)' }}>
                  <h3 className="form-title text-center mb-4" style={{ fontFamily: 'Playfair Display', color: '#65250c', fontWeight: 800 }}>Vibrational Input</h3>
                  <form onSubmit={calculate}>
                    <div className="mb-4">
                      <label className="custom-lbl">Full Name</label>
                      <input className="custom-inp" type="text" placeholder="e.g. John Doe"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="mb-5">
                      <label className="custom-lbl">Date of Birth</label>
                      <input className="custom-inp" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
                    </div>
                    <button className="btn-calculate-premium w-100" type="submit" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2" /> Calculating…</> : 'Calculate My Numbers'}
                    </button>
                    {error && <p className="text-danger mt-3 text-center small">{error}</p>}
                  </form>
                </div>
              </div>
            ) : (
              <div className="horoscope-report w-100" style={{ maxWidth: '720px' }}>
                <div className="prediction-box animated fadeInUp">
                  <div className="prediction-header mb-4 border-bottom pb-3">
                    <span className="badge-cosmic">Numerology Report</span>
                    <h2 className="prediction-h1 mt-2">{result.name}</h2>
                  </div>

                  <div className="prediction-body">
                    {/* 3 Core Numbers */}
                    <div className="row g-3 mb-5">
                      {[
                        { n: result.radical,    label:'Radical No.',  sub:'Birth Day' },
                        { n: result.destiny,    label:'Destiny No.',  sub:'Life Path' },
                        { n: result.nameNumber, label:'Name No.',     sub:'Chaldean' },
                      ].map(({ n, label, sub }) => (
                        <div className="col-4" key={label}>
                          <div className="lucky-stat py-4">
                            <div style={{ fontSize:'42px', fontWeight:900, color:'#9c5a1e', lineHeight:1 }}>{n}</div>
                            <div className="stat-label mt-2">{label}</div>
                            <div style={{ fontSize:'10px', color:'#9c847b' }}>{sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {fav.planet && (
                      <div className="auspicious-details">
                        <h3 className="section-title mb-4"><i className="fas fa-star me-2"></i> Auspicious Details</h3>
                        <div className="row g-3">
                          {[
                            ['Planet',    ICONS.planet,    fav.planet],
                            ['Stone',     ICONS.stones,    fav.stones],
                            ['Lucky Days',ICONS.days,      fav.days],
                            ['Colors',    ICONS.color,     fav.color],
                            ['Dates',     ICONS.dates,     fav.dates],
                            ['Letters',   ICONS.alphabets, fav.alphabets],
                          ].map(([label, icon, value]) => (
                            <div className="col-6 col-md-4" key={label}>
                              <div className="lucky-stat d-flex align-items-center gap-2 text-start py-2">
                                <span style={{ fontSize: '18px' }}>{icon}</span>
                                <div>
                                  <div className="stat-label" style={{ marginBottom: '0' }}>{label}</div>
                                  <div style={{ fontWeight: 700, color: '#65250c', fontSize: '13px' }}>{value}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mantra */}
                        <div className="mt-5 p-4" style={{ background: '#ffefd6', borderRadius: '15px', border: '1px solid #f3e5d8', textAlign: 'center' }}>
                          <div style={{ fontSize: '24px' }}>🕉️</div>
                          <div className="stat-label">Sacred Mantra</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#65250c', letterSpacing: '1px', margin: '8px 0' }}>{fav.mantra}</div>
                          <div style={{ fontSize: '11px', color: '#9c5a1e' }}>Chant 108 times every {fav.fast} morning for blessings.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        .numerology-tool-container {
          font-family: 'Be Vietnam Pro', sans-serif;
          overflow-x: hidden;
        }

        .bg-bronze-hero {
          background: linear-gradient(to right, #c6843f, #9c5a1e);
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
          font-size: 14px;
          transition: 0.3s;
          font-weight: 500;
        }
        .btn-back-tool:hover { background: rgba(255,255,255,0.25); }

        .custom-lbl {
          display: block;
          font-size: 13px;
          color: #65250c;
          margin-bottom: 8px;
          font-weight: 700;
          text-align: left;
        }

        .custom-inp {
          width: 100%;
          border: none;
          border-bottom: 2px solid #f3e5d8;
          background: transparent;
          padding: 10px 0;
          font-size: 16px;
          color: #65250c;
          outline: none;
          transition: 0.3s;
          font-weight: 600;
        }
        .custom-inp:focus { border-color: #c6843f; }

        .btn-calculate-premium {
          background: linear-gradient(to right, #c6843f, #9c5a1e);
          border: none;
          color: #fff;
          padding: 14px 40px;
          border-radius: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: 0 10px 20px rgba(198,132,63,0.2);
          transition: 0.3s;
        }
        .btn-calculate-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(198,132,63,0.3); }

        .prediction-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #65250c;
        }

        .badge-cosmic {
          background: #ffefd6;
          color: #9c5a1e;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #65250c;
          font-weight: 700;
        }

        .lucky-stat {
          padding: 15px;
          background: #ffefd6;
          border-radius: 12px;
          text-align: center;
        }
        .stat-label { display: block; font-size: 10px; color: #9c5a1e; text-transform: uppercase; margin-bottom: 5px; font-weight: 700; }

        .btn-change-sign {
          background: #ffefd6;
          border: none;
          color: #9c5a1e;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          transition: 0.3s;
        }
        .btn-change-sign:hover { background: #f3e5d8; transform: translateY(-2px); }

        @media (max-width: 991px) {
          .hero-title { font-size: 28px; }
          .prediction-h1 { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}

export default NumerologyTool;
