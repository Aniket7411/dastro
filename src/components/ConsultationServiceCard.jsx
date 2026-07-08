import { Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';
import {
  SITE_BTN_CARD,
  SITE_COURSE_CARD,
  SITE_COURSE_CARD_BODY,
  SITE_COURSE_CARD_DESC,
  SITE_COURSE_CARD_TITLE,
  SITE_PRICE,
} from '../utils/siteTokens';
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
    <article className={`${SITE_COURSE_CARD} w-full`}>
      <Link
        to={url}
        className="relative block aspect-[4/3] overflow-hidden no-underline sm:aspect-[4/3]"
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

      <div className={`${SITE_COURSE_CARD_BODY} p-3 sm:p-[18px]`}>
        <Link
          to={url}
          className={`${SITE_COURSE_CARD_TITLE} mb-2 line-clamp-2 text-base sm:text-xl`}
        >
          {title}
        </Link>

        {card.desc ? (
          <p className={`${SITE_COURSE_CARD_DESC} mb-3 line-clamp-2 flex-1 text-sm sm:text-[15px]`}>
            {card.desc}
          </p>
        ) : (
          <div className="mb-3 flex-1" />
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="leading-tight">
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <p className={SITE_PRICE}>₹{priceLabel}</p>
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

          <Link to={url} className={`${SITE_BTN_CARD} !text-white visited:!text-white`}>
            <Phone size={10} strokeWidth={2.25} aria-hidden />
            <span className="hidden min-[400px]:inline">Request callback</span>
            <span className="min-[400px]:hidden">Callback</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
