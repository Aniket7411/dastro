import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  PAGE_WRAP,
  SECTION_PY,
  SECTION_PY_SM,
  TW_KICKER,
  TW_H1,
  TW_H2,
  TW_BODY,
  TW_BODY_SM,
  TW_LEAD,
  TW_STACK,
  TW_STACK_SM,
  SITE_BTN_PRIMARY,
  SITE_BTN_OUTLINE,
} from '../utils/siteTokens';

const expertiseTags = ['Vedic Astrology', 'Tarot Reading', 'Numerology', 'Spiritual Guidance'];

const uniquePoints = [
  { icon: 'fa-moon', text: 'Rooted in classical Vedic principles with practical, modern interpretation' },
  { icon: 'fa-user-check', text: 'Personalised guidance for education, career, relationships, and life decisions' },
  { icon: 'fa-shield-alt', text: 'Confidential consultations with an ethical, client-first approach' },
  { icon: 'fa-graduation-cap', text: 'Structured live and recorded programmes led by experienced mentors' },
];

const aims = [
  'Deliver methodical astrology education that removes fear and superstition',
  'Make quality learning accessible through live batches and recorded courses',
  'Blend traditional scriptures with techniques students can apply confidently',
  'Support learners from first enquiry through certification and practice',
  'Help individuals make clearer, spiritually aware life choices',
  'Build a trusted institute known for integrity, depth, and results',
];

function AboutHeroImage({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="pointer-events-none absolute -inset-3 rounded-2xl bg-site-accent/20 blur-3xl" aria-hidden="true" />
      <img
        src="/aboutus.webp"
        alt="DS Astrology — learn, consult, and grow"
        className="relative z-10 aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover shadow-lg"
      />
      <p className={`relative z-10 mt-3 text-center ${TW_BODY_SM} text-site-soft`}>
        Guided by experienced practitioners and educators
      </p>
    </div>
  );
}

