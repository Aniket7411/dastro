import { useMemo, useState } from 'react';
import { Loader2, Phone, RotateCcw } from 'lucide-react';
import FormField from './FormField';
import {
  BTN_PRIMARY,
  CONSENT_TEXT,
  DESK_CARD,
  DESK_INNER,
  DESK_MUTED,
  DESK_SECTION_TITLE,
  GENDERS,
  MARITAL,
} from './tokens';

const INITIAL = {
  name: '',
  mobile: '',
  whatsapp: '',
  sameWhatsappAsMobile: true,
  gender: 'Male',
  dob: '',
  tob: '',
  tobUnknown: false,
  pob: '',
  maritalStatus: 'Single',
  reasonForCalling: '',
  consent: false,
};

function calcAge(dob) {
  if (!dob) return '';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

export default function LeadCaptureForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(INITIAL);

  const age = useMemo(() => calcAge(form.dob), [form.dob]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'mobile' && prev.sameWhatsappAsMobile) {
        next.whatsapp = value;
      }
      if (field === 'sameWhatsappAsMobile' && value) {
        next.whatsapp = prev.mobile;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) return;

    onSubmit({
      ...form,
      mobile: form.mobile.replace(/\D/g, '').slice(-10),
      whatsapp: (form.sameWhatsappAsMobile ? form.mobile : form.whatsapp).replace(/\D/g, '').slice(-10),
      age: age ? Number(age) : undefined,
      tob: form.tobUnknown ? '' : form.tob,
    });
  };

  const resetForm = () => setForm(INITIAL);

  return (
    <form onSubmit={handleSubmit} className={`${DESK_CARD} flex flex-col gap-2.5 sm:gap-3`}>
      <div className="flex items-center justify-between gap-2 border-b border-[#ccc] pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#000] bg-[#fff] text-[#000]">
            <Phone size={14} />
          </span>
          <div className="leading-tight">
            <h2 className={DESK_SECTION_TITLE}>Caller details</h2>
            <p className={`font-body text-[10px] sm:text-[11px] ${DESK_MUTED}`}>Fill while on the live call</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className={`inline-flex items-center gap-1 font-body text-[11px] font-semibold transition hover:text-[#000] ${DESK_MUTED}`}
        >
          <RotateCcw size={12} />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 lg:gap-3">
        <FormField
          compact
          label="Full name"
          value={form.name}
          onChange={set('name')}
          required
          className="sm:col-span-2 lg:col-span-3"
        />
        <FormField
          compact
          label="Mobile number"
          value={form.mobile}
          onChange={set('mobile')}
          required
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit"
        />
        <div>
          <FormField
            compact
            label="WhatsApp number"
            value={form.sameWhatsappAsMobile ? form.mobile : form.whatsapp}
            onChange={set('whatsapp')}
            required
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit"
          />
          <label className={`mt-0.5 flex cursor-pointer items-center gap-1.5 font-body text-[10px] sm:text-[11px] ${DESK_MUTED}`}>
            <input
              type="checkbox"
              checked={form.sameWhatsappAsMobile}
              onChange={set('sameWhatsappAsMobile')}
              className="h-3.5 w-3.5 rounded border-[#000] text-[#000]"
            />
            Same as mobile
          </label>
        </div>
        <FormField compact label="Date of birth" type="date" value={form.dob} onChange={set('dob')} required />
        <FormField
          compact
          label="Age"
          value={age ? String(age) : ''}
          onChange={() => {}}
          readOnly
          placeholder="Auto"
        />
        <FormField
          compact
          label="Gender"
          as="select"
          value={form.gender}
          onChange={set('gender')}
          required
          options={GENDERS}
        />
        <FormField
          compact
          label="Marital status"
          as="select"
          value={form.maritalStatus}
          onChange={set('maritalStatus')}
          required
          options={MARITAL}
        />
        <div>
          <FormField
            compact
            label="Time of birth"
            type="time"
            value={form.tob}
            onChange={set('tob')}
            className={form.tobUnknown ? 'opacity-50' : ''}
          />
          <label className={`mt-0.5 flex cursor-pointer items-center gap-1.5 font-body text-[10px] sm:text-[11px] ${DESK_MUTED}`}>
            <input
              type="checkbox"
              checked={form.tobUnknown}
              onChange={set('tobUnknown')}
              className="h-3.5 w-3.5 rounded border-[#000] text-[#000]"
            />
            Birth time unknown
          </label>
        </div>
        <FormField
          compact
          label="Place of birth"
          value={form.pob}
          onChange={set('pob')}
          required
          placeholder="City, state"
          className="sm:col-span-2 lg:col-span-1"
        />
        <FormField
          compact
          label="Reason for calling"
          value={form.reasonForCalling}
          onChange={set('reasonForCalling')}
          required
          placeholder="Career, marriage, money…"
          className="sm:col-span-2 lg:col-span-3"
        />
      </div>

      <div className={`${DESK_INNER} px-2.5 py-2 sm:px-3`}>
        <p className="mb-1.5 font-['IBM_Plex_Sans_Devanagari',sans-serif] text-[11px] font-medium leading-snug text-[#000] sm:text-xs">
          {CONSENT_TEXT}
        </p>
        <label className="flex cursor-pointer items-center gap-2 font-body text-xs font-semibold text-[#000]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={set('consent')}
            required
            className="h-3.5 w-3.5 rounded border-[#000] text-[#000]"
          />
          Caller agrees
        </label>
      </div>

      <div className="flex justify-end pt-0.5">
        <button
          type="submit"
          disabled={submitting || !form.consent}
          className={`${BTN_PRIMARY} !min-h-9 !w-full !text-xs sm:!w-auto sm:!text-sm`}
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating reading…
            </>
          ) : (
            'Save lead & generate reading'
          )}
        </button>
      </div>
    </form>
  );
}
