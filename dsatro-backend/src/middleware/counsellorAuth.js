import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const counsellorAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'counsellor') {
      logger.warn(`Forbidden non-counsellor token from IP: ${req.ip}`);
      return res.status(403).json({ success: false, message: 'Forbidden: Counsellor access required' });
    }
    req.counsellor = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};
