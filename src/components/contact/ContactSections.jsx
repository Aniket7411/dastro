import { Link } from 'react-router-dom';

const CONTAINER = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0f02] via-[#5c2d12] to-[#8b4a1e] py-8 text-center sm:py-10 lg:py-12">
      <span className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#c8832a]/15 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#c8832a]/10 blur-3xl" aria-hidden="true" />
      <div className={`${CONTAINER} relative z-10`}>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Get in <span className="text-[#f0d4b5]">Touch</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          Have questions about our courses or consultations? We&apos;re here to help you on your
          astrological journey.
        </p>
      </div>
    </section>
  );
}

export function ContactChannelCard({ channel, value }) {
  const card = (
    <div className="flex h-full flex-col rounded-xl border border-[#ead8c6] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-site-accent hover:shadow-md">
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-base text-site-accent">
        <i className={`fas ${channel.icon}`} aria-hidden="true" />
      </div>
      <h3 className="font-heading text-base font-bold text-site-primary">{channel.title}</h3>
      <p className="mt-1 text-sm font-semibold leading-snug text-site-text">{value}</p>
      <p className="mt-0.5 text-xs text-site-muted">{channel.hint}</p>
    </div>
  );

  if (channel.href) {
    return (
      <a href={channel.href(value)} className="block no-underline">
        {card}
      </a>
    );
  }

  return card;
}

const INPUT =
  'w-full rounded-lg border border-[#d9c3a8] bg-[#fffcf8] px-3 py-2 text-sm font-medium text-site-text outline-none focus:border-site-accent focus:bg-white focus:ring-2 focus:ring-site-accent/15';

const LABEL =
  'mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-normal text-site-muted';

export function ContactForm({ formData, isSubmitting, onChange, onSubmit }) {
  return (
    <div className="rounded-xl border border-[#ead8c6] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-bold text-site-primary sm:text-xl">Send us a Message</h3>
        <p className="mt-0.5 text-xs text-site-muted sm:text-sm">
          Fill out the form and we&apos;ll get back to you within 24 hours
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        <div className="grid gap-3 sm:grid-cols-2">
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
          <textarea id="contact-message" name="message" rows={3} value={formData.message} onChange={onChange} required placeholder="How can we help?" className={`${INPUT} resize-y`} />
        </div>

        <div className="flex items-start gap-2 text-xs leading-snug text-site-muted">
          <input type="checkbox" id="consent" name="consent" required className="mt-0.5 accent-site-accent" />
          <label htmlFor="consent">
            <span className="text-red-500">*</span> I agree to the{' '}
            <Link to="/privacy-policy" className="font-semibold text-site-accent hover:underline">
              Privacy Policy
            </Link>{' '}
            and consent to DS Institute contacting me via phone, email, and WhatsApp.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-site-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-black disabled:opacity-70"
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

export { CONTAINER as CONTACT_CONTAINER };
