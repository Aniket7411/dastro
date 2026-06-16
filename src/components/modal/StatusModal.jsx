import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ModalOverlay, ModalPortal, useModalLock } from './ModalLayer';
import { BTN } from '../consultation/tokens';

const CONFIG = {
  success: {
    Icon: CheckCircle2,
    iconClass: 'text-emerald-600',
    ringClass: 'bg-emerald-50',
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: 'text-amber-600',
    ringClass: 'bg-amber-50',
  },
  error: {
    Icon: XCircle,
    iconClass: 'text-red-600',
    ringClass: 'bg-red-50',
  },
};

export default function StatusModal({
  open,
  type = 'success',
  title,
  message,
  confirmLabel = 'OK',
  onClose,
}) {
  useModalLock(open, onClose);
  const { Icon, iconClass, ringClass } = CONFIG[type] || CONFIG.success;

  return (
    <ModalPortal open={open}>
      <ModalOverlay onClose={onClose}>
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="status-modal-title"
          className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center">
            <span className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full ${ringClass}`}>
              <Icon size={28} className={iconClass} aria-hidden />
            </span>
            {title ? (
              <h2 id="status-modal-title" className="!m-0 font-heading text-lg font-bold text-site-primary">
                {title}
              </h2>
            ) : null}
            {message ? (
              <p className="!mt-2 !mb-0 font-body text-sm leading-relaxed text-site-muted">{message}</p>
            ) : null}
            <button type="button" onClick={onClose} className={`${BTN.cta} !mt-6 !w-full`}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}
