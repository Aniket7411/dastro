import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_STACK,
  TYPE,
} from '../webinar/tokens';

function ItinerarySection() {
  const days = [
    {
      day: 'DAY 1',
      title: 'The Big Four: page padhiye, shabd padhne se pehle',
      items: [
        'Graphology kya hai aur kya nahi - Brain Writing ka concept aur reading ka Golden Rule',
        'Baseline - mood, optimism aur reliability',
        'Slant - emotional expression ka dial, live samples ke saath',
        'Size & Pressure + apni handwriting par Live Self-Reading Practice',
      ],
      homework: 'Day 1 ke baad ek paragraph aur apna signature plain (bina line wale) paper par likhkar group mein bhejiye - Day 2 mein kuch samples live padhe jaayenge.',
      delay: undefined,
    },
    {
      day: 'DAY 2',
      title: 'The Signature: Public Self vs Private Self',
      items: [
        'The 3-Zone Map - intellect, social self aur instinct',
        'Spacing & Margins - closeness, clarity aur time ka attitude',
        'Signature Analysis + Live Signature Reads (students ke aur do jaane-maane Indian signatures)',
        'Graphotherapy: ek correction + Full Live Reading Demo',
      ],
      delay: '200',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_INTRO} mb-6 sm:mb-8`}>
          <h2 className={WB_INTRO_TITLE}>
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
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50" aria-hidden="true">
                      <i className="fas fa-play translate-x-[1px] text-[11px] leading-none text-[#EE6662]" />
                    </span>
                    <span className={TYPE.lead}>{item}</span>
                  </li>
                ))}
              </ul>
              {day.homework && (
                <p className={`${TYPE.bodySm} mt-4 mb-0 text-slate-500 italic`}>{day.homework}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ItinerarySection;
