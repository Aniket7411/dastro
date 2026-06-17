import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const videoReviews = [
  {
    id: 1,
    poster: '/images/bg-bannerpic.jpg',
    title: 'Life Changing Experience',
    name: 'Rahul Sharma',
    color: '#ff6a00',
    videoUrl: '/videohomefinal.mp4',
  },
  {
    id: 2,
    poster: '/images/horocurty.jpg',
    title: 'Amazing Vedic Insights',
    name: 'Priya Verma',
    color: '#ff0080',
    videoUrl: '/videohomefinal.mp4',
  },
  {
    id: 3,
    poster: '/images/ruiy-img01.jpg',
    title: 'Highly Recommend for Clarity',
    name: 'Anil Kapoor',
    color: '#7000ff',
    videoUrl: '/videohomefinal.mp4',
  },
  {
    id: 4,
    poster: '/images/middle-img.png',
    title: 'Best Astrology Session',
    name: 'Sneha Gupta',
    color: '#00d4ff',
    videoUrl: '/videohomefinal.mp4',
  },
  {
    id: 5,
    poster: '/images/bg-bannerpic.jpg',
    title: 'Deep Spiritual Knowledge',
    name: 'Amit Trivedi',
    color: '#ff6a00',
    videoUrl: '/videohomefinal.mp4',
  },
  {
    id: 6,
    poster: '/images/horocurty.jpg',
    title: 'Clear Guidance for Career',
    name: 'Neha Sharma',
    color: '#ff0080',
    videoUrl: '/videohomefinal.mp4',
  },
];

const VideoReviewCarousel = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
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
    <section className={`${WB_SECTION} relative overflow-hidden bg-white`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_HEADER} text-center`}>
          <h5 className={WB_SUBTITLE}>Real Impact</h5>
          <h2 className={WB_TITLE}>
            Success <span className={WB_HIGHLIGHT}>Stories</span>
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
              {videoReviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="min-w-[220px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 sm:min-w-[240px]"
                  whileHover={{ y: -6 }}
                  onClick={() => setActiveVideo(review)}
                >
                  <div className="group relative h-28 overflow-hidden sm:h-32">
                    <img
                      src={review.poster}
                      alt={review.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#3B2261]/40 to-transparent opacity-80 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-sm text-white shadow-lg transition group-hover:scale-105"
                        style={{ backgroundColor: review.color }}
                      >
                        <i className="fas fa-play" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 font-body text-[0.625rem] font-bold text-white backdrop-blur">
                      Student Story
                    </div>
                  </div>
                  <div className="p-3 sm:p-3.5">
                    <div className="mb-2 flex gap-0.5 text-[0.625rem] text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className="fas fa-star" aria-hidden="true" />
                      ))}
                    </div>
                    <h3 className={`${TYPE.h3} mb-3`}>{review.title}</h3>
                    <div className="flex flex-col gap-0.5">
                      <span className="!m-0 font-body !text-sm !font-bold !text-[#3B2261]">
                        {review.name}
                      </span>
                      <span className="!m-0 flex items-center gap-1 font-body !text-[0.6875rem] !font-bold !text-[#EE6662]">
                        <i className="fas fa-check-double" aria-hidden="true" />
                        Verified Student
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-orange-500/30 bg-[#0b1220] shadow-[0_0_80px_rgba(255,106,0,0.18)]"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-0 bg-black/50 text-2xl leading-none text-white"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
              >
                &times;
              </button>
              <div className="w-full bg-black">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="block aspect-video w-full"
                  poster={activeVideo.poster}
                />
                <div className="bg-gradient-to-r from-[#0b1220] to-[#070913] px-5 py-4 sm:px-6">
                  <h4 className="!m-0 font-heading !text-lg !font-extrabold !text-white sm:!text-xl">
                    {activeVideo.name}&apos;s Transformation
                  </h4>
                  <p className="!m-0 mt-1 font-body !text-sm !font-bold !text-orange-500 sm:!text-[0.9375rem]">
                    {activeVideo.title}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoReviewCarousel;
