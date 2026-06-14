import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Radio, User, Video } from 'lucide-react';
import { TYPE } from './consultation/tokens';

function formatPrice(price) {
  if (price == null || price === '') return null;
  const amount = Number(price);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return amount.toLocaleString('en-IN');
}

function MetaChip({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-site-bg px-1.5 py-0.5 text-[10px] font-medium text-site-muted">
      <Icon size={9} className="shrink-0 text-site-accent" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function CourseListingCard({ course }) {
  const [imgError, setImgError] = useState(false);
  const isLive = course.courseType === 'Live';
  const detailPath = `/courses/${course.slug || course.id}`;
  const priceLabel = formatPrice(course.price);
  const ctaLabel = isLive ? 'Enquire' : 'Request callback';

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm transition hover:border-site-accent/30 hover:shadow-md">
      <Link
        to={detailPath}
        className="relative block aspect-[2/1] overflow-hidden no-underline"
        tabIndex={-1}
        aria-hidden
      >
        {!imgError && course.image ? (
          <img
            src={course.image}
            alt=""
            className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-site-primary to-site-accent-dark/85">
            <BookOpen size={28} className="text-white/25" aria-hidden />
            {course.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                {course.category}
              </span>
            )}
          </div>
        )}

        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
            isLive ? 'bg-site-primary' : 'bg-site-accent-dark'
          }`}
        >
          {isLive ? <Radio size={9} aria-hidden /> : <Video size={9} aria-hidden />}
          {isLive ? 'Live' : 'Recorded'}
        </span>

        {course.duration ? (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <Clock size={9} aria-hidden />
            {course.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        {course.category ? (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-site-accent-dark">
            {course.category}
          </p>
        ) : null}

        <Link
          to={detailPath}
          className="mb-1 line-clamp-2 font-body text-sm font-bold leading-snug text-site-primary no-underline transition group-hover:text-site-accent-dark"
        >
          {course.title}
        </Link>

        {course.shortDesc ? (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-site-muted">
            {course.shortDesc}
          </p>
        ) : (
          <div className="mb-2 flex-1" />
        )}

        {(course.instructor || (!isLive && course.modulesCount > 0) || (isLive && course.schedule)) && (
          <div className="mb-2.5 flex flex-wrap gap-1">
            {course.instructor ? <MetaChip icon={User}>{course.instructor}</MetaChip> : null}
            {!isLive && course.modulesCount > 0 ? (
              <MetaChip icon={BookOpen}>{course.modulesCount} modules</MetaChip>
            ) : null}
            {isLive && course.schedule ? <MetaChip icon={Clock}>{course.schedule}</MetaChip> : null}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-site-accent-dark/10 pt-2.5">
          <div className="min-w-0">
            {priceLabel ? (
              <div className="leading-none">
                {isLive ? (
                  <p className="mb-0.5 font-body text-[10px] font-medium tracking-wide text-site-soft">
                    From
                  </p>
                ) : null}
                <p className={`${TYPE.priceCard}`}>
                  ₹{priceLabel}
                </p>
              </div>
            ) : (
              <p className="font-body text-xs font-semibold text-site-primary">
                {isLive ? 'Enquire for fees' : 'Free preview'}
              </p>
            )}
          </div>

          <Link
            to={detailPath}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-site-primary px-3 py-1.5 text-[11px] font-bold text-white no-underline transition hover:bg-site-accent-dark"
          >
            {ctaLabel}
            <ArrowRight size={11} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
