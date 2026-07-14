/**
 * Tailwind-only design tokens — single source of truth for public pages.
 * Palette & type: src/pages/ds-astrology-design-system.html ("Manuscript & Brass")
 *
 * New page checklist (MainLayout auto-applies Bootstrap isolation via tw-page):
 *   1. import { PAGE_WRAP, TW_H1, TW_BODY, SECTION_PY, SITE_BTN_PRIMARY } from '@/utils/siteTokens'
 *   2. Use flex/grid layouts — no Bootstrap classes, no inline <style>, no custom CSS files
 *   3. Wrap content sections in PAGE_WRAP; use PageSection for vertical rhythm
 */

export const PAGE_WRAP = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';

export const SITE_PAGE = 'min-h-screen w-full bg-site-bg font-body text-site-text';

/** Applied by MainLayout / StandaloneLayout — blocks Bootstrap reboot inside page content */
export const TW_PAGE_ROOT = 'tw-page w-full min-h-full antialiased';

/** Full page shell when not using MainLayout (rare) */
export const TAILWIND_PAGE =
  'tw-page min-h-screen w-full overflow-x-hidden bg-site-bg font-body text-site-text antialiased';

/** Routes that manage their own page shell (legacy Bootstrap or custom theme like /webinar) */
export const SKIP_LAYOUT_TW_PAGE_PATHS = new Set(['/', '/webinar']);

/** @deprecated use SKIP_LAYOUT_TW_PAGE_PATHS */
export const LEGACY_BOOTSTRAP_PATHS = SKIP_LAYOUT_TW_PAGE_PATHS;

/** Standard form field wrappers (styles live in src/styles/tw-page.css) */
export const TW_FIELD = 'tw-field';
export const TW_FIELD_LABEL = 'tw-field__label';
export const TW_FIELD_INPUT = 'tw-field__input';
export const TW_FIELD_INPUT_FILTER = 'tw-field__input tw-field__input--filter';

export const SITE_SHELL =
  'min-h-screen w-full overflow-x-clip bg-site-bg font-body text-site-text';

export const SITE_CONTAINER = PAGE_WRAP;

/** Shared vertical rhythm for public pages */
export const SECTION_PY = 'py-10 sm:py-12 lg:py-14';
export const SECTION_PY_SM = 'py-8 sm:py-10';

/** Eyebrow / label — IBM Plex · 13px · 600 · caps */
export const TW_KICKER =
  'mb-2 inline-block font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-site-accent-dark';

export const SITE_KICKER = TW_KICKER;

/** H1 / Display — Bricolage · 54px · 800 */
export const TW_H1 =
  'font-heading text-[clamp(2rem,5vw,3.375rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-site-text';

/** H2 / Section — Bricolage · 34px · 700 */
export const TW_H2 =
  'font-heading text-[clamp(1.75rem,3.5vw,2.125rem)] font-bold leading-[1.08] tracking-[-0.01em] text-site-text';

/** H3 / Card title — Bricolage · 23px · 600 */
export const TW_H3 =
  'font-heading text-[clamp(1.125rem,2.2vw,1.4375rem)] font-semibold leading-snug text-site-text';

export const SITE_TITLE = TW_H2;
export const SITE_TITLE_LG = TW_H1;

/** Body — IBM Plex Sans · 18px · 400 · ink */
export const TW_BODY = 'font-body text-lg font-normal leading-relaxed text-site-text';

/** Small / caption — IBM Plex Sans · 15px · 400 · cocoa */
export const TW_BODY_SM = 'font-body text-[15px] font-normal leading-relaxed text-site-muted';

export const TW_LEAD = 'max-w-xl font-body text-lg font-normal leading-relaxed text-site-muted';

export const SITE_SUBTITLE = TW_LEAD;

export const TW_STACK = 'flex flex-col gap-4';
export const TW_STACK_SM = 'flex flex-col gap-3';

export const SITE_PRICE =
  'font-price text-[clamp(1.3125rem,3vw,1.3125rem)] font-semibold leading-none tracking-[0.01em] text-site-text tabular-nums';

