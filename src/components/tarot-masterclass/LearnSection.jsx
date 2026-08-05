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
    { icon: 'fa-eye', title: 'The Image + Element + Number Method', desc: 'Is masterclass ki core technique - koi bhi anjaan card saamne aaye to use kaise padhein. Memorisation ki jagah ye method' },
    { icon: 'fa-layer-group', title: '78 Cards Ka Structure', desc: 'Major Arcana (22) vs Minor Arcana (56) - aur ye farq aapki reading ko kaise badal deta hai' },
    { icon: 'fa-fire', title: '4 Suits, 4 Elements', desc: 'Wands, Cups, Swords, Pentacles - tarot ka sabse kaam ka decoder, poora sikhaya jaayega' },
    { icon: 'fa-clone', title: 'Apna Deck', desc: 'Kaunsa deck lein (Rider-Waite-Smith aur kyun), cleansing, energising, connect karna aur rakhna - practical aur complete' },
    { icon: 'fa-route', title: "The Fool's Journey", desc: '22 Major Arcana ek storyline mein - isliye yaad rakhne ki zarurat hi nahi padti' },
    { icon: 'fa-undo', title: 'Reversals', desc: 'Ulta card ka matlab kya hota hai aur kya nahi - aur ek beginner ko reversals padhne chahiye ya nahi' },
    { icon: 'fa-th-large', title: 'The 3-Card Spread - poora', desc: 'Past/Present/Future, plus Situation/Obstacle/Advice aur Mind/Heart/Body. Cards lagane se lekar unhe aapas mein jodne tak' },
    { icon: 'fa-comments', title: 'Live Readings + Better Questions', desc: "Ma'am do-teen attendees ke liye live reading karengi. Saath mein: kaunse sawal poochne chahiye, aur kaunse sawal ek reader ko mana kar dena chahiye" },
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}><h2 className={WB_INTRO_TITLE}>What <span className={WB_HIGHLIGHT}>You Will Learn</span> In 2 Days</h2></div>
        <div className={WB_LEARN_GRID}>
          {learningPoints.map((item) => (
            <div key={item.title} className={`${WB_LEARN_CARD} !p-[18px] sm:!p-[24px]`} data-aos="fade-up">
              <div className={WB_LEARN_ICON}><i className={`fas ${item.icon}`} aria-hidden="true" /></div>
              <div className="min-w-0"><h4 className="font-heading text-[17px] sm:text-[19px] font-bold leading-[1.3] text-[#3B2261] mb-2">{item.title}</h4><p className="font-body text-[15.5px] sm:text-[16.5px] font-normal leading-[1.6] text-slate-600 opacity-90 m-0">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <div className={WB_CTA_ROW}><button type="button" onClick={() => onJoinNow?.()} className="m-0 inline-flex min-h-[52px] w-full sm:w-auto cursor-pointer appearance-none items-center justify-center rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:px-10"><span className="text-[17px] font-semibold text-white">Join Masterclass</span><span className="text-[20px] font-black text-white ml-1.5 drop-shadow-sm">- ₹499</span></button></div>
      </div>
    </section>
  );
}

export default LearnSection;
