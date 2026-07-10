import express from 'express';
import { drawCard, drawSpread } from '../controllers/tarotController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Rate limiting included for production robustness
router.post('/draw', drawCard);
router.post('/spread', drawSpread);

export default router;
