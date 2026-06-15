import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION,
  WB_TITLE_LG,
  WB_STACK,
  WB_CTA_ROW,
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
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <h2 className={`${WB_TITLE_LG} mb-6 sm:mb-8`} data-aos="fade-up">
          Kabhi socha hai{' '}
          <span className={WB_HIGHLIGHT}>&ldquo;Why does this keep happening to me?&rdquo;</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4" data-aos="fade-up">
          {struggles.map((text) => (
            <div
              key={text}
              className="flex w-full items-center gap-3 rounded-xl border border-violet-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#EE6662] hover:shadow-md sm:w-[calc(50%-0.5rem)] sm:gap-4 sm:p-5"
            >
              <span className="shrink-0 text-lg text-[#EE6662] sm:text-xl">
                <i className="fas fa-question-circle" aria-hidden="true" />
              </span>
              <p className={TYPE.lead}>{text}</p>
            </div>
          ))}
        </div>
        <p className={`${TYPE.leadBold} ${WB_STACK} text-center`}>
          The answer lies in your kundli 👇
        </p>
        <div className={WB_CTA_ROW}>
          <button type="button" onClick={onJoinNow} className={WB_CTA}>
            Uncover Life&apos;s Secrets – Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
