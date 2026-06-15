import { PAGE_WRAP, TW_FIELD, TW_FIELD_LABEL, TW_FIELD_INPUT } from '../../utils/siteTokens';

export { TW_FIELD, TW_FIELD_LABEL, TW_FIELD_INPUT };

export const WB_WRAP = PAGE_WRAP;

export const WB_PAGE =
  '!bg-[#F8FAFC] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_24px] pb-[4.25rem] font-body text-slate-800 antialiased sm:pb-[4.75rem]';

export const WB_HIGHLIGHT = '!text-[#EE6662]';
export const WB_PURPLE = '!text-[#3B2261]';
export const WB_WHITE = '!text-white';

/** Section rhythm — compact, consistent vertical padding */
export const WB_SECTION = 'py-10 sm:py-12 lg:py-14';
export const WB_SECTION_HERO = 'pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14';
/** Tighter section joins — less gap between Why → Patterns */
export const WB_SECTION_WHY = 'pt-10 pb-5 sm:pt-12 sm:pb-6 lg:pt-14 lg:pb-7';
export const WB_SECTION_PATTERNS = 'pt-5 pb-10 sm:pt-6 sm:pb-12 lg:pt-7 lg:pb-14';
export const WB_SECTION_HEADER = 'mb-6 text-center sm:mb-8';
export const WB_STACK = 'mt-6 sm:mt-8';
export const WB_CTA_ROW = 'mt-6 text-center sm:mt-8';
export const WB_CTA_ROW_TIGHT = '!mt-3 !mb-0 text-center';

/** Centered intro block (title + subtitle) — Tailwind-only, no custom CSS */
export const WB_SECTION_INTRO =
  '!mx-auto !w-full !max-w-3xl !text-center [&_h2]:!m-0 [&_h2]:!mb-0 [&_h2]:!text-center [&_p]:!m-0 [&_p]:!text-center';

export const WB_SECTION_INTRO_SUB =
  '!mt-2 !mb-0 !mx-auto !block !w-full !max-w-2xl !text-center';

export const WB_WHY_GRID = 'mt-4 grid gap-2.5 sm:grid-cols-2 sm:gap-3';

export const WB_WHY_CARD =
  '!m-0 flex items-start gap-2.5 rounded-lg border border-violet-100 bg-white !p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#EE6662] hover:shadow-md sm:!gap-3 sm:!p-3.5';

export const WB_WHY_ICON = 'shrink-0 pt-0.5 text-base text-[#EE6662] sm:text-lg';

export const WB_WHY_FOOTER = '!mt-4 !mb-0 flex flex-col items-center gap-3 text-center';

export const WB_PATTERN_CARD =
  '!m-0 rounded-lg border border-slate-100 bg-white !p-4 !text-left shadow-sm sm:!p-4';

export const WB_PATTERN_ICON = 'mb-2 text-2xl text-[#3B2261] sm:mb-2.5';

export const WB_PATTERN_GRID =
  '!mt-4 grid gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 lg:!mt-5 lg:gap-4';

export const WB_LEARN_GRID = 'mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4';

export const WB_LEARN_CARD =
  '!m-0 flex items-start gap-3 rounded-lg border border-violet-100 bg-[#FDF4FF] !p-3.5 sm:!gap-3.5 sm:!p-4';

export const WB_LEARN_ICON = 'shrink-0 pt-0.5 text-xl text-[#3B2261] opacity-80 sm:text-[1.35rem]';

