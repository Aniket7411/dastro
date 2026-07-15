import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  Hash,
  Home,
  Layers,
  PlayCircle,
  Star,
  Store,
  UserRound,
} from 'lucide-react';
import {
  PAGE_WRAP,
  TW_KICKER,
  TW_H1,
  TW_H2,
  TW_BODY,
  TW_BODY_SM,
  TW_LEAD,
  TW_STACK,
  TW_STACK_SM,
  SECTION_PY_SM,
  SITE_BAND,
  SITE_BAND_BODY,
  SITE_BAND_TITLE,
  SITE_BTN_COPPER_COMPACT,
  SITE_BTN_TONAL_COMPACT,
  SITE_BTN_TONAL_ON_DARK,
  SITE_CARD,
} from '../../utils/siteTokens';

const SECTION = SECTION_PY_SM;
const SECTION_ALT = 'border-t border-site-border bg-site-surface';
const SECTION_MAX = 'mx-auto max-w-3xl';

export const ABOUT_SEO = {
  title: 'About Damini Shukla | Celebrity Astrologer & Founder – DS Astro Institute',
  description:
    'Meet Damini Shukla — celebrity Vedic astrologer with 10+ years of experience, 5,000+ consultations & 10,000+ students trained across 20+ countries. Learn about DS Astro Institute.',
};

