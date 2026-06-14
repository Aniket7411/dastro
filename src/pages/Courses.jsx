import { useState, useEffect, useMemo } from 'react';
import { Search, SearchX } from 'lucide-react';
import SEO from '../components/SEO';
import CourseListingCard from '../components/CourseListingCard';
import { CourseGridSkeleton } from '../components/PageLoader';
import { useCourses, useCourseCategories } from '../hooks/useCourses';
import toast from '@/utils/toast';

const PAGE_WRAP = 'mx-auto w-full max-w-[var(--container-public)] px-[var(--page-pad-x)]';

const SCROLL_HIDE = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const PAGE_META = {
  live: {
    title: 'Live Astrology Courses',
    description: 'Instructor-led live batches — browse programs, submit an enquiry, and get batch timing and pricing from our team.',
    url: '/live-courses',
    heading: 'Live classes',
    subtitle: 'Interactive batches with expert mentors. Enquire to confirm schedule and fees.',
    typeLabel: 'live class',
    heroImg: '/live.jpg',
  },
  recorded: {
    title: 'Recorded Astrology Courses',
    description: 'Self-paced recorded programs — purchase online, unlock student access, and learn from your dashboard.',
    url: '/recorded-courses',
    heading: 'Recorded courses',
    subtitle: 'Learn at your own pace with structured modules and lifetime dashboard access.',
    typeLabel: 'recorded course',
    heroImg: '/recorded.jpg',
  },
  all: {
    title: 'Professional Astrology Courses',
    description: 'Explore live classes and recorded programs from beginner fundamentals to advanced prediction.',
    url: '/courses',
    heading: 'All courses',
    subtitle: 'Live batches and self-paced recordings in one place.',
    typeLabel: 'course',
  },
};

function CategoryChip({ active, count, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-site-primary bg-site-primary px-2.5 py-1.5 font-body text-xs font-semibold text-white shadow-sm sm:px-3 sm:py-2'
          : 'm-0 inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-site-accent-dark/12 bg-site-bg px-2.5 py-1.5 font-body text-xs font-semibold text-site-muted transition hover:border-site-accent/40 hover:bg-site-surface hover:text-site-primary sm:px-3 sm:py-2'
      }
    >
      {count != null && (
        <span
          className={
            active
              ? 'inline-flex min-w-[1rem] items-center justify-center rounded bg-white/20 px-1 py-0.5 text-[0.625rem] font-bold tabular-nums leading-none'
              : 'inline-flex min-w-[1rem] items-center justify-center rounded bg-site-accent-dark/10 px-1 py-0.5 text-[0.625rem] font-bold tabular-nums leading-none text-site-accent-dark'
          }
        >
          {count}
        </span>
      )}
      {label}
    </button>
  );
}

