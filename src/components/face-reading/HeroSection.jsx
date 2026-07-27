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
            Read Any Person’s <span className={WB_HIGHLIGHT}>Real Personality</span> in <span className="text-[#F0703C] font-black relative whitespace-nowrap">30 Seconds<svg className="absolute -bottom-1 left-0 w-full h-[6px] text-[#F0703C]/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none"/></svg></span> — Just by Looking at Their Face
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
                    fetchPriority="high"
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
            className="m-0 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
          >
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹499</span>
          </button>
          <div className="mt-3 flex items-center justify-center gap-4 text-[13px] text-slate-600/75 leading-relaxed font-medium">
            <span className="flex items-center gap-1.5"><i className="fas fa-chair text-slate-400"></i> Limited seats</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1.5"><i className="fas fa-video text-slate-400"></i> Recording included</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
