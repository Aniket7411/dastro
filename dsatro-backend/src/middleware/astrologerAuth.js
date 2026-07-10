import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const astrologerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'astrologer') {
      logger.warn(`Non-astrologer tried astrologer route: ${decoded.email}`);
      return res.status(403).json({ success: false, message: 'Forbidden: Astrologer access required' });
    }
    req.astrologer = decoded;
    next();
  } catch (err) {
    logger.warn(`Invalid astrologer JWT from IP: ${req.ip}`);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};
