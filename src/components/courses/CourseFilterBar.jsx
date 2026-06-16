import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import CategoryChip from './CategoryChip';
import { FILTER_BAR, PAGE_WRAP } from '../consultation/tokens';

const SCROLL_HIDE = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

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
  const [catOpen, setCatOpen] = useState(false);
  const hasActiveCategory = selectedCategory && selectedCategory !== 'All';

  return (
    <section aria-label="Search and filters" className={FILTER_BAR}>
      <div className={PAGE_WRAP}>
        <div className="rounded-2xl border border-site-accent-dark/10 bg-white px-2.5 py-2 shadow-sm sm:px-4 sm:py-3">

          {/* ── Top row: count (left) | search + toggle (right) ── */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">

            {/* Results count */}
            <p className="shrink-0 whitespace-nowrap font-body text-[0.6875rem] font-medium leading-none text-site-muted antialiased sm:text-xs">
              {loading ? 'Loading…' : (
                <>
                  <span className="md:hidden">
                    Results{' '}
                    <strong className="font-bold tabular-nums text-site-primary">{resultCount}</strong>
                  </span>
                  <span className="hidden md:inline">
                    <strong className="font-bold tabular-nums text-site-primary">{resultCount}</strong>
                    {' '}{resultLabel}
                  </span>
                </>
              )}
            </p>

            {/* Search + category toggle grouped right */}
            <div className="flex items-center gap-2">
              <div className="relative w-36 sm:w-44 md:w-52 lg:w-60">
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
                  className="h-8 w-full !rounded-full border border-site-accent-dark/15 bg-site-bg pl-8 pr-3 font-body text-[0.6875rem] font-medium leading-none text-site-primary antialiased outline-none transition placeholder:text-[0.6875rem] placeholder:font-normal placeholder:text-site-soft focus:border-site-accent focus:ring-2 focus:ring-site-accent/15 sm:h-9 sm:pl-10 sm:text-xs sm:placeholder:text-xs"
                />
              </div>

              {/* Category toggle — mobile only */}
              {categoryFilters.length > 1 && (
                <button
                  type="button"
                  onClick={() => setCatOpen(v => !v)}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 font-body text-[0.6875rem] font-bold leading-none transition sm:hidden ${
                    hasActiveCategory
                      ? 'border-site-accent-dark bg-site-accent-dark text-white'
                      : 'border-site-accent-dark/15 bg-site-bg text-site-accent-dark'
                  }`}
                >
                  {catOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  Category
                  {hasActiveCategory && (
                    <span className="ml-0.5 rounded bg-white/25 px-1 py-0.5 text-[0.5rem] font-bold leading-none">1</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── Category chips — always on sm+, toggle on mobile ── */}
          {categoryFilters.length > 1 && (
            <div className={`${catOpen ? 'flex' : 'hidden'} sm:flex mt-2 w-full flex-wrap items-center gap-1 sm:min-w-0 sm:flex-nowrap sm:justify-end sm:gap-2 sm:overflow-x-auto ${SCROLL_HIDE}`}>
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
    </section>
  );
}
