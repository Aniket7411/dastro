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
    'Aapne dekha hoga log naam ki spelling badal lete hain - par kabhi samajh nahi aaya ki kyun, aur usse hota kya hai',
    'Apna mobile number aap roz naye logon ko dete hain - aur aapko pata hi nahi ki wo aapke liye kaam kar raha hai ya nahi',
    'Kuch saal bemisaal jaate hain, kuch saal har cheez atakti hai - aur pattern kabhi samajh nahi aata',
    'Ek rishte mein sab kuch theek tha phir bhi baat nahi bani, aur kisi ke saath pehle din se tuning ho gayi',
    'Astrology seekhna bhaari lagta hai - chart, janm samay, software, calculation',
    'Aap ek aisa skill chahte hain jo aap kisi ke bhi saath, kahin bhi, 2 minute mein use kar sakein',
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Kabhi socha hai -{' '}
            <span className={WB_HIGHLIGHT}>&ldquo;Mere numbers mere baare mein kya bata rahe hain?&rdquo;</span>
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
          <p className={WB_BRIDGE_LINE}>Har insaan ke paas ek date of birth hai, ek naam hai aur ek mobile number hai. Teenon kuch keh rahe hain - bas padhna aana chahiye.</p>
          <button
            type="button"
            onClick={() => onJoinNow?.()}
            className="m-0 mt-4 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"
          >
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span>
            <span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹499</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
