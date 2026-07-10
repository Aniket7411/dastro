import { Link } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const PRICE_OPTIONS = [
  { value: 'all', label: 'All Prices' },
  { value: 'under1k', label: 'Under ₹1,000' },
  { value: '1k-5k', label: '₹1,000 – ₹5,000' },
  { value: '5k+', label: 'Above ₹5,000' },
];

const SELECT_CLASS =
  'm-0 w-full cursor-pointer rounded-lg border border-site-accent-dark/18 bg-site-surface px-[0.65rem] py-[0.55rem] text-sm text-site-text';

export default function ShopFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  inStockOnly,
  onInStockOnlyChange,
  resultCount,
  onReset,
  compact = false,
}) {
  return (
    <div
      className={`m-0 mb-6 rounded-2xl border border-site-accent-dark/12 bg-site-surface p-[1rem_1.15rem] shadow-[0_6px_18px_rgba(42,15,2,0.05)] ${compact ? '' : ''}`}
    >
      <div className="m-0 mb-4 flex flex-col gap-3 p-0 md:flex-row md:items-center md:justify-between">
        <div className="relative m-0 max-w-full flex-1 p-0 md:max-w-md">
          <i
            className="fas fa-search pointer-events-none absolute left-[0.85rem] top-1/2 -translate-y-1/2 text-[0.9rem] text-site-accent-dark"
            aria-hidden="true"
          />
          <input
            type="text"
            className="m-0 box-border w-full rounded-lg border border-site-accent-dark/18 bg-[#fffbf5] py-[0.65rem] pl-[2.35rem] pr-9 text-[0.9375rem] text-site-text outline-none focus:border-site-accent focus:shadow-[0_0_0_3px_rgba(200,131,42,0.12)]"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {search ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 m-0 -translate-y-1/2 cursor-pointer border-none bg-transparent px-[0.45rem] py-1 text-site-soft"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <div className="m-0 flex shrink-0 items-center gap-3 p-0">
          <span className="text-[0.8125rem] font-semibold text-site-muted">
            {resultCount} item{resultCount !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            className="m-0 cursor-pointer rounded-md border border-site-accent-dark/20 bg-transparent px-[0.65rem] py-[0.35rem] text-xs font-semibold text-site-accent-dark"
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      </div>

      <div className="m-0 grid grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="m-0 flex flex-col gap-[0.3rem] p-0">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-site-accent-dark">Sort</span>
          <select className={SELECT_CLASS} value={sort} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="m-0 flex flex-col gap-[0.3rem] p-0">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-site-accent-dark">Price</span>
          <select className={SELECT_CLASS} value={priceRange} onChange={(e) => onPriceRangeChange(e.target.value)}>
            {PRICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="m-0 flex flex-col gap-[0.3rem] p-0">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.06em] text-site-accent-dark">Rating</span>
          <select className={SELECT_CLASS} value={minRating} onChange={(e) => onMinRatingChange(Number(e.target.value))}>
            <option value={0}>All ratings</option>
            <option value={4}>4★ & above</option>
            <option value={5}>5★ only</option>
          </select>
        </label>

        <label className="m-0 flex cursor-pointer items-center gap-2 px-0 py-[0.55rem] text-sm font-semibold text-site-text">
          <input
            type="checkbox"
            className="m-0 h-4 w-4"
            checked={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
          />
          <span>In stock only</span>
        </label>
      </div>
    </div>
  );
}

export function ShopCategoryChips({ categories, active, onChange }) {
  return (
    <div className="m-0 mb-4 flex flex-wrap gap-2 p-0" role="tablist" aria-label="Filter by category">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'all'}
        className={`m-0 cursor-pointer rounded-full border px-[0.85rem] py-[0.4rem] text-[0.8125rem] font-semibold transition duration-200 ${
          active === 'all'
            ? 'border-site-primary bg-site-primary text-white'
            : 'border-site-accent-dark/18 bg-site-surface text-site-muted'
        }`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.path}
          type="button"
          role="tab"
          aria-selected={active === cat.path}
          className={`m-0 cursor-pointer rounded-full border px-[0.85rem] py-[0.4rem] text-[0.8125rem] font-semibold transition duration-200 ${
            active === cat.path
              ? 'border-site-primary bg-site-primary text-white'
              : 'border-site-accent-dark/18 bg-site-surface text-site-muted'
          }`}
          onClick={() => onChange(cat.path)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export function ShopBreadcrumb({ items }) {
  return (
    <nav className="m-0 mb-4 flex flex-wrap items-center gap-[0.35rem] p-0 text-[0.8125rem]" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 ? (
            <span className="mx-[0.15rem] text-site-soft" aria-hidden="true">
              /
            </span>
          ) : null}
          {item.to ? (
            <Link to={item.to} className="font-semibold text-site-accent-dark no-underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
