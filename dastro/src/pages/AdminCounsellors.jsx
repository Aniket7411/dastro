import { useCallback, useEffect, useState } from 'react';
import { Copy, Eye, EyeOff, Loader2, Mail, Pencil, Plus, RefreshCw, Trash2, UserX } from 'lucide-react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import {
  adminCreateCounsellor,
  adminDeleteCounsellor,
  adminListCounsellors,
  adminResetCounsellorPassword,
  adminSuspendCounsellor,
  adminUnsuspendCounsellor,
  adminUpdateCounsellor,
} from '../utils/freeConsultationApi';

const EMPTY_FORM = { name: '', email: '', mobile: '', password: '', sendEmail: true };

function formatDt(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function CredentialsModal({ counsellor, password, emailSent, onClose }) {
  const loginUrl = `${window.location.origin}/counsellor/login`;
  const text = [
    `Counsellor desk login`,
    `URL: ${loginUrl}`,
    `Name: ${counsellor.name}`,
    `Email: ${counsellor.email}`,
    `Password: ${password}`,
  ].join('\n');

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Credentials copied');
    } catch {
      toast.error('Could not copy — select and copy manually');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-base font-bold text-slate-900">Share counsellor credentials</h3>
        <p className="mt-1 text-sm text-slate-500">
          {emailSent
            ? 'Welcome email sent. You can also copy the details below.'
            : 'Email was not sent — copy and share these credentials manually.'}
        </p>

        <div className="mt-4 space-y-2 rounded-lg border border-amber-100 bg-amber-50/60 p-4 text-sm">
          <p><span className="font-semibold text-slate-700">Name:</span> {counsellor.name}</p>
          <p><span className="font-semibold text-slate-700">Email:</span> {counsellor.email}</p>
          <p><span className="font-semibold text-slate-700">Password:</span> <code className="rounded bg-white px-1.5 py-0.5">{password}</code></p>
          <p className="text-xs text-slate-500 break-all">Login: {loginUrl}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            <Copy size={14} />
            Copy all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function CounsellorFormModal({ mode, initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = mode === 'edit';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateCounsellor(token, initial.id, {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
        });
        toast.success('Counsellor updated');
        onSaved();
        onClose();
      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim() || undefined,
          sendEmail: form.sendEmail,
        };
        if (form.password.trim()) payload.password = form.password.trim();

        const data = await adminCreateCounsellor(token, payload);
        toast.success(data.emailSent ? 'Counsellor created and email sent' : 'Counsellor created');
        onSaved(data);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-base font-bold text-slate-900">
          {isEdit ? 'Edit counsellor' : 'Add counsellor'}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Mobile</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit number"
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </label>

          {!isEdit && (
            <>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Password <span className="font-normal normal-case text-slate-400">(optional — auto-generated if blank)</span>
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    minLength={6}
                    placeholder="Min 6 characters"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm((f) => ({ ...f, sendEmail: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                Email login credentials to counsellor
              </label>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isEdit ? 'Save changes' : 'Create counsellor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCounsellors() {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState(null);
  const [credentialsModal, setCredentialsModal] = useState(null);
  const [actionId, setActionId] = useState('');

  const token = localStorage.getItem('adminToken');

  const loadCounsellors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminListCounsellors(token);
      setCounsellors(data.counsellors || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load counsellors');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCounsellors();
  }, [loadCounsellors]);

  const filtered = counsellors.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q)
      || c.email?.toLowerCase().includes(q)
      || (c.mobile && c.mobile.includes(q))
    );
  });

  const handleCreated = (data) => {
    loadCounsellors();
    if (data?.temporaryPassword && data?.counsellor) {
      setCredentialsModal({
        counsellor: data.counsellor,
        password: data.temporaryPassword,
        emailSent: data.emailSent,
      });
    }
  };

  const handleSuspendToggle = async (counsellor) => {
    if (!token) return;
    setActionId(counsellor._id || counsellor.id);
    try {
      if (counsellor.active) {
        if (!window.confirm(`Suspend ${counsellor.name}? They will not be able to log in.`)) return;
        await adminSuspendCounsellor(token, counsellor._id || counsellor.id);
        toast.success('Counsellor suspended');
      } else {
        await adminUnsuspendCounsellor(token, counsellor._id || counsellor.id);
        toast.success('Counsellor reactivated');
      }
      loadCounsellors();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionId('');
    }
  };

  const handleResetPassword = async (counsellor) => {
    if (!token) return;
    if (!window.confirm(`Reset password for ${counsellor.name}? A new password will be generated and emailed if possible.`)) return;
    setActionId(counsellor._id || counsellor.id);
    try {
      const data = await adminResetCounsellorPassword(token, counsellor._id || counsellor.id, {
        sendEmail: true,
      });
      toast.success(data.emailSent ? 'New password emailed' : 'Password reset — share credentials manually');
      setCredentialsModal({
        counsellor: data.counsellor,
        password: data.temporaryPassword,
        emailSent: data.emailSent,
      });
    } catch (err) {
      toast.error(err.message || 'Reset failed');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (counsellor) => {
    if (!token) return;
    if (!window.confirm(`Delete ${counsellor.name}? This cannot be undone.`)) return;
    setActionId(counsellor._id || counsellor.id);
    try {
      await adminDeleteCounsellor(token, counsellor._id || counsellor.id);
      toast.success('Counsellor deleted');
      loadCounsellors();
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setActionId('');
    }
  };

  return (
    <div className="admin-leads-content">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h5 mb-1">Counsellors</h2>
          <p className="text-muted small mb-0">Create accounts, share credentials, suspend or remove access</p>
        </div>
        <button
          type="button"
          className="btn btn-dark btn-sm d-inline-flex align-items-center gap-1"
          onClick={() => setFormModal({ mode: 'create' })}
        >
          <Plus size={14} />
          Add counsellor
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Search name, email or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={loadCounsellors}>
            Refresh
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table leads-table w-100">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">Loading…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">No counsellors yet</td>
              </tr>
            ) : (
              filtered.map((c) => {
                const id = c._id || c.id;
                const busy = actionId === id;
                return (
                  <tr key={id}>
                    <td className="fw-semibold">{c.name}</td>
                    <td className="small">{c.email}</td>
                    <td>{c.mobile || '—'}</td>
                    <td>
                      <span className={`badge ${c.active ? 'bg-success' : 'bg-secondary'}`}>
                        {c.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="small text-muted">{formatDt(c.createdAt)}</td>
                    <td className="text-end">
                      <div className="d-inline-flex flex-wrap gap-1 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          title="Edit"
                          disabled={busy}
                          onClick={() => setFormModal({
                            mode: 'edit',
                            initial: {
                              id,
                              name: c.name,
                              email: c.email,
                              mobile: c.mobile || '',
                            },
                          })}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          title="Reset password"
                          disabled={busy}
                          onClick={() => handleResetPassword(c)}
                        >
                          {busy ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm py-0 px-2 ${c.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          title={c.active ? 'Suspend' : 'Reactivate'}
                          disabled={busy}
                          onClick={() => handleSuspendToggle(c)}
                        >
                          <UserX size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          title="Delete"
                          disabled={busy}
                          onClick={() => handleDelete(c)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-muted small mt-3 mb-0 d-flex align-items-center gap-1 flex-wrap">
        <Mail size={13} />
        Counsellor login:
        {' '}
        <a href="/counsellor/login" target="_blank" rel="noreferrer">
          {API_BASE ? `${window.location.origin}/counsellor/login` : '/counsellor/login'}
        </a>
      </p>

      {formModal && (
        <CounsellorFormModal
          mode={formModal.mode}
          initial={formModal.initial}
          onClose={() => setFormModal(null)}
          onSaved={formModal.mode === 'create' ? handleCreated : loadCounsellors}
        />
      )}

      {credentialsModal && (
        <CredentialsModal
          counsellor={credentialsModal.counsellor}
          password={credentialsModal.password}
          emailSent={credentialsModal.emailSent}
          onClose={() => setCredentialsModal(null)}
        />
      )}
    </div>
  );
}
