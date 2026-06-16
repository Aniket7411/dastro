import { useState, useEffect, useRef } from 'react';
import API_BASE from '../utils/api';
import { uploadImage } from '../utils/uploadMedia';

const EMPTY_FORM = {
  name: '',
  role: 'Vedic Astrologer',
  experience: 5,
  bio: '',
  rating: 4.5,
  reviews: 0,
  languages: '',
  specialties: '',
  image: '',
  isActive: true,
  order: 0,
};

/* ─── Image Upload Field ─── */
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
      <label className="block text-xs font-semibold text-slate-600 mb-2">Profile Photo</label>

      {value ? (
        /* Preview */
        <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50">
          <img
            src={value}
            alt="Preview"
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs text-slate-500 truncate max-w-[200px]">{value.split('/').pop()}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? <><i className="fas fa-circle-notch fa-spin" /> Uploading…</>
                  : <><i className="fas fa-upload" /> Replace</>
                }
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <i className="fas fa-trash-alt" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 px-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/40 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <>
              <i className="fas fa-circle-notch fa-spin text-xl" />
              <span className="text-xs font-medium">Uploading to Supabase…</span>
            </>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt text-2xl" />
              <span className="text-xs font-semibold">Click to upload photo</span>
              <span className="text-[11px]">JPG, PNG, WebP · max 5 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {uploadError && (
        <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
          <i className="fas fa-exclamation-circle" /> {uploadError}
        </p>
      )}
    </div>
  );
}

/* ─── Add / Edit Modal ─── */
function AstrologerModal({ astrologer, onClose, onSave, saving }) {
  const formRef = useRef(null);
  const [form, setForm] = useState(
    astrologer
      ? {
          ...astrologer,
          languages: Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : '',
          specialties: Array.isArray(astrologer.specialties) ? astrologer.specialties.join(', ') : '',
        }
      : EMPTY_FORM
  );

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      experience: Number(form.experience) || 0,
      rating: Number(form.rating) || 4.5,
      reviews: Number(form.reviews) || 0,
      order: Number(form.order) || 0,
      languages: form.languages ? form.languages.split(',').map(s => s.trim()).filter(Boolean) : [],
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-[15px] font-bold text-slate-800">
            {astrologer ? 'Edit Astrologer' : 'Add Astrologer'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Scrollable body */}
        <form ref={formRef} onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Image upload */}
          <ImageUploadField value={form.image} onChange={url => set('image', url)} />

          {/* Name + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Pt. Rajesh Sharma"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Title</label>
              <input
                value={form.role}
                onChange={e => set('role', e.target.value)}
                placeholder="e.g. Vedic Astrologer"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              rows={3}
              placeholder="Short description about the astrologer..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Exp. (yrs)</label>
              <input
                type="number" min="0" max="100"
                value={form.experience}
                onChange={e => set('experience', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rating (0–5)</label>
              <input
                type="number" min="0" max="5" step="0.1"
                value={form.rating}
                onChange={e => set('rating', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reviews</label>
              <input
                type="number" min="0"
                value={form.reviews}
                onChange={e => set('reviews', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Order</label>
              <input
                type="number" min="0"
                value={form.order}
                onChange={e => set('order', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Languages <span className="font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              value={form.languages}
              onChange={e => set('languages', e.target.value)}
              placeholder="e.g. Hindi, English, Sanskrit"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Specialties <span className="font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              value={form.specialties}
              onChange={e => set('specialties', e.target.value)}
              placeholder="e.g. Kundali, Vastu, Numerology"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => set('isActive', e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Active (visible on site)</span>
          </label>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => formRef.current?.requestSubmit()}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving && <i className="fas fa-circle-notch fa-spin text-xs" />}
            {astrologer ? 'Save Changes' : 'Add Astrologer'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─── */
function DeleteConfirm({ name, onConfirm, onClose, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash-alt text-rose-500 text-lg" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 mb-2">Delete Astrologer?</h3>
        <p className="text-sm text-slate-500 mb-6">
          <strong>{name}</strong> will be permanently removed from your site.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2 text-sm font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {deleting && <i className="fas fa-circle-notch fa-spin text-xs" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminAstrologers() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const token = () => localStorage.getItem('adminToken');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/astrologers`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setAstrologers(data.astrologers);
      else setError(data.message || 'Failed to load astrologers');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAstrologers(); }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const url = editing
        ? `${API_BASE}/api/admin/astrologers/${editing._id}`
        : `${API_BASE}/api/admin/astrologers`;
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editing ? 'Astrologer updated!' : 'Astrologer added!');
        setModalOpen(false);
        setEditing(null);
        fetchAstrologers();
      } else {
        showToast(data.message || 'Save failed');
      }
    } catch {
      showToast('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/astrologers/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Astrologer deleted');
        setDeleteTarget(null);
        fetchAstrologers();
      } else {
        showToast(data.message || 'Delete failed');
      }
    } catch {
      showToast('Network error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[17px] font-bold text-slate-800">Astrologers</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage the astrologers displayed on your site</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <i className="fas fa-plus" />
          Add Astrologer
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <i className="fas fa-check-circle text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
          <i className="fas fa-circle-notch fa-spin" />
          <span className="text-sm">Loading astrologers…</span>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-rose-500 text-sm">{error}</div>
      ) : astrologers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-astronaut text-slate-400 text-xl" />
          </div>
          <p className="text-sm font-medium text-slate-500">No astrologers yet</p>
          <p className="text-xs text-slate-400 mt-1">Add your first astrologer to display them on the site</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {astrologers.map((a) => (
            <div key={a._id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-start hover:shadow-sm transition-shadow">

              {/* Avatar */}
              <div className="flex-shrink-0">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-400">
                      {a.name?.[0] || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
                    <p className="text-xs text-slate-500 truncate">{a.role}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {a.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-star text-amber-400 text-[10px]" />
                    {a.rating} ({a.reviews})
                  </span>
                  <span>{a.experience}+ yrs</span>
                </div>

                {a.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                    {a.specialties.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{a.specialties.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setEditing(a); setModalOpen(true); }}
                    className="flex-1 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <i className="fas fa-edit mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(a)}
                    className="flex-1 py-1.5 text-xs font-semibold text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <i className="fas fa-trash-alt mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AstrologerModal
          astrologer={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
