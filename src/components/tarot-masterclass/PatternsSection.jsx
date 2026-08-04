import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_INTRO_BODY,
  WB_PATTERN_CARD,
  WB_PATTERN_ICON,
  WB_PATTERN_GRID,
  TYPE,
} from '../webinar/tokens';

function PatternsSection({ onJoinNow }) {
  const patterns = [
    { icon: 'fa-layer-group', title: 'Structure of 78', desc: '22 Major vs 56 Minor, aur ye farq reading kaise badalta hai', delay: '0' },
    { icon: 'fa-fire', title: '4 Suits = 4 Elements', desc: 'Wands/fire/action, Cups/water/emotion, Swords/air/mind, Pentacles/earth/money', delay: '100' },
    { icon: 'fa-route', title: "The Fool's Journey", desc: '22 Majors ek kahani ki tarah, list ki tarah nahi', delay: '200' },
    { icon: 'fa-eye', title: 'Image + Element + Number', desc: 'bina meaning yaad kiye card padhne ka method', delay: '0' },
    { icon: 'fa-clone', title: 'The 3-Card Spread', desc: 'aapki pehli poori reading, shuru se aakhir tak', delay: '100' },
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            Tarot rattne ki cheez nahi hai. Ye ek <span className={WB_HIGHLIGHT}>LANGUAGE</span> hai.
          </h2>
          <p className={WB_INTRO_BODY}>
            Ye 78 cards koi random collection nahi hain - inka ek structure hai. Jaise hi wo structure samajh aata hai, aap koi bhi card utha kar padh sakte hain, chahe pehle dekha ho ya nahi. Aur ek baat pehle hi saaf kar dete hain: tarot maut, shraap ya dar ke baare mein nahi hai. Ye ek reading hai, sazaa nahi - aur ye masterclass usi soch se shuru hoti hai.
          </p>
        </div>

        <div className={WB_PATTERN_GRID}>
          {patterns.map((pattern) => (
            <div key={pattern.title} className={`${WB_PATTERN_CARD} !p-[18px] sm:!p-[24px]`} data-aos="fade-up" data-aos-delay={pattern.delay}>
              <div className={WB_PATTERN_ICON}><i className={`fas ${pattern.icon}`} aria-hidden="true" /></div>
              <h4 className="font-heading text-[17px] sm:text-[19px] font-bold leading-[1.3] text-[#3B2261] mb-2">{pattern.title}</h4>
              <p className="font-body text-[15.5px] sm:text-[16.5px] font-normal leading-[1.6] text-slate-600 opacity-90 m-0">{pattern.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center" data-aos="fade-up">
          <p className={`${TYPE.lead} mb-6 mx-auto max-w-2xl`}>Yehi structure aapko poore <span className="font-bold text-[#EE6662]">78 cards</span> ka access de deta hai - ek bhi meaning ratte bina.</p>
          <button type="button" onClick={() => onJoinNow?.()} className="mt-4 sm:mt-6 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10">
            <span className="text-[17px] font-semibold text-white">Join Masterclass</span><span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹500</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PatternsSection;
