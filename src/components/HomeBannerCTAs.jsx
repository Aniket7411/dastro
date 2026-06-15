import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, GraduationCap, Store } from 'lucide-react';

const LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const BASE =
  'm-0 inline-flex min-h-[2.625rem] w-full cursor-pointer select-none appearance-none items-center justify-center gap-2 rounded-full border px-4 py-2.5 font-body text-[0.8125rem] font-bold leading-none outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-site-accent/40 focus-visible:ring-offset-2 sm:min-h-[2.875rem] sm:px-5 sm:text-sm';

const PRIMARY_DARK = `${LINK} ${BASE} border-transparent bg-white text-site-primary shadow-[0_8px_22px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:bg-[#fffaf4] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]`;
const GHOST_DARK = `${LINK} ${BASE} border-white/50 bg-white/10 text-white backdrop-blur-[6px] hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/18`;
const PRIMARY_LIGHT = `${LINK} ${BASE} border-transparent bg-site-primary text-white shadow-[0_8px_22px_rgba(42,15,2,0.2)] hover:-translate-y-0.5 hover:bg-site-accent-dark`;
const GHOST_LIGHT = `${LINK} ${BASE} border-site-primary/18 bg-white/92 text-site-primary shadow-sm hover:-translate-y-0.5 hover:border-site-primary/35 hover:bg-white`;

function iconForPrimary(cta) {
  if (cta?.action === 'consultation') return CalendarCheck;
  if (cta?.icon?.includes('arrow')) return ArrowRight;
  return GraduationCap;
}

export default function HomeBannerCTAs({ primaryCta, onConsultation, onDark = false }) {
  const primaryClass = onDark ? PRIMARY_DARK : PRIMARY_LIGHT;
  const ghostClass = onDark ? GHOST_DARK : GHOST_LIGHT;
  const primaryIsConsult = primaryCta?.action === 'consultation';
  const PrimaryIcon = iconForPrimary(primaryCta);

  return (
    <div className="mt-4 grid w-full max-w-xl grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:max-w-2xl sm:gap-2.5">
      {primaryIsConsult ? (
        <button
          type="button"
          onClick={onConsultation}
          className={`${primaryClass} min-[420px]:col-span-2`}
        >
          <PrimaryIcon size={16} strokeWidth={2.25} aria-hidden />
          {primaryCta.label}
        </button>
      ) : (
        <Link
          to={primaryCta?.path || '/courses'}
          className={`${primaryClass} min-[420px]:col-span-2`}
        >
          <PrimaryIcon size={16} strokeWidth={2.25} aria-hidden />
          {primaryCta?.label || 'View courses'}
        </Link>
      )}

      {primaryIsConsult ? (
        <Link to="/courses" className={ghostClass}>
          <GraduationCap size={16} strokeWidth={2.25} aria-hidden />
          View courses
        </Link>
      ) : (
        <button type="button" onClick={onConsultation} className={ghostClass}>
          <CalendarCheck size={16} strokeWidth={2.25} aria-hidden />
          Book consultation
        </button>
      )}

      <Link to="/shop" className={ghostClass}>
        <Store size={16} strokeWidth={2.25} aria-hidden />
        Astro shop
      </Link>
    </div>
  );
}
