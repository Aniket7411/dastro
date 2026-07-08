import { Link } from 'react-router-dom';
import {
  PAGE_WRAP,
  TW_KICKER,
  TW_H1,
  TW_H2,
  TW_H3,
  TW_BODY,
  TW_BODY_SM,
  TW_LEAD,
  TW_STACK,
  TW_STACK_SM,
  SITE_BAND,
  SITE_BAND_BODY,
  SITE_BAND_TITLE,
  SITE_BTN_COPPER_LG,
  SITE_BTN_TONAL_ON_DARK_LG,
  SITE_CARD,
} from '../../utils/siteTokens';

const SECTION = 'py-8 sm:py-10 lg:py-12';
const SECTION_ALT = 'border-t border-site-border bg-site-surface';

export const ABOUT_SEO = {
  title: 'About Damini Shukla — Celebrity Astrologer',
  description:
    'Meet Damini Shukla — celebrity astrologer with 10+ years’ experience and 4,000+ clients. Vedic astrology, tarot, numerology, face reading & Vastu consultations and courses.',
};

export const ABOUT_FAQ = [
  {
    q: 'Who is Damini Shukla?',
    a: 'Damini Shukla is a celebrity astrologer and teacher with over 10 years of experience, having consulted more than 4,000 clients and taught over 15,000 students across live and recorded programmes. She specialises in Vedic astrology, tarot, numerology, face reading, and Vastu Shastra.',
  },
  {
    q: 'What services does DS Astro Institute offer?',
    a: 'Personal astrology consultations, live and recorded courses for all levels, webinars and masterclasses, and a curated online shop of remedies and spiritual products.',
  },
  {
    q: 'Does DS Astro Institute offer online astrology consultations?',
    a: 'Yes. Consultations are available online for clients across India and abroad, conducted in both Hindi and English.',
  },
  {
    q: 'Can I learn astrology from Damini Shukla?',
    a: 'Absolutely. DS Astro Institute offers structured courses from beginner to advanced level — both live and self-paced recorded programmes — for anyone who wishes to learn astrology, tarot, numerology, or Vastu.',
  },
  {
    q: 'Which astrology systems does Damini Shukla practise?',
    a: 'Vedic astrology, tarot, numerology, face reading, and Vastu Shastra.',
  },
];

const STATS = [
  { value: '10+', label: 'Years of practice' },
  { value: '4,000+', label: 'Clients consulted' },
  { value: '5,000+', label: 'Students taught live' },
  { value: '10,000+', label: 'Online learners' },
];

const SCIENCES = [
  {
    title: 'Vedic Astrology',
    text: 'Deep birth-chart analysis, timing (dashas & transits), and life direction.',
    icon: 'fa-star',
  },
  {
    title: 'Tarot',
    text: 'Intuitive, question-focused readings for clarity and decision-making.',
    icon: 'fa-clone',
  },
  {
    title: 'Numerology',
    text: 'The hidden influence of numbers on name, destiny, and choices.',
    icon: 'fa-hashtag',
  },
  {
    title: 'Face Reading',
    text: 'Insight into character and tendencies through the science of the face.',
    icon: 'fa-user-circle',
  },
  {
    title: 'Vastu Shastra',
    text: 'Aligning your home and workspace with positive, prosperous energy.',
    icon: 'fa-home',
  },
];

const OFFERINGS = [
  {
    title: 'Personal consultations',
    text: 'Career, love and marriage, business, health, finances, and auspicious timing (muhurat).',
    to: '/consultations',
    cta: 'Book consultation',
  },
  {
    title: 'Live courses',
    text: 'Learn directly from Damini, from beginner foundations to advanced mastery.',
    to: '/live-courses',
    cta: 'View live courses',
  },
  {
    title: 'Recorded courses',
    text: 'Study at your own pace, anytime, anywhere in the world.',
    to: '/recorded-courses',
    cta: 'Browse recorded',
  },
  {
    title: 'Webinars & masterclasses',
    text: 'Focused sessions on the topics that matter most.',
    to: '/webinar',
    cta: 'Join a webinar',
  },
  {
    title: 'Astrology shop',
    text: 'Carefully curated remedies, gemstones, yantras, and spiritual essentials.',
    to: '/shop',
    cta: 'Visit shop',
  },
];

const TRUST_POINTS = [
  'Real experience, not empty promises — every reading is grounded in years of practice',
  'Honest guidance — clarity and remedies, never fear-based pressure',
  'Authentic tradition — remedies and teachings that respect the classical sciences',
  'Empowering education — courses designed to make you truly capable, not just informed',
  'A guide who has done it all — a celebrated, celebrity-trusted astrologer in your corner',
];

function SectionKicker({ children }) {
  return (
    <span className="mb-2 inline-flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-[0.16em] text-site-accent sm:text-xs">
      <span className="text-site-accent" aria-hidden>
        ✦
      </span>
      {children}
    </span>
  );
}

