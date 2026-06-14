import { useEffect, useState } from 'react';
import toast from '@/utils/toast';

function Astrologer() {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
      window.AOS.init({
        duration: 1000,
        once: true
      });
    }
  }, []);

  const astrologers = [
    { 
      name: "Damini Ma'am", 
      role: "Vedic Astrology Expert", 
      exp: "16+ Years", 
      image: "/images/damini.png", 
      bio: "Specializes in deep karmic analysis and birth chart rectifications with precise predictive accuracy.",
      rating: "5.0",
      reviews: "1.2k+",
      languages: ["Hindi", "English", "Sanskrit"],
      specialties: ["Vedic", "Numerology", "Marriage"]
    },
    { 
      name: "Sanjay Ji", 
      role: "Vastu & Numerology", 
      exp: "12+ Years", 
      image: "/images/sanjay.png", 
      bio: "Master of scientific Vastu corrections and business name numerology for professional growth.",
      rating: "4.9",
      reviews: "850+",
      languages: ["Hindi", "Punjabi", "English"],
      specialties: ["Vastu", "Business", "Health"]
    },
    { 
      name: "Kavita Ji", 
      role: "Tarot & Psychic", 
      exp: "8+ Years", 
      image: "/images/kavita.png", 
      bio: "Providing clarity on love and career crossroads through intuitive tarot guidance and energy healing.",
      rating: "4.8",
      reviews: "600+",
      languages: ["English", "Hindi"],
      specialties: ["Tarot", "Love", "Career"]
    },
    { 
      name: "Rahul Shastri", 
      role: "KP Astrology", 
      exp: "10+ Years", 
      image: "/images/rahul.png", 
      bio: "Highly precise timing of events using the advanced KP System and Prashna Kundali.",
      rating: "4.9",
      reviews: "920+",
      languages: ["Hindi", "Marathi", "English"],
      specialties: ["KP System", "Prashna", "Finance"]
    },
  ];

  return (
    <div className="astrologers-page">
      {/* Premium Hero Header */}
      <section className="astro-hero-v2">
        <div className="hero-pattern-bg"></div>
        <div className="container position-relative z-2">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8" data-aos="fade-down">
              <div className="premium-badge">
                <i className="fas fa-certificate me-2"></i> Verified Experts
              </div>
              <h1 className="display-3 fw-bold mb-4">
                Consult With India's <span className="text-gradient">Top Astrologers</span>
              </h1>
              <p className="lead mb-5 opacity-75">
                Our handpicked experts bring decades of celestial wisdom to help you navigate 
                life's most important decisions with confidence and clarity.
              </p>
              <div className="trust-bars d-flex justify-content-center gap-4 flex-wrap">
                <div className="trust-item"><i className="fas fa-check-circle text-success me-2"></i> 100% Private</div>
                <div className="trust-item"><i className="fas fa-check-circle text-success me-2"></i> Verified Profiles</div>
                <div className="trust-item"><i className="fas fa-check-circle text-success me-2"></i> Safe & Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Stats Bar */}
      <div className="container stats-bar-v2" data-aos="fade-up">
        <div className="row text-center py-4 g-4">
          <div className="col-md-3 col-6">
            <div className="stat-box">
              <div className="h3 mb-0 fw-bold">50k+</div>
              <small className="text-muted text-uppercase">Happy Clients</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-box border-start-md">
              <div className="h3 mb-0 fw-bold">4.9/5</div>
              <small className="text-muted text-uppercase">Average Rating</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-box border-start-md">
              <div className="h3 mb-0 fw-bold">15+</div>
              <small className="text-muted text-uppercase">Cities Covered</small>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-box border-start-md">
              <div className="h3 mb-0 fw-bold">24/7</div>
              <small className="text-muted text-uppercase">Support Available</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="container py-5">
        <div className="row g-4 justify-content-center">
          {astrologers.map((astro, idx) => (
            <div key={idx} className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="modern-astro-card">
                <div className="card-top">
                  <div className="rating-badge">
                    <i className="fas fa-star me-1"></i> {astro.rating}
                  </div>
                  <div className="astro-img-wrapper">
                    <img src={astro.image} alt={astro.name} className="main-img" />
                    <div className="status-indicator"></div>
                  </div>
                </div>
                
                <div className="card-body-v2 text-center">
                  <h3 className="astro-name">{astro.name}</h3>
                  <p className="astro-role">{astro.role}</p>
                  
                  <div className="exp-pill mb-3">
                    <i className="fas fa-history me-1"></i> {astro.exp} Exp
                  </div>

                  <div className="specialties-row mb-3">
                    {astro.specialties.map((s, i) => (
                      <span key={i} className="spec-tag">{s}</span>
                    ))}
                  </div>

                  <p className="astro-bio-v2">"{astro.bio}"</p>
                  
                  <div className="lang-info mb-4">
                    <i className="fas fa-language me-2"></i>
                    {astro.languages.join(", ")}
                  </div>

                  <div className="btn-group-v2">
                    <button className="btn-chat" onClick={() => toast.success(`Starting chat with ${astro.name}...`)}>
                      <i className="fas fa-comment-dots me-2"></i> Chat
                    </button>
                    <button className="btn-call" onClick={() => toast.success(`Calling ${astro.name}...`)}>
                      <i className="fas fa-phone-alt me-2"></i> Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Consult Section */}
      <section className="why-consult py-5">
        <div className="container text-center">
          <h2 className="mb-5 display-5 fw-bold">Why Consult Our Experts?</h2>
          <div className="row g-4">
            {[
              { icon: 'fas fa-user-shield', title: 'Absolute Privacy', desc: 'Your details and consultations are 100% confidential.' },
              { icon: 'fas fa-hand-holding-heart', title: 'Compassionate Care', desc: 'Our experts provide guidance with empathy and understanding.' },
              { icon: 'fas fa-clock', title: 'Timely Support', desc: 'Get quick answers to your pressing life questions.' }
            ].map((item, i) => (
              <div key={i} className="col-md-4">
                <div className="why-card p-4 rounded-4" data-aos="zoom-in" data-aos-delay={i * 100}>
                  <div className="why-icon-box mb-3">
                    <i className={item.icon}></i>
                  </div>
                  <h4>{item.title}</h4>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .astrologers-page {
          background-color: #FDF6EE;
          min-height: 100vh;
          font-family: var(--font-sans);
          color: #2A0F02;
          overflow-x: hidden;
        }

        .astro-hero-v2 {
          position: relative;
          padding: clamp(6rem, 10vw, 8rem) clamp(0.9rem, 3vw, 2rem) clamp(3.5rem, 7vw, 5rem);
          background: linear-gradient(180deg, #FFFBF5 0%, #FDF6EE 100%);
        }

        .hero-pattern-bg {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: url('/images/zodiac-pattern.png');
          background-size: cover;
          background-position: center;
        }

        .text-gradient {
          background: linear-gradient(135deg, #8B4A1E, #C8832A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          background: #2A0F02;
          color: #fff;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1rem;
          box-shadow: 0 5px 15px rgba(42, 15, 2, 0.2);
        }

        .astro-hero-v2 h1 {
          font-size: clamp(2.1rem, 5vw, 3.45rem) !important;
          line-height: 1.12;
          margin-bottom: 1rem !important;
        }

        .astro-hero-v2 .lead {
          font-size: clamp(1rem, 1.6vw, 1.12rem);
          line-height: 1.65;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 1.75rem !important;
        }

        .trust-bars {
          gap: 0.7rem !important;
        }

        .trust-item {
          background: #fff;
          border: 1px solid rgba(200, 131, 42, 0.12);
          border-radius: 9px;
          color: #4a2815;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.55rem 0.85rem;
        }

        .stats-bar-v2 {
          background: #fff;
          margin-top: -34px;
          border-radius: 16px;
          box-shadow: 0 14px 30px rgba(139, 74, 30, 0.08);
          position: relative;
          z-index: 10;
          border: 1px solid rgba(200, 131, 42, 0.1);
        }

        .stat-box { padding: 0.4rem; }
        .stat-box .h3 {
          color: #2A0F02;
          font-size: clamp(1.35rem, 2.5vw, 1.6rem);
        }
        .stat-box small {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }
        .border-start-md { border-left: 1px solid rgba(0,0,0,0.05); }

        /* Modern Astro Card */
        .modern-astro-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          border: 1px solid rgba(200, 131, 42, 0.1);
          height: 100%;
          box-shadow: 0 10px 24px rgba(42, 15, 2, 0.06);
        }

        .modern-astro-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(139, 74, 30, 0.12);
          border-color: #C8832A;
        }

        .card-top {
          position: relative;
          padding: 1.4rem 1rem 1rem;
          background: linear-gradient(180deg, #FDF6EE 0%, #fff 100%);
          display: flex;
          justify-content: center;
        }

        .rating-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #fff;
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.88rem;
          color: #8B4A1E;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border: 1px solid rgba(200, 131, 42, 0.1);
        }

        .astro-img-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          max-width: 38vw;
          max-height: 38vw;
        }

        .main-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .status-indicator {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          background: #28a745;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(40, 167, 69, 0.4);
        }

        .card-body-v2 { padding: 0 clamp(1rem, 2vw, 1.2rem) 1.2rem; }

        .astro-name { font-family: var(--font-serif); font-weight: 800; font-size: clamp(1.35rem, 2.5vw, 1.55rem); margin-bottom: 0.25rem; line-height: 1.25; }
        .astro-role { color: #8B4A1E; font-weight: 700; font-size: 0.96rem; margin-bottom: 0.8rem; }

        .exp-pill {
          display: inline-flex;
          background: #FDF6EE;
          padding: 0.42rem 0.75rem;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 700;
          color: #8B4A1E;
          border: 1px solid rgba(200, 131, 42, 0.1);
        }

        .spec-tag {
          display: inline-block;
          font-size: 0.78rem;
          background: #f8f9fa;
          padding: 0.35rem 0.55rem;
          border-radius: 4px;
          margin: 3px;
          color: #6c757d;
          font-weight: 600;
        }

        .astro-bio-v2 {
          font-size: 0.92rem;
          color: #5C2D12;
          line-height: 1.55;
          margin-bottom: 1rem;
          font-style: italic;
          opacity: 0.95;
        }

        .lang-info { font-size: 0.88rem; font-weight: 600; color: #9B6640; }

        .btn-group-v2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .btn-chat, .btn-call {
          border: none;
          padding: 0.65rem 0.55rem;
          border-radius: 9px;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .btn-chat { background: #2A0F02; color: #fff; }
        .btn-call { background: transparent; border: 1.5px solid #2A0F02; color: #2A0F02; }

        .btn-chat:hover { background: #000; transform: translateY(-1px); }
        .btn-call:hover { background: #2A0F02; color: #fff; transform: translateY(-1px); }

        /* Why Cards */
        .why-card {
          background: #fff;
          border: 1px solid rgba(200, 131, 42, 0.1);
          transition: 0.3s;
          border-radius: 14px !important;
          height: 100%;
        }
        .why-card:hover { border-color: #C8832A; box-shadow: 0 15px 30px rgba(139, 74, 30, 0.05); }

        .why-icon-box {
          width: 60px;
          height: 60px;
          background: rgba(200, 131, 42, 0.1);
          color: #8B4A1E;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto;
        }

        .why-consult h2 {
          font-size: clamp(1.8rem, 4vw, 2.35rem) !important;
          line-height: 1.2;
          margin-bottom: 2rem !important;
        }

        .why-card h4 {
          font-size: 1.15rem;
          color: #2A0F02;
        }

        .why-card p {
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .astro-hero-v2 { padding: 6rem 0.9rem 3.75rem; }
          .display-3 { font-size: 2.2rem; }
          .stats-bar-v2 { margin-top: -24px; width: calc(100% - 1.7rem); }
          .border-start-md { border-left: none; }
          .card-body-v2 { padding: 0 clamp(0.85rem, 1.5vw, 1rem) 1rem; }
          .astro-name { font-size: 1.35rem; }
          .btn-group-v2 { gap: 0.55rem; }
        }
      `}</style>
    </div>
  );
}

export default Astrologer;
