import { Link } from 'react-router-dom';

const CONTAINER = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';

/** Matches site nav — no default blue/underline on links */
const LINK =
  'font-semibold !text-site-accent-dark !no-underline decoration-transparent transition visited:!text-site-accent-dark hover:!text-site-accent hover:!no-underline';

const CHANNEL_ICON = {
  'fa-phone-alt': 'bg-emerald-50 text-emerald-700',
  'fa-envelope': 'bg-sky-50 text-sky-700',
  'fa-map-marker-alt': 'bg-amber-50 text-amber-800',
};

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0f02] via-[#5c2d12] to-[#8b4a1e] py-8 text-center sm:py-10 lg:py-12">
      <span className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#c8832a]/15 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#c8832a]/10 blur-3xl" aria-hidden="true" />
      <div className={`${CONTAINER} relative z-10`}>
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[#f5c98d]">
          We&apos;re here to help
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Get in <span className="text-[#f0d4b5]">Touch</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
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
    <div className="flex items-start gap-2.5 rounded-lg border border-[#ead8c6] bg-white p-2.5 shadow-sm transition duration-200 hover:border-site-accent/40 hover:shadow-md sm:gap-3 sm:p-3">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs sm:h-8 sm:w-8 sm:rounded-lg sm:text-sm ${iconTone}`}>
        <i className={`fas ${channel.icon}`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-sm font-bold leading-tight text-site-primary">{channel.title}</h3>
        <p className="mt-0.5 truncate text-xs font-semibold text-site-text sm:whitespace-normal">{value}</p>
        <p className="mt-0.5 text-[0.6875rem] leading-snug text-site-muted">{channel.hint}</p>
      </div>
    </div>
  );

  if (channel.href) {
    return (
      <a
        href={channel.href(value)}
        className="block !text-inherit !no-underline decoration-transparent visited:!text-inherit hover:!no-underline"
      >
        {card}
      </a>
    );
  }

  return card;
}

const INPUT =
  'w-full rounded-lg border border-[#d9c3a8] bg-[#fffcf8] px-2.5 py-2 text-sm font-medium text-site-text outline-none transition focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/15 sm:px-3';

const LABEL =
  'mb-0.5 flex items-center gap-1 text-[0.6875rem] font-semibold tracking-normal text-site-muted sm:text-xs';

export function ContactForm({ formData, isSubmitting, onChange, onSubmit }) {
  return (
    <div className="rounded-lg border border-[#ead8c6] bg-white p-3 shadow-sm sm:rounded-xl sm:p-4">
      <div className="mb-3 border-b border-[#ead8c6]/80 pb-3">
        <h3 className="font-heading text-base font-bold text-site-primary sm:text-lg">Send us a Message</h3>
        <p className="mt-0.5 text-[0.6875rem] text-site-muted sm:text-xs">
          Fill out the form and we&apos;ll get back to you within 24 hours
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-2.5 sm:space-y-3">
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          <div>
            <label className={LABEL} htmlFor="contact-name">
              <i className="fas fa-user text-[0.625rem]" aria-hidden="true" />
              Full name <span className="text-red-500">*</span>
            </label>
            <input id="contact-name" type="text" name="name" value={formData.name} onChange={onChange} required placeholder="Your full name" className={INPUT} />
          </div>
          <div>
            <label className={LABEL} htmlFor="contact-phone">
              <i className="fas fa-phone text-[0.625rem]" aria-hidden="true" />
              Phone <span className="text-red-500">*</span>
            </label>
            <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={onChange} required placeholder="10-digit mobile" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL} htmlFor="contact-email">
            <i className="fas fa-envelope text-[0.625rem]" aria-hidden="true" />
            Email <span className="text-red-500">*</span>
          </label>
          <input id="contact-email" type="email" name="email" value={formData.email} onChange={onChange} required placeholder="you@example.com" className={INPUT} />
        </div>

        <div>
          <label className={LABEL} htmlFor="contact-message">
            <i className="fas fa-comment-dots text-[0.625rem]" aria-hidden="true" />
            Message <span className="text-red-500">*</span>
          </label>
          <textarea id="contact-message" name="message" rows={3} value={formData.message} onChange={onChange} required placeholder="How can we help?" className={`${INPUT} min-h-[5.5rem] resize-y`} />
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-[#fffaf4] px-2.5 py-2 text-[0.6875rem] leading-snug text-site-muted sm:text-xs">
          <input type="checkbox" id="consent" name="consent" required className="mt-0.5 accent-site-accent" />
          <label htmlFor="consent">
            <span className="text-red-500">*</span> I agree to the{' '}
            <Link to="/privacy-policy" className={LINK}>
              Privacy Policy
            </Link>{' '}
            and consent to DS Astrology contacting me via phone, email, and WhatsApp.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-site-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-site-accent-dark disabled:opacity-70"
        >
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

export { CONTAINER as CONTACT_CONTAINER, LINK as CONTACT_LINK };
