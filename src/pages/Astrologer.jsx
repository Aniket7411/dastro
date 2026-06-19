import { useState, useEffect, useRef, useCallback } from 'react';
import API_BASE from '../utils/api';
import SEO from '../components/SEO';

/* ─── form defaults ──────────────────────────────────────── */
const EMPTY_LEAD = { name: '', phone: '', email: '', pob: '', dob: '', tob: '' };

/* ─── tiny SVGs ──────────────────────────────────────────── */
const IcoStar = ({ className = 'w-3 h-3' }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const IcoVerified = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 shrink-0 text-emerald-500">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
);
const IcoClose = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-9 h-9 text-amber-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IcoSpinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0">
    <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l3 2" />
  </svg>
);

/* ─── stars row ──────────────────────────────────────────── */
function Stars({ value = 0 }) {
  const n = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= n ? 'text-amber-400' : 'text-slate-200'}>
          <IcoStar />
        </span>
      ))}
    </span>
  );
}

/* ─── shared input style ─────────────────────────────────── */
const iCls = (err) =>
  `w-full border rounded-xl px-3.5 py-2.5 text-sm text-site-primary placeholder-site-muted/50 outline-none transition focus:ring-2 focus:border-site-accent ${
    err ? 'border-rose-300 bg-rose-50 focus:ring-rose-200' : 'border-site-accent-dark/20 bg-[#fffcf8] focus:ring-site-accent/20'
  }`;

