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
  ['Name', 'Ananya Singh'],
  ['Email', 'help@dsastroinstitute.com'],
  ['Phone', CONTACT_PHONE_DISPLAY],
  ['Address', 'D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010'],
  ['Response time', 'Within 7 working days'],
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
    <div className="min-h-screen w-full bg-site-bg font-body text-site-text">
      <SEO
        title="Contact Us"
        description="Get in touch with DS Institute for astrology consultations and courses."
        url="/contact"
      />

      <ContactHero />

      <section className="py-8 sm:py-10 lg:py-12">
        <div className={CONTACT_CONTAINER}>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {contactChannels.map((channel) => (
              <ContactChannelCard
                key={channel.title}
                channel={channel}
                value={channelValues[channel.valueKey]}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8c6] bg-[#fff7ed] px-2.5 py-1 text-[0.6875rem] font-bold text-site-accent-dark">
                <i className="fas fa-heart" aria-hidden="true" />
                Why Choose Us
              </span>
              <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-site-primary sm:text-3xl">
                We&apos;re Here to
                <br />
                Support You
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-site-muted sm:text-base">
                Whether you need help choosing a course, booking a consultation, or understanding a
                remedy — our dedicated advisors are ready to assist you with personalized guidance.
              </p>

              <ul className="mt-4 space-y-2">
                {supportHighlights.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-sm text-site-accent">
                      <i className={`fas ${item.icon}`} aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium leading-snug text-site-muted">{item.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-[#ead8c6] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-sm text-site-accent">
                    <i className="fas fa-user-shield" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-base font-bold text-site-primary">Grievance Officer</h3>
                </div>
                <div className="space-y-1.5">
                  {grievanceDetails.map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-0.5 text-xs sm:flex-row sm:gap-2 sm:text-sm">
                      <span className="font-bold text-site-primary">{label}:</span>
                      <span className="text-site-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/book-consultation" className="mt-4 inline-block text-sm font-semibold text-site-accent hover:text-site-accent-dark">
                Prefer a consultation instead? Book a session →
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