export const SITE_PRICE_SM =
  'font-price text-base font-semibold leading-none tracking-tight text-site-text tabular-nums';

/** Cards — parchment surface, border hairline */
export const SITE_CARD =
  'rounded-[14px] border border-site-border bg-site-surface shadow-[0_2px_5px_rgba(51,37,26,0.08)] transition duration-150 hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(51,37,26,0.12)]';

/** §03 Navigation — 15px medium ink; active copper-ink semibold */
export const SITE_NAV_LINK =
  'relative inline-flex items-center gap-1 px-2.5 py-2 font-body text-[15px] font-medium !no-underline decoration-transparent text-site-text transition-colors visited:!text-site-text hover:!no-underline hover:!text-site-accent-dark sm:px-3';

export const SITE_NAV_LINK_ACTIVE =
  '!font-semibold !text-site-accent-dark visited:!text-site-accent-dark after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[70%] after:-translate-x-1/2 after:rounded-full after:bg-site-accent-dark';

export const SITE_NAV_LINK_MOBILE =
  'block px-4 py-3.5 font-body text-sm font-medium !text-site-text !no-underline transition hover:!text-site-accent-dark hover:!no-underline';

/** §03 Course card */
export const SITE_COURSE_CARD =
  'group flex h-full flex-col overflow-hidden rounded-2xl border border-site-border bg-site-surface shadow-[0_2px_5px_rgba(51,37,26,0.08)] transition duration-150 hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(51,37,26,0.12)]';

export const SITE_COURSE_CARD_BODY =
  'flex flex-1 flex-col px-3 py-2.5 min-[480px]:px-3.5 min-[480px]:py-3 sm:px-[18px] sm:py-4';

export const SITE_COURSE_CARD_FOOTER =
  'mt-auto flex flex-col gap-2 border-t border-site-border/60 pt-2.5 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between min-[480px]:gap-2 min-[480px]:pt-3 sm:pt-4';

export const SITE_COURSE_CARD_KICKER =
  'mb-1 truncate font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-site-accent-dark sm:mb-1.5 sm:text-xs sm:tracking-[0.14em]';

export const SITE_COURSE_CARD_TITLE =
  'font-heading text-[0.875rem] font-bold leading-snug text-site-text no-underline transition hover:text-site-accent-dark min-[480px]:text-base sm:text-xl';

export const SITE_COURSE_CARD_DESC =
  'mb-2 hidden flex-1 font-body leading-normal text-site-muted min-[480px]:block min-[480px]:line-clamp-2 min-[480px]:text-sm sm:mb-3 sm:text-[15px]';

export const SITE_COURSE_CARD_BADGE =
  'absolute rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] sm:rounded-md sm:px-2 sm:py-1 sm:text-[11px] sm:tracking-[0.08em]';

export const SITE_COURSE_CARD_BADGE_META =
  'left-2.5 top-2.5 bg-white/92 text-site-primary';

export const SITE_COURSE_CARD_BADGE_RECORDED =
  'inline-flex w-fit items-center gap-0.5 !rounded-full bg-[#0a0a0a]/95 text-white shadow-[0_1px_4px_rgba(0,0,0,0.3)]';

/** Duration strip — full-width bar flush to bottom of image (design §03) */
export const SITE_COURSE_CARD_DURATION =
  'pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-center justify-center gap-1 bg-black/55 px-1.5 py-1 font-body text-[9.5px] font-medium leading-tight text-white sm:gap-1.5 sm:py-1.5 sm:text-[10px]';

/** Duration strip as its own block BELOW the image, not overlaid on top of it */
export const SITE_COURSE_CARD_DURATION_STRIP =
  'flex w-full items-center justify-center gap-1 bg-site-primary px-2 py-1.5 font-body text-[8.5px] font-medium leading-tight text-white sm:gap-1.5 sm:py-2 sm:text-[9.5px]';

/** §03 Hero panel — parchment block on cream pages */
export const SITE_HERO_PANEL =
  'rounded-2xl border border-site-border bg-site-surface p-8 sm:p-10';

