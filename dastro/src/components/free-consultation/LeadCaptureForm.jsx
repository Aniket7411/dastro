import { useMemo, useState } from 'react';
import { Loader2, Phone, RotateCcw } from 'lucide-react';
import toast from '../../utils/toast';
import { getAgeFromDob } from '../../utils/ageFromDob';
import { getFreeConsultationLeadValidationError } from '../../utils/validation';
import FormField from './FormField';
import DeskPlaceAutocomplete from './DeskPlaceAutocomplete';
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
  pob: '',
  pobLat: null,
  pobLon: null,
  maritalStatus: 'Single',
  reasonForCalling: '',
  consent: false,
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function minDobIso() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 120);
  return d.toISOString().slice(0, 10);
}

export default function LeadCaptureForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(INITIAL);
  const maxDob = todayIso();
  const minDob = minDobIso();

  const ageInfo = useMemo(() => getAgeFromDob(form.dob), [form.dob]);

  const validationError = useMemo(
    () => getFreeConsultationLeadValidationError({
      ...form,
      ageValid: ageInfo.valid,
    }),
    [form, ageInfo.valid],
  );

  const canSubmit = !validationError && form.consent && !submitting;

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
    if (!form.consent) {
      toast.error('Caller consent is required before generating a reading.');
      return;
    }
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onSubmit({
      ...form,
      mobile: form.mobile.replace(/\D/g, '').slice(-10),
      whatsapp: (form.sameWhatsappAsMobile ? form.mobile : form.whatsapp).replace(/\D/g, '').slice(-10),
      age: ageInfo.years,
      ageMonths: ageInfo.years === 0 ? ageInfo.months : undefined,
      ageDisplay: ageInfo.display,
      tob: form.tob,
      tobUnknown: false,
      pobLat: form.pobLat ?? undefined,
      pobLon: form.pobLon ?? undefined,
    });
  };

  const resetForm = () => setForm(INITIAL);

  const dobInvalid = Boolean(form.dob && !ageInfo.valid);

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
        <p className={`font-body text-[10px] font-bold uppercase tracking-wide sm:col-span-2 lg:col-span-3 ${DESK_MUTED}`}>
          Birth details for reading
        </p>
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
          label="Date of birth"
          type="date"
          value={form.dob}
          onChange={set('dob')}
          required
          min={minDob}
          max={maxDob}
        />
        <FormField
          compact
          label="Gender"
          as="select"
          value={form.gender}
          onChange={set('gender')}
          options={GENDERS}
        />
        <FormField
          compact
          label="Time of birth"
          type="time"
          value={form.tob}
          onChange={set('tob')}
          required
        />
        <DeskPlaceAutocomplete
          label="Place of birth"
          value={form.pob}
          onChange={(pob) => setForm((prev) => ({ ...prev, pob }))}
          onSelectCoords={(coords) => setForm((prev) => ({
            ...prev,
            pobLat: coords?.lat ?? null,
            pobLon: coords?.lon ?? null,
          }))}
          required
          className="sm:col-span-2 lg:col-span-2"
        />
        <div>
          <FormField
            compact
            label="Age"
            as="display"
            value={ageInfo.valid ? ageInfo.display : ''}
            placeholder={form.dob ? 'Invalid DOB' : 'From DOB'}
          />
          <p className={`mt-0.5 font-body text-[10px] ${DESK_MUTED}`}>
            Auto from DOB · babies show in months
          </p>
        </div>

        <p className={`mt-1 font-body text-[10px] font-bold uppercase tracking-wide sm:col-span-2 lg:col-span-3 ${DESK_MUTED}`}>
          Contact &amp; lead details
        </p>
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
            readOnly={form.sameWhatsappAsMobile}
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
        <FormField
          compact
          label="Marital status"
          as="select"
          value={form.maritalStatus}
          onChange={set('maritalStatus')}
          options={MARITAL}
        />
        <FormField
          compact
          label="Reason for calling"
          value={form.reasonForCalling}
          onChange={set('reasonForCalling')}
          placeholder="Career, marriage, money…"
          className="sm:col-span-2 lg:col-span-2"
        />
      </div>

      {dobInvalid ? (
        <p className="font-body text-[11px] font-semibold text-[#b00000]">
          Date of birth cannot be in the future.
        </p>
      ) : null}

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
          disabled={!canSubmit}
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
