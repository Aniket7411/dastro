import { useState } from 'react';
import { Download, FileText, Loader2, Printer } from 'lucide-react';
import toast from '@/utils/toast';
import { downloadReadingReport, openReadingReportPrint } from '../../utils/readingReport';

const LANG_BTNS = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'both', label: 'Both' },
];

export default function ReadingReportActions({ lead, reading, compact = false }) {
  const [downloading, setDownloading] = useState(null);

  if (!reading) return null;

  const handleDownload = async (lang) => {
    setDownloading(lang);
    try {
      const ok = await downloadReadingReport(lead, reading, lang);
      if (ok) toast.success(`PDF downloaded (${lang === 'both' ? 'EN + HI' : lang.toUpperCase()})`);
      else toast.error('Could not generate PDF — try Print instead');
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = (lang) => {
    const ok = openReadingReportPrint(lead, reading, lang);
    if (!ok) toast.error('Pop-up blocked — allow pop-ups or use Download PDF');
  };

  const btnClass = compact
    ? 'inline-flex items-center gap-1 rounded-md border border-[#000] bg-[#fff] px-2 py-1 font-body text-[10px] font-bold text-[#000] transition hover:bg-[#f5f5f5] disabled:opacity-60'
    : 'inline-flex items-center gap-1 rounded-md border border-[#000] bg-[#fff] px-2.5 py-1.5 font-body text-[11px] font-bold text-[#000] transition hover:bg-[#f5f5f5] disabled:opacity-60';

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {LANG_BTNS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleDownload(opt.id)}
            disabled={downloading !== null}
            className={btnClass}
            title={`Download ${opt.label} PDF`}
          >
            {downloading === opt.id ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#ccc] bg-[#fff] p-2.5 sm:flex-row sm:items-center sm:justify-between sm:p-3">
      <div className="flex items-center gap-2">
        <FileText size={14} className="shrink-0 text-[#000]" />
        <p className="font-body text-[11px] font-semibold text-[#444] sm:text-xs">
          Save &amp; share PDF report with caller
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {LANG_BTNS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleDownload(opt.id)}
            disabled={downloading !== null}
            className={btnClass}
          >
            {downloading === opt.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            PDF {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handlePrint('both')}
          disabled={downloading !== null}
          className="inline-flex items-center gap-1 rounded-md border border-[#000] bg-[#000] px-2.5 py-1.5 font-body text-[11px] font-bold text-[#fff] transition hover:bg-[#222] disabled:opacity-60"
        >
          <Printer size={12} />
          Print
        </button>
      </div>
    </div>
  );
}
