import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, ImagePlus, Loader2 } from 'lucide-react';
import toast from '@/utils/toast';
import { uploadImage } from '../utils/uploadMedia';
import {
  OFFER_TYPES,
  OFFER_TYPE_LABELS,
  fetchAdminOffers,
  saveOffer,
  deleteOffer,
  formatOfferDate,
} from '../utils/offerApi';

const defaultOffer = {
  title: '',
  subtitle: '',
  description: '',
  type: 'money_coupon',
  discount: '',
  discountValue: '',
  couponCode: '',
  thumbnail: '',
  ctaLabel: 'Claim Offer',
  ctaLink: '/book-consultation',
  showOnSite: true,
  priority: '0',
  validFrom: new Date().toISOString().slice(0, 10),
  validTill: '',
  isActive: true,
};

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultOffer);

  const token = () => localStorage.getItem('adminToken');

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchAdminOffers(token());
      setOffers(list);
    } catch (err) {
      toast.error(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultOffer);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'offers');
      setForm((prev) => ({ ...prev, thumbnail: url }));
      toast.success('Thumbnail uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.validTill) {
      toast.error('Valid till date is required');
      return;
    }

    setSaving(true);
    try {
      await saveOffer(
        token(),
        {
          ...form,
          discountValue: Number(form.discountValue) || 0,
          priority: Number(form.priority) || 0,
        },
        editingId
      );
      toast.success(editingId ? 'Offer updated' : 'Offer created');
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      subtitle: offer.subtitle || '',
      description: offer.description || '',
      type: offer.type || 'custom',
      discount: offer.discount || '',
      discountValue: String(offer.discountValue ?? ''),
      couponCode: offer.couponCode || '',
      thumbnail: offer.thumbnail || '',
      ctaLabel: offer.ctaLabel || 'Claim Offer',
      ctaLink: offer.ctaLink || '',
      showOnSite: offer.showOnSite !== false,
      priority: String(offer.priority ?? 0),
      validFrom: offer.validFrom
        ? new Date(offer.validFrom).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      validTill: offer.validTill
        ? new Date(offer.validTill).toISOString().slice(0, 10)
        : '',
      isActive: offer.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer permanently?')) return;
    try {
      await deleteOffer(token(), id);
      toast.success('Offer removed');
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg font-bold text-slate-800">Site Offers &amp; Popups</h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Money coupons, first chat free, thumbnails — shown in a Tailwind popup when active.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          New offer
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <h3 className="m-0 mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          {editingId ? 'Edit offer' : 'Create offer'}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. First consultation chat FREE"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Offer type</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              {OFFER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Display badge</span>
            <input
              name="discount"
              value={form.discount}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="e.g. 20% OFF or ₹500 OFF"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Numeric value (optional)</span>
            <input
              name="discountValue"
              type="number"
              min="0"
              value={form.discountValue}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="500 or 20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Coupon code</span>
            <input
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase outline-none focus:border-indigo-400"
              placeholder="ASTRO500"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Subtitle</span>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="Short hook under the title"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="Details shown in the popup card"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">CTA label</span>
            <input
              name="ctaLabel"
              value={form.ctaLabel}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">CTA link (site path)</span>
            <input
              name="ctaLink"
              value={form.ctaLink}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="/book-consultation or /courses"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Valid from</span>
            <input
              name="validFrom"
              type="date"
              value={form.validFrom}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Valid till *</span>
            <input
              name="validTill"
              type="date"
              value={form.validTill}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">Priority (higher first)</span>
            <input
              name="priority"
              type="number"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </label>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="showOnSite"
                checked={form.showOnSite}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              Show in site popup
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />
              Active
            </label>
          </div>

          <div className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-slate-600">Thumbnail</span>
            <div className="flex flex-wrap items-start gap-4">
              {form.thumbnail ? (
                <img
                  src={form.thumbnail}
                  alt=""
                  className="h-24 w-36 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-36 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                  No image
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                Upload thumbnail
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} disabled={uploading} />
              </label>
              {form.thumbnail ? (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, thumbnail: '' }))}
                  className="text-sm font-medium text-rose-600"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {editingId ? 'Update offer' : 'Publish offer'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="m-0 text-sm font-bold text-slate-700">All offers ({offers.length})</h3>
        </div>
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-500">Loading…</p>
        ) : offers.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">No offers yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">Offer</th>
                  <th className="px-4 py-2 font-semibold">Type</th>
                  <th className="px-4 py-2 font-semibold">Popup</th>
                  <th className="px-4 py-2 font-semibold">Valid till</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {offer.thumbnail ? (
                          <img src={offer.thumbnail} alt="" className="h-10 w-14 rounded object-cover" />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100 text-[10px] text-slate-400">
                            —
                          </div>
                        )}
                        <div>
                          <p className="m-0 font-semibold text-slate-800">{offer.title}</p>
                          {offer.couponCode ? (
                            <p className="m-0 font-mono text-xs text-indigo-600">{offer.couponCode}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {OFFER_TYPE_LABELS[offer.type] || offer.type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          offer.showOnSite ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {offer.showOnSite ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatOfferDate(offer.validTill)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          offer.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(offer)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                          aria-label="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(offer._id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOffers;
