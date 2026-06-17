/** Indian Rupee formatting — always uses ₹, never USD/$ */
export function formatINR(amount, { decimals = 0, fallback = '—' } = {}) {
  if (amount == null || amount === '') return fallback;
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `₹${formatted}`;
}

/** Alias for labels that prefer "Rs." prefix */
export function formatRs(amount, options = {}) {
  const value = formatINR(amount, { ...options, fallback: '' });
  if (!value) return options.fallback ?? '—';
  return value.replace(/^₹/, 'Rs. ');
}
