import { formatINR } from './currency.js';

export function formatAdminDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatAdminTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatAdminDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getLeadSubmittedAt(lead) {
  return lead?.submittedAt || lead?.createdAt || null;
}

export function formatAdminCurrency(amount) {
  return formatINR(amount);
}

export function getInitials(name = '') {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '—';
}

export function getSortValue(row, column) {
  if (column.sortValue) return column.sortValue(row);
  if (column.key && row[column.key] != null) return row[column.key];
  return '';
}

export function compareSortValues(a, b) {
  if (a == null || a === '') return 1;
  if (b == null || b === '') return -1;

  const numA = Number(a);
  const numB = Number(b);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;

  const dateA = new Date(a);
  const dateB = new Date(b);
  if (!Number.isNaN(dateA.getTime()) && !Number.isNaN(dateB.getTime())) {
    return dateA.getTime() - dateB.getTime();
  }

  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || `${singular}s`);
}
