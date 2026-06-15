import { motion } from 'framer-motion';
import { WB_WRAP, TYPE } from './tokens';

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
    <div className="border-y border-white/5 bg-[#0b1220] py-10 sm:py-12">
      <div className={WB_WRAP}>
        <h4 className={`${TYPE.kicker} mb-6 text-center !text-orange-500 sm:mb-8`}>
          AS FEATURED IN
        </h4>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            className="flex w-max items-center gap-12 sm:gap-16"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...newsItems, ...newsItems].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex cursor-pointer items-center gap-3 opacity-70 transition hover:-translate-y-0.5 hover:opacity-100"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-8 w-auto invert grayscale sm:h-9"
                />
                <span className="!m-0 whitespace-nowrap font-body !text-sm !font-bold !text-white sm:!text-base">
                  {item.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;
