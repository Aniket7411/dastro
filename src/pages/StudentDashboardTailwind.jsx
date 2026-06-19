import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgePercent,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  FileArchive,
  FileText,
  FolderOpen,
  GraduationCap,
  Loader2,
  Lock,
  LogOut,
  Package,
  PenLine,
  Plus,
  Rocket,
  Save,
  Sparkles,
  Tag,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';
import useStudentDashboard, {
  computeDaysRemaining,
  formatDashboardDate,
} from '../hooks/useStudentDashboard';
import SEO from '../components/SEO';

const WRAP = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';
const CARD =
  'rounded-xl border border-site-accent-dark/12 bg-white shadow-[0_1px_8px_rgba(42,15,2,0.05)]';
const STAT_CARD =
  'flex min-h-0 items-center gap-3.5 rounded-xl border border-t-2 border-site-accent-dark/10 px-4 py-3.5 shadow-[0_1px_6px_rgba(42,15,2,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(42,15,2,0.09)] sm:px-4 sm:py-4';

const inputCls = [
  'w-full rounded-xl border border-site-accent-dark/20 bg-[#fffcf8] px-4 py-2.5',
  'text-sm font-semibold text-site-primary outline-none transition',
  'focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/20',
].join(' ');

const BTN_BASE =
  'sd-btn m-0 inline-flex w-auto max-w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 !rounded-full px-4 py-2 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

const BTN = {
  primary: `${BTN_BASE} border-0 bg-site-primary text-white shadow-sm hover:bg-site-accent-dark hover:shadow-md`,
  outline: `${BTN_BASE} border border-site-accent-dark/25 bg-white text-site-primary hover:border-site-accent hover:bg-site-bg`,
  hero: `${BTN_BASE} border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20`,
  heroGhost: `${BTN_BASE} border border-white/15 bg-white/5 text-white/85 hover:bg-white/15 hover:text-white`,
  sm: `${BTN_BASE} px-3 py-1.5 text-xs`,
  link: `${BTN_BASE} no-underline`,
};

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function validityStyle(val) {
  if (val === 'Lifetime Access') return 'bg-purple-50 text-purple-700 border-purple-200';
  if (val === 'Expired') return 'bg-red-50 text-red-600 border-red-200';
  const n = parseInt(val, 10);
  if (!Number.isNaN(n) && n <= 30) return 'bg-orange-50 text-orange-600 border-orange-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function validityBorderCls(val) {
  if (val === 'Lifetime Access') return 'border-l-purple-300';
  if (val === 'Expired') return 'border-l-red-300';
  const n = parseInt(val, 10);
  if (!Number.isNaN(n) && n <= 30) return 'border-l-orange-300';
  return 'border-l-emerald-300';
}

function Skel({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-site-accent-dark/15 ${className}`} />;
}

function DashboardLoading() {
  return (
    <div className="student-dashboard-ui min-h-screen w-full bg-site-bg font-body text-site-text">
      <div className="bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark px-4 pb-10 pt-7 sm:px-6 sm:pb-12 sm:pt-8">
        <Skel className="mb-2 h-3 w-24 bg-white/10" />
        <Skel className="mb-2 h-8 w-72 max-w-full bg-white/10" />
        <Skel className="h-3.5 w-96 max-w-full bg-white/10" />
      </div>
      <div className={WRAP}>
        <div className="-mt-1 pb-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${STAT_CARD} bg-white`}>
                <Skel className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skel className="h-2.5 w-16" />
                  <Skel className="h-5 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="flex items-center justify-center gap-2 py-6 text-sm font-semibold text-site-muted">
        <Loader2 size={16} className="animate-spin text-site-accent" />
        Preparing your dashboard…
      </p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, iconBg, cardBg, topBorder }) {
  return (
    <div className={`${STAT_CARD} ${topBorder || ''} ${cardBg || 'bg-white'}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ${iconBg}`}
      >
        <Icon size={17} strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-site-muted sm:text-[11px]">
          {label}
        </p>
        <p className="mt-0.5 font-heading text-xl font-extrabold leading-none text-site-primary sm:text-2xl">
          {value}
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ value, thin = false }) {
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div className={`w-full overflow-hidden rounded-full bg-site-accent-dark/10 ${thin ? 'h-1.5' : 'h-2'}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-site-accent-dark to-site-accent transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionHead({ icon: Icon, title, badge, iconCls }) {
  const cls = iconCls || 'bg-site-accent/10 text-site-accent-dark';
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${cls}`}>
          <Icon size={15} />
        </div>
        <h2 className="font-heading text-sm font-extrabold text-site-primary">{title}</h2>
      </div>
      {badge}
    </div>
  );
}

