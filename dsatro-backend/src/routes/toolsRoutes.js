import express from 'express';
import { 
  calculateMoon, 
  calculateNumerology, 
  calculateKundali, 
  calculateZodiac, 
  getHoroscope,
  calculateLoveCompatibility 
} from '../controllers/toolsController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/moon', apiLimiter, calculateMoon);
router.post('/numerology', apiLimiter, calculateNumerology);
router.post('/kundali', apiLimiter, calculateKundali);
router.post('/zodiac', apiLimiter, calculateZodiac);
router.post('/love-compatibility', calculateLoveCompatibility);
router.get('/horoscope/:sign', getHoroscope);

export default router;
