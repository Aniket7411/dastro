import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Lead from '../models/leadModel.js';
import { sendCredentialsEmail } from '../utils/sendEmail.js';

export const ACCESS_ACTIONS = ['enable', 'disable', 'suspend'];

export const resolveAccessStatus = (enrollment) => {
  if (!enrollment) return 'none';
  if (enrollment.isActive === false) return 'suspended';
  if (enrollment.accessStatus) return enrollment.accessStatus;
  return enrollment.accessApproved !== false ? 'enabled' : 'pending';
};

export const hasLessonAccess = (enrollment) => {
  const status = resolveAccessStatus(enrollment);
  return enrollment?.isActive !== false && status === 'enabled';
};

const generatePassword = () => crypto.randomBytes(4).toString('hex');

export const ensureStudentUser = async ({ name, email, mobile }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Student email is required.');
  }

  let user = await User.findOne({ email: normalizedEmail });
  let generatedPassword = null;
  let studentCreated = false;

  if (!user) {
    generatedPassword = generatePassword();
    const passwordHash = await bcrypt.hash(generatedPassword, 10);
    user = await User.create({
      name: String(name || 'Student').trim() || 'Student',
      email: normalizedEmail,
      passwordHash,
      mobile: mobile || '',
      role: 'student',
    });
    studentCreated = true;
  } else if (mobile && !user.mobile) {
    user.mobile = mobile;
    await user.save();
  }

  return { user, generatedPassword, studentCreated };
};

export const rotateStudentPassword = async (user) => {
  const generatedPassword = generatePassword();
  user.passwordHash = await bcrypt.hash(generatedPassword, 10);
  await user.save();
  return generatedPassword;
};

export const sendStudentCredentials = async ({
  user,
  courseTitle,
  generatedPassword = null,
  forceNewPassword = false,
}) => {
  let password = generatedPassword;

  if (!password && forceNewPassword) {
    password = await rotateStudentPassword(user);
  }

  if (!password) {
    return { emailed: false, reason: 'existing_account' };
  }

  await sendCredentialsEmail(user.email, password, user.name, courseTitle);
  return { emailed: true, studentCreated: Boolean(generatedPassword) };
};

export const upsertEnrollment = async ({ userId, course, accessStatus = 'enabled' }) => {
  const isLifetime = course.validityDays === 0;
  const validUntil = new Date();
  if (isLifetime) {
    validUntil.setFullYear(2099, 11, 31); // Dec 31 2099 represents lifetime access
  } else {
    validUntil.setDate(validUntil.getDate() + (course.validityDays || 365));
  }

  const isEnabled = accessStatus === 'enabled';

  return Enrollment.findOneAndUpdate(
    { userId, courseId: course._id },
    {
      validUntil,
      purchasedAt: new Date(),
      isActive: accessStatus !== 'suspended',
      accessApproved: isEnabled,
      accessStatus,
      $setOnInsert: { progress: { completedVideos: [], videoProgress: {} } },
    },
    { upsert: true, new: true }
  );
};

