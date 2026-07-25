import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_HEADER,
  WB_SIDE_NAV,
  WB_SIDE_NAV_HIDDEN,
  WB_SLIDER_TRACK,
  WB_SUBTITLE,
  WB_TITLE,
  WB_UNDERLINE,
  TYPE,
} from '../webinar/tokens';

const textReviews = [
  {
    id: 1,
    text: 'Maine apne office colleague ka face read kiya — sab kuch match hua! Can’t believe this works so accurately.',
    author: 'Neha Verma',
    role: 'HR Professional',
  },
  {
    id: 2,
    text: 'Damini Shukla’s teaching is so simple. No complicated terms, just pure observation. I could instantly read my family members.',
    author: 'Rohit Sharma',
    role: 'Business Owner',
  },
  {
    id: 3,
    text: 'This masterclass completely changed how I interact with people. I can now understand if someone is genuine or faking it within seconds.',
    author: 'Priya Desai',
    role: 'Sales Executive',
  },
  {
    id: 4,
    text: 'The 160+ snapshot technique is mind-blowing. I never knew a person’s face could reveal so much about their personality.',
    author: 'Karan Singh',
    role: 'Student',
  },
  {
    id: 5,
    text: 'I was always interested in psychology, but this ancient science of Samudrika Shastra took my understanding to another level. Highly recommended!',
    author: 'Ananya Gupta',
    role: 'Psychology Enthusiast',
  }
];

const TextReviewCarousel = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const amount = containerRef.current.clientWidth * 0.7;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = null; checkScroll(); });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    checkScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className={`${WB_SECTION} border-t border-slate-200 bg-slate-50`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_HEADER} text-center`}>
          <h5 className={WB_SUBTITLE}>Wall of Love / Success Stories</h5>
          <h2 className={WB_TITLE}>
            Words from our <span className={WB_HIGHLIGHT}>Community</span>
          </h2>
          <div className={WB_UNDERLINE} />
        </div>

        <div className="relative px-0 md:px-8">
          <button
            type="button"
            className={`${WB_SIDE_NAV} left-0 ${!canScrollLeft ? WB_SIDE_NAV_HIDDEN : ''}`}
            onClick={() => scroll('left')}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`${WB_SIDE_NAV} right-0 ${!canScrollRight ? WB_SIDE_NAV_HIDDEN : ''}`}
            onClick={() => scroll('right')}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>

          <div className="overflow-hidden">
            <div ref={containerRef} className={WB_SLIDER_TRACK}>
              {textReviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="relative flex min-w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#EE6662] hover:shadow-md sm:min-w-[340px] sm:p-7"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="pointer-events-none absolute right-6 top-2 font-serif text-6xl leading-none text-[#EE6662] opacity-[0.07] sm:text-7xl">
                    &ldquo;
                  </div>
                  <p className={`${TYPE.body} relative z-[1] mb-6`}>{review.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3B2261] font-body text-base font-extrabold text-white shadow-sm sm:h-12 sm:w-12">
                      {review.author[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="!m-0 font-body !text-sm !font-bold !text-[#3B2261] sm:!text-base">
                        {review.author}
                      </span>
                      <span className="!m-0 font-body !text-xs !font-semibold !text-[#EE6662] sm:!text-sm">
                        {review.role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextReviewCarousel;
