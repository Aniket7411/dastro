import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

const WRAP = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';

const contactChannels = [
  {
    icon: 'fa-phone-alt',
    title: 'Call Us',
    valueKey: 'contactPhone',
    href: (value) => `tel:${value.replace(/\s/g, '')}`,
    hint: 'Mon–Sat, 10 AM – 7 PM IST',
  },
  {
    icon: 'fa-envelope',
    title: 'Email Us',
    valueKey: 'contactEmail',
    href: (value) => `mailto:${value}`,
    hint: 'We reply within 24 hours',
  },
  {
    icon: 'fa-map-marker-alt',
    title: 'Visit Us',
    valueKey: 'address',
    href: null,
    hint: 'In-person consultations by appointment',
  },
];

const supportHighlights = [
  { icon: 'fa-clock', text: 'Average response time: within 24 hours' },
  { icon: 'fa-shield-alt', text: 'Your details are kept private and secure' },
  { icon: 'fa-headset', text: 'Dedicated support for students and clients' },
];

const grievanceDetails = [
  ['Name', 'Ananya Singh'],
  ['Email', 'help@dsastroinstitute.com'],
  ['Phone', '+91 7570972970'],
  ['Address', 'D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010'],
  ['Response time', 'Within 7 working days'],
];

function ChannelCard({ channel, value }) {
  const card = (
    <div className="flex h-full flex-col rounded-2xl border border-[#ead8c6] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-site-accent hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff7ed] text-lg text-site-accent">
        <i className={`fas ${channel.icon}`} aria-hidden="true" />
      </div>
      <h3 className="font-heading text-lg font-bold text-site-primary">{channel.title}</h3>
      <p className="mt-2 text-sm font-semibold text-site-text">{value}</p>
      <p className="mt-1 text-xs text-site-muted">{channel.hint}</p>
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

function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type: 'Contact',
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Message sent! We will contact you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error(`Network Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const channelValues = {
    contactPhone: settings?.contactPhone || '+91 75709 72970',
    contactEmail: settings?.contactEmail || 'info@dsastroinstitute.com',
    address: settings?.address || 'Varanasi, Uttar Pradesh, India',
  };

  const inputCls =
    'w-full rounded-xl border border-[#d9c3a8] bg-[#fffcf8] px-4 py-3 text-sm font-medium text-site-text outline-none focus:border-site-accent focus:bg-white focus:ring-4 focus:ring-site-accent/15';

  return (
    <div className="min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO
        title="Contact Us"
        description="Get in touch with DS Institute for astrology consultations and courses."
        url="/contact"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0f02] via-[#5c2d12] to-[#8b4a1e] py-12 text-center sm:py-16 lg:py-20">
        <span className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#c8832a]/15 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#c8832a]/10 blur-3xl" aria-hidden="true" />
        <div className={`${WRAP} relative z-10`}>
          <h1 className="font-heading text-4xl font-extrabold text-white sm:text-5xl">
            Get in <span className="text-[#f0d4b5]">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Have questions about our courses or consultations? We&apos;re here to help you on your
            astrological journey.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 lg:py-16">
        <div className={WRAP}>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {contactChannels.map((channel) => (
              <ChannelCard
                key={channel.title}
                channel={channel}
                value={channelValues[channel.valueKey]}
              />
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ead8c6] bg-[#fff7ed] px-3 py-1.5 text-xs font-bold text-site-accent-dark">
                <i className="fas fa-heart" aria-hidden="true" />
                Why Choose Us
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-site-primary sm:text-4xl">
                We&apos;re Here to
                <br />
                Support You
              </h2>
              <p className="mt-4 text-base leading-relaxed text-site-muted">
                Whether you need help choosing a course, booking a consultation, or understanding a
                remedy — our dedicated advisors are ready to assist you with personalized guidance.
              </p>

              <ul className="mt-6 space-y-3">
                {supportHighlights.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-site-accent">
                      <i className={`fas ${item.icon}`} aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-site-muted">{item.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-[#ead8c6] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7ed] text-site-accent">
                    <i className="fas fa-user-shield" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-site-primary">Grievance Officer</h3>
                </div>
                <div className="space-y-2">
                  {grievanceDetails.map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2">
                      <span className="font-bold text-site-primary">{label}:</span>
                      <span className="text-site-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/book-consultation" className="mt-6 inline-block text-sm font-bold text-site-accent hover:text-site-accent-dark">
                Prefer a consultation instead? Book a session →
              </Link>
            </div>

            <div className="rounded-2xl border border-[#ead8c6] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-site-primary">Send us a Message</h3>
                <p className="mt-1 text-sm text-site-muted">
                  Fill out the form and we&apos;ll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-site-muted" htmlFor="contact-name">
                      <i className="fas fa-user" aria-hidden="true" />
                      Full Name *
                    </label>
                    <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-site-muted" htmlFor="contact-phone">
                      <i className="fas fa-phone" aria-hidden="true" />
                      Phone Number *
                    </label>
                    <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit mobile number" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-site-muted" htmlFor="contact-email">
                    <i className="fas fa-envelope" aria-hidden="true" />
                    Email Address *
                  </label>
                  <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputCls} />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-site-muted" htmlFor="contact-message">
                    <i className="fas fa-comment-dots" aria-hidden="true" />
                    Message *
                  </label>
                  <textarea id="contact-message" name="message" rows={4} value={formData.message} onChange={handleChange} required placeholder="Tell us how we can help you..." className={`${inputCls} resize-y`} />
                </div>

                <div className="flex items-start gap-3 text-xs leading-relaxed text-site-muted">
                  <input type="checkbox" id="consent" name="consent" required className="mt-1 accent-site-accent" />
                  <label htmlFor="consent">
                    I agree to the{' '}
                    <Link to="/privacy-policy" className="font-bold text-site-accent hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and consent to DS Institute contacting me via phone, email, and WhatsApp.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-site-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" aria-hidden="true" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
