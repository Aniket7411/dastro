import { useState, useEffect, useMemo } from 'react';
import SEO from '../components/SEO';
import CourseListingCard from '../components/CourseListingCard';
import { CourseGridSkeleton } from '../components/PageLoader';
import CourseHero from '../components/courses/CourseHero';
import CourseFilterBar from '../components/courses/CourseFilterBar';
import CourseEmptyState from '../components/courses/CourseEmptyState';
import { useCourses, useCourseCategories } from '../hooks/useCourses';
import { PAGE_WRAP, CARD_FLEX_LIST, CARD_FLEX_ITEM } from '../components/consultation/tokens';
import toast from '@/utils/toast';

const PAGE_META = {
  live: {
    title: 'Live Astrology Courses',
    description: 'Instructor-led live batches — browse programs, submit an enquiry, and get batch timing and pricing from our team.',
    url: '/live-courses',
    heading: 'Live classes',
    subtitle: 'Interactive batches with expert mentors. Enquire to confirm schedule and fees.',
    typeLabel: 'live class',
    typeLabelPlural: 'live classes',
    heroImg: '/live.jpg',
    searchPlaceholder: 'Search live…',
  },
  recorded: {
    title: 'Recorded Astrology Courses',
    description: 'Self-paced recorded programs — purchase online, unlock student access, and learn from your dashboard.',
    url: '/recorded-courses',
    heading: 'Recorded courses',
    subtitle: 'Learn at your own pace with structured modules and lifetime dashboard access.',
    typeLabel: 'recorded course',
    typeLabelPlural: 'recorded courses',
    heroImg: '/recorded.jpg',
    searchPlaceholder: 'Search recorded…',
  },
  all: {
    title: 'Professional Astrology Courses',
    description: 'Explore live classes and recorded programs from beginner fundamentals to advanced prediction.',
    url: '/courses',
    heading: 'All courses',
    subtitle: 'Live batches and self-paced recordings in one place.',
    typeLabel: 'course',
    typeLabelPlural: 'courses',
    searchPlaceholder: 'Search…',
  },
};

function Courses({ mode = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const meta = PAGE_META[mode] || PAGE_META.all;
  const apiCourseType = mode === 'live' ? 'Live' : mode === 'recorded' ? 'Recorded' : undefined;

  const { courses: dbCourses, loading, error } = useCourses({ courseType: apiCourseType });
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
        (course.instructor || '').toLowerCase().includes(q) ||
        (course.category || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [dbCourses, searchTerm, selectedCategory]);

  const resultLabel =
    filteredCourses.length === 1 ? meta.typeLabel : (meta.typeLabelPlural ?? `${meta.typeLabel}s`);

  const resultText =
    searchTerm.trim() || selectedCategory !== 'All'
      ? `${resultLabel} matched`
      : `${resultLabel} shown`;

  return (
    <div className="min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO title={meta.title} description={meta.description} url={meta.url} />

      <CourseHero
        heading={meta.heading}
        subtitle={meta.subtitle}
        heroImg={meta.heroImg}
        loading={loading}
        courseCount={dbCourses.length}
        typeLabel={meta.typeLabel}
        typeLabelPlural={meta.typeLabelPlural}
        categoryCount={categoryFilters.length}
      />

      <CourseFilterBar
        loading={loading}
        resultCount={filteredCourses.length}
        resultLabel={resultText}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={meta.searchPlaceholder}
        categoryFilters={categoryFilters}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className={`${PAGE_WRAP} pb-10 pt-6 sm:pb-12 sm:pt-8`}>
        {loading ? (
          <CourseGridSkeleton count={mode === 'all' ? 8 : 6} />
        ) : filteredCourses.length > 0 ? (
          <ul className={CARD_FLEX_LIST}>
            {filteredCourses.map((course) => (
              <li key={course.id} className={CARD_FLEX_ITEM}>
                <CourseListingCard course={course} />
              </li>
            ))}
          </ul>
        ) : (
          <CourseEmptyState
            hasCourses={dbCourses.length > 0}
            hasActiveFilters={Boolean(searchTerm || selectedCategory !== 'All')}
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Courses;
