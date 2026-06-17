import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';
import { SITE_LOGO, SITE_LOGO_ALT } from '../utils/brandAssets';
import { formatAdminDate, formatAdminTime, getLeadSubmittedAt } from '../utils/adminTableUtils';
import AdminNotifications from '../components/AdminNotifications';
import AdminLeads from './AdminLeads';
import AdminBlogs from './AdminBlogs';
import AdminJobs from './AdminJobs';
import AdminCoupons from './AdminCoupons';
import AdminOffers from './AdminOffers';
import AdminSettings from './AdminSettings';
import AdminNewsletter from './AdminNewsletter';
import AdminCourses from './AdminCourses';
import AdminConsultations from './AdminConsultations';
import AdminConsultationServices from './AdminConsultationServices';
import AdminStudents from './AdminStudents';
import AdminOrders from './AdminOrders';
import AdminAstrologers from './AdminAstrologers';
import './Admin.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  leads: 'Lead Management',
  lms: 'Course Studio',
  consultations: 'Consultation Requests',
  'consultation-catalog': 'Consultation Catalog',
  students: 'Students',
  orders: 'Orders',
  blogs: 'Blog & Articles',
  jobs: 'Careers & Hiring',
  coupons: 'Promo Codes',
  offers: 'Site Offers',
  settings: 'Platform Settings',
  newsletter: 'Newsletter',
  astrologers: 'Astrologers',
};

const LEAD_FILTER_LABELS = {
  'Recorded-Course': 'Recorded Courses',
  Course: 'Live Course Leads',
  Consultation: 'Consultation Leads',
  Webinar: 'Webinar Leads',
  Contact: 'Contact Inbox',
};

const PAGE_ICONS = {
  dashboard: 'fa-chart-pie',
  leads: 'fa-filter',
  lms: 'fa-graduation-cap',
  consultations: 'fa-handshake',
  'consultation-catalog': 'fa-th-large',
  students: 'fa-user-graduate',
  orders: 'fa-receipt',
  blogs: 'fa-pen-nib',
  jobs: 'fa-briefcase',
  coupons: 'fa-percent',
  offers: 'fa-gift',
  settings: 'fa-sliders-h',
  newsletter: 'fa-paper-plane',
  astrologers: 'fa-user-astronaut',
};

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard', accent: 'blue' },
    ],
  },
  {
    label: 'Lead Pipeline',
    items: [
      { id: 'leads', filter: 'Recorded-Course', icon: 'fa-play-circle', label: 'Recorded Courses', accent: 'cyan' },
      { id: 'leads', filter: 'Course', icon: 'fa-chalkboard-teacher', label: 'Live Course Leads', accent: 'amber' },
      { id: 'leads', filter: 'Consultation', icon: 'fa-user-md', label: 'Consultation Leads', accent: 'violet' },
      { id: 'leads', filter: 'Webinar', icon: 'fa-video', label: 'Webinar Leads', accent: 'rose' },
      { id: 'leads', filter: 'Contact', icon: 'fa-inbox', label: 'Contact Inbox', accent: 'slate' },
      { id: 'newsletter', icon: 'fa-paper-plane', label: 'Newsletter', accent: 'indigo' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'students', icon: 'fa-user-graduate', label: 'Students', accent: 'blue' },
      { id: 'orders', icon: 'fa-receipt', label: 'Orders', accent: 'emerald' },
      { id: 'lms', icon: 'fa-graduation-cap', label: 'Course Studio', accent: 'cyan' },
      { id: 'consultation-catalog', icon: 'fa-th-large', label: 'Consultation Catalog', accent: 'orange' },
      { id: 'consultations', icon: 'fa-handshake', label: 'Student Consultations', accent: 'violet' },
      { id: 'blogs', icon: 'fa-pen-nib', label: 'Blog & Articles', accent: 'amber' },
      { id: 'jobs', icon: 'fa-briefcase', label: 'Job Postings', accent: 'indigo' },
      { id: 'coupons', icon: 'fa-percent', label: 'Promo Codes', accent: 'rose' },
      { id: 'offers', icon: 'fa-gift', label: 'Site Offers', accent: 'emerald' },
      { id: 'astrologers', icon: 'fa-user-astronaut', label: 'Astrologers', accent: 'violet' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', icon: 'fa-sliders-h', label: 'Settings', accent: 'slate' },
    ],
  },
];

