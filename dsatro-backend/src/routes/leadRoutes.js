import express from 'express';
import rateLimit from 'express-rate-limit';
import { createLead, paymentCallback, verifyPayment, paymentFailed, getLeads, exportLeads, updateLeadStatus, deleteLead } from '../controllers/leadController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: { success: false, message: 'Too many submissions, please try again later' }
});

router.post('/', submitLimiter, createLead);
router.post('/payment-callback', paymentCallback);
router.post('/verify-payment', verifyPayment);
router.post('/payment-failed', paymentFailed);
router.get('/', adminAuth, getLeads);
router.get('/export', adminAuth, exportLeads);
router.put('/:id/status', adminAuth, updateLeadStatus);
router.delete('/:id', adminAuth, deleteLead);

export default router;
