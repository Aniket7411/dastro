import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Check, CheckCircle2, Shield, EyeOff, Loader2 } from 'lucide-react';
import API_BASE from '../utils/api';
import { isValidIndianMobile, normalizeIndianMobile } from '../utils/validation';
import SEO from '../components/SEO';
import PhoneInput from '../components/PhoneInput';

const DEFAULT_AVATAR = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b4a1e&color=fff&size=128&bold=true`;

function StarRating({ rating = 0 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-500' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function AstrologerCard({ a, freeMinutes, onChat }) {
  return (
    <div className="bg-white rounded-2xl border border-site-accent-dark/12 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full justify-between">
      {/* Top accent line — green if online */}
      <div className={`h-1.5 w-full ${a.isOnline ? 'bg-emerald-500' : 'bg-site-accent-dark/10'}`} />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Avatar + online badge */}
          <div className="flex gap-3 items-start mb-3">
            <div className="relative shrink-0">
              <img
                src={a.image || DEFAULT_AVATAR(a.name)}
                alt={a.name}
                className="w-16 h-16 rounded-xl object-cover border border-site-accent-dark/10"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center
                ${a.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}
                title={a.isOnline ? 'Online now' : 'Offline'}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-site-primary truncate" style={{ fontFamily: 'var(--font-heading)' }}>{a.name}</p>
              <p className="text-xs text-site-muted font-semibold truncate">{a.role}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={a.rating} />
                <span className="text-[11px] font-bold text-site-soft">{a.rating} ({a.reviews})</span>
              </div>
            </div>
            <span className={`shrink-0 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${a.isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-site-accent-dark/6 text-site-soft'}`}>
              {a.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Bio */}
          {a.bio && <p className="text-xs text-site-muted mb-3 line-clamp-2 leading-relaxed font-semibold">{a.bio}</p>}

          {/* Tags */}
          {a.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {a.specialties.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] bg-site-accent/8 text-site-accent-dark px-2 py-0.5 rounded-full font-bold border border-site-accent/15">{s}</span>
              ))}
              {a.specialties.length > 3 && <span className="text-[10px] font-bold text-site-soft">+{a.specialties.length - 3}</span>}
            </div>
          )}
        </div>

        <div>
          {/* Stats row */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-site-soft mb-3.5 border-t border-site-accent-dark/5 pt-2.5">
            <span>{a.experience}+ yrs exp</span>
            {a.languages?.length > 0 && <span className="truncate">{a.languages.slice(0, 2).join(', ')}</span>}
            {a.sessionCount > 0 && <span>{a.sessionCount} chats</span>}
          </div>

          {/* Free label */}
          {freeMinutes > 0 && (
            <p className="text-[11px] text-emerald-600 font-bold mb-2.5">
              ✦ First {freeMinutes} min free
            </p>
          )}

          {/* CTA */}
          <button
            onClick={() => onChat(a)}
            disabled={!a.isOnline}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
              a.isOnline
                ? 'bg-site-accent text-white border-site-accent-dark/10 hover:bg-site-accent-dark hover:shadow-sm active:scale-[.98]'
                : 'bg-site-accent-dark/5 text-site-soft border-transparent cursor-not-allowed'
            }`}
          >
            {a.isOnline ? 'Chat Now' : 'Currently Offline'}
          </button>
        </div>
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
    if (phone.trim() && !isValidIndianMobile(phone)) {
      setErr('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    onStart({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() ? normalizeIndianMobile(phone) : '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-site-accent-dark/12 shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <img src={astrologer.image || DEFAULT_AVATAR(astrologer.name)} alt={astrologer.name}
            className="w-12 h-12 rounded-xl object-cover border border-site-accent-dark/10 shrink-0" />
          <div>
            <p className="text-sm font-bold text-site-primary" style={{ fontFamily: 'var(--font-heading)' }}>{astrologer.name}</p>
            <p className="text-xs text-site-muted font-semibold">{astrologer.role}</p>
          </div>
        </div>

        {freeMinutes > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 mb-4 text-xs text-emerald-700 font-semibold">
            ✦ First <strong>{freeMinutes} minute{freeMinutes > 1 ? 's' : ''}</strong> are completely free.
          </div>
        )}

        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-site-primary mb-1">Your Name *</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setErr(''); }} placeholder="Enter your name"
              className="w-full border border-site-accent-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-site-accent/25 focus:border-site-accent bg-site-bg text-site-primary font-semibold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-site-primary mb-1">Email <span className="font-semibold text-site-soft">(optional)</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full border border-site-accent-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-site-accent/25 focus:border-site-accent bg-site-bg text-site-primary font-semibold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-site-primary mb-1">Phone <span className="font-semibold text-site-soft">(optional)</span></label>
            <PhoneInput name="phone" value={phone} onChange={(e) => { setPhone(e.target.value); setErr(''); }} placeholder="Mobile number"
              className="w-full border border-site-accent-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-site-accent/25 focus:border-site-accent bg-site-bg text-site-primary font-semibold" />
          </div>
          {err && <p className="text-xs text-rose-600 font-bold">{err}</p>}
          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 text-sm font-bold text-site-muted bg-site-accent-dark/6 rounded-lg hover:bg-site-accent-dark/12 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2 text-sm font-bold text-white bg-site-accent rounded-lg hover:bg-site-accent-dark transition-colors">
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
  const [astrologers,     setAstrologers]     = useState([]);
  const [totalAstrologers, setTotalAstrologers] = useState(null);
  const [settings,        setSettings]        = useState({ freeMinutes: 3, chatEnabled: true });
  const [tags,            setTags]            = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [err,             setErr]             = useState('');
  const [search,          setSearch]          = useState('');
  const [activeTag,       setActiveTag]       = useState('All');
  const [infoModal,       setInfoModal]       = useState(null);

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
        if (!params.search && (!params.specialty || params.specialty === 'All')) {
          setTotalAstrologers(data.total ?? data.astrologers.length);
        }
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
    <div className="bg-site-bg min-h-screen">
      <SEO
        title="Chat with Live Astrologers Online | DS Astro Institute"
        titleIsFull
        description="Talk to expert live astrologers now. Instant answers on love, career, marriage & more from DS Astro Institute's verified astrologers. Start your chat."
        url="/live"
      />
      {/* Hero */}
      <div className="bg-gradient-to-br from-site-primary via-[#2e1208] to-[#1a0a01] text-white py-10 px-6 sm:px-8 lg:px-12 border-b border-site-accent-dark/10 shadow-sm">
        <div className="text-center">
          <span className="inline-block text-xs font-bold bg-site-accent/15 border border-site-accent/30 text-site-accent px-3 py-1 rounded-full mb-3.5 tracking-wide uppercase">
            Live Astrology Chat
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-[#f5c98d]" style={{ fontFamily: 'var(--font-heading)' }}>Talk to an Astrologer</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Connect instantly with expert astrologers. {settings.freeMinutes > 0 && `First ${settings.freeMinutes} minutes completely free.`}
          </p>
          <div className="flex justify-center gap-6 mt-5 text-xs font-semibold flex-wrap">
            {totalAstrologers !== null && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-site-accent inline-block" />
                <strong className="text-white">{totalAstrologers}</strong>
                <span className="text-white/70">Total Astrologers</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <strong className="text-white">{online}</strong>
              <span className="text-white/70">Online now</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30 inline-block" />
              <strong className="text-white">{offline}</strong>
              <span className="text-white/70">Offline</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12 py-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={search} onChange={handleSearch}
            placeholder="Search by name, specialty…"
            className="flex-1 border border-site-accent-dark/15 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-site-accent/25 focus:border-site-accent font-semibold text-site-primary placeholder:text-site-muted/50 shadow-sm transition-all"
          />
        </div>

        {/* Specialty pills */}
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <button key={tag} onClick={() => handleTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border
                  ${activeTag === tag
                    ? 'bg-site-primary text-white border-site-primary'
                    : 'bg-white border-site-accent-dark/12 text-site-muted hover:border-site-accent/40 hover:text-site-primary'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Chat disabled banner */}
        {!settings.chatEnabled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium mb-5 shadow-sm">
            Live chat is temporarily unavailable. Please check back soon.
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-site-accent-dark/10 p-4 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-site-accent-dark/5 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-site-accent-dark/5 rounded w-3/4" />
                    <div className="h-2 bg-site-accent-dark/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-2 bg-site-accent-dark/5 rounded mb-2" />
                <div className="h-8 bg-site-accent-dark/5 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : err ? (
          <div className="text-center py-16">
            <p className="text-sm text-rose-500 font-semibold mb-3">{err}</p>
            <button onClick={() => fetchData()} className="px-5 py-2 text-xs font-bold bg-site-accent/10 text-site-accent-dark rounded-lg hover:bg-site-accent/20 border border-site-accent/20 transition-colors">Retry</button>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-site-accent-dark/10 p-6 shadow-sm">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-sm font-bold text-site-primary" style={{ fontFamily: 'var(--font-heading)' }}>No astrologers found</p>
            <p className="text-xs text-site-muted font-semibold mt-1">Try a different search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {astrologers.map((a) => (
              <AstrologerCard key={a._id} a={a} freeMinutes={settings.freeMinutes} onChat={handleChatClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
