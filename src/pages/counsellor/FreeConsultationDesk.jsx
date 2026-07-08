import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from '@/utils/toast';
import CounsellorShell from '../../components/free-consultation/CounsellorShell';
import LeadCaptureForm from '../../components/free-consultation/LeadCaptureForm';
import ReadingPanel from '../../components/free-consultation/ReadingPanel';
import { WRAP } from '../../components/free-consultation/tokens';
import {
  clearCounsellorSession,
  getCounsellorToken,
  getCounsellorUser,
  submitFreeConsultationLead,
} from '../../utils/freeConsultationApi';

export default function FreeConsultationDesk() {
  const navigate = useNavigate();
  const [counsellor, setCounsellor] = useState(() => getCounsellorUser());
  const [reading, setReading] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    try {
      const data = await submitFreeConsultationLead(payload);
      setReading(data.reading);
      setUsedFallback(Boolean(data.usedFallback));
      toast.success(data.usedFallback ? 'Lead saved — template reading ready' : 'Lead saved — AI reading ready');
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
    <CounsellorShell counsellorName={counsellor?.name} onLogout={handleLogout}>
      <div className={`${WRAP} flex flex-col gap-5 py-5 sm:gap-6 sm:py-6 lg:py-8`}>
        <div className="rounded-xl border border-site-accent-dark/10 bg-gradient-to-br from-[#1e0c02] to-site-accent-dark px-4 py-4 text-white sm:px-5 sm:py-5">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.14em] text-[#f5c98d]">
            Live call workflow
          </p>
          <h1 className="mt-1 font-body text-lg font-extrabold sm:text-xl">
            Capture details → read preliminary reading → close on full consultation
          </h1>
          <p className="mt-2 font-body text-xs leading-relaxed text-white/80 sm:text-sm">
            Introduce yourself as Damini ma&apos;am&apos;s consultation team. Read the consent line before submit.
          </p>
        </div>

        {reading ? (
          <ReadingPanel reading={reading} usedFallback={usedFallback} />
        ) : null}

        <LeadCaptureForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </CounsellorShell>
  );
}
