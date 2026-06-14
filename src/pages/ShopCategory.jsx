import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import ShopFilters, { ShopBreadcrumb } from '../components/ShopFilters';
import { openShopifyStore } from '../utils/shopify';
import { useSettings } from '../context/SettingsContext';
import { SHOP_CATALOG, filterShopProducts } from '../data/shopCatalog';

const WRAP = 'mx-auto w-full max-w-[var(--container-public)] px-[var(--page-pad-x)]';

const DEFAULT_FILTERS = {
  search: '',
  sort: 'featured',
  priceRange: 'all',
  minRating: 0,
  inStockOnly: false,
};

function ShopCategory() {
  const { category } = useParams();
  const { settings } = useSettings();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const categoryData = SHOP_CATALOG[category] || SHOP_CATALOG.gemstones;

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    window.scrollTo(0, 0);
  }, [category]);

  const visibleProducts = useMemo(
    () => filterShopProducts(categoryData.products, filters),
    [categoryData.products, filters]
  );

  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const patchFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const openStore = (product, mode) => {
    openShopifyStore({
      path: `collections/${category || 'all'}`,
      storeUrl: settings?.shopifyStoreUrl,
      toast: toast.error,
      message: `Shopify URL is pending. ${product.name} ${mode} will open from Shopify.`,
    });
  };

  return (
    <div className="m-0 min-h-screen w-full overflow-x-clip bg-site-bg p-0 font-body text-site-text">
      <SEO
        title={categoryData.title}
        description={categoryData.desc}
        url={`/shop/${category || 'gemstones'}`}
      />

      <div
        className="relative m-0 py-[clamp(2.5rem,6vw,4rem)] text-center"
        style={{
          background: `linear-gradient(rgba(42, 15, 2, 0.75), rgba(42, 15, 2, 0.75)), url(${categoryData.banner}) center/cover`,
        }}
      >
        <div className={WRAP}>
          <h1 className="m-0 mb-[0.65rem] p-0 font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.15] text-white">
            {categoryData.title}
          </h1>
          <p className="mx-auto m-0 max-w-xl p-0 text-base leading-relaxed text-white/85">{categoryData.desc}</p>
        </div>
      </div>

      <div className="m-0 py-[clamp(2rem,4vw,2.5rem)] pb-[clamp(3rem,6vw,4rem)]">
        <div className={WRAP}>
          <ShopBreadcrumb
            items={[
              { label: 'Shop', to: '/shop' },
              { label: categoryData.title },
            ]}
          />

          <div className="m-0 mb-5 p-0 text-left">
            <h2 className="m-0 mb-[0.35rem] p-0 font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-site-primary">
              Explore Products
            </h2>
            <p className="m-0 p-0 text-[0.9375rem] text-site-muted">Filter by price, rating, and availability</p>
          </div>

          <ShopFilters
            search={filters.search}
            onSearchChange={(v) => patchFilter('search', v)}
            sort={filters.sort}
            onSortChange={(v) => patchFilter('sort', v)}
            priceRange={filters.priceRange}
            onPriceRangeChange={(v) => patchFilter('priceRange', v)}
            minRating={filters.minRating}
            onMinRatingChange={(v) => patchFilter('minRating', v)}
            inStockOnly={filters.inStockOnly}
            onInStockOnlyChange={(v) => patchFilter('inStockOnly', v)}
            resultCount={visibleProducts.length}
            onReset={resetFilters}
          />

          {visibleProducts.length > 0 ? (
            <div className="m-0 grid grid-cols-1 gap-5 p-0 min-[540px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((prod) => (
                <article
                  key={prod.id}
                  className="m-0 overflow-hidden rounded-2xl border border-site-accent/10 bg-site-surface p-0 transition duration-250 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(139,74,30,0.1)]"
                >
                  <div className="relative m-0 h-[13.5rem] overflow-hidden p-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="block h-full w-full object-cover"
                      loading="lazy"
                    />
                    {prod.inStock === false ? (
                      <span className="absolute right-3 top-3 m-0 rounded-md bg-site-primary/75 px-[0.6rem] py-[0.3rem] text-[0.65rem] font-bold text-white">
                        Out of Stock
                      </span>
                    ) : null}
                  </div>
                  <div className="m-0 p-4">
                    <div className="m-0 mb-2 p-0 text-[0.8rem]" aria-label={`${prod.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < prod.rating ? 'text-amber-500' : 'text-gray-200'}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <h3 className="m-0 mb-3 min-h-[2.75rem] p-0 font-heading text-base font-semibold leading-[1.35] text-site-primary">
                      {prod.name}
                    </h3>
                    <div className="m-0 flex items-center justify-between gap-[0.65rem] p-0">
                      <span className="m-0 p-0 text-[1.05rem] font-extrabold text-site-accent-dark">{prod.price}</span>
                      <span
                        className={`text-xs font-bold ${prod.inStock === false ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {prod.inStock === false ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="m-0 flex-1 cursor-pointer rounded-lg border border-site-primary bg-[#f8f9fa] px-3 py-[0.65rem] text-xs font-bold text-site-primary disabled:cursor-not-allowed disabled:opacity-55"
                        onClick={() => openStore(prod, 'cart')}
                        disabled={prod.inStock === false}
                      >
                        Shopify Cart
                      </button>
                      <button
                        type="button"
                        className="m-0 flex-1 cursor-pointer rounded-lg border-none bg-site-primary px-3 py-[0.65rem] text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"
                        onClick={() => openStore(prod, 'checkout')}
                        disabled={prod.inStock === false}
                      >
                        Open Store
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="m-0 rounded-2xl border border-dashed border-site-accent-dark/20 bg-site-surface px-4 py-10 text-center text-site-muted">
              No products match your filters. Try adjusting search or reset filters.
            </p>
          )}

          <p className="mt-8 rounded-xl border border-site-accent-dark/12 bg-site-surface px-5 py-4 text-center text-sm text-site-muted">
            All products are certified for authenticity and purity. <b className="text-site-primary">Free shipping</b>{' '}
            on orders above ₹2000.
          </p>

          <div className="mt-10 grid grid-cols-1 items-center gap-5 rounded-2xl bg-[linear-gradient(135deg,#2a0f02,#5c2d12)] p-6 lg:grid-cols-[1fr_auto] lg:px-7">
            <div>
              <h3 className="m-0 mb-2 p-0 font-heading text-[1.375rem] font-bold text-white">Browse More Categories</h3>
              <p className="m-0 p-0 text-[0.9375rem] leading-relaxed text-white/90">
                Explore gemstones, rudraksha, yantras, and puja essentials in our full shop.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-site-accent px-6 py-3 text-[0.9375rem] font-bold text-white no-underline transition duration-200 hover:bg-white hover:text-site-primary"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCategory;
