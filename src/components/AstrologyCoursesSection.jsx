import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Headphones,
  PlayCircle,
  Radio,
  Users,
  Video,
} from 'lucide-react';
import { fetchCourses } from '../hooks/useCourses';
import { getPriceDisplay } from '../utils/pricing';
import { CourseGridSkeleton } from './PageLoader';
import CourseCardDurationBar from './courses/CourseCardDurationBar';
import CourseLiveBadge from './courses/CourseLiveBadge';
import { COURSE_GRID, COURSE_GRID_ITEM, PAGE_WRAP } from './consultation/tokens';
import {
  SITE_BTN_CARD,
  SITE_BTN_COPPER_COMPACT,
  SITE_BTN_TONAL_COMPACT,
  SITE_COURSE_CARD,
  SITE_COURSE_CARD_BADGE,
  SITE_COURSE_CARD_BADGE_META,
  SITE_COURSE_CARD_BADGE_RECORDED,
  SITE_COURSE_CARD_BODY,
  SITE_COURSE_CARD_DESC,
  SITE_COURSE_CARD_FOOTER,
  SITE_COURSE_CARD_KICKER,
  SITE_COURSE_CARD_TITLE,
  TW_BODY,
  TW_H2,
  TW_KICKER,
} from '../utils/siteTokens';

const COURSES_HERO_IMG = '/images/courses_hero_new.jpg';
const COURSES_HERO_ACCENT = '/images/vedic_thumbnail_new.jpg';

const FEATURES = [
  { icon: Users, title: 'Learn from Experts', sub: '20+ years of experience' },
  { icon: Video, title: 'Live & Recorded', sub: 'Flexible learning paths' },
  { icon: Award, title: 'Certification', sub: 'Boost your credibility' },
  { icon: Headphones, title: 'Lifetime Support', sub: "We're here for you" },
];

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const HOME_COURSE_LIMIT = 4;

/** Collapse obvious duplicate placeholder descriptions from the API */
function cleanShortDesc(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/);
  if (words.length >= 4) {
    const half = Math.floor(words.length / 2);
    const first = words.slice(0, half).join(' ');
    const second = words.slice(half).join(' ');
    if (first === second) return first;
  }

  const sentence = trimmed.split(/(?<=[.!?])\s+/)[0];
  if (sentence && sentence.length < trimmed.length * 0.85) return sentence;

  return trimmed.length > 110 ? `${trimmed.slice(0, 107).trim()}…` : trimmed;
}

