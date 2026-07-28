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
  TYPE,
} from '../webinar/tokens';

function LearnSection({ onJoinNow }) {
  const learningPoints = [
    {
      icon: 'fa-bolt',
      title: 'The 160+ Snapshot Framework:',
      desc: 'How professional face readers scan a face in 30 seconds',
    },
    {
      icon: 'fa-user',
      title: 'Face Structure Decode:',
      desc: 'Round, oval, sharp & long faces — and what each instantly reveals',
    },
    {
      icon: 'fa-map-marked-alt',
      title: 'The 3-Zone Face Map:',
      desc: 'Forehead, middle face, lips-chin — which zone rules the personality',
    },
    {
      icon: 'fa-eye',
      title: 'Eyes — The Windows That Never Lie:',
      desc: 'Big, small, sharp & watery eyes decoded',
    },
    {
      icon: 'fa-smile',
      title: 'Nose, Lips & Ears:',
      desc: 'Ambition, love nature and the classic luck signs',
    },
    {
      icon: 'fa-dot-circle',
      title: 'Moles (Til) — Marks of Destiny:',
      desc: 'The right-vs-left rule everyone gets wrong',
    },
    {
      icon: 'fa-walking',
      title: 'Voice, Walk & Body Language:',
      desc: 'Read a person before they even speak',
    },
    {
      icon: 'fa-users',
      title: 'Live Practice:',
      desc: 'Do your first real face reading in the class itself — on yourself & family',
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
