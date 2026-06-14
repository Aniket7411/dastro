import { useState } from 'react';
import API_BASE from '../../utils/api.js';

function MoonTool({ onBack }) {
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '12:00' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/tools/moon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const resp = await res.json();
      if (!resp) throw new Error('Calculation failed');
      setResult(resp);
    } catch (err) {
      setError(err.message || 'Lunar calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="moon-tool-container animated fadeIn">
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
                <h1 className="display-4 fw-bold mb-3 hero-title">Moon Sign & Phase</h1>
                <p className="hero-desc mb-5">
                  Discover your Vedic moon sign, lunar phase, and emotional blueprint. The Moon reveals your inner world and subconscious reactions.
                </p>
                <div className="decor-icons">🌙 ✨ 🌊 🌒</div>
              </div>
            </div>
          ) : (
            <div className="col-lg-5 d-flex flex-column justify-content-center p-4 p-md-5 bg-bronze-hero text-white text-center">
              <div className="mx-auto" style={{ maxWidth: '480px' }}>
                <div className="selected-sign-icon mb-4">
                  <div className="selected-svg-wrap" style={{ fontSize: '80px' }}>🌙</div>
                </div>
                <h1 className="display-4 fw-bold mb-2 hero-title">{result.phase?.name}</h1>
                <p className="hero-desc mb-5">{result.phase?.title}</p>
                <button className="btn-change-sign" onClick={() => setResult(null)}>
                  <i className="fas fa-sync-alt me-2"></i> Calculate Another
                </button>
              </div>
            </div>
          )}

          {/* RIGHT CONTENT PANEL */}
          <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white-content">
            {!result ? (
              <div className="w-100" style={{ maxWidth: '500px' }}>
                <div className="prediction-box animated fadeInUp p-4 p-md-5" style={{ borderRadius: '20px', border: '1px solid #f3e5d8', boxShadow: '0 20px 40px rgba(198,132,63,0.1)' }}>
                  <h3 className="form-title text-center mb-4" style={{ fontFamily: 'Playfair Display', color: '#65250c', fontWeight: 800 }}>Enter Birth Details</h3>
                  <form onSubmit={calculate}>
                    <div className="mb-4">
                      <label className="custom-lbl">Full Name</label>
                      <input className="custom-inp" type="text" placeholder="Enter your name"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="row g-3 mb-5">
                      <div className="col-7">
                        <label className="custom-lbl">Date of Birth</label>
                        <input className="custom-inp" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
                      </div>
                      <div className="col-5">
                        <label className="custom-lbl">Birth Time</label>
                        <input className="custom-inp" type="time" value={formData.tob} onChange={(e) => setFormData({ ...formData, tob: e.target.value })} />
                      </div>
                    </div>
                    <button className="btn-calculate-premium w-100" type="submit" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2" /> Calculating…</> : 'Get Moon Report'}
                    </button>
                    {error && <p className="text-danger mt-3 text-center small">{error}</p>}
                  </form>
                </div>
              </div>
            ) : (
              <div className="horoscope-report w-100" style={{ maxWidth: '680px' }}>
                <div className="prediction-box animated fadeInUp">
                  <div className="prediction-header mb-5 border-bottom pb-4">
                    <span className="badge-cosmic">Lunar Report</span>
                    <h2 className="prediction-h1 mt-3">{result.name}'s Moon Phase</h2>
                    <div className="prediction-date-label">Phase #{result.phase?.number} • {result.moonSign} Moon</div>
                  </div>

                  <div className="prediction-body">
                    <div className="prediction-section mb-5">
                      <h3 className="section-title mb-3"><i className="fas fa-moon me-2"></i> Key Characteristics</h3>
                      <div className="row g-2">
                        {result.phase?.keywords?.map((kw, i) => (
                          <div key={i} className="col-md-6">
                            <div className="lucky-stat d-flex align-items-center gap-2 text-start py-2">
                              <span style={{ color: '#c6843f' }}>✦</span>
                              <span style={{ fontSize: '14px', color: '#65250c' }}>{kw}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="lucky-stat p-4">
                          <span className="stat-label">Moon Sign</span>
                          <span className="stat-value">{result.moonSign}</span>
                          <div className="mt-1 small text-muted">{result.moonDegree}°</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="lucky-stat p-4">
                          <span className="stat-label">Phase Range</span>
                          <span className="stat-value">{result.phase?.startDeg}° - {result.phase?.endDeg}°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        .moon-tool-container {
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

        .prediction-date-label {
          color: #9c5a1e;
          font-weight: 600;
          font-size: 15px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #65250c;
          font-weight: 700;
        }

        .prediction-text {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(101, 37, 12, 0.85);
        }

        .lucky-stat {
          padding: 15px;
          background: #ffefd6;
          border-radius: 12px;
          text-align: center;
        }
        .stat-label { display: block; font-size: 10px; color: #9c5a1e; text-transform: uppercase; margin-bottom: 5px; font-weight: 700; }
        .stat-value { font-weight: 800; color: #65250c; font-size: 18px; }

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

export default MoonTool;
