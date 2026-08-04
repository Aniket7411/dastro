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
    "Interview mein resume perfect tha, baat bhi acchi hui - join karne ke baad pata chala banda bilkul alag nikla",
    "Aap apna signature din mein 10 baar karte ho - par kabhi socha nahi ki wo saamne wale ko aapke baare mein kya bata raha hai",
    "Rishta dekhne gaye - sab kuch accha laga, par asli nature do mulaqaton mein samajh hi nahi aaya",
    "Bachche ki handwriting achanak badal gayi hai aur aapko samajh nahi aa raha ki mann mein chal kya raha hai",
    "Team mein kaun sach mein reliable hai aur kaun sirf baatein banata hai - ye pata tab chalta hai jab kaafi der ho chuki hoti hai",
    "Aap khud ko improve karna chahte ho - confidence, focus, goal setting - par samajh nahi aata shuruaat kahan se karein",
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div
          className="mx-auto mb-6 max-w-5xl rounded-2xl border border-[#EE6662]/20 bg-gradient-to-br from-white via-rose-50/60 to-white p-4 text-center shadow-[0_14px_34px_rgba(238,102,98,0.10)] sm:mb-8 sm:p-5 lg:p-6"
          data-aos="fade-up"
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#EE6662] text-white shadow-[0_10px_24px_rgba(238,102,98,0.28)] sm:h-12 sm:w-12">
            <i className="fas fa-pen-nib text-base sm:text-lg" aria-hidden="true" />
          </div>
          <p className={`${TYPE.lead} mx-auto mt-3 max-w-[58rem] text-slate-700 sm:mt-4 sm:text-lg`}>
            Seekhiye <span className="font-extrabold text-[#3B2261]">Graphology ka 8-Marker Method</span>
          </p>
          <div className="mx-auto mt-3 flex max-w-3xl flex-wrap justify-center gap-2">
            {['8 markers', '40+ readings', '1 complete signature decode'].map((item) => (
              <span key={item} className="inline-flex min-h-8 items-center rounded-full border border-[#EE6662]/25 bg-white px-3 py-1 text-xs font-extrabold text-[#EE6662] shadow-sm sm:text-sm">
                {item}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-[72ch] text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
            Wahi system jo duniya bhar mein HR, forensic experts aur counsellors use karte hain. Koi belief system nahi chahiye - sirf ek pen aur ek kaagaz.
          </p>
        </div>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Kabhi socha hai -{' '}
            <span className={WB_HIGHLIGHT}>&ldquo;Kaash main pehle hi jaan jaata ki ye insaan andar se kaisa hai?&rdquo;</span>
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
          <p className={WB_BRIDGE_LINE}>Jawab pehle se ek kaagaz par likha hua hai. Handwriting jhooth nahi bolti - bas usse padhna aana chahiye.</p>
          <button
            type="button"
            onClick={() => onJoinNow?.()}
            className="m-0 mt-4 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
          >
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- 500</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;