function Courses({ mode = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const meta = PAGE_META[mode] || PAGE_META.all;
  const apiCourseType = mode === 'live' ? 'Live' : mode === 'recorded' ? 'Recorded' : undefined;

  const { courses: dbCourses, loading, error } = useCourses({
    courseType: apiCourseType,
  });
  const { categories: adminCategories } = useCourseCategories();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedCategory('All');
    setSearchTerm('');
  }, [mode]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    dbCourses.forEach((c) => {
      if (c.category) counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [dbCourses]);

  const categoryFilters = useMemo(() => {
    const names = adminCategories.length
      ? adminCategories.map((c) => c.name).filter((name) => categoryCounts[name])
      : Object.keys(categoryCounts);

    const unique = [...new Set(names)].sort();
    return [
      { label: 'All', count: dbCourses.length },
      ...unique.map((name) => ({ label: name, count: categoryCounts[name] || 0 })),
    ];
  }, [dbCourses, adminCategories, categoryCounts]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return dbCourses.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.shortDesc.toLowerCase().includes(q) ||
        (course.category || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [dbCourses, searchTerm, selectedCategory]);

  const resultLabel =
    filteredCourses.length === 1 ? meta.typeLabel : `${meta.typeLabel}s`;

  return (
    <div className="min-h-screen w-full bg-site-bg font-body text-site-text antialiased">
      <SEO title={meta.title} description={meta.description} url={meta.url} />

      {meta.heroImg ? (
        <header className="relative w-full overflow-hidden border-b border-site-accent-dark/8">
          <img
            src={meta.heroImg}
            alt={meta.heading}
            className="block w-full object-cover object-top"
            style={{ maxHeight: '320px' }}
          />
          {/* dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          <div className={`${PAGE_WRAP} absolute inset-0 z-10 flex flex-col justify-end pb-6 sm:pb-8`}>
            <h1 className="!m-0 font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight !text-white drop-shadow-md">
              {meta.heading}
            </h1>
            <p className="!mt-2 max-w-2xl font-body text-sm leading-relaxed !text-white/80 sm:text-base">
              {meta.subtitle}
            </p>
            {!loading && (
              <p className="!mt-3 font-body text-xs font-medium !text-white/60">
                <strong className="font-bold tabular-nums !text-white/90">{dbCourses.length}</strong>
                {' '}
                {dbCourses.length === 1 ? meta.typeLabel : `${meta.typeLabel}s`}
                {' '}
                available
                {categoryFilters.length > 1 && (
                  <>
                    {' · '}
                    <strong className="font-bold tabular-nums !text-white/90">{categoryFilters.length - 1}</strong>
                    {' '}
                    categories
                  </>
                )}
              </p>
            )}
          </div>
        </header>
      ) : (
        <header className={`${PAGE_WRAP} border-b border-site-accent-dark/8 pb-4 pt-6 sm:pb-5 sm:pt-7`}>
          <h1 className="!m-0 font-heading text-[clamp(1.5rem,3.2vw,2.125rem)] font-bold leading-tight text-site-primary">
            {meta.heading}
          </h1>
          <p className="!mt-1.5 max-w-2xl font-body text-sm leading-relaxed text-site-muted">{meta.subtitle}</p>
          {!loading && (
            <p className="!mt-2 font-body text-xs font-medium text-site-muted">
              <strong className="font-bold tabular-nums text-site-primary">{dbCourses.length}</strong>
              {' '}
              {dbCourses.length === 1 ? meta.typeLabel : `${meta.typeLabel}s`}
              {' '}
              available
              {categoryFilters.length > 1 && (
                <>
                  {' '}
                  ·{' '}
                  <strong className="font-bold tabular-nums text-site-primary">{categoryFilters.length - 1}</strong>
                  {' '}
                  categories
                </>
              )}
            </p>
          )}
        </header>
      )}

      <div className="sticky top-[var(--header-h)] z-[100] border-b border-site-accent-dark/10 bg-site-surface/95 shadow-sm backdrop-blur-md">
        <div className={`${PAGE_WRAP} flex flex-col gap-2.5 py-2.5 sm:gap-3 sm:py-3`}>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-accent-dark/50"
              aria-hidden
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${mode === 'live' ? 'live classes' : mode === 'recorded' ? 'recorded courses' : 'courses'}…`}
              className="m-0 w-full rounded-lg border border-site-accent-dark/15 bg-site-bg py-2 pl-9 pr-3 font-body text-sm text-site-primary placeholder:text-site-soft outline-none transition focus:border-site-accent focus:ring-2 focus:ring-site-accent/15"
            />
          </div>

          {categoryFilters.length > 1 && (
            <div className={`flex items-center gap-1.5 overflow-x-auto sm:gap-2 ${SCROLL_HIDE}`}>
              {categoryFilters.map(({ label, count }) => (
                <CategoryChip
                  key={label}
                  label={label}
                  count={count}
                  active={selectedCategory === label}
                  onClick={() => setSelectedCategory(label)}
                />
              ))}
            </div>
          )}

          <p className="!m-0 font-body text-[0.6875rem] font-medium text-site-muted">
            {loading ? (
              'Loading courses…'
            ) : (
              <>
                <strong className="font-bold tabular-nums text-site-primary">{filteredCourses.length}</strong>
                {' '}
                {searchTerm.trim() || selectedCategory !== 'All' ? `${resultLabel} matched` : `${resultLabel} shown`}
              </>
            )}
          </p>
        </div>
      </div>

      <div className={`${PAGE_WRAP} py-5 sm:py-6`}>
        {loading ? (
          <CourseGridSkeleton count={mode === 'all' ? 6 : 6} />
        ) : filteredCourses.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <li key={course.id} className="min-w-0">
                <CourseListingCard course={course} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-16 text-center sm:py-20">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-site-accent/12 text-site-accent-dark">
              <SearchX size={26} aria-hidden />
            </div>
            <h2 className="!m-0 font-heading text-lg font-bold text-site-primary">No courses found</h2>
            <p className="!mt-2 font-body text-sm text-site-muted">
              {dbCourses.length === 0
                ? 'Courses will appear here once they are published from the admin panel.'
                : 'Try a different search term or category.'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="!mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl border-0 bg-site-primary px-5 py-2.5 font-body text-sm font-bold text-white transition hover:bg-site-accent-dark"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
