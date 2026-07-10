import express from 'express';
import { submitConsultation, verifyPayment } from '../controllers/consultationController.js';
import {
  getConsultationServices,
  getConsultationService,
  getConsultationPaymentConfig,
} from '../controllers/consultationCatalogController.js';

const router = express.Router();

router.get('/services', getConsultationServices);
router.get('/services/:serviceId', getConsultationService);
router.get('/payment-config', getConsultationPaymentConfig);
router.post('/', submitConsultation);
router.post('/verify-payment', verifyPayment);

export default router;
