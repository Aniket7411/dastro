import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Headphones, Info } from 'lucide-react';
import toast from '@/utils/toast';
import CounsellorShell from '../../components/free-consultation/CounsellorShell';
import CounsellorLeadHistory from '../../components/free-consultation/CounsellorLeadHistory';
import LeadCaptureForm from '../../components/free-consultation/LeadCaptureForm';
import ReadingPanel from '../../components/free-consultation/ReadingPanel';
import { DESK_WRAP, DESK_STRIP } from '../../components/free-consultation/tokens';
import {
  clearCounsellorSession,
  getCounsellorToken,
  getCounsellorUser,
  submitFreeConsultationLead,
} from '../../utils/freeConsultationApi';

export default function FreeConsultationDesk() {
  const navigate = useNavigate();
  const [counsellor, setCounsellor] = useState(() => getCounsellorUser());
  const [activeTab, setActiveTab] = useState('new');
  const [reading, setReading] = useState(null);
  const [lastLead, setLastLead] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    if (!getCounsellorToken()) {
      navigate('/counsellor/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    clearCounsellorSession();
    navigate('/counsellor/login', { replace: true });
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setReading(null);
    setLastLead(null);
    try {
      const data = await submitFreeConsultationLead(payload);
      const leadMeta = data.lead || {
        _id: data.leadId,
        name: payload.name,
        mobile: payload.mobile,
        dob: payload.dob,
        tob: payload.tob,
        tobUnknown: payload.tobUnknown,
        pob: payload.pob,
        age: payload.age,
        gender: payload.gender,
        reasonForCalling: payload.reasonForCalling,
        counsellorName: counsellor?.name,
        counsellorEmail: counsellor?.email,
        submittedAt: new Date().toISOString(),
      };
      setReading(data.reading);
      setLastLead(leadMeta);
      setUsedFallback(Boolean(data.usedFallback));
      setHistoryRefreshKey((k) => k + 1);
      toast.success(
        data.usedFallback
          ? 'Lead saved — view again anytime under Past calls'
          : 'Lead saved — AI reading ready · also in Past calls',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.status === 401) {
        clearCounsellorSession();
        navigate('/counsellor/login', { replace: true });
        return;
      }
      toast.error(err.message || 'Could not save lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CounsellorShell
      counsellorName={counsellor?.name}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className={`${DESK_WRAP} flex flex-col gap-2 sm:gap-2.5`}>
        {activeTab === 'new' ? (
          <>
            <div className={`${DESK_STRIP} flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3`}>
              <span className="inline-flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-wide text-[#000] sm:text-[11px]">
                <Headphones size={13} className="shrink-0" aria-hidden />
                Live call
              </span>
              <span className="hidden h-3 w-px bg-[#ccc] sm:block" aria-hidden />
              <p className="flex flex-wrap items-center gap-1 font-body text-xs font-semibold text-[#000] sm:text-[13px]">
                <span>Capture details</span>
                <ArrowRight size={12} className="shrink-0" aria-hidden />
                <span>Read preliminary</span>
                <ArrowRight size={12} className="shrink-0" aria-hidden />
                <span>Close on consultation</span>
              </p>
              <span className="hidden h-3 w-px bg-[#ccc] lg:block" aria-hidden />
              <p className="hidden items-center gap-1 font-body text-[11px] text-[#444] lg:inline-flex">
                <Info size={12} className="shrink-0" aria-hidden />
                Saved automatically under <strong className="mx-0.5">Past calls</strong> after submit
              </p>
            </div>

            {reading ? (
              <ReadingPanel reading={reading} usedFallback={usedFallback} lead={lastLead} />
            ) : null}

            <LeadCaptureForm onSubmit={handleSubmit} submitting={submitting} />
          </>
        ) : (
          <CounsellorLeadHistory
            refreshKey={historyRefreshKey}
            onAuthError={() => {
              clearCounsellorSession();
              navigate('/counsellor/login', { replace: true });
            }}
          />
        )}
      </div>
    </CounsellorShell>
  );
}
