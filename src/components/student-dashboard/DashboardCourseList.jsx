import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, FolderOpen } from 'lucide-react';
import {
  computeDaysRemaining,
  formatDashboardDate,
} from '../../hooks/useStudentDashboard';
import { BTN, CARD, TYPE } from './tokens';
import { Pill, ProgressBar, SectionHead } from './ui';

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

export default function DashboardCourseList({ enrolledCourses, courseValidity }) {
  return (
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
            <p className={TYPE.cardTitle}>No enrolled courses yet</p>
            <p className={`mt-2 max-w-xs ${TYPE.bodySm}`}>
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
                  ? (validityData.daysRemaining === 0
                    ? 'Expired'
                    : `${validityData.daysRemaining} day${validityData.daysRemaining === 1 ? '' : 's'}`)
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
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide ${
                        course.courseType === 'Live'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {course.courseType}
                    </span>
                    <h3 className={`mt-1.5 line-clamp-2 ${TYPE.cardTitle}`}>
                      {course.title}
                    </h3>
                    <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 ${TYPE.meta}`}>
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
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            course.accessStatus === 'disabled'
                              ? 'border-slate-200 bg-slate-100 text-slate-700'
                              : 'border-amber-200 bg-amber-50 text-amber-800'
                          }`}
                        >
                          {course.accessStatus === 'disabled' ? 'Access disabled' : 'Awaiting approval'}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={course.progress} thin />
                      <span className="shrink-0 font-price text-xs font-bold text-site-accent-dark">
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
  );
}