export const SITE_HERO_PANEL_TITLE =
  'font-heading text-[clamp(1.75rem,4vw,2.625rem)] font-extrabold leading-[1.05] text-site-text';

export const SITE_HERO_PANEL_ACCENT = 'text-site-accent';

/** §03 Dark band — single deep-brown CTA block */
export const SITE_BAND_INNER = 'mx-auto max-w-3xl text-center';

export const SITE_BAND_TITLE =
  'font-heading text-[clamp(1.75rem,3.5vw,2.125rem)] font-extrabold leading-[1.08] text-site-cream';

export const SITE_BAND_BODY = 'mx-auto max-w-xl font-body text-lg leading-relaxed text-[#e8ddca]';

const SITE_BTN_FOCUS =
  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-site-accent-dark';

const SITE_BTN_MOTION =
  'transition duration-150 hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(51,37,26,0.17)] active:translate-y-0 motion-reduce:transform-none motion-reduce:hover:transform-none';

const SITE_BTN_BASE = [
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border-2 px-6 py-3.5',
  'font-body text-base font-semibold leading-none no-underline',
  'shadow-[0_2px_5px_rgba(51,37,26,0.10)]',
  SITE_BTN_MOTION,
  SITE_BTN_FOCUS,
].join(' ');

export const SITE_BTN = SITE_BTN_BASE;

/** Brown-deep fill — boldest action */
export const SITE_BTN_PRIMARY = [
  SITE_BTN_BASE,
  'border-transparent bg-site-primary text-site-cream',
  'hover:bg-[#241a12]',
].join(' ');

/** Deep copper fill — strong warm action */
export const SITE_BTN_COPPER = [
  SITE_BTN_BASE,
  'border-transparent bg-site-accent-dark text-white',
  'hover:bg-[#743d16]',
].join(' ');

/** Compact copper CTA on course cards */
export const SITE_BTN_CARD = [
  'inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-lg border-0',
  'bg-site-accent-dark px-2.5 py-1.5 font-body text-[11px] font-semibold text-white no-underline',
  'min-[480px]:w-auto min-[480px]:rounded-[10px] min-[480px]:px-2.5 min-[480px]:py-1.5 min-[480px]:text-[11px]',
  'sm:px-3.5 sm:py-2 sm:text-xs',
  'shadow-[0_2px_4px_rgba(51,37,26,0.08)]',
  SITE_BTN_MOTION,
  SITE_BTN_FOCUS,
  'hover:bg-[#743d16]',
  '[-webkit-tap-highlight-color:transparent]',
].join(' ');

/** Tonal — secondary but still clearly a button (replaces hollow outline) */
export const SITE_BTN_TONAL = [
  SITE_BTN_BASE,
  'border-site-accent-dark bg-[#fffdf8] text-site-accent-dark',
  'hover:bg-white',
].join(' ');

/** @deprecated use SITE_BTN_TONAL */
export const SITE_BTN_OUTLINE = SITE_BTN_TONAL;

/** Larger CTAs — course sections, hero pairs */
export const SITE_BTN_LG = 'min-h-12 px-[1.875rem] py-4 text-[17px] rounded-[13px]';

/** Compact CTAs — section intros, secondary rows */
const SITE_BTN_COMPACT = [
  'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[10px] border-2 px-4 py-2',
  'font-body text-sm font-semibold leading-none no-underline',
  'shadow-[0_2px_4px_rgba(51,37,26,0.08)]',
  SITE_BTN_MOTION,
  SITE_BTN_FOCUS,
].join(' ');

export const SITE_BTN_TONAL_COMPACT = [
  SITE_BTN_COMPACT,
  'border-site-accent-dark bg-[#fffdf8] text-site-accent-dark hover:bg-white',
].join(' ');

export const SITE_BTN_COPPER_COMPACT = [
  SITE_BTN_COMPACT,
  'border-transparent bg-site-accent-dark text-white hover:bg-[#743d16]',
].join(' ');

