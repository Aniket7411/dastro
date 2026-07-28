import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_INTRO_BODY,
  WB_PATTERN_CARD,
  WB_PATTERN_ICON,
  WB_PATTERN_GRID,
  TYPE,
} from '../webinar/tokens';

function PatternsSection({ onJoinNow }) {
  const patterns = [
    {
      icon: 'fa-user-circle',
      title: 'Face shape & zones',
      desc: 'personality ka basic blueprint — thinker, doer ya feeler',
      delay: '0',
    },
    {
      icon: 'fa-eye',
      title: 'Forehead & eyes',
      desc: 'intelligence, planning aur emotional nature',
      delay: '100',
    },
    {
      icon: 'fa-smile',
      title: 'Nose & lips',
      desc: 'ambition, money nature aur love nature',
      delay: '200',
    },
    {
      icon: 'fa-gem',
      title: 'Ears & moles (til)',
      desc: 'luck signs aur karmic marks — right vs left ka famous rule',
      delay: '0',
    },
    {
      icon: 'fa-walking',
      title: 'Voice & walk',
      desc: 'confidence aur current state — bina baat kiye bhi reading possible',
      delay: '100',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            Face Reading is not magic. It’s <span className={WB_HIGHLIGHT}>OBSERVATION</span> — with a 5,000-year-old system behind it.
          </h2>
          <p className={WB_INTRO_BODY}>
            Samudrika Shastra kehta hai — the face is the front page of a person’s life. Har feature ek signal hai:
          </p>
        </div>

        <div className={WB_PATTERN_GRID}>
          {patterns.map((pattern) => (
            <div
              key={pattern.title}
              className={`${WB_PATTERN_CARD} !p-[18px] sm:!p-[24px]`}
              data-aos="fade-up"
              data-aos-delay={pattern.delay}
            >
              <div className={WB_PATTERN_ICON}>
                <i className={`fas ${pattern.icon}`} aria-hidden="true" />
              </div>
              <h4 className="font-heading text-[17px] sm:text-[19px] font-bold leading-[1.3] text-[#3B2261] mb-2">{pattern.title}</h4>
              <p className="font-body text-[15.5px] sm:text-[16.5px] font-normal leading-[1.6] text-slate-600 opacity-90 m-0">{pattern.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center" data-aos="fade-up">
            <p className={`${TYPE.lead} mb-6 mx-auto max-w-2xl`}>
                160+ aise signals milkar banate hain ek complete personality profile. Is masterclass mein aap yeh system seekhna <span className="font-bold text-[#EE6662]">shuru</span> karenge.
            </p>
            <button
              type="button"
              onClick={() => onJoinNow?.()}
              className="mt-4 sm:mt-6 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
            >
                <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
                <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹499</span>
            </button>
        </div>
      </div>
    </section>
  );
}

export default PatternsSection;
