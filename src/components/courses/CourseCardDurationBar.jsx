import { Clock } from 'lucide-react';
import { SITE_COURSE_CARD_DURATION } from '../../utils/siteTokens';

export function formatCourseCardDurationMeta(course) {
  const parts = [];
  const modules = Number(course?.modulesCount);

  if (modules > 0) {
    parts.push(`${modules} modules`);
  }

  const duration = String(course?.duration || '').trim();
  if (duration) {
    parts.push(duration);
  }

  return parts.join(' · ');
}

export default function CourseCardDurationBar({ course }) {
  const label = formatCourseCardDurationMeta(course);
  if (!label) return null;

  return (
    <span className={SITE_COURSE_CARD_DURATION}>
      <Clock size={10} className="shrink-0 opacity-90 sm:size-2.5" aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  );
}
