import { useState } from 'react';
import { X, Phone, Lock, CreditCard, Loader2 } from 'lucide-react';
import { BOOKING_MODES } from '../utils/consultationBooking';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';
import { BTN } from './consultation/tokens';
import {
  MODAL_TITLE,
  MODAL_HINT,
  MODAL_LABEL,
  MODAL_SIDEBAR_TITLE,
  MODAL_SIDEBAR_BODY,
  MODAL_INPUT,
  MODAL_INPUT_ERROR,
} from './modal/modalTypography';

const REQ = <span className="font-normal text-red-500" aria-hidden="true"> *</span>;

function FieldLabel({ htmlFor, required, optional, children }) {
  return (
    <label htmlFor={htmlFor} className={MODAL_LABEL}>
      {children}
      {required ? REQ : null}
      {optional ? <span className="font-normal text-site-soft"> (optional)</span> : null}
    </label>
  );
}

function fieldClass(hasError) {
  return hasError ? `${MODAL_INPUT} ${MODAL_INPUT_ERROR}` : MODAL_INPUT;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-0.5 font-body text-xs leading-snug text-red-500">{message}</p>;
}

function validate(data, isFixedService) {
  const e = {};
  if (!data.name.trim()) e.name = 'Full name is required';
  else if (data.name.trim().length < 2) e.name = 'Enter a valid name';

  const ph = data.phone.replace(/[\s-]/g, '');
  if (!ph) e.phone = 'Phone number is required';
  else if (!/^\d{10}$/.test(ph)) e.phone = 'Enter a valid 10-digit number';

  if (!data.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email';

  if (!data.dob) e.dob = 'Date of birth is required';
  if (!data.tob) e.tob = 'Time of birth is required';
  if (!data.pob?.trim()) e.pob = 'Place of birth is required';

  if (!isFixedService && !data.consultationType?.trim()) {
    e.consultationType = 'Please specify consultation type';
  }

  return e;
}

function ConsultationModal({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  isFixedService,
  bookingMode = BOOKING_MODES.PAY_LATER,
  priceLabel = '',
}) {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const isPayNow = ONLINE_PAYMENT_ENABLED && bookingMode === BOOKING_MODES.PAY_NOW;

  const submitLabel = (() => {
    if (isSubmitting) return 'Processing…';
    if (isPayNow) return 'Pay now';
    return 'Request callback';
  })();

  const onChange = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    handleChange(e);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(formData, isFixedService);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    handleSubmit(e);
  };

  return (
    <div
      className="fixed inset-0 z-[100001] flex items-end justify-center bg-site-primary/55 p-0 font-body antialiased backdrop-blur-sm sm:items-center sm:p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-[44rem] flex-col overflow-hidden rounded-t-xl bg-white font-body shadow-[0_20px_48px_rgba(42,15,2,0.2)] sm:max-h-[90dvh] sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 z-20 m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-site-primary font-body text-white shadow-sm transition hover:bg-site-accent-dark sm:right-3 sm:top-3"
        >
          <X size={14} strokeWidth={2.5} aria-hidden />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)]">
            <aside className="relative overflow-hidden bg-[#2a0f02] font-body text-white lg:flex lg:min-h-full lg:flex-col">
              <div className="flex items-center gap-2.5 border-b border-white/10 px-3 py-2.5 lg:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/20 ring-1 ring-site-accent/35">
                  <Phone size={14} className="text-site-accent" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold tracking-normal text-white">
                    {isPayNow ? 'Complete booking' : 'Request a callback'}
                  </p>
                  <p className="text-[0.6875rem] font-normal text-white/60">We&apos;ll call within 24 hours</p>
                </div>
                {priceLabel ? (
                  <span className="shrink-0 font-price text-sm font-semibold tabular-nums text-site-accent">
                    {priceLabel}
                  </span>
                ) : null}
              </div>

              <div className="relative hidden flex-1 flex-col lg:flex">
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <img
                    src="/images/premium_tarot.png"
                    alt=""
                    className="h-full w-full object-cover object-[center_20%] opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2a0f02]/90 via-[#2a0f02]/75 to-[#1a0800]" />
                </div>

                <div className="relative flex flex-1 flex-col justify-center gap-4 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-site-accent/15 ring-1 ring-site-accent/30">
                    <Phone size={18} className="text-site-accent" strokeWidth={2.25} aria-hidden />
                  </span>

                  <div>
                    <h4 className={MODAL_SIDEBAR_TITLE}>
                      {isPayNow ? 'Secure booking' : 'Request a callback'}
                    </h4>
                    <p className={MODAL_SIDEBAR_BODY}>
                      Submit your details and our astrologer will reach out to confirm your session.
                    </p>
                  </div>

                  {priceLabel ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm">
                      <p className="m-0 text-[0.6875rem] font-medium text-white/50">Session fee</p>
                      <p className="mb-0 mt-1 font-price text-[1.375rem] font-semibold tabular-nums leading-none text-site-accent">
                        {priceLabel}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="relative border-t border-white/10 px-4 py-3">
                  <p className="m-0 text-[0.6875rem] font-normal leading-snug text-white/50">
                    {isPayNow ? 'Encrypted checkout' : 'Callback within 24 hours · No payment now'}
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex flex-col bg-white px-3 py-3 sm:px-4 sm:py-3.5">
              <header className="mb-2.5 pr-7">
                <h3 id="consultation-modal-title" className={MODAL_TITLE}>
                  Consultation details
                </h3>
                <p className={MODAL_HINT}>
                  Fields marked <span className="text-red-500">*</span> are required
                </p>
              </header>

              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5 sm:gap-3">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2.5">
                  <div>
                    <FieldLabel htmlFor="consult-name" required>
                      Full name
                    </FieldLabel>
                    <input
                      id="consult-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      placeholder="Your full name"
                      className={fieldClass(errors.name)}
                      autoComplete="name"
                    />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="consult-phone" required>
                      Phone
                    </FieldLabel>
                    <input
                      id="consult-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className={fieldClass(errors.phone)}
                      autoComplete="tel"
                    />
                    <FieldError message={errors.phone} />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="consult-email" required>
                    Email
                  </FieldLabel>
                  <input
                    id="consult-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="you@email.com"
                    className={fieldClass(errors.email)}
                    autoComplete="email"
                  />
                  <FieldError message={errors.email} />
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-2">
                  <div>
                    <FieldLabel htmlFor="consult-dob" required>
                      Date of birth
                    </FieldLabel>
                    <input
                      id="consult-dob"
                      type="date"
                      name="dob"
                      value={formData.dob || ''}
                      onChange={onChange}
                      className={fieldClass(errors.dob)}
                    />
                    <FieldError message={errors.dob} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="consult-tob" required>
                      Time of birth
                    </FieldLabel>
                    <input
                      id="consult-tob"
                      type="time"
                      name="tob"
                      value={formData.tob || ''}
                      onChange={onChange}
                      className={fieldClass(errors.tob)}
                    />
                    <FieldError message={errors.tob} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="consult-pob" required>
                      Place of birth
                    </FieldLabel>
                    <input
                      id="consult-pob"
                      type="text"
                      name="pob"
                      value={formData.pob || ''}
                      onChange={onChange}
                      placeholder="City, state"
                      className={fieldClass(errors.pob)}
                    />
                    <FieldError message={errors.pob} />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="consult-type" required>
                    Consultation type
                  </FieldLabel>
                  {isFixedService ? (
                    <input
                      id="consult-type"
                      type="text"
                      name="consultationType"
                      value={formData.consultationType}
                      readOnly
                      className={`${MODAL_INPUT} cursor-not-allowed !bg-site-surface !text-site-muted`}
                    />
                  ) : (
                    <>
                      <input
                        id="consult-type"
                        type="text"
                        name="consultationType"
                        value={formData.consultationType}
                        onChange={onChange}
                        placeholder="e.g. Career, marriage, tarot"
                        className={fieldClass(errors.consultationType)}
                      />
                      <FieldError message={errors.consultationType} />
                    </>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="consult-message" optional>
                    Message
                  </FieldLabel>
                  <textarea
                    id="consult-message"
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    placeholder="Briefly describe your concern…"
                    rows={2}
                    className={`${MODAL_INPUT} resize-none`}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consent-consultation"
                    name="consent"
                    required
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-site-primary"
                  />
                  <label
                    htmlFor="consent-consultation"
                    className="cursor-pointer text-xs font-normal leading-snug text-site-muted"
                  >
                    <span className="text-red-500" aria-hidden="true">
                      *{' '}
                    </span>
                    I agree to the{' '}
                    <a
                      href="/privacy-policy"
                      className="font-semibold text-site-accent-dark underline-offset-2 hover:text-site-accent hover:underline"
                    >
                      Privacy Policy
                    </a>{' '}
                    and consent to DS Institute LLP contacting me by phone, email, or WhatsApp.
                  </label>
                </div>

                <div className="space-y-2 border-t border-site-accent-dark/8 pt-2.5">
                  {priceLabel ? (
                    <div className="flex items-center justify-between rounded-lg border border-site-accent-dark/10 bg-site-bg/80 px-2.5 py-1.5">
                      <span className="text-xs font-medium text-site-soft">
                        {isPayNow ? 'Amount due' : 'Session fee'}
                      </span>
                      <span className="font-price text-base font-semibold tabular-nums tracking-tight text-site-accent-dark">
                        {priceLabel}
                      </span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${BTN.primary} w-full !min-h-[2.375rem] !py-2 !text-sm !font-semibold !tracking-normal disabled:!translate-y-0`}
                  >
                    {isSubmitting ? (
                      <Loader2 size={15} className="animate-spin" aria-hidden />
                    ) : isPayNow ? (
                      <CreditCard size={15} aria-hidden />
                    ) : (
                      <Phone size={15} aria-hidden />
                    )}
                    {submitLabel}
                  </button>

                  <p className="m-0 flex items-center justify-center gap-1 text-center text-xs font-normal text-site-soft">
                    <Lock size={10} className="text-site-accent-dark" aria-hidden />
                    Private &amp; encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationModal;
