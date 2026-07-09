import API_BASE from './api';

const TOKEN_KEY = 'counsellorToken';
const USER_KEY = 'counsellorUser';

export function getCounsellorToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getCounsellorUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setCounsellorSession(token, counsellor) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(counsellor));
}

export function clearCounsellorSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function counsellorFetch(path, options = {}) {
  const token = getCounsellorToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}/api/free-consultation${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export function counsellorLogin(email, password) {
  return counsellorFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function submitFreeConsultationLead(payload) {
  return counsellorFetch('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function counsellorListLeads(params = '') {
  const q = params ? `?${params}` : '';
  return counsellorFetch(`/leads${q}`);
}

export function counsellorGetLead(leadId) {
  return counsellorFetch(`/leads/${leadId}`);
}

export async function adminExportNeoDove(adminToken, query = '') {
  const res = await fetch(`${API_BASE}/api/admin/free-consultation/export?${query}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!res.ok) throw new Error('Export failed');
  return res.blob();
}

export async function adminListFreeConsultationLeads(adminToken, query = '') {
  const res = await fetch(`${API_BASE}/api/admin/free-consultation/leads?${query}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load leads');
  return data;
}

async function adminFetch(path, adminToken, options = {}) {
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function adminListCounsellors(adminToken) {
  return adminFetch('/counsellors', adminToken);
}

export function adminCreateCounsellor(adminToken, payload) {
  return adminFetch('/counsellors', adminToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function adminUpdateCounsellor(adminToken, id, payload) {
  return adminFetch(`/counsellors/${id}`, adminToken, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function adminDeleteCounsellor(adminToken, id) {
  return adminFetch(`/counsellors/${id}`, adminToken, { method: 'DELETE' });
}

export function adminSuspendCounsellor(adminToken, id) {
  return adminFetch(`/counsellors/${id}/suspend`, adminToken, { method: 'PUT', body: '{}' });
}

export function adminUnsuspendCounsellor(adminToken, id) {
  return adminFetch(`/counsellors/${id}/unsuspend`, adminToken, { method: 'PUT', body: '{}' });
}

export function adminResetCounsellorPassword(adminToken, id, payload = {}) {
  return adminFetch(`/counsellors/${id}/reset-password`, adminToken, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function counsellorForgotPassword(email) {
  return counsellorFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export function counsellorResetPassword(email, otp, newPassword) {
  return counsellorFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), newPassword }),
  });
}
