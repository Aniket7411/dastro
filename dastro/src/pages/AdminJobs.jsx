import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from '@/utils/toast';
import {
  Briefcase, Users, Download, FileText, MapPin,
  Trash2, Edit3, Plus, CheckCircle, Clock,
  UserCheck, TrendingUp, ChevronDown, X,
  Building2, IndianRupee,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import API_BASE from '../utils/api';
import { openResume, resolveResumeUrl } from '../utils/resumeUrl';
import { formatAdminDate } from '../utils/adminTableUtils';
import AdminDataTable from '../components/admin/AdminDataTable';
import {
  AdminPersonCell,
  AdminBadge,
  AdminActionGroup,
  AdminIconButton,
} from '../components/admin/AdminTableCells';

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  New:          { pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',         dot: 'bg-sky-500' },
  Pending:      { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',   dot: 'bg-amber-400' },
  Reviewed:     { pill: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',   dot: 'bg-slate-400' },
  Shortlisted:  { pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200', dot: 'bg-violet-500' },
  Interviewing: { pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',      dot: 'bg-blue-500' },
  Selected:     { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Rejected:     { pill: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',      dot: 'bg-rose-400' },
};

const EMPTY_JOB = {
  title: '', department: '', location: '', experience: '',
  type: 'Full-time', salary: '', description: '',
  responsibilities: '', requirements: '', skills: '', qualifications: '',
};

/* ── Tiny stat card ─────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, bg, iconColor }) => (
  <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${bg}`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/70 shadow-sm`}>
      <Icon size={15} className={iconColor} />
    </div>
    <div>
      <div className="text-[18px] font-bold text-slate-800 leading-none tabular-nums">{value}</div>
      <div className="text-[10px] font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const AdminJobs = () => {
  const [view, setView]                 = useState('applications');
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [jobFilter, setJobFilter]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob]     = useState(null);
  const [jobFormData, setJobFormData]   = useState(EMPTY_JOB);

  const token  = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchApplications(); fetchJobs(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/jobs/applications`, config);
      if (data.success) setApplications(data.applications);
    } catch { toast.error('Failed to fetch applications'); }
    finally { setLoading(false); }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/jobs`, config);
      if (data.success) setJobs(data.jobs);
    } catch (e) { console.error(e); }
  };

  const getApplicantCountForJob = (job) => {
    if (!job) return 0;
    if (typeof job.applicantCount === 'number') return job.applicantCount;
    return applications.filter(
      (a) => String(a.jobId || '') === String(job._id) || a.appliedRole === job.title
    ).length;
  };

  const stats = useMemo(() => ({
    total:        applications.length,
    shortlisted:  applications.filter(a => a.status === 'Shortlisted').length,
    interviewing: applications.filter(a => a.status === 'Interviewing').length,
    selected:     applications.filter(a => a.status === 'Selected').length,
  }), [applications]);

  const visibleApps = useMemo(() => {
    let list = applications;

    if (jobFilter) {
      const job = jobs.find((j) => j._id === jobFilter);
      list = list.filter(
        (a) => String(a.jobId || '') === String(jobFilter) || (job && a.appliedRole === job.title)
      );
    }

    if (statusFilter) {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (a) => a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [applications, jobFilter, statusFilter, searchTerm, jobs]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await axios.put(`${API_BASE}/api/jobs/applications/${id}`, { status }, config);
      if (data.success) {
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
        toast.success('Status updated');
      }
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const { data } = await axios.delete(`${API_BASE}/api/jobs/applications/${id}`, config);
      if (data.success) {
        setApplications(prev => prev.filter(a => a._id !== id));
        toast.success('Application deleted');
      }
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await axios.delete(`${API_BASE}/api/jobs/${id}`, config);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job removed');
    } catch { toast.error('Failed to delete job'); }
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      ...job,
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements:     job.requirements?.join('\n') || '',
      skills:           job.skills?.join(', ') || '',
      qualifications:   job.qualifications?.join('\n') || '',
    });
    setShowJobModal(true);
  };

  const openAddJob = () => {
    setEditingJob(null);
    setJobFormData(EMPTY_JOB);
    setShowJobModal(true);
  };

  const closeModal = () => { setShowJobModal(false); setEditingJob(null); };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...jobFormData,
      salaryRange: jobFormData.salary,
      responsibilities: jobFormData.responsibilities.split('\n').filter(r => r.trim()),
      requirements:     jobFormData.requirements.split('\n').filter(r => r.trim()),
      skills:           jobFormData.skills.split(',').map(s => s.trim()).filter(Boolean),
      qualifications:   jobFormData.qualifications.split('\n').filter(q => q.trim()),
    };
    try {
      let res;
      if (editingJob) {
        res = await axios.put(`${API_BASE}/api/jobs/${editingJob._id}`, payload, config);
      } else {
        res = await axios.post(`${API_BASE}/api/jobs`, payload, config);
      }
      if (res.data.success) {
        toast.success(editingJob ? 'Job updated' : 'Job posted');
        closeModal(); fetchJobs();
      }
    } catch { toast.error('Operation failed'); }
  };

  const exportToExcel = () => {
    const rows = applications.map(app => ({
      'Applied Date':     new Date(app.createdAt).toLocaleDateString(),
      'Full Name':        app.fullName,
      'Email':            app.email,
      'Phone':            app.phone,
      'City':             app.city,
      'Position':         app.appliedRole,
      'Status':           app.status,
      'Total Experience': app.totalExperience,
      'Specialization':   app.specialization,
      'Languages':        app.languages,
      'Resume Link':      resolveResumeUrl(app.resumeUrl, API_BASE),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    XLSX.writeFile(wb, `Applications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const field = (key) => ({
    value: jobFormData[key],
    onChange: (e) => setJobFormData(prev => ({ ...prev, [key]: e.target.value }))
  });

  const applicantColumns = [
    {
      key: 'fullName',
      label: 'Applicant',
      sortable: true,
      sortValue: (row) => row.fullName,
      render: (app) => (
        <AdminPersonCell
          name={app.fullName}
          secondary={app.email}
          meta={<><MapPin size={10} /> {app.city || '—'}</>}
        />
      ),
    },
    {
      key: 'appliedRole',
      label: 'Job Posting',
      sortable: true,
      render: (app) => (
        <>
          <AdminBadge tone="indigo" uppercase>{app.appliedRole}</AdminBadge>
          {app.specialization && <div className="atd-secondary">{app.specialization}</div>}
        </>
      ),
    },
    {
      key: 'totalExperience',
      label: 'Experience',
      sortable: true,
      render: (app) => (
        <>
          <div className="atd-primary">{app.totalExperience || '—'} yrs</div>
          <div className="atd-secondary">{app.languages || '—'}</div>
        </>
      ),
    },
    {
      key: 'appliedDate',
      label: 'Applied On',
      sortable: true,
      sortValue: (row) => row.appliedDate || row.createdAt,
      render: (app) => (
        <div className="atd-secondary">{formatAdminDate(app.appliedDate || app.createdAt)}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (app) => {
        const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.New;
        return (
          <div className="relative" style={{ minWidth: '132px' }}>
            <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${sc.dot} pointer-events-none z-10`} />
            <select
              value={app.status}
              onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
              className={`atd-select w-full ${sc.pill}`}
            >
              {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={9} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (app) => {
        const resumeHref = resolveResumeUrl(app.resumeUrl, API_BASE);
        return (
          <AdminActionGroup>
            {resumeHref ? (
              <>
                <AdminIconButton href={resumeHref} target="_blank" rel="noopener noreferrer" title="View resume" tone="indigo">
                  <FileText size={13} />
                </AdminIconButton>
                <AdminIconButton
                  title="Download resume"
                  tone="emerald"
                  onClick={() => {
                    if (!openResume(app.resumeUrl, API_BASE, app.fullName)) {
                      toast.error('Resume link is missing');
                    }
                  }}
                >
                  <Download size={13} />
                </AdminIconButton>
              </>
            ) : (
              <span className="atd-secondary">No resume</span>
            )}
            <AdminIconButton title="Delete application" tone="rose" onClick={() => handleDeleteApplication(app._id)}>
              <Trash2 size={13} />
            </AdminIconButton>
          </AdminActionGroup>
        );
      },
    },
  ];

  const jobColumns = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (job) => (
        <div className="atd-person">
          <div className="atd-avatar atd-avatar--indigo"><Briefcase size={14} /></div>
          <div className="atd-person__meta">
            <div className="atd-primary">{job.title}</div>
            <div className="atd-secondary">{job.experience || 'Experience not set'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (job) => (
        <span className="atd-meta"><Building2 size={11} /> {job.department || '—'}</span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (job) => (
        <span className="atd-meta"><MapPin size={11} /> {job.location || '—'}</span>
      ),
    },
    {
      key: 'type',
      label: 'Employment',
      sortable: true,
      render: (job) => <AdminBadge tone="blue" uppercase>{job.type}</AdminBadge>,
    },
    {
      key: 'applicants',
      label: 'Applicants',
      sortable: true,
      sortValue: (job) => getApplicantCountForJob(job),
      align: 'center',
      render: (job) => (
        <AdminBadge tone="indigo">
          <Users size={11} style={{ marginRight: 4 }} />
          {getApplicantCountForJob(job)}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (job) => (
        <AdminActionGroup>
          <AdminIconButton
            title="View applicants"
            tone="sky"
            onClick={() => {
              setView('applications');
              setJobFilter(job._id);
            }}
          >
            <Users size={13} />
          </AdminIconButton>
          <AdminIconButton title="Edit posting" tone="amber" onClick={() => openEditJob(job)}>
            <Edit3 size={13} />
          </AdminIconButton>
          <AdminIconButton title="Delete posting" tone="rose" onClick={() => handleDeleteJob(job._id)}>
            <Trash2 size={13} />
          </AdminIconButton>
        </AdminActionGroup>
      ),
    },
  ];

  /* ── Shared input classes ────────────────────────────────── */
  const inp = "w-full px-3 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 placeholder:text-slate-400 font-normal";
  const lbl = "block text-[10px] font-bold text-slate-500 uppercase tracking-[0.08em] mb-1.5";

  /* ───────────────────────────────────── RENDER ─────────── */
  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="text-[17px] font-bold text-slate-800 leading-tight">Careers & Hiring</div>
          <div className="text-[12px] text-slate-400 mt-0.5">Manage job postings and review applicants</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Tab switch */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-0.5 shadow-sm">
            <button
              onClick={() => setView('applications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${view === 'applications' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Users size={13} /> Applicants
            </button>
            <button
              onClick={() => setView('jobs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${view === 'jobs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Briefcase size={13} /> Job Postings
            </button>
          </div>

          {/* Action button */}
          {view === 'applications' ? (
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-all"
            >
              <Download size={13} /> Export Excel
            </button>
          ) : (
            <button
              onClick={openAddJob}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              <Plus size={13} /> New Position
            </button>
          )}
        </div>
      </div>

      {/* ── Stats (applications view only) ──────────────── */}
      {view === 'applications' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Applied"  value={stats.total}        icon={TrendingUp}  bg="bg-indigo-50 border-indigo-100"  iconColor="text-indigo-500" />
          <StatCard label="Shortlisted"    value={stats.shortlisted}  icon={UserCheck}   bg="bg-violet-50 border-violet-100"  iconColor="text-violet-500" />
          <StatCard label="Interviewing"   value={stats.interviewing} icon={Clock}       bg="bg-amber-50 border-amber-100"    iconColor="text-amber-500" />
          <StatCard label="Offer Extended" value={stats.selected}     icon={CheckCircle} bg="bg-emerald-50 border-emerald-100" iconColor="text-emerald-500" />
        </div>
      )}

      {/* ── Filter bar (applications view) ──────────────── */}
      {view === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search candidate name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchApplications()}
              className={inp + ' pl-3'}
            />
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}
              className={inp + ' appearance-none pr-8 cursor-pointer'}
            >
              <option value="">All Roles ({applications.length})</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({getApplicantCountForJob(j)})
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={inp + ' appearance-none pr-8 cursor-pointer'}
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => { fetchApplications(); fetchJobs(); }}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shrink-0"
          >
            Refresh
          </button>
        </div>
      )}

      {view === 'applications' && (
        <AdminDataTable
          columns={applicantColumns}
          data={visibleApps}
          loading={loading}
          loadingMessage="Loading applicants…"
          entityLabel="applicant"
          totalCount={applications.length}
          filteredCount={visibleApps.length}
          title="Applicant Pipeline"
          subtitle={jobFilter
            ? `Filtered by ${jobs.find((j) => j._id === jobFilter)?.title || 'selected job'}`
            : 'All job applications across postings'}
          emptyIcon={Users}
          emptyTitle="No applicants found"
          emptyMessage="Try changing the job filter, status, or search term."
          minWidth={980}
        />
      )}

      {view === 'jobs' && (
        <AdminDataTable
          columns={jobColumns}
          data={jobs}
          entityLabel="job posting"
          title="Active Job Postings"
          subtitle="Manage openings and track applicant volume per role"
          emptyIcon={Briefcase}
          emptyTitle="No job postings yet"
          emptyMessage="Create your first opening to start receiving applications."
          emptyAction={(
            <button
              type="button"
              onClick={openAddJob}
              className="mt-2 text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              + Create first job posting
            </button>
          )}
          minWidth={900}
        />
      )}

      {/* ── Job Modal ─────────────────────────────────────── */}
      {showJobModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="aj-modal bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${editingJob ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                  {editingJob ? <Edit3 size={17} className="text-white" /> : <Plus size={17} className="text-white" />}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-slate-800 leading-tight">
                    {editingJob ? `Editing — ${editingJob.title}` : 'Post New Position'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {editingJob
                      ? `${editingJob.department} · ${editingJob.location}`
                      : 'Fill in the details below to publish a new opening'}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3" style={{ scrollbarWidth: 'thin' }}>
              <form onSubmit={handleJobSubmit} id="job-form" className="flex flex-col gap-3">

                {/* Section: Core details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                      <Briefcase size={11} className="text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Core Details</span>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'title',      label: 'Job Title',  ph: 'e.g. Vedic Astrologer', req: true },
                      { key: 'department', label: 'Department', ph: 'e.g. Consultation',      req: true },
                      { key: 'location',   label: 'Location',   ph: 'e.g. Remote / Delhi',    req: true },
                    ].map(({ key, label, ph, req }) => (
                      <div key={key}>
                        <label className={lbl}>{label}</label>
                        <input type="text" required={req} placeholder={ph} {...field(key)} className={inp} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Employment terms */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
                      <IndianRupee size={11} className="text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Employment Terms</span>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={lbl}>Experience Required</label>
                      <input type="text" required placeholder="e.g. 2–5 Years" {...field('experience')} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Employment Type</label>
                      <div className="relative">
                        <select {...field('type')} className={inp + ' appearance-none pr-8 cursor-pointer'}>
                          {['Full-time', 'Part-time', 'Freelance', 'Contract'].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Salary / Compensation</label>
                      <input type="text" required placeholder="₹40k – ₹70k / month" {...field('salary')} className={inp} />
                    </div>
                  </div>
                </div>

                {/* Section: Job content */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center">
                      <FileText size={11} className="text-violet-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Job Description</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-3">
                    <div>
                      <label className={lbl}>Overview</label>
                      <textarea required rows={3} placeholder="Brief overview of the role and what the candidate will do…" {...field('description')} className={inp + ' resize-none'} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>
                          Responsibilities
                          <span className="ml-1 normal-case font-normal text-slate-400 tracking-normal">· one per line</span>
                        </label>
                        <textarea rows={5} placeholder={"Conduct birth chart consultations\nProvide remedial suggestions\nMentor junior staff"} {...field('responsibilities')} className={inp + ' resize-none'} />
                      </div>
                      <div>
                        <label className={lbl}>
                          Requirements
                          <span className="ml-1 normal-case font-normal text-slate-400 tracking-normal">· one per line</span>
                        </label>
                        <textarea rows={5} placeholder={"Proficiency in Vedic Astrology\nStrong communication skills\nSelf-motivated"} {...field('requirements')} className={inp + ' resize-none'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>
                          Skills
                          <span className="ml-1 normal-case font-normal text-slate-400 tracking-normal">· comma separated</span>
                        </label>
                        <input type="text" placeholder="Vedic Astrology, Tarot, Client Management" {...field('skills')} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>
                          Qualifications
                          <span className="ml-1 normal-case font-normal text-slate-400 tracking-normal">· one per line</span>
                        </label>
                        <textarea rows={3} placeholder={"Degree in any discipline\nCertified astrologer preferred"} {...field('qualifications')} className={inp + ' resize-none'} />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
              <p className="text-[11px] text-slate-400">
                {editingJob ? 'Changes are saved immediately after clicking Update.' : 'Position will be listed publicly after publishing.'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="job-form"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white rounded-lg shadow-sm transition-all ${editingJob ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {editingJob ? <Edit3 size={13} /> : <CheckCircle size={13} />}
                  {editingJob ? 'Update Position' : 'Publish Position'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
