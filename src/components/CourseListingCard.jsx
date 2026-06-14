import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, User } from 'lucide-react';

export default function CourseListingCard({ course }) {
  const isLive = course.courseType === 'Live';
  const detailPath = `/courses/${course.slug || course.id}`;

  return (
    <article className="group m-0 flex h-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_2px_12px_rgba(74,44,42,0.06)] transition duration-200 hover:border-site-accent/30 hover:shadow-[0_6px_20px_rgba(74,44,42,0.1)]">
      <Link to={detailPath} className="relative block aspect-[16/10] overflow-hidden no-underline" tabIndex={-1} aria-hidden>
        <img
          src={course.image}
          alt=""
          className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span
          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white shadow-sm ${
            isLive ? 'bg-site-primary' : 'bg-rose-600'
          }`}
        >
          {isLive ? 'Live' : 'Recorded'}
        </span>
        {course.level ? (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-white/95 px-2 py-0.5 text-[0.625rem] font-bold uppercase text-site-primary shadow-sm">
            {course.level}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        {course.category ? (
          <p className="!m-0 font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">{course.category}</p>
        ) : null}
        <Link
          to={detailPath}
          className="!m-0 block truncate font-heading text-base font-bold leading-snug text-site-primary no-underline transition group-hover:text-site-accent-dark"
        >
          {course.title}
        </Link>
        <p className="!m-0 line-clamp-2 flex-1 font-body text-xs leading-relaxed text-site-muted sm:text-sm">{course.shortDesc}</p>

        <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 font-body text-[0.6875rem] font-semibold text-site-accent-dark">
          {course.duration ? (
            <li className="inline-flex items-center gap-1">
              <Clock size={11} aria-hidden />
              {course.duration}
            </li>
          ) : null}
          {course.instructor ? (
            <li className="inline-flex max-w-full items-center gap-1 truncate">
              <User size={11} className="shrink-0" aria-hidden />
              <span className="truncate">{course.instructor}</span>
            </li>
          ) : null}
          {!isLive && course.modulesCount > 0 ? (
            <li className="inline-flex items-center gap-1">
              <BookOpen size={11} aria-hidden />
              {course.modulesCount} modules
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-site-accent-dark/8 pt-3">
          {course.price != null && course.price !== '' ? (
            <p className="!m-0 font-heading text-sm font-bold text-site-accent-dark sm:text-base">
              ₹{Number(course.price).toLocaleString('en-IN')}
            </p>
          ) : (
            <p className="!m-0 font-body text-xs font-semibold text-site-muted">Enquire for price</p>
          )}
          <Link
            to={detailPath}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-site-primary px-3 py-1.5 font-body text-[0.6875rem] font-bold text-white no-underline transition hover:bg-site-accent-dark sm:text-xs"
          >
            View
            <ArrowRight size={12} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
