import { Search } from 'lucide-react';
import CategoryChip from './CategoryChip';
import { FILTER_BAR, PAGE_WRAP } from '../consultation/tokens';

export default function CourseFilterBar({
  loading,
  resultCount,
  resultLabel,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  categoryFilters,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <section aria-label="Search and filters" className={FILTER_BAR}>
      <div className={PAGE_WRAP}>
        <div className="rounded-2xl border border-site-accent-dark/10 bg-white px-2.5 py-2 shadow-sm sm:px-4 sm:py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:shrink-0 sm:gap-3">
              <p className="shrink-0 whitespace-nowrap font-body text-[0.6875rem] font-medium leading-none text-site-muted antialiased sm:text-xs">
                {loading ? (
                  'Loading…'
                ) : (
                  <>
                    <span className="font-bold tabular-nums text-site-primary">{resultCount}</span>
                    {' '}
                    {resultLabel}
                  </>
                )}
              </p>

              <div className="relative min-w-0 flex-1 sm:w-44 sm:flex-none md:w-52 lg:w-60">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-accent-dark/50 sm:left-3.5"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8 w-full !rounded-full border border-site-accent-dark/15 bg-site-bg pl-8 pr-3 font-body text-[0.6875rem] font-medium leading-none text-site-primary antialiased outline-none transition placeholder:text-[0.6875rem] placeholder:font-normal placeholder:text-site-soft focus:border-site-accent focus:ring-2 focus:ring-site-accent/15 sm:h-9 sm:pl-10 sm:text-sm sm:placeholder:text-xs"
                />
              </div>
            </div>

            {categoryFilters.length > 1 && (
              <div className="flex w-full flex-wrap items-center gap-1 sm:min-w-0 sm:flex-1 sm:flex-nowrap sm:justify-end sm:gap-2 sm:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categoryFilters.map(({ label, count }) => (
                  <CategoryChip
                    key={label}
                    label={label}
                    count={count}
                    active={selectedCategory === label}
                    onClick={() => onSelectCategory(label)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
