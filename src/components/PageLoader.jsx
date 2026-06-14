import { useEffect } from 'react';

/* Spin keyframe injected once */
const SPIN_STYLE = `
@keyframes ds-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.ds-loader-spin {
  animation: ds-spin 1s linear infinite;
  display: block;
}
`;

function injectStyle() {
  if (document.getElementById('ds-loader-style')) return;
  const el = document.createElement('style');
  el.id = 'ds-loader-style';
  el.textContent = SPIN_STYLE;
  document.head.appendChild(el);
}

/* ── Spinner image ── */
function SpinnerImg({ size = 72 }) {
  return (
    <img
      src="/loader.png"
      alt=""
      aria-hidden="true"
      className="ds-loader-spin"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

/* ── Full page / section loader ── */
export function PageLoader({ label = 'Loading…', compact = false }) {
  useEffect(() => { injectStyle(); }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 bg-[#FDF6EE] ${
        compact ? 'py-16' : 'min-h-[60vh]'
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <SpinnerImg size={140} />
      {label && (
        <p className="m-0 text-sm font-semibold tracking-wide text-[#8B4A1E]/75">{label}</p>
      )}
    </div>
  );
}

/* ── Full-screen overlay loader (for API calls) ── */
export function OverlayLoader({ label = 'Please wait…', visible = true }) {
  useEffect(() => { injectStyle(); }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: 'rgba(253,246,238,0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <SpinnerImg size={80} />
      {label && (
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: 'rgba(139,74,30,0.8)',
        }}>
          {label}
        </p>
      )}
    </div>
  );
}

/* ── Inline compact spinner (for buttons / inline use) ── */
export function InlineLoader({ size = 28 }) {
  useEffect(() => { injectStyle(); }, []);
  return <SpinnerImg size={size} />;
}

/* ── Skeleton grid for course cards ── */
export function CourseGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-[#8B4A1E]/10 bg-white"
        >
          <div className="h-40 bg-[#8B4A1E]/10" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-[#8B4A1E]/10" />
            <div className="h-3 w-full rounded bg-[#8B4A1E]/8" />
            <div className="h-3 w-5/6 rounded bg-[#8B4A1E]/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageLoader;
