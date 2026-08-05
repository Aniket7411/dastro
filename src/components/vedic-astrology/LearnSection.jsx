import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_CTA_ROW,
  WB_LEARN_GRID,
  WB_LEARN_CARD,
  WB_LEARN_ICON,
  TYPE,
} from '../webinar/tokens';

function LearnSection({ onJoinNow }) {
  const learningPoints = [
    {
      icon: 'fa-layer-group',
      title: 'The 3-Layer Reading Formula',
      desc: 'Planet (kya) + Sign (kaise) + House (kahan) - is masterclass ki core technique, chaar examples ke saath dheere-dheere sikhayi jaayegi',
    },
    {
      icon: 'fa-border-all',
      title: 'Kundli Kaise Banti Hai',
      desc: '12 dabbe, aapka Lagna, aur North vs South Indian chart format ka farq - aapki kundli same din paida hue insaan se alag kyun hai',
    },
    {
      icon: 'fa-users',
      title: 'The 9 Grahas',
      desc: 'Nau grahon ka ek-line significance, natural benefic vs malefic, aur Rahu-Ketu ka introduction',
    },
    {
      icon: 'fa-th',
      title: '12 Rashis Ek Grid Mein',
      desc: 'Element + quality + ruling planet, memory shortcut ke saath - session ke end tak poora 12-sign table aapko yaad hoga',
    },
    {
      icon: 'fa-home',
      title: 'The 12 Bhavas',
      desc: 'Kaunsa bhaav zindagi ka kaunsa hissa chalata hai; chaar Kendra (1-4-7-10) properly explained, baaki mapped',
    },
    {
      icon: 'fa-search',
      title: 'LIVE: Apna Lagna Dhoondhiye',
      desc: 'Apna chart khol kar apna Lagna identify kijiye aur apne nau grahas khud place kijiye - class ke andar',
    },
    {
      icon: 'fa-chart-pie',
      title: 'Live Chart Demo',
      desc: 'Damini Ma\'am do volunteer charts sirf 3-Layer Formula se padhengi. Aap pehle guess kijiye, phir jawab suniye',
    },
    {
      icon: 'fa-clock',
      title: 'Timing Kyun Matter Karta Hai',
      desc: 'Vimshottari Dasha ka concept - ek hi kundli 25 aur 45 ki umar mein alag result kyun deti hai (concept, calculation nahi)',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            What <span className={WB_HIGHLIGHT}>You Will Learn</span> In 2 Days
          </h2>
        </div>
        <div className={WB_LEARN_GRID}>
          {learningPoints.map((item) => (
            <div key={item.title} className={`${WB_LEARN_CARD} !p-[18px] sm:!p-[24px]`} data-aos="fade-up">
              <div className={WB_LEARN_ICON}>
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading text-[17px] sm:text-[19px] font-bold leading-[1.3] text-[#3B2261] mb-2">{item.title}</h4>
                <p className="font-body text-[15.5px] sm:text-[16.5px] font-normal leading-[1.6] text-slate-600 opacity-90 m-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={WB_CTA_ROW}>
          <button
            type="button"
            onClick={() => onJoinNow?.()}
            className="m-0 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
          >
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹499</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default LearnSection;