export const resolveCourseForLead = async (lead) => {
  if (lead.courseId) {
    const course = await Course.findById(lead.courseId);
    if (course) return course;
  }

  if (lead.courseName) {
    const course = await Course.findOne({
      title: { $regex: new RegExp(`^${lead.courseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      courseType: 'Recorded',
    });
    if (course) return course;
  }

  throw new Error('Course not found for this enquiry. Link a recorded course before confirming access.');
};

export const confirmLeadCourseAccess = async (leadId, { amount, note } = {}) => {
  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new Error('Lead not found');
  }

  const leadType = String(lead.type || '').toLowerCase();
  if (!['recorded-course', 'course-inquiry'].includes(leadType)) {
    throw new Error('Only recorded course enquiries can be confirmed from here.');
  }

  const course = await resolveCourseForLead(lead);
  const { user, generatedPassword, studentCreated } = await ensureStudentUser({
    name: lead.name,
    email: lead.email,
    mobile: lead.phone,
  });

  const existingEnrollment = await Enrollment.findOne({ userId: user._id, courseId: course._id });
  if (existingEnrollment && resolveAccessStatus(existingEnrollment) === 'enabled') {
    throw new Error('This student already has enabled access for this course.');
  }

  const orderAmount = Number.isFinite(Number(amount))
    ? Number(amount)
    : Number(lead.amount || lead.quotedAmount || course.price || 0);

  await Order.create({
    userId: user._id,
    courseId: course._id,
    provider: 'external',
    paymentStatus: 'completed',
    amount: orderAmount,
    originalAmount: course.price || orderAmount,
    guestDetails: {
      name: lead.name,
      email: lead.email,
      mobile: lead.phone,
    },
  });

  const enrollment = await upsertEnrollment({
    userId: user._id,
    course,
    accessStatus: 'enabled',
  });

  const credentialResult = await sendStudentCredentials({
    user,
    courseTitle: course.title,
    generatedPassword,
    forceNewPassword: !studentCreated,
  });

  lead.paymentStatus = 'PAID';
  lead.status = 'Recorded Course Lead - Paid (External)';
  lead.courseId = course._id;
  lead.courseName = course.title;
  lead.courseType = 'Recorded';
  lead.amount = orderAmount;
  lead.paymentFor = 'Recorded Course';
  if (note) {
    lead.message = `${lead.message || ''}${lead.message ? '\n' : ''}Admin note: ${note}`;
  }
  await lead.save();

  return {
    user,
    course,
    enrollment,
    credentialsEmailed: credentialResult.emailed,
    studentCreated,
  };
};

export const applyEnrollmentAccessAction = async (enrollmentId, action, { sendCredentials = true } = {}) => {
  if (!ACCESS_ACTIONS.includes(action)) {
    throw new Error('Invalid access action. Use enable, disable, or suspend.');
  }

  const enrollment = await Enrollment.findById(enrollmentId).populate('courseId', 'title validityDays');
  if (!enrollment) {
    const err = new Error('Enrollment not found — it may have been deleted. Refresh the page to see the latest data.');
    err.statusCode = 404;
    throw err;
  }

  const user = await User.findById(enrollment.userId);
  if (!user) {
    const err = new Error('Student account not found for this enrollment — the user account may have been deleted.');
    err.statusCode = 404;
    throw err;
  }

  let credentialsEmailed = false;

  if (action === 'enable') {
    enrollment.isActive = true;
    enrollment.accessApproved = true;
    enrollment.accessStatus = 'enabled';
    await enrollment.save();

    if (sendCredentials) {
      const result = await sendStudentCredentials({
        user,
        courseTitle: enrollment.courseId?.title || 'your course',
        forceNewPassword: true,
      });
      credentialsEmailed = result.emailed;
    }
  } else if (action === 'disable') {
    enrollment.isActive = true;
    enrollment.accessApproved = false;
    enrollment.accessStatus = 'disabled';
    await enrollment.save();
  } else if (action === 'suspend') {
    enrollment.isActive = false;
    enrollment.accessApproved = false;
    enrollment.accessStatus = 'suspended';
    await enrollment.save();
  }

  return {
    enrollment,
    accessStatus: resolveAccessStatus(enrollment),
    credentialsEmailed,
  };
};

export const buildCourseAccessRows = async () => {
  const [enrollments, leads, orders] = await Promise.all([
    Enrollment.find()
      .populate('userId', 'name email mobile')
      .populate('courseId', 'title price courseType')
      .sort('-purchasedAt')
      .lean(),
    Lead.find({
      type: { $in: ['Recorded-Course', 'Course-Inquiry'] },
    })
      .sort('-submittedAt -createdAt')
      .lean(),
    Order.find()
      .populate('userId', 'name email mobile')
      .populate('courseId', 'title price')
      .sort('-createdAt')
      .lean(),
  ]);

  const enrollmentByKey = new Map(
    enrollments.map((e) => [`${e.userId?._id || e.userId}:${e.courseId?._id || e.courseId}`, e])
  );

  const usersByEmail = new Map();
  const emails = [
    ...leads.map((l) => String(l.email || '').toLowerCase()),
    ...enrollments.map((e) => String(e.userId?.email || '').toLowerCase()),
  ].filter(Boolean);

  if (emails.length) {
    const users = await User.find({ email: { $in: [...new Set(emails)] } }).lean();
    users.forEach((u) => usersByEmail.set(u.email.toLowerCase(), u));
  }

  const orderByKey = new Map();
  orders.forEach((order) => {
    const userKey = order.userId?._id || order.guestDetails?.email;
    const courseKey = order.courseId?._id;
    if (!courseKey) return;
    const key = `${userKey}:${courseKey}`;
    if (!orderByKey.has(key)) orderByKey.set(key, order);
  });

  const rows = [];
  const seenLeadKeys = new Set();

  for (const enrollment of enrollments) {
    const userId = enrollment.userId?._id || enrollment.userId;
    const courseId = enrollment.courseId?._id || enrollment.courseId;
    const key = `${userId}:${courseId}`;
    const order = orderByKey.get(key) || null;
    const accessStatus = resolveAccessStatus(enrollment);

    rows.push({
      rowId: `enrollment:${enrollment._id}`,
      source: 'enrollment',
      enrollmentId: enrollment._id,
      leadId: null,
      orderId: order?._id || null,
      userId,
      studentName: enrollment.userId?.name || order?.guestDetails?.name || 'Student',
      email: enrollment.userId?.email || order?.guestDetails?.email || '',
      phone: enrollment.userId?.mobile || order?.guestDetails?.mobile || '',
      courseId,
      courseTitle: enrollment.courseId?.title || order?.courseId?.title || 'Unknown course',
      amount: order?.amount ?? enrollment.courseId?.price ?? null,
      paymentStatus: order ? mapPaymentStatus(order.paymentStatus) : 'CONFIRMED',
      paymentSource: order?.provider === 'external' ? 'external' : order ? 'razorpay' : 'manual',
      accessStatus,
      createdAt: enrollment.purchasedAt || order?.createdAt || enrollment.createdAt,
    });

    const email = String(enrollment.userId?.email || '').toLowerCase();
    if (email && courseId) seenLeadKeys.add(`${email}:${courseId}`);
  }

  for (const lead of leads) {
    const email = String(lead.email || '').toLowerCase();
    const courseId = lead.courseId ? String(lead.courseId) : '';
    const dedupeKey = courseId ? `${email}:${courseId}` : `${email}:${lead.courseName || ''}`;
    if (seenLeadKeys.has(dedupeKey)) continue;

    const user = usersByEmail.get(email);
    if (user && lead.courseId) {
      const existing = enrollmentByKey.get(`${user._id}:${lead.courseId}`);
      if (existing) continue;
    }

    const paid = ['paid', 'completed'].includes(String(lead.paymentStatus || '').toLowerCase());
    if (paid && user && lead.courseId && enrollmentByKey.has(`${user._id}:${lead.courseId}`)) {
      continue;
    }

    rows.push({
      rowId: `lead:${lead._id}`,
      source: 'lead',
      enrollmentId: null,
      leadId: lead._id,
      orderId: null,
      userId: user?._id || null,
      studentName: lead.name || 'Student',
      email: lead.email || '',
      phone: lead.phone || '',
      courseId: lead.courseId || null,
      courseTitle: lead.courseName || 'Recorded course enquiry',
      amount: lead.amount ?? lead.quotedAmount ?? null,
      paymentStatus: paid ? 'PAID' : 'ENQUIRY',
      paymentSource: 'enquiry',
      accessStatus: 'none',
      createdAt: lead.submittedAt || lead.createdAt,
    });
  }

  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return rows;
};

const mapPaymentStatus = (status) => {
  if (status === 'completed') return 'PAID';
  if (status === 'failed') return 'FAILED';
  if (status === 'pending') return 'PENDING';
  return String(status || 'PENDING').toUpperCase();
};
