import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './src/app.js';
import dns from 'dns';
import logger from './src/config/logger.js';
import './src/config/env.js';
import { connectDB } from './src/config/db.js';

// Some ISP/router/VPN DNS servers fail to resolve mongodb+srv SRV records.
// Force Node's resolver to a public DNS that supports them.
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { checkBunnyConnection } from './src/utils/bunnyHelper.js';
import { getRazorpayConfig } from './src/utils/razorpayConfig.js';
import { checkSupabaseConnection } from './src/utils/supabaseStorage.js';
import { checkGeminiConnection, logGeminiStatus } from './src/services/llmReadingService.js';
import { logAstrologyApiConfigured } from './src/services/astrologyApiClient.js';
import ChatSession from './src/models/ChatSession.js';
import ChatMessage from './src/models/ChatMessage.js';
import Astrologer from './src/models/Astrologer.js';
import LiveSettings from './src/models/LiveSettings.js';
import { startExpiryReminderCron } from './src/jobs/expiryReminderCron.js';

const PORT      = process.env.PORT || 5000;

// ── HTTP + Socket.io ─────────────────────────────────────────────────────────
const httpServer = createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

const io = new SocketIO(httpServer, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
        cb(null, true);
      } else {
        cb(new Error('Socket: CORS not allowed'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Future scale-out: swap transports + add Redis adapter
  // adapter: createAdapter(pubClient, subClient),
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ── Socket.io — Live Chat ────────────────────────────────────────────────────
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // ── USER: start a session ──────────────────────────────────────────────────
  socket.on('user:join', async ({ astrologerId, userName, userEmail, userPhone }) => {
    try {
      await connectDB();

      const astrologer = await Astrologer.findById(astrologerId).select('-passwordHash');
      if (!astrologer || !astrologer.isOnline || astrologer.isSuspended) {
        socket.emit('error', { message: 'Astrologer is not available right now' });
        return;
      }

      const settings = (await LiveSettings.findOne().lean()) || { freeMinutes: 3, chatEnabled: true };
      if (!settings.chatEnabled) {
        socket.emit('error', { message: 'Live chat is currently disabled' });
        return;
      }

      const freeMinutes = astrologer.freeMinutesOverride ?? settings.freeMinutes ?? 3;

      const session = await ChatSession.create({
        astrologerId,
        userName: userName || 'User',
        userEmail: userEmail || '',
        userPhone: userPhone || '',
        freeMinutesAllotted: freeMinutes,
        status: 'active',
        startedAt: new Date(),
      });

      socket.join(`session:${session._id}`);
      socket.data.sessionId  = session._id.toString();
      socket.data.role       = 'user';
      socket.data.name       = userName || 'User';

      // Notify astrologer's personal room
      io.to(`astrologer:${astrologerId}`).emit('astrologer:new_session', {
        sessionId: session._id,
        userName: session.userName,
        userEmail: session.userEmail,
      });

      // System message
      const sysMsg = await ChatMessage.create({
        sessionId: session._id,
        senderRole: 'system',
        senderName: 'System',
        content: `Chat started. You have ${freeMinutes} free minute${freeMinutes === 1 ? '' : 's'}.`,
      });

      socket.emit('session:started', {
        sessionId: session._id,
        astrologer: { name: astrologer.name, image: astrologer.image, role: astrologer.role },
        freeMinutes,
        systemMessage: sysMsg,
      });

      // Free-time countdown — warn at 1 minute left, expire at 0
      if (freeMinutes > 0) {
        const warnMs   = Math.max((freeMinutes - 1) * 60 * 1000, 0);
        const expireMs = freeMinutes * 60 * 1000;

        if (warnMs > 0) {
          setTimeout(() => {
            io.to(`session:${session._id}`).emit('session:free_time_warning', { minutesLeft: 1 });
          }, warnMs);
        }

        setTimeout(async () => {
          const live = await ChatSession.findById(session._id);
          if (!live || live.status !== 'active') return;

          const expiredMsg = await ChatMessage.create({
            sessionId: session._id,
            senderRole: 'system',
            senderName: 'System',
            content: 'Free time has ended. The session has been closed.',
          });
          io.to(`session:${session._id}`).emit('session:free_time_expired', { systemMessage: expiredMsg });
          await ChatSession.findByIdAndUpdate(session._id, { status: 'ended', endedAt: new Date(), endedBy: 'system' });
          await Astrologer.findByIdAndUpdate(astrologerId, { $inc: { sessionCount: 1 } });
        }, expireMs);
      }

      logger.info(`Session started: ${session._id} | user: ${userName} | astrologer: ${astrologer.name}`);
    } catch (err) {
      logger.error('user:join error:', err.message);
      socket.emit('error', { message: 'Failed to start session. Please try again.' });
    }
  });

  // ── ASTROLOGER: join their personal room ──────────────────────────────────
  socket.on('astrologer:join', ({ astrologerId }) => {
    socket.join(`astrologer:${astrologerId}`);
    socket.data.role         = 'astrologer';
    socket.data.astrologerId = astrologerId;
    logger.info(`Astrologer ${astrologerId} joined their room`);
  });

  // ── ASTROLOGER: join a specific session ───────────────────────────────────
  socket.on('astrologer:join_session', async ({ sessionId, astrologerId, astrologerName }) => {
    try {
      const session = await ChatSession.findById(sessionId);
      if (!session || session.status !== 'active') {
        socket.emit('error', { message: 'Session not found or already ended' });
        return;
      }
      socket.join(`session:${sessionId}`);
      socket.data.sessionId = sessionId;

      // Deliver message history
      const history = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 }).limit(200);
      socket.emit('session:history', { messages: history });

      io.to(`session:${sessionId}`).emit('astrologer:joined', { name: astrologerName || 'Astrologer' });
    } catch (err) {
      socket.emit('error', { message: 'Could not join session' });
    }
  });

  // ── SEND MESSAGE ──────────────────────────────────────────────────────────
  socket.on('chat:send', async ({ sessionId, content, senderRole, senderName }) => {
    try {
      if (!content?.trim()) return;
      const text = content.trim().slice(0, 2000);

      const session = await ChatSession.findById(sessionId);
      if (!session || session.status !== 'active') {
        socket.emit('error', { message: 'Session is no longer active' });
        return;
      }

      const msg = await ChatMessage.create({
        sessionId,
        senderRole: senderRole || 'user',
        senderName: senderName || 'User',
        content: text,
      });

      await ChatSession.findByIdAndUpdate(sessionId, { $inc: { messageCount: 1 } });
      io.to(`session:${sessionId}`).emit('chat:message', msg);
    } catch (err) {
      socket.emit('error', { message: 'Message could not be sent. Please retry.' });
    }
  });

  // ── END SESSION ──────────────────────────────────────────────────────────
  socket.on('session:end', async ({ sessionId, endedBy, astrologerId }) => {
    try {
      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { status: 'ended', endedAt: new Date(), endedBy: endedBy || 'user' },
        { new: true }
      );
      if (!session) return;

      const msg = await ChatMessage.create({
        sessionId,
        senderRole: 'system',
        senderName: 'System',
        content: `Session ended by ${endedBy === 'astrologer' ? 'astrologer' : 'user'}.`,
      });

      io.to(`session:${sessionId}`).emit('session:ended', { systemMessage: msg });
      if (astrologerId) {
        await Astrologer.findByIdAndUpdate(astrologerId, { $inc: { sessionCount: 1 } });
      }
    } catch (err) {
      logger.error('session:end error:', err.message);
    }
  });

  // ── DISCONNECT ────────────────────────────────────────────────────────────
  socket.on('disconnect', async () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    // If astrologer disconnects, mark them offline
    if (socket.data.role === 'astrologer' && socket.data.astrologerId) {
      await Astrologer.findByIdAndUpdate(socket.data.astrologerId, { isOnline: false }).catch(() => {});
    }
  });
});

