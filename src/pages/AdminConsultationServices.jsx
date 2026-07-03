import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from '@/utils/toast';
import { Plus, Edit2, Trash2, UploadCloud, Layers, LayoutGrid, RefreshCw, X, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../utils/api';
import { uploadImage } from '../utils/uploadMedia';
import { formatINR } from '../utils/currency';

const EMPTY_CATEGORY = {
  name: '',
  slug: '',
  icon: 'fa-star',
  description: '',
  sortOrder: '0',
  isActive: true,
};

const EMPTY_SERVICE = {
  categorySlug: '',
  title: '',
  slug: '',
  short: '',
  desc: '',
  price: '',
  mrp: '',
  duration: '',
  badge: '',
  badgeColor: 'purple',
  img: '',
  highlightsText: '',
  sortOrder: '0',
  isActive: true,
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

// Glassmorphic Input Class
const inputClass = "w-full px-4 py-2.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-inner rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-white outline-none transition-all duration-300 text-slate-800 placeholder-slate-400";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5 ml-1 flex items-center gap-1.5";

export default function AdminConsultationServices() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingCategorySlug, setEditingCategorySlug] = useState(null);
  const [editingServiceSlug, setEditingServiceSlug] = useState(null);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [activePanel, setActivePanel] = useState('services');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('All');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const filteredServices = useMemo(() => {
    if (serviceCategoryFilter === 'All') return services;
    return services.filter((svc) => (svc.categoryId || svc.categorySlug) === serviceCategoryFilter);
  }, [services, serviceCategoryFilter]);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/consultation-catalog`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setServices(data.services || []);
      } else {
        toast.error(data.message || 'Failed to load catalog');
      }
    } catch {
      toast.error('Failed to load consultation catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const resetCategoryForm = () => {
    setEditingCategorySlug(null);
    setCategoryForm(EMPTY_CATEGORY);
  };

  const resetServiceForm = () => {
    setEditingServiceSlug(null);
    setServiceForm(EMPTY_SERVICE);
  };

  const openNewCategory = () => {
    resetCategoryForm();
    setShowCategoryModal(true);
  };

  const openNewService = () => {
    resetServiceForm();
    setShowServiceModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    resetCategoryForm();
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    resetServiceForm();
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const url = editingCategorySlug
        ? `${API_BASE}/api/admin/consultation-categories/${editingCategorySlug}`
        : `${API_BASE}/api/admin/consultation-categories`;
      const res = await fetch(url, {
        method: editingCategorySlug ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...categoryForm,
          sortOrder: Number(categoryForm.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingCategorySlug ? 'Category updated' : 'Category created');
        resetCategoryForm();
        setShowCategoryModal(false);
        loadCatalog();
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.categorySlug || !serviceForm.title.trim() || !serviceForm.desc.trim()) {
      toast.error('Category, title, and description are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...serviceForm,
        price: Number(serviceForm.price),
        mrp: Number(serviceForm.mrp) || 0,
        sortOrder: Number(serviceForm.sortOrder) || 0,
        highlights: serviceForm.highlightsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      };
      delete payload.highlightsText;

      const url = editingServiceSlug
        ? `${API_BASE}/api/admin/consultation-services/${editingServiceSlug}`
        : `${API_BASE}/api/admin/consultation-services`;
      const res = await fetch(url, {
        method: editingServiceSlug ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingServiceSlug ? 'Service updated' : 'Service created');
        resetServiceForm();
        setShowServiceModal(false);
        loadCatalog();
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const editCategory = (cat) => {
    setEditingCategorySlug(cat.slug || cat.id);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || cat.id,
      icon: cat.icon || 'fa-star',
      description: cat.description || '',
      sortOrder: String(cat.sortOrder ?? 0),
      isActive: cat.isActive !== false,
    });
    setShowCategoryModal(true);
  };

  const editService = (svc) => {
    setEditingServiceSlug(svc.slug || svc.id);
    setServiceForm({
      categorySlug: svc.categoryId || svc.categorySlug,
      title: svc.title,
      slug: svc.slug || svc.id,
      short: svc.short || '',
      desc: svc.desc || '',
      price: String(svc.price ?? ''),
      mrp: String(svc.mrp ?? ''),
      duration: svc.duration || '',
      badge: svc.badge || '',
      badgeColor: svc.badgeColor || 'purple',
      img: svc.img || '',
      highlightsText: (svc.highlights || []).join('\n'),
      sortOrder: String(svc.sortOrder ?? 0),
      isActive: svc.isActive !== false,
    });
    setShowServiceModal(true);
  };

  const deleteCategory = async (slug) => {
    if (!window.confirm('Delete this category? It must have no services.')) return;
    const res = await fetch(`${API_BASE}/api/admin/consultation-categories/${slug}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Category deleted');
      loadCatalog();
    } else {
      toast.error(data.message || 'Delete failed');
    }
  };

  const deleteService = async (slug) => {
    if (!window.confirm('Delete this consultation service?')) return;
    const res = await fetch(`${API_BASE}/api/admin/consultation-services/${slug}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Service deleted');
      loadCatalog();
    } else {
      toast.error(data.message || 'Delete failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'consultation-services');
      setServiceForm((prev) => ({ ...prev, img: url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-violet-500" />
        </motion.div>
        <h3 className="mt-6 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
          Summoning Consultation Catalog...
        </h3>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] overflow-hidden bg-slate-50">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-300/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-indigo-200/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80"
        >
          <div className="flex flex-col items-start text-left ml-4 md:ml-8">
            <div className="inline-flex items-center justify-center p-2.5 bg-gradient-to-br from-violet-100 to-indigo-50 rounded-xl mb-3 border border-white shadow-sm">
              <Sparkles className="w-6 h-6 text-violet-600" />
            </div>
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700 tracking-tight">
              Consultation Catalog
            </h2>
            <p className="text-slate-500 mt-2 pl-8 font-medium">
              Curate and manage your magical offerings for the public.
            </p>
          </div>

          <div className="flex bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl shadow-inner border border-white/20 shrink-0">
            <button
              type="button"
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activePanel === 'services'
                  ? 'text-violet-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              onClick={() => setActivePanel('services')}
            >
              {activePanel === 'services' && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-xl" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Services
                <span className={`px-2 py-0.5 rounded-full text-xs transition-colors ${activePanel === 'services' ? 'bg-violet-100 text-violet-700' : 'bg-slate-300/50 text-slate-600'}`}>
                  {services.length}
                </span>
              </span>
            </button>
            <button
              type="button"
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activePanel === 'categories'
                  ? 'text-violet-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              onClick={() => setActivePanel('categories')}
            >
              {activePanel === 'categories' && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-xl" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Categories
                <span className={`px-2 py-0.5 rounded-full text-xs transition-colors ${activePanel === 'categories' ? 'bg-violet-100 text-violet-700' : 'bg-slate-300/50 text-slate-600'}`}>
                  {categories.length}
                </span>
              </span>
            </button>
          </div>
        </motion.div>

        {/* LIST SECTION */}
        <div className="lms-table-card">
          <div className="lms-table-head">
            <div>
              <h3>{activePanel === 'categories' ? 'Consultation Categories' : 'Consultation Services'}</h3>
              <p>
                {activePanel === 'categories'
                  ? 'Focused / Vedic — Detailed / Premium Chart / Tarot / Remedies and any others you add.'
                  : 'Click Edit to open a service in the editor, or add a new one.'}
              </p>
            </div>
            <button
              type="button"
              className="lms-primary-action"
              onClick={activePanel === 'categories' ? openNewCategory : openNewService}
            >
              <Plus className="w-4 h-4" />
              <span>{activePanel === 'categories' ? 'New Category' : 'New Service'}</span>
            </button>
          </div>

          {activePanel === 'services' && categories.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setServiceCategoryFilter('All')}
                className="lms-type-badge"
                style={{
                  cursor: 'pointer',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: serviceCategoryFilter === 'All' ? '2px solid #334155' : '2px solid transparent',
                  opacity: serviceCategoryFilter === 'All' ? 1 : 0.55,
                }}
              >
                All ({services.length})
              </button>
              {categories.map((cat) => {
                const catSlug = cat.slug || cat.id;
                const count = services.filter((svc) => (svc.categoryId || svc.categorySlug) === catSlug).length;
                return (
                  <button
                    key={catSlug}
                    type="button"
                    onClick={() => setServiceCategoryFilter(catSlug)}
                    className="lms-type-badge"
                    style={{
                      cursor: 'pointer',
                      background: '#eef2ff',
                      color: '#4338ca',
                      border: serviceCategoryFilter === catSlug ? '2px solid #4338ca' : '2px solid transparent',
                      opacity: serviceCategoryFilter === catSlug ? 1 : 0.55,
                    }}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {activePanel === 'categories' ? (
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="lms-empty-row">No categories crafted yet.</div>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.slug || cat.id}>
                      <td>
                        <strong>{cat.name}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{cat.slug || cat.id}</span>
                      </td>
                      <td>{cat.cards?.length ?? 0}</td>
                      <td>
                        <span className={`lms-status ${cat.isActive !== false ? 'lms-status--active' : 'lms-status--inactive'}`}>
                          {cat.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="lms-actions">
                          <button className="lms-icon-btn" title="Edit category" onClick={() => editCategory(cat)}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="lms-icon-btn lms-icon-btn--danger" title="Delete category" onClick={() => deleteCategory(cat.slug || cat.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="lms-empty-row">
                        {services.length === 0 ? 'No magical services added yet.' : 'No services in this category.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((svc) => (
                    <tr key={svc.slug || svc.id}>
                      <td>
                        <div className="lms-course-cell">
                          {svc.img ? (
                            <img src={svc.img} alt={svc.title} />
                          ) : (
                            <div style={{
                              width: 46, height: 46, flexShrink: 0, borderRadius: 'var(--r-sm)',
                              border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', background: '#f5f3ff',
                            }}>
                              <Sparkles className="w-5 h-5 text-violet-300" />
                            </div>
                          )}
                          <div>
                            <strong>{svc.title}</strong>
                            <span>{svc.desc || 'No description added yet'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="lms-type-badge" style={{ background: '#eef2ff', color: '#4338ca' }}>
                          {svc.category || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {svc.duration || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not set</span>}
                        </span>
                      </td>
                      <td className="lms-price">
                        <div>
                          <div>{svc.priceLabel || formatINR(svc.price)}</div>
                          {Number(svc.mrp) > Number(svc.price) && (
                            <div style={{ fontSize: '11px', fontWeight: 400, color: '#94a3b8', textDecoration: 'line-through' }}>
                              {formatINR(svc.mrp)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`lms-status ${svc.isActive !== false ? 'lms-status--active' : 'lms-status--inactive'}`}>
                          {svc.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="lms-actions">
                          <button className="lms-icon-btn" title="Edit service" onClick={() => editService(svc)}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="lms-icon-btn lms-icon-btn--danger" title="Delete service" onClick={() => deleteService(svc.slug || svc.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CATEGORY MODAL */}
      <AnimatePresence>
        {showCategoryModal && (
          <div
            className="fixed inset-0 z-[10050] flex items-end justify-center bg-slate-900/70 p-0 sm:items-center sm:p-4"
            onClick={() => !saving && closeCategoryModal()}
          >
            <motion.div
              key="category-form-modal"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="relative flex w-full max-h-[96dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50/50 border-b border-white/60 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-violet-900 flex items-center gap-2 text-lg">
                  {editingCategorySlug ? <><Edit2 className="w-5 h-5 text-violet-600" /> Edit Category</> : <><Plus className="w-5 h-5 text-violet-600" /> New Category</>}
                </h3>
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                  disabled={saving}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveCategory} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input
                        className={inputClass}
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                        placeholder="e.g. Premium Chart"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <input
                        className={`${inputClass} bg-slate-100/50 cursor-not-allowed`}
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        disabled={!!editingCategorySlug}
                        placeholder="Auto-generated"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Icon</label>
                      <input
                        className={inputClass}
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        placeholder="e.g. fa-star"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={3}
                      className={`${inputClass} resize-none`}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Enchanting description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                      <label className={labelClass}>Sort Order</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={categoryForm.sortOrder}
                        onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Status</label>
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-white/40 border border-white rounded-xl shadow-sm">
                        <input
                          id="cat-active"
                          type="checkbox"
                          className="w-5 h-5 text-violet-600 rounded-md border-slate-300 focus:ring-violet-500 transition-colors"
                          checked={categoryForm.isActive}
                          onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                        />
                        <label htmlFor="cat-active" className="block text-sm font-semibold text-slate-700 cursor-pointer">
                          Active & Visible
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row sm:justify-end sm:px-6">
                  <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition" disabled={saving} onClick={closeCategoryModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
                    disabled={saving}
                  >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : null}
                    {saving ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICE MODAL */}
      <AnimatePresence>
        {showServiceModal && (
          <div
            className="fixed inset-0 z-[10050] flex items-end justify-center bg-slate-900/70 p-0 sm:items-center sm:p-4"
            onClick={() => !saving && closeServiceModal()}
          >
            <motion.div
              key="service-form-modal"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="relative flex w-full max-h-[96dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50/50 border-b border-white/60 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-violet-900 flex items-center gap-2 text-lg">
                  {editingServiceSlug ? <><Edit2 className="w-5 h-5 text-violet-600" /> Edit Service</> : <><Plus className="w-5 h-5 text-violet-600" /> New Service</>}
                </h3>
                <button
                  type="button"
                  onClick={closeServiceModal}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                  disabled={saving}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveService} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={labelClass}>Category</label>
                      <div className="relative">
                        <select
                          className={`${inputClass} appearance-none pr-10`}
                          value={serviceForm.categorySlug}
                          onChange={(e) => setServiceForm({ ...serviceForm, categorySlug: e.target.value })}
                          required
                        >
                          <option value="" className="text-slate-400">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.slug || cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        className={inputClass}
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                        required
                        placeholder="e.g. Full Kundli Analysis"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <input
                        className={`${inputClass} bg-slate-100/50 cursor-not-allowed`}
                        value={serviceForm.slug}
                        onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                        disabled={!!editingServiceSlug}
                        placeholder="Auto-generated"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className={labelClass}>Short Label</label>
                      <input
                        className={inputClass}
                        value={serviceForm.short}
                        onChange={(e) => setServiceForm({ ...serviceForm, short: e.target.value })}
                        placeholder="e.g. Popular"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-500 font-medium">₹</span>
                        <input
                          type="number"
                          min="0"
                          className={`${inputClass} pl-9`}
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>MRP / full price (₹) — optional</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-500 font-medium">₹</span>
                        <input
                          type="number"
                          min="0"
                          className={`${inputClass} pl-9`}
                          value={serviceForm.mrp}
                          onChange={(e) => setServiceForm({ ...serviceForm, mrp: e.target.value })}
                          placeholder="Shown struck-through when higher than price"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Duration</label>
                      <input
                        className={inputClass}
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                        placeholder="e.g. 40 min"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        rows={4}
                        className={`${inputClass} resize-none`}
                        value={serviceForm.desc}
                        onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                        required
                        placeholder="What mysteries will this unravel?"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Highlights (Bullet Points)</label>
                      <textarea
                        rows={4}
                        className={`${inputClass} resize-none text-sm leading-relaxed`}
                        value={serviceForm.highlightsText}
                        onChange={(e) => setServiceForm({ ...serviceForm, highlightsText: e.target.value })}
                        placeholder="Enter one highlight per line..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Image Upload Area */}
                    <div className="lg:col-span-5">
                      <label className={labelClass}>Cover Image</label>
                      <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-white/40 border border-white/60 shadow-sm">
                        {serviceForm.img ? (
                          <div className="relative group w-[54px] h-[54px] shrink-0 rounded-lg overflow-hidden shadow-md">
                            <img src={serviceForm.img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ) : (
                          <div className="w-[54px] h-[54px] shrink-0 rounded-lg border-2 border-dashed border-violet-200 flex items-center justify-center text-violet-400 bg-white/50">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="img-upload"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                          <label
                            htmlFor="img-upload"
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-violet-100 shadow-sm hover:shadow-md rounded-lg text-xs font-bold text-violet-700 cursor-pointer hover:bg-violet-50 transition-all"
                          >
                            {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                            {uploading ? 'Uploading...' : 'Choose Cover'}
                          </label>
                          <input
                            className={`${inputClass} !py-1.5 !px-3 !text-[11px]`}
                            value={serviceForm.img}
                            onChange={(e) => setServiceForm({ ...serviceForm, img: e.target.value })}
                            placeholder="Or image URL..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClass}>Badge Text</label>
                      <input
                        className={inputClass}
                        value={serviceForm.badge}
                        onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                        placeholder="e.g. Bestseller"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className={labelClass}>Badge Color</label>
                      <select
                        className={inputClass}
                        value={serviceForm.badgeColor}
                        onChange={(e) => setServiceForm({ ...serviceForm, badgeColor: e.target.value })}
                      >
                        {['purple', 'pink', 'orange', 'red', 'green', 'blue', 'indigo'].map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>

                    <div className="lg:col-span-3">
                      <label className={labelClass}>Status</label>
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-white/40 border border-white rounded-xl shadow-sm">
                        <input
                          id="svc-active"
                          type="checkbox"
                          className="w-5 h-5 text-violet-600 rounded-md border-slate-300 focus:ring-violet-500 transition-colors"
                          checked={serviceForm.isActive}
                          onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                        />
                        <label htmlFor="svc-active" className="block text-sm font-semibold text-slate-700 cursor-pointer">
                          Active & Visible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Sort Order</label>
                    <input
                      type="number"
                      className={`${inputClass} max-w-[10rem]`}
                      value={serviceForm.sortOrder}
                      onChange={(e) => setServiceForm({ ...serviceForm, sortOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row sm:justify-end sm:px-6">
                  <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition" disabled={saving} onClick={closeServiceModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
                    disabled={saving}
                  >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : null}
                    {saving ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
