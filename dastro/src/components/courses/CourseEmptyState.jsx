import { SearchX } from 'lucide-react';

export default function CourseEmptyState({ hasCourses, hasActiveFilters, onClearFilters }) {
  return (
    <div className="py-16 text-center sm:py-20">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-site-accent/10 text-site-accent-dark">
        <SearchX size={26} aria-hidden />
      </div>
      <h2 className="font-heading text-lg font-bold text-site-primary">No courses found</h2>
      <p className="mt-2 text-sm text-site-muted">
        {hasCourses
          ? 'Try a different search term or category.'
          : 'Courses will appear here once they are published from the admin panel.'}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex min-h-9 cursor-pointer items-center justify-center rounded-lg bg-site-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-site-accent-dark"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
