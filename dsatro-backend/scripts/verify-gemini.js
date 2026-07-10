/**
 * Manual Gemini connection test — run without starting the full server.
 *
 *   cd backend
 *   npm run verify:gemini
 */
import '../src/config/env.js';
import { checkGeminiConnection, logGeminiStatus } from '../src/services/llmReadingService.js';

const result = await checkGeminiConnection();
logGeminiStatus(result);
process.exit(result.ok ? 0 : 1);
