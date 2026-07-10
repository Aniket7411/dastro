import { PAGE_WRAP, TW_BODY, TW_BODY_SM, TW_KICKER } from '../../utils/siteTokens';

export { PAGE_WRAP };

export const DASHBOARD_ROOT =
  'student-dashboard-ui flex w-full min-w-0 flex-col bg-site-bg font-body text-site-text antialiased [font-feature-settings:"kern"_1,"liga"_1]';

/**
 * Dashboard typography — single family (Plus Jakarta Sans).
 * App-style UI: hierarchy via size/weight, not serif/sans mixing.
 */
export const TYPE = {
  heroTitle:
    'font-body text-[clamp(1.375rem,3vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.025em] text-white',
  heroName:
    'bg-gradient-to-r from-[#f5c98d] to-[#e8a855] bg-clip-text font-body font-extrabold text-transparent',
  heroLead: `${TW_BODY} font-body text-[#f5d9b8]/90`,
  heroKicker:
    'font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#f5c98d] sm:text-[11px]',
  sectionTitle:
    'font-body text-base font-extrabold tracking-[-0.02em] text-site-primary sm:text-[1.0625rem]',
  cardTitle:
    'font-body text-[0.9375rem] font-bold leading-snug tracking-[-0.01em] text-site-primary sm:text-base',
  cardTitleSm:
    'font-body text-sm font-bold leading-snug tracking-[-0.01em] text-site-primary',
  statValue:
    'font-price text-[1.5rem] font-extrabold leading-none tracking-[-0.03em] text-site-primary tabular-nums sm:text-[1.625rem]',
  statLabel:
    'font-body text-[10px] font-bold uppercase tracking-[0.1em] text-site-muted sm:text-[11px]',
  body: `${TW_BODY} font-body text-site-muted`,
  bodySm: `${TW_BODY_SM} font-body`,
  meta: 'font-body text-xs leading-normal text-site-muted',
  metaBold: 'font-body text-xs font-semibold text-site-muted',
  kicker: `${TW_KICKER} font-body`,
  fieldLabel:
    'mb-1.5 block font-body text-[10px] font-bold uppercase tracking-[0.12em] text-site-accent',
  fieldLabelPlain:
    'font-body text-[10px] font-bold uppercase tracking-[0.12em] text-site-accent',
  panelKicker:
    'font-body text-[10px] font-bold uppercase tracking-[0.14em] text-site-accent',
  priceLg:
    'font-price text-2xl font-extrabold tabular-nums tracking-[-0.03em] text-site-accent-dark',
  priceSm: 'font-price text-[10px] font-bold tabular-nums text-site-accent',
};

export const CARD =
  'rounded-xl border border-site-accent-dark/12 bg-white shadow-[0_1px_8px_rgba(42,15,2,0.05)]';

export const STAT_CARD =
  'flex min-h-0 items-center gap-3.5 rounded-xl border border-t-2 border-site-accent-dark/10 px-4 py-3.5 shadow-[0_1px_6px_rgba(42,15,2,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(42,15,2,0.09)] sm:px-4 sm:py-4';

export const INPUT =
  'sd-field w-full rounded-xl border border-site-accent-dark/20 bg-[#fffcf8] px-4 py-2.5 font-body text-sm font-medium text-site-primary outline-none transition focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/20';

const BTN_BASE =
  'sd-btn m-0 inline-flex w-auto max-w-full shrink-0 cursor-pointer select-none appearance-none items-center justify-center gap-1.5 rounded-full px-4 py-2 font-body text-sm font-semibold no-underline outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

export const BTN = {
  primary: `${BTN_BASE} border-0 bg-site-primary text-white shadow-sm hover:bg-site-accent-dark hover:text-white hover:shadow-md`,
  outline: `${BTN_BASE} border border-site-accent-dark/25 bg-white text-site-primary hover:border-site-accent hover:bg-site-bg hover:text-site-primary`,
  hero: `${BTN_BASE} border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white`,
  heroGhost: `${BTN_BASE} border border-white/15 bg-white/5 text-white/85 hover:bg-white/15 hover:text-white`,
  sm: `${BTN_BASE} px-3 py-1.5 text-xs`,
  link: `${BTN_BASE} no-underline visited:text-inherit`,
};
