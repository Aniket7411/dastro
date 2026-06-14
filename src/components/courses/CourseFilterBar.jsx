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
    <section aria-label="Search and filters" className={`${FILTER_BAR} -mt-px`}>
      <div className={PAGE_WRAP}>
        <div className="rounded-2xl border border-site-accent-dark/10 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
          <div className="flex flex-row items-center gap-2.5 sm:gap-3">
            <p className="shrink-0 whitespace-nowrap text-[11px] font-medium text-site-muted sm:text-xs">
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

            <div className="relative w-36 shrink-0 sm:w-44 md:w-52 lg:w-60">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-accent-dark/50"
                aria-hidden
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-full border border-site-accent-dark/15 bg-site-bg pl-8 pr-3 text-xs text-site-primary outline-none transition placeholder:text-site-soft focus:border-site-accent focus:ring-2 focus:ring-site-accent/15 sm:h-9 sm:pl-9 sm:text-sm"
              />
            </div>

            {categoryFilters.length > 1 && (
              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 overflow-x-auto sm:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
