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
    { icon: 'fa-hourglass-half', label: 'DURATION', value: '2 Days' },
    { icon: 'fa-clock', label: 'SESSIONS', value: '2 hrs / day' },
    { icon: 'fa-laptop', label: 'FORMAT', value: 'Live on Zoom' },
    { icon: 'fa-video', label: 'ACCESS', value: 'Recording incl.' },
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
            Read Any Person’s <span className={WB_HIGHLIGHT}>Real Personality</span> in <span className="text-[#F0703C] font-black relative whitespace-nowrap">30 Seconds<svg className="absolute -bottom-1 left-0 w-full h-[6px] text-[#F0703C]/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg></span> — Just by Looking at Their Face
          </h1>
          <p className={`${TYPE.lead} mx-auto max-w-[34ch] text-center mt-4 sm:mt-5 sm:max-w-[52ch] text-slate-600 sm:text-lg`} data-aos="fade-up" data-aos-delay="100">
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
              fetchPriority="high"
              loading="eager"
            />
          </div>

          <div data-aos="fade-left">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {infoCards.map((card) => (
                <div key={card.label} className={`${WB_INFO_CARD} !bg-white/50 border-slate-200 !text-slate-800`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EE6662] text-sm sm:h-9 sm:w-9 sm:text-base !text-white">
                    <i className={`fas ${card.icon}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0 text-[10px] font-bold uppercase tracking-widest text-[#EE6662] sm:text-[11px]">
                      {card.label}
                    </p>
                    <p className="mb-0 truncate font-body text-[13px] font-bold sm:text-sm text-slate-800">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-bold text-[#EE6662]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EE6662] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EE6662]" />
              </span>
              Next batch starting soon - limited seats
            </div>

            <div className={`${WB_CARD} mt-3 sm:mt-4 overflow-hidden text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/60 w-full p-5 sm:p-6 bg-gradient-to-b from-white to-slate-50`}>
              <div className="mb-4">
                <span className={WB_INSTRUCTOR_BADGE}>Your Mentor</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                {/* PORTRAIT FRAMED IMAGE */}
                <div className="w-[160px] sm:w-[130px] lg:w-[140px] aspect-[4/5] shrink-0 rounded-[16px] bg-slate-200 overflow-hidden shadow-md border-[3px] border-white relative mx-auto sm:mx-0">
                  <img
                    src="/images/damini-new.webp"
                    alt="Damini Shukla"
                    className="absolute inset-0 h-full w-full object-cover object-[center_top]"
                    fetchPriority="high"
                    loading="eager"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] rounded-[16px] pointer-events-none" />
                </div>

                <div className="flex-1 flex flex-col justify-center sm:pt-1 min-w-0">
                  <h3 className="text-slate-900 text-[20px] sm:text-[22px] mb-1.5 font-black tracking-tight truncate">Damini Shukla</h3>
                  <p className={`${TYPE.bodySm} !text-[14px] sm:!text-[13px] lg:!text-[14px] text-slate-600 leading-relaxed font-medium mb-4 sm:mb-5`}>
                    Vedic astrologer & face reading expert, lead astrologer at DS Astro Institute.
                  </p>

                  <div className="flex justify-between sm:justify-start sm:gap-6 lg:gap-8 border-t border-slate-100 pt-4">
                    {[
                      { stat: '10k+', label: 'Students' },
                      { stat: '5000+', label: 'Consultations' },
                      { stat: 'Sony TV', label: 'Featured on' },
                    ].map((item) => (
                      <div key={item.label} className="text-center sm:text-left px-1 sm:px-0">
                        <h4 className={`${TYPE.stat} !text-[18px] sm:!text-[17px] lg:!text-[19px] text-[#F0703C]`}>{item.stat}</h4>
                        <p className={`${TYPE.statLabel} !text-[9px] sm:!text-[8px] lg:!text-[9px]`}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA removed as requested */}
      </div>
    </section>
  );
}

export default HeroSection;