function StatCard({ accent, iconBg, iconColor, icon, badge, value, label, barWidth, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-xl border border-slate-200 p-4 overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none"
    >
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${accent}`} />
      <div className="flex items-start justify-between mb-3 pl-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <i className={`fas ${icon} text-xs ${iconColor}`} />
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap leading-none flex items-center">
          {badge}
        </span>
      </div>
      <div className="pl-1">
        <div className="text-[22px] font-bold text-slate-800 leading-none mb-1 tabular-nums">{value}</div>
        <div className="text-[11px] font-medium text-slate-500 leading-tight">{label}</div>
      </div>
      <div className="mt-3 h-[2px] bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${accent} rounded-full`}
          style={{ width: barWidth, transition: 'width 1s ease 0.3s' }}
        />
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leadFilter, setLeadFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    recordedCoursePurchases: 0,
    paidConsultations: 0,
    liveCourseEnquiries: 0,
    failedPayments: 0,
    totalLeads: 0,
    activeBlogs: 0,
    jobOpenings: 0,
    newsletterSubscribers: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [statsRes, leadsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/leads?_limit=8&_t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      if (statsData.success) setStats(statsData.stats);
      if (leadsData.success) setRecentLeads(leadsData.leads?.slice(0, 8) || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
        <span className="text-[13px] text-slate-500">Verifying access…</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const SidebarItem = ({ id, icon, label, filter = '', accent = 'blue' }) => {
    const isActive = activeTab === id && leadFilter === filter;
    return (
      <button
        type="button"
        className={`sb-item ${isActive ? 'sb-item--active' : ''}`}
        onClick={() => { setActiveTab(id); setLeadFilter(filter); setMobileMenuOpen(false); }}
        title={label}
      >
        <span className={`sb-icon-wrap sb-icon-wrap--${accent}`}>
          <i className={`fas ${icon}`} />
        </span>
        <span className="sb-item-label">{label}</span>
        {isActive && <div className="sb-active-bar" />}
      </button>
    );
  };

  const statCards = [
    { accent: 'bg-blue-500',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    icon: 'fa-play-circle',         badge: 'Recorded',   value: stats.recordedCoursePurchases || stats.courseLeads?.value || 0,                         label: 'Course Purchases', barWidth: '72%', onClick: () => { setActiveTab('leads'); setLeadFilter('Recorded-Course'); } },
    { accent: 'bg-cyan-500',    iconBg: 'bg-cyan-50',    iconColor: 'text-cyan-600',    icon: 'fa-user-md',             badge: 'Paid',       value: stats.paidConsultations || stats.consultingLeads?.value || 0,                          label: 'Consultations',    barWidth: '58%', onClick: () => setActiveTab('consultations') },
    { accent: 'bg-amber-500',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   icon: 'fa-chalkboard-teacher',  badge: 'Live',       value: stats.liveCourseEnquiries || stats.webinarLeads?.value || 0,                          label: 'Live Course Leads', barWidth: '40%', onClick: () => { setActiveTab('leads'); setLeadFilter('Course'); } },
    { accent: 'bg-rose-500',    iconBg: 'bg-rose-50',    iconColor: 'text-rose-600',    icon: 'fa-exclamation-triangle',badge: 'Failed',     value: stats.failedPayments || 0,                                                             label: 'Failed Payments',  barWidth: '25%', onClick: () => { setActiveTab('leads'); setLeadFilter(''); } },
    { accent: 'bg-indigo-500',  iconBg: 'bg-indigo-50',  iconColor: 'text-indigo-600',  icon: 'fa-users',               badge: 'All time',   value: stats.totalLeadsDetail?.value || stats.totalLeads?.value || stats.totalLeads || 0,     label: 'Total Leads',      barWidth: '85%', onClick: () => { setActiveTab('leads'); setLeadFilter(''); } },
    { accent: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: 'fa-newspaper',           badge: 'Published',  value: stats.activeBlogs?.value || stats.activeBlogs || 0,                                   label: 'Active Articles',  barWidth: '65%', onClick: () => setActiveTab('blogs') },
    { accent: 'bg-violet-500',  iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  icon: 'fa-briefcase',           badge: 'Open',       value: stats.jobOpenings || stats.expertNetwork?.value || stats.expertNetwork || 0,           label: 'Job Openings',     barWidth: '35%', onClick: () => setActiveTab('jobs') },
    { accent: 'bg-sky-500',     iconBg: 'bg-sky-50',     iconColor: 'text-sky-600',     icon: 'fa-paper-plane',         badge: 'Active',     value: stats.newsletterSubscribers || 0,                                                      label: 'Newsletter Subs',  barWidth: '50%', onClick: () => setActiveTab('newsletter') },
  ];

  const pageTitle = PAGE_TITLES[activeTab] || activeTab;
  const breadcrumbLabel = activeTab === 'leads' && leadFilter
    ? (LEAD_FILTER_LABELS[leadFilter] || leadFilter)
    : pageTitle;
  const pageIcon = PAGE_ICONS[activeTab] || 'fa-layer-group';

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar--collapsed' : ''} ${mobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
      <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sb-head">
          <Link
            to="/"
            className="sb-logo no-underline transition-opacity hover:opacity-90"
            title="Back to website home"
            aria-label="Go to website home"
          >
            <img
              src={SITE_LOGO}
              alt={SITE_LOGO_ALT}
              className="h-8 w-auto max-w-[120px] shrink-0 rounded-md bg-white/95 object-contain px-1.5 py-0.5 sm:h-9"
            />
            <div className="sb-logo-text">
              <span className="sb-logo-badge">Admin Console</span>
            </div>
          </Link>
          <button type="button" className="sb-toggle" onClick={() => setSidebarCollapsed(v => !v)} aria-label="Toggle sidebar">
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`} />
          </button>
        </div>

        <nav className="sb-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="sb-group">
              <span className="sb-section-label">{section.label}</span>
              {section.items.map((item) => (
                <SidebarItem key={`${item.id}-${item.filter || ''}`} {...item} />
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-foot">
          <div className="sb-profile">
            <div className="sb-profile-avatar">AD</div>
            <div className="sb-profile-meta">
              <span className="sb-profile-name">Administrator</span>
              <span className="sb-profile-role">Super Admin</span>
            </div>
          </div>
          <button className="sb-logout" title="Logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" />
            <span className="sb-logout-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="main-area">

        {/* Topbar — title + logout only, no dummy search/bell/message */}
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <i className="fas fa-bars" />
            </button>
            <div className="topbar-page-icon">
              <i className={`fas ${pageIcon}`} />
            </div>
            <div className="min-w-0">
              <div className="topbar-title truncate">{pageTitle}</div>
              <div className="topbar-breadcrumb">
                <span>Admin Console</span>
                <i className="fas fa-chevron-right" />
                <span className="current truncate">{breadcrumbLabel}</span>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="topbar-sync-pill hidden lg:inline-flex">
              <i className="fas fa-sync-alt" />
              Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <AdminNotifications onNavigate={(tab) => { setActiveTab(tab); setLeadFilter(''); }} />
            <button type="button" onClick={handleLogout} className="topbar-logout-btn">
              <i className="fas fa-sign-out-alt" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">

          {/* ── Dashboard home ──────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="dash-home">

              {/* Greeting */}
              <div>
                <div className="text-[18px] font-bold text-slate-800 leading-tight mb-1">
                  Welcome, DS Institute Admin
                </div>
                <div className="text-[12px] text-slate-400 font-medium">
                  Live analytics · auto-refreshes every 30 s · last updated{' '}
                  {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Stat grid — 2 cols mobile → 4 → 7 on xl */}
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
                {statCards.map((card, i) => (
                  <StatCard key={i} {...card} />
                ))}
              </div>

              {/* Recent Leads */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="dash-section-title">Recent Leads</div>
                  <button
                    className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => { setActiveTab('leads'); setLeadFilter(''); }}
                  >
                    View All <i className="fas fa-arrow-right text-[10px]" />
                  </button>
                </div>

                <div className="admin-table-shell">
                  {recentLeads.length === 0 ? (
                    <div className="admin-table-empty">
                      <i className="fas fa-inbox admin-table-empty__icon-fa" />
                      <div className="admin-table-empty__title">No leads yet</div>
                      <div className="admin-table-empty__message">
                        Leads appear here once users engage with courses or consultations.
                      </div>
                    </div>
                  ) : (
                    <div className="admin-table-scroll">
                      <table className="admin-table leads-table w-full">
                        <thead>
                          <tr>
                            <th>Submitted</th>
                            <th>Name / Contact</th>
                            <th>Type</th>
                            <th>Course / Service</th>
                            <th>Payment</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentLeads.map((lead) => {
                            const submitted = getLeadSubmittedAt(lead);
                            return (
                            <tr key={lead._id}>
                              <td>
                                <div className="atd-primary">{formatAdminDate(submitted)}</div>
                                <div className="atd-secondary">{formatAdminTime(submitted)}</div>
                              </td>
                              <td>
                                <div className="td-value" style={{ fontWeight: 600 }}>{lead.name}</div>
                                <div className="td-muted">{lead.email}</div>
                                <div className="td-muted">{lead.phone}</div>
                              </td>
                              <td>
                                {(() => {
                                  const kindMap = {
                                    'Recorded-Course': { label: 'RECORD', pill: 'tag--violet' },
                                    'Course-Inquiry':  { label: 'RECORD', pill: 'tag--violet' },
                                    'Course':          { label: 'LIVE',   pill: 'tag--amber' },
                                    'Consultation':    { label: 'DIRECT', pill: 'tag--cyan' },
                                    'Webinar':         { label: 'WEBINAR', pill: 'tag--violet' },
                                  };
                                  // Prefer leadType-based resolution
                                  const isRecord = lead.leadType === 'RECORDED COURSE LEAD' || lead.type === 'Recorded-Course' || lead.type === 'Course-Inquiry';
                                  const isLive = lead.leadType === 'LIVE COURSE LEAD' || lead.type === 'Course';
                                  const cfg = isRecord ? { label: 'RECORD', pill: 'tag--violet' }
                                            : isLive   ? { label: 'LIVE',   pill: 'tag--amber' }
                                            : kindMap[lead.type] || { label: lead.type?.toUpperCase() || 'LEAD', pill: 'tag--amber' };
                                  return (
                                    <span className={`tag ${cfg.pill}`} style={{ fontSize: '10px' }}>
                                      {cfg.label}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td>
                                <div
                                  className="td-muted"
                                  style={{ fontSize: '12px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                  {lead.courseName || lead.consultationType || 'General'}
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-1">
                                  <div className={`dot ${
                                    lead.paymentStatus === 'PAID' || lead.paymentStatus === 'Completed' ? 'dot--green' :
                                    lead.paymentStatus === 'FAILED' ? 'dot--rose' :
                                    lead.paymentStatus === 'NOT REQUIRED' ? 'dot--blue' : 'dot--amber'
                                  }`} />
                                  <span style={{ fontSize: '11px' }}>{lead.paymentStatus || 'Pending'}</span>
                                </div>
                              </td>
                              <td>
                                <button
                                  className="topbar-icon-btn"
                                  style={{ fontSize: '11px', width: '30px', height: '30px' }}
                                  title="View in Leads"
                                  onClick={() => { setActiveTab('leads'); setLeadFilter(lead.type || ''); }}
                                >
                                  <i className="fas fa-eye" />
                                </button>
                              </td>
                            </tr>
                          );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {recentLeads.length > 0 && (
                    <div className="admin-table-footer">
                      <span>Showing <strong>{recentLeads.length}</strong> most recent leads</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads'         && <AdminLeads activeFilter={leadFilter} />}
          {activeTab === 'lms'           && <AdminCourses />}
          {activeTab === 'consultation-catalog' && <AdminConsultationServices />}
          {activeTab === 'consultations' && <AdminConsultations />}
          {activeTab === 'students'      && <AdminStudents />}
          {activeTab === 'orders'        && <AdminOrders />}
          {activeTab === 'blogs'         && <AdminBlogs />}
          {activeTab === 'jobs'          && <AdminJobs />}
          {activeTab === 'coupons'       && <AdminCoupons />}
          {activeTab === 'offers'        && <AdminOffers />}
          {activeTab === 'settings'      && <AdminSettings />}
          {activeTab === 'newsletter'    && <AdminNewsletter />}
          {activeTab === 'astrologers'   && <AdminAstrologers />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
