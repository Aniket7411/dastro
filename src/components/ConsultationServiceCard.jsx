import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { BTN, CARD, TYPE } from './consultation/tokens';

const BADGE_STYLES = {
  purple: 'bg-violet-600/95 text-white',
  pink: 'bg-rose-500/95 text-white',
  orange: 'bg-amber-600/95 text-white',
  red: 'bg-red-600/95 text-white',
  green: 'bg-emerald-600/95 text-white',
};

export default function ConsultationServiceCard({ card, detailPath = '/book-consultation' }) {
  const badgeStyle = BADGE_STYLES[card.badgeColor] || BADGE_STYLES.purple;
  const url = `${detailPath}/${card.id}`;

  return (
    <article className={CARD}>
      <Link to={url} className="relative block aspect-[2/1] overflow-hidden no-underline" tabIndex={-1} aria-hidden>
        <img
          src={card.img}
          alt=""
          className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-site-primary/30 to-transparent" aria-hidden />
        {card.badge ? (
          <span
            className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:text-[0.625rem] ${badgeStyle}`}
          >
            {card.badge}
          </span>
        ) : null}
        {card.duration ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[0.625rem] font-semibold text-site-muted shadow-sm sm:bottom-2.5 sm:left-2.5 sm:gap-1 sm:px-2 sm:text-[0.6875rem]">
            <Clock size={10} className="text-site-accent" aria-hidden />
            {card.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
        <div className="min-w-0 flex-1">
          <Link
            to={url}
            className={`${TYPE.h3} !mb-0.5 block truncate no-underline transition group-hover:!text-site-accent-dark`}
          >
            {card.short || card.title}
          </Link>
          <p className={`${TYPE.bodySm} line-clamp-1 !text-[0.75rem] !leading-snug sm:line-clamp-2 sm:!text-xs`}>{card.desc}</p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-site-accent-dark/8 pt-2">
          <p className="!m-0 truncate font-heading text-sm font-bold leading-none text-site-accent-dark sm:text-[0.9375rem]">
            {card.priceLabel}
          </p>
          <Link to={url} className={`${BTN.pill} shrink-0`}>
            Book
            <ArrowRight size={11} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
