import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import exceljs from 'exceljs';
import Counsellor from '../models/Counsellor.js';
import FreeConsultationLead from '../models/FreeConsultationLead.js';
import { generatePreliminaryReading } from '../services/llmReadingService.js';
import astrologyService from '../services/astrologyService.js';
import { getAgeDetailFromDob, formatLeadAge } from '../utils/sunSignFromDob.js';
import logger from '../config/logger.js';
import {
  formatEmailError,
  sendCounsellorPasswordResetEmail,
  sendCounsellorWelcomeEmail,
  sendPasswordChangedEmail,
} from '../utils/sendEmail.js';
import { validateNewPassword } from '../utils/passwordValidation.js';

const JWT_SECRET = () => process.env.JWT_SECRET || 'astro-admin-secret-2026';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const leadSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.string().pattern(MOBILE_PATTERN).required(),
  whatsapp: Joi.string().pattern(MOBILE_PATTERN).required(),
  sameWhatsappAsMobile: Joi.boolean().default(false),
  age: Joi.number().integer().min(0).max(120).optional(),
  ageMonths: Joi.number().integer().min(0).max(11).optional(),
  ageDisplay: Joi.string().max(50).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  dob: Joi.string().required(),
  tob: Joi.string().allow('', null),
  tobUnknown: Joi.boolean().default(false),
  pob: Joi.string().min(2).max(200).required(),
  pobLat: Joi.number().min(-90).max(90).optional(),
  pobLon: Joi.number().min(-180).max(180).optional(),
  maritalStatus: Joi.string().valid('Single', 'Married', 'Other').required(),
  reasonForCalling: Joi.string().min(3).max(500).required(),
  consent: Joi.boolean().valid(true).required(),
});

const createCounsellorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(MOBILE_PATTERN).allow('', null),
  password: Joi.string().min(6).optional(),
  sendEmail: Joi.boolean().default(true),
});

const updateCounsellorSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  mobile: Joi.string().pattern(MOBILE_PATTERN).allow('', null),
}).min(1);

const counsellorPublicFields = '-passwordHash -resetPasswordOTP -resetPasswordExpires';

export async function ensureBootstrapCounsellor() {
  const count = await Counsellor.countDocuments();
  if (count > 0) return;

  const email = process.env.COUNSELLOR_BOOTSTRAP_EMAIL;
  const password = process.env.COUNSELLOR_BOOTSTRAP_PASSWORD;
  const name = process.env.COUNSELLOR_BOOTSTRAP_NAME || 'Counsellor';

  if (!email || !password) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Counsellor.create({ name, email: email.toLowerCase(), passwordHash, active: true });
  logger.info(`Bootstrap counsellor created: ${email}`);
}

export const counsellorLogin = asyncHandler(async (req, res) => {
  await ensureBootstrapCounsellor();

  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const counsellor = await Counsellor.findOne({ email: value.email.toLowerCase() });
  if (!counsellor) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!counsellor.active) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been suspended. Please contact the admin.',
    });
  }

  const match = await bcrypt.compare(value.password, counsellor.passwordHash);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: counsellor._id, email: counsellor.email, name: counsellor.name, role: 'counsellor' },
    JWT_SECRET(),
    { expiresIn: '12h' },
  );

  res.json({
    success: true,
    token,
    counsellor: {
      id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      mobile: counsellor.mobile || '',
    },
  });
});

export const counsellorForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const counsellor = await Counsellor.findOne({ email: email.toLowerCase().trim() });
  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Email not registered' });
  }

  if (!counsellor.active) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been suspended. Please contact the admin.',
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  counsellor.resetPasswordOTP = otp;
  counsellor.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await counsellor.save();

  try {
    await sendCounsellorPasswordResetEmail(counsellor.email, counsellor.name, otp);
  } catch (emailError) {
    const emailFailure = formatEmailError(emailError);
    logger.error('Counsellor password reset email failed:', emailFailure);
    return res.status(503).json({ success: false, ...emailFailure });
  }

  res.json({ success: true, message: 'Password reset email sent' });
});

