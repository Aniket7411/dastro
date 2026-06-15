/** Shared Tailwind class tokens — replaces index.css utility classes */

export const PAGE_WRAP = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';

export const SITE_PAGE = 'min-h-screen w-full bg-site-bg font-body text-site-text';

/** Use on new/migrated pages — pairs with <TailwindPage> and tw-page.css Bootstrap isolation */
export const TAILWIND_PAGE =
  'tw-page min-h-screen w-full overflow-x-hidden bg-site-bg font-body text-site-text antialiased';

/** Standard form field wrappers (styles live in src/styles/tw-page.css) */
export const TW_FIELD = 'tw-field';
export const TW_FIELD_LABEL = 'tw-field__label';
export const TW_FIELD_INPUT = 'tw-field__input';
export const TW_FIELD_INPUT_FILTER = 'tw-field__input tw-field__input--filter';

export const SITE_SHELL =
  'min-h-screen w-full overflow-x-clip bg-site-bg font-body text-site-text';

export const SITE_CONTAINER = PAGE_WRAP;

export const SITE_KICKER =
  'mb-3 inline-block font-body text-kicker font-extrabold uppercase tracking-[0.12em] text-site-accent-dark';

export const SITE_TITLE =
  'm-0 font-heading text-[clamp(1.5rem,2.5vw,1.875rem)] font-extrabold leading-tight tracking-normal text-site-primary';

export const SITE_TITLE_LG =
  'm-0 font-heading text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold leading-[1.12] tracking-normal text-site-primary';

export const SITE_SUBTITLE = 'text-base leading-relaxed text-site-muted';

export const SITE_PRICE =
  'font-price text-[clamp(1.375rem,3vw,2rem)] font-bold leading-none tracking-tight text-site-accent-dark tabular-nums';

export const SITE_PRICE_SM =
  'font-price text-base font-bold leading-none tracking-tight text-site-primary tabular-nums';

export const SITE_CARD =
  'rounded-[14px] border border-site-accent-dark/14 bg-white shadow-[0_10px_24px_rgba(42,15,2,0.06)] transition duration-200 hover:-translate-y-1 hover:border-site-accent hover:shadow-[0_18px_36px_rgba(139,74,30,0.12)]';

const SITE_BTN_BASE =
  'inline-flex min-h-10 items-center justify-center rounded-[9px] px-[1.05rem] py-2.5 font-body text-[0.9375rem] font-bold leading-tight no-underline transition';

export const SITE_BTN = SITE_BTN_BASE;

export const SITE_BTN_PRIMARY = [
  SITE_BTN_BASE,
  'border border-site-primary bg-site-primary text-white',
  'hover:-translate-y-px hover:border-[#6b3514] hover:bg-[#6b3514]',
].join(' ');

export const SITE_BTN_OUTLINE = [
  SITE_BTN_BASE,
  'border border-site-accent-dark/24 bg-transparent text-site-primary',
  'hover:border-site-primary hover:bg-site-primary hover:text-white',
].join(' ');

export const BANNER_CONTENT_GAP = 'mt-10 md:mt-14';

export const POLICY_MAIN = [
  'flex w-full min-w-0 flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]',
  'rounded-[0.9rem] border border-site-accent-dark/16 bg-[#fffaf4]',
  'p-[clamp(1.15rem,2.5vw,2rem)] shadow-[0_16px_38px_rgba(42,15,2,0.08)]',
  '[&_.content-section]:scroll-mt-[6.5rem]',
  '[&_.section-title]:m-0 [&_.section-title]:mb-3 [&_.section-title]:font-heading',
  '[&_.section-title]:text-[clamp(1.35rem,2.2vw,1.75rem)] [&_.section-title]:font-extrabold [&_.section-title]:leading-tight [&_.section-title]:text-site-accent-dark',
  '[&_.contact-title]:m-0 [&_.contact-title]:mb-3 [&_.contact-title]:font-heading [&_.contact-title]:text-[clamp(1.35rem,2.2vw,1.75rem)] [&_.contact-title]:font-extrabold [&_.contact-title]:text-site-accent-dark',
  '[&_.subsection-title]:mb-2 [&_.subsection-title]:mt-4 [&_.subsection-title]:font-heading',
  '[&_.subsection-title]:text-[clamp(1.05rem,1.6vw,1.25rem)] [&_.subsection-title]:font-bold [&_.subsection-title]:text-[#5a2a11]',
  '[&_.content-section>p]:mb-4 [&_.content-section>p]:text-sm [&_.content-section>p]:leading-relaxed [&_.content-section>p]:text-site-muted',
  '[&_.contact-desc]:mb-4 [&_.contact-desc]:text-sm [&_.contact-desc]:text-site-muted',
  '[&_.content-list]:mb-4 [&_.content-list]:ml-5 [&_.content-list]:list-disc [&_.content-list]:text-sm [&_.content-list]:leading-relaxed [&_.content-list]:text-site-muted',
  '[&_.content-list>li]:my-1.5',
  '[&_.content-section>p>strong]:font-bold [&_.content-section>p>strong]:text-site-text',
  '[&_.content-list>strong]:font-bold [&_.content-list>strong]:text-site-text',
  '[&_.contact-box]:rounded-xl [&_.contact-box]:border [&_.contact-box]:border-site-accent-dark/14 [&_.contact-box]:bg-[#fffaf3] [&_.contact-box]:p-4',
  '[&_.contact-button]:mt-3 [&_.contact-button]:inline-flex [&_.contact-button]:items-center [&_.contact-button]:rounded-full',
  '[&_.contact-button]:bg-site-accent-dark [&_.contact-button]:px-5 [&_.contact-button]:py-2.5 [&_.contact-button]:text-sm [&_.contact-button]:font-bold [&_.contact-button]:text-white [&_.contact-button]:no-underline',
  '[&_.contact-button:hover]:bg-[#6b3514]',
  '[&_table]:mb-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-site-accent-dark/14 [&_table]:bg-[#fffaf4]',
  '[&_th]:border-b [&_th]:border-site-accent-dark/14 [&_th]:bg-[#fff6ea] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-bold [&_th]:text-site-primary',
  '[&_td]:border-b [&_td]:border-site-accent-dark/10 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-site-muted',
].join(' ');
