import { Link } from 'react-router-dom';
import { Clock, Phone } from 'lucide-react';

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const TITLE_LINK = `${CARD_LINK} !text-site-primary visited:!text-site-primary transition-colors group-hover:!text-site-accent-dark hover:!text-site-accent-dark`;

const BTN_BASE =
  'm-0 cursor-pointer select-none appearance-none !rounded-full outline-none focus-visible:ring-2 focus-visible:ring-site-accent/40 focus-visible:ring-offset-1';

const BTN_OUTLINE = `${CARD_LINK} ${BTN_BASE} inline-flex min-w-0 flex-1 items-center justify-center border border-site-accent-dark/25 bg-white px-2.5 py-1.5 text-center text-[10px] font-bold !text-site-accent-dark visited:!text-site-accent-dark transition hover:!border-[#2a0f02] hover:!bg-[#f3ebe0] hover:!text-[#2a0f02]`;

const BTN_PRIMARY = `${CARD_LINK} ${BTN_BASE} inline-flex min-w-0 flex-1 items-center justify-center gap-0.5 border-0 bg-site-primary px-2.5 py-1.5 text-[10px] font-bold !text-white visited:!text-white shadow-sm transition hover:!bg-site-accent-dark hover:!text-white`;

export default function HomeConsultationCard({ item, onBook }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-site-accent-dark/12 bg-white shadow-[0_4px_16px_rgba(42,15,2,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-site-accent/35 hover:shadow-[0_10px_28px_rgba(139,74,30,0.12)]">
      <Link
        to={item.link}
        className={`${CARD_LINK} relative block aspect-[2/1] overflow-hidden`}
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={item.img}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a0f02]/45 via-transparent to-transparent opacity-90" />

        {item.badge ? (
          <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-rose-600/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm sm:left-2 sm:top-2 sm:px-2 sm:text-[10px]">
            {item.badge}
          </span>
        ) : null}

        {item.price ? (
          <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/95 px-1.5 py-0.5 font-price text-[11px] font-extrabold tabular-nums text-site-primary shadow-sm sm:bottom-2 sm:left-2 sm:rounded-lg sm:px-2 sm:text-sm">
            {item.price}
          </span>
        ) : null}

        {item.duration ? (
          <span className="absolute bottom-1.5 right-1.5 inline-flex max-w-[46%] items-center gap-0.5 truncate rounded-full bg-black/55 px-1 py-0.5 text-[8px] font-semibold text-white backdrop-blur-sm sm:bottom-2 sm:right-2 sm:max-w-none sm:px-1.5 sm:text-[10px]">
            <Clock size={8} className="shrink-0 sm:hidden" aria-hidden />
            <Clock size={9} className="hidden shrink-0 sm:block" aria-hidden />
            {item.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-2 sm:px-3.5 sm:py-3">
        <Link
          to={item.link}
          className={`${TITLE_LINK} mb-1 line-clamp-2 font-body text-xs font-bold leading-snug sm:mb-1.5 sm:text-sm`}
        >
          {item.title}
        </Link>

        <p className="mb-2 line-clamp-2 flex-1 text-[10px] leading-relaxed text-site-muted sm:mb-3 sm:text-[13px]">
          {item.desc}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-1 sm:gap-2">
          <Link to={item.link} className={`${BTN_OUTLINE} !px-1.5 !py-1 !text-[9px] sm:!px-2.5 sm:!py-1.5 sm:!text-[10px]`}>
            Learn more
          </Link>
          <button
            type="button"
            onClick={(e) => onBook(e, item)}
            className={`${BTN_PRIMARY} !px-1.5 !py-1 !text-[9px] sm:!px-2.5 sm:!py-1.5 sm:!text-[10px]`}
          >
            <Phone size={9} className="sm:hidden" aria-hidden />
            <Phone size={10} className="hidden sm:block" aria-hidden />
            Callback
          </button>
        </div>
      </div>
    </article>
  );
}
