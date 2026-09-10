import { CheckCircle2, Award, Sparkles, GraduationCap } from 'lucide-react';

const MEDIA_LOGOS = ['Aaj Tak', 'Fox Interviewer', 'Outlook', 'LatestLY'];

const HIGHLIGHTS = [
  '51+ years of legacy',
  'Thousands of successful consultations completed',
  'Expert in Vedic Astrology, Numerology, and Vastu',
  'Proven track record of training successful astrologers',
  'Global clientele from India, US, UK, & Middle East',
];

const CREDENTIALS = [
  {
    icon: Award,
    title: 'Award Winning Expert in Astrology & more',
    body: 'DS Astrology brings expert guidance across astrology and related disciplines like numerology, vastu shastra, palmistry, and tarot reading.',
  },
  {
    icon: Sparkles,
    title: 'Spiritual Learning Platform',
    body: 'DS Astrology hosts guided sessions, Q&A series, and learning programs for seekers who want practical astrology knowledge with clear mentorship.',
  },
  {
    icon: GraduationCap,
    title: 'Occult Instructor',
    body: 'His expertise lies in Numerology, Astrology, Vastu Shastra, Palmistry and has taught 5K+ students. He is a renowned astrologer and numerologist taking forward a legacy of 49 years.',
  },
];

function MentorMeet({ onJoinNow, onJoinFree }) {
  return (
    <section className="relative overflow-hidden bg-[#3B2261] px-4 py-12 text-white sm:px-6 sm:py-14 lg:py-16">
      {/* Ambient background accents */}
      <span
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#EE6662]/10 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#EE6662]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#EE6662]">Your Guide</p>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
            Meet Your <span className="text-[#EE6662]">Mentor</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60 sm:text-base">
            Learn directly from a celebrity astrologer trusted by lakhs of students and seekers across India.
          </p>
        </div>

        {/* Photo + highlights — exact 50/50 split */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border-4 border-white/10 bg-white/5 shadow-2xl">
              <img
                src="/images/damini.webp"
                alt="Damini Shukla - Celebrity Astrologer and DS Astrology mentor"
                className="block h-auto w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#EE6662]" aria-hidden="true" />
                <span className="text-sm leading-snug text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Press mentions — its own full-width band, no column to imbalance */}
        <div className="mx-auto mt-6 flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl bg-white px-5 py-3.5 shadow-lg sm:mt-8">
          {MEDIA_LOGOS.map((logo) => (
            <span
              key={logo}
              className="border-l-2 border-[#EE6662] pl-2.5 text-[11px] font-bold uppercase tracking-wide text-[#3B2261]/80 sm:text-xs"
            >
              {logo}
            </span>
          ))}
        </div>

        {/* Credentials — compact, equal-height grid */}
        <div className="mt-6 grid gap-3 sm:mt-8 lg:grid-cols-3 lg:gap-3.5">
          {CREDENTIALS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-3.5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EE6662]/15">
                  <Icon size={14} className="text-[#EE6662]" aria-hidden="true" />
                </span>
                <p className="m-0 text-[0.8125rem] font-bold leading-tight text-[#EE6662]">{title}</p>
              </div>
              <p className="m-0 text-[0.8125rem] leading-relaxed text-white/70">{body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-2.5 text-center sm:mt-10">
          <button
            type="button"
            onClick={onJoinNow}
            className="w-full max-w-xs rounded-full bg-[#EE6662] px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-[#EE6662]/30 transition hover:-translate-y-0.5 hover:bg-[#e2534f] hover:shadow-xl sm:w-auto"
          >
            Join Masterclass — ₹99
          </button>
          <button
            type="button"
            onClick={onJoinFree}
            className="text-sm font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
          >
            Want to join free webinar?
          </button>
        </div>
      </div>
    </section>
  );
}

export default MentorMeet;
