import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';

const DEFAULT_AVATAR = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128&bold=true`;

function StarRating({ rating = 0 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function AstrologerCard({ a, freeMinutes, onChat }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Top accent line — green if online */}
      <div className={`h-1 w-full ${a.isOnline ? 'bg-emerald-400' : 'bg-slate-200'}`} />

      <div className="p-4">
        {/* Avatar + online badge */}
        <div className="flex gap-3 items-start mb-3">
          <div className="relative shrink-0">
            <img
              src={a.image || DEFAULT_AVATAR(a.name)}
              alt={a.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-100"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center
              ${a.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
              title={a.isOnline ? 'Online now' : 'Offline'}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
            <p className="text-xs text-slate-500 truncate">{a.role}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={a.rating} />
              <span className="text-[11px] text-slate-400">{a.rating} ({a.reviews})</span>
            </div>
          </div>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {a.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Bio */}
        {a.bio && <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{a.bio}</p>}

        {/* Tags */}
        {a.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {a.specialties.slice(0, 4).map((s) => (
              <span key={s} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
            ))}
            {a.specialties.length > 4 && <span className="text-[10px] text-slate-400">+{a.specialties.length - 4}</span>}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
          <span>{a.experience}+ yrs</span>
          {a.languages?.length > 0 && <span>{a.languages.slice(0, 2).join(', ')}</span>}
          {a.sessionCount > 0 && <span>{a.sessionCount} sessions</span>}
        </div>

        {/* Free label */}
        {freeMinutes > 0 && (
          <p className="text-[11px] text-emerald-600 font-semibold mb-2.5">
            ✦ First {freeMinutes} min free
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => onChat(a)}
          disabled={!a.isOnline}
          className={`w-full py-2 rounded-xl text-sm font-bold transition-all
            ${a.isOnline
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
        >
          {a.isOnline ? 'Chat Now' : 'Currently Offline'}
        </button>
      </div>
    </div>
  );
}

/* ─── User Info Modal (shown before entering chat) ─── */
function UserInfoModal({ astrologer, freeMinutes, onStart, onClose }) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [err,   setErr]   = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Please enter your name to start the chat.'); return; }
    onStart({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <img src={astrologer.image || DEFAULT_AVATAR(astrologer.name)} alt={astrologer.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-800">{astrologer.name}</p>
            <p className="text-xs text-slate-500">{astrologer.role}</p>
          </div>
        </div>

        {freeMinutes > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-4 text-xs text-emerald-700 font-medium">
            ✦ First <strong>{freeMinutes} minute{freeMinutes > 1 ? 's' : ''}</strong> are completely free.
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} placeholder="Enter your name"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email <span className="font-normal text-slate-400">(optional)</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone <span className="font-normal text-slate-400">(optional)</span></label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          {err && <p className="text-xs text-rose-500 font-medium">{err}</p>}
          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LiveAstrologers() {
  const navigate = useNavigate();
  const [astrologers, setAstrologers] = useState([]);
  const [settings,    setSettings]    = useState({ freeMinutes: 3, chatEnabled: true });
  const [tags,        setTags]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [err,         setErr]         = useState('');
  const [search,      setSearch]      = useState('');
  const [activeTag,   setActiveTag]   = useState('All');
  const [infoModal,   setInfoModal]   = useState(null); // astrologer object

  const fetchData = async (params = {}) => {
    setLoading(true); setErr('');
    try {
      const qs = new URLSearchParams();
      if (params.search)    qs.set('search',    params.search);
      if (params.specialty && params.specialty !== 'All') qs.set('specialty', params.specialty);
      const res  = await fetch(`${API_BASE}/api/astrologers?${qs}`);
      const data = await res.json();
      if (data.success) {
        setAstrologers(data.astrologers);
        setTags(['All', ...(data.tags || [])]);
        if (data.settings) setSettings(data.settings);
      } else {
        setErr(data.message || 'Failed to load astrologers');
      }
    } catch {
      setErr('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    setActiveTag('All');
    fetchData({ search: v });
  };

  const handleTag = (tag) => {
    setActiveTag(tag);
    setSearch('');
    fetchData({ specialty: tag });
  };

  const handleChatClick = (a) => {
    if (!settings.chatEnabled) return;
    setInfoModal(a);
  };

  const handleStartChat = (userInfo) => {
    navigate(`/live/${infoModal._id}`, {
      state: { astrologer: infoModal, userInfo, freeMinutes: settings.freeMinutes },
    });
  };

  const online  = astrologers.filter((a) => a.isOnline).length;
  const offline = astrologers.length - online;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Live Astrology Chat
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Talk to an Astrologer</h1>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto">
            Connect instantly with expert astrologers. {settings.freeMinutes > 0 && `First ${settings.freeMinutes} minutes free.`}
          </p>
          <div className="flex justify-center gap-6 mt-5 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <strong className="text-white">{online}</strong>
              <span className="text-indigo-200">Online now</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
              <strong className="text-white">{offline}</strong>
              <span className="text-indigo-200">Offline</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={search} onChange={handleSearch}
            placeholder="Search by name, specialty…"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Specialty pills */}
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <button key={tag} onClick={() => handleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors
                  ${activeTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Chat disabled banner */}
        {!settings.chatEnabled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium mb-5">
            Live chat is temporarily unavailable. Please check back soon.
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-slate-200 rounded mb-2" />
                <div className="h-8 bg-slate-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : err ? (
          <div className="text-center py-16">
            <p className="text-sm text-rose-500 font-medium mb-3">{err}</p>
            <button onClick={() => fetchData()} className="px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">Retry</button>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-sm font-medium text-slate-600">No astrologers found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {astrologers.map((a) => (
              <AstrologerCard key={a._id} a={a} freeMinutes={settings.freeMinutes} onChat={handleChatClick} />
            ))}
          </div>
        )}
      </div>

      {/* User info modal */}
      {infoModal && (
        <UserInfoModal
          astrologer={infoModal}
          freeMinutes={settings.freeMinutes}
          onStart={handleStartChat}
          onClose={() => setInfoModal(null)}
        />
      )}
    </div>
  );
}
