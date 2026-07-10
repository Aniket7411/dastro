import { useEffect } from 'react';
import { formatAdminCurrency } from '../../utils/adminTableUtils';

const OVERLAY = 'fixed inset-0 z-[20060] flex items-end justify-center p-4 sm:items-center sm:p-6';
const BACKDROP = 'absolute inset-0 bg-[#2a0f02]/55 backdrop-blur-[2px]';
const PANEL = 'relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#c8832a]/20 bg-[#fffdf8] shadow-[0_24px_60px_rgba(42,15,2,0.22)]';
const INPUT =
  'w-full rounded-xl border border-[#8b4a1e]/20 bg-white px-3.5 py-2.5 text-sm text-[#2a0f02] outline-none transition placeholder:text-[#8b4a1e]/45 focus:border-[#c8832a] focus:ring-2 focus:ring-[#c8832a]/25';
const BTN_CANCEL =
  'rounded-xl border border-[#8b4a1e]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#5c3d2e] transition hover:bg-[#fdf6ee]';
const BTN_PRIMARY =
  'rounded-xl bg-[#2a0f02] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#8b4a1e] disabled:cursor-wait disabled:opacity-60';
const BTN_DANGER =
  'rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60';

export const ACCESS_ACTION_META = {
  enable: {
    title: 'Enable course access',
    description:
      'The student will be able to watch lesson videos. A new login password will be emailed to them.',
    icon: 'fa-unlock',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    confirmLabel: 'Enable & send credentials',
    primaryClass: BTN_PRIMARY,
  },
  disable: {
    title: 'Disable lesson access',
    description:
      'Enrollment stays active but lesson videos will be locked until you enable access again.',
    icon: 'fa-lock',
    iconWrap: 'bg-amber-100 text-amber-800',
    confirmLabel: 'Disable access',
    primaryClass: BTN_PRIMARY,
  },
  suspend: {
    title: 'Suspend course access',
    description:
      'This removes active access to the course. The student will not see it on their dashboard.',
    icon: 'fa-ban',
    iconWrap: 'bg-rose-100 text-rose-700',
    confirmLabel: 'Suspend access',
    primaryClass: BTN_DANGER,
  },
};

function StudentSummary({ row }) {
  if (!row) return null;
  return (
    <div className="rounded-xl border border-[#c8832a]/15 bg-white/80 p-3.5">
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] text-base font-bold text-white"
          aria-hidden
        >
          {(row.studentName || 'S').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-[#2a0f02]">{row.studentName || 'Student'}</p>
          {row.email ? (
            <p className="truncate text-sm text-[#8b4a1e]/80">{row.email}</p>
          ) : null}
          <p className="mt-1 text-sm font-semibold text-[#c8832a]">{row.courseTitle}</p>
          {row.amount != null ? (
            <p className="mt-0.5 text-xs text-[#8b4a1e]/70">
              Reference: {formatAdminCurrency(row.amount)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ModalShell({ title, icon, iconWrap, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={OVERLAY} role="dialog" aria-modal="true" aria-labelledby="course-access-modal-title">
      <button type="button" className={BACKDROP} aria-label="Close dialog" onClick={onClose} />
      <div className={PANEL} onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#c8832a]/12 bg-gradient-to-r from-[#fffdf8] to-[#fff6eb] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {icon ? (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
                  aria-hidden
                >
                  <i className={`fas ${icon}`} />
                </span>
              ) : null}
              <div>
                <h2 id="course-access-modal-title" className="text-lg font-extrabold text-[#2a0f02]">
                  {title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#8b4a1e]/15 text-[#8b4a1e] hover:bg-white"
              aria-label="Close"
            >
              <i className="fas fa-times text-sm" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4 sm:px-6">{children}</div>

        {footer ? (
          <div className="flex flex-col-reverse gap-2 border-t border-[#c8832a]/12 bg-[#fdf6ee]/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ExternalPaymentModal({
  row,
  amount,
  note,
  busy,
  onAmountChange,
  onNoteChange,
  onClose,
  onSubmit,
}) {
  if (!row) return null;

  return (
    <ModalShell
      title="Confirm external payment"
      icon="fa-money-bill-wave"
      iconWrap="bg-[#c8832a]/15 text-[#8b4a1e]"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className={BTN_CANCEL} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={BTN_PRIMARY} onClick={onSubmit} disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm & enable access'}
          </button>
        </>
      )}
    >
      <p className="text-sm leading-relaxed text-[#5c3d2e]">
        Use this when payment was received outside Razorpay (UPI, bank transfer, cash, etc.).
        The student account will be created if needed and login credentials will be emailed.
      </p>

      <StudentSummary row={row} />

      <div>
        <label htmlFor="external-payment-amount" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#8b4a1e]">
          Amount received (₹)
        </label>
        <input
          id="external-payment-amount"
          type="number"
          min="0"
          step="1"
          className={INPUT}
          placeholder="Leave blank to use enquiry / course price"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          disabled={busy}
        />
      </div>

      <div>
        <label htmlFor="external-payment-note" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#8b4a1e]">
          Admin note (optional)
        </label>
        <textarea
          id="external-payment-note"
          rows={3}
          className={`${INPUT} resize-y`}
          placeholder="UPI reference, transaction ID, payment date…"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={busy}
        />
      </div>
    </ModalShell>
  );
}

export function AccessActionModal({ row, action, busy, onClose, onConfirm }) {
  if (!row || !action) return null;
  const meta = ACCESS_ACTION_META[action];
  if (!meta) return null;

  return (
    <ModalShell
      title={meta.title}
      icon={meta.icon}
      iconWrap={meta.iconWrap}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className={BTN_CANCEL} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={meta.primaryClass} onClick={onConfirm} disabled={busy}>
            {busy ? 'Processing…' : meta.confirmLabel}
          </button>
        </>
      )}
    >
      <p className="text-sm leading-relaxed text-[#5c3d2e]">{meta.description}</p>
      <StudentSummary row={row} />
      {action === 'enable' ? (
        <p className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs leading-relaxed text-emerald-900">
          <i className="fas fa-envelope mr-1.5" aria-hidden />
          Login email and a new password will be sent to <strong>{row.email}</strong>.
        </p>
      ) : null}
    </ModalShell>
  );
}
