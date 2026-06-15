import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION_WHY,
  WB_SECTION_INTRO,
  WB_TITLE_CENTER,
  WB_WHY_GRID,
  WB_WHY_CARD,
  WB_WHY_ICON,
  WB_WHY_FOOTER,
  WB_BRIDGE_LINE,
  TYPE,
} from './tokens';

function WhySection({ onJoinNow }) {
  const struggles = [
    "You're working hard but promotions or recognition feel stuck",
    'You attract the same type of person again and again.',
    "You earn but somehow it doesn't stay or grow the way you want",
    "You feel like you're living someone else's script, not your own",
    'You feel misunderstood by people close to you.',
  ];

  return (
    <section className={`${WB_SECTION_WHY} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_TITLE_CENTER}>
            Kabhi socha hai{' '}
            <span className={WB_HIGHLIGHT}>&ldquo;Why does this keep happening to me?&rdquo;</span>
          </h2>
        </div>

        <div className={WB_WHY_GRID} data-aos="fade-up">
          {struggles.map((text) => (
            <div key={text} className={WB_WHY_CARD}>
              <span className={WB_WHY_ICON}>
                <i className="fas fa-question-circle" aria-hidden="true" />
              </span>
              <p className={TYPE.lead}>{text}</p>
            </div>
          ))}
        </div>

        <div className={WB_WHY_FOOTER} data-aos="fade-up">
          <p className={WB_BRIDGE_LINE}>The answer lies in your kundli 👇</p>
          <button type="button" onClick={onJoinNow} className={WB_CTA}>
            Uncover Life&apos;s Secrets – Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
