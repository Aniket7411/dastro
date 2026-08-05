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
      icon: 'fa-door-open',
      title: 'Lagna',
      desc: 'aapki kundli ka darwaza, jo aapka chart sabse alag banata hai',
      delay: '0',
    },
    {
      icon: 'fa-users',
      title: '9 Grahas',
      desc: 'nau characters, har ek ka apna kaam aur apna nature',
      delay: '100',
    },
    {
      icon: 'fa-th-large',
      title: '12 Rashis',
      desc: 'element, quality aur ruling planet ka ek grid',
      delay: '200',
    },
    {
      icon: 'fa-home',
      title: '12 Bhavas',
      desc: 'zindagi ke 12 area: paisa, rishtey, career, ghar, sehat',
      delay: '0',
    },
    {
      icon: 'fa-layer-group',
      title: 'The 3-Layer Formula',
      desc: 'Planet + Sign + House = aapki pehli real reading',
      delay: '100',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            Rashifal astrology nahi hai. <span className={WB_HIGHLIGHT}>Jyotish ek SYSTEM hai.</span>
          </h2>
          <p className={WB_INTRO_BODY}>
            Newspaper wali 12 rashiyon wali baat sun sign hai - poori duniya ko 12 categories mein baant dena. Jyotish alag cheez hai. Aapke janm ke exact samay aur jagah se banta hai aapka Lagna, aur wahi aapki kundli ko har doosre insaan se alag banata hai - us din paida hue baaki logon se bhi. Ye calculation par khada system hai, andaaze par nahi.
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
                Yehi paanch cheezein milkar banati hain wo formula jisse Day 2 par aap apni kundli khud padhenge - Ma'am ke bolne se pehle.
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
