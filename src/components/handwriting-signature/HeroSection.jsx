import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_BADGE,
  WB_BADGE_ICON,
  WB_TITLE_HERO,
  WB_SECTION_HERO,
  WB_STACK,
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
              <i className="fas fa-pen-nib" aria-hidden="true" />
            </span>
            2-Day Handwriting & Signature Masterclass - Rs 500
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl text-center" data-aos="fade-up">
          <h1 className={`wb-hero-title ${WB_TITLE_HERO}`}>
            <span className={WB_HIGHLIGHT}>Handwriting</span> Se Personality{" "}
            <span className="text-[#F0703C] font-black relative whitespace-nowrap">
              Decode
              <svg
                className="absolute -bottom-1 left-0 w-full h-[6px] text-[#F0703C]/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p
            className={`${TYPE.lead} mx-auto max-w-[44ch] text-center mt-4 sm:mt-5 sm:max-w-[72ch] text-slate-600 sm:text-lg`}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Kisi ki bhi handwriting aur signature dekhkar uski Personality,
            Behaviour, Strengths aur Hidden Traits pehchaniye - sirf 2 din mein.
          </p>
        </div>
        <div className={`${WB_STACK} grid items-center justify-center gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6`}>
          <div
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 shadow-md lg:max-w-none"
            data-aos="fade-right"
          >
            <img
              src="/handwriting/1.webp"
              alt="Handwriting & Signature Masterclass"
              className="block w-full h-auto object-contain"
              fetchPriority="high"
              loading="eager"
            />
          </div>

          <div data-aos="fade-left" className="mx-auto w-full max-w-xl text-center lg:text-left">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 justify-items-center">
              {infoCards.map((card) => (
                <div key={card.label} className={`${WB_INFO_CARD} !bg-white/50 border-slate-200 !text-slate-800 w-full`}>
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

            <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-bold text-[#EE6662] lg:justify-start">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EE6662] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EE6662]" />
              </span>
              Next batch starting soon - limited seats
            </div>
          </div>
        </div>

        {/* CTA removed as requested */}
      </div>
    </section>
  );
}

export default HeroSection;

