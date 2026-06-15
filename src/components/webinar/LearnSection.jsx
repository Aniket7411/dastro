import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_CTA,
  WB_SECTION,
  WB_TITLE_CENTER,
  WB_CTA_ROW,
  WB_LEARN_GRID,
  WB_LEARN_CARD,
  WB_LEARN_ICON,
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
        <div className={WB_LEARN_GRID}>
          {learningPoints.map((item) => (
            <div key={item.title} className={WB_LEARN_CARD} data-aos="fade-up">
              <div className={WB_LEARN_ICON}>
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className={`${TYPE.h3} !mb-1`}>{item.title}</h4>
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
