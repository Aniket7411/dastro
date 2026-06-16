import { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
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

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          aria-hidden
        />
      ))}
      <span className="ml-1 font-body text-xs font-bold text-site-muted">{rating}.0</span>
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="st-card flex h-full min-h-full w-[min(100%,18.5rem)] shrink-0 snap-start flex-col rounded-2xl border border-site-accent-dark/12 bg-white p-4 shadow-[0_4px_18px_rgba(42,15,2,0.07)] transition hover:-translate-y-0.5 hover:border-site-accent/30 hover:shadow-[0_12px_28px_rgba(42,15,2,0.1)] sm:w-[min(100%,20rem)] sm:p-5">
      <span className="font-serif text-4xl leading-none text-site-accent/25" aria-hidden>
        "
      </span>
      <p className="m-0 flex-1 text-sm leading-relaxed text-site-muted">{item.text}</p>
      <Stars rating={item.rating} />
      <div className="mt-3 flex items-center gap-3 border-t border-site-accent-dark/10 pt-3">
        <img
          src={item.img}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full border-2 border-site-accent object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=8B4A1E&color=fff`;
          }}
        />
        <div className="min-w-0">
          <p className="m-0 truncate font-heading text-sm font-bold text-site-primary">{item.name}</p>
          <p className="m-0 mt-0.5 flex items-center gap-1 text-xs text-site-muted">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{item.location}</span>
          </p>
        </div>
      </div>
      <span className="mt-3 inline-flex w-fit rounded-full bg-site-accent/10 px-2.5 py-1 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-accent-dark">
        {item.course}
      </span>
    </article>
  );
}

export default function StudentTestimonials() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.st-card');
    const gap = 16;
    const amount = (card?.offsetWidth || 300) + gap;
    track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden border-t border-site-accent-dark/10 bg-white py-[clamp(2.5rem,6vw,4.5rem)]"
      aria-labelledby="student-testimonials-heading"
    >
      <div className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-site-accent/5" aria-hidden />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-site-accent-dark/5" aria-hidden />

      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="student-testimonials-heading"
          kicker="Real Stories"
          title="What Our"
          titleHighlight="Students Say"
          subtitle="Trusted by thousands of satisfied students across the globe."
        />

        <div className="relative px-1 sm:px-2">
          <button
            type="button"
            onClick={() => scroll('prev')}
            aria-label="Previous testimonials"
            className="absolute -left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-site-accent-dark/15 bg-white text-site-primary shadow-md transition hover:bg-site-primary hover:text-white sm:flex md:-left-3"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STUDENTS.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('next')}
            aria-label="Next testimonials"
            className="absolute -right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-site-accent-dark/15 bg-white text-site-primary shadow-md transition hover:bg-site-primary hover:text-white sm:flex md:-right-3"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="m-0 mt-4 text-center text-xs text-site-soft sm:hidden">
          Swipe to read more stories →
        </p>
      </div>
    </section>
  );
}
