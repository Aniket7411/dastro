import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_WHY_GRID,
  WB_WHY_CARD,
  WB_WHY_ICON,
  WB_WHY_FOOTER,
  WB_BRIDGE_LINE,
  TYPE,
} from '../webinar/tokens';

function WhySection({ onJoinNow }) {
  const struggles = [
    "Har chhoti baat ke liye kisi aur ke paas jaana padta hai - aur reading ke do din baad yaad bhi nahi rehta ki unhone kaha kya tha",
    "Ek pandit ji kehte hain Shani chal raha hai, dusre kehte hain Mangal dosh hai - dono ke jawab alag, aur aap beech mein confuse",
    "Aapke paas apni kundli rakhi hui hai - par khol kar dekhein to sirf 12 dabbe aur kuch numbers dikhte hain",
    "Rashifal aap bhi padhte ho, aur andar se aapko pata hai ki ye poori astrology nahi ho sakti",
    "Ghar walon ki, bachchon ki kundli samajhna chahte ho - par shuruaat kahan se karein ye pata hi nahi",
    "Astrology seekhne ka mann bahut baar hua, par lagta hai ye itni badi vidya hai ki beginner shayad kabhi samajh hi na paaye",
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Kabhi socha hai —{' '}
            <span className={WB_HIGHLIGHT}>"Apni hi kundli mujhe khud kyun samajh nahi aati?"</span>
          </h2>
        </div>

        <div className={WB_WHY_GRID} data-aos="fade-up">
          {struggles.map((text) => (
            <div key={text} className={WB_WHY_CARD}>
              <span className={WB_WHY_ICON}>
                <i className="fas fa-exclamation" aria-hidden="true" />
              </span>
              <p className={TYPE.lead}>{text}</p>
            </div>
          ))}
        </div>

        <div className={WB_WHY_FOOTER} data-aos="fade-up">
          <p className={WB_BRIDGE_LINE}>Kundli koi paheli nahi hai. Uski ek alphabet hai aur ek grammar. <span className="text-[#EE6662]">Do din mein dono aapke paas hongi.</span> 👇</p>
          <button
            type="button"
            onClick={() => onJoinNow?.()}
            className="m-0 mt-4 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
          >
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹500</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
