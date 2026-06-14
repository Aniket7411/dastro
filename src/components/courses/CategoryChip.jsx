export default function CategoryChip({ active, count, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-primary bg-site-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm sm:px-3 sm:py-1.5 sm:text-xs'
          : 'inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-site-accent-dark/12 bg-site-bg px-2.5 py-1 text-[11px] font-semibold text-site-muted transition hover:border-site-accent/40 hover:bg-white hover:text-site-primary sm:px-3 sm:py-1.5 sm:text-xs'
      }
    >
      {count != null && (
        <span
          className={
            active
              ? 'inline-flex min-w-4 items-center justify-center rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none'
              : 'inline-flex min-w-4 items-center justify-center rounded-full bg-site-accent-dark/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none text-site-accent-dark'
          }
        >
          {count}
        </span>
      )}
      {label}
    </button>
  );
}
