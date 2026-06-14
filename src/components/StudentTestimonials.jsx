import React, { useRef } from 'react';

const STUDENTS = [
  {
    name: "Aakash Tripathi",
    location: "Lucknow, UP",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    text: "The Vedic Astrology Deep Dive is outstanding. I learned planetary dashas and yogas in great depth. Real-life case studies in every lesson make the knowledge truly stick forever.",
    course: "Vedic Astrology Deep Dive",
  },
  {
    name: "Sunita Devi Sharma",
    location: "New Delhi",
    img: "https://randomuser.me/api/portraits/women/47.jpg",
    rating: 5,
    text: "I enrolled in the Foundation course and it was life-changing. The way complex concepts are taught so simply is remarkable. Now I can read my own birth chart with full confidence!",
    course: "Foundation in Astrology",
  },
  {
    name: "Arjun Nair",
    location: "Bangalore, Karnataka",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
    text: "KP Astrology Mastery exceeded all expectations. The precision of predictions using the KP system is phenomenal. I've already started helping family members with accurate readings.",
    course: "KP Astrology Mastery",
  },
  {
    name: "Meenakshi Iyer",
    location: "Chennai, Tamil Nadu",
    img: "https://randomuser.me/api/portraits/women/62.jpg",
    rating: 5,
    text: "Completed the Guidance & Counseling course and it transformed how I help people. The blend of ancient wisdom with modern counseling techniques is truly unique and valuable.",
    course: "Astrology for Guidance",
  },
  {
    name: "Rohit Bansal",
    location: "Chandigarh, Punjab",
    img: "https://randomuser.me/api/portraits/men/38.jpg",
    rating: 5,
    text: "Started as a complete beginner and now I confidently analyze charts for my community. Structured curriculum, live sessions, and lifetime access make this institute one of a kind.",
    course: "Foundation in Astrology",
  },
  {
    name: "Priyanka Joshi",
    location: "Pune, Maharashtra",
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5,
    text: "The course content is deep yet very accessible. Acharya ji explains every concept with patience and real examples. I can now confidently interpret divisional charts and planetary yogas.",
    course: "Vedic Astrology Deep Dive",
  },
];

export default function StudentTestimonials() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.st-card');
    const gap = 24;
    const amount = (card ? card.offsetWidth : 300) + gap;
    track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .st-section {
          position: relative;
          padding: 5rem 0 4rem;
          background: var(--bg-color);
          overflow: hidden;
        }
        .st-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, var(--primary-color), transparent);
          opacity: 0.055;
        }
        .st-orb-1 { width: 460px; height: 460px; top: -120px; right: -120px; }
        .st-orb-2 { width: 340px; height: 340px; bottom: -80px; left: -80px; }

        .st-header { text-align: center; margin-bottom: 2.5rem; }
        .st-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary-color);
          background: rgba(139,74,30,0.08);
          border: 1px solid rgba(139,74,30,0.15);
          padding: 5px 16px;
          border-radius: 20px;
          font-family: var(--font-sans);
          margin-bottom: 0.875rem;
        }
        .st-title {
          font-family: var(--font-serif) !important;
          font-size: var(--h2-size) !important;
          font-weight: 700 !important;
          color: var(--text-heading) !important;
          line-height: 1.25 !important;
          margin: 0.4rem 0 0.6rem !important;
        }
        .st-subtitle {
          font-size: 0.95rem;
          color: var(--text-content);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* carousel */
        .st-carousel-wrap {
          position: relative;
        }
        .st-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 4px;
        }
        .st-track::-webkit-scrollbar { display: none; }

        .st-card {
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
        .st-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .st-card:hover { transform: translateY(-5px); box-shadow: 0 18px 46px rgba(139,74,30,0.14); }
        .st-card:hover::after { opacity: 1; }

        .st-big-quote {
          font-family: Georgia, serif;
          font-size: 3.8rem;
          line-height: 0.7;
          color: var(--accent-color);
          opacity: 0.25;
          font-weight: 900;
          user-select: none;
        }
        .st-text {
          font-size: 0.9rem;
          color: var(--text-content);
          line-height: 1.8;
          flex: 1;
          margin: 0;
        }
        .st-stars { display: flex; align-items: center; gap: 3px; }
        .st-rating-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-left: 5px;
          font-family: var(--font-sans);
        }
        .st-profile {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px solid var(--glass-border);
        }
        .st-avatar {
          width: 50px; height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid var(--accent-color);
          flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(200,131,42,0.2);
        }
        .st-name {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-heading);
          line-height: 1.3;
          margin: 0;
        }
        .st-loc {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
          font-family: var(--font-sans);
        }
        .st-tag {
          display: inline-block;
          background: rgba(139,74,30,0.07);
          color: var(--primary-color);
          border: 1px solid rgba(139,74,30,0.14);
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
        .st-nav {
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
        .st-nav:hover { background: var(--primary-color); color: #fff; border-color: var(--primary-color); transform: translateY(-50%) scale(1.08); }
        .st-nav-prev { left: -20px; }
        .st-nav-next { right: -20px; }

        @media (max-width: 991px) {
          .st-card { flex: 0 0 calc((100% - 1.5rem) / 2); }
          .st-nav-prev { left: -14px; }
          .st-nav-next { right: -14px; }
        }
        @media (max-width: 575px) {
          .st-card { flex: 0 0 88%; }
          .st-section { padding: 3rem 0 2.5rem; }
          .st-nav-prev { left: -10px; }
          .st-nav-next { right: -10px; }
          .st-nav { width: 36px; height: 36px; }
        }
      `}</style>

      <section className="st-section">
        <div className="st-orb st-orb-1" />
        <div className="st-orb st-orb-2" />
        <div className="container">
          <div className="st-header" data-aos="fade-up">
            <div className="st-badge">⭐ Student Reviews</div>
            <h2 className="st-title">
              What Our <span className="text-gradient">Students Say</span>
            </h2>
            <p className="st-subtitle">
              Hundreds of students have transformed their understanding of life through our
              astrology courses.
            </p>
          </div>

          <div className="st-carousel-wrap">
            <button className="st-nav st-nav-prev" onClick={() => scroll('prev')} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="st-track" ref={trackRef}>
              {STUDENTS.map((t, i) => (
                <div className="st-card" key={i}>
                  <div className="st-big-quote">"</div>
                  <p className="st-text">{t.text}</p>
                  <div className="st-stars">
                    {[...Array(5)].map((_, s) => (
                      <i key={s} className="fas fa-star" style={{ color: s < t.rating ? '#F59E0B' : '#D1D5DB', fontSize: '0.85rem' }} />
                    ))}
                    <span className="st-rating-label">{t.rating}.0</span>
                  </div>
                  <div className="st-profile">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="st-avatar"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=8B4A1E&color=fff`; }}
                    />
                    <div>
                      <div className="st-name">{t.name}</div>
                      <div className="st-loc">📍 {t.location}</div>
                    </div>
                  </div>
                  <div className="st-tag">✦ {t.course}</div>
                </div>
              ))}
            </div>

            <button className="st-nav st-nav-next" onClick={() => scroll('next')} aria-label="Next">
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
