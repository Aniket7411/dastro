import asyncHandler from 'express-async-handler';
import consultationService from '../services/consultationService.js';
import Consultation from '../models/Consultation.js';
import { sendAdminNotificationEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
import logger from '../config/logger.js';
import { createRazorpayInstance, getRazorpayConfig, getPaymentMode, isMockPaymentAllowed } from '../utils/razorpayConfig.js';

export const submitConsultation = asyncHandler(async (req, res) => {
  if (req.body.phone && !req.body.mobile) {
    req.body.mobile = req.body.phone;
  }
  
  req.body.paymentStatus = 'pending';
  const consultation = await consultationService.createConsultation(req.body);
  
  if (!req.body.amount) {
    res.status(400);
    throw new Error('Amount is required for consultation');
  }

  try {
    const razorpay = createRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: req.body.amount * 100, // paise
      currency: "INR",
      receipt: consultation._id.toString()
    });
    
    consultation.transactionId = razorpayOrder.id; // Store order ID as reference
    await consultation.save();

    const { keyId } = getRazorpayConfig();

    return res.status(201).json({
      success: true,
      orderId: razorpayOrder.id, // Razorpay Order ID for standard checkout
      consultationId: consultation._id, // internal reference
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      name: consultation.name,
      email: consultation.email,
      phone: consultation.mobile
    });
  } catch (err) {
    if (getPaymentMode() === 'mock' || isMockPaymentAllowed()) {
      logger.warn('Razorpay keys missing/invalid/failed. Falling back to mock order for testing.');
      const mockOrderId = `order_mock_${Date.now()}`;
      consultation.transactionId = mockOrderId;
      await consultation.save();
      return res.status(201).json({
        success: true,
        orderId: mockOrderId,
        consultationId: consultation._id,
        amount: req.body.amount * 100,
        currency: "INR",
        keyId: 'rzp_test_mock',
        isMock: true,
        name: consultation.name,
        email: consultation.email,
        phone: consultation.mobile
      });
    }
    console.error("RAZORPAY ERROR:", err);
    logger.error('Razorpay Payment Link Creation Failed: ' + err.message + '. Falling back to unpaid lead/callback.');
    
    // Save consultation without payment details
    consultation.paymentStatus = 'pending';
    consultation.status = 'Pending';
    await consultation.save();

    return res.status(201).json({
      success: true,
      message: 'Request received successfully. Our team will contact you soon.',
      consultationId: consultation._id,
      name: consultation.name,
      email: consultation.email,
      phone: consultation.mobile,
      gatewayError: true
    });
  }
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationId } = req.body;

  const isMockPayment = (getPaymentMode() === 'mock' || isMockPaymentAllowed()) && razorpay_signature === 'mock_signature';

  let isAuthentic = isMockPayment;
  if (!isMockPayment) {
    try {
      const { keySecret } = getRazorpayConfig();
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');
      isAuthentic = generated_signature === razorpay_signature;
    } catch (configErr) {
      isAuthentic = false;
    }
  }

  if (isAuthentic) {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      res.status(404);
      throw new Error('Consultation not found');
    }

    consultation.paymentStatus = 'completed';
    consultation.transactionId = razorpay_payment_id;
    await consultation.save();

    // Send email notification to Admin only after successful payment
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02;">New Paid Consultation Booking</h2>
        <p>A new consultation has been booked and paid for on the platform. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.email || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Mobile:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.mobile || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Consultation Type:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.consultationType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">₹${consultation.amount || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.transactionId || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.message || 'N/A'}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Please login to the Admin Dashboard to manage this booking.</p>
      </div>
    `;
    
    await sendAdminNotificationEmail('Alert: New Paid Consultation Booked', emailHtml);

    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid payment signature');
  }
});


export const getConsultations = asyncHandler(async (req, res) => {
  const list = await consultationService.getAllConsultations();
  res.json({ success: true, data: list });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await consultationService.getConsultationStats();
  res.json({ success: true, data: stats });
});

import ConsultationCategory from '../models/ConsultationCategory.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await ConsultationCategory.find({}).sort({ sortOrder: 1 });
  res.json({ success: true, data: categories });
});

