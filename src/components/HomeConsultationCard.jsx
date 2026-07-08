import { Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';
import { getPriceDisplay } from '../utils/pricing';
import {
  SITE_COURSE_CARD,
  SITE_PRICE,
} from '../utils/siteTokens';

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

export default function HomeConsultationCard({ item, onBook }) {
  const { hasDiscount, priceLabel, mrpLabel, savePercent } = getPriceDisplay({
    price: item.priceValue,
    mrp: item.mrp,
  });
  const hasPrice = Number(item.priceValue) > 0;
  const subtitle = item.short && item.short !== item.title ? item.short : null;

  return (
    <article className={`${SITE_COURSE_CARD} h-full w-full min-w-0`}>
      <Link
        to={item.link}
        className={`${CARD_LINK} relative block aspect-[16/11] overflow-hidden sm:aspect-[16/10]`}
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={item.img}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />

        {item.badge ? (
          <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded bg-site-accent-dark px-1.5 py-0.5 font-body text-[8px] font-semibold uppercase tracking-[0.05em] text-white shadow-sm sm:left-2 sm:top-2 sm:rounded-md sm:px-2 sm:py-0.5 sm:text-[10px]">
            {item.badge}
          </span>
        ) : null}

        {item.duration ? (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-center justify-center gap-1 bg-black/55 px-1.5 py-1 font-body text-[9px] font-medium leading-none text-white sm:gap-1.5 sm:py-1.5 sm:text-[10px]">
            <Clock size={9} className="shrink-0 opacity-90 sm:size-2.5" aria-hidden />
            <span className="truncate">{item.duration}</span>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-2.5 py-2.5 sm:px-3.5 sm:py-3">
        <Link
          to={item.link}
          className={`${CARD_LINK} line-clamp-2 font-heading text-[0.8125rem] font-bold leading-snug text-site-text transition hover:text-site-accent-dark sm:text-base`}
        >
          {item.title}
        </Link>

        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 font-body text-[11px] leading-snug text-site-muted sm:mt-1 sm:text-[13px]">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-2 border-t border-site-border/60 pt-2 sm:mt-2.5 sm:pt-2.5">
          {hasPrice ? (
            <div className="leading-none">
              <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                <p className={`${SITE_PRICE} text-[1.0625rem] sm:text-[1.25rem]`}>
                  <span className="text-[0.85em] font-medium text-site-muted">₹</span>
                  {priceLabel}
                </p>
                {hasDiscount ? (
                  <span className="font-body text-[10px] text-site-soft line-through decoration-site-soft/60 sm:text-xs">
                    ₹{mrpLabel}
                  </span>
                ) : null}
              </div>
              {hasDiscount ? (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 font-body text-[9px] font-bold leading-none text-emerald-700 sm:text-[10px]">
                  Save {savePercent}%
                </span>
              ) : null}
            </div>
          ) : (
            <p className="m-0 font-body text-[11px] font-medium text-site-muted">Enquire for pricing</p>
          )}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-2.5 sm:gap-2">
          <Link
            to={item.link}
            className="inline-flex min-h-8 items-center justify-center rounded-lg border border-site-accent-dark bg-[#fffdf8] px-1.5 py-1.5 text-center font-body text-[10px] font-semibold leading-none text-site-accent-dark no-underline transition hover:bg-white sm:min-h-9 sm:rounded-[10px] sm:px-2.5 sm:text-[12px]"
          >
            Learn more
          </Link>
          <button
            type="button"
            onClick={(e) => onBook(e, item)}
            className="inline-flex min-h-8 items-center justify-center gap-1 rounded-lg border-0 bg-site-accent-dark px-1.5 py-1.5 font-body text-[10px] font-semibold leading-none text-white transition hover:bg-[#743d16] sm:min-h-9 sm:rounded-[10px] sm:px-2.5 sm:text-[12px]"
          >
            <Phone size={10} strokeWidth={2.25} className="shrink-0 sm:size-3" aria-hidden />
            Callback
          </button>
        </div>
      </div>
    </article>
  );
}