export const ABOUT_FAQ = [
  {
    q: 'Who is Damini Shukla?',
    a: 'Damini Shukla is a celebrity astrologer and teacher with over 10 years of experience, having consulted more than 5,000 clients across 20+ countries and taught over 10,000 students across live and recorded programmes. She specialises in Vedic astrology, tarot, numerology, face reading, and Vastu Shastra.',
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
  {
    q: 'How can I book an astrology consultation with Damini Shukla?',
    a: 'Click "Book Consultation" anywhere on the site, choose your consultation type and time slot, and complete the payment. You\'ll receive confirmation with your call/video details on WhatsApp and email.',
  },
  {
    q: 'What details do I need to share for a kundli reading?',
    a: 'Your date of birth, exact time of birth, and place of birth. If your birth time is unknown, our astrologers can still guide you using alternative techniques like prashna and tarot.',
  },
  {
    q: 'How much does an astrology consultation cost?',
    a: 'Consultation fees vary by type and duration. Visit our Consultations page for current pricing, or chat with our team for guidance on which consultation suits your question best.',
  },
  {
    q: 'Are the astrology courses certified?',
    a: 'Yes. Every student receives a certificate from DS Astro Institute on successful completion, along with the practical chart-reading skills to begin their own practice.',
  },
  {
    q: 'Can beginners with no background join the astrology courses?',
    a: 'Absolutely. Our foundation batches assume zero prior knowledge and build up step by step — many of our 10,000+ students started as complete beginners.',
  },
  {
    q: 'Does DS Astro Institute provide remedies and gemstone recommendations?',
    a: 'Yes. Every consultation includes practical, personalised remedies. Certified gemstones, yantras, and spiritual essentials are available through our Astrology Shop.',
  },
];

const STATS = [
  { value: '10+', label: 'Years Experience' },
  { value: '5,000+', label: 'Total Consultations' },
  { value: '10,000+', label: 'Students Trained' },
  { value: '20+', label: 'Countries Served' },
];

const SCIENCES = [
  {
    title: 'Vedic Astrology',
    text: 'In-depth kundli analysis — birth chart, dashas, transits & clear life direction.',
    Icon: Star,
  },
  {
    title: 'Tarot Reading',
    text: 'Focused tarot card readings for clarity when decisions feel uncertain.',
    Icon: Layers,
  },
  {
    title: 'Numerology',
    text: 'Name and number analysis that reveals patterns shaping destiny and choice.',
    Icon: Hash,
  },
  {
    title: 'Face Reading',
    text: 'Character, strengths, and tendencies revealed through Samudrik Shastra.',
    Icon: UserRound,
  },
  {
    title: 'Vastu Shastra',
    text: 'Vastu consultation for home and workspace — aligned for peace and prosperity.',
    Icon: Home,
  },
];

const OFFERINGS = [
  {
    title: 'Personal consultations',
    text: 'One-on-one astrology consultation for career, love & marriage, business, health, finances, and muhurat.',
    to: '/consultations',
    cta: 'Book consultation',
    Icon: CalendarCheck,
  },
  {
    title: 'Live courses',
    text: 'Learn Vedic astrology live with Damini — from foundations to advanced professional mastery, with certification.',
    to: '/live-courses',
    cta: 'View live courses',
    Icon: GraduationCap,
  },
  {
    title: 'Recorded courses',
    text: 'Self-paced online astrology courses — study anytime, anywhere, with lifetime access.',
    to: '/recorded-courses',
    cta: 'Browse recorded',
    Icon: PlayCircle,
  },
  {
    title: 'Webinars & masterclasses',
    text: 'Focused live sessions on the topics that matter most — remedies, predictions & practice.',
    to: '/webinar',
    cta: 'Join a webinar',
    Icon: BookOpen,
  },
  {
    title: 'Astrology shop',
    text: 'Energised remedies, certified gemstones, yantras, and spiritual essentials — curated by Damini.',
    to: '/shop',
    cta: 'Visit shop',
    Icon: Store,
  },
];

const TRUST_POINTS = [
  'Real experience, not empty promises — every reading is grounded in years of practice',
  'Honest guidance — clarity and remedies, never fear-based pressure',
  'Authentic tradition — remedies and teachings that respect the classical sciences',
  'Empowering education — courses designed to make you truly capable, not just informed',
  'A guide who has done it all — a celebrated, celebrity-trusted astrologer in your corner',
];

/** Brass rule from design system §signature divider */
function BrassRule({ className = '' }) {
  return (
    <div
      className={`my-2 flex items-center gap-3 text-site-gold sm:gap-4 ${className}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-site-gold to-transparent" />
      <span className="font-body text-[13px] tracking-[0.4em] text-site-accent-dark">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-site-gold to-transparent" />
    </div>
  );
}

function SectionIntro({ kicker, title, titleHighlight, subtitle, align = 'left', children }) {
  const centered = align === 'center';

  return (
    <header className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'} ${TW_STACK_SM}`}>
      {kicker ? <p className={`${TW_KICKER} ${centered ? 'mx-auto' : ''}`}>{kicker}</p> : null}
      <h2 className={TW_H2}>
        {title}
        {titleHighlight ? (
          <>
            {' '}
            <span className="text-site-accent">{titleHighlight}</span>
          </>
        ) : null}
      </h2>
      {centered ? (
        <div
          className="mx-auto h-1 w-12 rounded-full bg-gradient-to-r from-site-accent via-site-accent-dark to-site-accent"
          aria-hidden
        />
      ) : (
        <div
          className="h-1 w-12 rounded-full bg-gradient-to-r from-site-accent via-site-accent-dark to-site-accent"
          aria-hidden
        />
      )}
      {subtitle ? (
        <p className={`${TW_BODY} text-site-muted ${centered ? '' : 'max-w-xl'}`}>{subtitle}</p>
      ) : null}
      {children}
    </header>
  );
}

function AboutHeroImage({ className = '' }) {
  return (
    <figure className={`relative mx-auto w-full max-w-[23rem] sm:max-w-md lg:max-w-[26rem] xl:max-w-lg ${className}`}>
      <span
        className="pointer-events-none absolute -inset-3 rounded-[1.25rem] bg-site-accent/12 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[14px] border border-site-border bg-site-sand shadow-[0_12px_28px_rgba(51,37,26,0.10)]">
        <img
          src="/images/damini.webp"
          alt="Damini Shukla - Celebrity Astrologer and Founder of DS Astro Institute"
          className="mx-auto block h-auto max-h-[25rem] w-full object-contain object-center sm:max-h-[28rem] lg:max-h-[31rem]"
          loading="eager"
        />
      </div>
      <figcaption className="mt-3 rounded-xl border border-site-border bg-site-surface px-3 py-2 text-center shadow-sm sm:px-3.5 sm:py-2.5">
        <p className="m-0 font-heading text-sm font-bold text-site-text">Damini Shukla</p>
        <p className="m-0 mt-0.5 font-body text-[12px] text-site-muted">Celebrity Astrologer · Mentor</p>
      </figcaption>
    </figure>
  );
}

export function AboutHero() {
  return (
    <section className={`relative overflow-hidden border-b border-site-border bg-site-bg ${SECTION}`}>
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(162,94,42,0.10),transparent_50%)]"
        aria-hidden
      />
      <div className={`${PAGE_WRAP} relative z-10`}>
        <div className="grid items-start gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-10 xl:gap-12">
          <div className={`${TW_STACK} gap-5`}>
            <div>
              <p className={TW_KICKER}>Astrology · Learning · Guidance</p>
              <h1 className={`${TW_H1} mt-2`}>
                About <span className="text-site-accent">DS Astro Institute</span>
              </h1>
              <p className={`mt-4 ${TW_LEAD}`}>
                India&apos;s trusted institute for Vedic astrology consultations and certified astrology courses —
                guided by celebrity astrologer Damini Shukla.
              </p>
            </div>

            <div className="lg:hidden">
              <AboutHeroImage />
            </div>

            <div className={`${TW_STACK} gap-4`}>
              <p className={TW_BODY}>
                DS Astro Institute was born from a simple belief: that the wisdom of the stars, when read with
                honesty and heart, can bring clarity to life&apos;s most uncertain moments. At the centre of it
                stands <strong className="font-semibold text-site-text">Damini Shukla</strong> — a celebrated Vedic
                astrologer, teacher, and mentor who has spent more than a decade helping people across India and
                abroad find direction, purpose, and peace.
              </p>
              <p className={`${TW_BODY} text-site-muted`}>
                For thousands across India and around the world, DS Astro Institute has become a trusted space
                — not for fear or superstition, but for genuine understanding, practical remedies, and the quiet
                confidence that comes from knowing what the stars have to say. From online kundli{' '}
                <Link to="/consultations" className="font-semibold text-site-accent-dark no-underline hover:underline">
                  consultations
                </Link>{' '}
                to certified astrology{' '}
                <Link to="/live-courses" className="font-semibold text-site-accent-dark no-underline hover:underline">
                  courses
                </Link>
                , everything we do is built on accuracy, honesty, and practical remedies — never fear.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link to="/consultations" className={`${SITE_BTN_COPPER_COMPACT} !no-underline`}>
                <CalendarCheck size={14} aria-hidden />
                Book consultation
              </Link>
              <Link to="/live-courses" className={`${SITE_BTN_TONAL_COMPACT} !no-underline`}>
                Explore courses
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <AboutHeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTeamImage({ className = '' }) {
  return (
    <figure className={`relative mx-auto w-full max-w-md lg:max-w-none ${className}`}>
      <span
        className="pointer-events-none absolute -inset-3 rounded-[1.25rem] bg-site-accent/12 blur-2xl"
        aria-hidden
      />
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-site-border bg-site-sand shadow-[0_12px_28px_rgba(51,37,26,0.10)] sm:aspect-video">
        <img
          src="/images/teamimage.webp"
          alt="Damini Shukla with the DS Astro Institute team of astrologers"
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-3 rounded-xl border border-site-border bg-site-surface px-3 py-2 text-center shadow-sm sm:px-3.5 sm:py-2.5">
        <p className="m-0 font-heading text-sm font-bold text-site-text">Damini Shukla with fellow astrologers &amp; the DS Astro Institute mentor team</p>
        <p className="m-0 mt-0.5 font-body text-[12px] text-site-muted">Guidance rooted in experience, delivered by a dedicated team</p>
      </figcaption>
    </figure>
  );
}

export function AboutDamini() {
  return (
    <section className={`${SECTION_ALT} py-6 sm:py-8`}>
      <div className={PAGE_WRAP}>
        <div className="grid items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-14">
          <AboutTeamImage />

          <div className={`${TW_STACK} gap-3`}>
            <SectionIntro
              kicker="The woman behind the practice"
              title="Damini"
              titleHighlight="Shukla"
            />

            <div className={`${TW_STACK} gap-2.5`}>
              <p className={TW_BODY}>
                Damini&apos;s connection with astrology began not as a profession, but as a fascination. Even as a
                child, she was drawn to the language of the planets — the sense that everything in the universe is
                quietly connected. That early curiosity grew into a lifelong calling.
              </p>
              <p className={`${TW_BODY} text-site-muted`}>
                Over the years, she trained under several respected gurus and traditions, refining her craft until
                she became one of the sought-after names in Vedic astrology. She has served as a senior astrologer
                and mentor on India&apos;s leading astrology platforms — including Astrotalk, Astroyogi, and the
                Academy of Vedic Vidya — guiding more than 5,000 clients across 20+ countries and 10,000+ aspiring astrologers.
              </p>
              <p className={`${TW_BODY} text-site-muted`}>
                Her work has also reached the screen: Damini featured as an astrology consultant on the television
                show <em className="not-italic font-semibold text-site-text">Wheel of Fortune</em> alongside Akshay
                Kumar, and today she is a trusted celebrity astrologer to public figures who value discretion and
                depth in equal measure.
              </p>
              <p className={TW_BODY}>
                But ask her what she&apos;s proudest of, and the answer isn&apos;t the fame — it&apos;s the thousands
                of lives she&apos;s helped steady, and the students she&apos;s guided onto their own path as
                astrologers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSciences() {
  return (
    <section className={`bg-site-bg ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <SectionIntro
          align="center"
          kicker="Our specialities"
          title="Vedic Astrology, Tarot, Numerology,"
          titleHighlight="Face Reading & Vastu"
          subtitle="Where many specialise in a single art, Damini reads across five sacred sciences — so every question is answered from every angle."
        >
          <p className={`${TW_BODY_SM} font-semibold text-site-accent-dark`}>
            Consultations in Hindi and English.
          </p>
        </SectionIntro>

        <ul className="mt-7 m-0 grid list-none grid-cols-1 gap-3 p-0 min-[480px]:grid-cols-2 sm:mt-8 sm:gap-3.5 lg:grid-cols-3 xl:grid-cols-5">
          {SCIENCES.map(({ title, text, Icon }) => (
            <li key={title} className="min-w-0">
              <article className="flex h-full flex-col rounded-[14px] border border-site-border bg-site-surface p-4 shadow-[0_2px_5px_rgba(51,37,26,0.06)] transition duration-150 hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(51,37,26,0.10)] sm:p-[1.125rem]">
                <span
                  className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-site-sand text-site-accent-dark ring-1 ring-site-border"
                  aria-hidden
                >
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="m-0 font-heading text-[1.125rem] font-bold leading-snug text-site-text sm:text-lg">
                  {title}
                </h3>
                <p className="m-0 mt-2 flex-1 font-body text-[15px] leading-relaxed text-site-muted">
                  {text}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutStats() {
  return (
    <section className={`${SECTION_ALT} ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <SectionIntro
          align="center"
          kicker="By the numbers"
          title="A record that"
          titleHighlight="grows every day"
          subtitle="Experience isn’t a claim here — it’s a record."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-[14px] border border-site-border bg-site-bg px-3 py-5 text-center shadow-[0_2px_5px_rgba(51,37,26,0.06)] sm:px-4 sm:py-6"
            >
              <p className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold leading-none tracking-tight text-site-accent-dark tabular-nums">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-site-muted sm:text-[13px]">
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
        <SectionIntro
          kicker="What we offer"
          title="Our Services —"
          titleHighlight="Consultations, Courses, Webinars & More"
          subtitle="Whether you’re looking for an answer today or a lifelong skill, there’s a path here for you."
        />

        <div className="mt-7 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:mt-8 lg:grid-cols-3 lg:gap-3">
          {OFFERINGS.map(({ title, text, to, cta, Icon }) => (
            <article
              key={title}
              className={`${SITE_CARD} flex h-full min-w-0 flex-col p-3.5 sm:p-4`}
            >
              <span
                className="mb-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-site-sand text-site-accent-dark ring-1 ring-site-border"
                aria-hidden
              >
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <h3 className="m-0 font-heading text-[1.05rem] font-bold leading-snug text-site-text sm:text-[1.125rem]">
                {title}
              </h3>
              <p className="m-0 mt-1.5 flex-1 font-body text-[13px] leading-snug text-site-muted sm:text-[14px] sm:leading-relaxed">
                {text}
              </p>
              <Link
                to={to}
                className={`${SITE_BTN_TONAL_COMPACT} mt-3 w-full !no-underline`}
              >
                {cta}
                <ArrowRight size={13} aria-hidden />
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
      <div className={`${PAGE_WRAP} ${SECTION_MAX}`}>
        <div className="rounded-[14px] border border-site-border bg-site-bg p-6 sm:p-8 lg:p-10">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-site-sand text-site-accent-dark ring-1 ring-site-border">
            <Globe2 size={20} strokeWidth={1.75} aria-hidden />
          </div>
          <SectionIntro
            kicker="Who we guide"
            title="Trusted Across India"
            titleHighlight="& by Indians Worldwide"
          />
          <p className={`${TW_BODY} mt-4 text-site-muted`}>
            From Lucknow to London, DS Astro Institute serves a growing community of seekers across India and NRIs
            around the world. All consultations and courses are conducted online — by call or video, in Hindi and
            English — so genuine guidance is never limited by distance or time zone.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutTrust() {
  return (
    <section className={`bg-site-bg ${SECTION}`}>
      <div className={PAGE_WRAP}>
        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <SectionIntro
            kicker="Why people trust DS Astro Institute"
            title="Clarity,"
            titleHighlight="not fear"
            subtitle="The stars have always been speaking. DS Astro Institute simply helps you listen — with honest analysis, practical remedies, and zero fear-mongering."
          />

          <ul className="m-0 flex list-none flex-col divide-y divide-site-border overflow-hidden rounded-[14px] border border-site-border bg-site-surface p-0 shadow-[0_2px_5px_rgba(51,37,26,0.08)]">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex gap-3 px-4 py-4 sm:gap-3.5 sm:px-5 sm:py-5">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-site-accent-dark"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className={`m-0 ${TW_BODY_SM}`}>{point}</p>
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
      <div className={`${PAGE_WRAP} ${SECTION_MAX}`}>
        <SectionIntro
          align="center"
          kicker="Frequently asked questions"
          title="Common"
          titleHighlight="questions"
        />

        <div className="mt-8 flex flex-col gap-2.5 sm:mt-10">
          {ABOUT_FAQ.map((item) => (
            <details
              key={item.q}
              name="about-faq"
              className="group rounded-[14px] border border-site-border bg-site-bg open:bg-site-surface open:shadow-[0_6px_15px_rgba(51,37,26,0.10)]"
            >
              <summary className="cursor-pointer list-none px-4 py-4 font-heading text-[15px] font-semibold text-site-text marker:content-none sm:px-5 sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span className="leading-snug">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className="mt-0.5 shrink-0 text-site-accent-dark transition duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </span>
              </summary>
              <p className={`border-t border-site-border px-4 pb-4 pt-3 sm:px-5 ${TW_BODY_SM}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutCta() {
  return (
    <section className="border-t border-site-border bg-site-bg py-10 sm:py-12 lg:py-14">
      <div className={PAGE_WRAP}>
        <BrassRule className="mb-8 sm:mb-10" />
        <div className={`${SITE_BAND} mx-auto max-w-3xl ${TW_STACK_SM}`}>
          <p className="m-0 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-site-gold">
            Begin today
          </p>
          <h2 className={SITE_BAND_TITLE}>Ready to find your direction?</h2>
          <p className={SITE_BAND_BODY}>
            Book a consultation with Damini Shukla today — and let the stars guide the way.
          </p>
          <div className="flex w-full flex-col gap-2.5 pt-1 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <Link to="/consultations" className={`${SITE_BTN_COPPER_COMPACT} w-full !no-underline sm:w-auto`}>
              <CalendarCheck size={14} aria-hidden />
              Book a consultation
            </Link>
            <Link
              to="/live-courses"
              className={`${SITE_BTN_TONAL_ON_DARK} !min-h-9 !rounded-[10px] !px-4 !py-2 !text-sm w-full !no-underline sm:w-auto`}
            >
              <GraduationCap size={14} aria-hidden />
              Explore courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
