import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videoReviews = [
  { id: 1, poster: '/images/bg-bannerpic.jpg', title: 'Life Changing Experience', name: 'Rahul Sharma', color: '#ff6a00', videoUrl: '/videohomefinal.mp4' },
  { id: 2, poster: '/images/horocurty.jpg', title: 'Amazing Vedic Insights', name: 'Priya Verma', color: '#ff0080', videoUrl: '/videohomefinal.mp4' },
  { id: 3, poster: '/images/ruiy-img01.jpg', title: 'Highly Recommend for Clarity', name: 'Anil Kapoor', color: '#7000ff', videoUrl: '/videohomefinal.mp4' },
  { id: 4, poster: '/images/middle-img.png', title: 'Best Astrology Session', name: 'Sneha Gupta', color: '#00d4ff', videoUrl: '/videohomefinal.mp4' },
  { id: 5, poster: '/images/bg-bannerpic.jpg', title: 'Deep Spiritual Knowledge', name: 'Amit Trivedi', color: '#ff6a00', videoUrl: '/videohomefinal.mp4' },
  { id: 6, poster: '/images/horocurty.jpg', title: 'Clear Guidance for Career', name: 'Neha Sharma', color: '#ff0080', videoUrl: '/videohomefinal.mp4' },
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
        behavior: 'smooth'
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
  }, []);

  return (
    <section className="video-reviews-section">
      <div className="container">
        <div className="section-header-centered text-center">
          <h5 className="section-subtitle">Real Impact</h5>
          <h2 className="section-title">Success <span className="text-highlight">Stories</span></h2>
          <div className="header-underline mx-auto mt-3"></div>
        </div>

        <div className="production-slider-wrapper">
          {/* Side Navigation Buttons */}
          <button 
            className={`side-nav-btn prev ${!canScrollLeft ? 'hidden' : ''}`} 
            onClick={() => scroll('left')}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            className={`side-nav-btn next ${!canScrollRight ? 'hidden' : ''}`} 
            onClick={() => scroll('right')}
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="slider-container-fluid">
            <div className="slider-track" ref={containerRef}>
              {videoReviews.map((review) => (
                <motion.div 
                  key={review.id} 
                  className="video-story-card"
                  whileHover={{ y: -8 }}
                  onClick={() => setActiveVideo(review)}
                >
                  <div className="card-media-wrapper">
                    <img src={review.poster} alt={review.title} className="story-poster" />
                    <div className="glass-overlay">
                      <div className="play-circle" style={{ backgroundColor: review.color }}>
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                    <div className="story-tag">Student Story</div>
                  </div>
                  <div className="card-info">
                    <div className="stars">
                      {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star"></i>)}
                    </div>
                    <h3>{review.title}</h3>
                    <div className="author-row">
                      <div className="author-meta">
                        <span className="author-name">{review.name}</span>
                        <span className="author-status">
                          <i className="fas fa-check-double"></i> Verified Student
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            className="premium-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              className="premium-modal-box"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setActiveVideo(null)}>&times;</button>
              <div className="video-player-container">
                <video 
                  src={activeVideo.videoUrl} 
                  controls 
                  autoPlay 
                  className="modal-video-element"
                  poster={activeVideo.poster}
                ></video>
                <div className="video-caption">
                  <h4>{activeVideo.name}'s Transformation</h4>
                  <p>{activeVideo.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .video-reviews-section {
          padding: 100px 0;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .section-header-centered {
          margin-bottom: 60px;
        }
        .section-subtitle { color: var(--brand-coral, #EE6662); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 12px; font-weight: 800; font-size: 0.85rem; display: block; }
        .section-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: var(--brand-purple, #3B2261); margin: 0; }
        .header-underline { height: 4px; width: 60px; background: var(--brand-coral, #EE6662); border-radius: 2px; }

        .production-slider-wrapper {
          position: relative;
          padding: 0 40px;
        }

        .side-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: var(--brand-purple, #3B2261);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
          font-size: 1.1rem;
          z-index: 10;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .side-nav-btn.prev { left: 0; }
        .side-nav-btn.next { right: 0; }
        .side-nav-btn:hover {
          background: var(--brand-coral, #EE6662);
          border-color: var(--brand-coral, #EE6662);
          color: #fff;
          box-shadow: 0 0 20px rgba(238, 102, 98, 0.4);
        }
        .side-nav-btn.hidden { opacity: 0; pointer-events: none; }

        .slider-container-fluid {
          overflow: hidden;
        }
        .slider-track {
          display: flex;
          gap: 25px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 15px 0 35px;
          -ms-overflow-style: none;
        }
        .slider-track::-webkit-scrollbar { display: none; }

        .video-story-card {
          min-width: 310px;
          scroll-snap-align: start;
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .card-media-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
        }
        .story-poster { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
        .video-story-card:hover .story-poster { transform: scale(1.1); }
        
        .glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(59, 34, 97, 0.4), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: 0.3s;
        }
        .video-story-card:hover .glass-overlay { opacity: 1; background: rgba(7, 9, 19, 0.4); }
        
        .play-circle {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
          transition: 0.4s;
        }
        .video-story-card:hover .play-circle { transform: scale(1.1); box-shadow: 0 0 40px rgba(255, 106, 0, 0.5); }
        
        .story-tag {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .card-info { padding: 22px; }
        .stars { color: #ffc107; font-size: 0.75rem; margin-bottom: 12px; display: flex; gap: 3px; }
        .card-info h3 { font-size: 1.05rem; font-weight: 800; color: var(--brand-purple, #3B2261); margin-bottom: 15px; line-height: 1.4; }
        
        .author-meta { display: flex; flex-direction: column; gap: 3px; }
        .author-name { font-weight: 700; color: var(--brand-purple, #3B2261); font-size: 1rem; }
        .author-status { font-size: 0.7rem; color: var(--brand-coral, #EE6662); font-weight: 700; display: flex; align-items: center; gap: 6px; }

        /* Modal Upgrade */
        .premium-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(15px);
        }
        .premium-modal-box {
          width: 100%;
          max-width: 900px;
          background: #0b1220;
          border-radius: 30px;
          border: 1px solid rgba(255, 106, 0, 0.3);
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 100px rgba(255, 106, 0, 0.2);
        }
        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 25px;
          background: rgba(0,0,0,0.5);
          border: none;
          color: #fff;
          font-size: 2.5rem;
          cursor: pointer;
          z-index: 10;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .video-player-container {
          width: 100%;
          background: #000;
        }
        .modal-video-element {
          width: 100%;
          display: block;
          aspect-ratio: 16/9;
        }
        .video-caption {
          padding: 25px 35px;
          background: linear-gradient(to right, #0b1220, #070913);
        }
        .video-caption h4 { color: #fff; font-size: 1.4rem; font-weight: 800; margin-bottom: 5px; }
        .video-caption p { color: #ff6a00; font-weight: 700; font-size: 1rem; }

        @media (max-width: 768px) {
          .video-story-card { min-width: 280px; }
          .side-nav-btn { display: none; }
          .production-slider-wrapper { padding: 0; }
          .card-media-wrapper { height: 170px; }
          .video-reviews-section { padding: 80px 0; }
        }
      `}</style>
    </section>
  );
};

export default VideoReviewCarousel;
