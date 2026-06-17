import { useEffect, useState, useRef, useMemo } from 'react';
import toast from '@/utils/toast';
import * as XLSX from 'xlsx';
import API_BASE from '../utils/api';
import {
  formatAdminDate,
  formatAdminTime,
  getLeadSubmittedAt,
} from '../utils/adminTableUtils';

/* ── Lead type display config ─────────────────────────────────
   Priority: leadType field (set by backend) > type field (raw enum)
   "Record" = Recorded Course (automated revenue engine)
   "Direct" = Live Course enquiry (manual follow-up) or Consultation (direct paid)
   ─────────────────────────────────────────────────────────── */
const LEAD_FILTER_LABELS = {
  'Recorded-Course': 'Recorded Courses',
  Course: 'Live Course Leads',
  Consultation: 'Consultation Leads',
  Webinar: 'Webinar Leads',
  Contact: 'Contact Inbox',
};

const LEAD_TYPE_CONFIG = {
  // Recorded Course — automated purchase flow
  'RECORDED COURSE LEAD':  { label: 'Recorded Course', pill: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200', dot: '#6366f1', icon: 'fa-play-circle',         kind: 'RECORD' },
  'COURSE ENQUIRY':        { label: 'Course Enquiry',  pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',       dot: '#3b82f6', icon: 'fa-question-circle',     kind: 'RECORD' },
  // Live Course — enquiry only, manual follow-up
  'LIVE COURSE LEAD':      { label: 'Live Course',     pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',    dot: '#f59e0b', icon: 'fa-chalkboard-teacher',  kind: 'DIRECT' },
  // Consultation — direct paid booking
  'Consultation':          { label: 'Consultation',    pill: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',       dot: '#06b6d4', icon: 'fa-user-md',             kind: 'DIRECT' },
  // Webinar
  'Webinar':               { label: 'Webinar',         pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200', dot: '#8b5cf6', icon: 'fa-video',               kind: 'DIRECT' },
  'FREE WEBINAR INTEREST': { label: 'Free Webinar',    pill: 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200', dot: '#d946ef', icon: 'fa-gift',              kind: 'DIRECT' },
  // Contact / General
  'Contact':               { label: 'Contact',         pill: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',    dot: '#64748b', icon: 'fa-address-book',        kind: 'DIRECT' },
  'Home-Enroll':           { label: 'Home Enquiry',    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: '#10b981', icon: 'fa-home',             kind: 'DIRECT' },
};

// Resolve the display config for a lead — leadType takes priority over type
function resolveLeadType(lead) {
  // leadType field (e.g. 'RECORDED COURSE LEAD', 'LIVE COURSE LEAD') is most specific
  if (lead.leadType && LEAD_TYPE_CONFIG[lead.leadType]) return LEAD_TYPE_CONFIG[lead.leadType];
  // type enum fallback mapping
  const typeMap = {
    'Recorded-Course': LEAD_TYPE_CONFIG['RECORDED COURSE LEAD'],
    'Course-Inquiry':  LEAD_TYPE_CONFIG['COURSE ENQUIRY'],
    'Course':          LEAD_TYPE_CONFIG['LIVE COURSE LEAD'],
    'Consultation':    LEAD_TYPE_CONFIG['Consultation'],
    'Webinar':         LEAD_TYPE_CONFIG['Webinar'],
    'Contact':         LEAD_TYPE_CONFIG['Contact'],
    'Home-Enroll':     LEAD_TYPE_CONFIG['Home-Enroll'],
  };
  return typeMap[lead.type] || { label: lead.type || 'Unknown', pill: 'bg-slate-50 text-slate-500 ring-1 ring-slate-200', dot: '#94a3b8', icon: 'fa-tag', kind: '—' };
}

function AdminLeads({ activeFilter }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: activeFilter || '',
    paymentStatus: '',
    sort: 'newest',
  });

  const fetchLeads = async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const query = new URLSearchParams(currentFilters).toString();
      const res = await fetch(`${API_BASE}/api/leads?${query}&_t=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      } else {
        toast.error(data.message || 'Failed to fetch leads');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const list = leads.filter((lead) => !q || (
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.includes(searchTerm) ||
      lead.courseName?.toLowerCase().includes(q) ||
      lead.consultationType?.toLowerCase().includes(q)
    ));

    return [...list].sort((a, b) => {
      if (filters.sort === 'name_asc') {
        return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
      }
      if (filters.sort === 'name_desc') {
        return String(b.name || '').localeCompare(String(a.name || ''), undefined, { sensitivity: 'base' });
      }
      const aTime = new Date(getLeadSubmittedAt(a) || 0).getTime();
      const bTime = new Date(getLeadSubmittedAt(b) || 0).getTime();
      return filters.sort === 'oldest' ? aTime - bTime : bTime - aTime;
    });
  }, [leads, searchTerm, filters.sort]);

  useEffect(() => {
    // Sync filters and trigger immediate fetch
    setFilters(prev => {
      const newFilters = { ...prev, type: activeFilter || '' };
      fetchLeads(newFilters); // Fetch with fresh filters immediately
      return newFilters;
    });

    const interval = setInterval(() => fetchLeads(filters), 60000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  useEffect(() => {
    if (filters.startDate || filters.endDate || filters.sort) {
      fetchLeads(filters);
    }
  }, [filters.startDate, filters.endDate, filters.sort]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/leads/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        // Optimistically update the UI instantly
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
        setTimeout(fetchLeads, 500); // Secondary sync
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Lead deleted');
        fetchLeads();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const [activeMenu, setActiveMenu] = useState(null);
  const [messageModal, setMessageModal] = useState({ isOpen: false, data: null });
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportBtnRef = useRef(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    if (!exportMenuOpen) return;
    const handler = (e) => { if (!exportBtnRef.current?.contains(e.target)) setExportMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [exportMenuOpen]);

  const buildRows = (arr) => arr.map((lead) => {
    const submitted = getLeadSubmittedAt(lead);
    return {
      'Submitted Date': formatAdminDate(submitted),
      'Submitted Time': formatAdminTime(submitted),
      'Name': lead.name || '',
      'Email': lead.email || '',
      'Phone': lead.phone || '',
      'Lead Type': lead.leadType || lead.type || '',
      'Course / Service': lead.courseName || lead.consultationType || lead.webinarName || '',
      'Message': lead.message || '',
      'Date of Birth': lead.dob || '',
      'Birth Time': lead.tob || '',
      'Birth Place': lead.pob || '',
      'Payment Status': lead.paymentStatus || 'Pending',
      'Booking Status': lead.status || 'Pending',
      'Amount (₹)': lead.amount || '',
      'Order ID': lead.razorpay_order_id || lead.razorpayOrderId || '',
    };
  });

  const writeExcel = (rows, filename) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    // Auto column widths (cap at 60 chars)
    const keys = Object.keys(rows[0] || {});
    ws['!cols'] = keys.map(k => ({
      wch: Math.min(60, Math.max(k.length + 2, ...rows.map(r => String(r[k] || '').length)))
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, filename);
  };

  const dateSuffix = () => new Date().toLocaleDateString('en-IN').replace(/\//g, '-');

  const handleExportVisible = () => {
    if (filteredLeads.length === 0) { toast.error('No leads to export'); return; }
    const typeLabel = (filters.type || 'All').replace(/[^a-z0-9]/gi, '_');
    writeExcel(buildRows(filteredLeads), `DS_Leads_${typeLabel}_${dateSuffix()}.xlsx`);
    toast.success(`Exported ${filteredLeads.length} lead${filteredLeads.length !== 1 ? 's' : ''} to Excel`);
    setExportMenuOpen(false);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    setExportMenuOpen(false);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/leads?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed');
      const rows = buildRows(data.leads || []);
      if (rows.length === 0) { toast.error('No leads found'); return; }
      writeExcel(rows, `DS_Leads_All_${dateSuffix()}.xlsx`);
      toast.success(`Exported ${rows.length} total leads to Excel`);
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    setFilters({ startDate: '', endDate: '', type: activeFilter || '', paymentStatus: '', sort: 'newest' });
    setSearchTerm('');
    fetchLeads({ startDate: '', endDate: '', type: activeFilter || '', paymentStatus: '', sort: 'newest' });
  };

  const sortLabels = {
    newest: 'Newest first',
    oldest: 'Oldest first',
    name_asc: 'Name A → Z',
    name_desc: 'Name Z → A',
  };

  return (
    <div className="admin-leads-content">
      {/* Search & filters */}
      <div className="mb-4 space-y-3">
        <div className="search-bar w-full max-w-full bg-[var(--surface)] sm:max-w-md">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-2">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="col-span-2 h-[42px] w-full min-w-0 rounded border bg-white px-2 text-xs text-slate-800 sm:col-span-1 sm:text-sm"
            title="Sort leads"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
          </select>
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            className="h-[42px] w-full min-w-0 rounded border bg-white px-2 text-xs text-slate-800 sm:text-sm"
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="NOT REQUIRED">Not Required</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="h-[42px] w-full min-w-0 rounded border bg-white px-2 text-xs text-slate-800 sm:text-sm"
            title="Start date"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="h-[42px] w-full min-w-0 rounded border bg-white px-2 text-xs text-slate-800 sm:text-sm"
            title="End date"
          />
          <div className="col-span-2 flex gap-2 sm:col-span-1 lg:col-span-1 lg:ml-auto">
              {/* Excel export dropdown */}
              <div className="position-relative" ref={exportBtnRef}>
                <button
                  type="button"
                  onClick={() => setExportMenuOpen(v => !v)}
                  disabled={isExporting}
                  title="Download Excel"
                  className="d-flex align-items-center gap-2 fw-semibold text-white border-0 rounded-2 px-3"
                  style={{
                    height: '42px', fontSize: '12px', cursor: 'pointer',
                    background: isExporting ? '#4ade80' : '#16a34a',
                    transition: 'background 0.15s',
                    opacity: isExporting ? 0.8 : 1,
                  }}
                >
                  {isExporting
                    ? <><span className="lf-spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)', width: '13px', height: '13px' }} /> Exporting…</>
                    : <><i className="fas fa-file-excel" /> Excel</>
                  }
                  <i className="fas fa-chevron-down" style={{ fontSize: '9px', opacity: 0.7 }} />
                </button>

                {exportMenuOpen && (
                  <div
                    className="action-dropdown shadow-lg"
                    style={{ right: 0, top: 'calc(100% + 4px)', minWidth: '210px', display: 'block', zIndex: 9999 }}
                  >
                    <div className="px-3 py-2" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>
                      Download Excel
                    </div>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleExportVisible}
                    >
                      <i className="fas fa-table text-emerald-600" style={{ color: '#16a34a', width: '14px' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>Export current view</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filteredLeads.length} visible row{filteredLeads.length !== 1 ? 's' : ''}</div>
                      </div>
                    </button>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={handleExportAll}
                    >
                      <i className="fas fa-database" style={{ color: '#2563eb', width: '14px' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>Export all leads</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>All types, no filter</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button type="button" onClick={handleRefresh} className="topbar-icon-btn shrink-0" title="Reset filters" style={{ height: '42px', width: '42px' }}>
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>

      <div className="admin-table-shell" style={{ minHeight: '400px' }}>
        <div className="admin-table-shell__bar">
          <div>
            <div className="admin-table-shell__title">Lead Inbox</div>
            <div className="admin-table-shell__subtitle">
              {activeFilter
                ? `Showing ${LEAD_FILTER_LABELS?.[activeFilter] || activeFilter} leads`
                : 'All inbound enquiries and form submissions'}
            </div>
          </div>
          {!isLoading && (
            <div className="admin-table-shell__count">
              <strong>{filteredLeads.length}</strong>
              <span>lead{filteredLeads.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="admin-table-scroll">
        <table className="admin-table leads-table w-100" style={{ minWidth: '900px' }}>
          <thead>
            <tr>
              <th>Submitted On</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Message</th>
              <th>Birth Details</th>
              <th>Status</th>
              <th className="text-end px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8">
                  <div className="dash-loading py-5">
                    <div className="dash-spin"></div>
                    <span className="ms-2">Fetching records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-inbox fa-3x mb-3 opacity-25"></i>
                    <p>No leads found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const submitted = getLeadSubmittedAt(lead);
                const hasBirthDetails = lead.dob || lead.tob || lead.pob;
                return (
                <tr key={lead._id}>
                  <td>
                    <div className="atd-primary">{formatAdminDate(submitted)}</div>
                    <div className="atd-secondary">{formatAdminTime(submitted)}</div>
                  </td>
                  <td>
                    <div className="td-value fw-bold">{lead.name}</div>
                    <div className="td-muted small text-truncate" style={{ maxWidth: '180px' }}>{lead.email}</div>
                  </td>
                  <td>
                    <div className="td-value">{lead.phone}</div>
                  </td>
                  <td>
                    {(() => {
                      const lt = resolveLeadType(lead);
                      return (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            {/* KIND badge — RECORD or DIRECT */}
                            <span style={{
                              fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em',
                              padding: '1px 5px', borderRadius: '4px',
                              background: lt.kind === 'RECORD' ? '#e0e7ff' : '#f0fdf4',
                              color: lt.kind === 'RECORD' ? '#4338ca' : '#15803d',
                            }}>
                              {lt.kind}
                            </span>
                            {/* Lead type pill */}
                            <span style={{
                              fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
                              padding: '2px 8px', borderRadius: '5px', whiteSpace: 'nowrap',
                            }} className={lt.pill}>
                              <i className={`fas ${lt.icon} me-1`} style={{ fontSize: '9px' }} />
                              {lt.label.toUpperCase()}
                            </span>
                          </div>
                          <div className="td-muted small text-truncate" style={{ maxWidth: '150px' }}>
                            {lead.courseName || lead.consultationType || lead.webinarName || 'General'}
                          </div>
                        </>
                      );
                    })()}
                  </td>
                  <td>
                    {lead.message ? (
                      <div 
                        className="small fw-normal text-secondary text-truncate" 
                        style={{ maxWidth: '160px', cursor: 'pointer' }}
                        onClick={() => setMessageModal({ isOpen: true, data: lead })}
                        title="Click to view full message"
                      >
                        <i className="far fa-comment-alt me-1 text-violet"></i>
                        <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{lead.message}</span>
                      </div>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                  <td>
                    {hasBirthDetails ? (
                      <div className="atd-secondary" style={{ lineHeight: 1.5 }}>
                        {lead.dob && <div>DOB: {lead.dob}</div>}
                        {lead.tob && <div>Time: {lead.tob}</div>}
                        {lead.pob && <div>Place: {lead.pob}</div>}
                      </div>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>
                    <div className="status-pill mb-1" style={{ padding: '2px 8px', minWidth: '110px', justifyContent: 'flex-start' }}>
                      <span className="small text-muted me-1" style={{ fontSize: '0.65rem' }}>PAY:</span>
                      <div className={`dot ${lead.paymentStatus === 'NOT REQUIRED' ? 'dot--blue' : (lead.paymentStatus === 'Completed' || lead.paymentStatus === 'PAID' ? 'dot--green' : lead.paymentStatus === 'FAILED' ? 'dot--rose' : 'dot--amber')}`}></div>
                      <span style={{ fontSize: '0.8rem' }}>{lead.paymentStatus || 'Pending'}</span>
                    </div>
                    <div className="status-pill" style={{ padding: '2px 8px', minWidth: '110px', justifyContent: 'flex-start' }}>
                      <span className="small text-muted me-1" style={{ fontSize: '0.65rem' }}>STATUS:</span>
                      <div className={`dot ${lead.status === 'Done' ? 'dot--green' : lead.status === 'Confirmed' || lead.status === 'ENQUIRY RECEIVED' ? 'dot--blue' : 'dot--amber'}`}></div>
                      <span style={{ fontSize: '0.8rem' }}>{lead.status || 'Pending'}</span>
                    </div>
                  </td>
                  <td className="text-end px-4">
                    <div className="position-relative d-inline-block">
                      <button 
                        className="topbar-icon-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === lead._id ? null : lead._id);
                        }}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>

                      {activeMenu === lead._id && (
                        <div 
                          className="action-dropdown shadow-lg animate__animated animate__fadeIn"
                          style={{ position: 'absolute', top: '100%', right: '0', zIndex: '99999', display: 'block' }}
                        >
                          <div className="dropdown-label text-start px-3 py-2 text-muted small fw-bold" style={{ borderBottom: '1px solid var(--border)', marginBottom: '5px' }}>
                            Update Status
                          </div>
                          <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, 'ENQUIRY RECEIVED'); setActiveMenu(null); }}>
                            <div className="dot dot--blue me-2"></div> Enquiry Received
                          </button>
                          <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, 'Confirmed'); setActiveMenu(null); }}>
                            <div className="dot dot--violet me-2"></div> Confirmed
                          </button>
                          <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, 'In Progress'); setActiveMenu(null); }}>
                            <div className="dot dot--amber me-2"></div> In Progress
                          </button>
                          <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, 'Done'); setActiveMenu(null); }}>
                            <div className="dot dot--green me-2"></div> Done
                          </button>
                          <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.stopPropagation(); handleStatusChange(lead._id, 'Not Interested'); setActiveMenu(null); }}>
                            <div className="dot dot--rose me-2"></div> Not Interested
                          </button>
                          <div className="dropdown-divider"></div>
                          <button 
                            className="dropdown-item d-flex align-items-center text-danger"
                            onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead._id); setActiveMenu(null); }}
                          >
                            <i className="fas fa-trash-alt me-2"></i> Delete Lead
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
        </div>
        {!isLoading && filteredLeads.length > 0 && (
          <div className="admin-table-footer">
            <span>
              Showing <strong>{filteredLeads.length}</strong> lead{filteredLeads.length !== 1 ? 's' : ''}
              {filteredLeads.length !== leads.length && (
                <> of <strong>{leads.length}</strong> fetched</>
              )}
            </span>
            <span className="admin-table-footer__sort">
              Sorted: {sortLabels[filters.sort] || 'Newest first'} · Refreshes every 60s
            </span>
          </div>
        )}
      </div>

      {/* Message inquiry modal — centered Tailwind (no Bootstrap modal) */}
      {messageModal.isOpen && messageModal.data && (
        <div
          className="fixed inset-0 z-[20060] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-message-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60"
            aria-label="Close dialog"
            onClick={() => setMessageModal({ isOpen: false, data: null })}
          />
          <div
            className="relative z-10 flex w-full max-w-lg max-h-[min(90dvh,640px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2
                id="lead-message-modal-title"
                className="flex items-center gap-2 text-lg font-bold text-slate-900"
              >
                <i className="far fa-comment-dots text-violet-500" aria-hidden />
                Message Inquiry
              </h2>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                onClick={() => setMessageModal({ isOpen: false, data: null })}
                aria-label="Close"
              >
                <i className="fas fa-times text-sm" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-base font-bold text-violet-700"
                  aria-hidden
                >
                  {messageModal.data.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{messageModal.data.name}</p>
                  {messageModal.data.email ? (
                    <p className="truncate text-sm text-slate-500">{messageModal.data.email}</p>
                  ) : null}
                  {messageModal.data.phone ? (
                    <a
                      href={`tel:${String(messageModal.data.phone).replace(/\s/g, '')}`}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 no-underline"
                    >
                      <i className="fas fa-phone text-xs" aria-hidden />
                      {messageModal.data.phone}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {(messageModal.data.city || messageModal.data.age || messageModal.data.interest) ? (
                  <dl className="mb-3 space-y-1 border-b border-slate-200 pb-3">
                    {messageModal.data.city ? (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-slate-900">City:</dt>
                        <dd>{messageModal.data.city}</dd>
                      </div>
                    ) : null}
                    {messageModal.data.age ? (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-slate-900">Age:</dt>
                        <dd>{messageModal.data.age}</dd>
                      </div>
                    ) : null}
                    {messageModal.data.interest ? (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-slate-900">Interest:</dt>
                        <dd>{messageModal.data.interest}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                <p className="whitespace-pre-wrap">{messageModal.data.message || 'No message provided.'}</p>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 px-5 py-4 sm:px-6">
              <button
                type="button"
                className="w-full rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto sm:min-w-[120px]"
                onClick={() => setMessageModal({ isOpen: false, data: null })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLeads;
