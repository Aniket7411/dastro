import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';
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

const MARQUEE_ITEMS = [...CLIENTS, ...CLIENTS];

const CARD_W = 'w-[17.5rem] sm:w-[18.5rem]';
const CARD_H = 'h-[15.75rem] sm:h-[16.25rem]';

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
      className={`ct-card flex ${CARD_H} ${CARD_W} shrink-0 flex-col rounded-xl border border-site-accent-dark/10 bg-white p-4 shadow-[0_2px_12px_rgba(42,15,2,0.06)] transition hover:border-site-accent/25 hover:shadow-[0_8px_24px_rgba(42,15,2,0.08)]`}
      aria-label={`Review from ${item.name}`}
    >
      <span className="mb-2 inline-flex w-fit max-w-full truncate rounded-full bg-site-accent/8 px-2 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-accent-dark">
        {item.service}
      </span>

      <p className="m-0 line-clamp-4 flex-1 text-sm leading-snug text-site-muted">{item.text}</p>

      <div className="mt-3 border-t border-site-accent-dark/8 pt-3">
        <Stars rating={item.rating} />
        <div className="mt-2.5 flex items-center gap-2.5">
          <img
            src={item.img}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border border-site-accent-dark/20 object-cover"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=8B4A1E&color=fff`;
            }}
          />
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

export default function ConsultationTestimonials() {
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
      className="border-t border-site-accent-dark/8 bg-site-bg py-[clamp(2.5rem,5vw,3.5rem)]"
      aria-labelledby="consultation-testimonials-heading"
    >
      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="consultation-testimonials-heading"
          kicker="Client Experiences"
          title="What Our"
          titleHighlight="Clients Say"
          subtitle="Real stories from seekers who found clarity through personalized consultations."
          showAccent
        />

        <div
          className="ct-marquee relative"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onTouchStart={() => setHeld(true)}
          onTouchEnd={() => setHeld(false)}
          onTouchCancel={() => setHeld(false)}
        >
          <div className="ct-marquee-viewport overflow-hidden" aria-label="Client testimonials">
            <div
              className={`ct-marquee-track flex w-max items-stretch gap-3.5 sm:gap-4 ${
                reduceMotion
                  ? 'flex-wrap justify-center gap-4'
                  : 'animate-[marquee-left_48s_linear_infinite] hover:[animation-play-state:paused] active:[animation-play-state:paused]'
              } ${held && !reduceMotion ? '[animation-play-state:paused]' : ''}`}
            >
              {(reduceMotion ? CLIENTS : MARQUEE_ITEMS).map((item, index) => (
                <TestimonialCard key={`${item.name}-${index}`} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ct-marquee-viewport {
          mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
        }
      `}</style>
    </section>
  );
}
