import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  History,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';
import toast from '../../utils/toast';
import { formatLeadAge } from '../../utils/ageFromDob';
import ReadingPanel from './ReadingPanel';
import { counsellorListLeads } from '../../utils/freeConsultationApi';
import { formatRashiLabel, getRashiHi } from '../../utils/rashi';
import {
  DESK_CARD,
  DESK_INNER,
  DESK_MUTED,
  DESK_SECTION_TITLE,
} from './tokens';

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

function leadToReportMeta(lead) {
  return {
    name: lead.name,
    mobile: lead.mobile,
    dob: lead.dob,
    age: lead.age,
    ageMonths: lead.ageMonths,
    ageDisplay: lead.ageDisplay,
    gender: lead.gender,
    reasonForCalling: lead.reasonForCalling,
    counsellorName: lead.counsellorName,
    counsellorEmail: lead.counsellorEmail,
    submittedAt: lead.submittedAt || lead.createdAt,
  };
}

function HelpPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${DESK_INNER} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="inline-flex items-center gap-2 font-body text-xs font-bold text-[#000]">
          <HelpCircle size={14} />
          How to use past calls
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open ? (
        <ul className="border-t border-[#ccc] px-3 py-2 font-body text-[11px] leading-relaxed text-[#444] sm:text-xs">
          <li className="mb-1.5"><strong className="text-[#000]">View</strong> — reopen the preliminary reading you gave on that call.</li>
          <li className="mb-1.5"><strong className="text-[#000]">Download PDF</strong> — save English, Hindi, or both; share directly on WhatsApp.</li>
          <li className="mb-1.5"><strong className="text-[#000]">Search</strong> — find a caller by name or mobile number.</li>
          <li><strong className="text-[#000]">Only your calls</strong> — you see leads you submitted; admin sees all leads.</li>
        </ul>
      ) : null}
    </div>
  );
}

export default function CounsellorLeadHistory({ refreshKey = 0, onAuthError }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      params.set('limit', '100');
      const data = await counsellorListLeads(params.toString());
      setLeads(data.leads || []);
    } catch (err) {
      if (err.status === 401) {
        onAuthError?.();
        return;
      }
      toast.error(err.message || 'Could not load past calls');
    } finally {
      setLoading(false);
    }
  }, [search, onAuthError]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads, refreshKey]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      <div className={`${DESK_CARD} flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#000] bg-[#fafafa]">
            <History size={14} />
          </span>
          <div>
            <h2 className={DESK_SECTION_TITLE}>Past calls &amp; reports</h2>
            <p className={`font-body text-[10px] sm:text-[11px] ${DESK_MUTED}`}>
              {loading ? 'Loading…' : `${leads.length} call${leads.length === 1 ? '' : 's'} on record`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadLeads}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-md border border-[#000] bg-[#fff] px-2.5 py-1.5 font-body text-[11px] font-bold text-[#000] hover:bg-[#f5f5f5] disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <HelpPanel />

      <div className={`${DESK_CARD} flex flex-col gap-2`}>
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            type="search"
            placeholder="Search name or mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#000] bg-[#fff] py-2 pl-8 pr-3 font-body text-sm text-[#000] outline-none focus:ring-1 focus:ring-[#000]"
          />
        </div>
        <button
          type="button"
          onClick={loadLeads}
          className="self-start font-body text-[11px] font-bold text-[#000] underline-offset-2 hover:underline"
        >
          Apply search
        </button>
      </div>

      {loading && leads.length === 0 ? (
        <div className={`${DESK_CARD} flex items-center justify-center gap-2 py-10 ${DESK_MUTED}`}>
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading your calls…</span>
        </div>
      ) : leads.length === 0 ? (
        <div className={`${DESK_CARD} py-10 text-center`}>
          <p className="font-body text-sm font-semibold text-[#000]">No past calls yet</p>
          <p className={`mt-1 font-body text-xs ${DESK_MUTED}`}>
            After you submit a caller from the New call tab, it will appear here with the reading and download options.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {leads.map((lead) => {
            const id = lead._id;
            const isOpen = expandedId === id;
            const reading = lead.reading;
            const rashiLabel = formatRashiLabel(reading?.sunSign, reading?.rashiHi || getRashiHi(reading?.sunSign));

            return (
              <li key={id} className={`${DESK_CARD} !p-0 overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => toggleExpand(id)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-[#fafafa] sm:px-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-bold text-[#000]">{lead.name}</p>
                    <p className={`font-body text-[11px] ${DESK_MUTED}`}>
                      {lead.mobile} · {formatDt(lead.submittedAt || lead.createdAt)}
                    </p>
                    {lead.reasonForCalling ? (
                      <p className="mt-0.5 truncate font-body text-[10px] text-[#666]">{lead.reasonForCalling}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    {rashiLabel !== '—' ? (
                      <span className="rounded border border-[#ccc] bg-[#fafafa] px-1.5 py-0.5 font-body text-[9px] font-bold text-[#444]">
                        {rashiLabel}
                      </span>
                    ) : null}
                    <span className={`rounded px-1.5 py-0.5 font-body text-[9px] font-bold ${
                      reading?.source === 'ai' ? 'border border-[#000] bg-[#000] text-[#fff]' : 'border border-[#ccc] bg-[#fafafa] text-[#444]'
                    }`}
                    >
                      {reading?.source === 'ai' ? 'AI' : 'Template'}
                    </span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isOpen && reading ? (
                  <div className="border-t border-[#ccc] bg-[#fafafa] p-2 sm:p-3">
                    <ReadingPanel
                      reading={reading}
                      usedFallback={reading.source !== 'ai'}
                      lead={leadToReportMeta(lead)}
                    />
                  </div>
                ) : isOpen ? (
                  <p className={`border-t border-[#ccc] px-3 py-4 text-center text-xs ${DESK_MUTED}`}>
                    No reading saved for this call.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
