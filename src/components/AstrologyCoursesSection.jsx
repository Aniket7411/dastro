import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  Headphones,
  Radio,
  Users,
  Video,
} from 'lucide-react';
import { fetchCourses } from '../hooks/useCourses';
import { CourseGridSkeleton } from './PageLoader';
import HomeSectionHeader from './home/HomeSectionHeader';
import { COURSE_GRID, COURSE_GRID_ITEM, PAGE_WRAP } from './consultation/tokens';

const FEATURES = [
  { icon: Users, title: 'Learn from Experts', sub: '20+ years of experience' },
  { icon: Video, title: 'Live & Recorded', sub: 'Flexible learning paths' },
  { icon: Award, title: 'Certification', sub: 'Boost your credibility' },
  { icon: Headphones, title: 'Lifetime Support', sub: "We're here for you" },
];

const CARD_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const TITLE_LINK = `${CARD_LINK} !text-site-primary visited:!text-site-primary transition-colors hover:!text-site-accent-dark`;

const BTN_LINK = `${CARD_LINK} !text-white visited:!text-white`;

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
  const price =
    course.price && Number(course.price) > 0
      ? Number(course.price).toLocaleString('en-IN')
      : null;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-site-accent-dark/12 bg-white shadow-[0_4px_16px_rgba(42,15,2,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-site-accent/35 hover:shadow-[0_10px_28px_rgba(139,74,30,0.12)]">
      <Link to={detailPath} className={`${CARD_LINK} relative block aspect-[2/1] overflow-hidden`} tabIndex={-1} aria-hidden>
        <img
          src={course.image}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a0f02]/50 via-transparent to-transparent opacity-80" />

        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
            isLive ? 'bg-site-primary' : 'bg-site-accent-dark'
          }`}
        >
          {isLive ? <Radio size={9} aria-hidden /> : <Video size={9} aria-hidden />}
          {isLive ? 'Live' : 'Recorded'}
        </span>

        {course.level ? (
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-site-primary ring-1 ring-site-accent/25">
            {course.level}
          </span>
        ) : null}

        {course.duration ? (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
            <Clock size={9} aria-hidden />
            {course.duration}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-2.5 py-2.5 sm:px-3 sm:py-3">
        {course.category ? (
          <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-wider text-site-accent-dark">
            {course.category}
          </p>
        ) : null}

        <Link to={detailPath} className={`${TITLE_LINK} mb-1 line-clamp-2 font-heading text-sm font-bold leading-snug sm:text-[0.9375rem]`}>
          {course.title}
        </Link>

        {description ? (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-site-muted">
            {description}
          </p>
        ) : (
          <div className="mb-2 flex-1" />
        )}

        <div className="mt-auto flex flex-col gap-2 border-t border-site-accent-dark/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 leading-none">
            {price ? (
              <p className="font-price text-base font-bold tracking-tight text-site-accent-dark tabular-nums sm:text-lg">
                ₹{price}
              </p>
            ) : (
              <p className="text-xs font-semibold text-site-primary">Enquire for pricing</p>
            )}
          </div>

          <Link
            to={detailPath}
            className={`${BTN_LINK} inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-full bg-site-primary px-3 py-1.5 text-[11px] font-bold shadow-sm transition hover:bg-site-accent-dark group-hover:bg-site-accent-dark sm:w-auto`}
          >
            Explore
            <ArrowRight size={11} strokeWidth={2.5} className="transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AstrologyCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses({ limit: 4 })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="relative m-0 overflow-hidden bg-site-bg py-[clamp(2rem,5vw,3.5rem)] font-body text-site-text [&_a]:decoration-transparent"
      aria-labelledby="astro-courses-heading"
    >
      <div className="pointer-events-none absolute -left-8 top-8 text-[4.5rem] text-site-accent-dark/5" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 text-[5rem] text-site-accent-dark/5" aria-hidden>
        ☽
      </div>

      <div className={PAGE_WRAP}>
        <HomeSectionHeader
          id="astro-courses-heading"
          kicker="Featured Programs"
          title="Astrology"
          titleHighlight="Courses"
          subtitle="Ancient wisdom, modern teaching — live batches and self-paced programs for every level."
          subtitleClassName="lg:whitespace-nowrap"
        />

        {loading ? (
          <CourseGridSkeleton count={4} />
        ) : courses.length > 0 ? (
          <ul className={COURSE_GRID}>
            {courses.map((course) => (
              <li key={course.id} className={COURSE_GRID_ITEM}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-center text-sm text-site-muted">
            New courses are on the way. Browse live and recorded programs below.
          </p>
        )}

        <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <Link
            to="/live-courses"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-site-accent-dark/25 bg-white px-4 py-2 text-sm font-bold !text-site-primary !no-underline shadow-sm transition visited:!text-site-primary hover:border-site-accent hover:bg-[#fffaf4] hover:!text-site-accent-dark"
          >
            <GraduationCap size={16} />
            Live Classes
          </Link>
          <Link
            to="/recorded-courses"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-site-primary px-4 py-2 text-sm font-bold !text-white !no-underline shadow-sm transition visited:!text-white hover:bg-site-accent-dark"
          >
            Browse All Courses
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-site-accent-dark/10 pt-6 sm:gap-4 md:grid-cols-4 md:pt-8">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center gap-1.5 text-center sm:gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-site-accent/10 text-site-accent-dark ring-1 ring-site-accent/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <p className="m-0 text-xs font-bold text-site-primary sm:text-sm">{title}</p>
              <p className="m-0 text-[10px] leading-snug text-site-muted sm:text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
