import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Lead from '../models/leadModel.js';
import Coupon from '../models/Coupon.js';
import { sendCredentialsEmail, sendPaidLeadAdminEmail, sendPaymentFailedEmail } from '../utils/sendEmail.js';
import { createRazorpayInstance, getRazorpayConfig, isPaymentEnabled, getPaymentMode, isMockPaymentAllowed } from '../utils/razorpayConfig.js';
import { calculateCouponDiscount } from '../utils/couponHelper.js';
import { notify } from '../utils/notify.js';

// @desc    Payment gateway availability (public)
// @route   GET /api/payment/status
export const getPaymentStatus = async (req, res) => {
  const enabled = isPaymentEnabled();
  const mode = getPaymentMode();
  let keyId = '';
  if (mode === 'live' || mode === 'test') {
    try {
      keyId = getRazorpayConfig().keyId;
    } catch {
      // ignore
    }
  }
  res.json({
    success: true,
    paymentEnabled: enabled,
    mode,
    keyId: keyId || (mode === 'mock' ? 'rzp_test_mock' : ''),
    message: enabled
      ? mode === 'mock'
        ? 'Test payment mode — mock checkout active until live Razorpay keys are added.'
        : 'Online payment is active for recorded courses and consultations.'
      : 'Lead capture mode — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env to enable checkout.',
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public (Guest Checkout) or Private
export const createOrder = async (req, res) => {
  try {
    if (!isPaymentEnabled()) {
      return res.status(503).json({
        success: false,
        code: 'PAYMENT_DISABLED',
        message: 'Online payment is not enabled yet. Please submit an enquiry and our team will contact you.',
      });
    }

    const { courseId, name, email, mobile, couponCode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.courseType !== 'Recorded') {
      return res.status(400).json({ success: false, message: 'Only recorded courses can be purchased online' });
    }

    const originalAmount = Number(course.price) || 0;
    let payableAmount = originalAmount;
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const normalizedCoupon = String(couponCode).trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: normalizedCoupon });

      if (!coupon || !coupon.active) {
        return res.status(400).json({ success: false, message: 'Coupon code is invalid or expired' });
      }

      if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      }

      if (coupon.courseId && coupon.courseId !== String(courseId)) {
        return res.status(400).json({ success: false, message: 'Coupon is not valid for this course' });
      }

      if (coupon.minPurchase > 0 && originalAmount < coupon.minPurchase) {
        return res.status(400).json({ success: false, message: `Minimum purchase of ${coupon.minPurchase} is required` });
      }

      const discount = calculateCouponDiscount(coupon, originalAmount);
      discountAmount = discount.discountAmount;
      payableAmount = discount.finalAmount;
      appliedCoupon = coupon;
    }

    const amountInPaise = Math.round(payableAmount * 100);

    if (!req.user && (!email || email.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Email is required for checkout. Please fill in your details.' });
    }

    let userId = null;
    if (req.user) {
      userId = req.user.id || req.user._id;
    }

    let studentEmail = email;
    let studentName = name;
    let studentMobile = mobile;

    if (req.user) {
      const user = await User.findById(req.user.id || req.user._id);
      if (user) {
        studentEmail = email || user.email;
        studentName = name || user.name;
        studentMobile = mobile || user.mobile;
      }
    }

    const order = await Order.create({
      userId,
      courseId,
      amount: payableAmount,
      originalAmount,
      discountAmount,
      couponCode: appliedCoupon?.code,
      paymentStatus: 'pending',
      guestDetails: userId ? undefined : { name: studentName, email: studentEmail, mobile: studentMobile },
    });

    let razorpayOrder;
    let isMock = false;
    try {
      const razorpayInstance = createRazorpayInstance();
      razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order._id.toString(),
      });
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    } catch (err) {
      if (getPaymentMode() === 'mock' || isMockPaymentAllowed()) {
        const mockOrderId = `order_mock_${Date.now()}`;
        razorpayOrder = { id: mockOrderId, amount: amountInPaise };
        order.razorpayOrderId = mockOrderId;
        await order.save();
        isMock = true;
      } else {
        console.error('RAZORPAY ERROR:', err);
        return res.status(500).json({ success: false, message: err.message || 'Failed to create Razorpay Order' });
      }
    }

    let lead = null;
    if (studentEmail && studentName) {
      lead = await Lead.create({
        name: studentName,
        email: studentEmail,
        phone: studentMobile || 'N/A',
        type: 'Recorded-Course',
        courseName: course.title,
        courseId: course._id,
        courseType: 'Recorded',
        leadType: 'RECORDED COURSE LEAD',
        message: appliedCoupon ? `Coupon applied: ${appliedCoupon.code}, discount: ${discountAmount}` : '',
        paymentStatus: 'PENDING',
        status: 'Recorded Course Lead - Payment Initiated',
        orderId: razorpayOrder.id,
        amount: payableAmount,
        paymentFor: 'Recorded Course',
      });

      notify({
        title: 'Recorded Course Checkout Started',
        message: `${studentName} initiated payment for ${course.title} (₹${payableAmount})`,
        type: 'lead',
        icon: 'fa-play-circle',
        color: 'blue',
        link: 'leads',
        meta: { leadId: lead._id, courseId: course._id, orderId: razorpayOrder.id },
      });
    }

    const keyId = isMock ? 'rzp_test_mock' : getRazorpayConfig().keyId;

    res.status(200).json({
      success: true,
      leadId: lead?._id || null,
      purchaseId: order._id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: 'INR',
      keyId,
      name: studentName || '',
      email: studentEmail || '',
      phone: studentMobile || '',
      isMock,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error while creating order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name } = req.body;

    const isMockPayment = (getPaymentMode() === 'mock' || isMockPaymentAllowed())
      && (razorpay_signature === 'mock_signature' || razorpay_signature?.startsWith('sig_mock_'));

    let isAuthentic = isMockPayment;
    if (!isMockPayment) {
      try {
        const { keySecret } = getRazorpayConfig();
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(body.toString())
          .digest('hex');
        isAuthentic = expectedSignature === razorpay_signature;
      } catch (configErr) {
        isAuthentic = false;
      }
    }

    if (!isAuthentic) {
      const failedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'failed' },
        { new: true }
      )
        .populate('userId', 'name email')
        .populate('courseId', 'title');
      await Lead.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentStatus: 'FAILED', status: 'Recorded Course Lead - Failed Payment' }
      );

      const failedEmail = email || failedOrder?.guestDetails?.email || failedOrder?.userId?.email;
      const failedName = name || failedOrder?.guestDetails?.name || failedOrder?.userId?.name;
      if (failedEmail) {
        try {
          await sendPaymentFailedEmail(failedEmail, failedName, failedOrder?.courseId?.title);
        } catch (emailError) {
          console.error('Payment failed email error:', emailError.message);
        }
      }

      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found in our database' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(200).json({ success: true, message: 'Order already processed' });
    }

    order.paymentStatus = 'completed';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    const course = await Course.findById(order.courseId);

    let finalUserId = order.userId;
    let generatedPassword = null;
    let studentCreated = false;
    let studentEmail = email || (order.guestDetails ? order.guestDetails.email : '');
    let studentName = name || (order.guestDetails ? order.guestDetails.name : '');

    if (!finalUserId) {
      let user = await User.findOne({ email: studentEmail });

      if (!user) {
        generatedPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        user = await User.create({
          name: studentName,
          email: studentEmail,
          passwordHash: hashedPassword,
          role: 'student',
        });
        studentCreated = true;
      }
      finalUserId = user._id;
      order.userId = finalUserId;
      await order.save();
    } else if (!studentEmail || !studentName) {
      const user = await User.findById(finalUserId);
      if (user) {
        studentEmail = studentEmail || user.email;
        studentName = studentName || user.name;
      }
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (course.validityDays || 365));

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
        name: studentName,
        email: studentEmail,
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

    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usageCount: 1 } }
      );
    }

    if (generatedPassword) {
      await sendCredentialsEmail(studentEmail, generatedPassword, studentName, course.title);
    }

    await sendPaidLeadAdminEmail({
      customerName: studentName,
      phone: order.guestDetails?.mobile,
      email: studentEmail,
      product: course.title,
      amount: order.amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrollment active',
      studentCreated,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server error during verification', error: error.message });
  }
};
