import express from 'express';
import {
  validateCoupon,
  getAvailableCouponsForCourse,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/available/:courseId', getAvailableCouponsForCourse);
router.post('/validate', validateCoupon);
router.get('/', adminAuth, getCoupons);
router.post('/', adminAuth, createCoupon);
router.put('/:id', adminAuth, updateCoupon);
router.delete('/:id', adminAuth, deleteCoupon);

export default router;