function Pill({ children, active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
        active
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'bg-site-bg text-site-muted'
      }`}
    >
      {children}
    </span>
  );
}

function BtnPrimary({ children, className = '', ...rest }) {
  return (
    <button type="button" className={`${BTN.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function BtnOutline({ children, className = '', ...rest }) {
  return (
    <button type="button" className={`${BTN.outline} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default function StudentDashboardTailwind() {
  const {
    profile,
    profileForm,
    profileEditMode,
    setProfileEditMode,
    passwordEditMode,
    setPasswordEditMode,
    passwordForm,
    savingProfile,
    savingPassword,
    enrolledCourses,
    courseValidity,
    banners,
    merchandise,
    newCourses,
    offers,
    materials,
    selectedCourseForMaterials,
    loading,
    loadingMaterials,
    studentName,
    handleLogout,
    handleProfileChange,
    handlePasswordChange,
    saveProfile,
    savePassword,
    resetPasswordForm,
    loadMaterials,
  } = useStudentDashboard();

  useEffect(() => {
    if (enrolledCourses.length > 0 && selectedCourseForMaterials === null) {
      loadMaterials(enrolledCourses[0].id);
    }
  }, [enrolledCourses, selectedCourseForMaterials, loadMaterials]);

  if (loading) return <DashboardLoading />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const completedCourses = enrolledCourses.filter((c) => Number(c.progress) >= 100).length;
  const activeCourses = enrolledCourses.filter(
    (c) => computeDaysRemaining(c.validTill) !== 'Expired',
  ).length;
  const avgProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((t, c) => t + (Number(c.progress) || 0), 0) / enrolledCourses.length,
      )
    : 0;

  const stats = [
    {
      label: 'Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      iconBg: 'bg-pink-100 text-pink-700',
      cardBg: 'bg-pink-50',
      topBorder: 'border-t-pink-300',
    },
    {
      label: 'Active',
      value: activeCourses,
      icon: GraduationCap,
      iconBg: 'bg-blue-100 text-blue-700',
      cardBg: 'bg-blue-50',
      topBorder: 'border-t-blue-300',
    },
    {
      label: 'Completed',
      value: completedCourses,
      icon: Sparkles,
      iconBg: 'bg-purple-100 text-purple-700',
      cardBg: 'bg-purple-50',
      topBorder: 'border-t-purple-400',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      iconBg: 'bg-orange-100 text-orange-700',
      cardBg: 'bg-orange-50',
      topBorder: 'border-t-orange-300',
    },
  ];

  const materialTabs = enrolledCourses.slice(0, 6);
  const promoItems = [...merchandise.slice(0, 3), ...newCourses.slice(0, 3)];
  const hasPromotions = banners.length > 0 || promoItems.length > 0 || newCourses.length > 0;

  return (
    <div className="student-dashboard-ui min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO title="Student Dashboard" description="Your courses, materials, and account." url="/dashboard" />

      {/* Hero */}
      <header className="relative w-full overflow-hidden bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark pb-10 sm:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className={`relative z-10 flex flex-col gap-3 py-7 sm:gap-4 sm:py-8 lg:flex-row lg:items-end lg:justify-between lg:py-9 ${WRAP}`}>
          <div className="min-w-0 flex-1">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f5c98d] shadow-[0_0_12px_rgba(245,201,141,0.12)] backdrop-blur-sm sm:text-[11px]">
              <Sparkles size={11} />
              {greeting}
            </span>
            <h1 className="font-heading text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-[#f5c98d] to-[#e8a855] bg-clip-text text-transparent">
                {studentName}
              </span>
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-snug text-[#f5d9b8]/85 sm:mt-2">
              {enrolledCourses.length > 0
                ? 'Track progress, download materials, and continue learning.'
                : 'Browse recorded courses to start your Vedic astrology journey.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link to="/recorded-courses" className={BTN.hero}>
              <Plus size={15} />
              Explore Courses
            </Link>
            <button type="button" onClick={handleLogout} className={`${BTN.heroGhost} lg:hidden`}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className={`relative z-20 mt-3 sm:mt-5 ${WRAP}`}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      <main className={`pb-10 pt-5 sm:pb-12 sm:pt-6 ${WRAP}`}>
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[272px_minmax(0,1fr)] xl:gap-7">

          {/* Sidebar */}
          <aside className="flex flex-col gap-3 lg:sticky lg:top-[9rem]">

            {/* Profile card */}
            <div className={`${CARD} overflow-hidden`}>
              {/* Gradient header area */}
              <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-transparent px-4 pb-3.5 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-site-accent-dark to-site-accent text-sm font-black text-white shadow-md ring-2 ring-white ring-offset-2 ring-offset-amber-50/60">
                    {initials(studentName) || <UserRound size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-extrabold text-site-primary">
                      {studentName}
                    </p>
                    <p className="text-xs font-semibold text-site-muted">Student account</p>
                  </div>
                  <Pill active>Active</Pill>
                </div>
              </div>

              {/* Profile details */}
              <div className="border-t border-site-accent-dark/10 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
                <dl className="space-y-2.5">
                  {[
                    ['Name', profile?.name || '—'],
                    ['Email', profile?.email || '—'],
                    ['Mobile', profile?.mobile || '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-site-accent">
                        {k}
                      </dt>
                      <dd className="mt-0.5 break-all text-sm font-semibold text-site-primary">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-site-accent-dark/10 pt-3">
                  <BtnOutline onClick={() => setProfileEditMode((o) => !o)}>
                    <PenLine size={14} />
                    {profileEditMode ? 'Cancel Edit' : 'Edit Profile'}
                  </BtnOutline>
                  <BtnOutline
                    onClick={() => {
                      setPasswordEditMode((open) => {
                        if (open) resetPasswordForm();
                        return !open;
                      });
                      setProfileEditMode(false);
                    }}
                  >
                    <Lock size={14} />
                    {passwordEditMode ? 'Cancel' : 'Change Password'}
                  </BtnOutline>
                  <BtnPrimary className="hidden lg:inline-flex" onClick={handleLogout}>
                    <LogOut size={14} />
                    Logout
                  </BtnPrimary>
                </div>
              </div>
            </div>

            {passwordEditMode && (
              <div className={`${CARD} p-4 sm:p-5`}>
                <h3 className="font-heading text-sm font-extrabold text-site-primary">Change password</h3>
                <p className="mb-4 mt-1 text-xs font-semibold text-site-muted">
                  Use at least 6 characters. You&apos;ll stay signed in after updating.
                </p>
                <form onSubmit={savePassword} className="space-y-3">
                  {[
                    ['currentPassword', 'Current password'],
                    ['newPassword', 'New password'],
                    ['confirmPassword', 'Confirm new password'],
                  ].map(([field, label]) => (
                    <label key={field} className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-site-accent">
                        {label}
                      </span>
                      <input
                        type="password"
                        value={passwordForm[field]}
                        onChange={handlePasswordChange(field)}
                        className={inputCls}
                        autoComplete={
                          field === 'currentPassword' ? 'current-password' : 'new-password'
                        }
                        required
                      />
                    </label>
                  ))}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <BtnPrimary type="submit" disabled={savingPassword}>
                      {savingPassword ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Lock size={14} />
                      )}
                      {savingPassword ? 'Updating…' : 'Update password'}
                    </BtnPrimary>
                    <BtnOutline
                      type="button"
                      onClick={() => {
                        resetPasswordForm();
                        setPasswordEditMode(false);
                      }}
                    >
                      <X size={14} />
                      Cancel
                    </BtnOutline>
                  </div>
                </form>
              </div>
            )}

            {profileEditMode && (
              <div className={`${CARD} p-4 sm:p-5`}>
                <h3 className="font-heading text-sm font-extrabold text-site-primary">Edit profile</h3>
                <p className="mb-4 mt-1 text-xs font-semibold text-site-muted">
                  Update your account details.
                </p>
                <form onSubmit={saveProfile} className="space-y-3">
                  {['name', 'email', 'mobile'].map((field) => (
                    <label key={field} className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-site-accent">
                        {field}
                      </span>
                      <input
                        type={field === 'email' ? 'email' : field === 'mobile' ? 'tel' : 'text'}
                        value={profileForm[field]}
                        onChange={handleProfileChange(field)}
                        className={inputCls}
                        placeholder={
                          field === 'mobile'
                            ? '10-digit number'
                            : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        inputMode={field === 'mobile' ? 'numeric' : undefined}
                        maxLength={field === 'mobile' ? 10 : undefined}
                        required
                      />
                    </label>
                  ))}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <BtnPrimary type="submit" disabled={savingProfile}>
                      {savingProfile ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      {savingProfile ? 'Saving…' : 'Save'}
                    </BtnPrimary>
                    <BtnOutline type="button" onClick={() => setProfileEditMode(false)}>
                      <X size={14} />
                      Cancel
                    </BtnOutline>
                  </div>
                </form>
              </div>
            )}

            {enrolledCourses.length > 0 && (
              <div className={`${CARD} overflow-hidden`}>
                <div className="flex items-center justify-between px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
                  <h3 className="font-heading text-sm font-extrabold text-site-primary">
                    Overall progress
                  </h3>
                  <span className="font-price text-2xl font-bold tabular-nums tracking-tight text-site-accent-dark">
                    {avgProgress}%
                  </span>
                </div>
                <div className="px-4 sm:px-5">
                  <ProgressBar value={avgProgress} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-site-accent-dark/8 px-4 py-3 sm:px-5">
                  <p className="text-xs text-site-muted">
                    {completedCourses} of {enrolledCourses.length} course
                    {enrolledCourses.length !== 1 ? 's' : ''} completed
                  </p>
                  {avgProgress === 100 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <Sparkles size={11} />
                      All done!
                    </span>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-col gap-5 sm:gap-6">

            {/* My Courses */}
            <section>
              <SectionHead
                icon={BookOpen}
                title="My courses"
                iconCls="bg-blue-100 text-blue-700"
                badge={<Pill>{enrolledCourses.length} enrolled</Pill>}
              />
              <div className={CARD}>
                {enrolledCourses.length === 0 ? (
                  <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                      <FolderOpen size={30} className="text-blue-500" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-site-primary">
                      No enrolled courses yet
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-site-muted">
                      Purchase a recorded course to unlock lessons and materials.
                    </p>
                    <Link to="/recorded-courses" className={`${BTN.link} ${BTN.primary} mt-6`}>
                      Browse courses
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-site-accent-dark/8">
                    {enrolledCourses.map((course) => {
                      const validityData = courseValidity[course.id];
                      const validity = validityData?.isLifetime
                        ? 'Lifetime Access'
                        : (validityData?.daysRemaining != null
                          ? (validityData.daysRemaining === 0 ? 'Expired' : `${validityData.daysRemaining} day${validityData.daysRemaining === 1 ? '' : 's'}`)
                          : computeDaysRemaining(course.validTill, course.isLifetime));
                      return (
                        <article
                          key={course.id}
                          className={`flex flex-col gap-3 border-l-4 px-4 py-4 transition-colors hover:bg-site-bg/50 sm:flex-row sm:items-center sm:px-5 sm:py-5 ${validityBorderCls(validity)}`}
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-20 w-full shrink-0 rounded-lg object-cover sm:h-[5.5rem] sm:w-32"
                          />
                          <div className="min-w-0 flex-1">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              course.courseType === 'Live'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {course.courseType}
                            </span>
                            <h3 className="mt-1.5 line-clamp-2 font-heading text-base font-extrabold leading-snug text-site-primary">
                              {course.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-site-muted">
                              <span className="inline-flex items-center gap-1">
                                <Calendar size={11} />
                                {formatDashboardDate(course.purchaseDate)}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${validityStyle(validity)}`}
                              >
                                {validity}
                              </span>
                              {course.accessApproved === false ? (
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                  course.accessStatus === 'disabled'
                                    ? 'border-slate-200 bg-slate-100 text-slate-700'
                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                                }`}>
                                  {course.accessStatus === 'disabled' ? 'Access disabled' : 'Awaiting approval'}
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <ProgressBar value={course.progress} thin />
                              <span className="shrink-0 text-xs font-bold text-site-accent-dark">
                                {course.accessApproved === false ? '—' : `${course.progress}%`}
                              </span>
                            </div>
                          </div>
                          {course.accessApproved === false ? (
                            <span
                              className={`${BTN.link} ${BTN.primary} self-start opacity-60 sm:self-center`}
                              title="Lessons unlock after admin approval"
                            >
                              Pending
                            </span>
                          ) : (
                          <Link
                            to={`/student/course/${course.id}`}
                            className={`${BTN.link} ${BTN.primary} self-start sm:self-center`}
                          >
                            Continue
                            <ChevronRight size={14} />
                          </Link>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Materials + Offers */}
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <section className="flex flex-col">
                <SectionHead
                  icon={FolderOpen}
                  title="Course materials"
                  iconCls="bg-amber-100 text-amber-700"
                />
                <div className={`flex flex-1 flex-col ${CARD} overflow-hidden`}>
                  <div className="overflow-x-auto border-b border-site-accent-dark/10 bg-site-bg/40">
                    <div className="flex gap-2 p-3">
                      {materialTabs.length === 0 ? (
                        <Pill>No courses</Pill>
                      ) : (
                        materialTabs.map((course) => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => loadMaterials(course.id)}
                            className={`sd-btn shrink-0 whitespace-nowrap !rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              selectedCourseForMaterials === course.id
                                ? 'bg-site-primary text-white shadow-sm'
                                : 'bg-white text-site-muted shadow-sm hover:bg-amber-50 hover:text-site-primary'
                            }`}
                          >
                            {course.title.length > 22
                              ? `${course.title.slice(0, 22)}…`
                              : course.title}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-4 sm:p-5">
                    {materials.length > 0 ? (
                      <div className="space-y-2">
                        {materials.map((item) => {
                          const isZip = (item.fileType || '').toLowerCase().includes('zip');
                          const FIcon = isZip ? FileArchive : FileText;
                          const iconCls = isZip
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700';
                          return (
                            <div
                              key={item.materialId || item.id || item.title}
                              className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 transition hover:border-site-accent/35 hover:bg-white"
                            >
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                                <FIcon size={15} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-1 text-sm font-extrabold text-site-primary">
                                  {item.title || 'Course material'}
                                </p>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-site-accent">
                                  {item.fileType || 'PDF'}
                                </p>
                              </div>
                              {item.fileUrl && (
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`${BTN.link} ${BTN.sm} ${BTN.primary}`}
                                >
                                  <Download size={13} />
                                  <span className="hidden sm:inline">Download</span>
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex min-h-36 flex-col items-center justify-center text-center">
                        {loadingMaterials ? (
                          <>
                            <Loader2 size={28} className="animate-spin text-site-accent" />
                            <p className="mt-3 text-xs font-bold text-site-muted">Loading…</p>
                          </>
                        ) : (
                          <>
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                              <FileText size={22} className="text-amber-400" />
                            </div>
                            <p className="text-xs font-semibold text-site-muted">
                              {materialTabs.length
                                ? 'Select a course above'
                                : 'Enroll in a course to access materials'}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="flex flex-col">
                <SectionHead
                  icon={BadgePercent}
                  title="Available offers"
                  iconCls="bg-emerald-100 text-emerald-700"
                  badge={offers.length > 0 ? <Pill>{offers.length}</Pill> : null}
                />
                <div className={`flex flex-1 flex-col ${CARD} p-4 sm:p-5`}>
                  {offers.length === 0 ? (
                    <div className="flex min-h-36 flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                        <Tag size={22} className="text-emerald-400" />
                      </div>
                      <p className="text-xs font-semibold text-site-muted">
                        No special offers right now.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offers.map((offer) => (
                        <article
                          key={offer.offerId || offer.id || offer.title}
                          className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-extrabold text-site-primary">
                              {offer.title || 'Special offer'}
                            </p>
                            {offer.discount && (
                              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200">
                                {offer.discount}
                              </span>
                            )}
                          </div>
                          {(offer.code || offer.couponCode) && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-site-accent bg-white px-2.5 py-1.5">
                              <Tag size={11} className="text-site-accent" />
                              <code className="text-xs font-black tracking-wider text-site-accent-dark">
                                {offer.code || offer.couponCode}
                              </code>
                            </div>
                          )}
                          <p className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-site-muted">
                            <Calendar size={11} />
                            Valid till {formatDashboardDate(offer.validTill)}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Promotions */}
            {hasPromotions && (
              <section>
                <SectionHead
                  icon={Rocket}
                  title="Updates & launches"
                  iconCls="bg-purple-100 text-purple-700"
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {banners.length > 0 && (
                    <div className={CARD}>
                      <div className="border-b border-site-accent-dark/10 px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-accent">
                          Announcements
                        </p>
                      </div>
                      <div className="space-y-3 p-4">
                        {banners.map((banner) => (
                          <a
                            key={banner.bannerId || banner.id}
                            href={banner.redirectLink || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded-xl border border-site-accent-dark/12 transition hover:shadow-md"
                          >
                            <img
                              src={banner.image || '/images/vedic_thumbnail.png'}
                              alt={banner.title}
                              className="h-28 w-full object-cover"
                            />
                            <div className="p-3">
                              <p className="text-sm font-extrabold text-site-primary">
                                {banner.title || 'Announcement'}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {promoItems.length > 0 && (
                    <div className={CARD}>
                      <div className="border-b border-site-accent-dark/10 px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-accent">
                          Merchandise
                        </p>
                      </div>
                      <div className="space-y-3 p-4">
                        {promoItems.map((item, i) => (
                          <div
                            key={item.productId || item.courseId || item.id || i}
                            className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 transition hover:border-site-accent/30 hover:bg-white"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                {item.price ? <Package size={20} /> : <Rocket size={20} />}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-extrabold text-site-primary">
                                {item.title || item.name || 'Untitled'}
                              </p>
                              <p className="mt-0.5 text-xs font-semibold text-site-muted">
                                {item.price
                                  ? `₹${item.price}`
                                  : `Launch: ${formatDashboardDate(item.launchDate)}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {newCourses.length > 0 && (
                    <div className={`${CARD} sm:col-span-2 xl:col-span-1`}>
                      <div className="border-b border-site-accent-dark/10 px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-accent">
                          New courses
                        </p>
                      </div>
                      <div className="space-y-2.5 p-4">
                        {newCourses.slice(0, 5).map((c, i) => (
                          <Link
                            key={c.courseId || c.id || i}
                            to="/recorded-courses"
                            className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                              <GraduationCap size={17} className="text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-extrabold text-site-primary">
                                {c.title || 'New course'}
                              </p>
                              <p className="text-[10px] font-bold text-site-accent">
                                {c.price ? `₹${c.price}` : 'View details'}
                              </p>
                            </div>
                            <ChevronRight size={14} className="shrink-0 text-site-muted" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
