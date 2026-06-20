import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import { Receipt } from 'lucide-react';
import API_BASE from '../utils/api';
import { formatAdminCurrency, formatAdminDate } from '../utils/adminTableUtils';
import AdminDataTable from '../components/admin/AdminDataTable';
import {
  AdminPersonCell,
  AdminStatusDot,
} from '../components/admin/AdminTableCells';
import {
  AccessActionModal,
  ExternalPaymentModal,
} from '../components/admin/CourseAccessModals';

const PAYMENT_TONE = {
  paid: 'green',
  completed: 'green',
  confirmed: 'green',
  pending: 'amber',
  enquiry: 'amber',
  failed: 'rose',
};

const ACCESS_TONE = {
  enabled: 'green',
  pending: 'amber',
  disabled: 'slate',
  suspended: 'rose',
  none: 'slate',
};

const ACCESS_LABELS = {
  enabled: 'Enabled',
  pending: 'Pending',
  disabled: 'Disabled',
  suspended: 'Suspended',
  none: 'Not granted',
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actingKey, setActingKey] = useState(null);
  const [externalModal, setExternalModal] = useState(null);
  const [accessModal, setAccessModal] = useState(null);
  const [externalAmount, setExternalAmount] = useState('');
  const [externalNote, setExternalNote] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || 'Failed to fetch course access records');
      }
    } catch {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const dismissModals = () => {
    setExternalModal(null);
    setAccessModal(null);
    setExternalAmount('');
    setExternalNote('');
  };

  const closeModals = () => {
    if (actingKey) return;
    dismissModals();
  };

  const runAction = async (row, actionName, { url, method = 'PUT', body, successMessage, onSuccess }) => {
    setActingKey(`${row.rowId}:${actionName}`);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || successMessage);
        onSuccess?.();
        fetchOrders();
      } else {
        dismissModals();
        fetchOrders();
        toast.error(data.message || 'Action failed');
      }
    } catch {
      dismissModals();
      toast.error('Network error — please check your connection and try again.');
    } finally {
      setActingKey(null);
    }
  };

  const openExternalModal = (row) => {
    setAccessModal(null);
    setExternalModal(row);
    setExternalAmount(row.amount != null ? String(row.amount) : '');
    setExternalNote('');
  };

  const openAccessModal = (row, action) => {
    setExternalModal(null);
    setAccessModal({ row, action });
  };

  const submitExternalAccess = () => {
    if (!externalModal) return;
    runAction(externalModal, 'confirm', {
      url: `${API_BASE}/api/admin/leads/${externalModal.leadId}/confirm-access`,
      method: 'POST',
      body: {
        amount: externalAmount.trim() ? Number(externalAmount) : undefined,
        note: externalNote.trim() || undefined,
      },
      successMessage: 'Course access enabled and credentials emailed.',
      onSuccess: closeModals,
    });
  };

  const submitAccessAction = () => {
    if (!accessModal) return;
    const { row, action } = accessModal;
    runAction(row, action, {
      url: `${API_BASE}/api/admin/enrollments/${row.enrollmentId}/access`,
      body: { action },
      successMessage: 'Course access updated.',
      onSuccess: closeModals,
    });
  };

  const filteredOrders = orders.filter((row) => {
    const q = searchTerm.toLowerCase();
    return (
      row.studentName?.toLowerCase().includes(q)
      || row.email?.toLowerCase().includes(q)
      || row.courseTitle?.toLowerCase().includes(q)
      || row.phone?.includes(searchTerm)
    );
  });

  const isActing = (row, actionName) => actingKey === `${row.rowId}:${actionName}`;
  const externalBusy = externalModal && actingKey === `${externalModal.rowId}:confirm`;
  const accessBusy = accessModal && actingKey === `${accessModal.row.rowId}:${accessModal.action}`;

  const renderActions = (row) => {
    if (row.source === 'lead') {
      return (
        <button
          type="button"
          className="lms-mini-btn"
          disabled={Boolean(actingKey)}
          onClick={() => openExternalModal(row)}
        >
          {isActing(row, 'confirm') ? 'Confirming…' : 'Confirm & Enable'}
        </button>
      );
    }

    if (!row.enrollmentId) {
      return <span className="atd-secondary">—</span>;
    }

    const status = row.accessStatus || 'pending';
    const busy = Boolean(actingKey);

    if (status === 'enabled') {
      return (
        <div className="d-flex flex-wrap gap-1">
          <button
            type="button"
            className="lms-mini-btn"
            disabled={busy}
            onClick={() => openAccessModal(row, 'disable')}
          >
            Disable
          </button>
          <button
            type="button"
            className="lms-mini-btn lms-mini-btn--danger"
            disabled={busy}
            onClick={() => openAccessModal(row, 'suspend')}
          >
            Suspend
          </button>
        </div>
      );
    }

    if (status === 'disabled') {
      return (
        <div className="d-flex flex-wrap gap-1">
          <button
            type="button"
            className="lms-mini-btn"
            disabled={busy}
            onClick={() => openAccessModal(row, 'enable')}
          >
            Enable
          </button>
          <button
            type="button"
            className="lms-mini-btn lms-mini-btn--danger"
            disabled={busy}
            onClick={() => openAccessModal(row, 'suspend')}
          >
            Suspend
          </button>
        </div>
      );
    }

    if (status === 'suspended') {
      return (
        <div className="d-flex flex-wrap gap-1">
          <button
            type="button"
            className="lms-mini-btn"
            disabled={busy}
            onClick={() => openAccessModal(row, 'enable')}
          >
            Enable
          </button>
          <button
            type="button"
            className="lms-mini-btn"
            disabled={busy}
            onClick={() => openAccessModal(row, 'disable')}
          >
            Disable
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="lms-mini-btn"
        disabled={busy}
        onClick={() => openAccessModal(row, 'enable')}
      >
        Enable
      </button>
    );
  };

  const columns = [
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      sortValue: (row) => row.studentName || '',
      render: (row) => (
        <AdminPersonCell name={row.studentName || 'Student'} secondary={row.email} />
      ),
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      sortValue: (row) => row.courseTitle || '',
      render: (row) => (
        <div>
          <div className="atd-primary">{row.courseTitle || 'Unknown course'}</div>
          {row.phone ? (
            <div className="atd-secondary" style={{ fontSize: '0.75rem' }}>{row.phone}</div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (row) => (
        <div className="atd-primary">
          {row.amount != null ? formatAdminCurrency(row.amount) : '—'}
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (row) => {
        const status = String(row.paymentStatus || 'pending').toLowerCase();
        const tone = PAYMENT_TONE[status] || 'slate';
        const sourceLabel = row.paymentSource === 'external'
          ? 'External'
          : row.paymentSource === 'enquiry'
            ? 'Enquiry'
            : row.paymentSource === 'razorpay'
              ? 'Online'
              : '';
        return (
          <div>
            <AdminStatusDot label={row.paymentStatus || 'Pending'} tone={tone} />
            {sourceLabel ? (
              <div className="atd-secondary" style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>{sourceLabel}</div>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'accessStatus',
      label: 'Course access',
      sortable: true,
      sortValue: (row) => row.accessStatus || 'none',
      render: (row) => {
        const status = row.accessStatus || 'none';
        return (
          <AdminStatusDot
            label={ACCESS_LABELS[status] || status}
            tone={ACCESS_TONE[status] || 'slate'}
          />
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => renderActions(row),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      sortValue: (row) => row.createdAt,
      render: (row) => <span className="atd-secondary">{formatAdminDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="admin-leads-content">
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3">
          <div className="search-bar flex-grow-1" style={{ maxWidth: '400px', background: 'var(--surface)' }}>
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Search by student, email, or course…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="topbar-icon-btn"
            title="Refresh"
            style={{ height: '42px', width: '42px' }}
          >
            <i className="fas fa-sync-alt" />
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', maxWidth: '52rem' }}>
          Confirm external payments from recorded course enquiries, then use <strong>Enable</strong>, <strong>Disable</strong>, or <strong>Suspend</strong> to control lesson access. Enabling sends login credentials to the student email.
        </p>
      </div>

      <AdminDataTable
        columns={columns}
        data={filteredOrders}
        loading={isLoading}
        loadingMessage="Loading course access…"
        entityLabel="record"
        totalCount={orders.length}
        filteredCount={filteredOrders.length}
        title="Course Access & Orders"
        subtitle="Enquiries, external payments, and online purchases"
        emptyIcon={Receipt}
        emptyTitle="No course access records"
        emptyMessage={searchTerm ? 'Try a different search term.' : 'Recorded course enquiries and enrollments appear here.'}
        minWidth={980}
      />

      {externalModal ? (
        <ExternalPaymentModal
          row={externalModal}
          amount={externalAmount}
          note={externalNote}
          busy={Boolean(externalBusy)}
          onAmountChange={setExternalAmount}
          onNoteChange={setExternalNote}
          onClose={closeModals}
          onSubmit={submitExternalAccess}
        />
      ) : null}

      {accessModal ? (
        <AccessActionModal
          row={accessModal.row}
          action={accessModal.action}
          busy={Boolean(accessBusy)}
          onClose={closeModals}
          onConfirm={submitAccessAction}
        />
      ) : null}
    </div>
  );
}

export default AdminOrders;
