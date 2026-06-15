import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_HEADER,
  WB_TITLE_CENTER,
  WB_STACK,
  TYPE,
} from './tokens';

function ItinerarySection() {
  const days = [
    {
      day: 'DAY 1',
      title: 'The Foundation',
      items: [
        '12 Zodiac Signs & Houses Decode',
        'Role of 9 Planets in Life',
        'Basic Birth Chart Reading',
        'Q&A Session',
      ],
      delay: undefined,
    },
    {
      day: 'DAY 2',
      title: 'Prediction & Remedies',
      items: [
        'Career & Wealth Indicators',
        'Relationship Compatibility',
        'Low-cost Daily Remedies',
        'Live Chart Reading',
      ],
      delay: '200',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_HEADER}>
          <h2 className={WB_TITLE_CENTER}>
            2-Day <span className={WB_HIGHLIGHT}>Itinerary</span>
          </h2>
        </div>
        <div className={`${WB_STACK} grid gap-5 sm:gap-6 lg:grid-cols-2`}>
          {days.map((day) => (
            <div
              key={day.day}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 pt-10 shadow-sm transition hover:-translate-y-1 hover:border-[#EE6662] hover:shadow-md sm:p-7 sm:pt-11"
              data-aos="fade-up"
              data-aos-delay={day.delay}
            >
              <div className="absolute -top-3.5 left-6 rounded-lg bg-[#EE6662] px-4 py-1.5 font-body text-xs font-extrabold text-white shadow-[0_6px_14px_rgba(238,102,98,0.28)] sm:left-7 sm:px-5 sm:text-[0.8125rem]">
                {day.day}
              </div>
              <h3 className={`${TYPE.h2} mb-4 !text-[1.25rem] sm:!text-[1.5rem]`}>{day.title}</h3>
              <ul className="m-0 list-none space-y-3 p-0">
                {day.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <i
                      className="fas fa-play flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs text-[#EE6662]"
                      aria-hidden="true"
                    />
                    <span className={TYPE.lead}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ItinerarySection;
