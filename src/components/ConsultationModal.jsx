import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Phone, CreditCard, Loader2 } from 'lucide-react';
import { BOOKING_MODES } from '../utils/consultationBooking';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';
import {
  MODAL_TITLE,
  MODAL_HINT,
  MODAL_LABEL,
  MODAL_INPUT,
  MODAL_INPUT_ERROR,
  MODAL_SUBMIT,
} from './modal/modalTypography';

const REQ = <span className="font-normal text-red-500" aria-hidden="true"> *</span>;

const PRIVACY_LINK =
  'font-semibold text-site-accent-dark no-underline decoration-transparent hover:text-site-accent hover:underline';

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
  return <p className="mt-0.5 font-body text-[10px] leading-snug text-red-500 sm:text-[11px]">{message}</p>;
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

function useModalLock(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);
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

  useModalLock(isOpen, onClose);

  if (!isOpen) return null;

  const isPayNow = ONLINE_PAYMENT_ENABLED && bookingMode === BOOKING_MODES.PAY_NOW;
  const headerTitle = isPayNow ? 'Secure booking' : 'Request a callback';
  const headerNote = isPayNow ? 'Encrypted checkout' : 'Callback within 24 hours · No payment now';

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

  return createPortal(
    <div
      className="fixed inset-0 z-[100001] flex items-end justify-center bg-[#2a0f02]/60 p-0 sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="relative grid h-[min(92dvh,100dvh)] w-full max-w-md grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-t-2xl bg-white shadow-[0_20px_48px_rgba(42,15,2,0.25)] sm:h-[min(88dvh,40rem)] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 z-20 m-0 flex h-7 w-7 cursor-pointer select-none appearance-none items-center justify-center !rounded-full border border-white/25 bg-site-primary/90 font-body text-white shadow-sm outline-none transition hover:bg-site-accent-dark"
        >
          <X size={14} strokeWidth={2.5} aria-hidden />
        </button>

        {/* Header */}
        <header className="shrink-0 border-b border-white/10 bg-[#2a0f02] px-3 py-3 pr-12 text-white sm:px-4 sm:py-3.5 sm:pr-14">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/20 ring-1 ring-site-accent/30">
              <Phone size={14} className="text-site-accent" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="m-0 font-body text-sm font-semibold leading-snug text-white">{headerTitle}</h4>
              <p className="m-0 mt-0.5 font-body text-[11px] leading-snug text-white/55">{headerNote}</p>
              {priceLabel ? (
                <p className="m-0 mt-1.5 font-body text-[11px] leading-none text-white/55">
                  Session fee{' '}
                  <span className="font-price text-sm font-bold tabular-nums text-site-accent">{priceLabel}</span>
                </p>
              ) : null}
            </div>
          </div>
        </header>

        {/* Form — middle scrolls, footer sticky inside form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex min-h-0 flex-col overflow-hidden bg-white"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-3.5">
            <div className="mb-2">
              <h3 id="consultation-modal-title" className={MODAL_TITLE}>
                Your details
              </h3>
              <p className={MODAL_HINT}>
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
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
                    inputMode="numeric"
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

              <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-3">
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
                <div className="min-[480px]:col-span-1">
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

              <label
                htmlFor="consent-consultation"
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-site-accent-dark/8 bg-site-bg/50 px-2.5 py-2"
              >
                <input
                  type="checkbox"
                  id="consent-consultation"
                  name="consent"
                  required
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-site-primary"
                />
                <span className="text-[10px] font-normal leading-snug text-site-muted sm:text-[11px]">
                  <span className="text-red-500" aria-hidden="true">
                    *{' '}
                  </span>
                  I agree to the{' '}
                  <Link to="/privacy-policy" className={PRIVACY_LINK}>
                    Privacy Policy
                  </Link>{' '}
                  and consent to contact by phone, email, or WhatsApp.
                </span>
              </label>
            </div>
          </div>

          {/* Sticky footer — always visible */}
          <div className="shrink-0 border-t border-site-accent-dark/8 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
            <button type="submit" disabled={isSubmitting} className={MODAL_SUBMIT}>
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              ) : isPayNow ? (
                <CreditCard size={14} aria-hidden />
              ) : (
                <Phone size={14} aria-hidden />
              )}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ConsultationModal;
