import { useMemo, useState } from 'react';
import { Loader2, Phone } from 'lucide-react';
import FormField from './FormField';
import {
  BTN_PRIMARY,
  CARD,
  CONSENT_TEXT,
  GENDERS,
  MARITAL,
  SECTION_TITLE,
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
    <form onSubmit={handleSubmit} className={`${CARD} flex flex-col gap-4 sm:gap-5`}>
      <div className="flex items-center gap-2 border-b border-site-accent-dark/10 pb-3 sm:pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-site-accent/15 text-site-accent-dark">
          <Phone size={16} />
        </span>
        <div>
          <h2 className={SECTION_TITLE}>Caller details</h2>
          <p className="font-body text-xs text-site-muted">Fill while on the live call</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <FormField label="Full name" value={form.name} onChange={set('name')} required className="sm:col-span-2" />
        <FormField
          label="Mobile number"
          value={form.mobile}
          onChange={set('mobile')}
          required
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit number"
        />
        <div>
          <FormField
            label="WhatsApp number"
            value={form.sameWhatsappAsMobile ? form.mobile : form.whatsapp}
            onChange={set('whatsapp')}
            required
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit number"
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 font-body text-xs text-site-muted">
            <input
              type="checkbox"
              checked={form.sameWhatsappAsMobile}
              onChange={set('sameWhatsappAsMobile')}
              className="h-4 w-4 rounded border-site-accent-dark/30 text-site-accent-dark"
            />
            Same as mobile
          </label>
        </div>
        <FormField label="Date of birth" type="date" value={form.dob} onChange={set('dob')} required />
        <FormField
          label="Age"
          value={age ? String(age) : ''}
          onChange={() => {}}
          readOnly
          placeholder="Auto from DOB"
        />
        <FormField
          label="Gender"
          as="select"
          value={form.gender}
          onChange={set('gender')}
          required
          options={GENDERS}
        />
        <FormField
          label="Marital status"
          as="select"
          value={form.maritalStatus}
          onChange={set('maritalStatus')}
          required
          options={MARITAL}
        />
        <div>
          <FormField
            label="Time of birth"
            type="time"
            value={form.tob}
            onChange={set('tob')}
            className={form.tobUnknown ? 'opacity-50' : ''}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 font-body text-xs text-site-muted">
            <input
              type="checkbox"
              checked={form.tobUnknown}
              onChange={set('tobUnknown')}
              className="h-4 w-4 rounded border-site-accent-dark/30 text-site-accent-dark"
            />
            Birth time unknown
          </label>
        </div>
        <FormField label="Place of birth" value={form.pob} onChange={set('pob')} required placeholder="City, state" className="sm:col-span-2" />
        <FormField
          label="Reason for calling"
          value={form.reasonForCalling}
          onChange={set('reasonForCalling')}
          required
          placeholder="Career, marriage, money…"
          className="sm:col-span-2"
        />
      </div>

      <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-3.5 sm:p-4">
        <p className="mb-3 font-body text-xs font-semibold leading-relaxed text-amber-950 sm:text-sm">
          {CONSENT_TEXT}
        </p>
        <label className="flex cursor-pointer items-start gap-2.5 font-body text-sm font-semibold text-site-primary">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={set('consent')}
            required
            className="mt-0.5 h-4 w-4 rounded border-site-accent-dark/30 text-site-accent-dark"
          />
          Caller agrees (tick before submit)
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={resetForm} className="font-body text-xs font-semibold text-site-muted underline-offset-2 hover:underline">
          Clear form
        </button>
        <button type="submit" disabled={submitting || !form.consent} className={BTN_PRIMARY}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
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
