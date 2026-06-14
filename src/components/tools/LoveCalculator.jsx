import { useState } from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';
import API_BASE from '../../utils/api.js';

const emptyPartner = () => ({ name:'', dob:'', tob:'12:00', place:'', lat:'', lon:'' });

function PartnerCard({ label, data, onChange }) {
  return (
    <div className="partner-card-premium h-100">
      <h5 className="partner-label mb-4">{label}</h5>
      <div className="mb-3">
        <label className="custom-lbl">Full Name</label>
        <input className="custom-inp" type="text" placeholder="Enter full name"
          value={data.name} onChange={(e) => onChange({ ...data, name:e.target.value })} required />
      </div>
      <div className="row g-2 mb-3">
        <div className="col-7">
          <label className="custom-lbl">Date of Birth</label>
          <input className="custom-inp" type="date" value={data.dob} onChange={(e) => onChange({ ...data, dob:e.target.value })} required />
        </div>
        <div className="col-5">
          <label className="custom-lbl">Birth Time</label>
          <input className="custom-inp" type="time" value={data.tob} onChange={(e) => onChange({ ...data, tob:e.target.value })} />
        </div>
      </div>
      <div>
        <label className="custom-lbl">Birth Place</label>
        <PlaceAutocomplete
          value={data.place} placeholder="Search city or town…"
          onChange={(text) => onChange({ ...data, place:text, lat:'', lon:'' })}
          onSelect={({ lat, lon, label }) => onChange({ ...data, place:label, lat, lon })}
        />
        {data.lat && <div className="mt-1 small text-success">✓ Location verified</div>}
      </div>
    </div>
  );
}

