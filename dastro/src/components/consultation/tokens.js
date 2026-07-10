/**
 * Consultation / course listing tokens — re-uses siteTokens for typography & layout.
 */
import {
  PAGE_WRAP,
  TW_KICKER,
  TW_H1,
  TW_H2,
  TW_H3,
  TW_BODY,
  TW_BODY_SM,
  SITE_PRICE,
  SITE_PRICE_SM,
} from '../../utils/siteTokens';

export { PAGE_WRAP };

export const COURSE_GRID =
  'm-0 grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4';

export const COURSE_GRID_ITEM = 'min-w-0 w-full';

/** @deprecated Layout provides tw-page — use a fragment at page root instead */
export const PAGE = 'w-full';

export const TYPE = {
  kicker: `${TW_KICKER} m-0 inline-flex items-center rounded-full bg-site-accent/12 px-2.5 py-0.5`,
  h1: `${TW_H1} m-0 p-0`,
  h2: `${TW_H2} m-0 p-0`,
  h3: `${TW_H3} m-0 p-0`,
  body: `${TW_BODY} m-0 p-0`,
  bodySm: `${TW_BODY_SM} m-0 p-0`,
  caption: 'm-0 p-0 font-body text-xs leading-normal text-site-soft',
  price: `${SITE_PRICE} m-0 p-0`,
  priceSm: `${SITE_PRICE_SM} m-0`,
  priceCard:
    'm-0 font-price text-[1.0625rem] font-bold leading-none tracking-tight text-site-primary tabular-nums',
  backLink:
    'm-0 mb-5 inline-flex items-center gap-1.5 p-0 font-body text-xs font-semibold text-site-accent-dark no-underline transition hover:text-site-accent sm:text-sm',
};

export const BTN = {
  primary:
    'm-0 inline-flex min-h-10 w-auto cursor-pointer select-none appearance-none items-center justify-center gap-2 rounded-full border-0 bg-site-primary px-5 py-2.5 font-body text-sm font-bold text-white shadow-sm outline-none transition hover:-translate-y-px hover:bg-site-accent-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0',
  cta:
    'm-0 inline-flex min-h-11 w-full cursor-pointer select-none appearance-none items-center justify-center gap-2 rounded-full border-0 bg-gradient-to-r from-site-accent to-[#d4922e] px-6 py-2.5 font-body text-sm font-bold tracking-wide text-white shadow-[0_4px_16px_rgba(200,131,42,0.32)] outline-none transition hover:-translate-y-0.5 hover:from-[#d4922e] hover:to-site-accent-dark hover:shadow-[0_6px_22px_rgba(200,131,42,0.42)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0 disabled:shadow-sm',
  outline:
    'm-0 inline-flex min-h-10 w-auto cursor-pointer select-none appearance-none items-center justify-center gap-2 rounded-full border-2 border-site-primary bg-transparent px-5 py-2.5 font-body text-sm font-bold text-site-primary outline-none transition hover:bg-site-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60',
  pill: 'm-0 inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-full border-0 bg-site-accent-dark px-3.5 py-2 font-body text-sm font-bold text-white no-underline shadow-sm transition hover:bg-site-primary',
  grow: 'flex-1 min-w-0',
  static: 'flex-none w-auto',
};

export const TAB =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-accent-dark/12 bg-site-bg px-2.5 py-1.5 font-body text-xs font-semibold leading-none text-site-muted antialiased transition hover:border-site-accent/40 hover:bg-site-surface hover:text-site-primary sm:px-3 sm:py-2';

export const TAB_ACTIVE =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-primary bg-site-primary px-2.5 py-1.5 font-body text-xs font-semibold leading-none text-white shadow-sm antialiased transition sm:px-3 sm:py-2';

export const TAB_COUNT =
  'inline-flex min-w-[1rem] items-center justify-center rounded-full bg-site-accent-dark/10 px-1.5 py-0.5 font-body text-xs font-bold tabular-nums leading-none text-site-accent-dark';

export const TAB_COUNT_ACTIVE =
  'inline-flex min-w-[1rem] items-center justify-center rounded-full bg-white/20 px-1.5 py-0.5 font-body text-xs font-bold tabular-nums leading-none text-white/95';

export const CHIP =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-accent-dark/15 bg-site-bg px-2.5 py-1.5 font-body text-xs font-semibold leading-none text-site-muted antialiased transition hover:border-site-accent/45 hover:bg-site-surface hover:text-site-primary sm:px-3 sm:py-2';

export const CHIP_ACTIVE =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-accent-dark bg-site-accent-dark px-2.5 py-1.5 font-body text-xs font-semibold leading-none text-white shadow-sm antialiased sm:px-3 sm:py-2';

export const CHIP_GHOST =
  'm-0 cursor-pointer border-0 bg-transparent p-0 font-body text-sm font-bold text-site-accent-dark underline-offset-2 hover:underline';

export const CARD =
  'group m-0 flex h-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_1px_8px_rgba(74,44,42,0.05)] transition duration-200 hover:border-site-accent/25 hover:shadow-[0_4px_16px_rgba(74,44,42,0.08)]';

export const FILTER_BAR =
  'sticky top-site-header-sticky z-[1010] border-b border-site-accent-dark/10 bg-site-bg pb-2 shadow-[0_4px_14px_rgba(139,74,30,0.08)] sm:pb-3';

export const CARD_FLEX_LIST =
  'm-0 grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:grid-cols-4 lg:gap-4';

export const CARD_FLEX_ITEM = 'min-w-0';

export const SELECT =
  'm-0 cursor-pointer appearance-none rounded-full border border-site-accent-dark/15 bg-site-bg py-1.5 pl-3 pr-8 font-body text-xs font-semibold leading-none text-site-muted antialiased outline-none transition hover:border-site-accent/40 focus:border-site-accent focus:ring-2 focus:ring-site-accent/15 sm:text-sm sm:py-2 sm:pl-3.5';
