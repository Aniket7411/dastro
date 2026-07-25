import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_CTA_ROW,
  TYPE,
} from '../webinar/tokens';

function MentorSection({ onJoinNow }) {
  const HIGHLIGHTS = [
    'Vedic astrologer & face reading expert',
    'Lead astrologer at DS Astro Institute',
    'Known for simple, practical teaching — no heavy Sanskrit, no confusion'
  ];

  const CREDENTIALS = [
    {
      title: 'Trusted by over 10,000+ followers',
      body: 'Featured on Sony TV and leading media channels. Build a massive following across Instagram & YouTube through accurate, practical teachings.',
    },
    {
      title: '500+ Personal Consultations',
      body: 'Successfully guided individuals across career, marriage & business decisions using Face Reading and Vedic Astrology.',
    },
    {
      title: 'Brand Collaborations',
      body: 'Trusted by leading Indian consumer brands for astrology and personality reading expertise.',
    },
  ];

  return (
    <section className={`${WB_SECTION} relative overflow-hidden bg-[#3B2261] text-white`}>
      <div className={WB_WRAP}>
        <div className="grid items-start gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-14">
          <div
            data-aos="fade-left"
            className="-mx-4 w-[calc(100%+2rem)] max-w-none sm:mx-auto sm:w-full sm:max-w-[20rem] text-center lg:sticky lg:top-8 lg:mx-0 lg:max-w-none"
          >
            <div className="overflow-hidden rounded-none sm:rounded-2xl shadow-xl flex items-center justify-center bg-[#2A1647] sm:bg-transparent sm:h-auto">
              <img
                src="/images/masterclass-mentor.webp"
                alt="Damini Ma'am Portrait"
                className="w-full h-auto object-contain"
                fetchpriority="high"
                loading="eager"
              />
            </div>
          </div>

          <div data-aos="fade-right" className="flex flex-col w-full">
            <h2 className={`${TYPE.h2OnDark} mb-8 w-full text-center lg:text-left sm:mb-10 lg:-mt-2`}>
              Meet Your Mentor — <span className={WB_HIGHLIGHT}>Damini Shukla</span>
            </h2>

            <ul className="m-0 mb-8 flex flex-col gap-4 p-0 sm:mb-10 sm:gap-5 w-full">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 w-full text-left">
                  <i
                    className="fas fa-check-circle shrink-0 mt-1 text-[1.05rem] text-[#EE6662]"
                    aria-hidden="true"
                  />
                  <span className={`${TYPE.bodyOnDark} font-medium text-left`}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 w-full sm:space-y-5">
              {CREDENTIALS.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 text-left sm:p-5">
                  <p className="!m-0 font-heading text-sm font-bold text-[#EE6662] sm:text-[1rem]">
                    {item.title}
                  </p>
                  <p className={`${TYPE.bodySmOnDark} mt-2`}>{item.body}</p>
                </div>
              ))}
            </div>

            <div className={`${WB_CTA_ROW} w-full text-center`}>
              <button
                onClick={onJoinNow}
                className="m-0 mt-4 inline-flex min-h-[3rem] cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-8 py-3 font-body !text-sm !font-bold !text-white shadow-[0_6px_14px_rgba(238,102,98,0.24)] transition duration-300 hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(238,102,98,0.32)] sm:min-h-[3.5rem] sm:px-10 sm:!text-base"
              >
                Join Masterclass — ₹499
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MentorSection;
