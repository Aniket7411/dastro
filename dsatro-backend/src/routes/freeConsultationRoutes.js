import express from 'express';
import {
  counsellorForgotPassword,
  counsellorLogin,
  counsellorResetPassword,
  getCounsellorLead,
  listCounsellorLeads,
  submitFreeConsultationLead,
} from '../controllers/freeConsultationController.js';
import { counsellorAuth } from '../middleware/counsellorAuth.js';

const router = express.Router();

router.post('/auth/login', counsellorLogin);
router.post('/auth/forgot-password', counsellorForgotPassword);
router.post('/auth/reset-password', counsellorResetPassword);
router.get('/leads', counsellorAuth, listCounsellorLeads);
router.get('/leads/:id', counsellorAuth, getCounsellorLead);
router.post('/leads', counsellorAuth, submitFreeConsultationLead);

export default router;
