import React, { useState, useEffect } from 'react';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';

function AdminConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/admin/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (err) {
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/admin/consultations/${id}`, {
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
        fetchConsultations(); // refresh list
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="lf-spinner"></div></div>;

  return (
    <div className="dash-home">
      <div className="mb-4">
        <h2 className="dash-section-title mb-1">Consultation Requests</h2>
        <p className="text-muted small">Paid bookings, callback requests, and complimentary student consultations.</p>
      </div>

      <div className="admin-table-shell">
        <div className="admin-table-shell__bar">
          <div>
            <div className="admin-table-shell__title">Consultation Queue</div>
            <div className="admin-table-shell__subtitle">Complimentary sessions requested by students</div>
          </div>
          <div className="admin-table-shell__count">
            <strong>{consultations.length}</strong>
            <span>request{consultations.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="admin-table-scroll">
        <table className="admin-table leads-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Mobile</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No consultation requests found.</td>
              </tr>
            ) : (
              consultations.map(consult => (
                <tr key={consult._id}>
                  <td>
                    <div className="fw-bold" style={{ color: '#2A0F02' }}>{consult.studentName || consult.name}</div>
                    <div className="small text-muted">{consult.email}</div>
                    {consult.source === 'lead' && (
                      <span className="badge bg-info text-dark mt-1">Paid Booking Lead</span>
                    )}
                  </td>
                  <td>
                    <div>{consult.consultationType || 'Consultation'}</div>
                    {consult.courseName && (
                      <div className="small text-muted">Course: {consult.courseName}</div>
                    )}
                  </td>
                  <td>{consult.mobile}</td>
                  <td>
                    <span className={`status-badge ${consult.paymentStatus === 'PAID' ? 'status-contacted' : 'status-new'}`}>
                      {consult.paymentStatus || 'NOT REQUIRED'}
                    </span>
                    {consult.amount ? <div className="small text-muted">₹{consult.amount}</div> : null}
                  </td>
                  <td>{consult.preferredDatetime ? new Date(consult.preferredDatetime).toLocaleString() : new Date(consult.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${String(consult.status).toLowerCase().includes('paid') ? 'status-contacted' : 'status-new'}`}>
                      {consult.status}
                    </span>
                  </td>
                  <td>
                    {consult.source === 'student' ? (
                      <select 
                        className="form-select form-select-sm" 
                        value={consult.status?.toLowerCase?.() || consult.status}
                        onChange={(e) => handleStatusChange(consult._id, e.target.value)}
                        style={{ width: '120px', borderRadius: '8px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="small text-muted">Manage in Leads</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        {consultations.length > 0 && (
          <div className="admin-table-footer">
            <span>Showing <strong>{consultations.length}</strong> consultation request{consultations.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminConsultations;
