import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { CONTACT_PHONE_DISPLAY } from '../utils/contactInfo';
import {
  CONTACT_CONTAINER,
  CONTACT_LINK,
  ContactChannelCard,
  ContactForm,
  ContactHero,
} from '../components/contact/ContactSections';

const contactChannels = [
  {
    icon: 'fa-phone-alt',
    title: 'Call Us',
    valueKey: 'contactPhone',
    href: (value) => `tel:${value.replace(/[\s-]/g, '')}`,
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
  { label: 'Name', value: 'Ananya Singh' },
  { label: 'Email', value: 'help@dsastroinstitute.com', href: 'mailto:help@dsastroinstitute.com' },
  { label: 'Phone', value: CONTACT_PHONE_DISPLAY, href: `tel:${CONTACT_PHONE_DISPLAY.replace(/[\s-]/g, '')}` },
  { label: 'Address', value: 'D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010' },
  { label: 'Response time', value: 'Within 7 working days' },
];

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
    contactPhone: settings?.contactPhone || CONTACT_PHONE_DISPLAY,
    contactEmail: settings?.contactEmail || 'info@dsastroinstitute.com',
    address: settings?.address || 'Varanasi, Uttar Pradesh, India',
  };

  return (
    <div className="contact-page min-h-screen w-full bg-site-bg font-body text-site-text [&_a]:decoration-transparent [&_a]:no-underline [&_a:visited]:text-inherit">
      <SEO
        title="Contact Us"
        description="Get in touch with DS Institute for astrology consultations and courses."
        url="/contact"
      />

      <ContactHero />

      <section className="py-6 sm:py-8 lg:py-10">
        <div className={CONTACT_CONTAINER}>
          <div className="mb-5 grid gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 lg:gap-3">
            {contactChannels.map((channel) => (
              <ContactChannelCard
                key={channel.title}
                channel={channel}
                value={channelValues[channel.valueKey]}
              />
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8c6] bg-[#fff7ed] px-2 py-0.5 text-[0.625rem] font-bold text-site-accent-dark sm:px-2.5 sm:py-1 sm:text-[0.6875rem]">
                <i className="fas fa-heart" aria-hidden="true" />
                Why Choose Us
              </span>
              <h2 className="mt-2 font-heading text-xl font-extrabold leading-tight text-site-primary sm:mt-3 sm:text-2xl lg:text-3xl">
                We&apos;re Here to
                <br />
                Support You
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-site-muted">
                Whether you need help choosing a course, booking a consultation, or understanding a
                remedy — our dedicated advisors are ready to assist you with personalized guidance.
              </p>

              <ul className="mt-4 space-y-2">
                {supportHighlights.map((item) => (
                  <li key={item.text} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#fff7ed] text-xs text-site-accent">
                      <i className={`fas ${item.icon}`} aria-hidden="true" />
                    </span>
                    <p className="text-xs font-medium leading-snug text-site-muted sm:text-sm">{item.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-lg border border-[#ead8c6] bg-white p-3 shadow-sm sm:mt-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fff7ed] text-xs text-site-accent">
                    <i className="fas fa-user-shield" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-sm font-bold text-site-primary sm:text-base">Grievance Officer</h3>
                </div>
                <dl className="space-y-1.5">
                  {grievanceDetails.map(({ label, value, href }) => (
                    <div key={label} className="grid gap-0.5 text-[0.6875rem] sm:grid-cols-[6.5rem_1fr] sm:gap-2 sm:text-xs">
                      <dt className="font-bold text-site-primary">{label}</dt>
                      <dd className="m-0 text-site-muted">
                        {href ? (
                          <a href={href} className={CONTACT_LINK}>
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Link
                to="/book-consultation"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-site-accent-dark/20 bg-white px-3 py-1.5 text-xs font-bold text-site-accent-dark !no-underline shadow-sm transition hover:border-site-accent hover:bg-[#fffaf4] hover:!text-site-accent-dark sm:mt-5 sm:px-4 sm:py-2 sm:text-sm"
              >
                Prefer a consultation instead?
                <span className="text-site-accent">Book a session →</span>
              </Link>
            </div>

            <ContactForm
              formData={formData}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
