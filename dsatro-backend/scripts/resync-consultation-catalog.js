/**
 * Pushes src/data/consultationCatalog.js into MongoDB — upserts every category/service
 * by slug so admin-panel edits to fields not present in the static file are preserved.
 *
 *   cd backend
 *   npm run resync:consultations
 */
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import '../src/config/env.js';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { syncCatalogFromStatic } from '../src/services/consultationCatalogDb.js';

await connectDB({ required: true });
const result = await syncCatalogFromStatic();
console.log('Consultation catalog resynced:', result);
await mongoose.disconnect();
process.exit(0);