export const counsellorResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, token, newPassword } = req.body;
  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const resetToken = String(token || otp || '').trim();
  if (!email || !resetToken) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const counsellor = await Counsellor.findOne({ email: email.toLowerCase().trim() });
  if (!counsellor) {
    return res.status(400).json({ success: false, message: 'Invalid OTP or email' });
  }

  if (!counsellor.resetPasswordOTP || counsellor.resetPasswordOTP !== resetToken) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
  }

  if (!counsellor.resetPasswordExpires || Date.now() > counsellor.resetPasswordExpires) {
    return res.status(400).json({
      success: false,
      message: 'OTP has expired. Please request a new one.',
    });
  }

  counsellor.passwordHash = await bcrypt.hash(newPassword, 10);
  counsellor.resetPasswordOTP = undefined;
  counsellor.resetPasswordExpires = undefined;
  await counsellor.save();

  try {
    await sendPasswordChangedEmail(counsellor.email, counsellor.name);
  } catch (emailError) {
    logger.warn('Counsellor password changed notification failed:', emailError.message);
  }

  res.json({ success: true, message: 'Password has been successfully reset. You can now login.' });
});

export const createCounsellor = asyncHandler(async (req, res) => {
  const { error, value } = createCounsellorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const normalizedEmail = value.email.toLowerCase();
  const exists = await Counsellor.findOne({ email: normalizedEmail });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Counsellor email already exists' });
  }

  const plainPassword = value.password || generateTempPassword();
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  const counsellor = await Counsellor.create({
    name: value.name.trim(),
    email: normalizedEmail,
    mobile: value.mobile ? String(value.mobile).trim() : '',
    passwordHash,
    active: true,
  });

  let emailSent = false;
  if (value.sendEmail !== false) {
    try {
      await sendCounsellorWelcomeEmail(counsellor.email, counsellor.name, plainPassword);
      emailSent = true;
    } catch (emailError) {
      logger.warn('Counsellor welcome email failed:', formatEmailError(emailError));
    }
  }

  res.status(201).json({
    success: true,
    emailSent,
    temporaryPassword: plainPassword,
    counsellor: {
      id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      mobile: counsellor.mobile || '',
      active: counsellor.active,
      createdAt: counsellor.createdAt,
    },
  });
});

export const listCounsellors = asyncHandler(async (req, res) => {
  const counsellors = await Counsellor.find()
    .select(counsellorPublicFields)
    .sort({ name: 1 });
  res.json({ success: true, counsellors });
});

export const updateCounsellor = asyncHandler(async (req, res) => {
  const { error, value } = updateCounsellorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const counsellor = await Counsellor.findById(req.params.id);
  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Counsellor not found' });
  }

  if (value.email) {
    const normalizedEmail = value.email.toLowerCase();
    const duplicate = await Counsellor.findOne({
      email: normalizedEmail,
      _id: { $ne: counsellor._id },
    });
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'Counsellor email already exists' });
    }
    counsellor.email = normalizedEmail;
  }

  if (value.name) counsellor.name = value.name.trim();
  if (value.mobile !== undefined) counsellor.mobile = value.mobile ? String(value.mobile).trim() : '';

  await counsellor.save();

  res.json({
    success: true,
    message: 'Counsellor updated',
    counsellor: {
      id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      mobile: counsellor.mobile || '',
      active: counsellor.active,
      createdAt: counsellor.createdAt,
      updatedAt: counsellor.updatedAt,
    },
  });
});

export const suspendCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  ).select(counsellorPublicFields);

  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Counsellor not found' });
  }

  res.json({ success: true, message: `${counsellor.name} has been suspended`, counsellor });
});

export const unsuspendCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true },
  ).select(counsellorPublicFields);

  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Counsellor not found' });
  }

  res.json({ success: true, message: `${counsellor.name} has been reactivated`, counsellor });
});

