import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';
import { calculateCouponDiscount } from '../utils/couponHelper.js';

// @desc    List active coupons applicable to a course (public teaser for checkout UI)
// @route   GET /api/coupons/available/:courseId
// @access  Public
export const getAvailableCouponsForCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const coupons = await Coupon.find({
    active: true,
    $or: [{ courseId: null }, { courseId: { $exists: false } }, { courseId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const applicable = coupons.filter((coupon) => {
    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return false;
    if (coupon.courseId && String(coupon.courseId) !== String(courseId)) return false;
    return true;
  });

  res.json({
    success: true,
    count: applicable.length,
    coupons: applicable.map((coupon) => ({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || 0,
      courseSpecific: Boolean(coupon.courseId),
    })),
  });
});

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, purchaseAmount } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Coupon code is required');
  }

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon || !coupon.active) {
    return res.status(200).json({
      success: false,
      message: 'Coupon code is invalid or expired',
    });
  }

  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
    return res.status(200).json({
      success: false,
      message: 'Coupon usage limit reached',
    });
  }

  if (coupon.courseId) {
    if (!courseId || coupon.courseId !== courseId) {
      return res.status(200).json({
        success: false,
        message: 'Coupon is not valid for this course',
      });
    }
  }

  if (purchaseAmount !== undefined && purchaseAmount !== null && coupon.minPurchase > 0) {
    if (purchaseAmount < coupon.minPurchase) {
      return res.status(200).json({
        success: false,
        message: `Minimum purchase of ${coupon.minPurchase} is required`,
      });
    }
  }

  const purchaseTotal = purchaseAmount !== undefined && purchaseAmount !== null
    ? Number(purchaseAmount)
    : 0;
  const { discountAmount, finalAmount } = calculateCouponDiscount(coupon, purchaseTotal);

  return res.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
    },
  });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  res.json({
    success: true,
    coupons: coupons.map((coupon) => ({
      ...coupon,
      usedCount: coupon.usageCount ?? 0,
    })),
  });
});

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minPurchase = 0,
    usageLimit = 0,
    active = true,
    courseId,
  } = req.body;

  if (!code || !discountType || discountValue === undefined || discountValue === null) {
    res.status(400);
    throw new Error('code, discountType, and discountValue are required');
  }

  const normalizedCode = code.trim().toUpperCase();
  const couponExists = await Coupon.findOne({ code: normalizedCode });
  if (couponExists) {
    res.status(400);
    throw new Error('Coupon with this code already exists');
  }

  if (!['percentage', 'fixed'].includes(discountType)) {
    res.status(400);
    throw new Error('discountType must be either percentage or fixed');
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    discountType,
    discountValue,
    minPurchase,
    usageLimit,
    active,
    courseId: courseId || null,
  });

  res.status(201).json({ success: true, coupon });
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  const {
    code,
    discountType,
    discountValue,
    minPurchase,
    usageLimit,
    active,
    courseId,
  } = req.body;

  if (code) {
    coupon.code = code.trim().toUpperCase();
  }

  if (discountType) {
    if (!['percentage', 'fixed'].includes(discountType)) {
      res.status(400);
      throw new Error('discountType must be either percentage or fixed');
    }
    coupon.discountType = discountType;
  }

  if (discountValue !== undefined && discountValue !== null) {
    coupon.discountValue = discountValue;
  }

  if (minPurchase !== undefined) {
    coupon.minPurchase = minPurchase;
  }

  if (usageLimit !== undefined) {
    coupon.usageLimit = usageLimit;
  }

  if (active !== undefined) {
    coupon.active = active;
  }

  if (courseId !== undefined) {
    coupon.courseId = courseId || null;
  }

  const updatedCoupon = await coupon.save();
  res.json({ success: true, coupon: updatedCoupon });
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
});
