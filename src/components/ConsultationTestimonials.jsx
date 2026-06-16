import { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import { PAGE_WRAP } from './consultation/tokens';
import HomeSectionHeader from './home/HomeSectionHeader';

const CLIENTS = [
  {
    name: 'Rajesh Kumar Verma',
    location: 'Mumbai, Maharashtra',
    img: 'https://randomuser.me/api/portraits/men/43.jpg',
    rating: 5,
    text: 'The career consultation was absolutely spot on! Within 3 months I received a promotion exactly as predicted. Acharya ji gave me the confidence to make bold career moves.',
    service: 'Career Consultation',
  },
  {
    name: 'Kavya Reddy',
    location: 'Hyderabad, Telangana',
    img: 'https://randomuser.me/api/portraits/women/58.jpg',
    rating: 5,
    text: 'The remedies for my Mangal dosha were simple yet incredibly effective. Within 6 months we found the perfect match. Eternally grateful for this accurate guidance.',
    service: 'Marriage Consultation',
  },
  {
    name: 'Deepika Mishra',
    location: 'Jaipur, Rajasthan',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    rating: 5,
    text: 'Every card drawn in my tarot reading resonated deeply. The clarity about my relationship helped me make the best decision of my life.',
    service: 'Tarot Reading',
  },
  {
    name: 'Suresh Rao',
    location: 'Mysore, Karnataka',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    rating: 5,
    text: 'I was confused about moving abroad for business. The consultation gave me a clear timeline and the right muhurat. Everything unfolded as predicted.',
    service: 'Business Consultation',
  },
  {
    name: 'Anita Malhotra',
    location: 'Amritsar, Punjab',
    img: 'https://randomuser.me/api/portraits/women/72.jpg',
    rating: 5,
    text: 'Going through a difficult divorce felt hopeless until this consultation. I received clarity on the legal outcome and emotional healing remedies that truly worked.',
    service: 'Divorce Consultation',
  },
  {
    name: 'Vikram Singh Rathore',
    location: 'Jodhpur, Rajasthan',
    img: 'https://randomuser.me/api/portraits/men/31.jpg',
    rating: 5,
    text: 'The relationship analysis revealed patterns I had never seen before. Understanding planetary influences helped me bring harmony back to my relationship.',
    service: 'Love & Relationship',
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
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="ct-card flex h-full w-[min(100%,18.5rem)] shrink-0 snap-start flex-col rounded-2xl border border-site-accent-dark/12 bg-white/90 p-4 shadow-[0_4px_18px_rgba(42,15,2,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-site-accent/30 sm:w-[min(100%,20rem)] sm:p-5">
      <p className="m-0 flex-1 text-sm leading-relaxed text-site-muted">{item.text}</p>
      <Stars rating={item.rating} />
      <div className="mt-3 flex items-center gap-3 border-t border-site-accent-dark/10 pt-3">
        <img
          src={item.img}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full border-2 border-site-accent-dark/30 object-cover"
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
      <span className="mt-3 inline-flex w-fit rounded-full bg-site-primary/8 px-2.5 py-1 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-primary">
        {item.service}
      </span>
    </article>
  );
}

export default function ConsultationTestimonials() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.ct-card');
    const gap = 16;
    const amount = (card?.offsetWidth || 300) + gap;
    track.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-site-bg via-[#fffaf4] to-site-bg py-[clamp(2.5rem,6vw,4rem)]"
      aria-labelledby="consultation-testimonials-heading"
    >
      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="consultation-testimonials-heading"
          kicker="Client Experiences"
          title="What Our"
          titleHighlight="Clients Say"
          subtitle="Real stories from seekers who found clarity through personalized consultations."
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
            {CLIENTS.map((item) => (
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
