/**
 * Manual astrologyapi.com connection test — run without starting the full server.
 * Makes one real (credit-consuming) lookup to confirm the key works.
 *
 *   cd backend
 *   npm run verify:astrologyapi
 */
import '../src/config/env.js';
import { checkAstrologyApiConnection, logAstrologyApiStatus } from '../src/services/astrologyApiClient.js';

const result = await checkAstrologyApiConnection();
logAstrologyApiStatus(result);
process.exit(result.ok ? 0 : 1);
