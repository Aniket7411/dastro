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
        <div
          className="mx-auto mb-6 max-w-5xl rounded-2xl border border-[#EE6662]/20 bg-gradient-to-br from-white via-rose-50/60 to-white p-4 text-center shadow-[0_14px_34px_rgba(238,102,98,0.10)] sm:mb-8 sm:p-5 lg:p-6"
          data-aos="fade-up"
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EE6662] text-white shadow-[0_10px_24px_rgba(238,102,98,0.28)] sm:h-12 sm:w-12">
            <i className="fas fa-clone text-base sm:text-lg" aria-hidden="true" />
          </div>
          <p className={`${TYPE.lead} mx-auto mt-3 max-w-[58rem] text-slate-700 sm:mt-4 sm:text-lg`}>
            Seekhiye <span className="font-extrabold text-[#3B2261]">The Image + Element + Number Method</span>
          </p>
          <div className="mx-auto mt-3 flex max-w-4xl flex-wrap justify-center gap-2">
            {['Image', 'Element', 'Number', '78 cards', '1 method'].map((item) => (
              <span key={item} className="inline-flex min-h-8 items-center rounded-full border border-[#EE6662]/25 bg-white px-3 py-1 text-xs font-extrabold text-[#EE6662] shadow-sm sm:text-sm">
                {item}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-[72ch] text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
            Wo tarika jisse aap koi bhi card padh sakte hain, chahe wo card aapne zindagi mein pehle kabhi dekha na ho.
          </p>
        </div>
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

