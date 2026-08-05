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
} from '../webinar/tokens';

function LearnSection({ onJoinNow }) {
  const learningPoints = [
    {
      icon: 'fa-clipboard-check',
      title: 'The 8-Marker Method',
      desc: '8 markers · 40+ readings · 1 complete signature decode - ek professional graphologist kisi bhi page ko 60 second mein kaise scan karta hai, wahi order aur wahi checklist',
    },
    {
      icon: 'fa-wave-square',
      title: 'Baseline Decode',
      desc: 'Chadhti, girti, seedhi ya lehrati line - mood, optimism aur bharosemand hone ka pehla clue',
    },
    {
      icon: 'fa-italic',
      title: 'Slant Decode',
      desc: 'Right, vertical, left aur variable slant - kaun khulke jeeta hai aur kaun kya protect kar raha hai',
    },
    {
      icon: 'fa-compress-arrows-alt',
      title: 'Size & Pressure',
      desc: 'Kaun attention chahta hai, kiski energy sabse strong hai, kaun kitni gehrai se feel karta hai - kaagaz par live demo',
    },
    {
      icon: 'fa-layer-group',
      title: 'The 3-Zone Map',
      desc: 'Upper zone = intellect aur ambition · Middle = daily social self · Lower = material drives aur instinct',
    },
    {
      icon: 'fa-text-width',
      title: 'Spacing & Margins',
      desc: 'Word spacing = paas ya distance · Line spacing = thinking clarity · Margins = past aur future ka attitude',
    },
    {
      icon: 'fa-signature',
      title: 'Signature Analysis',
      desc: 'Aapka signature duniya ko kya bata raha hai - aur jab signature handwriting se match na kare to iska matlab kya hai. Yeh is masterclass ki take-home skill hai.',
    },
    {
      icon: 'fa-pen-fancy',
      title: 'Graphotherapy + Live Practice',
      desc: 'Likhawat badalne se behaviour badalta hai - ek correction class mein hi seekhiye, aur apni aur family ki handwriting par pehli real reading kijiye',
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
