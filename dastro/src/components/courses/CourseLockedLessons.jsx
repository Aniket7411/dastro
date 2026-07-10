import { Lock, PlayCircle, ShieldCheck } from 'lucide-react';

const SECTION_TITLE =
  'font-heading text-base font-bold leading-snug text-site-primary sm:text-lg';

export default function CourseLockedLessons({
  lessons = [],
  lessonCount = 0,
  showTitles = false,
  onEnroll,
  enrollLabel = 'Enroll to unlock',
}) {
  const count = lessonCount || lessons.length;
  if (!count) return null;

  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className={SECTION_TITLE}>Main course lessons</h2>
          <p className="font-body text-xs text-site-muted sm:text-sm">
            {count} lesson{count === 1 ? '' : 's'} included — unlocked after enrolment and admin approval.
          </p>
        </div>
        {onEnroll ? (
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-site-accent/30 bg-site-accent/8 px-3 py-1.5 font-body text-xs font-bold text-site-primary transition hover:bg-site-accent/15"
          >
            <Lock size={12} aria-hidden />
            {enrollLabel}
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-site-accent-dark/10 bg-gradient-to-br from-site-bg to-white px-4 py-3.5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-site-primary/10 text-site-primary">
            <ShieldCheck size={18} aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-body text-sm font-semibold text-site-primary">
              {count} full lesson video{count === 1 ? '' : 's'} after you enrol
            </p>
            <p className="font-body text-xs leading-relaxed text-site-muted sm:text-sm">
              Lesson videos are not shown on this page. After purchase or enquiry, our team verifies your enrolment
              and unlocks access in your student dashboard.
            </p>
          </div>
        </div>
      </div>

      {showTitles && lessons.length > 0 ? (
        <ul className="flex list-none flex-col gap-2 p-0">
          {lessons.map((lesson, index) => (
            <li
              key={lesson._id || index}
              className="flex items-center gap-3 rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5 sm:px-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-site-bg font-body text-xs font-bold text-site-muted">
                {index + 1}
              </span>
              <p className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-site-primary">
                {lesson.title || `Lesson ${index + 1}`}
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-site-bg px-2 py-1 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-soft">
                <Lock size={10} aria-hidden />
                Locked
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="flex items-start gap-2 font-body text-xs text-site-muted sm:text-sm">
        <PlayCircle size={14} className="mt-0.5 shrink-0 text-site-accent" aria-hidden />
        Watch the free introductory video above to preview the teaching style before you enrol.
      </p>
    </section>
  );
}
