import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Astrologer from '../models/Astrologer.js';
import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import LiveSettings from '../models/LiveSettings.js';
import logger from '../config/logger.js';

const JWT_SECRET  = process.env.JWT_SECRET || 'astro-admin-secret-2026';
const JWT_EXPIRES = '7d';

const signToken = (a) =>
  jwt.sign({ id: a._id, email: a.email, name: a.name, role: 'astrologer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const safeAstrologer = (a) => {
  const obj = a.toObject ? a.toObject() : { ...a };
  delete obj.passwordHash;
  return obj;
};

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

export const getAstrologers = async (req, res) => {
  try {
    const { specialty, search, language } = req.query;
    const query = { isActive: true, isSuspended: false };

    if (specialty && specialty !== 'All') query.specialties = { $regex: new RegExp(specialty, 'i') };
    if (language)                           query.languages  = { $regex: new RegExp(language, 'i') };
    if (search) {
      const r = new RegExp(search.trim(), 'i');
      query.$or = [{ name: r }, { specialties: r }, { role: r }, { languages: r }];
    }

    const astrologers = await Astrologer
      .find(query)
      .select('-passwordHash -suspendedReason')
      .sort({ isOnline: -1, order: 1, createdAt: 1 });

    const allForTags = (specialty || search)
      ? await Astrologer.find({ isActive: true, isSuspended: false }).select('specialties')
      : astrologers;
    const tagSet = new Set();
    allForTags.forEach((a) => (a.specialties || []).forEach((s) => s && tagSet.add(s.trim())));

    const settings = (await LiveSettings.findOne().lean()) || { freeMinutes: 3, chatEnabled: true };

    res.json({ success: true, astrologers, tags: [...tagSet].sort(), settings });
  } catch (err) {
    logger.error('getAstrologers error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ASTROLOGER AUTH ─────────────────────────────────────────────────────────

export const loginAstrologer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const a = await Astrologer.findOne({ email: email.toLowerCase().trim() });
    if (!a)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (a.isSuspended)
      return res.status(403).json({
        success: false,
        message: `Account suspended${a.suspendedReason ? ': ' + a.suspendedReason : '. Contact admin.'}`,
      });

    if (!a.isActive)
      return res.status(403).json({ success: false, message: 'Account is inactive. Contact admin.' });

    const ok = await bcrypt.compare(password, a.passwordHash);
    if (!ok)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = signToken(a);
    logger.info(`Astrologer login: ${a.email}`);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      astrologer: {
        id: a._id, name: a.name, email: a.email,
        role: a.role, image: a.image,
        isOnline: a.isOnline, specialties: a.specialties,
      },
    });
  } catch (err) {
    logger.error('loginAstrologer error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const a = await Astrologer.findById(req.astrologer.id).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });

    const settings = (await LiveSettings.findOne().lean()) || { freeMinutes: 3, chatEnabled: true };
    const activeSessions = await ChatSession.countDocuments({ astrologerId: a._id, status: 'active' });
    res.json({ success: true, astrologer: a, settings, activeSessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const update = { isOnline: !!isOnline };
    if (isOnline) update.onlineAt = new Date();

    const a = await Astrologer.findByIdAndUpdate(req.astrologer.id, update, { new: true }).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });

    res.json({
      success: true,
      message: isOnline ? 'You are now online and visible to users' : 'You are now offline',
      astrologer: a,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both current and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const a = await Astrologer.findById(req.astrologer.id);
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });

    const ok = await bcrypt.compare(currentPassword, a.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    a.passwordHash = await bcrypt.hash(newPassword, 12);
    await a.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = { astrologerId: req.astrologer.id };
    if (status) query.status = status;

    const total = await ChatSession.countDocuments(query);
    const sessions = await ChatSession.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, sessions, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN — ASTROLOGER CRUD ─────────────────────────────────────────────────

export const getAdminAstrologers = async (req, res) => {
  try {
    const astrologers = await Astrologer.find().select('-passwordHash').sort({ order: 1, createdAt: 1 });
    res.json({ success: true, astrologers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAstrologer = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!rest.email)
      return res.status(400).json({ success: false, message: 'Email is required for astrologer login' });
    if (!password)
      return res.status(400).json({ success: false, message: 'Initial password is required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const exists = await Astrologer.findOne({ email: rest.email.toLowerCase().trim() });
    if (exists)
      return res.status(409).json({ success: false, message: 'An astrologer with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const a = await Astrologer.create({ ...rest, email: rest.email.toLowerCase().trim(), passwordHash });

    logger.info(`Admin created astrologer: ${a.email}`);
    res.status(201).json({ success: true, message: 'Astrologer created successfully', astrologer: safeAstrologer(a) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateAstrologer = async (req, res) => {
  try {
    // Never allow password update through this route — use resetAstrologerPassword
    const { password, passwordHash, ...rest } = req.body;
    if (rest.email) rest.email = rest.email.toLowerCase().trim();

    const a = await Astrologer.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true }).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });
    res.json({ success: true, message: 'Astrologer updated', astrologer: a });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAstrologer = async (req, res) => {
  try {
    const a = await Astrologer.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });
    res.json({ success: true, message: `${a.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const suspendAstrologer = async (req, res) => {
  try {
    const { reason } = req.body;
    const a = await Astrologer.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true, isOnline: false, suspendedReason: reason || '' },
      { new: true }
    ).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });
    res.json({ success: true, message: `${a.name} has been suspended`, astrologer: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unsuspendAstrologer = async (req, res) => {
  try {
    const a = await Astrologer.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false, suspendedReason: '' },
      { new: true }
    ).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });
    res.json({ success: true, message: `${a.name} has been unsuspended`, astrologer: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setAstrologerLiveStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    const existing = await Astrologer.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Astrologer not found' });

    if (isOnline && existing.isSuspended) {
      return res.status(400).json({ success: false, message: 'Cannot bring a suspended astrologer online. Unsuspend first.' });
    }

    const update = { isOnline: !!isOnline };
    if (isOnline) update.onlineAt = new Date();

    const a = await Astrologer.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    res.json({
      success: true,
      message: isOnline ? `${a.name} is now live and visible to users` : `${a.name} is now offline`,
      astrologer: a,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetAstrologerPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const a = await Astrologer.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true }).select('-passwordHash');
    if (!a) return res.status(404).json({ success: false, message: 'Astrologer not found' });

    logger.info(`Admin reset password for astrologer: ${a.email}`);
    res.json({ success: true, message: `Password reset for ${a.name}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN — LIVE SETTINGS ───────────────────────────────────────────────────

export const getLiveSettings = async (req, res) => {
  try {
    let s = await LiveSettings.findOne();
    if (!s) s = await LiveSettings.create({});
    res.json({ success: true, settings: s });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLiveSettings = async (req, res) => {
  try {
    const allowed = ['freeMinutes', 'isPaymentEnforced', 'chatEnabled', 'maxConcurrentUsersPerAstrologer'];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    let s = await LiveSettings.findOne();
    if (!s) {
      s = await LiveSettings.create(update);
    } else {
      Object.assign(s, update);
      await s.save();
    }
    res.json({ success: true, message: 'Live settings updated', settings: s });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMIN — SESSION LOGS ────────────────────────────────────────────────────

export const getSessionLogs = async (req, res) => {
  try {
    const { page = 1, limit = 30, astrologerId, status } = req.query;
    const query = {};
    if (astrologerId) query.astrologerId = astrologerId;
    if (status)       query.status = status;

    const total = await ChatSession.countDocuments(query);
    const sessions = await ChatSession.find(query)
      .populate('astrologerId', 'name image role email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, sessions, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 })
      .limit(500);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
