import { motion } from 'framer-motion';

const newsItems = [
  { name: 'Aaj Tak', logo: '/images/5005806.png' },
  { name: 'Outlook', logo: '/images/5005810.png' },
  { name: 'LatestLy', logo: '/images/5005814.png' },
  { name: 'News18', logo: '/images/5005820.png' },
  { name: 'Zee News', logo: '/images/5005825.png' },
  { name: 'Hindustan Times', logo: '/images/5005830.png' },
];

const NewsCarousel = () => {
  return (
    <div className="news-carousel-section">
      <div className="container">
        <h4 className="news-heading">AS FEATURED IN</h4>
        <div className="news-track-wrapper">
          <motion.div
            className="news-track"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...newsItems, ...newsItems].map((item, index) => (
              <div key={index} className="news-item">
                <img src={item.logo} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <style>{`
        .news-carousel-section {
          padding: 60px 0;
          background: #0b1220;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .news-heading {
          text-align: center;
          font-size: 0.9rem;
          color: #ff6a00;
          letter-spacing: 4px;
          font-weight: 800;
          margin-bottom: 40px;
          text-transform: uppercase;
        }
        .news-track-wrapper {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .news-track {
          display: flex;
          gap: 80px;
          align-items: center;
          width: max-content;
        }
        .news-item {
          display: flex;
          align-items: center;
          gap: 15px;
          opacity: 0.7;
          transition: 0.3s;
          cursor: pointer;
        }
        .news-item:hover {
          opacity: 1;
          transform: translateY(-5px);
        }
        .news-item img {
          height: 40px;
          width: auto;
          filter: grayscale(1) invert(1);
        }
        .news-item span {
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default NewsCarousel;
