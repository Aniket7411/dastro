import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, CheckCircle2, XCircle } from 'lucide-react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

const defaultCoupon = {
  code: '',
  discountType: 'percentage',
  discountValue: '10',
  minPurchase: '0',
  usageLimit: '0',
  active: true
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultCoupon);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      } else {
        toast.error(data.message || 'Unable to load coupons');
      }
    } catch (err) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultCoupon);
  };

  const handleNewCoupon = () => {
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/api/coupons/${editingId}` : `${API_BASE}/api/coupons`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Coupon updated' : 'Coupon saved');
        resetForm();
        fetchCoupons();
      } else {
        toast.error(data.message || 'Unable to save coupon');
      }
    } catch (err) {
      toast.error('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue?.toString() || '10',
      minPurchase: coupon.minPurchase?.toString() || '0',
      usageLimit: coupon.usageLimit?.toString() || '0',
      active: coupon.active ?? true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Delete request failed.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-coupons-section"
    >
      <div className="coupons-header">
        <div>
          <h2>Coupon Management</h2>
          <p>Create and manage discount codes for recorded courses and offers. Set minimum purchase rules and active status.</p>
        </div>
        <button type="button" className="coupon-action-btn" onClick={handleNewCoupon}>
          <Plus size={18} />
          <span>Add New Coupon</span>
        </button>
      </div>

      <div className="coupons-grid">
        <motion.div
          layout
          className="coupon-form-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="coupon-form-row">
              <label>Coupon Code</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="E.g. DSASTRO30"
                required
              />
            </div>

            <div className="coupon-form-row two-col">
              <div>
                <label>Discount Type</label>
                <select name="discountType" value={form.discountType} onChange={handleChange}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label>Discount Value</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  name="discountValue"
                  value={form.discountValue}
                  onChange={handleChange}
                  onBlur={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) handleChange({ target: { name: 'discountValue', value: String(Math.round(v * 100) / 100) } });
                  }}
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <div className="coupon-form-row two-col">
              <div>
                <label>Min. Purchase <span className="optional-label">(optional)</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="^[0-9]*$"
                  name="minPurchase"
                  value={form.minPurchase}
                  onChange={handleChange}
                  onBlur={e => {
                    const v = parseInt(e.target.value, 10);
                    handleChange({ target: { name: 'minPurchase', value: isNaN(v) ? '0' : String(v) } });
                  }}
                  placeholder="0"
                />
              </div>
              <div>
                <label>Usage Limit <span className="optional-label">(optional)</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="^[0-9]*$"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  onBlur={e => {
                    const v = parseInt(e.target.value, 10);
                    handleChange({ target: { name: 'usageLimit', value: isNaN(v) ? '0' : String(v) } });
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="coupon-form-row coupon-active-row">
              <label className="active-switch">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                <span>Coupon active</span>
              </label>
            </div>

            <div className="coupon-form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          layout
          className="coupon-list-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="coupon-list-header">
            <h3>Saved Coupons</h3>
            <span>{coupons.length} coupon{coupons.length === 1 ? '' : 's'}</span>
          </div>

          {loading ? (
            <div className="coupon-table-empty">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="coupon-table-empty">No coupons available. Add one to start offering discounts.</div>
          ) : (
            <div className="coupon-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>{coupon.code}</td>
                      <td>{coupon.discountType === 'fixed' ? `Rs.${coupon.discountValue}` : `${coupon.discountValue}%`}</td>
                      <td>{coupon.minPurchase ? `Rs.${coupon.minPurchase}` : 'None'}</td>
                      <td>
                        <span className={`status-pill ${coupon.active ? 'active' : 'disabled'}`}>
                          {coupon.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button className="icon-btn" onClick={() => handleEdit(coupon)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDelete(coupon._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .admin-coupons-section {
          padding: 24px;
        }
        .coupons-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
          margin-bottom: 28px;
        }
        .coupons-header h2 {
          font-size: clamp(2rem, 2.5vw, 2.6rem);
          margin-bottom: 10px;
          line-height: 1.1;
        }
        .coupons-header p {
          max-width: 700px;
          color: #5c4a2d;
          line-height: 1.8;
          opacity: 0.95;
          font-size: 1rem;
        }
        .coupon-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #c8832a;
          border: 1px solid rgba(200, 131, 42, 0.35);
          color: #fff;
          font-weight: 700;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          box-shadow: 0 12px 20px rgba(200, 131, 42, 0.18);
        }
        .coupon-action-btn:hover {
          background: #b06d1e;
          transform: translateY(-1px);
          box-shadow: 0 16px 25px rgba(200, 131, 42, 0.22);
        }
        .coupon-action-btn:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.45);
          outline-offset: 2px;
        }
        .coupons-grid {
          display: grid;
          grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
          gap: 32px;
        }
        .coupon-form-card,
        .coupon-list-card {
          background: #fff;
          border-radius: 28px;
          border: 1px solid rgba(139, 74, 30, 0.08);
          box-shadow: 0 20px 45px rgba(96, 64, 23, 0.08);
          padding: 32px;
        }
        .coupon-form-row {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .coupon-form-row.two-col {
          grid-template-columns: 1fr 1fr;
          display: grid;
          gap: 20px;
        }
        label {
          font-size: 1rem;
          color: #4d3622;
          font-weight: 700;
        }
        input,
        select {
          width: 100%;
          border: 1px solid rgba(139, 74, 30, 0.16);
          border-radius: 14px;
          padding: 16px 18px;
          background: #fff;
          font-size: 1rem;
          color: #2a1b0f;
        }
        select {
          appearance: none;
        }
        .active-switch {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #5c4a2d;
          font-weight: 700;
        }
        .active-switch input {
          width: 18px;
          height: 18px;
          accent-color: #c8832a;
        }
        .coupon-form-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .btn-primary,
        .btn-secondary {
          border: none;
          border-radius: 16px;
          padding: 16px 24px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary {
          background: #c8832a;
          color: #fff;
          box-shadow: 0 18px 35px rgba(200, 131, 42, 0.18);
        }
        .btn-secondary {
          background: #f8f2e7;
          color: #6b4b2a;
          border: 1px solid rgba(139, 74, 30, 0.12);
        }
        .btn-primary:hover,
        .btn-secondary:hover {
          transform: translateY(-1px);
        }
        .coupon-list-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          margin-bottom: 18px;
        }
        .coupon-list-header h3 {
          margin: 0;
          font-size: 1.4rem;
        }
        .coupon-list-header span {
          color: #7a4b1f;
          font-weight: 700;
          background: rgba(200, 131, 42, 0.12);
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 0.95rem;
        }
        .coupon-table-wrap {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 620px;
        }
        th,
        td {
          padding: 18px 14px;
          text-align: left;
          font-size: 1rem;
          color: #4b3a28;
          border-bottom: 1px solid rgba(139, 74, 30, 0.08);
        }
        th {
          color: #7a4b1f;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
        }
        .status-pill.active {
          background: rgba(45, 175, 95, 0.12);
          color: #2d6a3f;
        }
        .status-pill.disabled {
          background: rgba(133, 98, 56, 0.12);
          color: #7a4b1f;
        }
        .action-cell {
          text-align: right;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(139, 74, 30, 0.14);
          background: #fff;
          color: #6b4b2a;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .icon-btn:hover {
          background: #f8f2e7;
          transform: translateY(-1px);
        }
        .icon-btn.delete {
          border-color: rgba(231, 76, 60, 0.18);
          color: #c0392b;
        }
        .coupon-table-empty {
          padding: 40px 0;
          text-align: center;
          color: #7a5d44;
          font-size: 0.97rem;
          opacity: 0.9;
        }

        @media (max-width: 980px) {
          .coupons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default AdminCoupons;
