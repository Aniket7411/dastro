import { motion } from 'framer-motion';
import { WB_WRAP } from './tokens';

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
    <div className="relative overflow-hidden bg-white/[0.02] py-8 sm:py-10">
      <div className={`${WB_WRAP} relative`}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-16 bg-gradient-to-r from-[#F8FAFC] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-16 bg-gradient-to-l from-[#F8FAFC] to-transparent sm:w-28" />
        <motion.div
          className="flex w-max items-center gap-10 sm:gap-14"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex h-12 w-24 shrink-0 items-center justify-center opacity-60 grayscale brightness-200 contrast-50 transition hover:opacity-100 hover:grayscale-0 hover:brightness-100 sm:h-14 sm:w-[7.5rem]"
            >
              <img
                src={logo}
                alt={`Partner ${index}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LogoCarousel;
