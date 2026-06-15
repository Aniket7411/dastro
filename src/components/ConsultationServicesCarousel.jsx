import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const CONSULTATION_SERVICE_SLIDES = [
  {
    title: 'Career Consultation',
    img: '/images/consultations/career.png',
    desc: 'Jobs, promotions, business growth & foreign opportunities.',
    duration: '30–40 min',
    price: '₹3600',
    link: '/consultations/career',
  },
  {
    title: 'Education Guidance',
    img: '/images/consultations/education.png',
    desc: 'Study paths, exams, higher education & academic success.',
    duration: '30 min',
    price: '₹3600',
    link: '/consultations/other',
  },
  {
    title: 'Health & Wellness',
    img: '/images/consultations/health.png',
    desc: 'Planetary insights for recovery, vitality & emotional balance.',
    duration: '30–40 min',
    price: '₹3400',
    link: '/consultations/other',
  },
  {
    title: 'Love & Relationship',
    img: '/images/consultations/love.png',
    desc: 'Compatibility, loyalty, marriage timing & relationship clarity.',
    duration: '30–40 min',
    price: '₹3400',
    link: '/consultations/relationship',
  },
  {
    title: 'Vastu Consultation',
    img: '/images/consultations/vastu.png',
    desc: 'Home & workspace harmony for prosperity and peace.',
    duration: '45 min',
    price: '₹3600',
    link: '/consultations/other',
  },
];

function stopCarouselPointer(e) {
  e.stopPropagation();
}

