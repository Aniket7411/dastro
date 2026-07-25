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
} from '../webinar/tokens';

function HeroSection({ onJoinNow }) {
  const infoCards = [
    { icon: 'fa-calendar-day', label: 'DATE', value: '1st & 2nd August 2026' },
    { icon: 'fa-clock', label: 'TIME', value: '6:00 PM – 8:00 PM' },
    { icon: 'fa-hourglass-half', label: 'DURATION', value: '4 Hours (2 Days)' },
    { icon: 'fa-laptop', label: 'FORMAT', value: 'Live on Zoom + Recording' },
  ];

  return (
    <section className={`relative ${WB_SECTION_HERO}`}>
      <div className={WB_WRAP}>
        <div className="mb-6 flex justify-center sm:mb-8" data-aos="fade-up">
          <div className={WB_BADGE}>
            <span className={WB_BADGE_ICON}>
              <i className="fas fa-eye" aria-hidden="true" />
            </span>
            2-Day Face Reading Masterclass — ₹499
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl text-center" data-aos="fade-up">
          <h1 className={`wb-hero-title ${WB_TITLE_HERO}`}>
            Read Any Person’s <span className={WB_HIGHLIGHT}>Real Personality</span> in 30 Seconds — Just by Looking at Their <span className={WB_PURPLE}>Face</span>
          </h1>
          <p className={`${TYPE.lead} mx-auto max-w-2xl text-center sm:text-lg`} data-aos="fade-up" data-aos-delay="100">
            Learn the ancient science of Samudrika Shastra, simplified into a powerful <span className="font-bold text-slate-900">160+ Snapshot Face Reading Technique</span>.
          </p>
        </div>

        <div className={`${WB_STACK} grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6`}>
          <div
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 shadow-md lg:max-w-none"
            data-aos="fade-right"
          >
            <img 
              src="/images/masterclass-hero.webp" 
              alt="Face Reading Masterclass" 
              className="block w-full h-auto object-contain" 
              fetchpriority="high"
              loading="eager"
            />
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
                <span className={WB_INSTRUCTOR_BADGE}>Your Mentor</span>
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="w-16 h-20 shrink-0 rounded-lg bg-slate-200 overflow-hidden sm:w-20 sm:h-24 flex items-center justify-center shadow-sm border border-slate-100">
                  <img 
                    src="/images/masterclass-mentor.webp" 
                    alt="Damini Ma'am" 
                    className="h-full w-full object-cover object-[center_20%]" 
                    fetchpriority="high"
                    loading="eager"
                  />
                </div>
                <p className={`${TYPE.bodySm} !text-xs sm:!text-sm`}>
                  <strong>Damini Shukla</strong> — Vedic astrologer & face reading expert, lead astrologer at DS Astro Institute.
                </p>
              </div>
              <div className="flex justify-between gap-2 border-t border-slate-100 pt-3">
                {[
                  { stat: '10k+', label: 'Students' },
                  { stat: '500+', label: 'Consultations' },
                  { stat: 'Sony TV', label: 'Featured on' },
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
           <button
            onClick={onJoinNow}
            className="m-0 inline-flex min-h-[3rem] cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body !text-sm !font-bold !text-white shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:min-h-[3.5rem] sm:px-10 sm:!text-base"
          >
            Join Masterclass — ₹499
            <span className="ml-3 text-xs line-through opacity-75">₹1,999</span>
          </button>
          <p className="mt-3 text-xs text-slate-500 font-medium">Limited seats — book your spot today · Recording included even if you miss a session</p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
