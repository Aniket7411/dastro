import express from 'express';
import { subscribeNewsletter, getSubscribers, updateSubscriberStatus, deleteSubscriber } from '../controllers/newsletterController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/', adminAuth, getSubscribers);
router.put('/:id/status', adminAuth, updateSubscriberStatus);
router.delete('/:id', adminAuth, deleteSubscriber);

export default router;
