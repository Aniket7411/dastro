import { Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';
import { TYPE } from './consultation/tokens';

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
  const title = card.short || card.title;

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm transition hover:border-site-accent/30 hover:shadow-md">
      <Link
        to={url}
        className="relative block aspect-[2/1] overflow-hidden no-underline"
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={card.img}
          alt=""
          className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {card.badge ? (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${badgeStyle}`}
          >
            {card.badge}
          </span>
        ) : null}
        {card.duration ? (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Clock size={9} aria-hidden />
            {card.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          to={url}
          className="mb-1 line-clamp-2 font-body text-sm font-bold leading-snug text-site-primary no-underline transition group-hover:text-site-accent-dark"
        >
          {title}
        </Link>

        {card.desc ? (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-site-muted">{card.desc}</p>
        ) : (
          <div className="mb-2 flex-1" />
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-site-accent-dark/10 pt-2.5">
          <div className="min-w-0 leading-none">
            <p className={TYPE.priceCard}>{card.priceLabel}</p>
          </div>

          <Link
            to={url}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-site-primary px-3 py-1.5 text-[11px] font-bold text-white no-underline transition hover:bg-site-accent-dark"
          >
            <Phone size={11} aria-hidden />
            Request callback
          </Link>
        </div>
      </div>
    </article>
  );
}