function Field({ label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[11px] font-bold text-site-primary/55"
        style={{ textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}
      >
        {label}
        {optional && <span className="ml-1 font-normal text-site-muted/70" style={{ textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{error}</p>}
    </div>
  );
}

/* ─── body scroll lock ───────────────────────────────────── */
function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

/* ─── Lead Modal ─────────────────────────────────────────── */
function LeadModal({ astrologer, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_LEAD);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  useScrollLock(true);

  const set = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit mobile';
    if (!form.dob) e.dob = 'Required';
    if (!form.tob) e.tob = 'Required';
    if (!form.pob.trim()) e.pob = 'Place of birth required';
    return e;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          pob: form.pob.trim(),
          dob: form.dob,
          tob: form.tob,
          type: 'Consultation',
          leadType: 'ASTROLOGER ENQUIRY',
          consultationType: astrologer?.name || 'Astrologer Consultation',
          message: `Request for ${astrologer?.name || 'astrologer'}. POB: ${form.pob}. DOB: ${form.dob}. TOB: ${form.tob}.`,
          paymentStatus: 'NOT REQUIRED',
        }),
      });
      const data = await res.json();
      if (data.success || res.ok) onSuccess();
      else setErrors({ submit: data.message || 'Something went wrong.' });
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop — flex-col so the sheet sits at the bottom on mobile */
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center sm:items-center bg-black/55 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet */}
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '92dvh' }}>

        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-3.5 border-b border-site-accent-dark/10 sm:pt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-site-accent mb-0.5">
              Book Consultation
            </p>
            <h2 className="font-heading text-[15px] font-extrabold text-site-primary leading-snug">
              {astrologer ? `Connect with ${astrologer.name}` : 'Request a Consultation'}
            </h2>
            <p className="text-[11px] text-site-muted mt-0.5">Our team will call to confirm your session</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-site-muted hover:bg-site-bg hover:text-site-primary transition shrink-0 -mr-1"
          >
            <IcoClose />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain flex-1 px-5 py-3 space-y-3">

          <Field label="Full Name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className={iCls(errors.name)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="10-digit number"
                inputMode="tel"
                autoComplete="tel"
                className={iCls(errors.phone)}
              />
            </Field>
            <Field label="Email" optional>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className={iCls(false)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" error={errors.dob}>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => set('dob', e.target.value)}
                className={iCls(errors.dob)}
              />
            </Field>
            <Field label="Time of Birth" error={errors.tob}>
              <input
                type="time"
                value={form.tob}
                onChange={(e) => set('tob', e.target.value)}
                className={iCls(errors.tob)}
              />
            </Field>
          </div>

          <Field label="Place of Birth" error={errors.pob}>
            <input
              value={form.pob}
              onChange={(e) => set('pob', e.target.value)}
              placeholder="City, State, Country"
              className={iCls(errors.pob)}
            />
          </Field>

          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl px-3.5 py-2.5 font-medium">
              {errors.submit}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-site-accent-dark/10">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-site-accent-dark to-site-accent text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-60 transition-all shadow-md shadow-site-accent/20 flex items-center justify-center gap-2"
          >
            {submitting ? <><IcoSpinner /> Sending…</> : 'Request Consultation'}
          </button>
          <p className="text-center text-[11px] text-site-muted/70 mt-2.5">
            Your details are kept strictly confidential.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirmation Modal ─────────────────────────────────── */
function ConfirmationModal({ astrologerName, onClose }) {
  useScrollLock(true);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-200">
          <IcoCheck />
        </div>
        <h2 className="font-heading text-lg font-extrabold text-site-primary mb-1.5">Request Received!</h2>
        <p className="text-sm text-site-muted mb-1">Thank you for reaching out.</p>
        <p className="text-sm font-semibold text-site-accent-dark mb-5">
          Our team will call you shortly{astrologerName ? ` to confirm with ${astrologerName}` : ''}.
        </p>
        <p className="text-[11px] text-site-muted mb-5 flex items-center justify-center gap-1.5">
          <IcoClock /> Expect a call within 24 hours
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-site-accent-dark to-site-accent text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ─── Astrologer Card ────────────────────────────────────── */
function AstrologerCard({ a, onConsult }) {
  const initials = (a.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const hasOrders = a.reviews > 0;
  const ordersLabel = a.reviews >= 10000
    ? `${Math.floor(a.reviews / 1000)}k+`
    : a.reviews >= 1000
    ? `${(a.reviews / 1000).toFixed(0)}k+`
    : `${a.reviews}`;

  return (
    <article className="bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-site-accent/20 transition-all duration-200 flex items-center gap-3 p-3">

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full ring-2 ring-amber-200 ring-offset-1 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
          {a.image ? (
            <img src={a.image} alt={a.name} className="w-full h-full object-cover object-top" loading="lazy" />
          ) : (
            <span className="font-heading text-lg font-extrabold text-amber-700">{initials}</span>
          )}
        </div>
        {a.isFeatured && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
            <IcoStar className="w-2 h-2 text-white" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <h3 className="font-heading text-[13px] sm:text-sm font-extrabold text-site-primary leading-tight truncate">
            {a.name}
          </h3>
          <IcoVerified />
        </div>

        {a.specialties?.length > 0 && (
          <p className="text-[11px] text-site-muted truncate leading-tight">
            {a.specialties.join(', ')}
          </p>
        )}

        {a.languages?.length > 0 && (
          <p className="text-[11px] text-site-muted/80 truncate leading-tight">
            {a.languages.join(', ')}
          </p>
        )}

        {/* Stars + orders */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Stars value={a.rating || 5} />
          {hasOrders ? (
            <span className="text-[10px] text-site-muted font-medium">{ordersLabel} orders</span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full leading-none">New!</span>
          )}
        </div>

        <p className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] text-site-muted font-medium">
          <IcoClock />
          Exp: {a.experience || 1} Yr{(a.experience || 1) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* CTA */}
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => onConsult(a)}
          className="text-[11px] sm:text-xs font-bold text-site-accent-dark border border-site-accent/50 rounded-lg px-2.5 py-1.5 hover:bg-site-accent hover:text-white hover:border-site-accent transition-all active:scale-95 whitespace-nowrap"
        >
          Consult
        </button>
      </div>
    </article>
  );
}

/* ─── Skeleton ───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
      <div className="w-[60px] h-[60px] rounded-full bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="w-14 h-7 bg-slate-100 rounded-lg shrink-0" />
    </div>
  );
}

/* ─── Category pill ──────────────────────────────────────── */
function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      data-active={String(active)}
      onClick={onClick}
      className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
        active
          ? 'bg-site-accent text-white border-site-accent'
          : 'bg-white text-site-primary border-site-accent-dark/20 hover:border-site-accent hover:text-site-accent'
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Astrologer() {
  const [astrologers, setAstrologers] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmedName, setConfirmedName] = useState('');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const debounceRef = useRef(null);
  const pillsRef = useRef(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchData = useCallback(async (tag, q, refetch = false) => {
    if (refetch) setIsRefetching(true);
    else setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tag && tag !== 'All') params.set('specialty', tag);
      if (q?.trim()) params.set('search', q.trim());
      const res = await fetch(`${API_BASE}/api/astrologers?${params}`);
      const data = await res.json();
      if (data.success) {
        setAstrologers(data.astrologers || []);
        if (data.tags?.length) setAllTags(data.tags);
      } else {
        setError('Could not load astrologers.');
      }
    } catch {
      setError('Could not load astrologers.');
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchData('All', ''); }, [fetchData]);

  // Debounce search/filter — dims grid instead of full skeleton
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(activeTag, search, true), 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, activeTag, fetchData]);

  // Scroll active pill into view when tag changes
  useEffect(() => {
    const el = pillsRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTag]);

  const handleTag = (tag) => { setActiveTag(tag); };

  const handleSuccess = () => {
    setConfirmedName(selected?.name || '');
    setSelected(null);
    setShowConfirm(true);
  };

  const tags = ['All', ...allTags];
  const showResults = !loading && !error;

  return (
    <div className="tw-page">
      <SEO
        title="Consult Expert Astrologers"
        description="Connect with certified Vedic astrologers for personalised guidance."
        url="/astrologer"
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.8) 1px,transparent 1px)', backgroundSize: '22px 22px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-9 sm:py-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-[#f5c98d] text-[10px] font-bold uppercase tracking-[0.15em] bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
            <IcoStar className="w-2.5 h-2.5" />
            Certified Vedic Experts
          </span>
          <h1 className="font-heading text-2xl sm:text-[2.25rem] font-extrabold text-white leading-tight mb-2.5">
            Consult the Best{' '}
            <span className="bg-gradient-to-r from-[#f5c98d] to-[#e8a855] bg-clip-text text-transparent">
              Astrologers
            </span>
          </h1>
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Personalised guidance for life, career, relationships, and destiny.
          </p>
        </div>
      </header>

      {/* ── Sticky filter bar — sticks BELOW site navbar ─── */}
      <div className="sticky top-site-header-sticky z-30 bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col gap-1.5">

          {/* Search */}
          <label className="flex items-center gap-2 bg-site-bg border border-site-accent-dark/20 rounded-xl px-3 py-2 focus-within:border-site-accent focus-within:ring-2 focus-within:ring-site-accent/15 transition">
            <IcoSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialty…"
              className="flex-1 text-sm text-site-primary bg-transparent outline-none placeholder-site-muted/40 min-w-0"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-site-muted hover:text-site-primary shrink-0"
              >
                <IcoClose />
              </button>
            )}
          </label>

          {/* Category pills — horizontal scroll, active pill auto-centres */}
          <div
            ref={pillsRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {(allTags.length > 0 ? tags : ['All']).map((t) => (
              <Pill key={t} label={t} active={activeTag === t} onClick={() => handleTag(t)} />
            ))}
            {/* trailing spacer so last pill isn't flush against edge */}
            <span className="shrink-0 w-2" aria-hidden />
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5">

        {/* Count row */}
        {showResults && (
          <p className="text-[11px] text-site-muted mb-3 flex items-center gap-1.5">
            {isRefetching && (
              <span className="inline-block w-3 h-3 border-2 border-site-accent/30 border-t-site-accent rounded-full animate-spin" />
            )}
            {astrologers.length === 0
              ? 'No astrologers found'
              : `${astrologers.length} astrologer${astrologers.length !== 1 ? 's' : ''}`}
            {activeTag !== 'All' && (
              <> · <span className="font-semibold text-site-accent">{activeTag}</span></>
            )}
            {search.trim() && (
              <> · "<span className="font-semibold text-site-primary">{search.trim()}</span>"</>
            )}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-rose-400">
                <path strokeLinecap="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-site-muted text-sm font-medium">{error}</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
              <IcoStar className="w-6 h-6 text-amber-300" />
            </div>
            <p className="text-site-primary text-sm font-bold">No astrologers found</p>
            <p className="text-site-muted text-xs">Try a different search or category</p>
            <button
              type="button"
              onClick={() => { setSearch(''); setActiveTag('All'); }}
              className="text-xs font-bold text-site-accent underline underline-offset-2 mt-1"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 transition-opacity duration-200 ${isRefetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {astrologers.map((a) => (
              <AstrologerCard key={a._id} a={a} onConsult={setSelected} />
            ))}
          </div>
        )}
      </main>

      {/* ── Why consult ───────────────────────────────────── */}
      {!loading && !error && astrologers.length > 0 && (
        <section className="bg-white border-t border-slate-100 py-9 sm:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-site-primary mb-1.5">
              Why Consult Our Astrologers?
            </h2>
            <p className="text-xs text-site-muted mb-7 max-w-sm mx-auto">
              Ancient wisdom with personalised guidance for every aspect of life.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '🔮', t: 'Vedic Expertise', d: 'Trained in traditional Jyotish with decades of combined experience.' },
                { icon: '🕊️', t: 'Private & Confidential', d: 'Your birth details are handled with complete discretion.' },
                { icon: '📞', t: 'Personal Follow-up', d: 'Our team calls you directly to schedule your session.' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="rounded-xl border border-site-accent-dark/10 bg-amber-50/50 p-4 text-left">
                  <span className="text-2xl leading-none block mb-2">{icon}</span>
                  <p className="font-heading text-sm font-extrabold text-site-primary mb-0.5">{t}</p>
                  <p className="text-xs text-site-muted leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Modals ───────────────────────────────────────── */}
      {selected && (
        <LeadModal
          astrologer={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}
      {showConfirm && (
        <ConfirmationModal
          astrologerName={confirmedName}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
