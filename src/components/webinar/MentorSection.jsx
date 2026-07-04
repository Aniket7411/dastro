import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_CTA_ROW,
  TYPE,
} from './tokens';

import WebinarActionButtons from './WebinarActionButtons';

const MEDIA_LOGOS = ['Aaj Tak', 'Fox Interviewer', 'Outlook', 'LatestLY'];

const HIGHLIGHTS = [
  '51+ years of legacy',
  'Thousands of successful consultations completed',
  'Expert in Vedic Astrology, Numerology, and Vastu',
  'Proven track record of training successful astrologers.',
  'Global clientele from India, US, UK, & Middle East',
];

const CREDENTIALS = [
  {
    title: 'Award Winning Expert in Astrology & more',
    body: 'DS Astrology brings expert guidance across astrology and related disciplines like numerology, vastu shastra, palmistry, and tarot reading.',
  },
  {
    title: 'Spiritual Learning Platform',
    body: 'DS Astrology hosts guided sessions, Q&A series, and learning programs for seekers who want practical astrology knowledge with clear mentorship.',
  },
  {
    title: 'Occult Instructor',
    body: 'His expertise lies in Numerology, Astrology, Vastu Shastra, Palmistry and has taught 5K+ students. He is a renowned astrologer and numerologist taking forward a legacy of 49 years.',
  },
];

function MentorSection({ onJoinNow, onJoinFree }) {
  return (
    <section className={`${WB_SECTION} relative overflow-hidden bg-[#3B2261] text-white`}>
      <div className={WB_WRAP}>
        <h2 className={`${TYPE.h2OnDark} mb-8 text-center sm:mb-10`}>
          Meet Your <span className={WB_HIGHLIGHT}>Mentor</span>
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
          {/* Photo — centered, sticks near the top on desktop while the bio scrolls */}
          <div
            data-aos="fade-left"
            className="mx-auto w-full max-w-xs text-center lg:sticky lg:top-8 lg:mx-0 lg:max-w-none"
          >
            <div className="overflow-hidden rounded-2xl border-4 border-white/10 shadow-xl">
              <img
                src="/images/mentor-ava.png"
                alt="DS Astrology mentor"
                className="block h-auto w-full object-cover object-top"
                style={{ maxHeight: '320px' }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl bg-white px-5 py-4 shadow-lg sm:gap-x-5">
              {MEDIA_LOGOS.map((logo) => (
                <span
                  key={logo}
                  className={`${TYPE.media} border-l-2 border-[#EE6662] pl-2.5 opacity-80 transition hover:scale-105 hover:opacity-100`}
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div data-aos="fade-right">
            <ul className="m-0 mb-6 grid list-none gap-3 p-0 sm:mb-8 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <i
                    className="fas fa-chevron-right mt-1 shrink-0 text-xs text-[#EE6662]"
                    aria-hidden="true"
                  />
                  <span className={TYPE.bodyOnDark}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              {CREDENTIALS.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <p className="!m-0 font-heading text-sm font-bold text-[#EE6662] sm:text-[0.9375rem]">
                    {item.title}
                  </p>
                  <p className={`${TYPE.bodySmOnDark} mt-1.5`}>{item.body}</p>
                </div>
              ))}
            </div>

            <div className={WB_CTA_ROW}>
              <WebinarActionButtons onJoinPaid={onJoinNow} onJoinFree={onJoinFree} showUrgency={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MentorSection;
