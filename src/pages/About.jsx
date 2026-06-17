import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const WRAP = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';

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

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-site-primary px-5 py-3 text-sm font-bold text-white no-underline shadow-sm transition hover:-translate-y-0.5 hover:bg-site-accent-dark';

const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-site-primary bg-white px-5 py-3 text-sm font-bold text-site-primary no-underline transition hover:bg-site-primary hover:text-white';

function About() {
  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO
        title="About Us"
        description="Learn about DS Astro Institute — our mission, mentors, and approach to Vedic astrology education and consultations."
        url="/about"
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-site-accent-dark/10 bg-site-bg py-8 sm:py-10 lg:py-12">
        <span
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,131,42,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <div className={`${WRAP} relative z-10`}>
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <div className="flex flex-col gap-6">
              <div data-aos="fade-right" data-aos-duration="700">
                <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-site-accent">
                  About Us
                </span>
                <h1 className="font-heading text-4xl font-extrabold leading-tight text-site-primary sm:text-5xl">
                  DS Astro Institute
                </h1>
              </div>

              <div
                className="lg:hidden"
                data-aos="fade-left"
                data-aos-duration="700"
                data-aos-delay="80"
              >
                <div className="relative w-full">
                  <span className="pointer-events-none absolute -inset-3 rounded-2xl bg-site-accent/20 blur-3xl" aria-hidden="true" />
                  <img
                    src="/aboutus.webp"
                    alt="DS Astro Institute — learn, consult, and grow"
                    className="relative z-10 aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover shadow-lg"
                  />
                  <p className="relative z-10 mt-3 text-center text-xs text-site-soft">
                    Guided by experienced practitioners and educators
                  </p>
                </div>
              </div>

              <div>
                <p className="max-w-xl text-base leading-relaxed text-site-muted sm:text-lg">
                  We are an astrology education and consultation platform dedicated to authentic Vedic learning,
                  professional mentorship, and meaningful guidance for students across India and abroad.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    { value: '5000+', label: 'Students trained' },
                    { value: '15+', label: 'Specialised courses' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-site-accent-dark/12 bg-white px-4 py-2.5 shadow-sm"
                    >
                      <p className="font-heading text-xl font-bold text-site-primary">{stat.value}</p>
                      <p className="mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-site-soft">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/live-courses" className={btnPrimary}>
                    <i className="fas fa-chalkboard-teacher" aria-hidden="true" />
                    Explore our courses
                  </Link>
                  <Link to="/consultations" className={btnOutline}>
                    <i className="fas fa-comments" aria-hidden="true" />
                    Book a consultation
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="hidden justify-end lg:flex"
              data-aos="fade-left"
              data-aos-duration="700"
              data-aos-delay="80"
            >
              <div className="relative w-full">
                <span className="pointer-events-none absolute -inset-3 rounded-2xl bg-site-accent/20 blur-3xl" aria-hidden="true" />
                <img
                  src="/aboutus.webp"
                  alt=""
                  aria-hidden="true"
                  className="relative z-10 aspect-[16/10] w-full rounded-2xl border-4 border-white object-cover shadow-lg"
                />
                <p className="relative z-10 mt-3 text-center text-xs text-site-soft">
                  Guided by experienced practitioners and educators
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className={WRAP}>
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
            <div data-aos="fade-up" data-aos-duration="700">
              <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-site-accent">
                Who we are
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-site-primary sm:text-4xl">
                A trusted home for <span className="text-site-accent">astrology education</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-site-muted">
                DS Astro Institute was built to make serious astrology training approachable — whether you want to
                start a professional practice, deepen your spiritual understanding, or seek clarity through
                personalised consultations.
              </p>
              <p className="mt-4 text-base leading-relaxed text-site-muted">
                Under the guidance of <strong className="font-semibold text-site-primary">Damini Ma&apos;am</strong> and
                our faculty, we combine classical Vedic frameworks with structured teaching, live mentorship, and
                self-paced recorded programmes.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
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
              <div className="rounded-xl border border-site-accent-dark/12 bg-site-bg p-3.5 shadow-sm">
                <div className="relative h-0 w-full overflow-hidden rounded-xl border border-site-accent-dark/12 bg-black pb-[56.25%]">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="About DS Astro Institute"
                    className="absolute inset-0 h-full w-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-center text-sm text-site-soft">
                  Hear how we teach, consult, and support our student community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="bg-site-bg py-8 sm:py-10 lg:py-12">
        <div className={WRAP}>
          <div className="mx-auto mb-6 max-w-xl text-center" data-aos="fade-up">
            <h2 className="font-heading text-3xl font-extrabold text-site-primary sm:text-4xl">
              What makes us <span className="text-site-accent">different</span>
            </h2>
            <p className="mt-3 text-base text-site-muted">
              Education, ethics, and real-world application — not vague predictions or fear-based advice.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {uniquePoints.map((item, idx) => (
              <div
                key={item.text}
                className="flex h-full flex-col items-center rounded-xl border border-site-accent-dark/12 bg-white px-3 py-3.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-site-accent/35 hover:shadow-md"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-site-accent/10 text-base text-site-accent" aria-hidden="true">
                  <i className={`fas ${item.icon}`} />
                </span>
                <p className="text-xs leading-relaxed text-site-muted sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className={WRAP}>
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div data-aos="fade-right" data-aos-duration="700">
              <h2 className="font-heading text-3xl font-extrabold text-site-primary sm:text-4xl">
                Our mission & <span className="text-site-accent">objectives</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-site-muted">
                In a fast-changing world, astrology remains a bridge between timeless wisdom and everyday decisions.
                Our goal is to teach it clearly, responsibly, and with outcomes students can trust.
              </p>
              <blockquote className="mt-5 rounded-xl border border-site-accent-dark/12 border-l-4 border-l-site-accent bg-site-bg p-4">
                <p className="text-sm italic leading-relaxed text-site-primary">
                  &ldquo;Our mission is to simplify astrology and make it practical, accessible, and
                  result-oriented for every sincere learner.&rdquo;
                </p>
              </blockquote>
            </div>

            <ul className="flex flex-col" data-aos="fade-left" data-aos-duration="700" data-aos-delay="80">
              {aims.map((aim) => (
                <li key={aim} className="flex gap-2.5 border-b border-site-accent-dark/10 py-2.5 last:border-b-0">
                  <i className="fas fa-check-circle mt-0.5 shrink-0 text-base text-site-accent" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-site-muted">{aim}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-site-bg py-8 sm:py-10">
        <div className={WRAP}>
          <div className="mx-auto max-w-3xl rounded-xl border border-site-accent-dark/12 bg-white px-5 py-5 text-center shadow-sm sm:px-6" data-aos="zoom-in">
            <h2 className="font-heading text-xl font-extrabold text-site-primary sm:text-2xl">
              Ready to learn or consult with us?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-site-muted sm:text-base">
              Browse live batches, recorded courses, or book a one-to-one session with our team.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <Link to="/recorded-courses" className={btnPrimary}>
                <i className="fas fa-play-circle" aria-hidden="true" />
                View recorded courses
              </Link>
              <Link to="/contact" className={btnOutline}>
                <i className="fas fa-envelope" aria-hidden="true" />
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
