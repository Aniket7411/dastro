import { Link } from 'react-router-dom';
import {
  PAGE_WRAP,
  TW_H1,
  TW_H2,
  TW_BODY,
  TW_BODY_SM,
  TW_FIELD,
  TW_FIELD_LABEL,
  TW_FIELD_INPUT,
  SITE_BTN_PRIMARY,
} from '../../utils/siteTokens';
import PhoneInput from '../PhoneInput';

/** Accent links inside contact content */
const LINK =
  'font-semibold text-site-accent-dark no-underline transition hover:text-site-accent';

const CHANNEL_ICON = {
  'fa-phone-alt': 'bg-emerald-50 text-emerald-700',
  'fa-envelope': 'bg-sky-50 text-sky-700',
  'fa-map-marker-alt': 'bg-amber-50 text-amber-800',
};

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0f02] via-[#5c2d12] to-[#8b4a1e] py-10 text-center sm:py-12 lg:py-14">
      <span className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#c8832a]/15 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#c8832a]/10 blur-3xl" aria-hidden="true" />
      <div className={`${PAGE_WRAP} relative z-10 flex flex-col items-center gap-3`}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f5c98d]">
          We&apos;re here to help
        </span>
        <h1 className={`${TW_H1} text-white`}>
          Get in <span className="text-[#f0d4b5]">Touch</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          Have questions about our courses or consultations? Reach out and we&apos;ll guide you on your
          astrological journey.
        </p>
      </div>
    </section>
  );
}

export function ContactChannelCard({ channel, value }) {
  const iconTone = CHANNEL_ICON[channel.icon] || 'bg-[#fff7ed] text-site-accent';

  const card = (
    <div className="flex items-start gap-3 rounded-xl border border-site-accent-dark/14 bg-white p-4 shadow-sm transition duration-200 hover:border-site-accent/40 hover:shadow-md">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${iconTone}`}
      >
        <i className={`fas ${channel.icon}`} aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="font-heading text-sm font-bold leading-tight text-site-primary sm:text-base">
          {channel.title}
        </h3>
        <p className="truncate text-sm font-semibold text-site-text sm:whitespace-normal">{value}</p>
        <p className={TW_BODY_SM}>{channel.hint}</p>
      </div>
    </div>
  );

  if (channel.href) {
    return (
      <a href={channel.href(value)} className="block text-inherit no-underline hover:no-underline">
        {card}
      </a>
    );
  }

  return card;
}

export function ContactForm({ formData, isSubmitting, onChange, onSubmit }) {
  return (
    <div className="rounded-xl border border-site-accent-dark/14 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-1 border-b border-site-accent-dark/10 pb-4">
        <h3 className="font-heading text-lg font-bold text-site-primary sm:text-xl">Send us a Message</h3>
        <p className={TW_BODY_SM}>Fill out the form and we&apos;ll get back to you within 24 hours</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={TW_FIELD}>
            <label className={TW_FIELD_LABEL} htmlFor="contact-name">
              <i className="fas fa-user text-xs" aria-hidden="true" />
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder="Your full name"
              className={TW_FIELD_INPUT}
            />
          </div>
          <div className={TW_FIELD}>
            <label className={TW_FIELD_LABEL} htmlFor="contact-phone">
              <i className="fas fa-phone text-xs" aria-hidden="true" />
              Phone <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              id="contact-phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              required
              placeholder="10-digit mobile"
              className={TW_FIELD_INPUT}
            />
          </div>
        </div>

        <div className={TW_FIELD}>
          <label className={TW_FIELD_LABEL} htmlFor="contact-email">
            <i className="fas fa-envelope text-xs" aria-hidden="true" />
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="you@example.com"
            className={TW_FIELD_INPUT}
          />
        </div>

        <div className={TW_FIELD}>
          <label className={TW_FIELD_LABEL} htmlFor="contact-message">
            <i className="fas fa-comment-dots text-xs" aria-hidden="true" />
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={onChange}
            required
            placeholder="How can we help?"
            className={`${TW_FIELD_INPUT} min-h-[6.5rem] resize-y`}
          />
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-[#fffaf4] px-3 py-3">
          <input type="checkbox" id="consent" name="consent" required className="mt-1 accent-site-accent" />
          <label htmlFor="consent" className={`${TW_BODY_SM} cursor-pointer`}>
            <span className="text-red-500">*</span> I agree to the{' '}
            <Link to="/privacy-policy" className={LINK}>
              Privacy Policy
            </Link>{' '}
            and consent to DS Astrology contacting me via phone, email, and WhatsApp.
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className={`${SITE_BTN_PRIMARY} w-full`}>
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane" aria-hidden="true" />
              Send message
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export { PAGE_WRAP as CONTACT_CONTAINER, LINK as CONTACT_LINK };
