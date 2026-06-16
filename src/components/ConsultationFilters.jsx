import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PAGE_WRAP, CHIP, CHIP_ACTIVE, FILTER_BAR, SELECT, TAB, TAB_ACTIVE, TAB_COUNT, TAB_COUNT_ACTIVE } from './consultation/tokens';

const SCROLL_HIDE = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const SORT_OPTIONS_DEFAULT = [
  { value: 'sortOrder:asc', label: 'Recommended' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'title:asc', label: 'Name: A–Z' },
];

function chipClass(active) {
  return active ? CHIP_ACTIVE : CHIP;
}

function tabClass(active) {
  return active ? TAB_ACTIVE : TAB;
}

function ResultsCount({ total, loading, hasActiveFilters }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium leading-none text-site-muted antialiased">
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-site-accent-dark/20 border-t-site-accent-dark" />
        Loading…
      </span>
    );
  }

  const label = total === 1 ? 'consultation' : 'consultations';
  const suffix = hasActiveFilters ? 'matched' : 'available';

  return (
    <span className="whitespace-nowrap font-body text-xs font-medium leading-none text-site-muted antialiased md:text-sm">
      <span className="md:hidden">
        Results <strong className="font-bold tabular-nums text-site-primary">{total}</strong>
      </span>
      <span className="hidden md:inline">
        <strong className="font-bold tabular-nums text-site-primary">{total}</strong>
        {' '}{label} {suffix}
      </span>
    </span>
  );
}

export function ConsultationFilterBar({
  filterMeta,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  onClearAll,
  sortValue,
  onSortChange,
  sortOptions = SORT_OPTIONS_DEFAULT,
  total = 0,
  loading = false,
  hasActiveFilters = false,
}) {
  const [catOpen, setCatOpen] = useState(false);
  const allCategoriesActive = selectedCategories.length === 0;

  return (
    <div className={FILTER_BAR}>
      <div className={PAGE_WRAP}>
        <div className="py-2 lg:py-3">

          {/* ── Top row: Categories toggle + Results | Sort ── */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 sm:gap-x-3">

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Categories toggle — mobile only */}
              <button
                type="button"
                onClick={() => setCatOpen(v => !v)}
                className={`inline-flex items-center gap-1 lg:hidden ${chipClass(selectedCategories.length > 0)}`}
              >
                {catOpen ? <ChevronUp size={9} aria-hidden /> : <ChevronDown size={9} aria-hidden />}
                Categories
                {selectedCategories.length > 0 && (
                  <span className="rounded bg-white/25 px-1 py-0.5 text-[0.5rem] font-bold leading-none">{selectedCategories.length}</span>
                )}
              </button>

              <ResultsCount total={total} loading={loading} hasActiveFilters={hasActiveFilters} />
            </div>

            {/* Sort dropdown */}
            <div className="relative flex shrink-0 items-center gap-1.5">
              <span className="hidden text-[0.625rem] font-bold uppercase tracking-wider text-site-accent-dark/55 lg:block">Sort</span>
              <div className="relative">
                <select value={sortValue} onChange={(e) => onSortChange(e.target.value)} className={SELECT}>
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-site-accent-dark/50 sm:right-2.5 sm:size-[11px]" aria-hidden />
              </div>
            </div>
          </div>

          {/* ── Category tabs — always visible on lg+, toggle on mobile ── */}
          <div className={`${catOpen ? 'flex' : 'hidden'} lg:flex mt-2 flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto ${SCROLL_HIDE}`}>
            <button type="button" onClick={onClearCategories} className={tabClass(allCategoriesActive)}>
              {!loading && total > 0 && (
                <span className={allCategoriesActive ? TAB_COUNT_ACTIVE : TAB_COUNT}>{total}</span>
              )}
              All
            </button>
            {(filterMeta?.categories || []).map((cat) => {
              const active = selectedCategories.includes(cat.id);
              return (
                <button key={cat.id} type="button" onClick={() => onToggleCategory(cat.id)} className={tabClass(active)}>
                  <span className={active ? TAB_COUNT_ACTIVE : TAB_COUNT}>{cat.count}</span>
                  {cat.name}
                </button>
              );
            })}
            {!filterMeta?.categories?.length &&
              ['w-12', 'w-24', 'w-20', 'w-28', 'w-16'].map((w, i) => (
                <div key={i} className={`${w} h-6 shrink-0 animate-pulse rounded-full bg-site-accent-dark/10`} />
              ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export function ConsultationFilterSidebar() { return null; }
export function ConsultationFilterMobile() { return null; }

export function ConsultationResultsBar({ total, loading, hasActiveFilters }) {
  return <ResultsCount total={total} loading={loading} hasActiveFilters={hasActiveFilters} />;
}

export default ConsultationFilterBar;
