import { Link } from 'react-router-dom';
import { MRP, PRICE, SUBJECT_ACCENT, cardAnchor } from './menuTheme';

function MenuCard({ mc, index, highlighted, onBook }) {
  const accent = SUBJECT_ACCENT[mc.id] || '#EE6662';

  return (
    <article
      id={cardAnchor(mc.id)}
      className={`mcm-reveal group relative flex w-full flex-col overflow-hidden rounded-[18px] border border-[#E9DFCF] bg-white shadow-[0_1px_2px_rgba(31,26,22,0.04),0_12px_30px_-18px_rgba(31,26,22,0.25)] transition-transform duration-300 hover:-translate-y-1 ${
        highlighted ? 'mcm-selected' : ''
      }`}
      style={{ '--mcm-accent': accent, transitionDelay: `${(index % 3) * 70}ms` }}
    >
      {/* Accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 26px 56px -18px ${accent}80` }}
      />

      <div className="relative aspect-video overflow-hidden bg-[#1c0c2e]">
        <img
          src={mc.image}
          alt={`${mc.title} live masterclass`}
          width="1920"
          height="1080"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#E53935] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white shadow-[0_0_14px_rgba(229,57,53,0.6)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      </div>

      <div className="relative flex flex-grow flex-col gap-[10px] px-[16px] pb-[16px] pt-[14px] sm:px-[20px] sm:pb-[18px] sm:pt-[16px]">
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-white"
            style={{ background: accent }}
          >
            <i className={`fas ${mc.icon}`} aria-hidden="true" />
          </span>
          <span className="text-[11px] font-semibold tracking-[0.14em]" style={{ color: accent }}>
            {mc.menu.label}
          </span>
        </div>

        <h3 className="m-0 font-heading text-[19px] font-semibold leading-[1.25] text-[#1F1A16] sm:text-[20px]">
          {mc.menu.title}
        </h3>
        <p className="m-0 text-[14px] leading-[1.55] text-[#5A4E44]">{mc.menu.description}</p>

        <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
          {mc.highlights.slice(0, 2).map((point) => (
            <li key={point} className="flex gap-2 text-[13px] leading-snug text-[#3A302A]">
              <i className="fas fa-check-circle mt-[3px] text-[12px]" style={{ color: accent }} aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 text-[12px] text-[#3A302A]">
          {['2 din', '2 ghante roz', 'Recording incl.'].map((chip) => (
            <span key={chip} className="rounded-full bg-[#F6F0E6] px-2.5 py-[5px]">{chip}</span>
          ))}
        </div>

        <div className="mt-auto border-t border-dashed border-[#E9DFCF] pt-[12px]">
          <div className="mb-[10px] flex items-center gap-2">
            <span className="font-heading text-[24px] font-bold leading-none text-[#1F1A16]">{PRICE}</span>
            <span className="text-[14px] text-[#9A8B7C] line-through">{MRP}</span>
            <span className="ml-auto rounded-full bg-[#E8F7EE] px-2 py-0.5 text-[11px] font-semibold text-[#1E7A45]">75% off</span>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => onBook(mc.id)}
              className="flex h-[44px] min-w-0 flex-grow items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-br from-[#EE6662] to-[#D9534F] text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(238,102,98,0.3)] transition hover:shadow-[0_14px_28px_rgba(238,102,98,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE6662]"
            >
              {PRICE} mein book karein
              <i className="fas fa-arrow-right text-[11px] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <Link
              to={mc.detailsPath}
              className="flex h-[44px] shrink-0 items-center justify-center rounded-xl border border-[#D8C9B2] px-[14px] text-[14px] font-semibold text-[#3A302A] transition-colors hover:border-[#3B2261] hover:text-[#3B2261]"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MenuCard;
