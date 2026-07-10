import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', adminAuth, updateSettings);

export default router;