function About() {
  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about DS Astrology — our mission, mentors, and approach to Vedic astrology education and consultations."
        url="/about"
      />

      <section className={`relative overflow-hidden border-b border-site-accent-dark/10 bg-site-bg ${SECTION_PY}`}>
        <span
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,131,42,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <div className={`${PAGE_WRAP} relative z-10`}>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
            <div className={TW_STACK}>
              <div data-aos="fade-right" data-aos-duration="700">
                <span className={TW_KICKER}>About Us</span>
                <h1 className={TW_H1}>DS Astrology</h1>
              </div>

              <div className="lg:hidden" data-aos="fade-left" data-aos-duration="700" data-aos-delay="80">
                <AboutHeroImage />
              </div>

              <div className={TW_STACK}>
                <p className={TW_LEAD}>
                  We are an astrology education and consultation platform dedicated to authentic Vedic learning,
                  professional mentorship, and meaningful guidance for students across India and abroad.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: '5000+', label: 'Students trained' },
                    { value: '15+', label: 'Specialised courses' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col rounded-xl border border-site-accent-dark/12 bg-white px-4 py-3 shadow-sm"
                    >
                      <p className="font-heading text-xl font-bold text-site-primary">{stat.value}</p>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-site-soft">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/live-courses" className={SITE_BTN_PRIMARY}>
                    <i className="fas fa-chalkboard-teacher" aria-hidden="true" />
                    Explore our courses
                  </Link>
                  <Link to="/consultations" className={SITE_BTN_OUTLINE}>
                    <i className="fas fa-comments" aria-hidden="true" />
                    Book a consultation
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="hidden lg:flex lg:justify-end"
              data-aos="fade-left"
              data-aos-duration="700"
              data-aos-delay="80"
            >
              <AboutHeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className={`bg-white ${SECTION_PY}`}>
        <div className={PAGE_WRAP}>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className={TW_STACK} data-aos="fade-up" data-aos-duration="700">
              <div>
                <span className={TW_KICKER}>Who we are</span>
                <h2 className={TW_H2}>
                  A trusted home for <span className="text-site-accent">astrology education</span>
                </h2>
              </div>
              <p className={TW_BODY}>
                DS Astrology was built to make serious astrology training approachable — whether you want to
                start a professional practice, deepen your spiritual understanding, or seek clarity through
                personalised consultations.
              </p>
              <p className={TW_BODY}>
                Under the guidance of <strong className="font-semibold text-site-primary">Damini Ma&apos;am</strong> and
                our faculty, we combine classical Vedic frameworks with structured teaching, live mentorship, and
                self-paced recorded programmes.
              </p>
              <div className="flex flex-wrap gap-2">
                {expertiseTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-site-accent-dark/15 bg-site-bg px-3 py-1.5 text-sm font-semibold text-site-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-duration="700" data-aos-delay="80">
              <div className="rounded-xl border border-site-accent-dark/12 bg-site-bg p-4 shadow-sm">
                <div className="relative h-0 w-full overflow-hidden rounded-xl border border-site-accent-dark/12 bg-black pb-[56.25%]">
                  <video
                    src="/astrologyvideo.mp4"
                    controls
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full rounded-xl object-contain"
                    title="About DS Astrology"
                  />
                </div>
                <p className={`mt-3 text-center ${TW_BODY_SM} text-site-soft`}>
                  Hear how we teach, consult, and support our student community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className={`bg-site-bg ${SECTION_PY}`}>
        <div className={PAGE_WRAP}>
          <div className={`mx-auto mb-8 max-w-xl text-center ${TW_STACK_SM}`} data-aos="fade-up">
            <h2 className={TW_H2}>
              What makes us <span className="text-site-accent">different</span>
            </h2>
            <p className={TW_BODY}>
              Education, ethics, and real-world application — not vague predictions or fear-based advice.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {uniquePoints.map((item, idx) => (
              <div
                key={item.text}
                className="flex h-full flex-col items-center rounded-xl border border-site-accent-dark/12 bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-site-accent/35 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <span
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-site-accent/10 text-base text-site-accent"
                  aria-hidden="true"
                >
                  <i className={`fas ${item.icon}`} />
                </span>
                <p className={TW_BODY_SM}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={`bg-white ${SECTION_PY}`}>
        <div className={PAGE_WRAP}>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
            <div className={TW_STACK} data-aos="fade-right" data-aos-duration="700">
              <h2 className={TW_H2}>
                Our mission & <span className="text-site-accent">objectives</span>
              </h2>
              <p className={TW_BODY}>
                In a fast-changing world, astrology remains a bridge between timeless wisdom and everyday decisions.
                Our goal is to teach it clearly, responsibly, and with outcomes students can trust.
              </p>
              <blockquote className="rounded-xl border border-site-accent-dark/12 border-l-4 border-l-site-accent bg-site-bg p-4">
                <p className={`${TW_BODY_SM} italic text-site-primary`}>
                  &ldquo;Our mission is to simplify astrology and make it practical, accessible, and
                  result-oriented for every sincere learner.&rdquo;
                </p>
              </blockquote>
            </div>

            <ul className="flex flex-col" data-aos="fade-left" data-aos-duration="700" data-aos-delay="80">
              {aims.map((aim) => (
                <li key={aim} className="flex gap-3 border-b border-site-accent-dark/10 py-3 last:border-b-0">
                  <i className="fas fa-check-circle mt-0.5 shrink-0 text-base text-site-accent" aria-hidden="true" />
                  <p className={TW_BODY_SM}>{aim}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`bg-site-bg ${SECTION_PY_SM}`}>
        <div className={PAGE_WRAP}>
          <div
            className={`mx-auto flex max-w-3xl flex-col items-center rounded-xl border border-site-accent-dark/12 bg-white px-6 py-8 text-center shadow-sm sm:px-8 ${TW_STACK_SM}`}
            data-aos="zoom-in"
          >
            <h2 className="font-heading text-xl font-extrabold text-site-primary sm:text-2xl">
              Ready to learn or consult with us?
            </h2>
            <p className={`mx-auto max-w-lg ${TW_BODY}`}>
              Browse live batches, recorded courses, or book a one-to-one session with our team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/recorded-courses" className={SITE_BTN_PRIMARY}>
                <i className="fas fa-play-circle" aria-hidden="true" />
                View recorded courses
              </Link>
              <Link to="/contact" className={SITE_BTN_OUTLINE}>
                <i className="fas fa-envelope" aria-hidden="true" />
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
