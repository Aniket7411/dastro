import { useCallback, useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { adminExportNeoDove, adminListFreeConsultationLeads } from '../utils/freeConsultationApi';

function formatDt(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminFreeConsultationLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const token = localStorage.getItem('adminToken');

  const loadLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const data = await adminListFreeConsultationLeads(token, params.toString());
      setLeads(data.leads || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [token, search, startDate, endDate]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const blob = await adminExportNeoDove(token, params.toString());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neodove_free_consultation_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('NeoDove export downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="admin-leads-content">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h5 mb-1">Free consultation leads</h2>
          <p className="text-muted small mb-0">Social inbound funnel — export to NeoDove format</p>
        </div>
        <button
          type="button"
          className="btn btn-dark btn-sm"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export NeoDove (.xlsx)'}
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Search name or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control form-control-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control form-control-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={loadLeads}>
            Filter
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table leads-table w-100">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Reason</th>
              <th>Counsellor</th>
              <th>Reading</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">Loading…</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">No leads yet</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="small">{formatDt(lead.submittedAt || lead.createdAt)}</td>
                  <td>{lead.name}</td>
                  <td>{lead.mobile}</td>
                  <td className="small text-muted">{lead.reasonForCalling}</td>
                  <td className="small">{lead.counsellorName}</td>
                  <td>
                    <span className={`badge ${lead.reading?.source === 'ai' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {lead.reading?.source === 'ai' ? 'AI' : 'Template'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-muted small mt-3 mb-0">
        Counsellor desk: <a href="/counsellor/login" target="_blank" rel="noreferrer">{API_BASE ? `${window.location.origin}/counsellor/login` : '/counsellor/login'}</a>
      </p>
    </div>
  );
}