function AboutHeroImage({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="pointer-events-none absolute -inset-3 rounded-2xl bg-site-accent/20 blur-3xl" aria-hidden />
      <img
        src="/aboutus.webp"
        alt="Damini Shukla — DS Astro Institute"
        className="relative z-10 aspect-[4/5] w-full max-w-md rounded-2xl border-4 border-white object-cover object-top shadow-lg sm:aspect-[16/11] lg:max-w-none"
        loading="lazy"
      />
    </div>
  );
}

export function AboutHero() {
  return (
    <section className={`relative overflow-hidden border-b border-site-accent-dark/10 bg-site-bg ${SECTION}`}>
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,131,42,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className={`${PAGE_WRAP} relative z-10`}>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <div className={`${TW_STACK} gap-4 sm:gap-5`}>
            <div>
              <p className={`${TW_KICKER} mb-2`}>Astrology · Learning · Guidance</p>
              <h1 className={TW_H1}>About DS Astro Institute</h1>
              <p className={`mt-3 ${TW_LEAD}`}>
                Guidance rooted in the cosmos — and a decade of devotion.
              </p>
            </div>

            <div className="lg:hidden">
              <AboutHeroImage />
            </div>

            <p className={TW_BODY}>
              DS Astro Institute was born from a simple belief: that the wisdom of the stars, when read with
              honesty and heart, can bring clarity to life&apos;s most uncertain moments. At the centre of it
              stands <strong className="font-semibold text-site-primary">Damini Shukla</strong> — a celebrated
              astrologer, teacher, and guide who has spent more than ten years helping people find direction,
              purpose, and peace.
            </p>
            <p className={TW_BODY}>
              For thousands across India and around the world, DS Astro Institute has become a trusted space
              — not for fear or superstition, but for genuine understanding, practical remedies, and the quiet
              confidence that comes from knowing what the stars have to say.
            </p>
          </div>

          <div className="hidden lg:block">
            <AboutHeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutDaminiVideo({ className = '' }) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-site-accent-dark/12 bg-black shadow-md">
        <video
          src="/astrologyvideo.mp4"
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full object-cover"
          title="About DS Astro Institute"
        />
      </div>
      <figcaption className={`mt-3 text-center ${TW_BODY_SM}`}>
        Hear how we teach, consult, and support our community
      </figcaption>
    </figure>
  );
}

