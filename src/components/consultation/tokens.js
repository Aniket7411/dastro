/** Tailwind-only tokens for consultation pages */

export const PAGE_WRAP =
  'mx-auto w-full max-w-[var(--container-public)] px-[var(--page-pad-x)]';

export const PAGE = 'min-h-screen w-full bg-site-bg font-body text-site-text antialiased';

export const TYPE = {
  kicker:
    '!m-0 inline-flex items-center rounded-full bg-site-accent/12 px-2.5 py-0.5 font-body text-[0.625rem] !font-bold uppercase tracking-[0.1em] !text-site-accent-dark',
  h1: '!m-0 !p-0 font-heading !text-[clamp(1.5rem,3.2vw,2.125rem)] !font-bold !leading-tight !tracking-tight !text-site-primary',
  h2: '!m-0 !p-0 font-heading !text-[clamp(1.125rem,2vw,1.5rem)] !font-bold !leading-snug !text-site-primary',
  h3: '!m-0 !p-0 font-heading !text-[0.9375rem] !font-semibold !leading-snug !text-site-primary sm:!text-base',
  body: '!m-0 !p-0 font-body !text-[0.9375rem] !leading-[1.7] !text-site-muted sm:!text-base',
  bodySm: '!m-0 !p-0 font-body !text-sm !leading-relaxed !text-site-muted',
  caption: '!m-0 !p-0 font-body !text-xs !leading-normal !text-site-soft',
  price:
    '!m-0 !p-0 font-heading !text-[clamp(1.625rem,3.2vw,2.125rem)] !font-extrabold !leading-none !text-site-accent',
  backLink:
    '!m-0 !mb-7 inline-flex items-center gap-2 !p-0 font-body !text-sm !font-semibold !text-site-accent-dark no-underline transition hover:!text-site-accent',
};

export const BTN = {
  primary:
    'm-0 inline-flex min-h-[2.75rem] cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-site-primary px-6 py-3.5 font-body text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-site-accent-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60',
  outline:
    'm-0 inline-flex min-h-[2.75rem] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-site-primary bg-transparent px-6 py-3.5 font-body text-sm font-bold text-site-primary transition hover:bg-site-primary hover:text-white',
  pill: 'm-0 inline-flex min-h-[2rem] cursor-pointer items-center justify-center gap-1 rounded-full border-0 bg-site-accent-dark px-3 py-1.5 font-body text-[0.6875rem] font-bold text-white no-underline shadow-sm transition hover:bg-site-primary sm:min-h-[2.125rem] sm:px-3.5 sm:text-xs',
  grow: 'flex-1 min-w-0',
  static: 'flex-none w-auto',
};

export const TAB =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-site-accent-dark/12 bg-site-bg px-2.5 py-1.5 font-body text-xs font-semibold text-site-muted transition hover:border-site-accent/40 hover:bg-site-surface hover:text-site-primary sm:px-3 sm:py-2';

export const TAB_ACTIVE =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-site-primary bg-site-primary px-2.5 py-1.5 font-body text-xs font-semibold text-white shadow-sm transition sm:px-3 sm:py-2';

export const TAB_COUNT =
  'inline-flex min-w-[1rem] items-center justify-center rounded bg-site-accent-dark/10 px-1 py-0.5 font-body text-[0.625rem] font-bold tabular-nums leading-none text-site-accent-dark';

export const TAB_COUNT_ACTIVE =
  'inline-flex min-w-[1rem] items-center justify-center rounded bg-white/20 px-1 py-0.5 font-body text-[0.625rem] font-bold tabular-nums leading-none text-white/95';

export const CHIP =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-site-accent-dark/15 bg-site-bg px-2.5 py-1.5 font-body text-[0.6875rem] font-semibold text-site-muted transition hover:border-site-accent/45 hover:bg-site-surface hover:text-site-primary sm:px-3 sm:py-2 sm:text-xs';

export const CHIP_ACTIVE =
  'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-site-accent-dark bg-site-accent-dark px-2.5 py-1.5 font-body text-[0.6875rem] font-semibold text-white shadow-sm sm:px-3 sm:py-2 sm:text-xs';

export const CHIP_GHOST =
  'm-0 cursor-pointer border-0 bg-transparent p-0 font-body text-xs font-bold text-site-accent-dark underline-offset-2 hover:underline';

export const CARD =
  'group m-0 flex h-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_1px_8px_rgba(74,44,42,0.05)] transition duration-200 hover:border-site-accent/25 hover:shadow-[0_4px_16px_rgba(74,44,42,0.08)]';

export const FILTER_BAR =
  'sticky top-[var(--header-h)] z-30 border-b border-site-accent-dark/10 bg-site-surface/95 shadow-sm backdrop-blur-md';

export const SELECT =
  'm-0 cursor-pointer appearance-none rounded-lg border border-site-accent-dark/15 bg-site-bg py-1.5 pl-2.5 pr-8 font-body text-[0.6875rem] font-semibold text-site-muted outline-none transition hover:border-site-accent/40 focus:border-site-accent focus:ring-2 focus:ring-site-accent/15 sm:py-2 sm:pl-3 sm:text-xs';
