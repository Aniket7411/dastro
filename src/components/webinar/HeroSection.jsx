import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_PURPLE,
  WB_CTA,
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

function HeroSection({ onJoinNow }) {
  const infoCards = [
    { icon: 'fa-calendar-day', label: 'Date', value: '25th – 26th April' },
    { icon: 'fa-clock', label: 'Time:', value: '1:00 PM' },
    { icon: 'fa-hourglass-half', label: 'Duration:', value: '4 Hours' },
    { icon: 'fa-laptop', label: 'Format:', value: '2 days Webinar' },
  ];

  return (
    <section className={`relative ${WB_SECTION_HERO}`}>
      <div className={WB_WRAP}>
        <div className="mb-5 flex justify-center sm:mb-6" data-aos="fade-up">
          <div className={WB_BADGE}>
            <span className={WB_BADGE_ICON}>
              <i className="fas fa-calendar-alt" aria-hidden="true" />
            </span>
            2-Days Mega Astrology Webinar
          </div>
        </div>

        <h1 className={WB_TITLE_HERO} data-aos="fade-up">
          Remove <span className={WB_HIGHLIGHT}>Uncertainty</span> from Your{' '}
          <span className={WB_HIGHLIGHT}>Career, Relationships and Finances</span> using{' '}
          <span className={WB_PURPLE}>Astrology</span>
        </h1>

        <div className={`${WB_STACK} grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8`}>
          <div
            className="relative overflow-hidden rounded-xl border border-slate-200 shadow-lg"
            data-aos="fade-right"
          >
            <video
              src="/videohomefinal.mp4"
              controls
              poster="/images/bg-bannerpic.jpg"
              className="block w-full"
            />
            <div className="absolute bottom-0 left-0 z-[5] w-full bg-[#3B2261] px-4 py-2 font-body text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-white sm:px-5 sm:py-2.5 sm:text-xs">
              BY – ASTRO AVA
            </div>
          </div>

          <div data-aos="fade-left">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {infoCards.map((card) => (
                <div key={card.label} className={WB_INFO_CARD}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EE6662] text-lg sm:h-11 sm:w-11 sm:text-xl">
                    <i className={`fas ${card.icon}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={TYPE.h4}>{card.label}</h4>
                    <p className="!m-0 font-body !text-[0.9375rem] !font-bold !text-white sm:!text-base">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${WB_CARD} mt-4 p-5 sm:mt-5 sm:p-6`}>
              <div className="mb-3 text-center sm:mb-4">
                <span className={WB_INSTRUCTOR_BADGE}>Your Instructor</span>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <img
                  src="/images/mentor-ava.png"
                  alt="Mentor"
                  className="h-20 w-20 shrink-0 rounded-lg bg-slate-200 object-cover sm:h-[5.5rem] sm:w-[5.5rem]"
                />
                <p className={TYPE.bodySm}>
                  Expert in Vedic astrology and other disciplines of astrology, recognized as
                  India&apos;s leading voice in astrology.
                </p>
              </div>
              <div className="flex justify-between gap-2 border-t border-slate-100 pt-4">
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
          <button type="button" onClick={onJoinNow} className={WB_CTA}>
            Uncover Life&apos;s Secrets – Join Now
          </button>
          <p className={`${TYPE.leadBold} mt-3`}>
            Book Your Seat Now – Hurry Up!{' '}
            <span className="!text-red-500">Few Seats Left</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
