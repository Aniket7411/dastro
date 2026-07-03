import { TYPE } from './consultation/tokens';
import { getPriceDisplay } from '../utils/pricing';

/** Renders "₹offer  ~~₹mrp~~  Save X%" — falls back to a bare price when no valid MRP is set. */
export default function PriceBlock({ price, mrp, size = 'card', prefix }) {
  const { hasDiscount, priceLabel, mrpLabel, savePercent } = getPriceDisplay({ price, mrp });
  const priceClass = size === 'detail' ? TYPE.price : TYPE.priceCard;

  return (
    <div className="leading-none">
      {prefix ? (
        <p className="mb-0.5 font-body text-[10px] font-medium tracking-wide text-site-soft">{prefix}</p>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <p className={priceClass}>₹{priceLabel}</p>
        {hasDiscount ? (
          <>
            <span className="font-body text-xs text-site-soft line-through decoration-site-soft/60">
              ₹{mrpLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-1.5 py-0.5 font-body text-[10px] font-bold leading-none text-emerald-700">
              Save {savePercent}%
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
