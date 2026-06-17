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
} from './tokens';

const textReviews = [
  {
    id: 1,
    text: 'This webinar completely changed my perspective on career. The remedies provided were so simple yet effective. Thank you DS Astrology!',
    author: 'Siddharth Jain',
    role: 'Software Engineer',
  },
  {
    id: 2,
    text: 'I was skeptical at first, but the depth of knowledge shared in just 2 days was mind-blowing. Highly recommended for everyone.',
    author: 'Megha Malhotra',
    role: 'Business Owner',
  },
  {
    id: 3,
    text: 'The way complex astrological concepts were explained made it so easy to understand. I finally know why certain patterns repeat in my life.',
    author: 'Vikram Singh',
    role: 'Creative Designer',
  },
  {
    id: 4,
    text: "Professional, insightful, and truly life-altering. Best investment of ₹99 I've ever made. The Q&A session was very helpful.",
    author: 'Anjali Deshmukh',
    role: 'Homemaker',
  },
  {
    id: 5,
    text: 'Truly a cosmic experience! The practical tips on birth chart reading were the highlight for me. Already seeing positive changes.',
    author: 'Rohan Khanna',
    role: 'Marketing Head',
  },
  {
    id: 6,
    text: 'A must-attend for anyone lost in their life path. The instructor is extremely knowledgeable and patient with all questions.',
    author: 'Sanya Gupta',
    role: 'Artist',
  },
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
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
    return undefined;
  }, []);

  return (
    <section className={`${WB_SECTION} border-t border-slate-200 bg-slate-50`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_HEADER} text-center`}>
          <h5 className={WB_SUBTITLE}>Wall of Love</h5>
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
                  className="relative flex min-w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-orange-500 hover:shadow-md sm:min-w-[340px] sm:p-7"
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
