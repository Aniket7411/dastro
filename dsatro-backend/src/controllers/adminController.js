import Lead from '../models/leadModel.js';
import Blog from '../models/Blog.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Consultation from '../models/Consultation.js';
import Newsletter from '../models/Newsletter.js';
import asyncHandler from 'express-async-handler';
import {
  applyEnrollmentAccessAction,
  buildCourseAccessRows,
  confirmLeadCourseAccess,
  resolveAccessStatus,
} from '../services/enrollmentAccessService.js';

const formatConsultationStatus = (status) => {
  if (!status) return 'Pending';
  const normalized = String(status).toLowerCase();
  const map = {
    pending: 'Pending',
    contacted: 'Confirmed',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[normalized] || status;
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalLeads = await Lead.countDocuments();
  const studentConsultationsCount = await Consultation.countDocuments();
  const leadPaidConsultationsCount = await Lead.countDocuments({
    $or: [
      { status: 'Consultation Lead - Paid' },
      { type: 'Consultation', paymentStatus: { $in: ['PAID', 'Completed'] } },
    ],
  });
  const paidConsultations = studentConsultationsCount + leadPaidConsultationsCount;
  const recordedCoursePurchases = await Lead.countDocuments({
    $or: [
      { status: 'Recorded Course Lead - Paid' },
      { type: 'Recorded-Course', paymentStatus: { $in: ['PAID', 'Completed'] } },
    ],
  });
  const failedPayments = await Lead.countDocuments({
    $or: [
      { status: 'Recorded Course Lead - Failed Payment' },
      { status: 'Consultation Lead - Not Paid', paymentStatus: 'FAILED' },
      { paymentStatus: { $in: ['FAILED', 'Failed'] } },
    ],
  });
  const liveCourseEnquiries = await Lead.countDocuments({
    $or: [
      { leadType: 'LIVE COURSE LEAD' },
      { type: 'Course', courseType: { $ne: 'Recorded' } },
      { type: 'Course-Inquiry', courseType: 'Live' },
    ],
  });
  const activeArticles = await Blog.countDocuments({ isPublished: true });
  const jobOpenings = await Job.countDocuments({ isActive: true });
  const newsletterSubscribers = await Newsletter.countDocuments({ status: 'Subscribed' });

  res.json({
    success: true,
    stats: {
      recordedCoursePurchases,
      paidConsultations,
      liveCourseEnquiries,
      failedPayments,
      totalLeads,
      activeArticles,
      activeBlogs: activeArticles,
      jobOpenings,
      newsletterSubscribers,
    },
  });
});

// @desc    Get all consultations (student bookings + paid consultation leads)
// @route   GET /api/admin/consultations
export const getConsultations = asyncHandler(async (req, res) => {
  const rows = await Consultation.find()
    .populate('courseId', 'title')
    .populate('userId', 'name email')
    .sort('-createdAt');

  const studentConsultations = rows.map((c) => ({
    _id: c._id,
    source: 'student',
    studentId: c.userId?._id || c.userId || null,
    studentName: c.userId?.name || c.name || '',
    email: c.userId?.email || c.email || '',
    courseId: c.courseId?._id || c.courseId || null,
    courseName: c.courseId?.title || '',
    consultationType: c.consultationType || 'Free Consultation',
    mobile: c.mobile || c.phone || '',
    preferredDatetime: c.preferredDatetime || null,
    notes: c.notes || c.message || '',
    amount: c.amount || null,
    paymentStatus: c.paymentStatus || 'NOT REQUIRED',
    status: formatConsultationStatus(c.status),
    createdAt: c.createdAt,
  }));

  const paidLeadRows = await Lead.find({
    type: 'Consultation',
    $or: [
      { status: 'Consultation Lead - Paid' },
      { paymentStatus: 'PAID' },
      { status: 'Consultation Lead - Not Paid' },
      { status: 'Consultation Lead - Callback Requested' },
    ],
  }).sort('-submittedAt -createdAt');

  const leadConsultations = paidLeadRows.map((lead) => ({
    _id: lead._id,
    source: 'lead',
    studentId: null,
    studentName: lead.name || '',
    email: lead.email || '',
    courseId: lead.courseId || null,
    courseName: lead.courseName || '',
    consultationType: lead.consultationType || 'Consultation',
    mobile: lead.phone || '',
    preferredDatetime: null,
    notes: lead.message || '',
    amount: lead.amount || lead.quotedAmount || null,
    paymentStatus: lead.paymentStatus || 'NOT REQUIRED',
    status: lead.status || 'Pending',
    bookingMode: lead.bookingMode,
    createdAt: lead.submittedAt || lead.createdAt,
  }));

  const consultations = [...leadConsultations, ...studentConsultations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, consultations });
});

