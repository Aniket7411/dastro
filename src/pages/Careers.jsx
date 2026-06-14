import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, IndianRupee, ChevronRight,
  Upload, CheckCircle2, Star, Sparkles, Send,
  User, Mail, Phone, Home, BookOpen, Globe, Zap, Search, Filter, X, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { uploadResume } from '../utils/uploadMedia';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import PageBanner from '../components/PageBanner';
import { PAGE_BANNERS } from '../data/pageBanners';
import SEO from '../components/SEO';
import { BANNER_CONTENT_GAP, SITE_CONTAINER, SITE_PAGE } from '../utils/siteTokens';

/* ─── Inline styles (no Tailwind dependency) ─── */
const S = {
  root: {
    minHeight: '100vh',
    background: 'var(--site-bg)',
    fontFamily: 'var(--font-body)',
    paddingTop: 0,
    paddingBottom: 'clamp(2.5rem, 6vw, 4rem)',
    color: 'var(--site-text)',
    width: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  inner: { 
    maxWidth: 'var(--container-public)', 
    width: '100%', 
    margin: '0 auto', 
    padding: '0 var(--page-pad-x)',
    boxSizing: 'border-box',
  },

  /* Header */
  pageHeader: { textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' },
  pageTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--h1-size)', fontWeight: 800,
    color: 'var(--site-text)', letterSpacing: 0,
    marginBottom: 10,
  },
  pageSub: { fontSize: 'var(--body-size)', color: 'var(--site-text-muted)', maxWidth: 620, margin: '0 auto', lineHeight: 1.65 },

  /* Layout */
  layout: { display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) minmax(0, 1fr)', gap: 'clamp(1rem, 3vw, 1.75rem)', alignItems: 'start' },

  /* Panel label */
  panelLabel: {
    fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#9a8f85',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  rolesBadge: {
    background: '#C9A84C22', color: '#8a6e1e', fontSize: 10,
    padding: '2px 8px', borderRadius: 20, border: '0.5px solid #C9A84C55',
  },

  /* Job list card */
  jobItem: (active) => ({
    background: active ? '#FFFDF5' : 'var(--site-surface)',
    border: active ? '1px solid var(--site-accent)' : '1px solid var(--site-border)',
    boxShadow: active ? '0 0 0 2px rgba(200, 131, 42, 0.12)' : 'var(--shadow-card)',
    borderRadius: 'var(--radius-card)', padding: '14px 16px', marginBottom: 10,
    cursor: 'pointer', transition: 'all 0.15s',
  }),
  jobItemTitle: (active) => ({
    fontSize: 13.5, fontWeight: 500,
    color: active ? '#8a6e1e' : '#1a1714',
    marginBottom: 8, lineHeight: 1.3,
  }),
  jobItemTags: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  tagDept: {
    fontSize: 10, padding: '2px 7px', borderRadius: 4,
    background: '#f0ede9', color: '#6b6560', border: '0.5px solid #e0d9d1',
  },
  tagType: {
    fontSize: 10, padding: '2px 7px', borderRadius: 4,
    background: '#FFF8E6', color: '#8a6e1e', border: '0.5px solid #C9A84C44',
  },
  jobItemMeta: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9a8f85' },

  /* Detail card */
  detailCard: {
    background: 'var(--site-surface)', border: '1px solid var(--site-border)',
    borderRadius: 'var(--radius-card)', padding: 'clamp(1.2rem, 4vw, 2rem)', marginBottom: 20,
    boxShadow: 'var(--shadow-card)',
  },
  detailTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--h2-size)', fontWeight: 700, color: 'var(--site-text)', marginBottom: 12,
  },
  badgeRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 },
  badge: (variant) => {
    const map = {
      purple: { bg: '#F0EFFE', color: '#5b4ec9', border: '#AFA9EC' },
      blue:   { bg: '#E6F1FB', color: '#185FA5', border: '#85B7EB' },
      green:  { bg: '#EAF3DE', color: '#3B6D11', border: '#97C459' },
    };
    const v = map[variant];
    return { fontSize: 11, padding: '3px 10px', borderRadius: 6, background: v.bg, color: v.color, border: `0.5px solid ${v.border}` };
  },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 },
  sectionLabel: {
    fontSize: 10.5, fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#C9A84C',
    display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10,
  },
  desc: { fontSize: 13, color: '#4a4440', lineHeight: 1.65, marginBottom: 18 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: '#4a4440', lineHeight: 1.5, marginBottom: 6 },
  bullet: { width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', marginTop: 5, flexShrink: 0 },
  skillChip: {
    fontSize: 11.5, padding: '4px 10px', borderRadius: 6,
    background: '#f7f4ee', color: '#4a4440', border: '0.5px solid #e0d9d1',
    margin: '0 4px 4px 0', display: 'inline-block',
  },

  /* Form card */
  formCard: { background: 'var(--site-surface)', border: '1px solid var(--site-border)', borderRadius: 'var(--radius-card)', padding: 'clamp(1.2rem, 4vw, 2rem)', boxShadow: 'var(--shadow-card)' },
  formHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 24, paddingBottom: 16, borderBottom: '0.5px solid #f0ebe3',
  },
  formIconBox: {
    width: 38, height: 38, borderRadius: 8,
    background: '#FFF8E6', border: '0.5px solid #C9A84C44',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a6e1e',
    flexShrink: 0,
  },
  formTitle: { fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--site-text)' },
  formSub: { fontSize: 12, color: '#9a8f85', marginTop: 2 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 5 },
  fieldLabel: {
    fontSize: 10.5, fontWeight: 500, letterSpacing: '0.07em',
    textTransform: 'uppercase', color: '#9a8f85',
    display: 'flex', alignItems: 'center', gap: 4,
  },
  input: {
    width: '100%', background: '#FAFAF8',
    border: '1px solid var(--site-border)', borderRadius: 'var(--radius-control)',
    padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)',
    color: '#1a1714', outline: 'none',
  },
  select: {
    width: '100%', background: '#FAFAF8',
    border: '1px solid var(--site-border)', borderRadius: 'var(--radius-control)',
    padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)',
    color: '#1a1714', outline: 'none', cursor: 'pointer',
  },
  textarea: {
    width: '100%', background: '#FAFAF8',
    border: '1px solid var(--site-border)', borderRadius: 'var(--radius-control)',
    padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-body)',
    color: '#1a1714', outline: 'none', resize: 'vertical', lineHeight: 1.55,
  },
  uploadZone: {
    background: '#FAFAF8', border: '1px dashed var(--site-border-strong)',
    borderRadius: 'var(--radius-control)', padding: '20px', textAlign: 'center', cursor: 'pointer',
  },
  uploadText: { fontSize: 12.5, color: '#9a8f85', marginTop: 4 },
  resumeUploaded: {
    background: '#f4faf0',
    border: '1px solid #b8ddb0',
    borderRadius: 'var(--radius-control)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  resumeFileName: {
    flex: '1 1 180px',
    fontSize: 13,
    fontWeight: 600,
    color: '#3B6D11',
    wordBreak: 'break-all',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  resumeActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  resumeActionBtn: (variant = 'outline') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    border: variant === 'danger' ? '1px solid #f5c2c2' : '1px solid var(--site-border-strong)',
    background: variant === 'danger' ? '#fef2f2' : '#fff',
    color: variant === 'danger' ? '#b91c1c' : '#5C3D26',
  }),
  submitBtn: {
    width: '100%', background: 'var(--site-primary)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius-control)', padding: '13px',
    fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginTop: 20, letterSpacing: '0.02em',
  },
  divider: { height: '0.5px', background: '#f0ebe3', margin: '24px 0' },
  spinner: {
    width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loader: {
    minHeight: '100vh', background: '#F7F4EE',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  loaderSpinner: {
    width: 40, height: 40, border: '2px solid #e0d9d1',
    borderTop: '2px solid #C9A84C', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const FALLBACK_JOBS = [
  {
    _id: '1',
    title: 'Vedic Astrology Consultant',
    department: 'Consultation',
    location: 'Remote / Noida',
    experience: '5+ Years',
    type: 'Full-time',
    salary: '₹50,000 – ₹80,000 / month',
    description: 'We are seeking an experienced Vedic Astrologer to join our premium consultation team and serve clients across the globe.',
    responsibilities: ['Provide accurate birth-chart readings', 'Conduct live client consultations', 'Maintain session logs and follow-ups'],
    skills: ['Vedic Astrology', 'Kundli Reading', 'Client Communication', 'Hindi / English'],
    qualifications: ['Certification in Astrology', 'Minimum 5 years of practice', 'Online consultation experience preferred'],
  },
  {
    _id: '2',
    title: 'Tarot Reader',
    department: 'Consultation',
    location: 'Remote',
    experience: '2+ Years',
    type: 'Part-time',
    salary: 'Commission Based',
    description: 'Join our team of spiritual guides as a professional Tarot Reader, delivering online sessions to clients seeking clarity.',
    responsibilities: ['Conduct live online Tarot sessions', 'Prepare email-based readings', 'Maintain a client journal'],
    skills: ['Tarot Spreads', 'Intuitive Reading', 'English / Hindi', 'Empathy'],
    qualifications: ['2+ years Tarot experience', 'Online platform experience preferred', 'Strong communication skills'],
  },
];

const EMPTY_FORM = {
  fullName: '', email: '', phone: '', city: '',
  totalExperience: '', specialization: 'Vedic Astrology',
  languages: '',
};

function normalizeJob(job) {
  return {
    ...job,
    salary: job.salaryRange || job.salary || '',
    experience: job.experience || '',
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    skills: Array.isArray(job.skills) ? job.skills : [],
    qualifications: Array.isArray(job.qualifications) ? job.qualifications : [],
  };
}

function getJobSalaryLabel(job) {
  if (!job) return null;
  const raw = job.salaryRange ?? job.salary ?? '';
  const salary = String(raw).trim();
  return salary || null;
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeUploading, setResumeUploading] = useState(false);
  const detailRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const departments = ['All', ...new Set(jobs.map(j => j.department))];
  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || j.location?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchDept = filterDept === 'All' || j.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setTimeout(() => {
      if (window.innerWidth <= 991 && detailRef.current) {
        const y = detailRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    document.title = 'Careers | DS Astro';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'Join India\'s leading astrology platform. Explore cosmic careers at DS Astro.';

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/jobs`);
      if (data.success && data.jobs.length) {
        const normalized = data.jobs.map(normalizeJob);
        setJobs(normalized);
        setSelectedJob(normalized[0]);
      } else throw new Error('empty');
    } catch {
      const normalized = FALLBACK_JOBS.map(normalizeJob);
      setJobs(normalized);
      setSelectedJob(normalized[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const clearResume = () => {
    setResume(null);
    setResumeUrl('');
    setResumeUploading(false);
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const triggerReplaceResume = () => {
    if (resumeUploading) return;
    if (resumeInputRef.current) resumeInputRef.current.value = '';
    resumeInputRef.current?.click();
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      e.target.value = '';
      return;
    }
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload only PDF, DOC, or DOCX files');
      e.target.value = '';
      return;
    }

    setResume(file);
    setResumeUrl('');
    setResumeUploading(true);
    try {
      const url = await uploadResume(file);
      setResumeUrl(url);
      toast.success('Resume uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Resume upload failed');
      clearResume();
    } finally {
      setResumeUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl) return toast.error('Please upload your resume and wait for it to finish');
    if (resumeUploading) return toast.error('Resume is still uploading. Please wait.');

    const validationError = getContactValidationError({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone
    });
    if (validationError) {
      return toast.error(validationError);
    }

    setSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    try {
      const { data } = await axios.post(`${API_BASE}/api/jobs/apply`, {
        ...formData,
        phone: sanitizedPhone,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        languages: formData.languages.trim(),
        resumeUrl,
        jobId: selectedJob?._id || undefined,
        appliedRole: selectedJob?.title || 'General Application',
      });
      if (data.success) {
        toast.success('Application submitted! Our team will contact you soon.');
        setFormData(EMPTY_FORM);
        clearResume();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={S.loader}>
      <div style={S.loaderSpinner} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const salaryLabel = getJobSalaryLabel(selectedJob);

  return (
    <div className={`careers-page ${SITE_PAGE} w-full overflow-x-hidden`}>
      <SEO title="Careers" description="Join DS Astro Institute — explore open roles in astrology, technology, and creative teams." url="/careers" />
      <PageBanner {...PAGE_BANNERS.careers} />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .careers-input:focus { border-color: #C9A84C !important; }
        .careers-upload:hover { border-color: #C9A84C !important; background: #FFFDF5 !important; }
        .careers-job-card:hover { border-color: rgba(200, 131, 42, 0.45) !important; }
        .submit-btn-inner:hover { background: #b8943d !important; }
        .submit-btn-inner:active { transform: scale(0.99); }

        /* Responsive Layout Overrides */
        @media (max-width: 991px) {
          .careers-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .careers-inner {
            padding: 0 16px !important;
          }
          .careers-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .careers-form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .careers-title {
            font-size: 24px !important;
            line-height: 1.2 !important;
            text-align: center !important;
            word-wrap: break-word !important;
          }
          .page-sub-text {
            font-size: 13px !important;
            line-height: 1.5 !important;
            padding: 0 10px !important;
          }
          .careers-sidebar {
            order: 1;
          }
          .careers-content {
            order: 2;
          }
          .careers-job-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            max-height: none !important;
          }
          .job-item-card {
            width: 100% !important;
            margin-bottom: 0 !important;
          }
          .careers-detail-card, .careers-form-card {
            padding: 20px !important;
          }
        }
      `}</style>

      <div className={`${SITE_CONTAINER} ${BANNER_CONTENT_GAP}`}>
        <div className="careers-layout">
          {/* ── LEFT: Job List ── */}
          <div className="careers-sidebar">
            <div className="careers-panel-label">
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} aria-hidden="true" /> Open Positions
              </span>
              <span className="careers-roles-badge">{filteredJobs.length} Roles</span>
            </div>

            <div className="site-mb-3 flex flex-col gap-2">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-site-text-soft" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search roles or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="careers-filter-input careers-input"
                />
              </div>
              <div className="relative">
                <Filter size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-site-text-soft" aria-hidden="true" />
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="careers-filter-input careers-input"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="careers-job-list">
              {filteredJobs.length === 0 && (
                <p className="careers-empty">No jobs found matching your criteria.</p>
              )}
              {filteredJobs.map((job) => {
                const active = selectedJob?._id === job._id;
                const cardSalary = getJobSalaryLabel(job);
                return (
                  <motion.div
                    key={job._id}
                    role="button"
                    tabIndex={0}
                    className={`careers-job-card job-item-card${active ? ' careers-job-card--active' : ''}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleJobClick(job)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJobClick(job)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="careers-job-card__title">{job.title}</h3>
                      <ChevronRight
                        size={16}
                        className={`mt-0.5 shrink-0 transition-transform ${active ? 'rotate-90 text-site-accent' : 'text-site-text-soft'}`}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="careers-job-card__tags">
                      {job.department ? <span className="careers-job-tag careers-job-tag--dept">{job.department}</span> : null}
                      {job.type ? <span className="careers-job-tag careers-job-tag--type">{job.type}</span> : null}
                    </div>

                    <div className="careers-job-card__meta">
                      {job.location ? (
                        <div className="careers-job-card__meta-item">
                          <MapPin size={13} aria-hidden="true" />
                          <span>{job.location}</span>
                        </div>
                      ) : null}
                      {job.experience ? (
                        <div className="careers-job-card__meta-item">
                          <Clock size={13} aria-hidden="true" />
                          <span>{job.experience}</span>
                        </div>
                      ) : null}
                      {cardSalary ? (
                        <div className="careers-job-card__meta-item careers-job-card__meta-item--salary">
                          <IndianRupee size={13} aria-hidden="true" />
                          <span>{cardSalary}</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Detail + Form ── */}
          <div className="careers-content" ref={detailRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedJob?._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Job Detail Card */}
                <div className="careers-detail-card">
                  <h2 className="careers-detail-card__title">{selectedJob?.title}</h2>
                  <div className="careers-detail-badges">
                    {selectedJob?.department ? (
                      <span className="careers-detail-badge careers-detail-badge--dept">{selectedJob.department}</span>
                    ) : null}
                    {selectedJob?.location ? (
                      <span className="careers-detail-badge careers-detail-badge--location">{selectedJob.location}</span>
                    ) : null}
                    {selectedJob?.type ? (
                      <span className="careers-detail-badge careers-detail-badge--type">{selectedJob.type}</span>
                    ) : null}
                    {salaryLabel ? (
                      <span className="careers-detail-badge careers-detail-badge--salary">{salaryLabel}</span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
                    <div>
                      <div className="careers-section-label">
                        <Star size={13} aria-hidden="true" /> Description
                      </div>
                      <p className="careers-prose">{selectedJob?.description}</p>

                      {selectedJob?.requirements?.length > 0 ? (
                        <>
                          <div className="careers-section-label careers-section-label--spaced">
                            <CheckCircle2 size={13} aria-hidden="true" /> Requirements
                          </div>
                          {selectedJob.requirements.map((item) => (
                            <div key={item} className="careers-list-item">
                              <span className="careers-list-bullet" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </>
                      ) : null}

                      {selectedJob?.responsibilities?.length > 0 ? (
                        <>
                          <div className="careers-section-label careers-section-label--spaced">
                            <CheckCircle2 size={13} aria-hidden="true" /> Responsibilities
                          </div>
                          {selectedJob.responsibilities.map((item) => (
                            <div key={item} className="careers-list-item">
                              <span className="careers-list-bullet" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </>
                      ) : null}
                    </div>

                    <div>
                      {selectedJob?.skills?.length > 0 ? (
                        <>
                          <div className="careers-section-label">
                            <Zap size={13} aria-hidden="true" /> Required Skills
                          </div>
                          <div className="site-mb-3">
                            {selectedJob.skills.map((skill) => (
                              <span key={skill} className="careers-skill-chip">{skill}</span>
                            ))}
                          </div>
                        </>
                      ) : null}

                      {selectedJob?.qualifications?.length > 0 ? (
                        <>
                          <div className={`careers-section-label${selectedJob?.skills?.length ? ' careers-section-label--spaced' : ''}`}>
                            <BookOpen size={13} aria-hidden="true" /> Qualifications
                          </div>
                          {selectedJob.qualifications.map((item) => (
                            <div key={item} className="careers-list-item">
                              <span className="careers-list-bullet" aria-hidden="true" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Application Form */}
                <div className="careers-form-card" style={S.formCard}>
                  <div style={S.formHeader}>
                    <div style={S.formIconBox}><Send size={16} /></div>
                    <div>
                      <div style={S.formTitle}>Apply for this role</div>
                      <div style={S.formSub}>{selectedJob?.title}</div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="careers-form-grid" style={S.formGrid}>
                      {/* Row 1 */}
                      <Field label="Full Name" icon={<User size={11} />}>
                        <input className="careers-input" style={S.input} type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
                      </Field>
                      <Field label="Email Address" icon={<Mail size={11} />}>
                        <input className="careers-input" style={S.input} type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                      </Field>

                      {/* Row 2 */}
                      <Field label="Phone Number" icon={<Phone size={11} />}>
                        <input className="careers-input" style={S.input} type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                      </Field>
                      <Field label="City" icon={<Home size={11} />}>
                        <input className="careers-input" style={S.input} type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" />
                      </Field>

                      {/* Row 3 */}
                      <Field label="Total Experience" icon={<Briefcase size={11} />}>
                        <input className="careers-input" style={S.input} type="text" name="totalExperience" required value={formData.totalExperience} onChange={handleChange} placeholder="e.g. 5 Years" />
                      </Field>
                      <Field label="Specialization" icon={<Globe size={11} />}>
                        <select className="careers-input" style={S.select} name="specialization" value={formData.specialization} onChange={handleChange}>
                          <option>Vedic Astrology</option>
                          <option>Tarot</option>
                          <option>Numerology</option>
                          <option>Palmistry</option>
                          <option>Face Reading</option>
                          <option>Kundli Analysis</option>
                          <option>Other</option>
                        </select>
                      </Field>

                      {/* Row 4 */}
                      <Field label="Languages Known" icon={<Globe size={11} />}>
                        <input className="careers-input" style={S.input} type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Hindi…" />
                      </Field>
                      <div></div>
                    </div>

                    {/* Resume Upload */}
                    <div style={{ ...S.fieldWrap, marginBottom: 16 }}>
                      <label style={S.fieldLabel}>
                        <Upload size={11} /> Resume / CV
                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#c4bbb4', marginLeft: 4 }}>
                          (PDF, DOC, DOCX – max 5MB)
                        </span>
                      </label>

                      {resumeUploading ? (
                        <div style={S.uploadZone}>
                          <Upload size={22} style={{ color: '#C9A84C', marginBottom: 4 }} />
                          <div style={S.uploadText}>
                            <span style={{ color: '#8a6e1e', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ ...S.spinner, border: '2px solid #e0d9d1', borderTop: '2px solid #C9A84C' }} />
                              Uploading {resume?.name ? `"${resume.name}"` : 'resume'}…
                            </span>
                          </div>
                        </div>
                      ) : resumeUrl && resume ? (
                        <div style={S.resumeUploaded}>
                          <div style={S.resumeFileName}>
                            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                            <span>{resume.name}</span>
                          </div>
                          <div style={S.resumeActions}>
                            <button
                              type="button"
                              style={S.resumeActionBtn('outline')}
                              onClick={triggerReplaceResume}
                            >
                              <RefreshCw size={14} />
                              Replace
                            </button>
                            <button
                              type="button"
                              style={S.resumeActionBtn('danger')}
                              onClick={() => {
                                clearResume();
                                toast.success('Resume removed');
                              }}
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          className="careers-upload"
                          style={S.uploadZone}
                          htmlFor="resume-upload"
                        >
                          <Upload size={22} style={{ color: '#C9A84C', marginBottom: 4 }} />
                          <div style={S.uploadText}>Click to upload or drag & drop</div>
                        </label>
                      )}

                      <input
                        ref={resumeInputRef}
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        disabled={resumeUploading}
                        onChange={handleResumeFileChange}
                      />
                    </div>

                    <motion.button
                      className="submit-btn-inner"
                      type="submit"
                      disabled={submitting || resumeUploading || !resumeUrl}
                      style={S.submitBtn}
                      whileTap={{ scale: 0.99 }}
                    >
                      {submitting ? (
                        <div style={S.spinner} />
                      ) : (
                        <><Send size={16} /> Submit Application</>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small helper component */
function Field({ label, icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 10.5, fontWeight: 500, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: '#9a8f85',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {icon}{label}
      </label>
      {children}
    </div>
  );
}
