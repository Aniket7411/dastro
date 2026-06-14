import { useState } from 'react';
import { X, Check, Phone, Lock, CreditCard, Loader2 } from 'lucide-react';
import { BOOKING_MODES } from '../utils/consultationBooking';
import { BTN, TYPE } from './consultation/tokens';

const INPUT =
  'm-0 w-full rounded-lg border border-site-accent-dark/15 bg-site-bg px-3 py-2.5 font-body text-sm text-site-primary placeholder:text-site-soft outline-none transition focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/15 disabled:cursor-not-allowed disabled:bg-site-surface disabled:text-site-muted';

const INPUT_ERROR =
  '!border-red-400 !bg-red-50 focus:!border-red-400 focus:!ring-red-400/15';

const LABEL =
  '!mb-1.5 block font-body text-[0.625rem] !font-bold uppercase tracking-wider !text-site-primary';

const SIDE_POINTS = [
  'Birth chart analysis',
  'Career & relationship guidance',
  'Remedies & predictions',
];

function fieldClass(hasError) {
  return hasError ? `${INPUT} ${INPUT_ERROR}` : INPUT;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="!mt-1 font-body text-[0.6875rem] leading-snug text-red-500">{message}</p>;
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

  const isPayNow = bookingMode === BOOKING_MODES.PAY_NOW;

  const submitLabel = (() => {
    if (isSubmitting) return 'Processing…';
    if (isPayNow) return priceLabel ? `Pay now · ${priceLabel}` : 'Pay now';
    if (priceLabel) return `Request callback · ${priceLabel}`;
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
      className="fixed inset-0 z-[100001] flex items-end justify-center bg-site-primary/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="relative flex max-h-[94dvh] w-full max-w-[52rem] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_64px_rgba(42,15,2,0.22)] sm:max-h-[92dvh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-site-primary text-white shadow-sm transition hover:bg-site-accent-dark sm:right-3.5 sm:top-3.5"
        >
          <X size={15} strokeWidth={2.5} aria-hidden />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <aside className="relative overflow-hidden bg-site-primary text-white lg:min-h-full">
              <img
                src="/images/premium_tarot.png"
                alt=""
                className="hidden h-28 w-full object-cover object-[center_30%] lg:block xl:h-32"
                aria-hidden
              />

              <div className="relative z-10 space-y-3 p-4 sm:p-5 lg:p-5 lg:pt-4 xl:p-6">
                <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wider text-white/90">
                  {isPayNow ? 'Secure checkout' : 'Book a session'}
                </span>

                <div>
                  <h4 className="!m-0 font-heading text-lg font-bold leading-tight text-white sm:text-xl">
                    {isPayNow ? 'Complete booking' : 'Request consultation'}
                  </h4>
                  <p className="!mt-1.5 font-body text-xs leading-relaxed text-white/75">
                    Share your birth details for an accurate chart reading.
                  </p>
                </div>

                <ul className="m-0 hidden list-none space-y-2 p-0 lg:block">
                  {SIDE_POINTS.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-body text-xs font-medium text-white/90">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-site-accent/25">
                        <Check size={9} className="text-site-accent" strokeWidth={3} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {!isPayNow && (
                  <p className="!m-0 flex items-start gap-2 rounded-lg bg-white/10 p-2.5 font-body text-[0.6875rem] leading-relaxed text-white/75">
                    <Phone size={13} className="mt-0.5 shrink-0 text-site-accent" aria-hidden />
                    We will call within 24 hours to confirm your slot. Pay online anytime before the session.
                  </p>
                )}
              </div>
            </aside>

            <div className="flex flex-col bg-white p-4 sm:p-5 lg:p-6">
              <header className="mb-4 pr-8 sm:mb-5">
                <h3 id="consultation-modal-title" className={`${TYPE.h2} !text-base sm:!text-lg`}>
                  Consultation details
                </h3>
                <p className={`${TYPE.caption} !mt-1 !text-[0.6875rem] !font-semibold uppercase !tracking-wider !text-site-accent-dark`}>
                  Birth details required for analysis
                </p>
              </header>

              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3.5 sm:gap-4">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-3">
                  <div>
                    <label htmlFor="consult-name" className={LABEL}>
                      Full name
                    </label>
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
                    <label htmlFor="consult-phone" className={LABEL}>
                      Phone
                    </label>
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
                  <label htmlFor="consult-email" className={LABEL}>
                    Email
                  </label>
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2.5">
                  <div>
                    <label htmlFor="consult-dob" className={LABEL}>
                      Date of birth
                    </label>
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
                    <label htmlFor="consult-tob" className={LABEL}>
                      Time of birth
                    </label>
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
                    <label htmlFor="consult-pob" className={LABEL}>
                      Place of birth
                    </label>
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
                  <label htmlFor="consult-type" className={LABEL}>
                    Consultation type
                  </label>
                  {isFixedService ? (
                    <input
                      id="consult-type"
                      type="text"
                      name="consultationType"
                      value={formData.consultationType}
                      readOnly
                      className={`${INPUT} cursor-not-allowed !bg-site-surface !text-site-muted`}
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
                  <label htmlFor="consult-message" className={LABEL}>
                    Message{' '}
                    <span className="normal-case font-normal tracking-normal text-site-soft">(optional)</span>
                  </label>
                  <textarea
                    id="consult-message"
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    placeholder="Briefly describe your concern…"
                    rows={2}
                    className={`${INPUT} resize-none`}
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consent-consultation"
                    name="consent"
                    required
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-site-primary"
                  />
                  <label
                    htmlFor="consent-consultation"
                    className="cursor-pointer font-body text-xs leading-relaxed text-site-muted"
                  >
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${BTN.primary} w-full !min-h-[2.625rem] disabled:!translate-y-0`}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                  ) : isPayNow ? (
                    <CreditCard size={16} aria-hidden />
                  ) : (
                    <Phone size={16} aria-hidden />
                  )}
                  {submitLabel}
                </button>

                <p className="!m-0 flex items-center justify-center gap-1.5 text-center font-body text-[0.6875rem] font-medium text-site-soft">
                  <Lock size={11} className="text-site-accent-dark" aria-hidden />
                  Private &amp; encrypted
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationModal;
