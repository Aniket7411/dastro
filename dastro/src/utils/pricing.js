import { formatINR } from './currency';

/**
 * Derives strikethrough-MRP display data from a raw price/mrp pair.
 * Save % is always computed on the fly — never trust a stored value, it can drift.
 */
export function getPriceDisplay({ price, mrp } = {}) {
  const numPrice = Number(price) || 0;
  const numMrp = Number(mrp) || 0;
  const hasDiscount = numMrp > numPrice && numPrice > 0;

  return {
    hasDiscount,
    priceLabel: formatINR(numPrice).replace(/^₹/, ''),
    mrpLabel: hasDiscount ? formatINR(numMrp).replace(/^₹/, '') : null,
    savePercent: hasDiscount ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0,
  };
}
