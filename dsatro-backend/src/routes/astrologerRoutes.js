import express from 'express';
import {
  getAstrologers,
  loginAstrologer,
  getMyProfile,
  setOnlineStatus,
  changeMyPassword,
  getMySessions,
} from '../controllers/astrologerController.js';
import { astrologerAuth } from '../middleware/astrologerAuth.js';

const router = express.Router();

// ── Public ──────────────────────────────────────────────
router.get('/', getAstrologers);
router.post('/login', loginAstrologer);

// ── Astrologer-protected ─────────────────────────────────
router.get('/me', astrologerAuth, getMyProfile);
router.put('/me/status', astrologerAuth, setOnlineStatus);
router.put('/me/password', astrologerAuth, changeMyPassword);
router.get('/me/sessions', astrologerAuth, getMySessions);

export default router;
