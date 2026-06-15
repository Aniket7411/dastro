import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  Headphones,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { fetchCourses } from '../hooks/useCourses';
import { CourseGridSkeleton } from './PageLoader';
import { PAGE_WRAP, COURSE_GRID } from './consultation/tokens';

const FEATURES = [
  { icon: Users, title: 'Learn from Experts', sub: '20+ years of experience' },
  { icon: Video, title: 'Live & Recorded', sub: 'Flexible learning paths' },
  { icon: Award, title: 'Certification', sub: 'Boost your credibility' },
  { icon: Headphones, title: 'Lifetime Support', sub: "We're here for you" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

function CourseCard({ course, index }) {
  const isLive = course.courseType === 'Live';
  const detailPath = `/courses/${course.slug || course.id}`;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      className="group m-0 flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-site-accent-dark/10 bg-site-surface shadow-[0_8px_24px_rgba(42,15,2,0.06)] transition-shadow duration-300 hover:border-site-accent/35 hover:shadow-[0_20px_40px_rgba(139,74,30,0.14)] sm:rounded-2xl"
    >
      <Link to={detailPath} className="relative m-0 block aspect-[2/1] shrink-0 overflow-hidden p-0 no-underline sm:h-[11.5rem] sm:aspect-auto">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a0f02]/65 via-transparent to-transparent" />

        <span className={`absolute left-1.5 top-1.5 m-0 rounded-full px-1.5 py-0.5 text-[0.55rem] font-extrabold uppercase tracking-wide text-white shadow-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.65rem] ${
          isLive ? 'bg-gradient-to-r from-[#8B4A1E] to-[#C8832A]' : 'bg-gradient-to-r from-red-600 to-rose-500'
        }`}>
          {isLive ? 'Live' : 'Rec'}
        </span>

        <span className="absolute right-1.5 top-1.5 m-0 hidden rounded-full bg-white/90 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-site-primary ring-1 ring-site-accent/20 sm:right-3 sm:top-3 sm:block sm:px-2.5 sm:py-1">
          {course.level}
        </span>

        <div className="absolute bottom-1.5 left-1.5 hidden flex-wrap gap-1 sm:bottom-3 sm:left-3 sm:flex sm:gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/35 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur-sm">
            <Clock size={11} />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-black/35 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur-sm">
            <BookOpen size={11} />
            {course.schedule}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-4">
        <p className="m-0 mb-0.5 truncate text-[0.55rem] font-bold uppercase tracking-[0.12em] text-site-soft sm:mb-1 sm:text-[0.65rem]">
          {course.category}
        </p>
        <h3 className="m-0 mb-1 line-clamp-2 font-heading text-xs font-bold leading-snug text-site-primary transition group-hover:text-site-accent-dark sm:mb-2 sm:text-[1.15rem]">
          {course.title}
        </h3>
        <p className="m-0 mb-2 line-clamp-2 flex-1 text-[10px] leading-snug text-site-muted sm:mb-4 sm:line-clamp-3 sm:text-sm sm:leading-relaxed">
          {course.shortDesc}
        </p>

        <div className="mb-2 flex items-end justify-between gap-2 border-t border-dashed border-site-accent-dark/15 pt-2 sm:mb-4 sm:pt-3">
          {course.price ? (
            <p className="m-0 font-price text-sm font-bold leading-none tracking-tight text-site-accent-dark tabular-nums sm:text-2xl">
              ₹{Number(course.price).toLocaleString('en-IN')}
            </p>
          ) : (
            <p className="m-0 text-[10px] font-semibold text-site-muted sm:text-sm">Enquire</p>
          )}
        </div>

        <Link
          to={detailPath}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-site-primary px-2 py-1.5 text-[10px] font-bold text-white no-underline transition hover:bg-black active:scale-[0.99] sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <span className="sm:hidden">Explore</span>
          <span className="hidden sm:inline">Explore Course</span>
          <ChevronRight size={14} className="transition group-hover:translate-x-0.5 sm:size-4" />
        </Link>
      </div>
    </motion.article>
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
      className="relative m-0 overflow-hidden bg-site-bg py-[clamp(2.5rem,6vw,4rem)] font-body text-site-text"
      aria-labelledby="astro-courses-heading"
    >
      <div className="pointer-events-none absolute -left-8 top-8 text-[4.5rem] text-site-accent-dark/5" aria-hidden>
        ✦
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 text-[5rem] text-site-accent-dark/5" aria-hidden>
        ☽
      </div>

      <div className={PAGE_WRAP}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-site-accent-dark/15 bg-white/70 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-site-accent-dark">
            <Sparkles size={12} />
            Featured Programs
          </span>
          <h2 id="astro-courses-heading" className="m-0 font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-site-primary">
            Astrology <span className="bg-gradient-to-r from-site-accent-dark to-site-accent bg-clip-text text-transparent">Courses</span>
          </h2>
          <div className="mx-auto my-4 flex w-24 items-center gap-2" aria-hidden>
            <span className="h-px flex-1 bg-site-accent/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-site-accent" />
            <span className="h-px flex-1 bg-site-accent/40" />
          </div>
          <p className="m-0 text-sm leading-relaxed text-site-muted sm:text-base">
            Ancient wisdom, modern teaching — programs managed live from the admin panel.
          </p>
        </motion.div>

        {loading ? (
          <CourseGridSkeleton count={4} />
        ) : courses.length > 0 ? (
          <ul className={COURSE_GRID}>
            {courses.map((course, index) => (
              <li key={course.id} className="min-w-0">
                <CourseCard course={course} index={index} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-center text-sm text-site-muted">
            New courses are on the way. Browse live and recorded programs below.
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/live-courses"
            className="inline-flex items-center gap-2 rounded-full border border-site-accent-dark/20 bg-white px-5 py-2.5 text-sm font-bold text-site-primary no-underline transition hover:border-site-accent hover:bg-[#fffaf4]"
          >
            <GraduationCap size={16} />
            Live Classes
          </Link>
          <Link
            to="/recorded-courses"
            className="inline-flex items-center gap-2 rounded-full bg-site-primary px-5 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-black"
          >
            Browse All Courses
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-site-accent-dark/10 pt-8 md:grid-cols-4 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-site-accent/10 text-site-accent-dark ring-1 ring-site-accent/20">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <p className="m-0 text-sm font-bold text-site-primary">{title}</p>
              <p className="m-0 text-xs text-site-soft">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
