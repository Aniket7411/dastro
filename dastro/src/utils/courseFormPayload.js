/** Display stored numbers in admin inputs — unset/0 shows as blank. */
export function numberFieldToForm(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return '';
  return String(n);
}

export function parseFormNumber(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return null;
  const n = parseInt(trimmed.replace(/[^0-9]/g, ''), 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export const EMPTY_BATCH_DETAILS = {
  startDate: '',
  classCount: '',
  classDuration: '',
  platform: '',
};

export function courseToFormData(course = {}) {
  return {
    title: course.title || '',
    slug: course.slug || '',
    category: course.category || '',
    description: course.description || '',
    longDesc: course.longDesc || '',
    courseType: course.courseType || 'Recorded',
    level: course.level || 'Beginner',
    duration: course.duration || '',
    instructor:
      typeof course.instructor === 'string'
        ? course.instructor
        : course.instructor?.name || '',
    topics: Array.isArray(course.topics) ? course.topics : [],
    price: numberFieldToForm(course.price),
    mrp: numberFieldToForm(course.mrp),
    tier: course.tier || '',
    validityDays: numberFieldToForm(course.validityDays),
    thumbnailUrl: course.thumbnailUrl || '',
    curriculum: Array.isArray(course.curriculum)
      ? course.curriculum.map((m) => ({
          title: m.title || '',
          lessons: Array.isArray(m.lessons) ? m.lessons : [],
        }))
      : [],
    batchDetails: {
      startDate: course.batchDetails?.startDate || '',
      classCount:
        course.batchDetails?.classCount != null && course.batchDetails.classCount !== ''
          ? String(course.batchDetails.classCount)
          : '',
      classDuration: course.batchDetails?.classDuration || '',
      platform: course.batchDetails?.platform || '',
    },
    faqs: Array.isArray(course.faqs)
      ? course.faqs.map((f) => ({
          question: f.question || '',
          answer: f.answer || '',
        }))
      : [],
  };
}

export function buildCourseApiPayload(formData) {
  const batch = formData.batchDetails || EMPTY_BATCH_DETAILS;
  const classCount = parseFormNumber(batch.classCount);

  return {
    title: String(formData.title || '').trim(),
    slug: String(formData.slug || '').trim(),
    category: String(formData.category || '').trim(),
    description: String(formData.description || '').trim(),
    longDesc: String(formData.longDesc || '').trim(),
    courseType: formData.courseType === 'Live' ? 'Live' : 'Recorded',
    level: formData.level || 'Beginner',
    duration: String(formData.duration || '').trim(),
    instructor: String(formData.instructor || '').trim(),
    topics: Array.isArray(formData.topics) ? formData.topics : [],
    price: parseFormNumber(formData.price),
    mrp: parseFormNumber(formData.mrp),
    tier: formData.tier || '',
    validityDays: parseFormNumber(formData.validityDays),
    thumbnailUrl: String(formData.thumbnailUrl || '').trim(),
    curriculum: (formData.curriculum || [])
      .map((m) => ({
        title: String(m.title || '').trim(),
        lessons: Array.isArray(m.lessons) ? m.lessons.filter(Boolean) : [],
      }))
      .filter((m) => m.title),
    batchDetails: {
      startDate: String(batch.startDate || '').trim(),
      classDuration: String(batch.classDuration || '').trim(),
      platform: String(batch.platform || '').trim(),
      ...(classCount != null ? { classCount } : {}),
    },
    faqs: (formData.faqs || [])
      .map((f) => ({
        question: String(f.question || '').trim(),
        answer: String(f.answer || '').trim(),
      }))
      .filter((f) => f.question || f.answer),
  };
}
