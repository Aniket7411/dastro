import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message = err.message || 'An internal server error occurred';

  logger.error(`[Error Handler] ${err.name || 'Error'}: ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);
  }
  logger.error(`Path: ${req.method} ${req.originalUrl} | IP: ${req.ip}`);

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
