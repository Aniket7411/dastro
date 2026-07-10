import { useCallback, useEffect, useState } from 'react';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';

function slugifyPreview(name = '') {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCourseCategories({ embedded = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sortOrder: 0 });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem('adminToken');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/course-categories`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
      else toast.error(data.message || 'Failed to load categories');
    } catch {
      toast.error('Failed to load course categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', sortOrder: 0 });
    setEditingId(null);
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sortOrder: cat.sortOrder ?? 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `${API_BASE}/api/admin/course-categories/${editingId}`
        : `${API_BASE}/api/admin/course-categories`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim() || slugifyPreview(form.name),
          description: form.description,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? 'Category updated' : 'Category created');
        resetForm();
        loadCategories();
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this category?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/course-categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Category deactivated');
        loadCategories();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className={embedded ? '' : 'p-4 md:p-6'}>
      {!embedded && (
        <div className="mb-6">
          <h2 className="m-0 text-xl font-bold text-slate-900">Course Categories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Subject categories for filtering (e.g. Vedic Astrology, Tarot). Course type Live/Recorded is set per course.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Name</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((f) => ({
              ...f,
              name: e.target.value,
              slug: editingId ? f.slug : slugifyPreview(e.target.value),
            }))}
            placeholder="Vedic Astrology"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Slug</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="vedic-astrology"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-slate-700">Description</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <div className="flex flex-wrap items-end gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Update category' : 'Add category'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading categories…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-slate-500">No categories yet. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cat.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(cat)} className="text-xs font-semibold text-blue-600">
                        Edit
                      </button>
                      {cat.isActive && (
                        <button type="button" onClick={() => handleDelete(cat._id)} className="text-xs font-semibold text-red-600">
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
