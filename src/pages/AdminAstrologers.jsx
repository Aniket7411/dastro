import { useState, useEffect, useRef } from 'react';
import API_BASE from '../utils/api';
import { uploadImage } from '../utils/uploadMedia';

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  name: '', email: '', password: '', role: 'Vedic Astrologer',
  experience: 5, bio: '', rating: 4.5, reviews: 0,
  languages: '', specialties: '', image: '', isActive: true,
  order: 0, freeMinutesOverride: '',
};

const token = () => localStorage.getItem('adminToken');
const authH  = () => ({ Authorization: `Bearer ${token()}` });
const jsonH  = () => ({ 'Content-Type': 'application/json', ...authH() });

/* ─────────────────────────────────────────────────────────
   Toast (internal — success/error with cause)
───────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] max-w-xs pointer-events-auto
            ${t.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
        >
          <span className="mt-0.5 shrink-0">{t.type === 'success' ? '✓' : '✕'}</span>
          <div>
            <p className="font-semibold">{t.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="font-normal opacity-90 leading-snug">{t.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (message, type = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  return { toasts, success: (m) => push(m, 'success'), error: (m) => push(m, 'error') };
}

/* ─────────────────────────────────────────────────────────
   Image Upload Field
───────────────────────────────────────────────────────── */
function ImageUploadField({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, 'astrologers');
      onChange(url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Profile Photo</label>
      {value ? (
        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
          <img src={value} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{value.split('/').pop()}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50">
                {uploading ? 'Uploading…' : 'Replace'}
              </button>
              <button type="button" onClick={() => onChange('')}
                className="px-3 py-1 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="w-full flex flex-col items-center gap-1.5 border-2 border-dashed border-slate-200 rounded-xl py-5 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/40 transition-all disabled:opacity-50">
          {uploading
            ? <span className="text-xs">Uploading…</span>
            : <><span className="text-xl">☁</span><span className="text-xs font-semibold">Click to upload photo</span><span className="text-[11px]">JPG, PNG, WebP · max 5 MB</span></>}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {uploadError && <p className="text-xs text-rose-500 mt-1">{uploadError}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Add / Edit Modal
───────────────────────────────────────────────────────── */
function AstrologerModal({ astrologer, onClose, onSave, saving }) {
  const formRef = useRef(null);
  const isEdit  = !!astrologer;
  const [form, setForm] = useState(
    isEdit
      ? {
          ...EMPTY_FORM, ...astrologer,
          password: '',
          languages:  Array.isArray(astrologer.languages)  ? astrologer.languages.join(', ')  : '',
          specialties: Array.isArray(astrologer.specialties) ? astrologer.specialties.join(', ') : '',
          freeMinutesOverride: astrologer.freeMinutesOverride ?? '',
        }
      : { ...EMPTY_FORM }
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      experience: Number(form.experience) || 0,
      rating:     Number(form.rating)     || 4.5,
      reviews:    Number(form.reviews)    || 0,
      order:      Number(form.order)      || 0,
      freeMinutesOverride: form.freeMinutesOverride !== '' ? Number(form.freeMinutesOverride) : null,
      languages:   form.languages   ? form.languages.split(',').map((s) => s.trim()).filter(Boolean)   : [],
      specialties: form.specialties ? form.specialties.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    // Don't send blank password on edit
    if (isEdit && !payload.password) delete payload.password;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <h2 className="text-[15px] font-bold text-slate-800">{isEdit ? 'Edit Astrologer' : 'Add Astrologer'}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">✕</button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-3.5">
          <ImageUploadField value={form.image} onChange={(url) => set('image', url)} />

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Pt. Rajesh Sharma"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Login Email *</label>
              <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="astrologer@email.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isEdit ? 'New Password (leave blank to keep current)' : 'Initial Password *'}
            </label>
            <input
              type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
              placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
              required={!isEdit} minLength={6}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {!isEdit && <p className="text-[11px] text-slate-400 mt-1">Share these credentials with the astrologer securely.</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Title</label>
            <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Vedic Astrologer"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={2} placeholder="Short description…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Exp. (yrs)', key: 'experience', min: 0, max: 100 },
              { label: 'Rating (0–5)', key: 'rating', min: 0, max: 5, step: 0.1 },
              { label: 'Reviews', key: 'reviews', min: 0 },
              { label: 'Order', key: 'order', min: 0 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                <input type="number" min={min} max={max} step={step} value={form[key]} onChange={(e) => set(key, e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            ))}
          </div>

          {/* Free minutes override */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Free Minutes Override <span className="font-normal text-slate-400">(blank = use global setting)</span>
            </label>
            <input type="number" min={0} max={60} value={form.freeMinutesOverride} onChange={(e) => set('freeMinutesOverride', e.target.value)}
              placeholder="Leave blank for global"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          {/* Languages + Specialties */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Languages <span className="font-normal text-slate-400">(comma-separated)</span></label>
            <input value={form.languages} onChange={(e) => set('languages', e.target.value)} placeholder="e.g. Hindi, English"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Specialties <span className="font-normal text-slate-400">(comma-separated)</span></label>
            <input value={form.specialties} onChange={(e) => set('specialties', e.target.value)} placeholder="e.g. Kundali, Vastu"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 rounded accent-indigo-500" />
            <span className="text-sm font-medium text-slate-700">Active (visible on site)</span>
          </label>
        </form>

        <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end gap-2.5 shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={() => formRef.current?.requestSubmit()}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
            {saving && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
            {isEdit ? 'Save Changes' : 'Add Astrologer'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Reset Password Modal
───────────────────────────────────────────────────────── */
function ResetPasswordModal({ astrologer, onClose, onReset, saving }) {
  const [newPassword, setNewPassword] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <h3 className="text-[15px] font-bold text-slate-800 mb-1">Reset Password</h3>
        <p className="text-xs text-slate-500 mb-4">Set a new password for <strong>{astrologer.name}</strong> ({astrologer.email})</p>
        <input
          type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min 6 chars)" minLength={6}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2.5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => onReset(newPassword)} disabled={saving || newPassword.length < 6}
            className="flex-1 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Suspend Modal
───────────────────────────────────────────────────────── */
function SuspendModal({ astrologer, onClose, onConfirm, saving }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-amber-600 text-lg">⚠</span>
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 text-center mb-1">Suspend Astrologer?</h3>
        <p className="text-xs text-slate-500 text-center mb-4"><strong>{astrologer.name}</strong> won't be able to log in or appear online.</p>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional — shown to astrologer on login)"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <div className="flex gap-2.5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)} disabled={saving}
            className="flex-1 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Delete Confirm Modal
───────────────────────────────────────────────────────── */
function DeleteConfirm({ name, onConfirm, onClose, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 text-center">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-rose-500 text-lg">🗑</span>
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 mb-1">Delete Astrologer?</h3>
        <p className="text-sm text-slate-500 mb-5"><strong>{name}</strong> will be permanently removed.</p>
        <div className="flex gap-2.5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2 text-sm font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {deleting && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Live Settings Panel
───────────────────────────────────────────────────────── */
function LiveSettingsPanel({ onToast }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [local,   setLocal]     = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/live-settings`, { headers: authH() })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setSettings(d.settings); setLocal(d.settings); }
        else onToast(d.message || 'Failed to load live settings', 'error');
      })
      .catch(() => onToast('Network error loading live settings', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/live-settings`, { method: 'PUT', headers: jsonH(), body: JSON.stringify(local) });
      const data = await res.json();
      if (data.success) { setSettings(data.settings); onToast('Live settings saved'); }
      else onToast(data.message || 'Failed to save', 'error');
    } catch { onToast('Network error', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-6 text-center text-sm text-slate-400">Loading settings…</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-slate-800">Live Chat Settings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Global Free Minutes</label>
          <input type="number" min={0} max={60} value={local.freeMinutes ?? 3}
            onChange={(e) => setLocal((p) => ({ ...p, freeMinutes: Number(e.target.value) }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <p className="text-[11px] text-slate-400 mt-1">Each user gets this many free minutes per session (per astrologer overrides this)</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Max Users / Astrologer</label>
          <input type="number" min={1} max={10} value={local.maxConcurrentUsersPerAstrologer ?? 1}
            onChange={(e) => setLocal((p) => ({ ...p, maxConcurrentUsersPerAstrologer: Number(e.target.value) }))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={!!local.chatEnabled} onChange={(e) => setLocal((p) => ({ ...p, chatEnabled: e.target.checked }))}
            className="w-4 h-4 rounded accent-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Chat Enabled</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={!!local.isPaymentEnforced} onChange={(e) => setLocal((p) => ({ ...p, isPaymentEnforced: e.target.checked }))}
            className="w-4 h-4 rounded accent-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Enforce Payment After Free Time</span>
          <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Keep OFF until payment live</span>
        </label>
      </div>

      <button onClick={save} disabled={saving}
        className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
        {saving && <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
        Save Settings
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Astrologer Card
───────────────────────────────────────────────────────── */
function AstrologerCard({ a, onEdit, onDelete, onSuspend, onUnsuspend, onResetPassword, actionLoading }) {
  const isBusy = actionLoading === a._id;
  return (
    <div className={`bg-white border rounded-xl p-4 flex gap-3 hover:shadow-sm transition-shadow ${a.isSuspended ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
      {/* Avatar + status dot */}
      <div className="shrink-0 relative">
        {a.image
          ? <img src={a.image} alt={a.name} className="w-14 h-14 rounded-xl object-cover border border-slate-100" />
          : <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-400">{a.name?.[0] || '?'}</span>
            </div>
        }
        {/* Online / offline dot */}
        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${a.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} title={a.isOnline ? 'Online' : 'Offline'} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{a.role}</p>
            <p className="text-[11px] text-slate-400 truncate">{a.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isSuspended ? 'bg-amber-100 text-amber-700' : a.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {a.isSuspended ? 'Suspended' : a.isActive ? 'Active' : 'Hidden'}
            </span>
            {a.isOnline && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Online</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
          <span>⭐ {a.rating} ({a.reviews})</span>
          <span>{a.experience}+ yrs</span>
          <span>{a.sessionCount || 0} sessions</span>
        </div>

        {a.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {a.specialties.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-medium">{s}</span>
            ))}
            {a.specialties.length > 3 && <span className="text-[10px] text-slate-400">+{a.specialties.length - 3}</span>}
          </div>
        )}

        {a.isSuspended && a.suspendedReason && (
          <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mb-2">Reason: {a.suspendedReason}</p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => onEdit(a)} disabled={isBusy}
            className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50">
            Edit
          </button>
          <button onClick={() => onResetPassword(a)} disabled={isBusy}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
            Reset PW
          </button>
          {a.isSuspended
            ? <button onClick={() => onUnsuspend(a)} disabled={isBusy}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50">
                {isBusy ? '…' : 'Unsuspend'}
              </button>
            : <button onClick={() => onSuspend(a)} disabled={isBusy}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50">
                Suspend
              </button>
          }
          <button onClick={() => onDelete(a)} disabled={isBusy}
            className="px-2.5 py-1 text-[11px] font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
export default function AdminAstrologers() {
  const { toasts, success, error } = useToast();

  const [astrologers,  setAstrologers]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchErr,     setFetchErr]     = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [suspendTarget,setSuspendTarget]= useState(null);
  const [resetTarget,  setResetTarget]  = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [actionLoading,setActionLoading]= useState(null); // astrologer._id being acted on
  const [tab,          setTab]          = useState('astrologers'); // 'astrologers' | 'settings'

  const fetchAstrologers = async () => {
    setLoading(true); setFetchErr('');
    try {
      const res  = await fetch(`${API_BASE}/api/admin/astrologers`, { headers: authH() });
      const data = await res.json();
      if (data.success) setAstrologers(data.astrologers);
      else setFetchErr(data.message || 'Failed to load astrologers');
    } catch { setFetchErr('Network error — check your connection'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAstrologers(); }, []);

  /* ── Save (create / update) ── */
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const url    = editing ? `${API_BASE}/api/admin/astrologers/${editing._id}` : `${API_BASE}/api/admin/astrologers`;
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: jsonH(), body: JSON.stringify(payload) });
      const data   = await res.json();
      if (data.success) {
        success(editing ? 'Astrologer updated!' : 'Astrologer added!');
        setModalOpen(false); setEditing(null);
        fetchAstrologers();
      } else {
        error(data.message || 'Save failed');
      }
    } catch { error('Network error — could not save'); }
    finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/astrologers/${deleteTarget._id}`, { method: 'DELETE', headers: authH() });
      const data = await res.json();
      if (data.success) { success('Astrologer deleted'); setDeleteTarget(null); fetchAstrologers(); }
      else error(data.message || 'Delete failed');
    } catch { error('Network error — could not delete'); }
    finally { setDeleting(false); }
  };

  /* ── Suspend ── */
  const handleSuspend = async (reason) => {
    if (!suspendTarget) return;
    setActionLoading(suspendTarget._id);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/astrologers/${suspendTarget._id}/suspend`, { method: 'PUT', headers: jsonH(), body: JSON.stringify({ reason }) });
      const data = await res.json();
      if (data.success) { success(data.message); setSuspendTarget(null); fetchAstrologers(); }
      else error(data.message || 'Suspend failed');
    } catch { error('Network error'); }
    finally { setActionLoading(null); }
  };

  /* ── Unsuspend ── */
  const handleUnsuspend = async (a) => {
    setActionLoading(a._id);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/astrologers/${a._id}/unsuspend`, { method: 'PUT', headers: jsonH() });
      const data = await res.json();
      if (data.success) { success(data.message); fetchAstrologers(); }
      else error(data.message || 'Unsuspend failed');
    } catch { error('Network error'); }
    finally { setActionLoading(null); }
  };

  /* ── Reset Password ── */
  const handleResetPassword = async (newPassword) => {
    if (!resetTarget) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/api/admin/astrologers/${resetTarget._id}/reset-password`, { method: 'PUT', headers: jsonH(), body: JSON.stringify({ newPassword }) });
      const data = await res.json();
      if (data.success) { success(data.message); setResetTarget(null); }
      else error(data.message || 'Reset failed');
    } catch { error('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[17px] font-bold text-slate-800">Astrologers & Live Chat</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage astrologers, credentials, suspensions, and live chat settings</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          + Add Astrologer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[['astrologers', 'Astrologers'], ['settings', 'Live Settings']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${tab === key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Astrologers */}
      {tab === 'astrologers' && (
        loading ? (
          <div className="flex items-center justify-center py-14 gap-3 text-slate-400">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full" />
            <span className="text-sm">Loading astrologers…</span>
          </div>
        ) : fetchErr ? (
          <div className="text-center py-14">
            <p className="text-sm text-rose-500 font-medium">{fetchErr}</p>
            <button onClick={fetchAstrologers} className="mt-3 px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">Retry</button>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-sm font-medium text-slate-500">No astrologers yet</p>
            <p className="text-xs text-slate-400 mt-1">Add your first astrologer to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {astrologers.map((a) => (
              <AstrologerCard key={a._id} a={a}
                onEdit={(x)           => { setEditing(x); setModalOpen(true); }}
                onDelete={(x)         => setDeleteTarget(x)}
                onSuspend={(x)        => setSuspendTarget(x)}
                onUnsuspend={handleUnsuspend}
                onResetPassword={(x)  => setResetTarget(x)}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )
      )}

      {/* Tab: Live Settings */}
      {tab === 'settings' && <LiveSettingsPanel onToast={(msg, type = 'success') => type === 'error' ? error(msg) : success(msg)} />}

      {/* Modals */}
      {modalOpen && (
        <AstrologerModal astrologer={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} saving={saving} />
      )}
      {deleteTarget && (
        <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} deleting={deleting} />
      )}
      {suspendTarget && (
        <SuspendModal astrologer={suspendTarget} onClose={() => setSuspendTarget(null)} onConfirm={handleSuspend} saving={!!actionLoading} />
      )}
      {resetTarget && (
        <ResetPasswordModal astrologer={resetTarget} onClose={() => setResetTarget(null)} onReset={handleResetPassword} saving={saving} />
      )}
    </div>
  );
}