function CourseCard({ course }) {
  const isLive = course.courseType === 'Live';
  const detailPath = `/courses/${course.slug || course.id}`;
  const description = cleanShortDesc(course.shortDesc);
  const hasPrice = Number(course.price) > 0;
  const { hasDiscount, priceLabel, mrpLabel } = getPriceDisplay({
    price: course.price,
    mrp: course.mrp,
  });

  return (
    <article className={`${SITE_COURSE_CARD} h-full w-full min-w-0`}>
      <Link
        to={detailPath}
        className={`${CARD_LINK} relative block aspect-video overflow-hidden bg-site-sand`}
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={course.image}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />

        {isLive ? (
          <CourseLiveBadge />
        ) : course.level ? (
          <span className={`${SITE_COURSE_CARD_BADGE} ${SITE_COURSE_CARD_BADGE_META}`}>
            {course.level}
          </span>
        ) : null}

        {!isLive ? (
          <span className={`${SITE_COURSE_CARD_BADGE} ${SITE_COURSE_CARD_BADGE_RECORDED} right-1.5 top-1.5 sm:right-2 sm:top-2`}>
            Recorded
          </span>
        ) : course.level ? (
          <span
            className={`${SITE_COURSE_CARD_BADGE} ${SITE_COURSE_CARD_BADGE_META} left-auto right-1.5 top-1.5 sm:right-2 sm:top-2`}
          >
            {course.level}
          </span>
        ) : null}
      </Link>

      <CourseCardDurationBar course={course} variant="strip" />

      <div className={SITE_COURSE_CARD_BODY}>
        {course.category ? <p className={SITE_COURSE_CARD_KICKER}>{course.category}</p> : null}

        <Link to={detailPath} className={`${SITE_COURSE_CARD_TITLE} mb-2 line-clamp-2`}>
          {course.title}
        </Link>

        {description ? <p className={SITE_COURSE_CARD_DESC}>{description}</p> : null}

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
                <p className="mt-0.5 hidden font-body text-[10px] font-medium text-site-muted min-[480px]:block">
                  {isLive ? 'batch pricing' : 'lifetime access'}
                </p>
              </div>
            ) : (
              <p className="font-body text-[11px] font-medium text-site-muted min-[480px]:text-sm sm:text-[15px]">
                Enquire for pricing
              </p>
            )}
          </div>

          <Link to={detailPath} className={`${SITE_BTN_CARD} !text-white visited:!text-white`}>
            {isLive ? 'Enquire' : 'Explore'}
            <ArrowRight size={11} strokeWidth={2.5} className="shrink-0 min-[480px]:size-3" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CoursesSectionIntro() {
  return (
    <div
      className="mb-8 grid items-center gap-6 sm:mb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10"
      data-aos="fade-up"
    >
      <header className="text-left">
        <p className={`${TW_KICKER} mb-2`}>Featured Programs</p>
        <h2 id="astro-courses-heading" className={`${TW_H2} leading-[1.08]`}>
          Astrology <span className="text-site-accent">Courses</span>
        </h2>
        <div
          className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-site-accent via-site-accent-dark to-site-accent"
          aria-hidden
        />
        <p className={`${TW_BODY} mt-4 max-w-xl text-site-muted`}>
          Ancient wisdom, modern teaching — live batches and self-paced programs for every level.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link to="/live-courses" className={`${SITE_BTN_TONAL_COMPACT} !no-underline`}>
            <Radio size={14} aria-hidden />
            Live batches
          </Link>
          <Link to="/recorded-courses" className={`${SITE_BTN_COPPER_COMPACT} !no-underline`}>
            Recorded programs
            <ChevronRight size={14} aria-hidden />
          </Link>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="overflow-hidden rounded-2xl border border-site-border bg-site-surface shadow-[0_14px_40px_rgba(51,37,26,0.10)]">
          <img
            src={COURSES_HERO_IMG}
            alt="Astrology mentor guiding students"
            className="aspect-[3/2] w-full object-cover object-[center_20%] sm:aspect-[16/10]"
            loading="lazy"
          />
        </div>
        <div className="absolute -bottom-3 left-3 overflow-hidden rounded-xl border border-site-border bg-site-surface shadow-md sm:-bottom-4 sm:left-4">
          <img
            src={COURSES_HERO_ACCENT}
            alt=""
            className="h-16 w-24 object-cover sm:h-[4.5rem] sm:w-28"
            loading="lazy"
            aria-hidden
          />
        </div>
        <div className="absolute -right-1 top-3 rounded-xl border border-site-border bg-site-surface/95 px-3 py-2 shadow-md backdrop-blur-sm sm:right-0 sm:top-4 sm:px-4 sm:py-2.5">
          <p className="m-0 font-heading text-base font-bold leading-none text-site-text sm:text-lg">
            15,000+
          </p>
          <p className="m-0 mt-1 text-[11px] font-medium text-site-muted sm:text-xs">students trained</p>
        </div>
      </div>
    </div>
  );
}

