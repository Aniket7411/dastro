import { Send } from 'lucide-react';
import { TYPE, BTN } from './consultation/tokens';

const REQUIRED_FIELDS = ['Name', 'Date of Birth', 'Time of Birth', 'Place of Birth', 'Consultation Type'];

export default function BookConsultationCTA({ onBookClick }) {
  return (
    <section
      className="mt-12 rounded-2xl border border-site-accent-dark/15 border-l-4 border-l-site-accent bg-gradient-to-br from-site-surface via-[#FFFBF5] to-site-bg p-6 shadow-lg md:mt-16 md:p-10"
      aria-labelledby="consult-cta-heading"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div className="text-center lg:text-left">
          <p className={TYPE.kicker}>Get Started</p>
          <h2 id="consult-cta-heading" className={`${TYPE.h2} !mt-3`}>
            Ready to book your consultation?
          </h2>
          <p className={`${TYPE.body} !mt-4 max-w-xl lg:mx-0 mx-auto`}>
            Share your birth details and preferred consultation type. Our team will contact you
            within 24 hours to confirm your session.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {REQUIRED_FIELDS.map((label) => (
              <span
                key={label}
                className="rounded-lg border border-site-accent-dark/12 bg-site-surface px-3 py-1.5 text-xs font-semibold text-site-accent-dark"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <button type="button" onClick={onBookClick} className={`${BTN.primary} ${BTN.static} min-w-[14rem]`}>
            Book Your Session
            <Send size={16} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
