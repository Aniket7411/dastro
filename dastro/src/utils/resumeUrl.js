/**
 * Resolve resume URLs from DB — supports Supabase absolute URLs and legacy /uploads paths.
 */
export function resolveResumeUrl(resumeUrl, apiBase = '') {
  if (!resumeUrl || typeof resumeUrl !== 'string') return '';

  const trimmed = resumeUrl.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const base = (apiBase || '').replace(/\/$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return base ? `${base}${path}` : path;
}

export function getResumeFileName(fullName = 'candidate', resumeUrl = '') {
  const safeName = String(fullName).trim().replace(/\s+/g, '_') || 'candidate';
  const extMatch = resumeUrl.match(/\.([a-z0-9]+)(?:\?|$)/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'pdf';
  return `${safeName}_resume.${ext}`;
}

export function openResume(resumeUrl, apiBase, fullName) {
  const url = resolveResumeUrl(resumeUrl, apiBase);
  if (!url) return false;

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = getResumeFileName(fullName, url);
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}