function CourseRowHeader({ icon: Icon, title, titleHighlight, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3 border-b border-site-border pb-4 sm:mb-5 sm:gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-site-sand text-site-accent-dark ring-1 ring-site-border sm:h-11 sm:w-11">
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0 pt-0.5">
        <h3 className="m-0 font-heading text-lg font-bold leading-snug text-site-text sm:text-xl">
          {title}{' '}
          <span className="text-site-accent">{titleHighlight}</span>
        </h3>
        <p className={`${TW_BODY} m-0 mt-1.5 max-w-2xl text-sm text-site-muted sm:text-[15px]`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function CourseBlock({
  icon,
  title,
  titleHighlight,
  subtitle,
  courses,
  loading,
  emptyText,
  ctaTo,
  ctaLabel,
  ctaVariant = 'tonal',
}) {
  const CtaIcon = ctaVariant === 'copper' ? ChevronRight : GraduationCap;
  const ctaClass = ctaVariant === 'copper' ? SITE_BTN_COPPER_COMPACT : SITE_BTN_TONAL_COMPACT;

  return (
    <div className="mt-10 first:mt-0 sm:mt-12 first:sm:mt-0">
      <CourseRowHeader
        icon={icon}
        title={title}
        titleHighlight={titleHighlight}
        subtitle={subtitle}
      />

      {loading ? (
        <CourseGridSkeleton count={HOME_COURSE_LIMIT} />
      ) : courses.length > 0 ? (
        <ul className={COURSE_GRID}>
          {courses.map((course) => (
            <li key={course.id} className={COURSE_GRID_ITEM}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-center text-sm text-site-muted">{emptyText}</p>
      )}

      <div className="mt-4 flex justify-center sm:mt-5">
        <Link to={ctaTo} className={`${ctaClass} !no-underline`}>
          {ctaVariant === 'tonal' ? <CtaIcon size={14} aria-hidden /> : null}
          {ctaLabel}
          {ctaVariant === 'copper' ? <CtaIcon size={14} aria-hidden /> : null}
        </Link>
      </div>
    </div>
  );
}

export default function AstrologyCoursesSection() {
  const [liveCourses, setLiveCourses] = useState([]);
  const [recordedCourses, setRecordedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Fetch a buffer beyond the display limit — home page only shows priced courses,
    // so we need extra candidates to still fill up to HOME_COURSE_LIMIT after filtering.
    const fetchLimit = HOME_COURSE_LIMIT * 3;

    Promise.all([
      fetchCourses({ courseType: 'Live', limit: fetchLimit }),
      fetchCourses({ courseType: 'Recorded', limit: fetchLimit }),
    ])
      .then(([live, recorded]) => {
        if (cancelled) return;
        const hasPrice = (course) => Number(course.price) > 0;
        setLiveCourses(live.filter(hasPrice).slice(0, HOME_COURSE_LIMIT));
        setRecordedCourses(recorded.filter(hasPrice).slice(0, HOME_COURSE_LIMIT));
      })
      .catch(() => {
        if (cancelled) return;
        setLiveCourses([]);
        setRecordedCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="relative m-0 overflow-hidden bg-site-bg py-[clamp(2.5rem,5vw,3.5rem)] font-body text-site-text [&_a]:decoration-transparent"
      aria-labelledby="astro-courses-heading"
    >
      <div className="pointer-events-none absolute -left-8 top-8 text-[4.5rem] text-site-accent-dark/5" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 text-[5rem] text-site-accent-dark/5" aria-hidden>
        ☽
      </div>

      <div className={PAGE_WRAP}>
        <CoursesSectionIntro />

        <CourseBlock
          icon={Radio}
          title="Live"
          titleHighlight="Courses"
          subtitle="Instructor-led batches with mentor support — enquire for schedule and fees."
          courses={liveCourses}
          loading={loading}
          emptyText="New live batches are coming soon. Check back or enquire with our team."
          ctaTo="/live-courses"
          ctaLabel="View All Live Classes"
          ctaVariant="tonal"
        />

        <CourseBlock
          icon={PlayCircle}
          title="Recorded"
          titleHighlight="Courses"
          subtitle="Self-paced programs with structured modules and lifetime dashboard access."
          courses={recordedCourses}
          loading={loading}
          emptyText="New recorded courses are on the way. Browse again soon."
          ctaTo="/recorded-courses"
          ctaLabel="Browse All Recorded Courses"
          ctaVariant="copper"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-site-border pt-6 sm:gap-4 md:grid-cols-4 md:pt-8">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center gap-1.5 text-center sm:gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-site-sand text-site-accent-dark ring-1 ring-site-border sm:h-12 sm:w-12 sm:rounded-2xl">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <p className="m-0 font-heading text-sm font-semibold text-site-text">{title}</p>
              <p className="m-0 text-[15px] leading-snug text-site-muted">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
