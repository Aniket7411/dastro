import express from 'express';
import {
  getPublicOffers,
  getAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicOffers);
router.get('/admin', adminAuth, getAdminOffers);
router.post('/', adminAuth, createOffer);
router.put('/:id', adminAuth, updateOffer);
router.delete('/:id', adminAuth, deleteOffer);

export default router;
