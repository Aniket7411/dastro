import { Link } from 'react-router-dom';

const LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const BASE =
  'm-0 inline-flex min-h-[2.375rem] w-auto max-w-full cursor-pointer select-none appearance-none items-center justify-center rounded-full border px-4 py-2 font-body text-[0.8125rem] font-bold leading-tight outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-site-accent/40 focus-visible:ring-offset-2 sm:min-h-[2.5rem] sm:px-[1.125rem] sm:text-sm';

const PRIMARY_DARK = `${LINK} ${BASE} border-transparent bg-white text-site-primary shadow-[0_6px_18px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-[#fffaf4]`;
const GHOST_DARK = `${LINK} ${BASE} border-white/45 bg-white/10 text-white backdrop-blur-[6px] hover:-translate-y-0.5 hover:border-white/75 hover:bg-white/16`;
const PRIMARY_LIGHT = `${LINK} ${BASE} border-transparent bg-site-primary text-white shadow-[0_6px_18px_rgba(42,15,2,0.18)] hover:-translate-y-0.5 hover:bg-site-accent-dark`;
const GHOST_LIGHT = `${LINK} ${BASE} border-site-primary/18 bg-white/92 text-site-primary shadow-sm hover:-translate-y-0.5 hover:border-site-primary/35 hover:bg-white`;

export default function HomeBannerCTAs({ primaryCta, onDark = false }) {
  const primaryClass = onDark ? PRIMARY_DARK : PRIMARY_LIGHT;
  const ghostClass = onDark ? GHOST_DARK : GHOST_LIGHT;

  return (
    <div className="mt-4 flex w-full max-w-lg flex-wrap items-center justify-start gap-2 max-lg:mx-auto max-lg:justify-center sm:gap-2.5">
      <Link to={primaryCta?.path || '/courses'} className={primaryClass}>
        {primaryCta?.label || 'View courses'}
      </Link>

      <Link to="/consultations" className={ghostClass}>
        Book Consultation
      </Link>
    </div>
  );
}