/** Typography — font-body for UI, font-heading for titles; ! beats Bootstrap */
export const TYPE = {
  kicker:
    '!m-0 block font-body !text-[0.6875rem] !font-extrabold uppercase !tracking-[0.2em] !text-[#EE6662] sm:!text-xs',
  h1: '!m-0 font-heading !text-[clamp(1.625rem,3.8vw,2.75rem)] !font-extrabold !leading-[1.12] !tracking-tight !text-[#3B2261]',
  h1Center:
    '!m-0 mx-auto w-full max-w-[48rem] !text-center font-heading !text-[clamp(1.625rem,3.8vw,2.75rem)] !font-extrabold !leading-[1.12] !tracking-tight !text-[#3B2261] [&]:text-center',
  h2: '!m-0 font-heading !text-[clamp(1.375rem,2.8vw,2rem)] !font-extrabold !leading-tight !tracking-tight !text-[#3B2261]',
  h2Center:
    '!m-0 !mx-auto !block !w-full !max-w-3xl !text-center !font-heading !text-[clamp(1.375rem,2.8vw,2rem)] !font-extrabold !leading-tight !tracking-tight !text-[#3B2261]',
  h2OnDark:
    '!m-0 text-center font-heading !text-[clamp(1.375rem,2.8vw,2rem)] !font-extrabold !leading-tight !tracking-tight !text-white',
  h3: '!m-0 font-heading !text-[1.0625rem] !font-bold !leading-snug !text-[#3B2261] sm:!text-lg',
  h4: '!m-0 font-body !text-[0.6875rem] !font-bold uppercase !tracking-[0.08em] !text-white/80 sm:!text-xs',
  body: '!m-0 font-body !text-[0.9375rem] !font-normal !leading-[1.65] !text-slate-600 sm:!text-base',
  bodyCenter:
    '!m-0 !mx-auto !block !w-full !max-w-2xl !text-center !font-body !text-[0.9375rem] !font-normal !leading-[1.65] !text-slate-600 sm:!text-base',
  bodyOnDark: '!m-0 font-body !text-[0.9375rem] !font-normal !leading-[1.65] !text-white/85 sm:!text-base',
  bodySm: '!m-0 font-body !text-sm !font-normal !leading-relaxed !text-slate-500',
  bodySmOnDark: '!m-0 font-body !text-sm !font-normal !leading-relaxed !text-white/80',
  lead: '!m-0 font-body !text-[0.9375rem] !font-semibold !leading-snug !text-slate-800 sm:!text-base',
  leadBold: '!m-0 font-body !text-base !font-bold !leading-snug !text-slate-800 sm:!text-[1.0625rem]',
  caption: '!m-0 font-body !text-[0.6875rem] !font-bold uppercase !tracking-[0.06em] !text-slate-500 sm:!text-xs',
  stat: '!m-0 font-heading !text-[1.0625rem] !font-extrabold !leading-none !text-[#3B2261] sm:!text-xl',
  statLabel:
    '!m-0 font-body !text-[0.625rem] !font-bold uppercase !tracking-[0.05em] !text-slate-500 sm:!text-[0.6875rem]',
  faqQ: '!m-0 font-body !text-[0.9375rem] !font-semibold !leading-snug !text-white sm:!text-base',
  faqA: '!m-0 font-body !text-sm !font-normal !leading-[1.65] !text-slate-700 sm:!text-[0.9375rem]',
  media: '!m-0 font-body !text-xs !font-extrabold uppercase !tracking-wide !text-neutral-900',
};

export const WB_SUBTITLE = TYPE.kicker;
export const WB_TITLE = TYPE.h2;
export const WB_TITLE_CENTER = TYPE.h2Center;
export const WB_TITLE_LG = TYPE.h2Center;
export const WB_TITLE_HERO = TYPE.h1Center;
export const WB_UNDERLINE = 'mx-auto mt-2.5 h-0.5 w-12 rounded-full bg-[#EE6662]';

export const WB_BRIDGE_LINE = `${TYPE.leadBold} !mb-0`;

export const WB_CTA =
  'm-0 inline-flex min-h-[2.75rem] cursor-pointer appearance-none items-center justify-center rounded-xl border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-5 py-2.5 font-body !text-sm !font-bold !text-white shadow-[0_8px_18px_rgba(238,102,98,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(238,102,98,0.36)] sm:min-h-[2.875rem] sm:px-6 sm:!text-[0.9375rem]';

export const WB_BADGE =
  'inline-flex items-center gap-2 rounded-full bg-[#3B2261] px-4 py-1.5 font-body !text-xs !font-bold !text-white sm:px-5 sm:py-2 sm:!text-[0.8125rem]';

export const WB_BADGE_ICON =
  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#EE6662] !text-[0.6875rem] sm:h-7 sm:w-7 sm:!text-xs';

export const WB_INSTRUCTOR_BADGE =
  'inline-block rounded-full bg-[#EE6662] px-3 py-1 font-body !text-[0.625rem] !font-bold uppercase !tracking-[0.08em] !text-white sm:px-3.5 sm:py-1.5 sm:!text-[0.6875rem]';

export const WB_CARD =
  'rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]';

export const WB_INFO_CARD =
  'flex items-center gap-3 rounded-xl bg-[#3B2261] p-4 text-white transition hover:-translate-y-0.5 sm:gap-4 sm:p-5';

export const WB_SIDE_NAV =
  'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/90 !text-sm text-[#3B2261] shadow-md backdrop-blur transition hover:border-[#EE6662] hover:bg-[#EE6662] hover:text-white hover:shadow-[0_0_16px_rgba(238,102,98,0.35)] max-md:hidden sm:h-11 sm:w-11';

export const WB_SIDE_NAV_HIDDEN = 'pointer-events-none opacity-0';

export const WB_SLIDER_TRACK =
  'flex gap-4 overflow-x-auto scroll-smooth py-3 pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-5 sm:pb-7';
