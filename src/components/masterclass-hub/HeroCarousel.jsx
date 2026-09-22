import { useEffect, useRef, useState } from 'react';
import { MASTERCLASSES } from '../../data/masterclassHubData';

const AUTO_ADVANCE_MS = 5000;

function HeroCarousel({ activeId, onSelect, onJoinNow }) {
  const activeIndex = MASTERCLASSES.findIndex((mc) => mc.id === activeId);
  const index = activeIndex === -1 ? 0 : activeIndex;
  const active = MASTERCLASSES[index];
  const [isPaused, setIsPaused] = useState(false);

  const goTo = (nextIndex) => {
    const wrapped = (nextIndex + MASTERCLASSES.length) % MASTERCLASSES.length;
    onSelect(MASTERCLASSES[wrapped].id);
  };

  // Preload every slide's image up front so switching slides never shows a blank/loading gap.
  useEffect(() => {
    MASTERCLASSES.forEach((mc) => {
      const img = new window.Image();
      img.src = mc.image;
    });
  }, []);

  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReduced) return undefined;
    const id = window.setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused]);

  return (
    <div
      className="mx-auto mt-5 max-w-5xl sm:mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-aos="fade-up"
      data-aos-delay="150"
    >
      <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#EE6662] sm:mb-2.5 sm:text-xs">
        Masterclasses
      </p>

      <div className="grid grid-cols-1 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(59,34,97,0.12)] sm:rounded-[28px] lg:grid-cols-2">
        <div key={`${active.id}-image`} className="hub-carousel-fade relative aspect-video w-full overflow-hidden bg-slate-50">
          <img
            src={active.image}
            alt={active.title}
            className="absolute inset-0 h-full w-full object-contain"
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
          <div className="absolute left-3 top-3 rounded-full bg-[#3B2261]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            2-Day Masterclass
          </div>
        </div>

        <div key={`${active.id}-content`} className="hub-carousel-fade flex flex-col justify-center gap-2 p-4 sm:gap-2.5 sm:p-5 lg:p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EE6662]/10 text-[#EE6662]">
            <i className={`fas ${active.icon}`} aria-hidden="true" />
          </div>
          <h3 className="font-heading text-[19px] font-extrabold leading-tight text-[#3B2261] sm:text-[24px]">{active.tagline}</h3>
          <p className="text-[13px] leading-snug text-slate-600 sm:text-[14px]">{active.hook}</p>

          <ul className="flex flex-col gap-1.5">
            {active.highlights.map((point) => (
              <li key={point} className="flex items-start gap-2 text-[12.5px] font-semibold leading-snug text-slate-700 sm:text-[13.5px]">
                <span className="mt-0.5 flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-green-100">
                  <i className="fa fa-check text-[8px] text-green-600" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onJoinNow(active.id)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[10px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(238,102,98,0.28)] transition hover:-translate-y-0.5"
            >
              Reserve Seat — ₹499
            </button>
            <span className="text-[11px] font-semibold text-slate-400 line-through">₹1,999</span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
            <div className="flex items-center gap-1.5">
              {MASTERCLASSES.map((mc, i) => (
                <button
                  key={mc.id}
                  type="button"
                  aria-label={`Show ${mc.title}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#EE6662]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous masterclass"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#EE6662] hover:text-[#EE6662]"
              >
                <i className="fas fa-chevron-left text-[11px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next masterclass"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#EE6662] hover:text-[#EE6662]"
              >
                <i className="fas fa-chevron-right text-[11px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hub-carousel-fade { animation: hubCarouselFade .45s ease; }
        @keyframes hubCarouselFade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .hub-carousel-fade { animation: none; } }
      `}</style>
    </div>
  );
}

export default HeroCarousel;
