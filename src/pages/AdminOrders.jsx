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

const PAYMENT_TONE = {
  completed: 'green',
  paid: 'green',
  pending: 'amber',
  failed: 'rose',
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvingId, setApprovingId] = useState(null);

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
        toast.error(data.message || 'Failed to fetch orders');
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

  const approveAccess = async (order) => {
    if (!order.enrollmentId) {
      toast.error('No enrollment found for this order.');
      return;
    }
    const token = localStorage.getItem('adminToken');
    setApprovingId(order.enrollmentId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/enrollments/${order.enrollmentId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Course access approved');
        fetchOrders();
      } else {
        toast.error(data.message || 'Approval failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setApprovingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const name = (order.userId?.name || order.guestDetails?.name || '').toLowerCase();
    const email = (order.userId?.email || order.guestDetails?.email || '').toLowerCase();
    const course = (order.courseId?.title || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || email.includes(q) || course.includes(q);
  });

  const columns = [
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      sortValue: (order) => order.razorpayOrderId || order._id,
      render: (order) => (
        <span className="atd-secondary" style={{ fontFamily: 'ui-monospace, monospace' }}>
          {order.razorpayOrderId || order._id.toString().slice(-8)}
        </span>
      ),
    },
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      sortValue: (order) => order.userId?.name || order.guestDetails?.name || '',
      render: (order) => {
        const name = order.userId?.name || order.guestDetails?.name || 'Guest';
        const email = order.userId?.email || order.guestDetails?.email;
        return <AdminPersonCell name={name} secondary={email} />;
      },
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      sortValue: (order) => order.courseId?.title || '',
      render: (order) => (
        <div className="atd-primary">{order.courseId?.title || 'Unknown Course'}</div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (order) => (
        <div className="atd-primary">{formatAdminCurrency(order.amount)}</div>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (order) => {
        const status = String(order.paymentStatus || 'pending').toLowerCase();
        const tone = PAYMENT_TONE[status] || 'slate';
        return <AdminStatusDot label={order.paymentStatus || 'Pending'} tone={tone} />;
      },
    },
    {
      key: 'accessApproved',
      label: 'Lesson access',
      sortable: true,
      render: (order) => {
        const paid = ['completed', 'paid'].includes(String(order.paymentStatus || '').toLowerCase());
        if (!paid) return <span className="atd-secondary">—</span>;
        if (order.accessApproved === false) {
          return <AdminStatusDot label="Pending approval" tone="amber" />;
        }
        return <AdminStatusDot label="Approved" tone="green" />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => {
        const paid = ['completed', 'paid'].includes(String(order.paymentStatus || '').toLowerCase());
        if (!paid || !order.enrollmentId || order.accessApproved !== false) {
          return <span className="atd-secondary">—</span>;
        }
        return (
          <button
            type="button"
            className="lms-mini-btn"
            disabled={approvingId === order.enrollmentId}
            onClick={() => approveAccess(order)}
          >
            {approvingId === order.enrollmentId ? 'Approving…' : 'Approve access'}
          </button>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Order Date',
      sortable: true,
      sortValue: (order) => order.createdAt,
      render: (order) => <span className="atd-secondary">{formatAdminDate(order.createdAt)}</span>,
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
      </div>

      <AdminDataTable
        columns={columns}
        data={filteredOrders}
        loading={isLoading}
        loadingMessage="Loading orders…"
        entityLabel="order"
        totalCount={orders.length}
        filteredCount={filteredOrders.length}
        title="Course Orders"
        subtitle="Paid purchases and enrollment transactions"
        emptyIcon={Receipt}
        emptyTitle="No orders found"
        emptyMessage={searchTerm ? 'Try a different search term.' : 'Orders appear here after successful purchases.'}
        minWidth={860}
      />
    </div>
  );
}

export default AdminOrders;
