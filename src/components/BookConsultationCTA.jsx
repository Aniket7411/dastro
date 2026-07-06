import { Phone, Send } from 'lucide-react';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

const REQUIRED_FIELDS = [
  'Name',
  'Date of Birth',
  'Time of Birth',
  'Place of Birth',
  'Consultation Type',
];

export default function BookConsultationCTA({ onBookClick }) {
  return (
    <section
      className="relative mt-6 rounded-2xl bg-[#fdfaf6] p-4 sm:mt-8 sm:rounded-[1.75rem] sm:p-5 lg:p-6"
      aria-labelledby="consult-cta-heading"
    >
      <div className="flex flex-col items-center gap-3 text-center lg:pr-44 xl:pr-48">
        <span className="rounded-full bg-[#f3eadd] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#3e2723]">
          Get Started
        </span>

        <div className="flex max-w-xl flex-col items-center gap-1.5">
          <h2
            id="consult-cta-heading"
            className="font-heading text-lg font-bold leading-tight text-[#2d1a12] sm:text-xl"
          >
            Ready to book your consultation?
          </h2>
          <p className="text-xs leading-relaxed text-[#5c3d26] sm:text-sm">
            Share your birth details and preferred consultation type. Our team will contact you
            within 24 hours to confirm your session.
          </p>
        </div>

        <div className="inline-flex max-w-full flex-wrap justify-center gap-1.5 sm:gap-2">
          {REQUIRED_FIELDS.map((label) => (
            <span
              key={label}
              className="rounded-md border border-[#e8dfd3] bg-white px-2 py-1 text-[0.6875rem] font-semibold text-[#3e2723] shadow-[0_1px_3px_rgba(42,15,2,0.04)] sm:px-2.5 sm:py-1.5 sm:text-xs"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center lg:absolute lg:right-5 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 xl:right-6">
        <button
          type="button"
          onClick={onBookClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1a0c04] px-5 py-2 text-xs font-bold text-white shadow-[0_3px_14px_rgba(26,12,4,0.22)] transition hover:bg-[#2d1a12] hover:shadow-[0_5px_18px_rgba(26,12,4,0.28)] active:scale-[0.98] sm:px-6 sm:py-2.5 sm:text-sm"
        >
          {ONLINE_PAYMENT_ENABLED ? 'Book Your Session' : 'Request callback'}
          {ONLINE_PAYMENT_ENABLED ? (
            <Send size={16} strokeWidth={2.25} aria-hidden />
          ) : (
            <Phone size={16} strokeWidth={2.25} aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
