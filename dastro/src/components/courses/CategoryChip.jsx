export default function CategoryChip({ active, count, label, onClick }) {
  const base =
    'inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap !rounded-full border px-2.5 py-1.5 font-body text-[0.8125rem] font-semibold leading-none antialiased transition sm:px-3 sm:py-2 sm:text-xs';

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? `${base} border-site-primary bg-site-primary text-white shadow-sm`
          : `${base} border-site-accent-dark/12 bg-site-bg text-site-muted hover:border-site-accent/40 hover:bg-white hover:text-site-primary`
      }
    >
      {count != null && (
        <span
          className={
            active
              ? 'inline-flex min-w-[1rem] items-center justify-center rounded-full bg-white/20 px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums leading-none'
              : 'inline-flex min-w-[1rem] items-center justify-center rounded-full bg-site-accent-dark/10 px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums leading-none text-site-accent-dark'
          }
        >
          {count}
        </span>
      )}
      {label}
    </button>
  );
}
