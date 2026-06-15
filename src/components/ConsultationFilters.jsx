import { useState } from 'react';
import { SlidersHorizontal, X, Tag, Clock, IndianRupee, ChevronDown } from 'lucide-react';
import { PAGE_WRAP, TYPE, BTN, CHIP, CHIP_ACTIVE, FILTER_BAR, SELECT, TAB, TAB_ACTIVE, TAB_COUNT, TAB_COUNT_ACTIVE } from './consultation/tokens';

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

function AdvancedFiltersSheet({
  open,
  onClose,
  filterMeta,
  selectedDurations,
  selectedBadges,
  priceMin,
  priceMax,
  onToggleDuration,
  onToggleBadge,
  onPriceMinChange,
  onPriceMaxChange,
  onClearAll,
  activeFilterCount,
}) {
  if (!open) return null;

  const pricePresets = filterMeta?.priceRange
    ? [
        { label: 'Under ₹3K', min: filterMeta.priceRange.min, max: 2999 },
        { label: '₹3K–₹5K', min: 3000, max: 5000 },
        { label: '₹5K–₹8K', min: 5000, max: 8000 },
        { label: '₹8K+', min: 8001, max: filterMeta.priceRange.max },
      ].filter((p) => p.max >= filterMeta.priceRange.min && p.min <= filterMeta.priceRange.max)
    : [];

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 m-0 border-0 bg-site-primary/60 p-0 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-site-surface shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-site-accent-dark/10 bg-site-bg/80 px-5 py-4">
          <h2 className={`${TYPE.h2} flex items-center gap-2 !text-base`}>
            <SlidersHorizontal size={16} className="text-site-accent-dark" />
            More Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-site-accent-dark px-2 py-0.5 text-[0.58rem] font-bold text-white">{activeFilterCount}</span>
            )}
          </h2>
          <button type="button" onClick={onClose} className="m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-site-accent-dark/12 bg-site-surface p-0 text-site-accent-dark">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {(filterMeta?.durations || []).length > 0 && (
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-site-accent-dark">
                <Clock size={11} className="text-site-accent" />
                Duration
              </p>
              <div className="flex flex-wrap gap-2">
                {filterMeta.durations.map((d) => (
                  <button key={d.value} type="button" onClick={() => onToggleDuration(d.value)} className={chipClass(selectedDurations.includes(d.value))}>
                    {d.label}
                    <span className="text-[0.58rem] font-bold opacity-70">{d.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(filterMeta?.badges || []).length > 0 && (
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-site-accent-dark">
                <Tag size={11} className="text-site-accent" />
                Session Type
              </p>
              <div className="flex flex-wrap gap-2">
                {filterMeta.badges.map((b) => (
                  <button key={b.value} type="button" onClick={() => onToggleBadge(b.value)} className={chipClass(selectedBadges.includes(b.value))}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-site-accent-dark">
              <IndianRupee size={11} className="text-site-accent" />
              Price Range
            </p>
            {pricePresets.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {pricePresets.map((preset) => {
                  const active = priceMin === preset.min && priceMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onPriceMinChange(preset.min);
                        onPriceMaxChange(preset.max);
                      }}
                      className={chipClass(active)}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="number"
                value={priceMin ?? ''}
                onChange={(e) => onPriceMinChange(e.target.value === '' ? null : Number(e.target.value))}
                placeholder={`${filterMeta?.priceRange?.min ?? 0}`}
                className="m-0 w-full rounded-xl border border-site-accent-dark/15 bg-site-bg px-3 py-2.5 font-body text-sm text-site-primary outline-none focus:border-site-accent focus:ring-2 focus:ring-site-accent/15"
              />
              <input
                type="number"
                value={priceMax ?? ''}
                onChange={(e) => onPriceMaxChange(e.target.value === '' ? null : Number(e.target.value))}
                placeholder={`${filterMeta?.priceRange?.max ?? ''}`}
                className="m-0 w-full rounded-xl border border-site-accent-dark/15 bg-site-bg px-3 py-2.5 font-body text-sm text-site-primary outline-none focus:border-site-accent focus:ring-2 focus:ring-site-accent/15"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-site-accent-dark/10 bg-site-bg/60 px-4 py-3.5">
          <div className="flex gap-3">
            {activeFilterCount > 0 && (
              <button type="button" onClick={() => { onClearAll(); onClose(); }} className={`${CHIP} flex-1`}>
                Reset
              </button>
            )}
            <button type="button" onClick={onClose} className={`${BTN.primary} flex-[2]`}>
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsCount({ total, loading, hasActiveFilters }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 font-body text-[0.8125rem] font-medium leading-none text-site-muted antialiased">
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-site-accent-dark/20 border-t-site-accent-dark" />
        Loading…
      </span>
    );
  }

  const label = total === 1 ? 'consultation' : 'consultations';

  return (
    <span className="font-body text-[0.8125rem] font-medium leading-none text-site-muted antialiased">
      <strong className="font-bold tabular-nums text-site-primary">{total}</strong>
      {' '}
      {hasActiveFilters ? `${label} matched` : `${label} available`}
    </span>
  );
}

export function ConsultationFilterBar({
  filterMeta,
  selectedCategories,
  selectedDurations,
  selectedBadges,
  priceMin,
  priceMax,
  onToggleCategory,
  onClearCategories,
  onToggleDuration,
  onToggleBadge,
  onPriceMinChange,
  onPriceMaxChange,
  onClearAll,
  sortValue,
  onSortChange,
  sortOptions = SORT_OPTIONS_DEFAULT,
  total = 0,
  loading = false,
  hasActiveFilters = false,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const advancedCount =
    selectedDurations.length +
    selectedBadges.length +
    (priceMin != null ? 1 : 0) +
    (priceMax != null ? 1 : 0);

  const allCategoriesActive = selectedCategories.length === 0;

  return (
    <>
      <div className={FILTER_BAR}>
        <div className={PAGE_WRAP}>
          <div className="flex flex-col gap-2.5 py-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between lg:py-3">
            <div className={`flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap sm:gap-2 sm:overflow-x-auto ${SCROLL_HIDE}`}>
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
                  <div key={i} className={`${w} h-8 shrink-0 animate-pulse rounded-full bg-site-accent-dark/10`} />
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-end sm:gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2.5">
                <button type="button" onClick={() => setSheetOpen(true)} className={chipClass(advancedCount > 0)}>
                  <SlidersHorizontal size={12} aria-hidden />
                  Filters
                  {advancedCount > 0 && (
                    <span className="rounded bg-white/25 px-1 py-0.5 text-[0.5rem] font-bold leading-none">{advancedCount}</span>
                  )}
                </button>
                <ResultsCount total={total} loading={loading} hasActiveFilters={hasActiveFilters} />
              </div>

              <div className="relative flex shrink-0 items-center gap-1.5">
                <span className="hidden text-[0.625rem] font-bold uppercase tracking-wider text-site-accent-dark/55 lg:block">Sort</span>
                <div className="relative">
                  <select value={sortValue} onChange={(e) => onSortChange(e.target.value)} className={SELECT}>
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={11} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-site-accent-dark/50" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdvancedFiltersSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filterMeta={filterMeta}
        selectedDurations={selectedDurations}
        selectedBadges={selectedBadges}
        priceMin={priceMin}
        priceMax={priceMax}
        onToggleDuration={onToggleDuration}
        onToggleBadge={onToggleBadge}
        onPriceMinChange={onPriceMinChange}
        onPriceMaxChange={onPriceMaxChange}
        onClearAll={onClearAll}
        activeFilterCount={advancedCount}
      />
    </>
  );
}

export function ConsultationFilterSidebar() {
  return null;
}
export function ConsultationFilterMobile() {
  return null;
}

export function ConsultationResultsBar({ total, loading, hasActiveFilters }) {
  return <ResultsCount total={total} loading={loading} hasActiveFilters={hasActiveFilters} />;
}

export default ConsultationFilterBar;
