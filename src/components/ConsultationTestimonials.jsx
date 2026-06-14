import React, { useRef } from 'react';

const CLIENTS = [
  {
    name: "Rajesh Kumar Verma",
    location: "Mumbai, Maharashtra",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
    rating: 5,
    text: "The career consultation was absolutely spot on! Within 3 months I received a promotion exactly as predicted. Acharya ji's precise reading gave me the confidence to make bold career moves.",
    service: "Career Consultation",
  },
  {
    name: "Kavya Reddy",
    location: "Hyderabad, Telangana",
    img: "https://randomuser.me/api/portraits/women/58.jpg",
    rating: 5,
    text: "The remedies for my Mangal dosha were simple yet incredibly effective. Within 6 months we found the perfect match. Eternally grateful for this divine and remarkably accurate guidance!",
    service: "Marriage Consultation",
  },
  {
    name: "Deepika Mishra",
    location: "Jaipur, Rajasthan",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 5,
    text: "Was skeptical about tarot reading, but every card drawn resonated deeply with my situation. The clarity I received about my relationship helped me make the best decision of my life.",
    service: "Tarot Card Reading",
  },
  {
    name: "Suresh Rao",
    location: "Mysore, Karnataka",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
    text: "I was confused about moving abroad for business. The consultation gave me a clear timeline and the right muhurat. Everything unfolded exactly as Acharya ji predicted. Simply incredible!",
    service: "Business Consultation",
  },
  {
    name: "Anita Malhotra",
    location: "Amritsar, Punjab",
    img: "https://randomuser.me/api/portraits/women/72.jpg",
    rating: 5,
    text: "Going through a difficult divorce felt hopeless until this consultation. I received clarity on the legal outcome and emotional healing remedies that truly worked. My life is back on track.",
    service: "Divorce Consultation",
  },
  {
    name: "Vikram Singh Rathore",
    location: "Jodhpur, Rajasthan",
    img: "https://randomuser.me/api/portraits/men/31.jpg",
    rating: 5,
    text: "The relationship analysis revealed patterns I had never seen before. Understanding planetary influences on my love life helped me work on myself and bring harmony back to my relationship.",
    service: "Affair & Relationship",
  },
];

