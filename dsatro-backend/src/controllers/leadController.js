import Lead from '../models/leadModel.js';
import asyncHandler from 'express-async-handler';
import exceljs from 'exceljs';
import logger from '../config/logger.js';
import Joi from 'joi';
import { createRazorpayInstance, getRazorpayConfig, getPaymentMode, isMockPaymentAllowed } from '../utils/razorpayConfig.js';
import { sendPaidLeadAdminEmail } from '../utils/sendEmail.js';
import { notify } from '../utils/notify.js';
import { getActiveServiceBySlug, seedCatalogFromStaticIfEmpty } from '../services/consultationCatalogDb.js';
import { ensureStudentUser } from '../services/enrollmentAccessService.js';

const leadSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  type: Joi.string().required(),
  courseName: Joi.string().allow('', null),
  courseType: Joi.string().allow('', null),
  courseId: Joi.string().allow('', null),
  consultationType: Joi.string().allow('', null),
  leadType: Joi.string().allow('', null),
  status: Joi.string().allow('', null),
  paymentStatus: Joi.string().allow('', null),
  dob: Joi.string().allow('', null),
  tob: Joi.string().allow('', null),
  pob: Joi.string().allow('', null),
  city: Joi.string().allow('', null),
  age: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null),
  interest: Joi.string().allow('', null),
  message: Joi.string().allow('', null),
  amount: Joi.number().allow(null),
  bookingMode: Joi.string().valid('pay_now', 'pay_later').allow('', null),
  serviceId: Joi.string().allow('', null),
  quotedAmount: Joi.number().allow(null),
}).unknown(true);

const getSubmittedAt = (lead) => lead.submittedAt || lead.createdAt;

