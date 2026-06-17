import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Radio, User, Video } from 'lucide-react';
import { formatINR } from '../utils/currency';

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const TITLE_LINK = `${CARD_LINK} !text-site-primary visited:!text-site-primary transition-colors duration-200 group-hover:!text-site-accent-dark hover:!underline hover:underline-offset-2`;

const CTA_LINK = `${CARD_LINK} !text-white visited:!text-white`;

function formatPrice(price) {
  if (price == null || price === '') return null;
  const amount = Number(price);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return formatINR(amount).replace(/^₹/, '');
}

function MetaChip({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex max-w-full items-center gap-0.5 truncate rounded-md bg-site-bg px-1 py-0.5 text-[9px] font-medium text-site-muted sm:gap-1 sm:px-1.5 sm:text-[10px]">
      <Icon size={8} className="shrink-0 text-site-accent sm:size-[9px]" aria-hidden />
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
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-site-accent/35 hover:shadow-[0_8px_22px_rgba(139,74,30,0.12)]">
      <Link
        to={detailPath}
        className={`${CARD_LINK} relative block aspect-[2/1] overflow-hidden`}
        tabIndex={-1}
        aria-hidden
      >
        {!imgError && course.image ? (
          <img
            src={course.image}
            alt=""
            className="block h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
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

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-site-primary/35 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden
        />

        <span
          className={`absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:left-2 sm:top-2 sm:gap-1 sm:px-2 sm:text-[10px] ${
            isLive ? 'bg-site-primary' : 'bg-site-accent-dark'
          }`}
        >
          {isLive ? <Radio size={8} aria-hidden className="sm:size-[9px]" /> : <Video size={8} aria-hidden className="sm:size-[9px]" />}
          <span className="sm:hidden">{isLive ? 'Live' : 'Rec'}</span>
          <span className="hidden sm:inline">{isLive ? 'Live' : 'Recorded'}</span>
        </span>

        {course.duration ? (
          <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm sm:bottom-2 sm:right-2 sm:px-1.5 sm:text-[10px]">
            <Clock size={8} aria-hidden className="sm:size-[9px]" />
            {course.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-2.5 py-2.5 sm:px-3 sm:py-3">
        {course.category ? (
          <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-wider text-site-accent-dark sm:text-[10px]">
            {course.category}
          </p>
        ) : null}

        <Link to={detailPath} className={`${TITLE_LINK} mb-1 line-clamp-2 font-body text-xs font-bold leading-snug sm:text-sm`}>
          {course.title}
        </Link>

        {course.shortDesc ? (
          <p className="mb-2 line-clamp-2 flex-1 text-[10px] leading-snug text-site-muted sm:text-xs sm:leading-relaxed">
            {course.shortDesc}
          </p>
        ) : (
          <div className="mb-2 flex-1" />
        )}

        {(course.instructor || (!isLive && course.modulesCount > 0) || (isLive && course.schedule)) && (
          <div className="mb-2 hidden flex-wrap gap-1 sm:flex">
            {course.instructor ? <MetaChip icon={User}>{course.instructor}</MetaChip> : null}
            {!isLive && course.modulesCount > 0 ? (
              <MetaChip icon={BookOpen}>{course.modulesCount} modules</MetaChip>
            ) : null}
            {isLive && course.schedule ? <MetaChip icon={Clock}>{course.schedule}</MetaChip> : null}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 border-t border-site-accent-dark/10 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
          <div className="min-w-0">
            {priceLabel ? (
              <div className="leading-none">
                {isLive ? (
                  <p className="mb-0.5 hidden font-body text-[10px] font-medium tracking-wide text-site-soft sm:block">
                    From
                  </p>
                ) : null}
                <p className="font-price text-sm font-bold leading-none tracking-tight text-site-primary tabular-nums transition-colors group-hover:text-site-accent-dark sm:text-[1.0625rem]">
                  ₹{priceLabel}
                </p>
              </div>
            ) : (
              <p className="font-body text-[10px] font-semibold text-site-primary sm:text-xs">
                {isLive ? 'Enquire for fees' : 'Free preview'}
              </p>
            )}
          </div>

          <Link
            to={detailPath}
            className={`${CTA_LINK} inline-flex w-full shrink-0 items-center justify-center gap-0.5 rounded-full bg-site-primary px-2.5 py-1.5 text-[10px] font-bold shadow-sm transition duration-200 hover:bg-site-accent-dark group-hover:bg-site-accent-dark group-hover:shadow-md sm:w-auto sm:gap-1 sm:px-3 sm:py-2 sm:text-[11px]`}
          >
            <span className="sm:hidden">{isLive ? 'Enquire' : 'View'}</span>
            <span className="hidden sm:inline">{ctaLabel}</span>
            <ArrowRight
              size={10}
              strokeWidth={2.5}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 sm:size-[11px]"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
