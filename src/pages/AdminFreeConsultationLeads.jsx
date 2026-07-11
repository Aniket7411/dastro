import { useCallback, useEffect, useState } from 'react';
import { Eye, FileSpreadsheet, RefreshCw, X } from 'lucide-react';
import toast from '../utils/toast';
import { formatLeadAge } from '../utils/ageFromDob';
import ReadingPanel from '../components/free-consultation/ReadingPanel';
import ReadingReportActions from '../components/free-consultation/ReadingReportActions';
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

function ReadingModal({ lead, onClose }) {
  if (!lead) return null;
  const reading = lead.reading;
  const usedFallback = reading?.source !== 'ai';

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-[#f5efe6] shadow-2xl sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[#d4c4b0] bg-white px-4 py-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
            <p className="text-xs text-slate-500">
              {lead.mobile} · {formatDt(lead.submittedAt || lead.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {reading ? (
            <>
              <ReadingPanel reading={reading} usedFallback={usedFallback} lead={lead} />
              <div className="mt-3 rounded-xl border border-[#c9b89a] bg-white p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Caller details</p>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-700">
                  <div><dt className="text-slate-400">DOB</dt><dd className="font-medium">{lead.dob || '—'}</dd></div>
                  <div><dt className="text-slate-400">Age</dt><dd className="font-medium">{formatLeadAge(lead)}</dd></div>
                  <div><dt className="text-slate-400">Gender</dt><dd className="font-medium">{lead.gender || '—'}</dd></div>
                  <div><dt className="text-slate-400">Counsellor</dt><dd className="font-medium">{lead.counsellorName || '—'}</dd></div>
                  <div><dt className="text-slate-400">Counsellor email</dt><dd className="font-medium">{lead.counsellorEmail || '—'}</dd></div>
                  <div><dt className="text-slate-400">Contact time</dt><dd className="font-medium">{formatDt(lead.submittedAt || lead.createdAt)}</dd></div>
                  <div className="col-span-2"><dt className="text-slate-400">Reason</dt><dd className="font-medium">{lead.reasonForCalling || '—'}</dd></div>
                </dl>
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">No reading stored for this lead.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminFreeConsultationLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewLead, setViewLead] = useState(null);

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

  const hasBilingual = (reading) => Boolean(
    reading?.natureHi || reading?.currentPhaseHi || reading?.fullChartRevealHi,
  );

  return (
    <div className="admin-leads-content">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="mb-1 text-lg font-bold text-slate-900">Free consultation leads</h2>
          <p className="mb-0 text-sm text-slate-500">
            Readings stored in English &amp; Hindi — view or download to share with caller
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2a1a0e] px-3 py-2 text-xs font-bold text-white hover:bg-[#1a1209] disabled:opacity-60"
          >
            <FileSpreadsheet size={14} />
            {exporting ? 'Exporting…' : 'NeoDove (.xlsx)'}
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-12">
        <input
          type="search"
          className="col-span-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 sm:col-span-5"
          placeholder="Search name or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="col-span-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-3"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="col-span-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-3"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          type="button"
          className="col-span-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:col-span-1"
          onClick={loadLeads}
        >
          Filter
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Submitted</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Mobile</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Reason</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Counsellor</th>
                <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Reading</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-slate-400">Loading…</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-slate-400">No leads yet</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-slate-50 hover:bg-amber-50/30">
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500">
                      {formatDt(lead.submittedAt || lead.createdAt)}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{lead.name}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-700">{lead.mobile}</td>
                    <td className="max-w-[140px] truncate px-3 py-2.5 text-xs text-slate-500" title={lead.reasonForCalling}>
                      {lead.reasonForCalling}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600">{lead.counsellorName}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          lead.reading?.source === 'ai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                        >
                          {lead.reading?.source === 'ai' ? 'AI' : 'Template'}
                        </span>
                        {hasBilingual(lead.reading) ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            EN + HI
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewLead(lead)}
                          disabled={!lead.reading}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                          title="View reading"
                        >
                          <Eye size={12} />
                          View
                        </button>
                        {lead.reading ? (
                          <ReadingReportActions lead={lead} reading={lead.reading} compact />
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 mb-0 text-xs text-slate-500">
        Counsellor desk:{' '}
        <a href="/counsellor/login" target="_blank" rel="noreferrer" className="font-semibold text-amber-800 hover:underline">
          {typeof window !== 'undefined' ? `${window.location.origin}/counsellor/login` : '/counsellor/login'}
        </a>
        {' · '}
        Download reports as PDF (English, Hindi, or both) — includes contact time and counsellor details.
      </p>

      {viewLead ? <ReadingModal lead={viewLead} onClose={() => setViewLead(null)} /> : null}
    </div>
  );
}
