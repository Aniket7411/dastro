import { Loader2, Stars } from 'lucide-react';
import { createPortal } from 'react-dom';
import { MODAL_LOADER_Z } from './modal/ModalLayer';

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

  return createPortal(
    <div
      className={`fixed inset-0 ${MODAL_LOADER_Z} flex flex-col items-center justify-center gap-5 bg-site-bg/85 backdrop-blur-md`}
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
    </div>,
    document.body
  );
}

/* ── Inline compact spinner (for buttons / inline use) ── */
export function InlineLoader({ size = 24 }) {
  return <Loader2 size={size} className="animate-spin text-site-accent-dark" aria-hidden />;
}

export function CourseGridSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-site-accent/30 border-t-site-accent-dark animate-spin" />
      <p className="m-0 font-body text-[13px] font-semibold text-site-accent-dark/60">Loading…</p>
    </div>
  );
}

export default PageLoader;
