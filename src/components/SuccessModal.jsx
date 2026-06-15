import { CheckCircle2, X } from 'lucide-react';
import { BTN } from './consultation/tokens';
import { ModalPortal, ModalOverlay, useModalLock } from './modal/ModalLayer';

function SuccessModal({ isOpen, onClose, title, message, ctaLabel, ctaAction }) {
  useModalLock(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <ModalPortal open={isOpen}>
      <ModalOverlay onClose={onClose}>
        <div
          className="relative w-full max-w-[22rem] rounded-2xl border border-site-accent-dark/12 bg-white p-5 text-center shadow-[0_24px_64px_rgba(42,15,2,0.2)] sm:max-w-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2.5 top-2.5 m-0 flex h-7 w-7 cursor-pointer select-none appearance-none items-center justify-center !rounded-full border border-site-accent-dark/15 bg-site-bg text-site-accent-dark outline-none transition hover:bg-site-surface"
          >
            <X size={14} aria-hidden />
          </button>

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.3)]">
            <CheckCircle2 size={28} strokeWidth={2.25} aria-hidden />
          </div>

          <h2 className="!m-0 font-heading text-lg font-bold leading-snug text-site-primary sm:text-xl">
            {title || 'Submitted successfully!'}
          </h2>

          <p className="!m-0 !mt-2 font-body text-sm leading-relaxed text-site-muted">
            {message ||
              'Your request has been received. Our team will contact you within 24 hours to follow up.'}
          </p>

          <div className="!mt-4 flex flex-col gap-2">
            {ctaAction ? (
              <>
                <button type="button" onClick={ctaAction} className={`${BTN.primary} w-full`}>
                  {ctaLabel || 'Continue'}
                </button>
                <button type="button" onClick={onClose} className={`${BTN.outline} w-full`}>
                  Close
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose} className={`${BTN.primary} w-full`}>
                Great, thank you!
              </button>
            )}
          </div>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}

export default SuccessModal;
