/** Live status pill — dark chip with bright red glow + light-flow shimmer. */
export default function CourseLiveBadge({ className = '' }) {
  return (
    <span
      className={`course-live-badge absolute left-1.5 top-1.5 z-[2] inline-flex items-center gap-1 overflow-hidden rounded-full border border-[#ff1a1a] bg-[#0a0a0a]/95 px-1.5 py-0.5 shadow-[0_0_10px_rgba(255,26,26,0.7)] sm:left-2 sm:top-2 sm:gap-1.5 sm:px-2 sm:py-1 ${className}`}
      aria-label="Live course"
    >
      <span className="course-live-badge__dot relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-white/90 blur-[2px]" />
        <span className="relative block h-full w-full rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.95)]" />
      </span>
      <span className="font-body text-[8px] font-bold uppercase tracking-[0.12em] text-[#ff1a1a] sm:text-[10px] sm:tracking-[0.14em]">
        Live
      </span>
      <span className="course-live-badge__shine pointer-events-none absolute inset-0" aria-hidden />
    </span>
  );
}
