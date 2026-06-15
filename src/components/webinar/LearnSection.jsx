import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION,
  WB_TITLE_CENTER,
  WB_STACK,
  WB_CTA_ROW,
  TYPE,
} from './tokens';

function LearnSection({ onJoinNow }) {
  const learningPoints = [
    {
      icon: 'fa-sun',
      title: 'Basics of Vedic Astrology:',
      desc: 'Understand the simple rules that Vedic astrology is built on.',
    },
    {
      icon: 'fa-th',
      title: 'Understanding Your Birth Chart/Kundali',
      desc: 'Learn about the secrets in your birth chart.',
    },
    {
      icon: 'fa-star',
      title: 'How Planets Affect Your Life:',
      desc: 'See how planets influence important parts of your life like your job, love life, and money.',
    },
    {
      icon: 'fa-globe',
      title: 'Effects of Planetary Movements:',
      desc: 'Explore how the movement of planets can affect you.',
    },
    {
      icon: 'fa-gem',
      title: 'Astrology Advice for Different Life Areas:',
      desc: 'Get specific advice for bettering your career, relationships, and health.',
    },
    {
      icon: 'fa-book-open',
      title: 'Practical Applications of Astrology:',
      desc: "How to read patterns in other people's charts",
    },
    {
      icon: 'fa-comment-dots',
      title: 'Case studies:',
      desc: 'Real charts, real situations, real insights',
    },
    {
      icon: 'fa-arrow-right',
      title: 'Next steps:',
      desc: 'How to start your own consultation as a highly-paid astrologer',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <h2 className={WB_TITLE_CENTER}>
          What <span className={WB_HIGHLIGHT}>You Will Learn</span> In 2 Days
        </h2>
        <div className={`${WB_STACK} grid gap-4 sm:grid-cols-2 sm:gap-5`}>
          {learningPoints.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-violet-100 bg-[#FDF4FF] p-5 sm:p-6"
              data-aos="fade-up"
            >
              <div className="shrink-0 text-2xl text-[#3B2261] opacity-80">
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className={`${TYPE.h3} mb-1.5`}>{item.title}</h4>
                <p className={TYPE.bodySm}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={WB_CTA_ROW}>
          <button type="button" onClick={onJoinNow} className={WB_CTA}>
            Uncover Life&apos;s Secrets – Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default LearnSection;
