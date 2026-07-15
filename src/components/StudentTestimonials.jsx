import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Star } from 'lucide-react';
import { PAGE_WRAP } from './consultation/tokens';
import HomeSectionHeader from './home/HomeSectionHeader';

const STUDENTS = [
  {
    name: 'Aakash Tripathi',
    location: 'Lucknow, UP',
    img: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 5,
    text: 'The Vedic Astrology Deep Dive is outstanding. I learned planetary dashas and yogas in great depth. Real-life case studies in every lesson make the knowledge truly stick.',
    course: 'Vedic Astrology Deep Dive',
  },
  {
    name: 'Sunita Devi Sharma',
    location: 'New Delhi',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
    rating: 5,
    text: 'I enrolled in the Foundation course and it was life-changing. Complex concepts are taught so simply. Now I can read my own birth chart with full confidence.',
    course: 'Foundation in Astrology',
  },
  {
    name: 'Arjun Nair',
    location: 'Bangalore, Karnataka',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    text: "KP Astrology Mastery exceeded all expectations. The precision of predictions using the KP system is phenomenal. I've already started helping family with accurate readings.",
    course: 'KP Astrology Mastery',
  },
  {
    name: 'Meenakshi Iyer',
    location: 'Chennai, Tamil Nadu',
    img: 'https://randomuser.me/api/portraits/women/62.jpg',
    rating: 5,
    text: 'The Guidance & Counseling course transformed how I help people. The blend of ancient wisdom with modern counseling techniques is truly unique and valuable.',
    course: 'Astrology for Guidance',
  },
  {
    name: 'Rohit Bansal',
    location: 'Chandigarh, Punjab',
    img: 'https://randomuser.me/api/portraits/men/38.jpg',
    rating: 5,
    text: 'Started as a complete beginner and now I confidently analyze charts for my community. Structured curriculum, live sessions, and lifetime access make this institute one of a kind.',
    course: 'Foundation in Astrology',
  },
  {
    name: 'Priyanka Joshi',
    location: 'Pune, Maharashtra',
    img: 'https://randomuser.me/api/portraits/women/29.jpg',
    rating: 5,
    text: 'Acharya ji explains every concept with patience and real examples. I can now confidently interpret divisional charts and planetary yogas.',
    course: 'Vedic Astrology Deep Dive',
  },
];

const MARQUEE_ITEMS = [...STUDENTS, ...STUDENTS];

const REVIEW_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'DS Astro Institute',
  url: 'https://dsastroinstitute.com/',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: String(STUDENTS.length),
  },
  review: STUDENTS.map((s) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: s.name },
    reviewRating: { '@type': 'Rating', ratingValue: String(s.rating), bestRating: '5' },
    reviewBody: s.text,
  })),
};

const CARD_W = 'w-[17.5rem] sm:w-[18.5rem]';
const CARD_MIN_H = 'min-h-[17.5rem] sm:min-h-[18rem]';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item, index }) {
  return (
    <article
      className={`st-card flex ${CARD_MIN_H} ${CARD_W} shrink-0 flex-col rounded-xl border border-site-accent-dark/10 bg-white p-4 shadow-[0_2px_12px_rgba(42,15,2,0.06)] transition hover:border-site-accent/25 hover:shadow-[0_8px_24px_rgba(42,15,2,0.08)]`}
      aria-label={`Review from ${item.name}`}
    >
      <span className="mb-2 inline-flex w-fit max-w-full truncate rounded-full bg-site-primary/6 px-2 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-primary">
        {item.course}
      </span>

      <p className="m-0 flex-1 text-sm leading-relaxed text-site-muted">{item.text}</p>

      <div className="mt-3 border-t border-site-accent-dark/8 pt-3">
        <Stars rating={item.rating} />
        <div className="mt-2.5 flex items-center gap-2.5">
          {/* <img
            src={item.img}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border border-site-accent/30 object-cover"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=8B4A1E&color=fff`;
            }}
          /> */}
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-bold text-site-primary">{item.name}</p>
            <p className="m-0 mt-0.5 flex items-center gap-1 text-[0.6875rem] text-site-soft">
              <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden />
              <span className="truncate">{item.location}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function StudentTestimonials() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <section
      className="border-t border-site-accent-dark/8 bg-white py-[clamp(2.5rem,5vw,3.5rem)]"
      aria-labelledby="student-testimonials-heading"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(REVIEW_SCHEMA)}</script>
      </Helmet>
      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="student-testimonials-heading"
          kicker="Student & Client Stories"
          title="Why 15,000+ Students & Clients"
          titleHighlight="Trust DS Astro Institute"
          subtitle="Trusted by thousands of satisfied students across India."
          showAccent
        />

        <div
          className="st-marquee relative"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onTouchStart={() => setHeld(true)}
          onTouchEnd={() => setHeld(false)}
          onTouchCancel={() => setHeld(false)}
        >
          <div className="st-marquee-viewport overflow-hidden" aria-label="Student testimonials">
            <div
              className={`st-marquee-track flex w-max items-stretch gap-3.5 sm:gap-4 ${
                reduceMotion
                  ? 'flex-wrap justify-center gap-4'
                  : 'animate-[marquee-right_52s_linear_infinite] hover:[animation-play-state:paused] active:[animation-play-state:paused]'
              } ${held && !reduceMotion ? '[animation-play-state:paused]' : ''}`}
            >
              {(reduceMotion ? STUDENTS : MARQUEE_ITEMS).map((item, index) => (
                <TestimonialCard key={`${item.name}-${index}`} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .st-marquee-viewport {
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
        }
      `}</style>
    </section>
  );
}
