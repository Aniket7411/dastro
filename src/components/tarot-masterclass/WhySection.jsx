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
    'Aapne deck kharida tha, ek baar khola, cards dekhe - aur wapas almari mein rakh diya',
    'Har card ka meaning ratna padta hai - 78 cards, itna kaun yaad rakhe',
    'YouTube par 10 videos dekh liye, phir bhi apni pehli reading karne ki himmat nahi hui',
    'Kisi ne aapko reading di aur aap samajh hi nahi paaye ki unhone ye conclusion nikala kaise',
    'Ghar mein log kehte hain tarot mein kuch dark hota hai - aur aap poochne mein jhijhakte hain',
    'Aap decisions mein atak jaate hain aur chahte hain ki khud se ek saaf sawal poochne ka tarika mile',
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Kabhi socha hai -{' '}
            <span className={WB_HIGHLIGHT}>&ldquo;Deck to le liya... ab isse kare kya?&rdquo;</span>
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
          <p className={WB_BRIDGE_LINE}>Tarot yaad karne ki cheez nahi hai. Ye padhne ki cheez hai - aur padhna do din mein seekha ja sakta hai.</p>
          <button type="button" onClick={() => onJoinNow?.()} className="m-0 mt-4 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10">
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹500</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
