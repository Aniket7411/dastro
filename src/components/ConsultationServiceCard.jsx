import { Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';
import { TYPE } from './consultation/tokens';
import { getPriceDisplay } from '../utils/pricing';

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
  const { hasDiscount, priceLabel, mrpLabel, savePercent } = getPriceDisplay({
    price: card.price,
    mrp: card.mrp,
  });

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_2px_12px_rgba(42,15,2,0.06)] transition hover:border-site-accent/25 hover:shadow-[0_6px_20px_rgba(42,15,2,0.1)]">
      <Link
        to={url}
        className="relative block aspect-[5/4] overflow-hidden no-underline sm:aspect-[4/3]"
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
            className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm sm:px-2.5 sm:py-1 sm:text-[10px] ${badgeStyle}`}
          >
            {card.badge}
          </span>
        ) : null}
        {card.duration ? (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm sm:px-2 sm:text-[10px]">
            <Clock size={9} aria-hidden />
            {card.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link
          to={url}
          className="mb-1 line-clamp-2 font-body text-[13px] font-bold leading-snug text-site-primary no-underline transition group-hover:text-site-accent-dark sm:text-sm"
        >
          {title}
        </Link>

        {card.desc ? (
          <p className="mb-2 line-clamp-2 flex-1 text-[11px] leading-relaxed text-site-muted sm:text-xs">
            {card.desc}
          </p>
        ) : (
          <div className="mb-2 flex-1" />
        )}

        <div className="mt-auto flex items-end justify-between gap-1.5 border-t border-site-accent-dark/10 pt-2 sm:gap-2 sm:pt-2.5">
          <div className="min-w-0">
            <div className="leading-tight">
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <p className={TYPE.priceCard}>₹{priceLabel}</p>
                {hasDiscount ? (
                  <span className="font-body text-[11px] text-site-soft line-through decoration-site-soft/60">
                    ₹{mrpLabel}
                  </span>
                ) : null}
              </div>
              {hasDiscount ? (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-body text-[10px] font-bold leading-tight text-emerald-700">
                  Save {savePercent}%
                </span>
              ) : null}
            </div>
          </div>

          <Link
            to={url}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1a0c04] px-2.5 py-1.5 text-[9px] font-bold text-white no-underline shadow-sm transition hover:bg-[#2d1a12] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-[11px]"
          >
            <Phone size={10} strokeWidth={2.25} aria-hidden />
            <span className="hidden min-[400px]:inline">Request callback</span>
            <span className="min-[400px]:hidden">Callback</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