export const SITE_BTN_PRIMARY_LG = [SITE_BTN_PRIMARY, SITE_BTN_LG].join(' ');
export const SITE_BTN_COPPER_LG = [SITE_BTN_COPPER, SITE_BTN_LG].join(' ');
export const SITE_BTN_TONAL_LG = [SITE_BTN_TONAL, SITE_BTN_LG].join(' ');

/** Tonal on dark bands — cream fill, brown-deep text */
export const SITE_BTN_TONAL_ON_DARK = [
  SITE_BTN_BASE,
  'border-transparent bg-site-cream text-site-primary',
  'hover:bg-white',
].join(' ');

export const SITE_BTN_TONAL_ON_DARK_LG = [SITE_BTN_TONAL_ON_DARK, SITE_BTN_LG].join(' ');

/** Compact navbar CTA — keeps pill shape, same palette */
export const SITE_BTN_NAV = [
  'inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-transparent',
  'px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] no-underline sm:px-[1.125rem] sm:py-2.5 sm:text-xs',
  'bg-site-primary text-site-cream shadow-[0_2px_5px_rgba(51,37,26,0.10)]',
  SITE_BTN_MOTION,
  SITE_BTN_FOCUS,
  'hover:bg-[#241a12]',
].join(' ');

/** Dark band CTA section — single deep-brown moment per page */
export const SITE_BAND =
  'rounded-[18px] bg-site-primary px-6 py-10 text-center text-site-cream sm:px-8 sm:py-12';

export const BANNER_CONTENT_GAP = 'mt-10 md:mt-14';

export const POLICY_MAIN = [
  'flex w-full min-w-0 flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]',
  'rounded-[0.9rem] border border-site-border bg-site-surface',
  'p-[clamp(1.15rem,2.5vw,2rem)] shadow-[0_16px_38px_rgba(51,37,26,0.08)]',
  '[&_.content-section]:scroll-mt-[6.5rem]',
  '[&_.section-title]:m-0 [&_.section-title]:mb-3 [&_.section-title]:font-heading',
  '[&_.section-title]:text-[clamp(1.35rem,2.2vw,1.75rem)] [&_.section-title]:font-bold [&_.section-title]:leading-tight [&_.section-title]:text-site-text',
  '[&_.contact-title]:m-0 [&_.contact-title]:mb-3 [&_.contact-title]:font-heading [&_.contact-title]:text-[clamp(1.35rem,2.2vw,1.75rem)] [&_.contact-title]:font-bold [&_.contact-title]:text-site-text',
  '[&_.subsection-title]:mb-2 [&_.subsection-title]:mt-4 [&_.subsection-title]:font-heading',
  '[&_.subsection-title]:text-[clamp(1.05rem,1.6vw,1.25rem)] [&_.subsection-title]:font-semibold [&_.subsection-title]:text-site-accent-dark',
  '[&_.content-section>p]:mb-4 [&_.content-section>p]:text-base [&_.content-section>p]:leading-relaxed [&_.content-section>p]:text-site-muted',
  '[&_.contact-desc]:mb-4 [&_.contact-desc]:text-base [&_.contact-desc]:text-site-muted',
  '[&_.content-list]:mb-4 [&_.content-list]:ml-5 [&_.content-list]:list-disc [&_.content-list]:text-base [&_.content-list]:leading-relaxed [&_.content-list]:text-site-muted',
  '[&_.content-list>li]:my-1.5',
  '[&_.content-section>p>strong]:font-semibold [&_.content-section>p>strong]:text-site-text',
  '[&_.content-list>strong]:font-semibold [&_.content-list>strong]:text-site-text',
  '[&_.contact-box]:rounded-xl [&_.contact-box]:border [&_.contact-box]:border-site-border [&_.contact-box]:bg-site-bg [&_.contact-box]:p-4',
  '[&_.contact-button]:mt-3',
  '[&_table]:mb-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-site-border [&_table]:bg-site-surface',
  '[&_th]:border-b [&_th]:border-site-border [&_th]:bg-site-sand [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-site-text',
  '[&_td]:border-b [&_td]:border-site-border/60 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-site-muted',
].join(' ');
