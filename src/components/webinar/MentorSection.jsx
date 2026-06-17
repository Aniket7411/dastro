import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_STACK,
  WB_CTA_ROW,
  TYPE,
} from './tokens';

import WebinarActionButtons from './WebinarActionButtons';

function MentorSection({ onJoinNow, onJoinFree }) {
  const mediaLogos = ['Aaj Tak', 'Fox Interviewer', 'Outlook', 'LatestLY'];

  const listItems = [
    '51+ years of legacy',
    'Thousands of successful consultations completed',
    'Expert in Vedic Astrology, Numerology, and Vastu',
    'Proven track record of training successful astrologers.',
    'Global clientele from India, US, UK, & Middle East',
  ];

  return (
    <section className={`${WB_SECTION} relative overflow-hidden bg-[#3B2261] text-white`}>
      <div className={WB_WRAP}>
        <h2 className={`${TYPE.h2OnDark} mb-6 sm:mb-8`}>
          Meet Your <span className={WB_HIGHLIGHT}>Mentor</span>
        </h2>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div data-aos="fade-right">
            <ul className="m-0 list-none p-0">
              {listItems.map((item) => (
                <li key={item} className="mb-4 flex items-start gap-3 last:mb-0">
                  <i
                    className="fas fa-chevron-right mt-0.5 shrink-0 text-sm text-[#EE6662]"
                    aria-hidden="true"
                  />
                  <span className={TYPE.bodyOnDark}>{item}</span>
                </li>
              ))}
            </ul>
            <div className={`${WB_STACK} space-y-4`}>
              <p className={TYPE.bodySmOnDark}>
                <strong className="!font-semibold !text-white">Award Winning Expert in Astrology &amp; more</strong>
                <br />
                DS Astrology brings expert guidance across astrology and related disciplines like
                numerology, vastu shastra, palmistry, and tarot reading.
              </p>
              <p className={TYPE.bodySmOnDark}>
                <strong className="!font-semibold !text-white">Spiritual Learning Platform</strong>
                <br />
                DS Astrology hosts guided sessions, Q&amp;A series, and learning programs for
                seekers who want practical astrology knowledge with clear mentorship.
              </p>
              <p className={TYPE.bodySmOnDark}>
                <strong className="!font-semibold !text-white">Occult Instructor</strong>
                <br />
                His expertise lies in Numerology, Astrology, Vastu Shastra, Palmistry and has taught
                5K+ students. He is a renowned astrologer and numerologist taking forward a legacy
                of 49 years
              </p>
            </div>
            <div className={WB_CTA_ROW}>
              <WebinarActionButtons onJoinPaid={onJoinNow} onJoinFree={onJoinFree} showUrgency={false} />
            </div>
          </div>
          <div data-aos="fade-left">
            <div className="mx-auto max-w-sm overflow-hidden rounded-xl border-4 border-white/10 lg:max-w-none">
              <img
                src="/images/mentor-ava.png"
                alt="DS Astrology mentor"
                className="block max-h-[280px] w-full object-cover object-top lg:max-h-[320px]"
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-around gap-3 rounded-xl bg-white px-5 py-4 shadow-lg sm:mt-6 sm:px-6">
              {mediaLogos.map((logo) => (
                <div
                  key={logo}
                  className={`${TYPE.media} opacity-80 transition hover:scale-105 hover:opacity-100`}
                >
                  <span className="block border-l-2 border-[#EE6662] pl-2">{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MentorSection;
