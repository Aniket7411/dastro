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
    "You trusted the wrong person — in business, friendship, or love — and paid the price",
    "In interviews and meetings, you can't figure out what the other person is really thinking",
    "Rishtey ke liye ladka/ladki dekhne gaye — but make-up and rehearsed answers ke aage kuch samajh nahi aaya",
    "People say one thing on the face and do something else behind your back",
    "You meet 50 people a week — but can't tell who is genuine and who is fake",
    "You invest time and energy into someone, only to realize later that they were just using you",
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Kabhi socha hai —{' '}
            <span className={WB_HIGHLIGHT}>&ldquo;Kaash main pehle hi samajh jaata ki yeh insaan kaisa hai?&rdquo;</span>
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
          <p className={WB_BRIDGE_LINE}>The answer is written on their <span className="text-[#EE6662]">FACE</span>. You just never learnt to read it. 👇</p>
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
