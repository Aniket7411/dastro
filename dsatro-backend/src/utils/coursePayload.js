/** Parse admin number fields — empty stays null, never silently becomes 0. */
export function parseOptionalNonNegativeInt(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export function normalizeBatchDetails(batch) {
  if (!batch || typeof batch !== 'object') return undefined;
  const startDate = String(batch.startDate ?? '').trim();
  const classDuration = String(batch.classDuration ?? '').trim();
  const platform = String(batch.platform ?? '').trim();
  const classCount = parseOptionalNonNegativeInt(batch.classCount);

  const hasAny = startDate || classDuration || platform || classCount != null;
  if (!hasAny) return undefined;

  const out = {};
  if (startDate) out.startDate = startDate;
  if (classDuration) out.classDuration = classDuration;
  if (platform) out.platform = platform;
  if (classCount != null) out.classCount = classCount;
  return out;
}

export function normalizeCurriculum(curriculum) {
  if (!Array.isArray(curriculum)) return undefined;
  const modules = curriculum
    .map((module) => {
      const title = String(module?.title ?? '').trim();
      const lessons = Array.isArray(module?.lessons)
        ? module.lessons.map((l) => String(l).trim()).filter(Boolean)
        : String(module?.lessons ?? '')
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
      if (!title) return null;
      return { title, lessons };
    })
    .filter(Boolean);
  return modules;
}

export function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return undefined;
  const items = faqs
    .map((faq) => {
      const question = String(faq?.question ?? '').trim();
      const answer = String(faq?.answer ?? '').trim();
      if (!question && !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);
  return items;
}