export const deleteCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findByIdAndDelete(req.params.id);
  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Counsellor not found' });
  }

  res.json({ success: true, message: `${counsellor.name} deleted successfully` });
});

export const resetCounsellorPassword = asyncHandler(async (req, res) => {
  const { newPassword, sendEmail } = req.body;
  const counsellor = await Counsellor.findById(req.params.id);
  if (!counsellor) {
    return res.status(404).json({ success: false, message: 'Counsellor not found' });
  }

  const plainPassword = newPassword && newPassword.length >= 6 ? newPassword : generateTempPassword();
  counsellor.passwordHash = await bcrypt.hash(plainPassword, 10);
  counsellor.resetPasswordOTP = undefined;
  counsellor.resetPasswordExpires = undefined;
  await counsellor.save();

  let emailSent = false;
  if (sendEmail !== false) {
    try {
      await sendCounsellorWelcomeEmail(counsellor.email, counsellor.name, plainPassword);
      emailSent = true;
    } catch (emailError) {
      logger.warn('Counsellor reset password email failed:', formatEmailError(emailError));
    }
  }

  logger.info(`Admin reset password for counsellor: ${counsellor.email}`);
  res.json({
    success: true,
    message: `Password reset for ${counsellor.name}`,
    emailSent,
    temporaryPassword: plainPassword,
    counsellor: {
      id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      mobile: counsellor.mobile || '',
      active: counsellor.active,
    },
  });
});

export const submitFreeConsultationLead = asyncHandler(async (req, res) => {
  const { error, value } = leadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const ageDetail = getAgeDetailFromDob(value.dob);
  if (!ageDetail.valid) {
    return res.status(400).json({ success: false, message: 'Enter a valid date of birth (cannot be in the future)' });
  }

  const age = value.age ?? ageDetail.years;
  const ageMonths = ageDetail.years === 0 ? (value.ageMonths ?? ageDetail.months ?? 0) : undefined;
  const ageDisplay = value.ageDisplay || ageDetail.display;

  const contactedAt = new Date();
  const leadDoc = await FreeConsultationLead.create({
    ...value,
    age,
    ageMonths,
    ageDisplay,
    tob: value.tobUnknown ? '' : (value.tob || ''),
    counsellorId: req.counsellor.id,
    counsellorName: req.counsellor.name,
    counsellorEmail: req.counsellor.email || '',
    submittedAt: contactedAt,
  });

  const facts = await astrologyService.getVerifiedFacts(value);
  const reading = await generatePreliminaryReading(value, facts);

  leadDoc.reading = reading;
  leadDoc.aiError = reading.aiError || '';
  await leadDoc.save();

  res.status(201).json({
    success: true,
    leadId: leadDoc._id,
    lead: {
      _id: leadDoc._id,
      name: leadDoc.name,
      mobile: leadDoc.mobile,
      dob: leadDoc.dob,
      tob: leadDoc.tob,
      tobUnknown: leadDoc.tobUnknown,
      pob: leadDoc.pob,
      age: leadDoc.age,
      ageMonths: leadDoc.ageMonths,
      ageDisplay: leadDoc.ageDisplay,
      gender: leadDoc.gender,
      reasonForCalling: leadDoc.reasonForCalling,
      counsellorName: leadDoc.counsellorName,
      counsellorEmail: leadDoc.counsellorEmail,
      submittedAt: leadDoc.submittedAt,
    },
    reading: {
      luckyNumber: reading.luckyNumber,
      luckyColour: reading.luckyColour,
      luckyColourHi: reading.luckyColourHi,
      nature: reading.nature,
      natureEn: reading.natureEn,
      natureHi: reading.natureHi,
      currentPhase: reading.currentPhase,
      currentPhaseEn: reading.currentPhaseEn,
      currentPhaseHi: reading.currentPhaseHi,
      fullChartReveal: reading.fullChartReveal,
      fullChartRevealEn: reading.fullChartRevealEn,
      fullChartRevealHi: reading.fullChartRevealHi,
      sunSign: reading.sunSign,
      rashiHi: reading.rashiHi,
      moonSign: reading.moonSign,
      nakshatra: reading.nakshatra,
      mahadashaPlanet: reading.mahadashaPlanet,
      mahadashaPlanetHi: reading.mahadashaPlanetHi,
      source: reading.source,
    },
    usedFallback: reading.source !== 'ai',
  });
});

