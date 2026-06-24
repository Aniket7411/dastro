import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API_BASE from '../utils/api';

const authH = () => ({ Authorization: `Bearer ${localStorage.getItem('astrologerToken')}` });
const jsonH = () => ({ 'Content-Type': 'application/json', ...authH() });

function MessageBubble({ msg }) {
  const isSystem = msg.senderRole === 'system';
  const isMe     = msg.senderRole === 'astrologer';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
          <span className="text-[10px] font-bold text-emerald-600">{msg.senderName?.[0] || 'U'}</span>
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="text-[10px] text-slate-400 ml-1">{msg.senderName}</span>}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${isMe
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

export default function AstrologerDashboard() {
  const navigate = useNavigate();

  const [astrologer,    setAstrologer]    = useState(null);
  const [settings,      setSettings]      = useState({ freeMinutes: 3 });
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  // Online toggle
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [onlineMsg,      setOnlineMsg]      = useState('');

  // Active chat session
  const [pendingSession, setPendingSession] = useState(null);  // { sessionId, userName, userEmail }
  const [activeSession,  setActiveSession]  = useState(null);  // same shape
  const [messages,       setMessages]       = useState([]);
  const [input,          setInput]          = useState('');
  const [sessionEnded,   setSessionEnded]   = useState(false);

  // Password change
  const [showPwForm,  setShowPwForm]  = useState(false);
  const [pwForm,      setPwForm]      = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading,   setPwLoading]   = useState(false);
  const [pwMsg,       setPwMsg]       = useState({ text: '', type: '' });

  const socketRef      = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Auth guard
  useEffect(() => {
    const t = localStorage.getItem('astrologerToken');
    if (!t) { navigate('/astrologer-login', { replace: true }); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/astrologers/me`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setAstrologer(data.astrologer);
        setSettings(data.settings || { freeMinutes: 3 });
        connectSocket(data.astrologer._id);
      } else {
        if (res.status === 401) { logout(); return; }
        setError(data.message || 'Failed to load profile');
      }
    } catch { setError('Network error loading profile'); }
    finally { setLoading(false); }
  };

  const connectSocket = (astrologerId) => {
    const socket = io(API_BASE, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('astrologer:join', { astrologerId });
    });

    socket.on('astrologer:new_session', ({ sessionId, userName, userEmail }) => {
      setPendingSession({ sessionId, userName, userEmail });
    });

    socket.on('session:history', ({ messages: hist }) => {
      setMessages(hist);
    });

    socket.on('chat:message', (msg) => {
      setMessages((p) => [...p, msg]);
    });

    socket.on('session:ended', ({ systemMessage }) => {
      setSessionEnded(true);
      if (systemMessage) setMessages((p) => [...p, systemMessage]);
    });

    socket.on('session:free_time_expired', ({ systemMessage }) => {
      setSessionEnded(true);
      if (systemMessage) setMessages((p) => [...p, systemMessage]);
    });
  };

  const joinSession = (session) => {
    setPendingSession(null);
    setActiveSession(session);
    setMessages([]);
    setSessionEnded(false);
    socketRef.current?.emit('astrologer:join_session', {
      sessionId:      session.sessionId,
      astrologerId:   astrologer._id,
      astrologerName: astrologer.name,
    });
  };

  const sendMessage = () => {
    if (!input.trim() || !activeSession || sessionEnded) return;
    socketRef.current?.emit('chat:send', {
      sessionId:  activeSession.sessionId,
      content:    input.trim(),
      senderRole: 'astrologer',
      senderName: astrologer.name,
    });
    setInput('');
  };

  const endSession = () => {
    if (!activeSession) return;
    socketRef.current?.emit('session:end', {
      sessionId:   activeSession.sessionId,
      endedBy:     'astrologer',
      astrologerId: astrologer._id,
    });
    setSessionEnded(true);
  };

  const clearSession = () => {
    setActiveSession(null);
    setMessages([]);
    setSessionEnded(false);
  };

  const toggleOnline = async () => {
    if (!astrologer) return;
    setTogglingOnline(true);
    try {
      const res  = await fetch(`${API_BASE}/api/astrologers/me/status`, {
        method: 'PUT',
        headers: jsonH(),
        body: JSON.stringify({ isOnline: !astrologer.isOnline }),
      });
      const data = await res.json();
      if (data.success) {
        setAstrologer((p) => ({ ...p, isOnline: data.astrologer.isOnline }));
        setOnlineMsg(data.message);
        setTimeout(() => setOnlineMsg(''), 3000);
      } else {
        setOnlineMsg(data.message || 'Failed to update status');
        setTimeout(() => setOnlineMsg(''), 4000);
      }
    } catch { setOnlineMsg('Network error'); setTimeout(() => setOnlineMsg(''), 4000); }
    finally { setTogglingOnline(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ text: 'New passwords do not match.', type: 'error' }); return; }
    if (pwForm.newPw.length < 6)         { setPwMsg({ text: 'Password must be at least 6 characters.', type: 'error' }); return; }

    setPwLoading(true); setPwMsg({ text: '', type: '' });
    try {
      const res  = await fetch(`${API_BASE}/api/astrologers/me/password`, {
        method: 'PUT',
        headers: jsonH(),
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ text: data.message, type: 'success' });
        setPwForm({ current: '', newPw: '', confirm: '' });
      } else {
        setPwMsg({ text: data.message || 'Password change failed.', type: 'error' });
      }
    } catch { setPwMsg({ text: 'Network error.', type: 'error' }); }
    finally { setPwLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('astrologerToken');
    localStorage.removeItem('astrologerUser');
    socketRef.current?.disconnect();
    navigate('/astrologer-login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="animate-spin inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-rose-500 mb-3">{error}</p>
          <button onClick={fetchProfile} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">Retry</button>
        </div>
      </div>
    );
  }

  /* ── Active Chat View ── */
  if (activeSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 shadow-sm shrink-0">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={clearSession} className="text-slate-400 hover:text-slate-600 mr-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{activeSession.userName}</p>
              {activeSession.userEmail && <p className="text-[11px] text-slate-400">{activeSession.userEmail}</p>}
            </div>
            {!sessionEnded && (
              <button onClick={endSession} className="px-3 py-1.5 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100">End Session</button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => <MessageBubble key={msg._id || i} msg={msg} />)}
            {sessionEnded && (
              <div className="flex flex-col items-center gap-3 py-8">
                <p className="text-sm font-semibold text-slate-600">Session ended</p>
                <button onClick={clearSession} className="px-5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100">
                  Back to Dashboard
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        {!sessionEnded && (
          <div className="bg-white border-t border-slate-100 shrink-0">
            <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type your reply…"
                maxLength={2000}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
              <button onClick={sendMessage} disabled={!input.trim()}
                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0">
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

  /* ── Main Dashboard ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <img
            src={astrologer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(astrologer.name)}&background=6366f1&color=fff`}
            alt={astrologer.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{astrologer.name}</p>
            <p className="text-xs text-slate-500 truncate">{astrologer.role}</p>
          </div>
          <button onClick={logout} className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">

        {/* Online toggle card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Availability</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {astrologer.isOnline ? 'You are visible to users and can receive chats' : 'You are offline — users cannot see you'}
              </p>
              {onlineMsg && <p className="text-xs font-semibold text-indigo-600 mt-1">{onlineMsg}</p>}
            </div>
            <button
              onClick={toggleOnline}
              disabled={togglingOnline}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50
                ${astrologer.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                ${astrologer.isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Pending session alert */}
        {pendingSession && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">Incoming Chat</p>
              <p className="text-xs text-slate-500">
                <strong>{pendingSession.userName}</strong>{pendingSession.userEmail ? ` · ${pendingSession.userEmail}` : ''} wants to chat
              </p>
            </div>
            <button
              onClick={() => joinSession(pendingSession)}
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shrink-0"
            >
              Join
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-indigo-600">{astrologer.sessionCount || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Total Sessions</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-500">⭐ {astrologer.rating}</p>
            <p className="text-xs text-slate-500 mt-1">{astrologer.reviews} reviews</p>
          </div>
        </div>

        {/* Specialties */}
        {astrologer.specialties?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-600 mb-2">Your Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {astrologer.specialties.map((s) => (
                <span key={s} className="text-[11px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <button
            onClick={() => setShowPwForm((p) => !p)}
            className="flex items-center justify-between w-full text-sm font-bold text-slate-800"
          >
            <span>Change Password</span>
            <span className="text-slate-400 text-xs">{showPwForm ? '▲ Hide' : '▼ Show'}</span>
          </button>

          {showPwForm && (
            <form onSubmit={changePassword} className="mt-4 space-y-3">
              {[
                { label: 'Current Password', key: 'current', placeholder: '••••••••' },
                { label: 'New Password',     key: 'newPw',   placeholder: 'Min 6 characters' },
                { label: 'Confirm New',      key: 'confirm', placeholder: 'Re-enter new password' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                  <input
                    type="password"
                    value={pwForm[key]}
                    onChange={(e) => { setPwForm((p) => ({ ...p, [key]: e.target.value })); setPwMsg({ text: '', type: '' }); }}
                    placeholder={placeholder}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}

              {pwMsg.text && (
                <div className={`text-xs font-medium px-3 py-2 rounded-lg ${pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  {pwMsg.type === 'success' ? '✓ ' : '✕ '}{pwMsg.text}
                </div>
              )}

              <button type="submit" disabled={pwLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
                {pwLoading && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
                Update Password
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
