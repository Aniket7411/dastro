import crypto from 'crypto';
import express from 'express';
import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Lead from '../models/leadModel.js';
import CourseVideo from '../models/CourseVideo.js';
import Consultation from '../models/Consultation.js';
import Coupon from '../models/Coupon.js';
import bcrypt from 'bcryptjs';
import { sendCredentialsEmail, sendAdminNotificationEmail } from '../utils/sendEmail.js';

const router = express.Router();

router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const eventId = req.headers['x-razorpay-event-id'];
    
    if (!signature || !secret) {
      return res.status(400).json({ success: false, message: 'Missing signature or configuration' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedSignatureBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString());
    const eventName = event.event;
    const paymentEntity = event.payload?.payment?.entity;
    
    if (!paymentEntity) {
      return res.status(200).json({ success: true, message: 'No payment entity' });
    }
    
    const razorpay_order_id = paymentEntity.order_id || paymentEntity.payment_link_id;
    const razorpay_payment_id = paymentEntity.id;

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    const consultation = !order ? await Consultation.findOne({ transactionId: razorpay_order_id }) : null;

    if (!order && !consultation) {
      return res.status(404).json({ success: false, message: 'Order or Consultation not found' });
    }

    if (consultation) {
      if (eventName === 'payment.captured' || eventName === 'order.paid') {
        if (consultation.paymentStatus === 'pending') {
          consultation.paymentStatus = 'completed';
          consultation.transactionId = razorpay_payment_id; // Update to actual payment ID
          await consultation.save();

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
              <h2 style="color: #2A0F02;">New Paid Consultation Booking (Webhook)</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td>${consultation.name || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td>${consultation.email || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Mobile:</strong></td><td>${consultation.mobile || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Consultation Type:</strong></td><td>${consultation.consultationType || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td><td>₹${consultation.amount || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Transaction ID:</strong></td><td>${razorpay_payment_id}</td></tr>
              </table>
            </div>
          `;
          await sendAdminNotificationEmail('Alert: New Paid Consultation Booked', emailHtml);
        }
      } else if (eventName === 'payment.failed') {
        consultation.paymentStatus = 'failed';
        await consultation.save();
      } else if (eventName === 'refund.processed') {
        consultation.paymentStatus = 'refunded';
        await consultation.save();
      }
      return res.status(200).json({ success: true });
    }
    
    // Idempotency Check: Don't process if eventId already exists in order
    const isAlreadyProcessed = order.rawWebhookEvents.some(
      (e) => e.id === event.id || e['x-razorpay-event-id'] === eventId
    );

    if (isAlreadyProcessed) {
      return res.status(200).json({ success: true, message: 'Event already processed' });
    }

    // Attach header eventId just in case
    event['x-razorpay-event-id'] = eventId;
    
    // Log event
    order.rawWebhookEvents.push(event);
    order.razorpayPaymentId = razorpay_payment_id;

    switch (eventName) {
      case 'payment.captured':
      case 'order.paid':
        if (order.paymentStatus === 'pending') {
          order.paymentStatus = 'completed';
          await order.save();
          
          const course = await Course.findById(order.courseId);
          if (!course) break;

          let finalUserId = order.userId;
          let generatedPassword = null;
          let studentEmail = order.guestDetails?.email;
          let studentName = order.guestDetails?.name;

          if (!finalUserId && studentEmail) {
            let user = await User.findOne({ email: studentEmail });
            if (!user) {
              generatedPassword = crypto.randomBytes(4).toString('hex');
              const hashedPassword = await bcrypt.hash(generatedPassword, 10);
              user = await User.create({
                name: studentName,
                email: studentEmail,
                passwordHash: hashedPassword,
                role: 'student'
              });
            }
            finalUserId = user._id;
            order.userId = finalUserId;
            await order.save();
          }

          if (finalUserId) {
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + course.validityDays);

            await Enrollment.findOneAndUpdate(
              { userId: finalUserId, courseId: course._id },
              {
                validUntil,
                isActive: true,
                accessApproved: false,
                accessStatus: 'pending',
                $setOnInsert: { progress: { completedVideos: [], videoProgress: {} } },
              },
              { upsert: true, new: true }
            );

            if (generatedPassword) {
              await sendCredentialsEmail(studentEmail, generatedPassword, studentName, course.title);
            }

            if (order.couponCode) {
              await Coupon.findOneAndUpdate(
                { code: order.couponCode },
                { $inc: { usageCount: 1 } }
              );
            }

            await sendAdminNotificationEmail(
              `New Course Purchased: ${course.title}`,
              `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
                <h2 style="color: #6b4a44; margin-top: 0;">New Course Sale (Webhook)! 🎉</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Course:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${course.title}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Student:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${studentName}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${studentEmail}</td></tr>
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Amount:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">₹${order.amount}</td></tr>
                  <tr><td style="padding: 8px 0;"><strong>Transaction ID:</strong></td><td style="padding: 8px 0;">${razorpay_payment_id}</td></tr>
                </table>
              </div>`
            );

            if (!studentEmail || !studentName) {
              const user = await User.findById(finalUserId);
              if (user) {
                studentEmail = studentEmail || user.email;
                studentName = studentName || user.name;
              }
            }

            const existingLead = await Lead.findOne({ orderId: razorpay_order_id });
            if (existingLead) {
              existingLead.paymentStatus = 'PAID';
              existingLead.status = 'Recorded Course Lead - Paid';
              existingLead.transactionId = razorpay_payment_id;
              if (order.couponCode) {
                existingLead.message = `${existingLead.message || ''}${existingLead.message ? '\n' : ''}Coupon used: ${order.couponCode}`;
              }
              await existingLead.save();
            } else {
              await Lead.create({
                name: studentName || 'Unknown Student',
                email: studentEmail || 'N/A',
                phone: order.guestDetails?.mobile || 'N/A',
                type: 'Recorded-Course',
                courseName: course.title,
                courseId: course._id,
                courseType: 'Recorded',
                leadType: 'RECORDED COURSE LEAD',
                message: order.couponCode ? `Coupon used: ${order.couponCode}` : '',
                paymentStatus: 'PAID',
                status: 'Recorded Course Lead - Paid',
                orderId: razorpay_order_id,
                transactionId: razorpay_payment_id,
                amount: order.amount,
                paymentFor: 'Recorded Course',
              });
            }
          }
        } else {
          await order.save(); // Just save the raw event
        }
        break;

      case 'payment.failed':
        order.paymentStatus = 'failed';
        await order.save();
        await Lead.findOneAndUpdate(
          { orderId: razorpay_order_id },
          { paymentStatus: 'FAILED', status: 'Recorded Course Lead - Failed Payment' }
        );
        break;

      case 'refund.processed':
        order.paymentStatus = 'refunded';
        await order.save();
        break;

      default:
        await order.save();
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(500).json({ success: false });
  }
});

router.post('/bunny', express.json(), async (req, res) => {
  try {
    const secret = req.headers['x-webhook-secret'];
    const expectedSecret = process.env.BUNNY_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.error("CRITICAL: BUNNY_WEBHOOK_SECRET is not set in .env");
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    if (!secret) {
      return res.status(401).json({ success: false, message: 'Missing webhook secret' });
    }

    const secretBuffer = Buffer.from(secret, 'utf8');
    const expectedSecretBuffer = Buffer.from(expectedSecret, 'utf8');

    if (secretBuffer.length !== expectedSecretBuffer.length || !crypto.timingSafeEqual(secretBuffer, expectedSecretBuffer)) {
      return res.status(401).json({ success: false, message: 'Unauthorized webhook' });
    }

    const payload = req.body;
    console.log('Bunny webhook received:', payload);

    const videoId = payload.VideoGuid || payload.videoId || payload.guid || payload.id;
    const eventType = payload.Status || payload.status || payload.event || payload.state;

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Missing video ID' });
    }

    const video = await CourseVideo.findOne({ bunnyVideoId: videoId });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    video.rawWebhookEvents.push(payload);

    // Map Bunny event to our status
    if (eventType === 3 || eventType === 'ready' || eventType === 'VideoFinished') {
      video.status = 'ready';
    } else if (eventType === 4 || eventType === 'failed' || eventType === 'VideoEncodingFailed') {
      video.status = 'failed';
    } else if (eventType === 1 || eventType === 'processing' || eventType === 'VideoEncoding') {
      video.status = 'processing';
    } else if (eventType === 'uploading') {
      video.status = 'uploading';
    }

    await video.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Bunny webhook error:', error);
    return res.status(500).json({ success: false });
  }
});

export default router;