export default function ConsultationTestimonials() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.ct-card');
    const gap = 24;
    const amount = (card ? card.offsetWidth : 300) + gap;
    track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .ct-section {
          position: relative;
          padding: 5rem 0 4rem;
          background: linear-gradient(180deg, var(--bg-color) 0%, rgba(200,131,42,0.03) 50%, var(--bg-color) 100%);
          overflow: hidden;
        }
        .ct-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, var(--accent-color), transparent);
          opacity: 0.05;
        }
        .ct-orb-1 { width: 480px; height: 480px; top: -110px; left: -130px; }
        .ct-orb-2 { width: 360px; height: 360px; bottom: -70px; right: -90px; }

        .ct-header { text-align: center; margin-bottom: 2.5rem; }
        .ct-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent-color);
          background: rgba(200,131,42,0.1);
          border: 1px solid rgba(200,131,42,0.2);
          padding: 5px 16px;
          border-radius: 20px;
          font-family: var(--font-sans);
          margin-bottom: 0.875rem;
        }
        .ct-title {
          font-family: var(--font-serif) !important;
          font-size: var(--h2-size) !important;
          font-weight: 700 !important;
          color: var(--text-heading) !important;
          line-height: 1.25 !important;
          margin: 0.4rem 0 0.6rem !important;
        }
        .ct-subtitle {
          font-size: 0.95rem;
          color: var(--text-content);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* carousel */
        .ct-carousel-wrap {
          position: relative;
        }
        .ct-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 4px;
        }
        .ct-track::-webkit-scrollbar { display: none; }

        .ct-card {
          flex: 0 0 calc((100% - 3rem) / 3);
          scroll-snap-align: start;
          background: var(--card-color);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.75rem 1.5rem 1.4rem;
          position: relative;
          overflow: hidden;
          box-shadow: var(--premium-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .ct-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-color), #e8b96a);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ct-card:hover { transform: translateY(-5px); box-shadow: 0 18px 46px rgba(200,131,42,0.16); }
        .ct-card:hover::after { opacity: 1; }

        .ct-big-quote {
          font-family: Georgia, serif;
          font-size: 3.8rem;
          line-height: 0.7;
          color: var(--accent-color);
          opacity: 0.28;
          font-weight: 900;
          user-select: none;
        }
        .ct-text {
          font-size: 0.9rem;
          color: var(--text-content);
          line-height: 1.8;
          flex: 1;
          margin: 0;
        }
        .ct-stars { display: flex; align-items: center; gap: 3px; }
        .ct-rating-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-left: 5px;
          font-family: var(--font-sans);
        }
        .ct-profile {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px solid var(--glass-border);
        }
        .ct-avatar {
          width: 50px; height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid var(--accent-color);
          flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(200,131,42,0.22);
        }
        .ct-name {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-heading);
          line-height: 1.3;
          margin: 0;
        }
        .ct-loc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
          font-family: var(--font-sans);
        }
        .ct-tag {
          display: inline-block;
          background: rgba(200,131,42,0.08);
          color: var(--accent-color);
          border: 1px solid rgba(200,131,42,0.18);
          border-radius: 20px;
          padding: 3px 12px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: var(--font-sans);
          width: fit-content;
        }

        /* nav buttons */
        .ct-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px; height: 42px;
          background: var(--card-color);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          z-index: 5;
          transition: all 0.2s ease;
          color: var(--text-heading);
        }
        .ct-nav:hover { background: var(--accent-color); color: #fff; border-color: var(--accent-color); transform: translateY(-50%) scale(1.08); }
        .ct-nav-prev { left: -20px; }
        .ct-nav-next { right: -20px; }

        @media (max-width: 991px) {
          .ct-card { flex: 0 0 calc((100% - 1.5rem) / 2); }
          .ct-nav-prev { left: -14px; }
          .ct-nav-next { right: -14px; }
        }
        @media (max-width: 575px) {
          .ct-card { flex: 0 0 88%; }
          .ct-section { padding: 3rem 0 2.5rem; }
          .ct-nav-prev { left: -10px; }
          .ct-nav-next { right: -10px; }
          .ct-nav { width: 36px; height: 36px; }
        }
      `}</style>

      <section className="ct-section">
        <div className="ct-orb ct-orb-1" />
        <div className="ct-orb ct-orb-2" />
        <div className="container">
          <div className="ct-header" data-aos="fade-up">
            <div className="ct-badge">🌟 Client Stories</div>
            <h2 className="ct-title">
              Trusted by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="ct-subtitle">
              Real experiences from people who found clarity, peace, and direction through
              our expert consultations.
            </p>
          </div>

          <div className="ct-carousel-wrap">
            <button className="ct-nav ct-nav-prev" onClick={() => scroll('prev')} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="ct-track" ref={trackRef}>
              {CLIENTS.map((t, i) => (
                <div className="ct-card" key={i}>
                  <div className="ct-big-quote">"</div>
                  <p className="ct-text">{t.text}</p>
                  <div className="ct-stars">
                    {[...Array(5)].map((_, s) => (
                      <i key={s} className="fas fa-star" style={{ color: s < t.rating ? '#F59E0B' : '#D1D5DB', fontSize: '0.85rem' }} />
                    ))}
                    <span className="ct-rating-label">{t.rating}.0</span>
                  </div>
                  <div className="ct-profile">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="ct-avatar"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=C8832A&color=fff`; }}
                    />
                    <div>
                      <div className="ct-name">{t.name}</div>
                      <div className="ct-loc">📍 {t.location}</div>
                    </div>
                  </div>
                  <div className="ct-tag">✦ {t.service}</div>
                </div>
              ))}
            </div>

            <button className="ct-nav ct-nav-next" onClick={() => scroll('next')} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
