import { useState, useEffect } from 'react';
import API_BASE from '../utils/api';

/* ─── Lead form ─── */
const EMPTY_LEAD = {
  name: '',
  phone: '',
  email: '',
  pob: '',
  dob: '',
  tob: '',
};

function StarRating({ value }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" className={`w-3.5 h-3.5 ${s <= Math.round(value) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function LeadModal({ astrologer, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_LEAD);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.tob) e.tob = 'Time of birth is required';
    if (!form.pob.trim()) e.pob = 'Place of birth is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        pob: form.pob.trim(),
        dob: form.dob,
        tob: form.tob,
        type: 'Consultation',
        leadType: 'ASTROLOGER ENQUIRY',
        consultationType: astrologer?.name || 'Astrologer Consultation',
        message: `Consultation request for ${astrologer?.name || 'astrologer'}. POB: ${form.pob}. DOB: ${form.dob}. TOB: ${form.tob}.`,
        paymentStatus: 'NOT REQUIRED',
      };

      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        onSuccess();
      } else {
        setErrors({ submit: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Book Consultation</p>
            <h2 className="text-[17px] font-bold text-slate-800">
              {astrologer ? `Connect with ${astrologer.name}` : 'Request a Consultation'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Share your details — our team will call to confirm</p>
          </div>
          <button onClick={onClose} className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Your full name"
              className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number *</label>
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="10-digit mobile number"
                inputMode="tel"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 ${errors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}`}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email <span className="font-normal text-slate-400">(optional)</span></label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 bg-white"
              />
            </div>
          </div>

          {/* DOB + TOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date of Birth *</label>
              <input
                type="date"
                value={form.dob}
                onChange={e => set('dob', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 ${errors.dob ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}`}
              />
              {errors.dob && <p className="text-xs text-rose-500 mt-1">{errors.dob}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time of Birth *</label>
              <input
                type="time"
                value={form.tob}
                onChange={e => set('tob', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 ${errors.tob ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}`}
              />
              {errors.tob && <p className="text-xs text-rose-500 mt-1">{errors.tob}</p>}
            </div>
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Place of Birth *</label>
            <input
              value={form.pob}
              onChange={e => set('pob', e.target.value)}
              placeholder="City, State, Country"
              className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 ${errors.pob ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}`}
            />
            {errors.pob && <p className="text-xs text-rose-500 mt-1">{errors.pob}</p>}
          </div>

          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl px-4 py-3">
              {errors.submit}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
          >
            {submitting
              ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending…</>
              : 'Request Consultation'
            }
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3">
            We respect your privacy. Your details are kept confidential.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({ astrologerName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-amber-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[19px] font-bold text-slate-800 mb-2">Request Received!</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-1">
          Thank you for reaching out.
        </p>
        <p className="text-sm font-semibold text-amber-700 mb-5">
          One of our consultants will call you shortly to confirm your session{astrologerName ? ` with ${astrologerName}` : ''}.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Expect a call within 24 hours
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function AstrologerCard({ astrologer, onConsult }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {astrologer.image ? (
          <img
            src={astrologer.image}
            alt={astrologer.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-inner">
              <span className="text-4xl font-bold text-amber-700">
                {astrologer.name?.[0] || '?'}
              </span>
            </div>
          </div>
        )}
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-amber-400" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-slate-700">{astrologer.rating?.toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">({astrologer.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{astrologer.name}</h3>
          <p className="text-xs font-semibold text-amber-600 mt-0.5">{astrologer.role}</p>
        </div>

        {astrologer.bio && (
          <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{astrologer.bio}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {astrologer.experience}+ years
          </span>
          <StarRating value={astrologer.rating} />
        </div>

        {/* Languages */}
        {astrologer.languages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {astrologer.languages.map((lang) => (
              <span key={lang} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {lang}
              </span>
            ))}
          </div>
        )}

        {/* Specialties */}
        {astrologer.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {astrologer.specialties.map((spec) => (
              <span key={spec} className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={() => onConsult(astrologer)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-100 active:scale-95"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Astrologer() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmedName, setConfirmedName] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/astrologers`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setAstrologers(data.astrologers);
        else setError('Could not load astrologers at this time.');
      })
      .catch(() => setError('Could not load astrologers at this time.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = () => {
    setConfirmedName(selected?.name || '');
    setSelected(null);
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf4] to-[#fff8ee]">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Our Expert Astrologers
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Guidance from the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Stars
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Connect with our certified Vedic astrologers for personalized insights into your life, career, relationships, and destiny.
          </p>
        </div>
      </section>

      {/* Astrologers Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading astrologers…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-rose-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">Our astrologers are being updated.</p>
            <p className="text-slate-400 text-xs mt-1">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {astrologers.map(a => (
              <AstrologerCard key={a._id} astrologer={a} onConsult={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* Why consult section */}
      {!loading && !error && astrologers.length > 0 && (
        <section className="bg-white border-t border-slate-100 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Why Consult Our Astrologers?</h2>
            <p className="text-sm text-slate-400 mb-10 max-w-md mx-auto">Ancient wisdom combined with personalized guidance for every aspect of your life</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '🔮', title: 'Vedic Expertise', desc: 'Trained in traditional Jyotish with decades of combined experience' },
                { icon: '🕊️', title: 'Private & Confidential', desc: 'All sessions and your personal data are kept completely private' },
                { icon: '📞', title: 'Personal Follow-up', desc: 'Our team calls you directly to schedule your consultation' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-amber-50/60 rounded-2xl p-6 text-left">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Modal */}
      {selected && (
        <LeadModal
          astrologer={selected}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <ConfirmationModal
          astrologerName={confirmedName}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
