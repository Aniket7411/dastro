import { GraduationCap, Loader2, Phone, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';
import { ModalPortal, ModalOverlay, useModalLock } from './modal/ModalLayer';
import {
  MODAL_TITLE,
  MODAL_HINT,
  MODAL_LABEL,
  MODAL_INPUT,
  MODAL_SUBMIT,
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
  useModalLock(isOpen, onClose);
  if (!isOpen) return null;

  const headerNote = ONLINE_PAYMENT_ENABLED
    ? 'Reserve your seat in the next batch.'
    : 'Share your details — our counsellor will call you back.';

  return (
    <ModalPortal open={isOpen}>
      <ModalOverlay onClose={onClose}>
        <div
          className="relative grid h-[min(92dvh,100dvh)] w-full max-w-md grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-t-2xl bg-white shadow-[0_20px_48px_rgba(42,15,2,0.2)] sm:h-[min(88dvh,40rem)] sm:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-enroll-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2.5 top-2.5 z-20 m-0 flex h-7 w-7 cursor-pointer select-none appearance-none items-center justify-center !rounded-full border border-white/25 bg-site-primary/90 text-white outline-none transition hover:bg-site-accent-dark"
          >
            <X size={14} strokeWidth={2.5} aria-hidden />
          </button>

          <header className="shrink-0 border-b border-white/10 bg-[#2a0f02] px-3 py-3 pr-11 text-white sm:px-4 sm:py-3.5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/20 ring-1 ring-site-accent/30">
                <GraduationCap size={14} className="text-site-accent" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="m-0 line-clamp-2 font-body text-sm font-semibold leading-snug text-white">{courseName}</h4>
                <p className="m-0 mt-0.5 font-body text-[11px] leading-snug text-white/55">{headerNote}</p>
                {priceLabel ? (
                  <p className="m-0 mt-1.5 font-body text-[11px] text-white/55">
                    Course fee{' '}
                    <span className="font-price text-sm font-bold tabular-nums text-site-accent">{priceLabel}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </header>

          <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-col overflow-hidden bg-white">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-3 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-3.5">
              <header className="mb-2">
                <h3 id="course-enroll-modal-title" className={MODAL_TITLE}>
                  {ONLINE_PAYMENT_ENABLED ? 'Enrollment details' : 'Enquiry details'}
                </h3>
                <p className={MODAL_HINT}>
                  <span className="text-red-500">*</span> Required fields
                </p>
              </header>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
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
                      inputMode="numeric"
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

                <label
                  htmlFor="ce-consent"
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-site-accent-dark/8 bg-site-bg/50 px-2.5 py-2"
                >
                  <input
                    type="checkbox"
                    id="ce-consent"
                    name="consent"
                    required
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-site-primary"
                  />
                  <span className="text-[10px] font-normal leading-snug text-site-muted sm:text-[11px]">
                    <span className="text-red-500" aria-hidden="true">
                      *{' '}
                    </span>
                    I agree to the{' '}
                    <Link to="/terms-and-conditions" className="font-semibold text-site-accent-dark no-underline hover:underline">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/refund-policy" className="font-semibold text-site-accent-dark no-underline hover:underline">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
            </div>

            <div className="shrink-0 border-t border-site-accent-dark/8 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
              <button type="submit" disabled={isSubmitting} className={MODAL_SUBMIT}>
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                ) : ONLINE_PAYMENT_ENABLED ? (
                  <GraduationCap size={14} aria-hidden />
                ) : (
                  <Phone size={14} aria-hidden />
                )}
                {isSubmitting
                  ? 'Processing…'
                  : ONLINE_PAYMENT_ENABLED
                    ? 'Proceed to payment'
                    : 'Request callback'}
              </button>
            </div>
          </form>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}

export default CourseEnrollModal;