// Export io so controllers can emit events if needed in the future
export { io };

// ── Start ─────────────────────────────────────────────────────────────────────
const logBunnyConnection = async () => {
  try {
    const { libraryId } = await checkBunnyConnection();
    logger.info(`✅ Bunny.net Stream connected (Library ${libraryId})`);
  } catch (error) {
    logger.error(`❌ Bunny.net Stream not connected: ${error.message}`);
  }
};

const logRazorpayConnection = () => {
  try {
    const { keyId } = getRazorpayConfig();
    const maskedKey = `${keyId.slice(0, 8)}...${keyId.slice(-4)}`;
    logger.info(`Razorpay configured (${maskedKey})`);
  } catch (error) {
    logger.error(`Razorpay not configured: ${error.message}`);
  }
};

const logSupabaseConnection = async () => {
  try {
    const { bucket, uploads } = await checkSupabaseConnection();
    logger.info(`✅ Supabase Storage configured (bucket: ${bucket})`);
    logger.info(`   images → ${uploads.images}, videos → ${uploads.videos}, resumes → ${uploads.resumes}`);
  } catch (error) {
    logger.error(`❌ Supabase Storage not configured: ${error.message}`);
  }
};

const logGeminiConnection = async () => {
  try {
    const result = await checkGeminiConnection();
    logGeminiStatus(result);
  } catch (error) {
    logger.error(`❌ Gemini API check failed: ${error.message}`);
  }
};

const startServer = async () => {
  logger.info('Backend startup: connecting to MongoDB...');

  let dbConnected = false;
  try {
    await connectDB({ required: true });
    dbConnected = true;
  } catch (err) {
    console.error("Database startup failed:", err);
  }

  if (!dbConnected) {
    logger.warn('Starting server WITHOUT database — /health will show disconnected until MONGO_URI is fixed');
  }

  logger.info(`Backend startup: listening on PORT=${PORT}...`);

  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server live on port ${PORT} (HTTP + Socket.io)`);
    logger.info(`Mode: ${process.env.NODE_ENV || 'development'}`);
    logRazorpayConnection();
    logSupabaseConnection();
    logBunnyConnection();
    logGeminiConnection();
    logAstrologyApiConfigured();
  });

  startExpiryReminderCron();
};

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});

startServer();

export default app;
