import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'admin') {
        logger.warn(`Forbidden attempt from non-admin user: ${decoded.email} from IP: ${req.ip}`);
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      }
      req.admin = decoded;
      next();
    } catch (error) {
      logger.warn(`Invalid JWT token attempt from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token'
      });
    }
  } else {
    logger.warn(`Missing Authorization header from IP: ${req.ip}`);
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }
};

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // We can fetch the user from DB if we need full details, but for now we'll just attach decoded payload
      // which has { id, role, email } as we set in login controller.
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Ignore errors for optional auth, user will simply be undefined
    }
  }
  next();
};
