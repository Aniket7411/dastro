import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { CONTACT_PHONE_DISPLAY } from '../utils/contactInfo';
import {
  PAGE_WRAP,
  SECTION_PY,
  TW_H2,
  TW_BODY,
  TW_BODY_SM,
  TW_STACK,
  TW_STACK_SM,
  SITE_BTN_OUTLINE,
} from '../utils/siteTokens';
import {
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
  // {
  //   icon: 'fa-map-marker-alt',
  //   title: 'Visit Us',
  //   valueKey: 'address',
  //   href: null,
  //   hint: 'In-person consultations by appointment',
  // },
];

const supportHighlights = [
  { icon: 'fa-clock', text: 'Average response time: within 24 hours' },
  { icon: 'fa-shield-alt', text: 'Your details are kept private and secure' },
  { icon: 'fa-headset', text: 'Dedicated support for students and clients' },
];

// const grievanceDetails = [
//   { label: 'Name', value: 'Ananya Singh' },
//   { label: 'Email', value: 'help@dsastroinstitute.com', href: 'mailto:help@dsastroinstitute.com' },
//   { label: 'Phone', value: CONTACT_PHONE_DISPLAY, href: `tel:${CONTACT_PHONE_DISPLAY.replace(/[\s-]/g, '')}` },
//   { label: 'Address', value: 'D321, Vibhuti Khand, Lucknow, Uttar Pradesh - 226010' },
//   { label: 'Response time', value: 'Within 7 working days' },
// ];

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
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with DS Astrology for astrology consultations and courses."
        url="/contact"
      />

      <ContactHero />

      <section className={SECTION_PY}>
        <div className={PAGE_WRAP}>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactChannels.map((channel) => (
              <ContactChannelCard
                key={channel.title}
                channel={channel}
                value={channelValues[channel.valueKey]}
              />
            ))}
          </div>

          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-10">
            <div className={`min-w-0 ${TW_STACK}`}>
              <div className={TW_STACK_SM}>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-site-accent-dark/14 bg-[#fff7ed] px-3 py-1 text-xs font-bold text-site-accent-dark">
                  <i className="fas fa-heart" aria-hidden="true" />
                  Why Choose Us
                </span>
                <h2 className={TW_H2}>
                  We&apos;re Here to
                  <br />
                  Support You
                </h2>
                <p className={TW_BODY}>
                  Whether you need help choosing a course, booking a consultation, or understanding a
                  remedy — our dedicated advisors are ready to assist you with personalized guidance.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {supportHighlights.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-sm text-site-accent">
                      <i className={`fas ${item.icon}`} aria-hidden="true" />
                    </span>
                    <p className={`${TW_BODY_SM} pt-1.5 font-medium`}>{item.text}</p>
                  </li>
                ))}
              </ul>

              {/* <div className="rounded-xl border border-site-accent-dark/14 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed] text-sm text-site-accent">
                    <i className="fas fa-user-shield" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-base font-bold text-site-primary sm:text-lg">
                    Grievance Officer
                  </h3>
                </div>
                <dl className="flex flex-col gap-2">
                  {grievanceDetails.map(({ label, value, href }) => (
                    <div key={label} className="grid gap-0.5 text-sm sm:grid-cols-[7rem_1fr] sm:gap-3">
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
              </div> */}

              <Link to="/book-consultation" className={`${SITE_BTN_OUTLINE} w-fit`}>
                Prefer a consultation?
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
    </>
  );
}

export default Contact;
