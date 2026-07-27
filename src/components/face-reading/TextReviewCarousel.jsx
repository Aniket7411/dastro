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
    text: 'Sab kuch match hua! Can’t believe this works so accurately.',
    author: 'Neha Verma',
    role: 'HR Professional',
    avatar: '/images/avatars/neha.png'
  },
  {
    id: 2,
    text: 'Damini Shukla’s teaching is so simple. I could instantly read my family members.',
    author: 'Rohit Sharma',
    role: 'Business Owner',
    avatar: '/images/avatars/rohit.png'
  },
  {
    id: 3,
    text: 'I can now understand if someone is genuine or faking it within seconds.',
    author: 'Priya Desai',
    role: 'Sales Executive',
    avatar: '/images/avatars/priya.png'
  },
  {
    id: 4,
    text: 'The 160+ snapshot technique is mind-blowing.',
    author: 'Karan Singh',
    role: 'Student',
    avatar: '/images/avatars/karan.png'
  },
  {
    id: 5,
    text: 'This ancient science of Samudrika Shastra took my understanding to another level. Highly recommended!',
    author: 'Ananya Gupta',
    role: 'Psychology Enthusiast',
    avatar: '/images/avatars/ananya.png'
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
                  whileHover={{ scale: 1.01 }}
                  className="flex w-[18rem] sm:w-[22rem] lg:w-[24rem] shrink-0 snap-start flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative">
                    <i className="fas fa-quote-right absolute -right-2 -top-2 text-4xl text-slate-100 opacity-50" />
                    <p className={`${TYPE.body} relative z-10 font-medium text-slate-600`}>
                      "{review.text}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 shadow-sm">
                      <img src={review.avatar} alt={review.author} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-[#3B2261]">
                        {review.author}
                      </h4>
                      <p className="font-body text-sm font-medium text-[#EE6662]">
                        {review.role}
                      </p>
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
