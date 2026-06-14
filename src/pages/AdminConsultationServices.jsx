import { useState, useEffect, useCallback } from 'react';
import toast from '@/utils/toast';
import { Plus, Edit2, Trash2, UploadCloud, Layers, LayoutGrid, CheckCircle2, RefreshCw, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../utils/api';
import { uploadImage } from '../utils/uploadMedia';

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
    setActivePanel('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      duration: svc.duration || '',
      badge: svc.badge || '',
      badgeColor: svc.badgeColor || 'purple',
      img: svc.img || '',
      highlightsText: (svc.highlights || []).join('\n'),
      sortOrder: String(svc.sortOrder ?? 0),
      isActive: svc.isActive !== false,
    });
    setActivePanel('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Glassmorphic Input Class
  const inputClass = "w-full px-4 py-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-inner rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-white outline-none transition-all duration-300 text-slate-800 placeholder-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5 ml-1 flex items-center gap-1.5";

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

        <div className="flex flex-col gap-10">

          {/* FORM SECTION - Top */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50/50 border-b border-white/60 px-6 py-5 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-violet-900 flex items-center gap-2 text-lg">
                  {activePanel === 'categories' ? (
                    editingCategorySlug ? <><Edit2 className="w-5 h-5 text-violet-600" /> Edit Category</> : <><Plus className="w-5 h-5 text-violet-600" /> New Category</>
                  ) : (
                    editingServiceSlug ? <><Edit2 className="w-5 h-5 text-violet-600" /> Edit Service</> : <><Plus className="w-5 h-5 text-violet-600" /> New Service</>
                  )}
                </h3>
                {(editingCategorySlug || editingServiceSlug) && (
                  <button
                    onClick={activePanel === 'categories' ? resetCategoryForm : resetServiceForm}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all flex items-center gap-2 text-sm font-medium pr-4"
                    title="Cancel editing"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                )}
              </div>

              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activePanel === 'categories' ? (
                      /* CATEGORY FORM */
                      <form onSubmit={saveCategory} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className={labelClass}>Name</label>
                            <input
                              className={inputClass}
                              value={categoryForm.name}
                              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                              required
                              placeholder="e.g. Astrology Reading"
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                          <div>
                            <label className={labelClass}>Sort Order</label>
                            <input
                              type="number"
                              className={inputClass}
                              value={categoryForm.sortOrder}
                              onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                            />
                          </div>

                          <div className="flex items-center h-[50px] px-4 bg-white/40 border border-white rounded-xl shadow-sm">
                            <input
                              id="cat-active"
                              type="checkbox"
                              className="w-5 h-5 text-violet-600 rounded-md border-slate-300 focus:ring-violet-500 transition-colors"
                              checked={categoryForm.isActive}
                              onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                            />
                            <label htmlFor="cat-active" className="ml-3 block text-sm font-semibold text-slate-700 cursor-pointer">
                              Active & Visible
                            </label>
                          </div>

                          <div className="flex items-center justify-end">
                            <button
                              type="submit"
                              className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                              disabled={saving}
                            >
                              {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                              {saving ? 'Saving...' : 'Save Category'}
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      /* SERVICE FORM */
                      <form onSubmit={saveService} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className={labelClass}>Category</label>
                            <select
                              className={`${inputClass} appearance-none`}
                              value={serviceForm.categorySlug}
                              onChange={(e) => setServiceForm({ ...serviceForm, categorySlug: e.target.value })}
                              required
                            >
                              <option value="" className="text-slate-400">Select a category</option>
                              {categories.map((cat) => (
                                <option key={cat.slug || cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Title</label>
                            <input
                              className={inputClass}
                              value={serviceForm.title}
                              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                              required
                              placeholder="e.g. Destiny Blueprint"
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Slug</label>
                            <input
                              className={`${inputClass} bg-slate-100/50`}
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
                            <label className={labelClass}>Duration</label>
                            <input
                              className={inputClass}
                              value={serviceForm.duration}
                              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                              placeholder="e.g. 45 Mins"
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Badge Text</label>
                            <input
                              className={inputClass}
                              value={serviceForm.badge}
                              onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                              placeholder="e.g. Bestseller"
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

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

                          {/* Image Upload Area */}
                          <div className="lg:col-span-5 p-4 rounded-2xl bg-white/40 border border-white/60 shadow-sm transition-all h-[110px] flex items-center gap-4">
                            {serviceForm.img ? (
                              <div className="relative group w-[78px] h-[78px] shrink-0 rounded-xl overflow-hidden shadow-md">
                                <img src={serviceForm.img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ) : (
                              <div className="w-[78px] h-[78px] shrink-0 rounded-xl border-2 border-dashed border-violet-200 flex flex-col items-center justify-center text-violet-400 bg-white/50">
                                <UploadCloud className="w-6 h-6 mb-1" />
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
                                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-violet-100 shadow-sm hover:shadow-md rounded-lg text-xs font-bold text-violet-700 cursor-pointer hover:bg-violet-50 transition-all"
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

                          <div className="lg:col-span-2">
                            <label className={labelClass}>Sort Order</label>
                            <input
                              type="number"
                              className={inputClass}
                              value={serviceForm.sortOrder}
                              onChange={(e) => setServiceForm({ ...serviceForm, sortOrder: e.target.value })}
                            />
                          </div>

                          <div className="lg:col-span-3 flex items-center h-[52px] px-4 bg-white/40 border border-white rounded-xl shadow-sm">
                            <input
                              id="svc-active"
                              type="checkbox"
                              className="w-5 h-5 text-violet-600 rounded-md border-slate-300 focus:ring-violet-500 transition-colors"
                              checked={serviceForm.isActive}
                              onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                            />
                            <label htmlFor="svc-active" className="ml-3 block text-sm font-semibold text-slate-700 cursor-pointer">
                              Active & Visible
                            </label>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                            disabled={saving}
                          >
                            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {saving ? 'Saving...' : 'Save Service'}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* LIST SECTION - Bottom */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-white/60 flex items-center justify-between bg-gradient-to-r from-white/40 to-transparent">
                <h3 className="font-extrabold text-xl text-slate-800">
                  {activePanel === 'categories' ? 'Your Categories' : 'Your Services'}
                </h3>
                <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full border border-white shadow-sm font-bold text-sm text-violet-700">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  {activePanel === 'categories' ? categories.length : services.length} Items
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {activePanel === 'categories' ? (
                    <motion.div
                      key="cats"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {categories.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-400 bg-white/40 rounded-2xl border border-dashed border-slate-300">
                          <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No categories crafted yet.</p>
                        </div>
                      ) : (
                        categories.map((cat, idx) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={cat.slug || cat.id}
                            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${cat.isActive !== false ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                            <div className="flex justify-between items-start pl-2">
                              <div>
                                <h4 className="font-bold text-lg text-slate-900">{cat.name}</h4>
                                <p className="text-xs font-mono text-slate-400 mt-1 mb-4">{cat.slug || cat.id}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                                  {cat.cards?.length ?? 0} Services
                                </span>
                              </div>
                              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                <button
                                  onClick={() => editCategory(cat)}
                                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors shadow-sm"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteCategory(cat.slug || cat.id)}
                                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors shadow-sm"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="svcs"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {services.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-400 bg-white/40 rounded-2xl border border-dashed border-slate-300">
                          <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No magical services added yet.</p>
                        </div>
                      ) : (
                        services.map((svc, idx) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={svc.slug || svc.id}
                            className="group flex flex-col bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${svc.isActive !== false ? 'bg-emerald-400' : 'bg-slate-300'}`} />

                            <div className="flex items-start gap-4 mb-4 ml-2">
                              {svc.img ? (
                                <img src={svc.img} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center border border-violet-100 shadow-sm shrink-0">
                                  <Sparkles className="w-6 h-6 text-violet-300" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 pr-8">
                                <h4 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">{svc.title}</h4>
                                <div className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-2">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">{svc.category}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto ml-2 flex items-center justify-between border-t border-slate-100 pt-4">
                              <div>
                                <div className="font-extrabold text-lg text-violet-700">{svc.priceLabel || `₹${svc.price}`}</div>
                                {svc.duration && <div className="text-xs font-semibold text-slate-400 mt-0.5">{svc.duration}</div>}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editService(svc)}
                                  className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors shadow-sm"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteService(svc.slug || svc.id)}
                                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors shadow-sm"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
