import express from 'express';
import { calculateLoveCompatibility } from '../controllers/loveController.js';

const router = express.Router();

router.post('/calculate', calculateLoveCompatibility);

export default router;