export const listCounsellorLeads = asyncHandler(async (req, res) => {
  const { search, startDate, endDate, limit = '50' } = req.query;
  const filter = { counsellorId: req.counsellor.id };

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.submittedAt = { $gte: start, $lte: end };
  }

  if (search?.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ name: regex }, { mobile: regex }, { whatsapp: regex }];
  }

  const max = Math.min(parseInt(limit, 10) || 50, 200);
  const leads = await FreeConsultationLead.find(filter)
    .sort({ submittedAt: -1 })
    .limit(max)
    .lean();

  res.json({ success: true, leads, count: leads.length });
});

export const getCounsellorLead = asyncHandler(async (req, res) => {
  const lead = await FreeConsultationLead.findOne({
    _id: req.params.id,
    counsellorId: req.counsellor.id,
  }).lean();

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Call record not found' });
  }

  res.json({ success: true, lead });
});

export const listFreeConsultationLeads = asyncHandler(async (req, res) => {
  const { startDate, endDate, counsellorId, search, limit = '100' } = req.query;
  const filter = {};

  if (counsellorId) filter.counsellorId = counsellorId;

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.submittedAt = { $gte: start, $lte: end };
  }

  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { mobile: regex }, { whatsapp: regex }];
  }

  const leads = await FreeConsultationLead.find(filter)
    .sort({ submittedAt: -1 })
    .limit(Math.min(parseInt(limit, 10) || 100, 500))
    .lean();

  res.json({ success: true, leads });
});

export const exportNeoDoveLeads = asyncHandler(async (req, res) => {
  const { startDate, endDate, counsellorId } = req.query;
  const filter = {};

  if (counsellorId) filter.counsellorId = counsellorId;
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.submittedAt = { $gte: start, $lte: end };
  }

  const leads = await FreeConsultationLead.find(filter).sort({ submittedAt: -1 });

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('NeoDove Import');

  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Mobile Number', key: 'mobile', width: 16 },
    { header: 'Alternate/WhatsApp', key: 'whatsapp', width: 16 },
    { header: 'Lead Source', key: 'leadSource', width: 28 },
    { header: 'Notes / Remarks', key: 'notes', width: 60 },
    { header: 'Owner / Agent', key: 'owner', width: 22 },
    { header: 'Status', key: 'status', width: 12 },
  ];

  leads.forEach((lead) => {
    const contactTime = lead.submittedAt
      ? new Date(lead.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      : '—';
    const notes = [
      `Contact: ${contactTime} IST`,
      `Counsellor: ${lead.counsellorName}${lead.counsellorEmail ? ` (${lead.counsellorEmail})` : ''}`,
      `Age: ${formatLeadAge(lead)}`,
      `Gender: ${lead.gender}`,
      `DOB: ${lead.dob}`,
      `TOB: ${lead.tobUnknown ? 'Unknown' : (lead.tob || '—')}`,
      `Place: ${lead.pob}`,
      `Marital: ${lead.maritalStatus}`,
      `Reason: ${lead.reasonForCalling}`,
    ].join(' | ');

    worksheet.addRow({
      name: lead.name,
      mobile: lead.mobile,
      whatsapp: lead.whatsapp,
      leadSource: 'Free Consultation – Social',
      notes,
      owner: lead.counsellorName,
      status: lead.neoDoveStatus || 'New',
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=neodove_free_consultation_${Date.now()}.xlsx`,
  );

  await workbook.xlsx.write(res);
  res.end();
});
