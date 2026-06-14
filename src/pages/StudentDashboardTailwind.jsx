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

const WRAP = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const CARD =
  'rounded-2xl border border-site-accent-dark/12 bg-white shadow-[0_2px_12px_rgba(42,15,2,0.06)]';

const inputCls = [
  'w-full rounded-xl border border-site-accent-dark/20 bg-[#fffcf8] px-4 py-2.5',
  'text-sm font-semibold text-site-primary outline-none transition',
  'focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/20',
].join(' ');

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function validityStyle(val) {
  if (val === 'Expired') return 'bg-red-50 text-red-600 border-red-200';
  const n = parseInt(val, 10);
  if (!Number.isNaN(n) && n <= 30) return 'bg-orange-50 text-orange-600 border-orange-200';
  return 'bg-green-50 text-green-700 border-green-200';
}

function Skel({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-site-accent-dark/15 ${className}`} />;
}

function DashboardLoading() {
  return (
    <div className="tw-surface min-h-screen w-full bg-site-bg">
      <div className="bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark px-4 py-10 sm:px-6 lg:px-8">
        <Skel className="mb-3 h-3 w-24 bg-white/10" />
        <Skel className="mb-2 h-9 w-72 max-w-full bg-white/10" />
        <Skel className="h-4 w-96 max-w-full bg-white/10" />
      </div>
      <div className={WRAP}>
        <div className="py-8">
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${CARD} p-5`}>
                <Skel className="mb-3 h-10 w-10 rounded-xl" />
                <Skel className="mb-2 h-3 w-20" />
                <Skel className="h-7 w-10" />
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

function StatCard({ label, value, icon: Icon, iconBg }) {
  return (
    <div className={`${CARD} p-5 transition hover:shadow-md sm:p-6`}>
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={18} />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-site-muted">{label}</p>
      <p className="mt-1 font-heading text-2xl font-extrabold leading-none text-site-primary sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function ProgressBar({ value, thin = false }) {
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div className={`w-full overflow-hidden rounded-full bg-site-accent-dark/10 ${thin ? 'h-1.5' : 'h-2.5'}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-site-accent-dark to-site-accent transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionHead({ icon: Icon, title, badge }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-site-accent/10">
          <Icon size={15} className="text-site-accent-dark" />
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
          ? 'border border-site-accent/30 bg-site-accent/10 text-site-accent-dark'
          : 'bg-site-bg text-site-muted'
      }`}
    >
      {children}
    </span>
  );
}

function BtnPrimary({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-site-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function BtnOutline({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-site-accent-dark/20 bg-white px-4 py-2 text-sm font-bold text-site-primary transition hover:border-site-accent hover:bg-site-bg active:scale-95 ${className}`}
      {...rest}
    >
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
    savingProfile,
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
    saveProfile,
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
      iconBg: 'bg-site-accent/10 text-site-accent-dark',
    },
    {
      label: 'Active',
      value: activeCourses,
      icon: GraduationCap,
      iconBg: 'bg-green-50 text-green-700',
    },
    {
      label: 'Completed',
      value: completedCourses,
      icon: Sparkles,
      iconBg: 'bg-site-accent/15 text-site-accent',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      iconBg: 'bg-orange-50 text-orange-700',
    },
  ];

  const materialTabs = enrolledCourses.slice(0, 6);
  const promoItems = [...merchandise.slice(0, 3), ...newCourses.slice(0, 3)];
  const hasPromotions = banners.length > 0 || promoItems.length > 0 || newCourses.length > 0;

  return (
    <div className="tw-surface min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO title="Student Dashboard" description="Your courses, materials, and account." url="/dashboard" />

      {/* Hero */}
      <header className="relative w-full overflow-hidden bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className={`relative z-10 flex flex-col gap-4 py-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:py-14 ${WRAP}`}>
          <div className="min-w-0 flex-1">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#f5c98d] backdrop-blur-sm">
              <Sparkles size={11} />
              {greeting}
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-[#f5c98d] to-[#e8a855] bg-clip-text text-transparent">
                {studentName}
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#f5d9b8]/85 sm:text-base">
              {enrolledCourses.length > 0
                ? `Track progress, download materials, and continue learning.`
                : 'Browse recorded courses to start your Vedic astrology journey.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              to="/recorded-courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Plus size={15} />
              Explore Courses
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:bg-white/15 hover:text-white lg:hidden"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className={`py-8 sm:py-10 ${WRAP}`}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      <main className={`pb-14 sm:pb-16 ${WRAP}`}>
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">

          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className={`${CARD} p-5 sm:p-6`}>
              <div className="mb-4 flex items-center gap-3 border-b border-site-accent-dark/10 pb-4 sm:pb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-site-accent-dark to-site-accent text-sm font-black text-white ring-4 ring-site-bg">
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

              <dl className="space-y-3">
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

              <div className="mt-5 flex flex-col gap-2 border-t border-site-accent-dark/10 pt-4">
                <BtnOutline className="w-full" onClick={() => setProfileEditMode((o) => !o)}>
                  <PenLine size={14} />
                  {profileEditMode ? 'Cancel Edit' : 'Edit Profile'}
                </BtnOutline>
                <BtnPrimary className="hidden w-full lg:inline-flex" onClick={handleLogout}>
                  <LogOut size={14} />
                  Logout
                </BtnPrimary>
              </div>
            </div>

            {profileEditMode && (
              <div className={`${CARD} p-5 sm:p-6`}>
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
                  <div className="flex gap-2 pt-1">
                    <BtnPrimary type="submit" disabled={savingProfile} className="flex-1">
                      {savingProfile ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      {savingProfile ? 'Saving…' : 'Save'}
                    </BtnPrimary>
                    <BtnOutline type="button" onClick={() => setProfileEditMode(false)}>
                      <X size={14} />
                    </BtnOutline>
                  </div>
                </form>
              </div>
            )}

            {enrolledCourses.length > 0 && (
              <div className={`${CARD} p-5 sm:p-6`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-heading text-sm font-extrabold text-site-primary">
                    Overall progress
                  </h3>
                  <span className="font-heading text-2xl font-extrabold text-site-accent">
                    {avgProgress}%
                  </span>
                </div>
                <ProgressBar value={avgProgress} />
                <p className="mt-3 text-xs text-site-muted">
                  {completedCourses} of {enrolledCourses.length} course
                  {enrolledCourses.length !== 1 ? 's' : ''} completed
                </p>
              </div>
            )}
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-col gap-8">
            {/* Courses */}
            <section>
              <SectionHead
                icon={BookOpen}
                title="My courses"
                badge={<Pill>{enrolledCourses.length} enrolled</Pill>}
              />
              <div className={CARD}>
                {enrolledCourses.length === 0 ? (
                  <div className="flex flex-col items-center px-6 py-16 sm:py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-site-accent/10">
                      <FolderOpen size={30} className="text-site-accent-dark" />
                    </div>
                    <p className="font-heading text-base font-extrabold text-site-primary">
                      No enrolled courses yet
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-site-muted">
                      Purchase a recorded course to unlock lessons and materials.
                    </p>
                    <Link
                      to="/recorded-courses"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-site-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                    >
                      Browse courses
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-site-accent-dark/10">
                    {enrolledCourses.map((course) => {
                      const validity =
                        courseValidity[course.id]?.daysRemaining ??
                        computeDaysRemaining(course.validTill);
                      return (
                        <article
                          key={course.id}
                          className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-6"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-24 sm:w-36"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-site-accent">
                              {course.courseType}
                            </span>
                            <h3 className="mt-0.5 line-clamp-2 font-heading text-base font-extrabold leading-snug text-site-primary">
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
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <ProgressBar value={course.progress} thin />
                              <span className="shrink-0 text-xs font-bold text-site-accent-dark">
                                {course.progress}%
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/student/course/${course.id}`}
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-site-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black sm:self-center"
                          >
                            Continue
                            <ChevronRight size={14} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Materials + Offers */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="flex flex-col">
                <SectionHead icon={FolderOpen} title="Course materials" />
                <div className={`flex flex-1 flex-col ${CARD} overflow-hidden`}>
                  <div className="overflow-x-auto border-b border-site-accent-dark/10">
                    <div className="flex gap-2 p-3">
                      {materialTabs.length === 0 ? (
                        <Pill>No courses</Pill>
                      ) : (
                        materialTabs.map((course) => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => loadMaterials(course.id)}
                            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              selectedCourseForMaterials === course.id
                                ? 'bg-site-primary text-white shadow-sm'
                                : 'bg-site-bg text-site-muted hover:bg-site-accent-dark/10'
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
                          return (
                            <div
                              key={item.materialId || item.id || item.title}
                              className="flex items-center gap-3 rounded-xl border border-site-accent-dark/12 bg-site-bg p-3 transition hover:border-site-accent/40"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-site-accent/10">
                                <FIcon size={15} className="text-site-accent-dark" />
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
                                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-site-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-black"
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
                            <FileText size={28} className="mb-2 text-site-accent/30" />
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
                  badge={offers.length > 0 ? <Pill>{offers.length}</Pill> : null}
                />
                <div className={`flex flex-1 flex-col ${CARD} p-4 sm:p-5`}>
                  {offers.length === 0 ? (
                    <div className="flex min-h-36 flex-col items-center justify-center text-center">
                      <Tag size={28} className="mb-2 text-site-accent/30" />
                      <p className="text-xs font-semibold text-site-muted">
                        No special offers right now.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offers.map((offer) => (
                        <article
                          key={offer.offerId || offer.id || offer.title}
                          className="rounded-xl border border-site-accent-dark/12 bg-site-bg p-4 transition hover:border-site-accent/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-extrabold text-site-primary">
                              {offer.title || 'Special offer'}
                            </p>
                            {offer.discount && (
                              <span className="shrink-0 rounded-full bg-site-accent/10 px-2 py-0.5 text-[10px] font-black text-site-accent-dark ring-1 ring-site-accent/25">
                                {offer.discount}
                              </span>
                            )}
                          </div>
                          {(offer.code || offer.couponCode) && (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-site-accent bg-white px-2.5 py-1.5">
                              <Tag size={11} className="text-site-accent" />
                              <code className="text-xs font-black tracking-wider text-site-accent-dark">
                                {offer.code || offer.couponCode}
                              </code>
                            </div>
                          )}
                          <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-site-muted">
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

            {/* Promotions — only when there is content */}
            {hasPromotions && (
              <section>
                <SectionHead icon={Rocket} title="Updates & launches" />
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
                            className="flex items-center gap-3 rounded-xl border border-site-accent-dark/12 bg-site-bg p-3"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-site-accent-dark/10 text-site-accent-dark">
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
                      <div className="space-y-3 p-4">
                        {newCourses.slice(0, 5).map((c, i) => (
                          <Link
                            key={c.courseId || c.id || i}
                            to="/recorded-courses"
                            className="flex items-center gap-3 rounded-xl border border-site-accent-dark/12 bg-site-bg p-3 transition hover:border-site-accent/40"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                              <GraduationCap size={17} className="text-green-700" />
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
