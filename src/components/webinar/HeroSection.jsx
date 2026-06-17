import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_PURPLE,
  WB_BADGE,
  WB_BADGE_ICON,
  WB_INSTRUCTOR_BADGE,
  WB_TITLE_HERO,
  WB_SECTION_HERO,
  WB_STACK,
  WB_CTA_ROW,
  WB_CARD,
  WB_INFO_CARD,
  TYPE,
} from './tokens';
import WebinarActionButtons from './WebinarActionButtons';

function HeroSection({ onJoinNow, onJoinFree }) {
  const infoCards = [
    { icon: 'fa-calendar-day', label: 'Date', value: '25th – 26th April' },
    { icon: 'fa-clock', label: 'Time:', value: '1:00 PM' },
    { icon: 'fa-hourglass-half', label: 'Duration:', value: '4 Hours' },
    { icon: 'fa-laptop', label: 'Format:', value: '2 days Webinar' },
  ];

  return (
    <section className={`relative ${WB_SECTION_HERO}`}>
      <div className={WB_WRAP}>
        <div className="mb-4 flex justify-center sm:mb-5" data-aos="fade-up">
          <div className={WB_BADGE}>
            <span className={WB_BADGE_ICON}>
              <i className="fas fa-calendar-alt" aria-hidden="true" />
            </span>
            2-Days Mega Astrology Webinar — ₹99
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl text-center" data-aos="fade-up">
          <h1 className={`wb-hero-title ${WB_TITLE_HERO}`}>
            Remove <span className={WB_HIGHLIGHT}>Uncertainty</span> from Your{' '}
            <span className={WB_HIGHLIGHT}>Career, Relationships and Finances</span> using{' '}
            <span className={WB_PURPLE}>Astrology</span>
          </h1>
        </div>

        <div className={`${WB_STACK} grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6`}>
          <div
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 shadow-md lg:max-w-none"
            data-aos="fade-right"
          >
            <video
              src="/videohomefinal.mp4"
              controls
              poster="/images/bg-bannerpic.jpg"
              className="block max-h-[220px] w-full object-cover sm:max-h-[260px] lg:max-h-[280px]"
            />
            <div className="absolute bottom-0 left-0 z-[5] w-full bg-[#3B2261]/95 px-3 py-1.5 font-body text-[0.625rem] font-bold uppercase tracking-[0.08em] text-white sm:px-4 sm:py-2 sm:text-[0.6875rem]">
              BY – ASTRO AVA
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {infoCards.map((card) => (
                <div key={card.label} className={WB_INFO_CARD}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EE6662] text-sm sm:h-9 sm:w-9 sm:text-base">
                    <i className={`fas ${card.icon}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={TYPE.h4}>{card.label}</h4>
                    <p className="!m-0 font-body !text-xs !font-bold !text-white sm:!text-sm">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${WB_CARD} mt-3 p-4 sm:mt-4 sm:p-4`}>
              <div className="mb-2.5 text-center sm:mb-3">
                <span className={WB_INSTRUCTOR_BADGE}>Your Instructor</span>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="/images/mentor-ava.png"
                  alt="Mentor"
                  className="h-14 w-14 shrink-0 rounded-lg bg-slate-200 object-cover sm:h-16 sm:w-16"
                />
                <p className={`${TYPE.bodySm} !text-xs sm:!text-sm`}>
                  Expert in Vedic astrology and other disciplines of astrology, recognized as
                  India&apos;s leading voice in astrology.
                </p>
              </div>
              <div className="flex justify-between gap-2 border-t border-slate-100 pt-3">
                {[
                  { stat: '1 Lakh+', label: 'Students taught' },
                  { stat: '50 Million+', label: 'Views across social media' },
                  { stat: '50+ Years', label: 'of legacy' },
                ].map((item) => (
                  <div key={item.label} className="flex-1 text-center">
                    <h4 className={TYPE.stat}>{item.stat}</h4>
                    <p className={TYPE.statLabel}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={WB_CTA_ROW} data-aos="zoom-in">
          <WebinarActionButtons onJoinPaid={onJoinNow} onJoinFree={onJoinFree} />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