export function AboutDamini() {
  return (
    <section className={`${SECTION_ALT} ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 xl:gap-12">
          <div className={`${TW_STACK} gap-4 sm:gap-5`}>
            <div>
              <SectionKicker>The woman behind the practice</SectionKicker>
              <h2 className={TW_H2}>Damini Shukla</h2>
            </div>
            <div className={`${TW_STACK} gap-4`}>
              <p className={TW_BODY}>
                Damini&apos;s connection with astrology began not as a profession, but as a fascination. Even as a
                child, she was drawn to the language of the planets — the sense that everything in the universe is
                quietly connected. That early curiosity grew into a lifelong calling.
              </p>
              <p className={TW_BODY}>
                Over the years, she trained under several respected gurus and traditions, refining her craft until
                she became one of the sought-after names in the field. She has served as a senior astrologer and
                mentor on India&apos;s leading platforms — including Astrotalk, Astroyogi, and the Academy of Vedic
                Vidya — guiding both clients and aspiring astrologers alike.
              </p>
              <p className={TW_BODY}>
                Her work has also reached the screen: Damini featured as an astrology consultant on the television
                show <em className="text-site-primary">Wheel of Fortune</em> alongside Akshay Kumar, and today she is
                a trusted celebrity astrologer to public figures who value discretion and depth in equal measure.
              </p>
              <p className={TW_BODY}>
                But ask her what she&apos;s proudest of, and the answer isn&apos;t the fame — it&apos;s the thousands
                of lives she&apos;s helped steady, and the students she&apos;s guided onto their own path as
                astrologers.
              </p>
            </div>
          </div>

          <AboutDaminiVideo className="w-full lg:sticky lg:top-[calc(var(--spacing-site-header)+1.5rem)]" />
        </div>
      </div>
    </section>
  );
}

export function AboutSciences() {
  return (
    <section className={`bg-site-bg ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className={`mx-auto mb-6 max-w-2xl text-center sm:mb-8 ${TW_STACK_SM}`}>
          <SectionKicker>A rare command of the sacred sciences</SectionKicker>
          <h2 className={TW_H2}>Breadth that shapes every reading</h2>
          <p className={TW_BODY}>
            Where many specialise in a single art, Damini reads across several — allowing her to look at a
            question from every angle and give guidance that truly fits.
          </p>
          <p className={`${TW_BODY_SM} font-semibold text-site-accent-dark`}>
            Consultations offered warmly in Hindi and English.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SCIENCES.map((item) => (
            <article
              key={item.title}
              className={`${SITE_CARD} flex h-full flex-col p-4 sm:p-5`}
            >
              <span
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-site-accent/10 text-site-accent-dark"
                aria-hidden
              >
                <i className={`fas ${item.icon} text-sm`} />
              </span>
              <h3 className={`${TW_H3} text-base sm:text-lg`}>{item.title}</h3>
              <p className={`mt-2 flex-1 ${TW_BODY_SM}`}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutStats() {
  return (
    <section className={`${SECTION_ALT} ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className={`mx-auto mb-6 max-w-xl text-center sm:mb-8 ${TW_STACK_SM}`}>
          <SectionKicker>DS Astro Institute, by the numbers</SectionKicker>
          <p className={TW_BODY}>
            Experience isn&apos;t a claim here — it&apos;s a record. And it grows every day.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-site-accent-dark/12 bg-site-bg px-3 py-4 text-center shadow-sm sm:px-4 sm:py-5"
            >
              <p className="font-price text-2xl font-extrabold tracking-tight text-site-accent-dark sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 font-body text-[10px] font-bold uppercase tracking-wide text-site-muted sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutOfferings() {
  return (
    <section className={`bg-site-bg ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className={`mb-6 sm:mb-8 ${TW_STACK_SM}`}>
          <SectionKicker>What we offer</SectionKicker>
          <h2 className={TW_H2}>A path for every seeker</h2>
          <p className={`max-w-2xl ${TW_BODY}`}>
            Whether you&apos;re looking for an answer today or a lifelong skill, there&apos;s a path here for you.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
          {OFFERINGS.map((item) => (
            <article
              key={item.title}
              className={`${SITE_CARD} flex h-full flex-col p-4 sm:p-5`}
            >
              <h3 className={`${TW_H3} text-base`}>{item.title}</h3>
              <p className={`mt-2 flex-1 ${TW_BODY_SM}`}>{item.text}</p>
              <Link
                to={item.to}
                className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-bold text-site-accent-dark no-underline transition hover:text-site-accent"
              >
                {item.cta}
                <i className="fas fa-arrow-right text-[10px]" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutAudience() {
  return (
    <section className={`${SECTION_ALT} ${SECTION}`}>
      <div className={`${PAGE_WRAP} max-w-3xl`}>
        <SectionKicker>Who we guide</SectionKicker>
        <h2 className={`${TW_H2} mb-3 sm:mb-4`}>Across India and beyond</h2>
        <p className={TW_BODY}>
          DS Astro Institute serves a growing community across India and among Indians settled abroad. Whether
          you&apos;re navigating a crossroads at home or seeking familiar wisdom from across the seas, distance
          is never a barrier — genuine guidance travels with you.
        </p>
      </div>
    </section>
  );
}

export function AboutTrust() {
  return (
    <section className={`bg-site-bg ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div className={TW_STACK_SM}>
            <SectionKicker>Why people trust DS Astro Institute</SectionKicker>
            <h2 className={TW_H2}>Clarity, not fear</h2>
            <p className={TW_BODY}>
              The stars have always been speaking. DS Astro Institute simply helps you listen.
            </p>
          </div>
          <ul className="flex flex-col divide-y divide-site-border rounded-2xl border border-site-border bg-site-surface px-4 shadow-[0_2px_5px_rgba(51,37,26,0.08)] sm:px-5">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex gap-3 py-3.5 first:pt-4 last:pb-4 sm:py-4">
                <i className="fas fa-check-circle mt-0.5 shrink-0 text-site-accent" aria-hidden />
                <p className={TW_BODY_SM}>{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function AboutFaq() {
  return (
    <section className={`${SECTION_ALT} ${SECTION}`}>
      <div className={`${PAGE_WRAP} max-w-3xl`}>
        <div className={`mb-5 sm:mb-6 ${TW_STACK_SM}`}>
          <SectionKicker>Frequently asked questions</SectionKicker>
          <h2 className={TW_H2}>Common questions</h2>
        </div>
        <div className="flex flex-col gap-2">
          {ABOUT_FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-site-border bg-site-surface px-4 py-1 shadow-[0_2px_5px_rgba(51,37,26,0.08)] open:shadow-[0_6px_15px_rgba(51,37,26,0.12)] sm:px-5"
            >
              <summary className="cursor-pointer list-none py-3.5 font-body text-sm font-bold text-site-primary marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <i
                    className="fas fa-chevron-down shrink-0 text-xs text-site-accent transition group-open:rotate-180"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className={`border-t border-site-accent-dark/8 pb-4 pt-3 ${TW_BODY_SM}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutCta() {
  return (
    <section className="border-t border-site-accent-dark/8 bg-site-bg py-8 sm:py-10">
      <div className={PAGE_WRAP}>
        <div className={`${SITE_BAND} mx-auto max-w-3xl ${TW_STACK_SM}`}>
          <h2 className={SITE_BAND_TITLE}>Ready to find your direction?</h2>
          <p className={SITE_BAND_BODY}>
            Book a consultation with Damini Shukla today — and let the stars guide the way.
          </p>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              to="/consultations"
              className={`${SITE_BTN_COPPER_LG} w-full !no-underline sm:w-auto`}
            >
              <i className="fas fa-calendar-check" aria-hidden />
              Book a consultation
            </Link>
            <Link
              to="/live-courses"
              className={`${SITE_BTN_TONAL_ON_DARK_LG} w-full !no-underline sm:w-auto`}
            >
              <i className="fas fa-graduation-cap" aria-hidden />
              Explore courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
