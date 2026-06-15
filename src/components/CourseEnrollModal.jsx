import { GraduationCap, Loader2, Lock, Phone, X } from 'lucide-react';
import { BTN } from './consultation/tokens';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';
import {
  MODAL_TITLE,
  MODAL_HINT,
  MODAL_LABEL,
  MODAL_SIDEBAR_TITLE,
  MODAL_SIDEBAR_BODY,
  MODAL_INPUT,
} from './modal/modalTypography';

const REQ = <span className="font-normal text-red-500" aria-hidden="true"> *</span>;

function FieldLabel({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} className={MODAL_LABEL}>
      {children}
      {required ? REQ : null}
    </label>
  );
}

function CourseEnrollModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
  courseName = 'Enroll Now',
  priceLabel = '',
}) {
  if (!isOpen) return null;

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
        aria-labelledby="course-enroll-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 z-20 m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-site-primary text-white shadow-sm transition hover:bg-site-accent-dark sm:right-3 sm:top-3"
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
                  <p className="truncate text-xs font-semibold tracking-normal text-white">{courseName}</p>
                  <p className="text-[0.6875rem] font-normal text-white/60">Counsellor will call you back</p>
                </div>
                {priceLabel ? (
                  <span className="shrink-0 font-price text-sm font-semibold tabular-nums text-site-accent">
                    {priceLabel}
                  </span>
                ) : null}
              </div>

              <div className="relative hidden flex-1 flex-col lg:flex">
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <img src="/live.jpg" alt="" className="h-full w-full object-cover object-center opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2a0f02]/90 via-[#2a0f02]/75 to-[#1a0800]" />
                </div>

                <div className="relative flex flex-1 flex-col justify-center gap-4 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-site-accent/15 ring-1 ring-site-accent/30">
                    <GraduationCap size={18} className="text-site-accent" strokeWidth={2.25} aria-hidden />
                  </span>
                  <div>
                    <h4 className={MODAL_SIDEBAR_TITLE}>{courseName}</h4>
                    <p className={MODAL_SIDEBAR_BODY}>
                      {ONLINE_PAYMENT_ENABLED
                        ? 'Reserve your seat in the next batch.'
                        : 'Share your details — our counsellor will call you back.'}
                    </p>
                  </div>
                  {priceLabel ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm">
                      <p className="m-0 text-[0.6875rem] font-medium text-white/50">Course fee</p>
                      <p className="mb-0 mt-1 font-price text-[1.375rem] font-semibold tabular-nums leading-none text-site-accent">
                        {priceLabel}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="relative border-t border-white/10 px-4 py-3">
                  <p className="m-0 text-[0.6875rem] font-normal leading-snug text-white/50">
                    {ONLINE_PAYMENT_ENABLED ? 'Encrypted checkout' : 'Callback within 24 hours'}
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex flex-col bg-white px-3 py-3 sm:px-4 sm:py-3.5">
              <header className="mb-2.5 pr-7">
                <h3 id="course-enroll-modal-title" className={MODAL_TITLE}>
                  {ONLINE_PAYMENT_ENABLED ? 'Enrollment details' : 'Enquiry details'}
                </h3>
                <p className={MODAL_HINT}>
                  Fields marked <span className="text-red-500">*</span> are required
                </p>
              </header>

              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5 sm:gap-3">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2.5">
                  <div>
                    <FieldLabel htmlFor="ce-name" required>
                      Full name
                    </FieldLabel>
                    <input
                      id="ce-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      placeholder="Your full name"
                      className={MODAL_INPUT}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ce-phone" required>
                      Phone
                    </FieldLabel>
                    <input
                      id="ce-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className={MODAL_INPUT}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="ce-email" required>
                    Email
                  </FieldLabel>
                  <input
                    id="ce-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="you@email.com"
                    className={MODAL_INPUT}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="ce-experience" required>
                    Experience level
                  </FieldLabel>
                  <select
                    id="ce-experience"
                    name="experience"
                    value={formData.experience}
                    onChange={onChange}
                    className={`${MODAL_INPUT} cursor-pointer`}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="ce-consent"
                    name="consent"
                    required
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-site-primary"
                  />
                  <label htmlFor="ce-consent" className="cursor-pointer text-xs font-normal leading-snug text-site-muted">
                    <span className="text-red-500" aria-hidden="true">
                      *{' '}
                    </span>
                    I agree to the{' '}
                    <a
                      href="/terms-and-conditions"
                      className="font-semibold text-site-accent-dark underline-offset-2 hover:text-site-accent hover:underline"
                    >
                      Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a
                      href="/refund-policy"
                      className="font-semibold text-site-accent-dark underline-offset-2 hover:text-site-accent hover:underline"
                    >
                      Refund Policy
                    </a>
                    .
                  </label>
                </div>

                <div className="space-y-2 border-t border-site-accent-dark/8 pt-2.5">
                  {priceLabel ? (
                    <div className="flex items-center justify-between rounded-lg border border-site-accent-dark/10 bg-site-bg/80 px-2.5 py-1.5">
                      <span className="text-xs font-medium text-site-soft">
                        {ONLINE_PAYMENT_ENABLED ? 'Course fee' : 'Indicative fee'}
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
                    ) : ONLINE_PAYMENT_ENABLED ? (
                      <GraduationCap size={15} aria-hidden />
                    ) : (
                      <Phone size={15} aria-hidden />
                    )}
                    {isSubmitting
                      ? 'Processing…'
                      : ONLINE_PAYMENT_ENABLED
                        ? 'Proceed to payment'
                        : 'Request callback'}
                  </button>

                  <p className="m-0 flex items-center justify-center gap-1 text-center text-xs font-normal text-site-soft">
                    <Lock size={10} className="text-site-accent-dark" aria-hidden />
                    {ONLINE_PAYMENT_ENABLED ? 'Secure & encrypted payment' : 'We will call you within 24 hours'}
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

export default CourseEnrollModal;

export default CourseEnrollModal;
