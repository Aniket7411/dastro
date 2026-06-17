import { useState } from 'react';
import { Gift, X } from 'lucide-react';
import toast from '@/utils/toast';
import API_BASE from '@/utils/api';
import { getContactValidationError, normalizeIndianMobile } from '@/utils/validation';
import { ModalPortal, ModalOverlay, useModalLock } from '../modal/ModalLayer';
import { MODAL_INPUT, MODAL_LABEL, MODAL_SUBMIT, MODAL_TITLE, MODAL_HINT } from '../modal/modalTypography';

const EMPTY_FORM = { name: '', email: '', phone: '' };

const SOURCE_MESSAGES = {
  'webinar-page': 'Interested in free webinar — submitted from webinar page.',
  navbar: 'Interested in free webinar — submitted via site navigation.',
};

export default function FreeWebinarInterestModal({ open, onClose, source = 'navbar' }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useModalLock(open, onClose);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = getContactValidationError(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: normalizeIndianMobile(form.phone),
          type: 'Webinar',
          leadType: 'FREE WEBINAR INTEREST',
          bookingMode: 'pay_later',
          status: 'ENQUIRY RECEIVED',
          paymentStatus: 'NOT REQUIRED',
          courseName: 'Free Astrology Webinar',
          message: SOURCE_MESSAGES[source] || SOURCE_MESSAGES.navbar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("You're on the list! We'll reach out when the next free webinar is scheduled.");
        setForm(EMPTY_FORM);
        onClose();
      } else {
        toast.error(data.message || data.error || 'Could not submit. Please try again.');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <ModalOverlay onClose={handleClose} className="!items-center !p-3 sm:!p-4">
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-site-accent-dark/10 bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="free-webinar-modal-title"
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-0 bg-site-bg text-site-muted transition hover:bg-site-accent/10 hover:text-site-primary"
            aria-label="Close"
          >
            <X size={16} aria-hidden />
          </button>

          <div className="border-b border-site-accent-dark/10 bg-gradient-to-br from-[#fff8ef] to-white px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-site-accent/15 px-2.5 py-1 font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-accent-dark">
              <Gift size={12} aria-hidden />
              Free webinar
            </span>
            <h2 id="free-webinar-modal-title" className={`${MODAL_TITLE} !text-base sm:!text-lg`}>
              Want to join free webinar?
            </h2>
            <p className={`${MODAL_HINT} !mt-1.5 !text-xs sm:!text-sm`}>
              Our paid masterclass is ₹99. Leave your details and we&apos;ll notify you when a complimentary session is scheduled.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 px-5 py-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="free-webinar-name" className={MODAL_LABEL}>
                Full name
              </label>
              <input
                id="free-webinar-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className={MODAL_INPUT}
              />
            </div>
            <div>
              <label htmlFor="free-webinar-email" className={MODAL_LABEL}>
                Email
              </label>
              <input
                id="free-webinar-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                className={MODAL_INPUT}
              />
            </div>
            <div>
              <label htmlFor="free-webinar-phone" className={MODAL_LABEL}>
                Mobile number
              </label>
              <input
                id="free-webinar-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                className={MODAL_INPUT}
              />
            </div>
            <button type="submit" className={MODAL_SUBMIT} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Notify me about free webinars'}
            </button>
          </form>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}
