export const calculateCouponDiscount = (coupon, purchaseAmount) => {
  const originalAmount = Number(purchaseAmount) || 0;
  let discountAmount = 0;

  if (coupon.discountType === 'fixed') {
    discountAmount = Number(coupon.discountValue);
  } else {
    discountAmount = Math.round((originalAmount * Number(coupon.discountValue)) / 100);
  }

  discountAmount = Math.max(0, Math.min(discountAmount, originalAmount));
  const finalAmount = Math.max(originalAmount - discountAmount, 1);

  return { discountAmount, finalAmount };
};
