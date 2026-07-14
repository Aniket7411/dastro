import { Clock } from 'lucide-react';
import { SITE_COURSE_CARD_DURATION, SITE_COURSE_CARD_DURATION_STRIP } from '../../utils/siteTokens';

function stripModuleSegments(text) {
  return String(text || '')
    .split('·')
    .map((segment) => segment.trim())
    .filter((segment) => segment && !/^\d+\s*(modules?|classes?|(weekly\s+)?sessions?)$/i.test(segment))
    .join(' · ');
}

export function formatCourseCardDurationMeta(course) {
  const parts = [];
  const modules = Number(course?.modulesCount);

  if (modules > 0) {
    parts.push(`${modules} ${modules === 1 ? 'module' : 'modules'}`);
  }

  const duration = stripModuleSegments(String(course?.duration || '').trim());
  if (duration) {
    parts.push(duration);
  }

  return parts.join(' · ');
}

/** variant="overlay" (default) sits on top of the image; variant="strip" is its own block below it. */
export default function CourseCardDurationBar({ course, variant = 'overlay' }) {
  const label = formatCourseCardDurationMeta(course);
  if (!label) return null;

  const className = variant === 'strip' ? SITE_COURSE_CARD_DURATION_STRIP : SITE_COURSE_CARD_DURATION;

  return (
    <span className={className}>
      <Clock size={10} className="shrink-0 opacity-90 sm:size-2.5" aria-hidden />
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}
