import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let url = `${API_BASE}/api/newsletter?_t=${Date.now()}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      } else {
        toast.error(data.message || 'Failed to fetch subscribers');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Subscribed' ? 'Unsubscribed' : 'Subscribed';
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/newsletter/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        setSubscribers(prev => prev.map(s => s._id === id ? { ...s, status: newStatus } : s));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/newsletter/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Subscriber removed');
        fetchSubscribers();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('');
    fetchSubscribers();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Email copied to clipboard');
  };

  return (
    <div className="admin-leads-content">
      {/* Search & Filters Row */}
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex flex-column flex-xl-row justify-content-between gap-3">
          {/* Search Bar */}
          <div className="search-bar flex-grow-1" style={{ maxWidth: '400px', background: 'var(--surface)' }}>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search by email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select border-0 shadow-sm text-dark bg-white"
              style={{ height: '42px', fontSize: '13px', borderRadius: '10px', minWidth: '150px' }}
            >
              <option value="">All Statuses</option>
              <option value="Subscribed">Subscribed</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>

            <button onClick={handleRefresh} className="topbar-icon-btn" title="Reset & Refresh" style={{ height: '42px', width: '42px' }}>
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-table-shell" style={{ minHeight: '400px' }}>
        <div className="admin-table-shell__bar">
          <div>
            <div className="admin-table-shell__title">Subscriber List</div>
            <div className="admin-table-shell__subtitle">Newsletter sign-ups and subscription status</div>
          </div>
          {!isLoading && (
            <div className="admin-table-shell__count">
              <strong>{filteredSubscribers.length}</strong>
              <span>subscriber{filteredSubscribers.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="admin-table-scroll">
        <table className="admin-table leads-table w-100">
          <thead>
            <tr>
              <th>Date Subscribed</th>
              <th>Email Address</th>
              <th>Status</th>
              <th className="text-end px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4">
                  <div className="dash-loading py-5">
                    <div className="dash-spin"></div>
                    <span className="ms-2">Fetching subscribers...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-envelope-open fa-3x mb-3 opacity-25"></i>
                    <p>No subscribers found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    <div className="td-value">{new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}</div>
                    <div className="td-muted small">{new Date(sub.subscribedAt || sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="td-value">{sub.email}</span>
                      <button 
                        onClick={() => copyToClipboard(sub.email)}
                        className="btn btn-link p-0 text-muted hover-primary"
                        title="Copy email"
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <i className="far fa-copy text-xs"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${sub.status === 'Subscribed' ? 'tag--green' : 'tag--rose'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <div className="d-flex justify-content-end gap-2">
                      <button 
                        className="topbar-icon-btn" 
                        title={sub.status === 'Subscribed' ? 'Unsubscribe' : 'Subscribe'}
                        onClick={() => handleStatusChange(sub._id, sub.status)}
                        style={{ height: '36px', width: '36px' }}
                      >
                        <i className={`fas ${sub.status === 'Subscribed' ? 'fa-user-slash text-warning' : 'fa-user-plus text-success'}`}></i>
                      </button>
                      <button 
                        className="topbar-icon-btn text-danger" 
                        title="Delete subscriber"
                        onClick={() => handleDelete(sub._id)}
                        style={{ height: '36px', width: '36px' }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        {!isLoading && filteredSubscribers.length > 0 && (
          <div className="admin-table-footer">
            <span>
              Showing <strong>{filteredSubscribers.length}</strong> subscriber{filteredSubscribers.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNewsletter;