function LoveCalculator({ onBack }) {
  const [partnerA, setPartnerA] = useState(emptyPartner());
  const [partnerB, setPartnerB] = useState(emptyPartner());
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const isValid = () => partnerA.lat && partnerA.lon && partnerB.lat && partnerB.lon && partnerA.dob && partnerB.dob && partnerA.name && partnerB.name;

  const calculate = async (e) => {
    e.preventDefault();
    if (!isValid()) { setError('Please select both birth places from the dropdown.'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/tools/love-compatibility`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          partnerA:{ name:partnerA.name, dob:partnerA.dob, tob:partnerA.tob, lat:partnerA.lat, lon:partnerA.lon },
          partnerB:{ name:partnerB.name, dob:partnerB.dob, tob:partnerB.tob, lat:partnerB.lat, lon:partnerB.lon },
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Calculation failed');
      setResult(data);
    } catch (err) { setError(err.message || 'Failed.'); }
    finally { setLoading(false); }
  };

  const score = result?.score || 0;
  const scoreColor = score > 80 ? '#c6843f' : score > 60 ? '#9c5a1e' : '#65250c';

  return (
    <div className="love-tool-container animated fadeIn">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          
          {/* LEFT PANEL */}
          <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white">
            <div className="hero-content mx-auto" style={{ maxWidth: '480px' }}>
              {onBack && (
                <button className="btn-back-tool mb-4" onClick={onBack}>
                  <i className="fas fa-chevron-left me-2"></i> Back to Tools
                </button>
              )}
              <h1 className="display-4 fw-bold mb-3 hero-title">Love Compatibility</h1>
              <p className="hero-desc mb-5">
                Explore the celestial bond between two souls. Our Vedic Synastry tool analyzes Moon signs and planetary alignments to reveal your destiny score.
              </p>
              <div className="decor-icons text-center" style={{ fontSize: '2.5rem' }}>💞 ✨ 💍 🌟</div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white-content">
            {!result ? (
              <div className="w-100" style={{ maxWidth: '850px' }}>
                <form onSubmit={calculate}>
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <PartnerCard label="👤 Partner One" data={partnerA} onChange={setPartnerA} />
                    </div>
                    <div className="col-md-6">
                      <PartnerCard label="👤 Partner Two" data={partnerB} onChange={setPartnerB} />
                    </div>
                  </div>

                  <div className="text-center">
                    <button className="btn-calculate-premium" type="submit" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2" /> Consulting Stars…</> : 'Check Compatibility Score'}
                    </button>
                    {error && <p className="text-danger mt-3 small">{error}</p>}
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-100" style={{ maxWidth: '720px' }}>
                <div className="prediction-box animated fadeInUp">
                  <div className="prediction-header text-center mb-5">
                    <span className="badge-cosmic">Destiny Match</span>
                    <div className="score-display mt-4">
                      <div className="score-circle-wrap mx-auto mb-3">
                        <span className="score-number" style={{ color: scoreColor }}>{score}%</span>
                      </div>
                      <div className="custom-progress-bg mx-auto" style={{ height: '8px', maxWidth: '280px', background: '#ffefd6', borderRadius: '10px', overflow: 'hidden' }}>
                        <div className="custom-progress-bar" style={{ width: `${score}%`, height: '100%', background: scoreColor, transition: 'width 1s ease-out' }}></div>
                      </div>
                    </div>
                    <h2 className="prediction-h1 mt-4">{result.partnerA?.name} & {result.partnerB?.name}</h2>
                    <div className="prediction-date-label">
                       <i className="fas fa-heart me-2" style={{ color: '#c6843f' }}></i>
                       {result.partnerA?.sign} Moon ♥ {result.partnerB?.sign} Moon
                    </div>
                  </div>

                  <div className="prediction-body">
                    <div className="prediction-section mb-5 p-4" style={{ background: '#faf7f4', borderRadius: '15px', border: '1px solid #f1e4d8' }}>
                      <h3 className="section-title mb-3"><i className="fas fa-magic me-2"></i> Cosmic Interpretation</h3>
                      <p className="prediction-text" style={{ fontStyle: 'italic', color: '#65250c', lineHeight: '1.7' }}>"{result.analysis}"</p>
                    </div>

                    <div className="row g-3">
                      {result.traits?.map((t, i) => (
                        <div key={i} className="col-6 col-md-4">
                          <div className="lucky-stat h-100">
                            <span className="stat-label">{t.label}</span>
                            <span className="stat-value" style={{ fontSize: '15px' }}>{t.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button className="btn-change-sign" onClick={() => setResult(null)}>
                      <i className="fas fa-sync-alt me-2"></i> Try with Someone Else
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        .love-tool-container {
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

        .partner-card-premium {
          background: #ffffff;
          padding: 30px;
          border-radius: 24px;
          border: 1px solid #f3e5d8;
          box-shadow: 0 15px 35px rgba(198,132,63,0.08);
          transition: 0.3s;
        }
        .partner-card-premium:hover {
          border-color: #c6843f;
          transform: translateY(-5px);
        }

        .partner-label {
          color: #65250c;
          font-weight: 800;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          border-bottom: 2px solid #ffefd6;
          display: inline-block;
        }

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
          padding: 16px 45px;
          border-radius: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 10px 25px rgba(198,132,63,0.25);
          transition: 0.3s;
          cursor: pointer;
        }
        .btn-calculate-premium:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(198,132,63,0.35); }

        .score-number {
          font-size: 72px;
          font-weight: 900;
          line-height: 1;
          font-family: 'Playfair Display', serif;
        }

        .prediction-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: #65250c;
          font-weight: 800;
        }

        .badge-cosmic {
          background: #ffefd6;
          color: #9c5a1e;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .prediction-date-label {
          color: #9c5a1e;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #65250c;
          font-weight: 800;
        }

        .prediction-text {
          font-size: 17px;
          line-height: 1.7;
          color: #4a372d;
        }

        .lucky-stat {
          padding: 18px;
          background: #ffefd6;
          border-radius: 15px;
          text-align: center;
          border: 1px solid #f3e5d8;
        }
        .stat-label { display: block; font-size: 10px; color: #9c5a1e; text-transform: uppercase; margin-bottom: 6px; font-weight: 800; }
        .stat-value { font-weight: 800; color: #65250c; font-size: 18px; }

        .btn-change-sign {
          background: #ffefd6;
          border: 1px solid #f3e5d8;
          color: #9c5a1e;
          padding: 14px 35px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
          transition: 0.3s;
          cursor: pointer;
        }
        .btn-change-sign:hover { background: #f3e5d8; transform: translateY(-2px); }

        @media (max-width: 991px) {
          .hero-title { font-size: 28px; }
          .prediction-h1 { font-size: 28px; }
          .score-number { font-size: 56px; }
        }
      `}</style>
    </div>
  );
}

export default LoveCalculator;
