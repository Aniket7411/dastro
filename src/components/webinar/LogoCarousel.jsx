import { motion } from 'framer-motion';

const logos = [
  '/images/10350949.png',
  '/images/10350961.png',
  '/images/10350969.png',
  '/images/1408347.png',
  '/images/3013143.png',
  '/images/3201854.png',
  '/images/3776970.png',
  '/images/47148.png',
];

const LogoCarousel = () => {
  return (
    <div className="logo-carousel-container">
      <div className="logo-carousel-track">
        <motion.div
          className="logo-carousel-list"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="logo-item">
              <img src={logo} alt={`Partner ${index}`} />
            </div>
          ))}
        </motion.div>
      </div>
      <style>{`
        .logo-carousel-container {
          padding: 40px 0;
          background: rgba(255, 255, 255, 0.02);
          overflow: hidden;
          position: relative;
        }
        .logo-carousel-track {
          max-width: var(--container-public);
          margin: 0 auto;
          padding-left: var(--page-pad-x);
          padding-right: var(--page-pad-x);
          position: relative;
        }
        .logo-carousel-track::before,
        .logo-carousel-track::after {
          content: "";
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
        }
        .logo-carousel-track::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }
        .logo-carousel-track::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }
        .logo-carousel-list {
          display: flex;
          gap: 60px;
          align-items: center;
          width: max-content;
        }
        .logo-item {
          flex: 0 0 auto;
          width: 120px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: grayscale(1) brightness(2) contrast(0.5);
          opacity: 0.6;
          transition: 0.3s;
        }
        .logo-item:hover {
          filter: grayscale(0) brightness(1);
          opacity: 1;
        }
        .logo-item img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;
