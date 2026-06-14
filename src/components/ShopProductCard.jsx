import toast from '@/utils/toast';
import { openShopifyStore } from '../utils/shopify';

export default function ShopProductCard({ product, onBuy, onAddToCart, showTag = false }) {
  const inStock = product.inStock !== false;

  return (
    <article className="group m-0 overflow-hidden rounded-2xl border border-site-accent/10 bg-site-surface p-0 transition duration-250 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(139,74,30,0.1)]">
      <div className="relative m-0 h-[13.5rem] overflow-hidden p-0">
        <img
          src={product.image}
          alt={product.name}
          className="block h-full w-full object-cover"
          loading="lazy"
        />
        {showTag && product.tag ? (
          <span className="absolute left-3 top-3 m-0 rounded-full bg-site-primary px-3 py-[0.35rem] text-[0.65rem] font-bold uppercase text-white">
            {product.tag}
          </span>
        ) : null}
        {!inStock ? (
          <span className="absolute right-3 top-3 m-0 rounded-md bg-site-primary/75 px-[0.6rem] py-[0.3rem] text-[0.65rem] font-bold text-white">
            Out of Stock
          </span>
        ) : null}
        <div className="absolute right-[-3rem] top-3 flex flex-col gap-2 transition-[right] duration-250 group-hover:right-3">
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-site-surface p-0 text-site-primary shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition hover:bg-site-accent-dark hover:text-white"
            onClick={() => toast.success('Added to wishlist!')}
            aria-label="Add to wishlist"
          >
            <i className="far fa-heart" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-site-surface p-0 text-site-primary shadow-[0_4px_10px_rgba(0,0,0,0.12)] transition hover:bg-site-accent-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onAddToCart?.(product)}
            aria-label="Add to cart"
            disabled={!inStock}
          >
            <i className="fas fa-shopping-cart" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="m-0 p-4">
        <div className="m-0 mb-2 p-0 text-[0.8rem]" aria-label={`${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fas fa-star ${i < product.rating ? 'text-amber-500' : 'text-gray-200'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <h3 className="m-0 mb-3 min-h-[2.75rem] p-0 font-heading text-base font-semibold leading-[1.35] text-site-primary">
          {product.name}
        </h3>
        <div className="m-0 flex items-center justify-between gap-[0.65rem] p-0">
          <span className="m-0 p-0 font-price text-[1.05rem] font-bold tabular-nums tracking-tight text-site-accent-dark">{product.price}</span>
          <button
            type="button"
            className="m-0 cursor-pointer whitespace-nowrap rounded-lg border-[1.5px] border-site-primary bg-transparent px-3 py-[0.45rem] text-xs font-bold text-site-primary transition hover:bg-site-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
            onClick={() => onBuy(product)}
            disabled={!inStock}
          >
            {inStock ? 'Open in Shopify' : 'Notify Me'}
          </button>
        </div>
      </div>
    </article>
  );
}