function ServiceSlide({ item, onBook }) {
  return (
    <article className="csc-card">
      <Link
        to={item.link}
        className="csc-img-link"
        tabIndex={-1}
        aria-hidden
      >
        <div className="csc-img-wrap">
          <img src={item.img} alt="" loading="lazy" decoding="async" draggable={false} />
          <span className="csc-duration">{item.duration}</span>
          <span className="csc-price">{item.price}</span>
        </div>
      </Link>
      <div className="csc-body">
        <h3 className="csc-title">{item.title}</h3>
        <p className="csc-desc">{item.desc}</p>
        <div className="csc-actions">
          <Link to={item.link} className="csc-btn csc-btn--outline" onPointerDown={stopCarouselPointer}>
            View
          </Link>
          <button
            type="button"
            className="csc-btn csc-btn--primary"
            onPointerDown={stopCarouselPointer}
            onClick={() => onBook?.(item)}
          >
            Request callback
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ConsultationServicesCarousel({ onBook }) {
  const [held, setHeld] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const slides = [...CONSULTATION_SERVICE_SLIDES, ...CONSULTATION_SERVICE_SLIDES];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pauseOnHold = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('a, button')) return;
    setHeld(true);
  }, []);

  const resume = useCallback(() => {
    setHeld(false);
  }, []);

  return (
    <div
      className={`csc-section${held ? ' csc-section--held' : ''}${reduceMotion ? ' csc-section--static' : ''}`}
      aria-label="Consultation services carousel"
    >
      <div
        className="csc-viewport"
        onPointerDown={pauseOnHold}
        onPointerUp={resume}
        onPointerCancel={resume}
        onPointerLeave={resume}
      >
        <div className="csc-track">
          {slides.map((item, index) => (
            <ServiceSlide key={`${item.title}-${index}`} item={item} onBook={onBook} />
          ))}
        </div>
      </div>

      <style>{`
        .csc-section {
          margin: 0 0 2.75rem;
          position: relative;
          touch-action: pan-y;
        }

        .csc-viewport {
          overflow: hidden;
          position: relative;
          touch-action: pan-y;
          cursor: grab;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 6%,
            #000 94%,
            transparent 100%
          );
        }

        .csc-section--held .csc-viewport {
          cursor: grabbing;
        }

        .csc-viewport::before,
        .csc-viewport::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(1.5rem, 4vw, 3.5rem);
          z-index: 2;
          pointer-events: none;
        }

        .csc-viewport::before {
          left: 0;
          background: linear-gradient(to right, #fffbf5 10%, transparent);
        }

        .csc-viewport::after {
          right: 0;
          background: linear-gradient(to left, #fffbf5 10%, transparent);
        }

        .csc-track {
          display: flex;
          gap: 1.25rem;
          width: max-content;
          padding: 0.35rem 0 0.75rem;
          animation: csc-marquee-rtl 42s linear infinite;
          will-change: transform;
        }

        .csc-section--held .csc-track {
          animation-play-state: paused;
        }

        @media (hover: hover) and (pointer: fine) {
          .csc-section:hover .csc-track {
            animation-play-state: paused;
          }

          .csc-card:hover {
            transform: translateY(-6px);
            border-color: rgba(200, 131, 42, 0.45);
            box-shadow: 0 18px 40px rgba(200, 131, 42, 0.16);
          }

          .csc-card:hover .csc-img-wrap img {
            transform: scale(1.06);
          }
        }

        @keyframes csc-marquee-rtl {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .csc-card {
          flex: 0 0 auto;
          width: clamp(15.5rem, 28vw, 18.5rem);
          background: #fff;
          border-radius: 1.25rem;
          overflow: hidden;
          border: 1px solid rgba(139, 74, 30, 0.1);
          box-shadow: 0 10px 28px rgba(42, 15, 2, 0.07);
          display: flex;
          flex-direction: column;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          touch-action: manipulation;
        }

        .csc-img-link {
          display: block;
          text-decoration: none;
        }

        .csc-img-wrap {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #2a0f02;
        }

        .csc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
          -webkit-user-drag: none;
          user-select: none;
          pointer-events: none;
        }

        .csc-duration,
        .csc-price {
          position: absolute;
          font-family: var(--font-price, 'DM Sans', sans-serif);
          font-size: 0.65rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
          color: #fff;
          background: rgba(42, 15, 2, 0.78);
          backdrop-filter: blur(6px);
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          pointer-events: none;
        }

        .csc-duration {
          bottom: 0.65rem;
          left: 0.65rem;
        }

        .csc-price {
          top: 0.65rem;
          right: 0.65rem;
          background: linear-gradient(135deg, #c8832a, #8b4a1e);
        }

        .csc-body {
          padding: 1rem 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.45rem;
        }

        .csc-title {
          margin: 0;
          font-family: var(--font-heading, 'Playfair Display', serif);
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.25;
          color: #2a0f02;
        }

        .csc-desc {
          margin: 0;
          flex: 1;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: 0.78rem;
          line-height: 1.55;
          color: #5c3d26;
        }

        .csc-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.35rem;
        }

        .csc-btn {
          flex: 1;
          min-height: 2.125rem;
          border-radius: 999px;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          touch-action: manipulation;
        }

        .csc-btn--outline {
          border: 1.5px solid rgba(139, 74, 30, 0.22);
          background: transparent;
          color: #2a0f02;
        }

        .csc-btn--outline:hover {
          border-color: #c8832a;
          color: #8b4a1e;
        }

        .csc-btn--primary {
          border: 0;
          background: linear-gradient(135deg, #c8832a, #d4922e);
          color: #fff;
          box-shadow: 0 4px 14px rgba(200, 131, 42, 0.28);
        }

        .csc-btn--primary:hover {
          background: linear-gradient(135deg, #d4922e, #8b4a1e);
        }

        @media (max-width: 767px) {
          .csc-section {
            margin-bottom: 2rem;
          }

          .csc-track {
            gap: 1rem;
            animation-duration: 32s;
          }

          .csc-card {
            width: 16.5rem;
          }
        }

        .csc-section--static .csc-track {
          animation: none;
          transform: none;
          will-change: auto;
          overflow-x: auto;
          scroll-snap-type: x proximity;
          scrollbar-width: none;
          max-width: 100%;
        }

        .csc-section--static .csc-viewport {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          mask-image: none;
          -webkit-mask-image: none;
          cursor: auto;
        }

        .csc-section--static .csc-viewport::-webkit-scrollbar {
          display: none;
        }

        .csc-section--static .csc-card {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}
