/**
 * Vercel Serverless Entry Point
 *
 * Vercel invokes this file for every request to the backend service.
 * Exporting the Express app as default — Vercel's Node.js runtime handles
 * the HTTP lifecycle. Never call app.listen() in serverless environments.
 */
import app from '../src/app.js';

export default app;
