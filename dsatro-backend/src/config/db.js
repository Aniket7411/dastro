import mongoose from 'mongoose';
import logger from './logger.js';

const startupUri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log("Mongo URI exists:", !!startupUri);

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 15_000,
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDbStatus = () => (isDbConnected() ? 'connected' : 'disconnected');

/**
 * Connect to MongoDB. Safe to call multiple times — no-ops when already connected.
 * @param {{ required?: boolean }} options — if true, throws on failure (default false)
 */
export const connectDB = async ({ required = false } = {}) => {
  if (isDbConnected()) return;

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri?.trim()) {
    const msg = 'MONGO_URI (or MONGODB_URI) is not defined in environment variables';
    logger.error(`❌ ${msg}`);
    if (required) throw new Error(msg);
    return;
  }

  try {
    await mongoose.connect(uri.trim(), MONGO_OPTIONS);
    logger.info('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.log("========== MONGO ERROR ==========");
    console.log("Name:", err.name);
    console.log("Message:", err.message);
    console.log("Stack:", err.stack);
    console.log(err);

    throw err;
  }
};
