import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import ShopFilters, { ShopCategoryChips } from '../components/ShopFilters';
import ShopProductCard from '../components/ShopProductCard';
import { openShopifyStore } from '../utils/shopify';
import { useSettings } from '../context/SettingsContext';
import { SHOP_CATEGORIES, FEATURED_PRODUCTS, filterShopProducts } from '../data/shopCatalog';

const WRAP = 'mx-auto w-full max-w-[var(--container-public)] px-[var(--page-pad-x)]';

const TRUST_ITEMS = [
  { icon: 'fa-certificate', title: '100% Certified', sub: 'Lab-Tested Authenticity' },
  { icon: 'fa-shuttle-van', title: 'Global Shipping', sub: 'Safe & Insured Delivery' },
  { icon: 'fa-lock', title: 'Secure Payment', sub: 'Encrypted Checkout' },
  { icon: 'fa-sync-alt', title: 'Easy Returns', sub: '7-Day Satisfaction Guarantee' },
];

const DEFAULT_FILTERS = {
  search: '',
  sort: 'featured',
  priceRange: 'all',
  minRating: 0,
  inStockOnly: false,
  category: 'all',
};

function AstroShop() {
  const { settings } = useSettings();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  const handleAddToCart = (product) => {
    const opened = openShopifyStore({
      path: product.shopifyHandle ? `products/${product.shopifyHandle}` : 'collections/all',
      storeUrl: settings?.shopifyStoreUrl,
      toast: toast.error,
      message: `Shopify URL is pending. Configure VITE_SHOPIFY_STORE_URL or admin Settings → Shopify Store URL.`,
    });
    if (opened) toast.success(`Opening ${product.name} on Shopify…`);
  };

  const handleBuyNow = (product) => {
    const opened = openShopifyStore({
      path: product.shopifyHandle ? `products/${product.shopifyHandle}` : 'collections/all',
      storeUrl: settings?.shopifyStoreUrl,
      toast: toast.error,
      message: `Shopify URL is pending. Configure VITE_SHOPIFY_STORE_URL or admin Settings → Shopify Store URL.`,
    });
    if (opened) toast.success(`Redirecting to Shopify checkout for ${product.name}…`);
  };

  const categoryFiltered = useMemo(() => {
    if (filters.category === 'all') return FEATURED_PRODUCTS;
    return FEATURED_PRODUCTS.filter((p) => p.category === filters.category);
  }, [filters.category]);

  const visibleProducts = useMemo(
    () =>
      filterShopProducts(categoryFiltered, {
        search: filters.search,
        sort: filters.sort,
        minRating: filters.minRating,
        priceRange: filters.priceRange,
        inStockOnly: filters.inStockOnly,
      }),
    [categoryFiltered, filters]
  );

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const patchFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="m-0 min-h-screen w-full overflow-x-clip bg-site-bg p-0 font-body text-site-text">
      <SEO
        title="Astro Shop"
        description="Authentic gemstones, rudraksha, yantras and spiritual remedies."
        url="/shop"
      />

      <div className="relative m-0 bg-[linear-gradient(rgba(42,15,2,0.82),rgba(42,15,2,0.82)),url('https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=1200')_center/cover] py-[clamp(3rem,7vw,5rem)] pb-[clamp(2.5rem,5vw,3.5rem)] text-center">
        <div className={WRAP}>
          <span className="mb-3 inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-site-accent">
            Authentic & Certified
          </span>
          <h1 className="m-0 mb-[0.65rem] p-0 font-heading text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.15] text-white">
            Divine <span className="text-site-accent">Astro Shop</span>
          </h1>
          <p className="mx-auto m-0 max-w-xl p-0 text-base leading-relaxed text-white/85">
            Your gateway to genuine spiritual remedies and celestial enhancements
          </p>
          <button
            type="button"
            onClick={() => openShopifyStore({ storeUrl: settings?.shopifyStoreUrl, toast: toast.error })}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white hover:text-site-primary"
          >
            <i className="fas fa-external-link-alt" aria-hidden="true" />
            Open Full Shopify Store
          </button>
        </div>
      </div>

      <div className="relative z-[2] -mt-10 m-0 p-0 md:-mt-12">
        <div className={WRAP}>
          <div className="m-0 grid grid-cols-1 gap-0 rounded-2xl border border-site-accent/12 bg-site-surface px-5 py-4 shadow-[0_10px_28px_rgba(42,15,2,0.08)] sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 border-b border-black/5 px-[0.85rem] py-[0.65rem] last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <i className={`fas ${item.icon} text-xl text-site-accent-dark`} aria-hidden="true" />
                <div>
                  <p className="m-0 p-0 text-sm font-bold text-site-primary">{item.title}</p>
                  <p className="m-0 p-0 text-xs text-site-soft">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="m-0 py-[clamp(2rem,4vw,2.5rem)] pb-[clamp(3rem,6vw,4rem)]">
        <div className={WRAP}>
          <div className="m-0 mb-5 p-0 text-left">
            <h2 className="m-0 mb-[0.35rem] p-0 font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-site-primary">
              Browse by <span className="text-site-accent">Category</span>
            </h2>
            <p className="m-0 p-0 text-[0.9375rem] text-site-muted">Find the perfect remedy for your planetary needs</p>
          </div>

          <div className="m-0 mb-8 grid grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.path}
                to={`/shop/${cat.path}`}
                className="group block h-[clamp(16rem,28vw,20rem)] w-full cursor-pointer overflow-hidden rounded-2xl border-none bg-transparent p-0 text-left text-white no-underline transition duration-300 hover:-translate-y-[5px]"
              >
                <div className="relative m-0 h-full w-full p-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                  />
                  <div
                    className="absolute inset-0 opacity-85"
                    style={{ background: `linear-gradient(to top, ${cat.accent}, transparent)` }}
                  />
                  <div className="absolute bottom-0 left-0 z-[2] w-full p-5">
                    <span className="mb-[0.65rem] inline-block rounded-full bg-white/20 px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold">
                      {cat.count}
                    </span>
                    <h3 className="m-0 mb-1 p-0 font-heading text-xl font-bold text-white">{cat.name}</h3>
                    <p className="m-0 mb-[0.65rem] p-0 text-sm text-white/90">{cat.desc}</p>
                    <p className="m-0 p-0 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-white">
                      Explore Collection <i className="fas fa-arrow-right" aria-hidden="true" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="m-0 pt-8">
            <div className="m-0 mb-5 p-0 text-center">
              <h2 className="m-0 mb-[0.35rem] p-0 font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-site-primary">
                Top <span className="text-site-accent">Recommendations</span>
              </h2>
              <div className="mx-auto mt-3 h-[3px] w-14 bg-site-accent" aria-hidden="true" />
            </div>

            <ShopCategoryChips
              categories={SHOP_CATEGORIES}
              active={filters.category}
              onChange={(category) => patchFilter('category', category)}
            />

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
                  <ShopProductCard
                    key={prod.id}
                    product={prod}
                    showTag
                    onBuy={handleBuyNow}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <p className="m-0 rounded-2xl border border-dashed border-site-accent-dark/20 bg-site-surface px-4 py-10 text-center text-site-muted">
                No products match your filters. Try adjusting search or reset filters.
              </p>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-5 rounded-2xl bg-[linear-gradient(135deg,#2a0f02,#5c2d12)] p-6 lg:grid-cols-[1fr_auto] lg:px-7">
            <div>
              <h3 className="m-0 mb-2 p-0 font-heading text-[1.375rem] font-bold text-white">
                Not Sure What You Need?
              </h3>
              <p className="m-0 p-0 text-[0.9375rem] leading-relaxed text-white/90">
                Our expert astrologers can recommend the perfect gemstone or remedy based on your unique birth chart
                analysis.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-site-accent px-6 py-3 text-[0.9375rem] font-bold text-white no-underline transition duration-200 hover:bg-white hover:text-site-primary"
            >
              Get Free Recommendation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AstroShop;
