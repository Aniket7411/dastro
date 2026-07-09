/**
 * Age from date of birth — years for adults, months for babies under 1 year.
 */

function parseDob(dobStr) {
  if (!dobStr) return null;
  if (dobStr.includes('/')) {
    const [day, month, year] = dobStr.split('/').map((p) => parseInt(p, 10));
    const d = new Date(year, month - 1, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(`${dobStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getAgeFromDob(dobStr) {
  const dob = parseDob(dobStr);
  if (!dob) {
    return { years: null, months: null, display: '', valid: false };
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (dob > today) {
    return { years: null, months: null, display: 'Future date', valid: false };
  }

  let years = today.getFullYear() - dob.getFullYear();
  let monthDiff = today.getMonth() - dob.getMonth();
  if (today.getDate() < dob.getDate()) monthDiff -= 1;
  if (monthDiff < 0) {
    years -= 1;
    monthDiff += 12;
  }

  if (years >= 1) {
    return {
      years,
      months: null,
      display: `${years} year${years !== 1 ? 's' : ''}`,
      valid: true,
    };
  }

  let totalMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
  if (today.getDate() < dob.getDate()) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;

  const display = totalMonths === 0
    ? 'Less than 1 month'
    : `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;

  return {
    years: 0,
    months: totalMonths,
    display,
    valid: true,
  };
}

export function formatLeadAge(lead) {
  if (!lead) return '—';
  if (lead.ageDisplay) return lead.ageDisplay;
  if (lead.age > 0) return `${lead.age} year${lead.age !== 1 ? 's' : ''}`;
  if (lead.age === 0) {
    if (lead.ageMonths > 0) return `${lead.ageMonths} month${lead.ageMonths !== 1 ? 's' : ''}`;
    return 'Less than 1 month';
  }
  return lead.age != null ? String(lead.age) : '—';
}
