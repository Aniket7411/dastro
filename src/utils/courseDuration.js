export const DURATION_UNITS = [
  { value: 'days', label: 'Days', singular: 'Day', plural: 'Days' },
  { value: 'weeks', label: 'Weeks', singular: 'Week', plural: 'Weeks' },
  { value: 'months', label: 'Months', singular: 'Month', plural: 'Months' },
];

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Master'];

/** Build API/display string e.g. "3 Months" */
export function formatCourseDuration(value, unit = 'weeks') {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return '';
  const meta = DURATION_UNITS.find((u) => u.value === unit) || DURATION_UNITS[1];
  const word = n === 1 ? meta.singular : meta.plural;
  return `${n} ${word}`;
}

/** Parse stored duration back into admin fields; returns legacy text when pattern does not match */
export function parseCourseDuration(durationStr = '') {
  const trimmed = String(durationStr).trim();
  if (!trimmed) {
    return { value: '', unit: 'weeks', legacy: '' };
  }

  const match = trimmed.match(/^(\d+)\s*(day|days|week|weeks|month|months)$/i);
  if (!match) {
    return { value: '', unit: 'weeks', legacy: trimmed };
  }

  const value = match[1];
  const token = match[2].toLowerCase();
  let unit = 'weeks';
  if (token.startsWith('day')) unit = 'days';
  else if (token.startsWith('month')) unit = 'months';

  return { value, unit, legacy: '' };
}

/** Prefer structured fields from API, then duration string, then validity fallback */
export function resolveCourseDuration(course) {
  if (course?.durationValue && course?.durationUnit) {
    return formatCourseDuration(course.durationValue, course.durationUnit);
  }
  if (course?.duration) return course.duration;
  const days = Number(course?.validityDays);
  if (days > 0) return formatCourseDuration(days, 'days');
  return '';
}
