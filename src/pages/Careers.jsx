import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, IndianRupee, ChevronRight,
  Upload, CheckCircle2, Star, Send,
  User, Mail, Phone, Home, BookOpen, Globe, Zap, Search, Filter, X, RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { uploadResume } from '../utils/uploadMedia';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import PageBanner from '../components/PageBanner';
import { PAGE_BANNERS } from '../data/pageBanners';
import SEO from '../components/SEO';
import TailwindPage from '../components/layout/TailwindPage';
import {
  BANNER_CONTENT_GAP,
  SITE_CONTAINER,
  TW_FIELD,
  TW_FIELD_INPUT,
  TW_FIELD_INPUT_FILTER,
  TW_FIELD_LABEL,
} from '../utils/siteTokens';
import { BTN } from '../components/consultation/tokens';

const CARD =
  'rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_4px_16px_rgba(42,15,2,0.06)]';

const SECTION_LABEL =
  'mb-2.5 flex items-center gap-1.5 font-body text-[0.6875rem] font-bold uppercase tracking-wider text-site-accent-dark';

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

function Field({ id, label, icon, children }) {
  return (
    <div className={TW_FIELD}>
      <label htmlFor={id} className={TW_FIELD_LABEL}>
        {icon}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

function JobTag({ children, variant = 'dept' }) {
  const tones =
    variant === 'type'
      ? 'border-site-accent/30 bg-site-accent/10 text-site-accent-dark'
      : 'border-site-accent-dark/12 bg-site-surface text-site-muted';
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 font-body text-[0.625rem] font-semibold leading-tight sm:text-[0.6875rem] ${tones}`}>
      {children}
    </span>
  );
}

function DetailBadge({ children, tone = 'dept' }) {
  const map = {
    dept: 'border-violet-200 bg-violet-50 text-violet-800',
    location: 'border-sky-200 bg-sky-50 text-sky-800',
    type: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    salary: 'border-amber-200 bg-amber-50 text-amber-900',
  };
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 font-body text-xs font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const departments = ['All', ...new Set(jobs.map((j) => j.department).filter(Boolean))];
  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      j.location?.toLowerCase().includes(debouncedSearch.toLowerCase());
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
    document.title = 'Careers | DS Astrology';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'Join India\'s leading astrology platform. Explore cosmic careers at DS Astrology.';
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
      phone: formData.phone,
    });
    if (validationError) return toast.error(validationError);

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

  if (loading) {
    return (
      <TailwindPage className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-site-accent-dark/20 border-t-site-accent" />
      </TailwindPage>
    );
  }

  const salaryLabel = getJobSalaryLabel(selectedJob);

  return (
    <TailwindPage>
      <SEO
        title="Careers"
        description="Join DS Astrology — explore open roles in astrology, technology, and creative teams."
        url="/careers"
      />
      <PageBanner {...PAGE_BANNERS.careers} />

      <div className={`${SITE_CONTAINER} ${BANNER_CONTENT_GAP} pb-10 sm:pb-14`}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:gap-8">
          {/* ── Sidebar: job list ── */}
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--spacing-site-header)+1rem)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-body text-[0.6875rem] font-bold uppercase tracking-wider text-site-muted">
                <Briefcase size={14} className="text-site-accent-dark" aria-hidden="true" />
                Open Positions
              </span>
              <span className="rounded-full border border-site-accent/35 bg-site-accent/10 px-2 py-0.5 font-body text-[0.625rem] font-bold text-site-accent-dark">
                {filteredJobs.length} Roles
              </span>
            </div>

            <div className="mb-3 flex flex-col gap-2 sm:flex-row lg:flex-col">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-soft"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search roles or locations…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={TW_FIELD_INPUT_FILTER}
                />
              </div>
              <div className="relative min-w-0 sm:max-w-[9rem] lg:max-w-none">
                <Filter
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-soft"
                  aria-hidden="true"
                />
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className={`${TW_FIELD_INPUT_FILTER} cursor-pointer`}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex max-h-[min(70vh,520px)] flex-col gap-2.5 overflow-y-auto pr-0.5 lg:max-h-[calc(100vh-var(--spacing-site-header)-12rem)]">
              {filteredJobs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-site-accent-dark/15 bg-white/60 px-4 py-6 text-center text-sm text-site-muted">
                  No jobs found matching your criteria.
                </p>
              ) : (
                filteredJobs.map((job) => {
                  const active = selectedJob?._id === job._id;
                  const cardSalary = getJobSalaryLabel(job);
                  return (
                    <motion.button
                      key={job._id}
                      type="button"
                      className={[
                        CARD,
                        'm-0 w-full cursor-pointer p-3.5 text-left transition duration-200 sm:p-4',
                        active
                          ? 'border-site-accent bg-[#fffdf5] shadow-[0_0_0_2px_rgba(200,131,42,0.12)]'
                          : 'hover:border-site-accent/40 hover:shadow-[0_6px_20px_rgba(42,15,2,0.08)]',
                      ].join(' ')}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`m-0 font-heading text-sm font-bold leading-snug sm:text-[0.9375rem] ${
                            active ? 'text-site-accent-dark' : 'text-site-primary'
                          }`}
                        >
                          {job.title}
                        </h3>
                        <ChevronRight
                          size={16}
                          className={`mt-0.5 shrink-0 transition-transform ${active ? 'rotate-90 text-site-accent' : 'text-site-soft'}`}
                          aria-hidden="true"
                        />
                      </div>

                      {(job.department || job.type) ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {job.department ? <JobTag>{job.department}</JobTag> : null}
                          {job.type ? <JobTag variant="type">{job.type}</JobTag> : null}
                        </div>
                      ) : null}

                      <div className="mt-2.5 grid grid-cols-1 gap-1.5 text-[0.6875rem] text-site-muted sm:grid-cols-2 sm:text-xs">
                        {job.location ? (
                          <span className="flex items-center gap-1.5 min-w-0">
                            <MapPin size={13} className="shrink-0 text-site-soft" aria-hidden="true" />
                            <span className="truncate">{job.location}</span>
                          </span>
                        ) : null}
                        {job.experience ? (
                          <span className="flex items-center gap-1.5 min-w-0">
                            <Clock size={13} className="shrink-0 text-site-soft" aria-hidden="true" />
                            <span className="truncate">{job.experience}</span>
                          </span>
                        ) : null}
                        {cardSalary ? (
                          <span className="col-span-full flex items-center gap-1.5 font-semibold text-site-accent-dark">
                            <IndianRupee size={13} className="shrink-0" aria-hidden="true" />
                            <span>{cardSalary}</span>
                          </span>
                        ) : null}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── Main: detail + application ── */}
          <div className="min-w-0" ref={detailRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedJob?._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                {/* Job detail */}
                <article className={`${CARD} p-4 sm:p-6`}>
                  <h2 className="m-0 font-heading text-xl font-bold leading-tight text-site-primary sm:text-2xl">
                    {selectedJob?.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedJob?.department ? (
                      <DetailBadge tone="dept">{selectedJob.department}</DetailBadge>
                    ) : null}
                    {selectedJob?.location ? (
                      <DetailBadge tone="location">{selectedJob.location}</DetailBadge>
                    ) : null}
                    {selectedJob?.type ? (
                      <DetailBadge tone="type">{selectedJob.type}</DetailBadge>
                    ) : null}
                    {salaryLabel ? (
                      <DetailBadge tone="salary">{salaryLabel}</DetailBadge>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
                    <div>
                      <div className={SECTION_LABEL}>
                        <Star size={13} aria-hidden="true" />
                        Description
                      </div>
                      <p className="m-0 text-sm leading-relaxed text-site-muted sm:text-[0.9375rem]">
                        {selectedJob?.description}
                      </p>

                      {selectedJob?.requirements?.length > 0 ? (
                        <div className="mt-5">
                          <div className={SECTION_LABEL}>
                            <CheckCircle2 size={13} aria-hidden="true" />
                            Requirements
                          </div>
                          <ul className="m-0 list-none space-y-2 p-0">
                            {selectedJob.requirements.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-site-muted">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-site-accent" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {selectedJob?.responsibilities?.length > 0 ? (
                        <div className="mt-5">
                          <div className={SECTION_LABEL}>
                            <CheckCircle2 size={13} aria-hidden="true" />
                            Responsibilities
                          </div>
                          <ul className="m-0 list-none space-y-2 p-0">
                            {selectedJob.responsibilities.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-site-muted">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-site-accent" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      {selectedJob?.skills?.length > 0 ? (
                        <div>
                          <div className={SECTION_LABEL}>
                            <Zap size={13} aria-hidden="true" />
                            Required Skills
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedJob.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex rounded-md border border-site-accent-dark/12 bg-site-surface px-2.5 py-1 font-body text-xs font-medium text-site-text"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {selectedJob?.qualifications?.length > 0 ? (
                        <div className={selectedJob?.skills?.length ? 'mt-5' : ''}>
                          <div className={SECTION_LABEL}>
                            <BookOpen size={13} aria-hidden="true" />
                            Qualifications
                          </div>
                          <ul className="m-0 list-none space-y-2 p-0">
                            {selectedJob.qualifications.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-site-muted">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-site-accent" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>

                {/* Application form */}
                <section className={`${CARD} p-3 sm:p-4`}>
                  <div className="mb-3 flex items-center gap-2.5 border-b border-site-accent-dark/10 pb-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-site-accent/30 bg-site-accent/10 text-site-accent-dark">
                      <Send size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="!m-0 font-heading text-sm font-bold leading-tight text-site-primary sm:text-base">
                        Apply for this role
                      </h3>
                      <p className="!m-0 mt-0.5 truncate text-[11px] text-site-muted sm:text-xs">{selectedJob?.title}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
                      <Field id="career-fullName" label="Full name" icon={<User size={11} aria-hidden="true" />}>
                        <input
                          id="career-fullName"
                          className={TW_FIELD_INPUT}
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                        />
                      </Field>
                      <Field id="career-email" label="Email" icon={<Mail size={11} aria-hidden="true" />}>
                        <input
                          id="career-email"
                          className={TW_FIELD_INPUT}
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                        />
                      </Field>
                      <Field id="career-phone" label="Phone" icon={<Phone size={11} aria-hidden="true" />}>
                        <input
                          id="career-phone"
                          className={TW_FIELD_INPUT}
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </Field>
                      <Field id="career-city" label="City" icon={<Home size={11} aria-hidden="true" />}>
                        <input
                          id="career-city"
                          className={TW_FIELD_INPUT}
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai"
                        />
                      </Field>
                      <Field id="career-experience" label="Experience" icon={<Briefcase size={11} aria-hidden="true" />}>
                        <input
                          id="career-experience"
                          className={TW_FIELD_INPUT}
                          type="text"
                          name="totalExperience"
                          required
                          value={formData.totalExperience}
                          onChange={handleChange}
                          placeholder="e.g. 5 years"
                        />
                      </Field>
                      <Field id="career-specialization" label="Specialization" icon={<Globe size={11} aria-hidden="true" />}>
                        <select
                          id="career-specialization"
                          className={`${TW_FIELD_INPUT} cursor-pointer`}
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                        >
                          <option>Vedic Astrology</option>
                          <option>Tarot</option>
                          <option>Numerology</option>
                          <option>Palmistry</option>
                          <option>Face Reading</option>
                          <option>Kundli Analysis</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field id="career-languages" label="Languages" icon={<Globe size={11} aria-hidden="true" />}>
                        <input
                          id="career-languages"
                          className={TW_FIELD_INPUT}
                          type="text"
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                          placeholder="English, Hindi…"
                        />
                      </Field>
                    </div>

                    <div className={TW_FIELD}>
                      <span className={TW_FIELD_LABEL}>
                        <Upload size={11} aria-hidden="true" />
                        <span>
                          Resume
                          <span className="normal-case font-normal text-site-soft"> (PDF, DOC — 5MB)</span>
                        </span>
                      </span>

                      {resumeUploading ? (
                        <div className="mt-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-site-accent-dark/20 bg-[#fffcf8] px-3 py-4 text-center">
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-site-accent-dark">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-site-accent/25 border-t-site-accent" />
                            Uploading…
                          </span>
                        </div>
                      ) : resumeUrl && resume ? (
                        <div className="mt-1 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2">
                          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-emerald-800">
                            <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
                            <span className="break-all">{resume.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={triggerReplaceResume}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-site-accent-dark/15 bg-white px-3 py-1.5 text-xs font-bold text-site-primary transition hover:border-site-accent/40"
                            >
                              <RefreshCw size={14} aria-hidden="true" />
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                clearResume();
                                toast.success('Resume removed');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                            >
                              <X size={14} aria-hidden="true" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="resume-upload"
                          className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-site-accent-dark/20 bg-[#fffcf8] px-3 py-3.5 text-center transition hover:border-site-accent hover:bg-[#fffdf5]"
                        >
                          <Upload size={18} className="mb-1 text-site-accent" aria-hidden="true" />
                          <span className="text-xs text-site-muted">Click to upload resume</span>
                        </label>
                      )}

                      <input
                        ref={resumeInputRef}
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        disabled={resumeUploading}
                        onChange={handleResumeFileChange}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting || resumeUploading || !resumeUrl}
                      className={`${BTN.cta} !mt-1`}
                      whileTap={{ scale: 0.99 }}
                    >
                      {submitting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          <Send size={16} aria-hidden="true" />
                          Submit Application
                        </>
                      )}
                    </motion.button>
                  </form>
                </section>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TailwindPage>
  );
}
