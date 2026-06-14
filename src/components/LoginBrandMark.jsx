import { Link } from 'react-router-dom';
import { SITE_LOGO, SITE_LOGO_ALT } from '../utils/brandAssets';

export default function LoginBrandMark({ badge, className = '' }) {
  return (
    <Link
      to="/"
      className={`mb-4 inline-flex w-fit max-w-[8.5rem] shrink-0 flex-col items-start gap-1 no-underline transition-opacity hover:opacity-90 ${className}`}
      aria-label={`${SITE_LOGO_ALT} home`}
    >
      <span className="flex h-9 w-[7.25rem] items-center justify-start sm:h-10 sm:w-[8rem]">
        <img
          src={SITE_LOGO}
          alt={SITE_LOGO_ALT}
          className="!block !h-full !w-full !max-h-full !max-w-full object-contain object-left"
        />
      </span>
      {badge ? (
        <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-site-accent-dark">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export const LOGIN_PAGE_WRAP =
  'relative flex min-h-[calc(100dvh-20rem)] w-full items-center justify-center overflow-hidden px-4 py-6 font-body bg-[radial-gradient(circle_at_12%_12%,rgba(200,131,42,0.14),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(42,15,2,0.08),transparent_30%),linear-gradient(135deg,#fffaf3_0%,#f8ead8_100%)] sm:px-6 lg:px-12';

export const LOGIN_CARD_CLASS =
  'flex w-full max-w-[880px] flex-col overflow-hidden rounded-[1.125rem] border border-site-accent-dark/12 bg-white shadow-[0_20px_52px_rgba(42,15,2,0.11)] min-[860px]:max-h-[min(40rem,calc(100vh-6rem))] min-[860px]:flex-row';

export const LOGIN_PANEL_CLASS =
  'flex flex-none flex-col overflow-y-auto border-b border-site-accent-dark/10 px-6 py-7 min-[860px]:flex-[0_0_48%] min-[860px]:basis-[48%] min-[860px]:border-b-0 min-[860px]:border-r min-[860px]:px-8 min-[860px]:py-8';
