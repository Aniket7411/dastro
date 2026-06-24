import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API_BASE from '../utils/api';

const SOCKET_URL = API_BASE; // same origin as API

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function MessageBubble({ msg, userName }) {
  const isUser       = msg.senderRole === 'user';
  const isSystem     = msg.senderRole === 'system';
  const isAstrologer = msg.senderRole === 'astrologer';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{msg.content}</span>
      </div>
    );
  }

  const isMine = isUser;
  return (
    <div className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
          <span className="text-[10px] font-bold text-indigo-600">{msg.senderName?.[0] || 'A'}</span>
        </div>
      )}
      <div className={`max-w-[78%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        {!isMine && <span className="text-[10px] text-slate-400 ml-1">{msg.senderName}</span>}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${isMine
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
          {msg.content}
        </div>
        <span className="text-[10px] text-slate-400 px-1">
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default function LiveSession() {
  const { astrologerId } = useParams();
  const { state }        = useLocation();
  const navigate         = useNavigate();

  const astrologer = state?.astrologer;
  const userInfo   = state?.userInfo;
  const freeMinutes = state?.freeMinutes ?? 3;

  const socketRef    = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef     = useRef(null);

  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [status,     setStatus]     = useState('connecting'); // connecting | active | ended | error
  const [sessionId,  setSessionId]  = useState(null);
  const [errMsg,     setErrMsg]     = useState('');
  const [timerSecs,  setTimerSecs]  = useState(freeMinutes * 60);
  const [timerActive,setTimerActive]= useState(false);
  const [freeExpired,setFreeExpired]= useState(false);
  const [astroJoined,setAstroJoined]= useState(false);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Guard: if navigated directly without state, redirect
  useEffect(() => {
    if (!astrologer || !userInfo) {
      navigate('/live', { replace: true });
    }
  }, []);

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || freeExpired) return;
    if (timerSecs <= 0) return;
    const t = setInterval(() => setTimerSecs((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [timerActive, freeExpired]);

  // ── Socket.io ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!astrologer || !userInfo) return;

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connecting');
      socket.emit('user:join', {
        astrologerId,
        userName:  userInfo.name,
        userEmail: userInfo.email,
        userPhone: userInfo.phone,
      });
    });

    socket.on('session:started', ({ sessionId: sid, systemMessage, freeMinutes: fm }) => {
      setSessionId(sid);
      setStatus('active');
      setTimerSecs(fm * 60);
      setTimerActive(true);
      if (systemMessage) setMessages([systemMessage]);
      setTimeout(() => inputRef.current?.focus(), 100);
    });

    socket.on('astrologer:joined', ({ name }) => {
      setAstroJoined(true);
      setMessages((p) => [...p, {
        _id: Date.now(), senderRole: 'system', senderName: 'System',
        content: `${name} has joined the chat.`, timestamp: new Date(),
      }]);
    });

    socket.on('chat:message', (msg) => {
      setMessages((p) => [...p, msg]);
    });

    socket.on('session:free_time_warning', () => {
      setMessages((p) => [...p, {
        _id: Date.now(), senderRole: 'system', senderName: 'System',
        content: '⏰ 1 minute of free time remaining.', timestamp: new Date(),
      }]);
    });

    socket.on('session:free_time_expired', ({ systemMessage }) => {
      setFreeExpired(true);
      setTimerActive(false);
      if (systemMessage) setMessages((p) => [...p, systemMessage]);
      setStatus('ended');
    });

    socket.on('session:ended', ({ systemMessage }) => {
      setStatus('ended');
      setTimerActive(false);
      if (systemMessage) setMessages((p) => [...p, systemMessage]);
    });

    socket.on('error', ({ message }) => {
      setErrMsg(message);
      setStatus('error');
    });

    socket.on('disconnect', () => {
      if (status !== 'ended') setStatus('error');
    });

    return () => { socket.disconnect(); };
  }, [astrologerId]);

  const sendMessage = () => {
    if (!input.trim() || !sessionId || status !== 'active') return;
    socketRef.current?.emit('chat:send', {
      sessionId,
      content: input.trim(),
      senderRole: 'user',
      senderName: userInfo?.name || 'User',
    });
    setInput('');
  };

  const endSession = () => {
    if (sessionId) {
      socketRef.current?.emit('session:end', { sessionId, endedBy: 'user' });
    }
    setStatus('ended');
    setTimerActive(false);
  };

  const timerColor = timerSecs <= 60 ? 'text-rose-500' : timerSecs <= 120 ? 'text-amber-500' : 'text-emerald-600';

  if (!astrologer || !userInfo) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back */}
          <button onClick={() => navigate('/live')} className="text-slate-400 hover:text-slate-600 transition-colors mr-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Astrologer info */}
          <img
            src={astrologer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=6366f1&color=fff`}
            alt={astrologer.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{astrologer.name}</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <p className="text-xs text-slate-500">
                {status === 'connecting' && 'Connecting…'}
                {status === 'active' && (astroJoined ? 'In chat' : 'Waiting for astrologer…')}
                {status === 'ended' && 'Session ended'}
                {status === 'error' && 'Disconnected'}
              </p>
            </div>
          </div>

          {/* Timer */}
          {status === 'active' && !freeExpired && (
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-400">Free time</p>
              <p className={`text-base font-extrabold tabular-nums ${timerColor}`}>{formatTime(timerSecs)}</p>
            </div>
          )}

          {/* End button */}
          {status === 'active' && (
            <button onClick={endSession} className="shrink-0 px-3 py-1.5 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">
              End
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {status === 'connecting' && (
            <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
              <span className="animate-spin inline-block w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full" />
              <p className="text-sm">Connecting to {astrologer.name}…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">Connection failed</p>
              <p className="text-xs text-slate-500 text-center max-w-xs">{errMsg || 'Could not connect. The astrologer may be offline now.'}</p>
              <button onClick={() => navigate('/live')}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                Back to Astrologers
              </button>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={msg._id || i} msg={msg} userName={userInfo.name} />
          ))}

          {status === 'ended' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">Session Ended</p>
              <p className="text-xs text-slate-500 text-center max-w-xs">
                {freeExpired ? 'Your free time has ended. Book a paid consultation to continue.' : 'This chat session has ended.'}
              </p>
              <div className="flex gap-2.5">
                <button onClick={() => navigate('/live')}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">
                  Back
                </button>
                <button onClick={() => navigate('/book-consultation')}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  Book Consultation
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {status === 'active' && (
        <div className="bg-white border-t border-slate-100 shrink-0">
          <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your message…"
              maxLength={2000}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
