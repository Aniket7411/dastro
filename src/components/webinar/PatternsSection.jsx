import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION_PATTERNS,
  WB_SECTION_INTRO,
  WB_SECTION_INTRO_SUB,
  WB_TITLE_CENTER,
  WB_PATTERN_CARD,
  WB_PATTERN_ICON,
  WB_PATTERN_GRID,
  WB_CTA_ROW_TIGHT,
  TYPE,
} from './tokens';

function PatternsSection({ onJoinNow }) {
  const patterns = [
    {
      icon: 'fa-fingerprint',
      title: 'Aapki personality ka blueprint',
      desc: 'why you react the way you do',
      delay: '0',
    },
    {
      icon: 'fa-coins',
      title: 'Career aur money ka zone',
      desc: 'kaunse areas naturally strong hain, kahan effort zyada lagega',
      delay: '100',
    },
    {
      icon: 'fa-users',
      title: 'Relationships ka dynamics',
      desc: 'why you attract certain people, aur unke saath issues kyun repeat hote hain',
      delay: '200',
    },
    {
      icon: 'fa-heartbeat',
      title: 'Health aur energy cycles',
      desc: 'kab body support karti hai, kab rest chahiye',
      delay: '0',
    },
    {
      icon: 'fa-history',
      title: 'Timing',
      desc: 'kab push karna hai, kab wait karna hai',
      delay: '100',
    },
  ];

  return (
    <section className={`${WB_SECTION_PATTERNS} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_TITLE_CENTER}>
            Astrology is not about predictions. It&apos;s about{' '}
            <span className={WB_HIGHLIGHT}>PATTERNS.</span>
          </h2>
          <p className={`${TYPE.bodyCenter} ${WB_SECTION_INTRO_SUB}`}>
            Planets ki positions, houses ka system, signs ka energy—ye sab ek framework hai jo
            explain karta hai:
          </p>
        </div>

        <div className={WB_PATTERN_GRID}>
          {patterns.map((pattern) => (
            <div
              key={pattern.title}
              className={WB_PATTERN_CARD}
              data-aos="fade-up"
              data-aos-delay={pattern.delay}
            >
              <div className={WB_PATTERN_ICON}>
                <i className={`fas ${pattern.icon}`} aria-hidden="true" />
              </div>
              <h4 className={`${TYPE.h3} !mb-1`}>{pattern.title}</h4>
              <p className={TYPE.bodySm}>{pattern.desc}</p>
            </div>
          ))}
          <div className={`${WB_CTA_ROW_TIGHT} sm:col-span-2 lg:col-span-3`}>
            <button type="button" onClick={onJoinNow} className={WB_CTA}>
              Uncover Life&apos;s Secrets – Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatternsSection;
