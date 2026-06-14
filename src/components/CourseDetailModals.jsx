import { motion } from 'framer-motion';
import { Check, CheckCircle2, CreditCard, Loader2, Lock, Percent, Phone, Tag, X } from 'lucide-react';
import { BTN, TYPE } from './consultation/tokens';

// Shared by CheckoutModal / CouponControls (uses rem — fine for those compact panels)
const INPUT =
  'm-0 w-full rounded-lg border border-site-accent-dark/15 bg-site-bg px-3 py-2.5 font-body text-sm text-site-primary placeholder:text-site-soft outline-none transition focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/15 disabled:cursor-not-allowed disabled:bg-site-surface disabled:text-site-muted';

const LABEL =
  '!mb-1 block font-body text-[0.625rem] !font-bold uppercase tracking-wider !text-site-primary';

function ModalShell({ open, onClose, title, subtitle, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100002] flex items-end justify-center bg-site-primary/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="relative flex max-h-[94dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-site-accent-dark/12 bg-site-surface text-site-primary transition hover:bg-site-bg"
        >
          <X size={15} strokeWidth={2.5} aria-hidden />
        </button>
        <div className="overflow-y-auto overscroll-contain p-5 pt-12 sm:p-6 sm:pt-12">
          <header className="mb-4">
            <h3 className="!m-0 font-heading text-lg font-bold text-site-primary">{title}</h3>
            {subtitle ? (
              <p className="!mt-1 font-body text-xs leading-relaxed text-site-muted">{subtitle}</p>
            ) : null}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

export function CouponControls({
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponStatus,
  couponLoading,
  hasAvailableCoupons,
  availableCoupons,
  onApply,
  onRemove,
  getPayableAmount,
  compact = false,
}) {
  return (
    <div className={`rounded-lg border border-site-accent-dark/12 bg-site-bg/80 ${compact ? 'p-3' : 'p-3.5'}`}>
      <div className="mb-2 flex items-center gap-1.5 font-body text-xs font-bold text-site-primary">
        <Tag size={14} className="text-site-accent-dark" aria-hidden />
        Apply coupon
      </div>

      {!appliedCoupon && hasAvailableCoupons && (
        <p className="!mb-2 font-body text-[0.6875rem] text-site-muted">
          {availableCoupons.length} active coupon{availableCoupons.length !== 1 ? 's' : ''} available
        </p>
      )}

      <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder={appliedCoupon ? 'Coupon applied' : 'Enter code'}
          disabled={Boolean(appliedCoupon)}
          className={INPUT}
        />
        <button
          type="button"
          onClick={() => (appliedCoupon ? onRemove() : onApply())}
          disabled={couponLoading}
          className="m-0 shrink-0 cursor-pointer rounded-lg border-0 bg-site-accent-dark px-3 py-2 font-body text-xs font-bold text-white transition hover:bg-site-primary disabled:opacity-60"
        >
          {couponLoading ? '…' : appliedCoupon ? 'Remove' : 'Apply'}
        </button>
      </div>

      {couponStatus && (
        <div
          className={`mb-2 flex items-start gap-1.5 rounded-lg px-2.5 py-2 font-body text-xs ${
            couponStatus.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" aria-hidden />
          <span>{couponStatus.message}</span>
        </div>
      )}

      {appliedCoupon && (
        <div className="flex items-center gap-1.5 rounded-lg border border-site-accent/25 bg-site-accent/10 px-2.5 py-2 font-body text-xs font-semibold text-site-accent-dark">
          <Percent size={14} aria-hidden />
          {appliedCoupon.code} applied — pay ₹{getPayableAmount()}
        </div>
      )}

      {!appliedCoupon && hasAvailableCoupons && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {availableCoupons.slice(0, 3).map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onApply(c.code)}
              disabled={couponLoading}
              className="m-0 cursor-pointer rounded-full border border-site-accent-dark/15 bg-white px-2.5 py-1 font-body text-[0.625rem] font-bold text-site-accent-dark transition hover:border-site-accent"
            >
              {c.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CheckoutModal({
  open,
  onClose,
  course,
  formData,
  onInputChange,
  onSubmit,
  isProcessingPayment,
  appliedCoupon,
  getCoursePrice,
  getDiscountAmount,
  getPayableAmount,
  couponProps,
}) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Secure checkout"
      subtitle="Review your details and proceed to payment."
    >
      <CouponControls {...couponProps} />

      <div className="my-4 space-y-2 rounded-lg border border-site-accent-dark/10 bg-site-bg/50 p-3 font-body text-sm">
        <div className="flex justify-between text-site-muted">
          <span>Course price</span>
          <span className="font-price tabular-nums">₹{getCoursePrice()}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-emerald-700">
            <span>Coupon ({appliedCoupon.code})</span>
            <span className="font-price tabular-nums">- ₹{getDiscountAmount()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-site-accent-dark/10 pt-2 font-bold text-site-primary">
          <span>Amount to pay</span>
          <span className="font-price text-base tabular-nums">₹{getPayableAmount()}</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div>
          <label className={LABEL}>Course</label>
          <input type="text" value={course.title} readOnly disabled className={INPUT} />
        </div>
        <div>
          <label htmlFor="checkout-name" className={LABEL}>
            Full name
          </label>
          <input
            id="checkout-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Your name"
            required
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="checkout-phone" className={LABEL}>
            Phone
          </label>
          <input
            id="checkout-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="10-digit mobile"
            inputMode="numeric"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            required
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="checkout-email" className={LABEL}>
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="you@email.com"
            required
            className={INPUT}
          />
        </div>
        <button type="submit" disabled={isProcessingPayment} className={`${BTN.cta} ${BTN.static} min-w-[11rem]`}>
          {isProcessingPayment ? (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          ) : (
            <CreditCard size={16} aria-hidden />
          )}
          {isProcessingPayment ? 'Initializing…' : `Pay ₹${getPayableAmount()}`}
        </button>
      </form>
    </ModalShell>
  );
}

const ENQ_POINTS = [
  'Batch timings & upcoming schedule',
  'Full syllabus breakdown',
  'Fee structure & payment options',
];

export function EnquiryModal({ open, onClose, course, enquiryData, onChange, onSubmit }) {
  if (!open) return null;

  const courseImage = course?.image || '/live.jpg';

  return (
    <motion.div
      className="fixed inset-0 z-[100002] flex items-end justify-center bg-site-primary/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="relative flex max-h-[94dvh] w-full max-w-[40rem] flex-col overflow-hidden rounded-t-2xl border border-site-accent-dark/10 bg-white shadow-[0_20px_48px_rgba(42,15,2,0.16)] sm:max-h-[90dvh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-modal-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-site-accent-dark/12 bg-site-surface text-site-primary transition hover:bg-site-bg sm:right-3.5 sm:top-3.5"
        >
          <X size={15} strokeWidth={2.5} aria-hidden />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-11 sm:p-5 sm:pt-12">
          <div className="mb-4 flex gap-3 rounded-lg border border-site-accent-dark/10 bg-site-bg/70 p-3 sm:mb-5 sm:gap-3.5 sm:p-3.5">
            <img
              src={courseImage}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
              aria-hidden
            />
            <div className="min-w-0 flex-1 pr-6">
              <span className={TYPE.kicker}>Course Enquiry</span>
              <h4 className="!mt-1.5 !mb-0 font-heading text-base font-bold leading-snug text-site-primary sm:text-lg">
                {course?.title ?? 'Ask about this course'}
              </h4>
              <p className="!mt-1 !mb-0 font-body text-xs leading-relaxed text-site-muted">
                We'll get back to you with batch timings, syllabus, and fees.
              </p>
            </div>
          </div>

          <ul className="!m-0 !mb-4 flex list-none flex-wrap gap-2 !p-0 sm:mb-5">
            {ENQ_POINTS.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-site-accent-dark/10 bg-site-surface-soft px-2.5 py-1 font-body text-[0.6875rem] font-medium text-site-muted"
              >
                <Check size={10} className="shrink-0 text-site-accent" strokeWidth={3} aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <header className="mb-3 sm:mb-4">
            <h3 id="enq-modal-title" className={`${TYPE.h2} !text-base sm:!text-lg`}>
              Enquiry details
            </h3>
            <p
              className={`${TYPE.caption} !mt-1 !text-[0.6875rem] !font-semibold uppercase !tracking-wider !text-site-accent-dark`}
            >
              Fill in your details below
            </p>
          </header>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
            <div>
              <label className={LABEL}>Course</label>
              <input
                type="text"
                value={course?.title ?? ''}
                readOnly
                disabled
                className={`${INPUT} cursor-not-allowed !bg-site-surface !text-site-muted`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2.5">
              <div>
                <label htmlFor="enq-name" className={LABEL}>
                  Full name
                </label>
                <input
                  id="enq-name"
                  type="text"
                  name="name"
                  value={enquiryData.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="enq-phone" className={LABEL}>
                  Phone
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  name="phone"
                  value={enquiryData.phone}
                  onChange={onChange}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  autoComplete="tel"
                  required
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="enq-email" className={LABEL}>
                Email
              </label>
              <input
                id="enq-email"
                type="email"
                name="email"
                value={enquiryData.email}
                onChange={onChange}
                placeholder="you@email.com"
                autoComplete="email"
                required
                className={INPUT}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2.5">
              <div>
                <label htmlFor="enq-age" className={LABEL}>
                  Age
                </label>
                <input
                  id="enq-age"
                  type="number"
                  name="age"
                  value={enquiryData.age}
                  onChange={onChange}
                  placeholder="Your age"
                  min={10}
                  max={100}
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <label htmlFor="enq-city" className={LABEL}>
                  City
                </label>
                <input
                  id="enq-city"
                  type="text"
                  name="city"
                  value={enquiryData.city}
                  onChange={onChange}
                  placeholder="Your city"
                  required
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="enq-interest" className={LABEL}>
                Area of interest
              </label>
              <input
                id="enq-interest"
                type="text"
                name="interest"
                value={enquiryData.interest}
                onChange={onChange}
                placeholder="e.g. career, marriage, spirituality"
                required
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="enq-message" className={LABEL}>
                Notes{' '}
                <span className="normal-case font-normal tracking-normal text-site-soft">(optional)</span>
              </label>
              <textarea
                id="enq-message"
                name="message"
                value={enquiryData.message}
                onChange={onChange}
                placeholder="Any specific questions or requirements…"
                rows={2}
                className={`${INPUT} resize-none`}
              />
            </div>

            <p className="!m-0 flex items-start gap-2 rounded-lg border border-site-accent-dark/10 bg-site-bg/60 px-3 py-2 font-body text-[0.6875rem] leading-relaxed text-site-muted">
              <Phone size={13} className="mt-0.5 shrink-0 text-site-accent-dark" aria-hidden />
              Our team will call you within 24 hours to discuss further.
            </p>

            <div className="flex justify-center pt-0.5">
              <button type="submit" className={`${BTN.cta} ${BTN.static} min-w-[11rem]`}>
                <Phone size={15} aria-hidden />
                Submit enquiry
              </button>
            </div>

            <p className="!m-0 flex items-center justify-center gap-1.5 text-center font-body text-[0.6875rem] font-medium text-site-soft">
              <Lock size={11} className="text-site-accent-dark" aria-hidden />
              Your information is private &amp; secure
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
