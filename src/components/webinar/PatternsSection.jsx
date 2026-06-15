import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION,
  WB_TITLE_CENTER,
  WB_STACK,
  WB_CTA_ROW,
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
    <section className={`${WB_SECTION} bg-[#FAF9F6] text-center`}>
      <div className={WB_WRAP}>
        <h2 className={`${WB_TITLE_CENTER} mb-3`}>
          Astrology is not about predictions. It&apos;s about{' '}
          <span className={WB_HIGHLIGHT}>PATTERNS.</span>
        </h2>
        <p className={`${TYPE.body} mx-auto max-w-2xl`}>
          Planets ki positions, houses ka system, signs ka energy—ye sab ek framework hai jo
          explain karta hai:
        </p>

        <div className={`${WB_STACK} grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5`}>
          {patterns.map((pattern) => (
            <div
              key={pattern.title}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7"
              data-aos="fade-up"
              data-aos-delay={pattern.delay}
            >
              <div className="mb-3 text-3xl text-[#3B2261] sm:mb-4">
                <i className={`fas ${pattern.icon}`} aria-hidden="true" />
              </div>
              <h4 className={`${TYPE.h3} mb-1.5`}>{pattern.title}</h4>
              <p className={TYPE.bodySm}>{pattern.desc}</p>
            </div>
          ))}
          <div className="flex items-center justify-center sm:col-span-2 lg:col-span-3">
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
