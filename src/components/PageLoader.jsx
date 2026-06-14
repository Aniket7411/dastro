import { Loader2, Stars } from 'lucide-react';

function RingSpinner({ ringClass = 'h-14 w-14', iconSize = 24 }) {
  return (
    <div className={`relative flex ${ringClass} items-center justify-center`}>
      <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-site-accent-dark/12 border-t-site-accent-dark/65" />
      <Stars size={iconSize} className="text-site-accent-dark/55" aria-hidden />
    </div>
  );
}

/* ── Full page / section loader ── */
export function PageLoader({ label = 'Loading…', compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 bg-site-bg ${
        compact ? 'py-16' : 'min-h-[60vh]'
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <RingSpinner ringClass="h-14 w-14" iconSize={24} />
      {label && (
        <p className="m-0 font-body text-[13px] font-semibold tracking-wide text-site-accent-dark/70">
          {label}
        </p>
      )}
    </div>
  );
}

/* ── Full-screen overlay loader (for API calls) ── */
export function OverlayLoader({ label = 'Please wait…', visible = true }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-5 bg-site-bg/85 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <RingSpinner ringClass="h-12 w-12" iconSize={20} />
      {label && (
        <p className="m-0 font-body text-[13px] font-semibold tracking-[0.04em] text-site-accent-dark/80">
          {label}
        </p>
      )}
    </div>
  );
}

/* ── Inline compact spinner (for buttons / inline use) ── */
export function InlineLoader({ size = 24 }) {
  return <Loader2 size={size} className="animate-spin text-site-accent-dark" aria-hidden />;
}

/* ── Skeleton grid for course cards ── */
import { CARD_FLEX_LIST, CARD_FLEX_ITEM } from './consultation/tokens';

export function CourseGridSkeleton({ count = 6 }) {
  return (
    <ul className={CARD_FLEX_LIST}>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className={`${CARD_FLEX_ITEM} animate-pulse overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm`}
        >
          <div className="aspect-[2/1] bg-site-accent-dark/10" />
          <div className="space-y-2 p-3">
            <div className="h-2 w-14 rounded bg-site-accent-dark/10" />
            <div className="h-4 w-4/5 rounded bg-site-accent-dark/10" />
            <div className="h-2.5 w-full rounded bg-site-accent-dark/8" />
            <div className="h-2.5 w-11/12 rounded bg-site-accent-dark/8" />
            <div className="flex items-center justify-between border-t border-site-accent-dark/10 pt-2.5">
              <div className="h-5 w-20 rounded bg-site-accent-dark/10" />
              <div className="h-7 w-20 rounded-full bg-site-accent-dark/10" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PageLoader;