const buildCreatedAtRange = (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

const LEAD_SORT_MAP = {
  newest: { submittedAt: -1, createdAt: -1 },
  oldest: { submittedAt: 1, createdAt: 1 },
  name_asc: { name: 1, submittedAt: -1 },
  name_desc: { name: -1, submittedAt: -1 },
};

const resolveLeadSort = (sortKey) => LEAD_SORT_MAP[sortKey] || LEAD_SORT_MAP.newest;

/** Match submittedAt when present, else legacy createdAt */
const applySubmittedDateFilter = (filter, startDate, endDate) => {
  if (!startDate || !endDate) return;
  const range = buildCreatedAtRange(startDate, endDate);
  filter.$and = [
    ...(filter.$and || []),
    {
      $or: [
        { submittedAt: range },
        {
          $and: [
            { $or: [{ submittedAt: null }, { submittedAt: { $exists: false } }] },
            { createdAt: range },
          ],
        },
      ],
    },
  ];
};

const isPaidLeadType = (body, amount, bookingMode) => {
  if (bookingMode === 'pay_later') return false;
  if (isLiveCourseEnquiry(body)) return false;
  if (body.type === 'Course') return false;

  const { type } = body;
  return type === 'Webinar' ||
    type === 'Recorded-Course' ||
    type === 'Course-Inquiry' ||
    (type === 'Consultation' && Boolean(amount)) ||
    Boolean(amount);
};

const isConsultationCallback = (body) =>
  body.type === 'Consultation' && body.bookingMode === 'pay_later';

// A LIVE course enquiry has no payment — it's a manual follow-up lead.
// Recorded-Course / Course-Inquiry types are NOT live enquiries even if they have no amount yet.
const isLiveCourseEnquiry = (body) =>
  (body.type === 'Course' && body.courseType !== 'Recorded') ||
  (body.type === 'Course-Inquiry' && body.courseType === 'Live') ||
  body.leadType === 'LIVE COURSE LEAD';

/** Live + recorded enquiry forms — no Razorpay until payment keys are added */
const isEnquiryOnlyLead = (body) =>
  isLiveCourseEnquiry(body) ||
  body.paymentStatus === 'NOT REQUIRED' ||
  body.status === 'ENQUIRY RECEIVED' ||
  body.type === 'Course-Inquiry';

const createRazorpayOrderForLead = async (lead, amount) => {
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_${lead._id}`,
  };

  try {
    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create(options);
    const { keyId } = getRazorpayConfig();

    lead.orderId = order.id;
    lead.paymentStatus = 'PENDING';
    if (lead.type === 'Consultation') {
      lead.status = 'Consultation Lead - Not Paid';
    } else if (lead.type === 'Webinar') {
      lead.status = 'Webinar Lead - Not Paid';
    } else if (lead.type === 'Recorded-Course' || lead.type === 'Course-Inquiry') {
      lead.status = 'Recorded Course Lead - Payment Initiated';
    }
    await lead.save();

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    };
  } catch (err) {
    if (getPaymentMode() === 'mock' || isMockPaymentAllowed()) {
      logger.warn('Razorpay keys missing/invalid/failed. Falling back to mock order for testing.');
      const mockOrderId = `order_mock_${Date.now()}`;
      lead.orderId = mockOrderId;
      lead.paymentStatus = 'PENDING';
      await lead.save();
      return {
        orderId: mockOrderId,
        amount: options.amount,
        currency: options.currency,
        keyId: 'rzp_test_mock',
        isMock: true,
      };
    }
    logger.error('Razorpay Order Creation Failed: ' + err.message + '. Falling back to unpaid lead/callback.');
    
    // Fall back to callback/unpaid lead instead of failing
    lead.bookingMode = 'pay_later';
    lead.paymentStatus = 'NOT REQUIRED';
    if (lead.type === 'Consultation') {
      lead.status = 'Consultation Lead - Callback Requested';
    } else if (lead.type === 'Webinar') {
      lead.status = 'Webinar Lead - Callback Requested';
    } else if (lead.type === 'Recorded-Course' || lead.type === 'Course-Inquiry') {
      lead.status = 'Recorded Course Enquiry';
    } else {
      lead.status = 'ENQUIRY RECEIVED';
    }
    await lead.save();
    return null;
  }
};

// @desc    Submit new lead (Pre-payment)
// @route   POST /api/leads
export const createLead = asyncHandler(async (req, res) => {
  const { error } = leadSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const {
    name, email, phone, type, courseName, courseType, courseId,
    consultationType, dob, tob, pob, city, age, interest, message, amount,
    leadType, status, paymentStatus, bookingMode, serviceId, quotedAmount,
  } = req.body;

  let resolvedAmount = amount;
  let resolvedQuotedAmount = quotedAmount;
  let resolvedConsultationType = consultationType;

  if (type === 'Consultation' && serviceId) {
    await seedCatalogFromStaticIfEmpty();
    const svc = await getActiveServiceBySlug(serviceId);
    if (!svc) {
      res.status(404);
      throw new Error('Consultation service not found');
    }
    resolvedConsultationType = svc.title;
    resolvedQuotedAmount = svc.price;
    if (bookingMode === 'pay_now') {
      resolvedAmount = svc.price;
    }
  }

  const consultationCallback = isConsultationCallback(req.body);
  const requiresPayment = isPaidLeadType(req.body, resolvedAmount, bookingMode);
  const liveEnquiry = isLiveCourseEnquiry(req.body);
  const enquiryOnly = isEnquiryOnlyLead(req.body);
  const recordedEnquiry = enquiryOnly && !liveEnquiry;

  const leadData = {
    name,
    email,
    phone,
    type,
    courseName,
    courseType,
    courseId: (courseId && /^[0-9a-fA-F]{24}$/.test(courseId)) ? courseId : undefined,
    consultationType: resolvedConsultationType,
    serviceId: serviceId || undefined,
    bookingMode: bookingMode || (consultationCallback ? 'pay_later' : requiresPayment ? 'pay_now' : undefined),
    quotedAmount: resolvedQuotedAmount || undefined,
    dob,
    tob,
    pob,
    city,
    age,
    interest,
    message,
    amount: resolvedAmount || undefined,
    leadType: leadType || (liveEnquiry ? 'LIVE COURSE LEAD' : recordedEnquiry ? 'RECORDED COURSE LEAD' : undefined),
    status: status || (consultationCallback
      ? 'Consultation Lead - Callback Requested'
      : enquiryOnly
        ? 'ENQUIRY RECEIVED'
        : requiresPayment
          ? 'Pending'
          : type === 'Consultation'
            ? 'Consultation Lead - Callback Requested'
            : 'Pending'),
    paymentStatus: paymentStatus || (consultationCallback || (type === 'Consultation' && !requiresPayment)
      ? 'NOT REQUIRED'
      : enquiryOnly
        ? 'NOT REQUIRED'
        : requiresPayment
          ? 'PENDING'
          : 'NOT REQUIRED'),
    submittedAt: new Date(),
  };

  const lead = await Lead.create(leadData);

  // Auto-create a user account for course-related leads so the admin can confirm access later
  // without needing to re-enter details. No credentials email is sent at this stage.
  const courseLeadTypes = ['Course', 'Course-Inquiry', 'Recorded-Course'];
  if (courseLeadTypes.includes(type)) {
    try {
      const { user, studentCreated } = await ensureStudentUser({ name, email, mobile: phone });
      lead.userId = user._id;
      if (studentCreated) lead.accountCreated = true;
      await lead.save();
    } catch (accountErr) {
      logger.warn(`Auto-user creation failed for lead ${lead._id}: ${accountErr.message}`);
    }
  }

  const notifyLabel = {
    'Course':           'live course enquiry',
    'Course-Inquiry':   'recorded course enquiry',
    'Recorded-Course':  'recorded course purchase',
    'Consultation':     'consultation request',
    'Webinar':          'webinar registration',
    'Contact':          'contact query',
    'Home-Enroll':      'home enrollment',
  };
  const notifyIcon = {
    'Consultation':     'fa-user-md',
    'Webinar':          'fa-video',
    'Contact':          'fa-address-book',
    'Recorded-Course':  'fa-play-circle',
    'Course-Inquiry':   'fa-play-circle',
    'Course':           'fa-chalkboard-teacher',
    'Home-Enroll':      'fa-home',
  };
  const notifyColor = {
    'Consultation':    'cyan',
    'Webinar':         'violet',
    'Contact':         'amber',
    'Recorded-Course': 'blue',
    'Course-Inquiry':  'blue',
    'Course':          'green',
    'Home-Enroll':     'emerald',
  };
  notify({
    title: liveEnquiry
      ? 'New Live Course Enquiry'
      : `New ${type === 'Recorded-Course' ? 'Recorded Course' : type === 'Course-Inquiry' ? 'Recorded Course' : type} Lead`,
    message: liveEnquiry
      ? `${name} (${phone}) enquired about ${courseName || 'a live course'}`
      : `${name} (${phone}) submitted a ${notifyLabel[type] || type.toLowerCase() + ' form'}`,
    type: 'lead',
    icon: notifyIcon[type] || 'fa-graduation-cap',
    color: notifyColor[type] || 'blue',
    link: 'leads',
    meta: { leadId: lead._id, name, phone, email, type },
  });

  if (requiresPayment && !enquiryOnly) {
    const payableAmount = resolvedAmount || (type === 'Webinar' ? 99 : 0);
    if (!payableAmount) {
      res.status(400);
      throw new Error('Amount is required for paid lead types');
    }

    const orderData = await createRazorpayOrderForLead(lead, payableAmount);

    if (orderData) {
      return res.status(201).json({
        success: true,
        leadId: lead._id,
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        ...(orderData.isMock ? { isMock: true } : { isMock: false }),
      });
    } else {
      return res.status(201).json({
        success: true,
        message: 'Request received successfully. Our team will contact you soon.',
        leadId: lead._id,
      });
    }
  }

  res.status(201).json({
    success: true,
    message: 'Request received successfully. Our team will contact you soon.',
    leadId: lead._id,
  });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/leads/verify-payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, leadId } = req.body;

  const isMockPayment = (getPaymentMode() === 'mock' || isMockPaymentAllowed()) && razorpay_signature === 'mock_signature';

  const crypto = await import('crypto');
  let isValid = isMockPayment;
  if (!isMockPayment) {
    try {
      const { keySecret } = getRazorpayConfig();
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      isValid = hmac.digest('hex') === razorpay_signature;
    } catch (configErr) {
      isValid = false;
    }
  }

  if (!isValid) {
    res.status(400);
    throw new Error('Invalid payment signature');
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  lead.paymentStatus = 'PAID';
  lead.transactionId = razorpay_payment_id;
  lead.orderId = razorpay_order_id;

  if (lead.type === 'Consultation') {
    lead.status = 'Consultation Lead - Paid';
  } else if (lead.type === 'Webinar') {
    lead.status = 'Webinar Lead - Paid';
  } else if (lead.type === 'Recorded-Course' || lead.type === 'Course-Inquiry') {
    lead.status = 'Recorded Course Lead - Paid';
  } else {
    lead.status = 'Done';
  }

  await lead.save();

  notify({
    title: 'Payment Confirmed',
    message: `${lead.name} paid ₹${lead.amount || 'N/A'} for ${lead.consultationType || lead.courseName || lead.type}`,
    type: 'payment_success',
    icon: 'fa-check-circle',
    color: 'green',
    link: 'leads',
    meta: { leadId: lead._id, name: lead.name, paymentId: razorpay_payment_id },
  });

  await sendPaidLeadAdminEmail({
    customerName: lead.name,
    phone: lead.phone,
    email: lead.email,
    product: lead.consultationType || lead.courseName || lead.type,
    amount: lead.amount,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

  res.json({ success: true });
});

// @desc    Report failed payment
// @route   POST /api/leads/payment-failed
export const paymentFailed = asyncHandler(async (req, res) => {
  const {
    leadId,
    orderId,
    courseId,
    courseName,
    consultationType,
    paymentFor,
    status,
    paymentStatus,
    failureReason,
    razorpayError,
    name,
    email,
    phone,
  } = req.body;

  let lead = null;

  if (leadId) {
    lead = await Lead.findById(leadId);
  } else if (orderId) {
    lead = await Lead.findOne({ $or: [{ orderId }, { transactionId: orderId }] });
  }

  if (lead) {
    lead.paymentStatus = paymentStatus || 'FAILED';
    lead.status = status || lead.status;
    if (failureReason) lead.failureReason = failureReason;
    if (razorpayError) lead.razorpayError = razorpayError;
    if (orderId) lead.orderId = orderId;
    await lead.save();
  } else {
    lead = await Lead.create({
      name: name || 'Unknown',
      email: email || 'unknown@example.com',
      phone: phone || 'N/A',
      type: paymentFor === 'Consultation' ? 'Consultation' : 'Recorded-Course',
      courseName: courseName || paymentFor,
      courseId: courseId || undefined,
      consultationType,
      paymentFor,
      status: status || 'Recorded Course Lead - Failed Payment',
      paymentStatus: paymentStatus || 'FAILED',
      failureReason,
      razorpayError,
      orderId,
      submittedAt: new Date(),
    });
  }

  notify({
    title: 'Payment Failed',
    message: `${lead?.name || name || 'Unknown user'} payment failed for ${lead?.courseName || courseName || lead?.type || paymentFor || 'Unknown product'}`,
    type: 'payment_failed',
    icon: 'fa-times-circle',
    color: 'rose',
    link: 'leads',
    meta: { leadId: lead?._id, name: lead?.name || name },
  });

  res.json({
    success: true,
    message: 'Payment failure recorded',
    leadId: lead?._id || null,
  });
});

// @desc    Update lead payment status (Legacy/Webhook)
// @route   POST /api/leads/payment-callback
export const paymentCallback = asyncHandler(async (req, res) => {
  const { leadId, status, transactionId } = req.body;

  const lead = await Lead.findById(leadId);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  lead.paymentStatus = status === 'Completed' ? 'PAID' : status;
  if (transactionId) lead.transactionId = transactionId;
  await lead.save();

  res.json({ success: true, status: lead.paymentStatus });
});

const formatLead = (lead) => {
  const submittedAt = getSubmittedAt(lead);
  return {
    _id: lead._id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    type: lead.type,
    leadType: lead.leadType || '',
    status: lead.status,
    paymentStatus: lead.paymentStatus,
    courseName: lead.courseName || '',
    courseType: lead.courseType || '',
    courseId: lead.courseId || null,
    consultationType: lead.consultationType || '',
    city: lead.city || '',
    age: lead.age ?? '',
    interest: lead.interest || '',
    message: lead.message || '',
    dob: lead.dob || '',
    tob: lead.tob || '',
    pob: lead.pob || '',
    amount: lead.amount ?? 0,
    razorpay_payment_id: lead.transactionId || '',
    razorpay_order_id: lead.orderId || '',
    submittedAt,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

// @desc    Get all leads (Admin)
// @route   GET /api/leads
export const getLeads = asyncHandler(async (req, res) => {
  const { startDate, endDate, type, status, paymentStatus, search, sort, _limit } = req.query;
  const filter = {};

  applySubmittedDateFilter(filter, startDate, endDate);
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
          { courseName: regex },
          { consultationType: regex },
        ],
      },
    ];
  }

  let query = Lead.find(filter).sort(resolveLeadSort(sort));
  const limit = parseInt(_limit, 10);
  if (limit > 0) query = query.limit(limit);

  const leads = await query;
  res.json({ success: true, leads: leads.map(formatLead), sort: sort || 'newest' });
});

// @desc    Export leads to Excel (Admin)
// @route   GET /api/leads/export
export const exportLeads = asyncHandler(async (req, res) => {
  const { startDate, endDate, type, status, paymentStatus, sort } = req.query;
  const filter = {};

  applySubmittedDateFilter(filter, startDate, endDate);
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const leads = await Lead.find(filter).sort(resolveLeadSort(sort));

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Leads');

  worksheet.columns = [
    { header: 'Submitted Date', key: 'submittedDate', width: 16 },
    { header: 'Submitted Time', key: 'submittedTime', width: 14 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 20 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Lead Type', key: 'leadType', width: 25 },
    { header: 'Course/Webinar', key: 'courseName', width: 25 },
    { header: 'Course Type', key: 'courseType', width: 14 },
    { header: 'City', key: 'city', width: 18 },
    { header: 'Age', key: 'age', width: 8 },
    { header: 'Interest', key: 'interest', width: 22 },
    { header: 'Consultation Type', key: 'consultationType', width: 20 },
    { header: 'Date of Birth', key: 'dob', width: 14 },
    { header: 'Birth Time', key: 'tob', width: 12 },
    { header: 'Birth Place', key: 'pob', width: 20 },
    { header: 'Status', key: 'status', width: 30 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    { header: 'Message', key: 'message', width: 40 },
  ];

  leads.forEach((lead) => {
    const submitted = getSubmittedAt(lead);
    worksheet.addRow({
      submittedDate: submitted.toLocaleDateString('en-IN'),
      submittedTime: submitted.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      type: lead.type,
      leadType: lead.leadType || '-',
      courseName: lead.courseName || '-',
      courseType: lead.courseType || '-',
      city: lead.city || '-',
      age: lead.age ?? '-',
      interest: lead.interest || '-',
      consultationType: lead.consultationType || '-',
      dob: lead.dob || '-',
      tob: lead.tob || '-',
      pob: lead.pob || '-',
      status: lead.status,
      paymentStatus: lead.paymentStatus,
      message: lead.message || '-',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + `leads_export_${Date.now()}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
});

// @desc    Update lead status (Admin)
// @route   PUT /api/leads/:id/status
export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({ success: true, message: 'Status updated successfully', lead });
});

// @desc    Delete lead (Admin)
// @route   DELETE /api/leads/:id
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await lead.deleteOne();
  res.json({ success: true, message: 'Lead removed' });
});
