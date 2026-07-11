import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from '../utils/toast';
import API_BASE from '../utils/api';
import AdminContentManager from '../components/AdminContentManager';


function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    whatsappNumber: '',
    razorpayKeyId: '',
    shopifyStoreUrl: '',
    googleAnalyticsId: '',
    maintenanceMode: false,
    announcementText: ''
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      toast.error('Failed to load platform configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Configuration saved successfully!');
      } else {
        toast.error(data.message || 'Failed to update settings.');
      }
    } catch (err) {
      toast.error('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="spinner"
        ></motion.div>
        <p>Syncing with cosmic configuration...</p>
      </div>
    );
  }

  const TabButton = ({ id, label, icon }) => (
    <button 
      className={`settings-tab-btn ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="activeTab"
          className="active-tab-indicator"
        />
      )}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="settings-container"
    >
      <div className="settings-card">
        <aside className="settings-sidebar">
          <div className="sidebar-group-label">Core Settings</div>
          <TabButton id="general" label="General Info" icon="fa-info-circle" />
          <TabButton id="social" label="Social Media" icon="fa-share-alt" />
          <TabButton id="content" label="Banners & Materials" icon="fa-layer-group" />
          <TabButton id="announcement" label="Announcement" icon="fa-bullhorn" />

          <div className="sidebar-group-label mt-4">Advanced</div>
          <TabButton id="integrations" label="Integrations" icon="fa-plug" />
          <TabButton id="security" label="Security & Access" icon="fa-shield-alt" />
        </aside>

        <main className="settings-main">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div 
                  key="general"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <h3 className="section-title">Site Identity</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Platform Name</label>
                      <input 
                        name="siteName" 
                        value={settings.siteName} 
                        onChange={handleChange}
                        placeholder="e.g. DS Astrology"
                      />
                    </div>
                    <div className="form-group">
                      <label>SEO Title (Browser Tab)</label>
                      <input 
                        name="siteTitle" 
                        value={settings.siteTitle} 
                        onChange={handleChange}
                        placeholder="DS Astrology - Best Astrology Services"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Meta Description (SEO)</label>
                      <textarea 
                        name="siteDescription" 
                        value={settings.siteDescription} 
                        onChange={handleChange}
                        rows="3"
                        placeholder="Describe your platform for search engines..."
                      ></textarea>
                    </div>
                  </div>

                  <h3 className="section-title mt-5">Support & Business</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Official Support Email</label>
                      <div className="input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input 
                          name="contactEmail" 
                          type="email"
                          value={settings.contactEmail} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Support Hotline</label>
                      <div className="input-with-icon">
                        <i className="fas fa-phone"></i>
                        <input 
                          name="contactPhone" 
                          value={settings.contactPhone} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Business Address</label>
                      <div className="input-with-icon">
                        <i className="fas fa-map-marker-alt"></i>
                        <input 
                          name="address" 
                          value={settings.address} 
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'social' && (
                <motion.div 
                  key="social"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <h3 className="section-title">Social Ecosystem</h3>
                  <p className="section-desc">Manage links displayed in the footer and contact sections.</p>
                  <div className="form-grid">
                    <div className="form-group">
                      <label><i className="fab fa-facebook text-primary"></i> Facebook Page</label>
                      <input 
                        name="facebookUrl" 
                        value={settings.facebookUrl} 
                        onChange={handleChange}
                        placeholder="https://facebook.com/dsastroinstitute"
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fab fa-instagram text-danger"></i> Instagram Profile</label>
                      <input 
                        name="instagramUrl" 
                        value={settings.instagramUrl} 
                        onChange={handleChange}
                        placeholder="https://instagram.com/dsastroinstitute"
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fab fa-youtube text-danger"></i> YouTube Channel</label>
                      <input 
                        name="youtubeUrl" 
                        value={settings.youtubeUrl} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label><i className="fab fa-whatsapp text-success"></i> WhatsApp Business</label>
                      <input 
                        name="whatsappNumber" 
                        value={settings.whatsappNumber} 
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'integrations' && (
                <motion.div 
                  key="integrations"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <h3 className="section-title">External Gateways</h3>
                  <p className="section-desc">Manage API keys and tracking IDs for platform services.</p>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Razorpay Key ID</label>
                      <div className="input-with-icon">
                        <i className="fas fa-key"></i>
                        <input 
                          name="razorpayKeyId" 
                          value={settings.razorpayKeyId} 
                          onChange={handleChange}
                          type="password"
                        />
                      </div>
                      <small>Used for processing consultations and course payments.</small>
                    </div>
                    <div className="form-group">
                      <label>Shopify Store URL</label>
                      <div className="input-with-icon">
                        <i className="fab fa-shopify"></i>
                        <input
                          name="shopifyStoreUrl"
                          value={settings.shopifyStoreUrl || ''}
                          onChange={handleChange}
                          placeholder="https://your-store.myshopify.com"
                        />
                      </div>
                      <small>Shop buttons redirect here. No Shopify API key is required.</small>
                    </div>
                    <div className="form-group">
                      <label>Google Analytics (G-ID)</label>
                      <div className="input-with-icon">
                        <i className="fas fa-chart-line"></i>
                        <input 
                          name="googleAnalyticsId" 
                          value={settings.googleAnalyticsId} 
                          onChange={handleChange}
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="maintenance-box mt-5">
                    <div className="mt-info">
                      <h4>Maintenance Mode</h4>
                      <p>Restrict public access while performing updates.</p>
                    </div>
                    <label className="switch-premium">
                      <input 
                        type="checkbox" 
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                      />
                      <span className="slider-premium"></span>
                    </label>
                  </div>
                </motion.div>
              )}

              {activeTab === 'announcement' && (
                <motion.div
                  key="announcement"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <h3 className="section-title">Student Dashboard Announcement</h3>
                  <p className="section-desc">
                    Shown as a dismissable banner at the top of every student&apos;s dashboard. Leave empty to hide it.
                  </p>

                  <div className="mt-4 rounded-xl border border-amber-800/15 bg-amber-50/40 p-4 sm:p-5">
                    <label className="block">
                      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-900">
                        <i className="fas fa-bullhorn" />
                        Announcement text
                      </span>
                      <textarea
                        name="announcementText"
                        value={settings.announcementText}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g. New batch for Vedic Astrology starts 15th July — enroll now!"
                        className="w-full resize-y rounded-lg border border-amber-800/20 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-500">
                        {settings.announcementText
                          ? 'Announcement is currently visible to students.'
                          : 'No announcement is currently shown.'}
                      </p>
                      {settings.announcementText && (
                        <button
                          type="button"
                          onClick={() => setSettings((prev) => ({ ...prev, announcementText: '' }))}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                          <i className="fas fa-times" />
                          Clear announcement
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <AdminContentManager />
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="settings-section"
                >
                  <h3 className="section-title">Administrative Security</h3>
                  <div className="security-info-card">
                    <div className="sic-icon"><i className="fas fa-shield-alt"></i></div>
                    <div className="sic-text">
                      <h5>Access Control Info</h5>
                      <p>Passwords and multi-user roles are managed in the Core Identity module. Ensure your JWT_SECRET is rotated every 90 days for maximum security.</p>
                    </div>
                  </div>
                  
                  <div className="d-grid mt-4">
                    <button type="button" className="lf-btn py-3 px-4 bg-light text-dark border w-auto m-0">
                      <i className="fas fa-history me-2"></i> View Audit Logs
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab !== 'content' && (
            <div className="settings-footer">
              <button 
                type="submit" 
                className={`save-btn-premium ${saving ? 'loading' : ''}`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="btn-spinner"
                    />
                    Committing Changes...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Deploy Settings
                  </>
                )}
              </button>
            </div>
            )}
          </form>
        </main>
      </div>
    </motion.div>
  );
}

export default AdminSettings;