// @desc    Update consultation status
// @route   PUT /api/admin/consultations/:id
export const updateConsultation = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    res.status(404);
    throw new Error('Consultation not found');
  }

  consultation.status = status || consultation.status;
  await consultation.save();

  res.json({ success: true, consultation });
});

// @desc    Get all users (students)
// @route   GET /api/admin/users
export const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'student' }).sort('-createdAt').lean();
  const userIds = users.map((u) => u._id);

  const enrollments = await Enrollment.find({
    userId: { $in: userIds },
  }).populate('courseId', 'title').lean();

  const coursesByUser = new Map();
  for (const enrollment of enrollments) {
    if (!enrollment.courseId) continue;
    const key = String(enrollment.userId);
    if (!coursesByUser.has(key)) coursesByUser.set(key, []);
    coursesByUser.get(key).push({
      _id: enrollment.courseId._id,
      title: enrollment.courseId.title,
      accessStatus: resolveAccessStatus(enrollment),
      enrollmentId: enrollment._id,
      validUntil: enrollment.validUntil,
    });
  }

  res.json({
    success: true,
    users: users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      enrolledCourses: coursesByUser.get(String(user._id)) || [],
      createdAt: user.createdAt,
    })),
  });
});

// @desc    Get course access rows (orders + enrollments + pending enquiries)
// @route   GET /api/admin/orders
export const getAdminOrders = asyncHandler(async (req, res) => {
  const rows = await buildCourseAccessRows();
  res.json({ success: true, orders: rows });
});

// @desc    Confirm external payment from a recorded course enquiry
// @route   POST /api/admin/leads/:id/confirm-access
export const confirmLeadAccess = asyncHandler(async (req, res) => {
  const result = await confirmLeadCourseAccess(req.params.id, req.body || {});
  res.json({
    success: true,
    message: result.credentialsEmailed
      ? 'Course access enabled. Login credentials emailed to the student.'
      : 'Course access enabled for the student.',
    enrollmentId: result.enrollment._id,
    userId: result.user._id,
    courseId: result.course._id,
    credentialsEmailed: result.credentialsEmailed,
    studentCreated: result.studentCreated,
  });
});

// @desc    Enable, disable, or suspend student course access
// @route   PUT /api/admin/enrollments/:id/access
export const updateEnrollmentAccess = asyncHandler(async (req, res) => {
  const action = String(req.body?.action || '').toLowerCase();
  const result = await applyEnrollmentAccessAction(req.params.id, action, {
    sendCredentials: req.body?.sendCredentials !== false,
  });

  const actionMessages = {
    enable: result.credentialsEmailed
      ? 'Course access enabled. Login credentials emailed to the student.'
      : 'Course access enabled.',
    disable: 'Course access disabled. Lesson videos are locked.',
    suspend: 'Course access suspended for this student.',
  };

  res.json({
    success: true,
    message: actionMessages[action] || 'Course access updated.',
    enrollment: {
      _id: result.enrollment._id,
      userId: result.enrollment.userId,
      courseId: result.enrollment.courseId,
      accessStatus: result.accessStatus,
      accessApproved: result.enrollment.accessApproved,
      isActive: result.enrollment.isActive,
    },
    credentialsEmailed: result.credentialsEmailed,
  });
});

// @desc    Extend or revoke a student's course validity date
// @route   PUT /api/admin/enrollments/:id/validity
export const updateEnrollmentValidity = asyncHandler(async (req, res) => {
  const { validUntil } = req.body;

  if (!validUntil || Number.isNaN(new Date(validUntil).getTime())) {
    res.status(400);
    throw new Error('A valid validUntil date is required.');
  }

  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found.');
  }

  enrollment.validUntil = new Date(validUntil);
  await enrollment.save();

  res.json({
    success: true,
    message: 'Course validity updated.',
    enrollment: {
      _id: enrollment._id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      validUntil: enrollment.validUntil,
    },
  });
});

// @desc    Approve student access (legacy alias for enable)
// @route   PUT /api/admin/enrollments/:id/approve
export const approveEnrollmentAccess = asyncHandler(async (req, res) => {
  const result = await applyEnrollmentAccessAction(req.params.id, 'enable');
  res.json({
    success: true,
    message: result.credentialsEmailed
      ? 'Course access approved. Login credentials emailed to the student.'
      : 'Course access approved. Student can now watch lesson videos.',
    enrollment: {
      _id: result.enrollment._id,
      userId: result.enrollment.userId,
      courseId: result.enrollment.courseId,
      accessApproved: true,
      accessStatus: 'enabled',
    },
    credentialsEmailed: result.credentialsEmailed,
  });
});
