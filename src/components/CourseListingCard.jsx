import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, User, Video } from 'lucide-react';
import CourseCardDurationBar from './courses/CourseCardDurationBar';
import CourseLiveBadge from './courses/CourseLiveBadge';
import { getPriceDisplay } from '../utils/pricing';
import {
  SITE_BTN_CARD,
  SITE_COURSE_CARD,
  SITE_COURSE_CARD_BADGE,
  SITE_COURSE_CARD_BADGE_META,
  SITE_COURSE_CARD_BADGE_RECORDED,
  SITE_COURSE_CARD_BODY,
  SITE_COURSE_CARD_DESC,
  SITE_COURSE_CARD_FOOTER,
  SITE_COURSE_CARD_KICKER,
  SITE_COURSE_CARD_TITLE,
} from '../utils/siteTokens';

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

function MetaChip({ icon: Icon, children }) {
  if (!children) return null;
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-site-bg px-1.5 py-0.5 text-[10px] font-medium text-site-muted sm:text-xs">
      <Icon size={10} className="shrink-0 text-site-accent-dark" aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function CourseListingCard({ course }) {
  const [imgError, setImgError] = useState(false);
  const isLive = course.courseType === 'Live';
  const detailPath = `/courses/${course.slug || course.id}`;
  const { hasDiscount, priceLabel, mrpLabel } = getPriceDisplay({
    price: course.price,
    mrp: course.mrp,
  });
  const hasPrice = Number(course.price) > 0;
  const ctaLabel = isLive ? 'Enquire' : 'Explore';

  return (
    <article className={`${SITE_COURSE_CARD} h-full w-full min-w-0`}>
      <Link
        to={detailPath}
        className={`${CARD_LINK} relative block h-[100px] overflow-hidden min-[480px]:h-[130px] sm:h-[150px]`}
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
            <BookOpen size={24} className="text-white/25 sm:size-7" aria-hidden />
            {course.category && (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35 sm:text-[10px]">
                {course.category}
              </span>
            )}
          </div>
        )}

        {isLive ? (
          <CourseLiveBadge />
        ) : (
          <span
            className={`${SITE_COURSE_CARD_BADGE} ${SITE_COURSE_CARD_BADGE_RECORDED} left-1.5 top-1.5 right-auto sm:left-2 sm:top-2`}
          >
            <Video size={9} aria-hidden className="mr-0.5 inline shrink-0 sm:size-2.5" />
            <span className="hidden min-[400px]:inline">Rec</span>
            <span className="min-[400px]:hidden">R</span>
          </span>
        )}

        {course.tier ? (
          <span
            className={`${SITE_COURSE_CARD_BADGE} ${SITE_COURSE_CARD_BADGE_META} left-auto right-1.5 max-w-[4.5rem] truncate sm:right-2 sm:max-w-[5rem]`}
          >
            {course.tier}
          </span>
        ) : null}

        <CourseCardDurationBar course={course} />
      </Link>

      <div className={SITE_COURSE_CARD_BODY}>
        {course.category ? <p className={SITE_COURSE_CARD_KICKER}>{course.category}</p> : null}

        <Link to={detailPath} className={`${SITE_COURSE_CARD_TITLE} mb-1.5 line-clamp-2 min-[480px]:mb-2`}>
          {course.title}
        </Link>

        {course.shortDesc ? <p className={SITE_COURSE_CARD_DESC}>{course.shortDesc}</p> : null}

        {(course.instructor || (!isLive && course.modulesCount > 0) || (isLive && course.schedule)) && (
          <div className="mb-2 hidden flex-wrap gap-1 sm:flex">
            {course.instructor ? <MetaChip icon={User}>{course.instructor}</MetaChip> : null}
            {!isLive && course.modulesCount > 0 ? (
              <MetaChip icon={BookOpen}>{course.modulesCount} modules</MetaChip>
            ) : null}
            {isLive && course.schedule ? <MetaChip icon={Clock}>{course.schedule}</MetaChip> : null}
          </div>
        )}

        <div className={SITE_COURSE_CARD_FOOTER}>
          <div className="min-w-0">
            {hasPrice ? (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <p className="font-price text-sm font-semibold leading-none tracking-tight text-site-text tabular-nums min-[480px]:text-base sm:text-[1.3125rem]">
                    <span className="text-[0.85em] font-medium text-site-muted">₹</span>
                    {priceLabel}
                  </p>
                  {hasDiscount ? (
                    <span className="font-body text-[10px] text-site-soft line-through decoration-site-soft/60 min-[480px]:text-xs">
                      ₹{mrpLabel}
                    </span>
                  ) : null}
                </div>
                {!isLive ? (
                  <p className="mt-0.5 hidden font-body text-[10px] font-medium text-site-muted min-[480px]:block">
                    lifetime access
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="font-body text-[11px] font-medium text-site-muted min-[480px]:text-sm sm:text-[15px]">
                {isLive ? 'Enquire' : 'Preview'}
              </p>
            )}
          </div>

          <Link to={detailPath} className={`${SITE_BTN_CARD} !text-white visited:!text-white`}>
            <span className="truncate">{ctaLabel}</span>
            <ArrowRight size={12} strokeWidth={2.5} className="shrink-0 sm:size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
