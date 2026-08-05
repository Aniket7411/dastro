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
    { icon: 'fa-calculator', title: 'The 4-Number Method', desc: 'Driver, Conductor, Name Number aur Mobile Number - chaaron aapke apne numbers par live calculate hote hain' },
    { icon: 'fa-cube', title: 'Mulank & Bhagyank', desc: '1 se 9 tak har number ka one-line meaning aur uska ruling planet' },
    { icon: 'fa-th', title: 'The Lo Shu Grid', desc: 'Apni date of birth 3×3 grid mein plot kijiye. Missing numbers aur repeated numbers padhiye' },
    { icon: 'fa-compass', title: 'Planes & Arrows - Introduction', desc: 'Planes aur arrows hote kya hain, aur ek arrow poora sikhaya jaayega' },
    { icon: 'fa-heart', title: 'Number Compatibility', desc: 'Friendly, neutral aur enemy numbers - rishton par aur business partners par apply karke' },
    { icon: 'fa-font', title: 'Name Numerology - Calculation', desc: 'Naam ka number kaise nikalta hai, aur jab naam aapke driver se ladta hai to kya hota hai' },
    { icon: 'fa-mobile-alt', title: 'Mobile Number Analysis', desc: 'Apna mobile number total kijiye aur judge kijiye. Ek attendee ka number class mein live analyse hoga' },
    { icon: 'fa-hourglass-half', title: 'The Personal Year Cycle', desc: 'Apna current personal year nikaliye - ek 1-year aapse kya maangta hai aur ek 8-year kya' },
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
