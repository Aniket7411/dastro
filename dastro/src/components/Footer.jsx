import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { CONTACT_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contactInfo';
import { SITE_LOGO, SITE_LOGO_ALT, SITE_NAME_LLP } from '../utils/brandAssets';
import { PAGE_WRAP, TW_BODY_SM, TW_H3 } from '../utils/siteTokens';

const VisaSVG = () => (
  <svg viewBox="0 0 80 28" height="22" xmlns="http://www.w3.org/2000/svg">
    <text
      x="4"
      y="22"
      fontFamily="'Times New Roman', Georgia, serif"
      fontWeight="700"
      fontStyle="italic"
      fontSize="24"
      fill="#1A1F71"
      letterSpacing="1"
    >
      VISA
    </text>
  </svg>
);

const MastercardSVG = () => (
  <svg viewBox="0 0 90 44" height="30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="16" fill="#EB001B" />
    <circle cx="52" cy="18" r="16" fill="#F79E1B" />
    <path d="M40 5.5a16 16 0 0 1 0 25 16 16 0 0 1 0-25z" fill="#FF5F00" />
    <text x="45" y="40" fontFamily="Arial" fontWeight="600" fontSize="9" fill="#555" textAnchor="middle">
      Mastercard
    </text>
  </svg>
);

const MaestroSVG = () => (
  <svg viewBox="0 0 90 44" height="30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="16" fill="#EB001B" />
    <circle cx="52" cy="18" r="16" fill="#00A2E1" />
    <path d="M40 5.5a16 16 0 0 1 0 25 16 16 0 0 1 0-25z" fill="#7B4EA0" opacity="0.85" />
    <text x="45" y="40" fontFamily="Arial" fontWeight="600" fontSize="9" fill="#555" textAnchor="middle">
      maestro
    </text>
  </svg>
);

const AmexSVG = () => (
  <svg viewBox="0 0 100 40" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="40" rx="2" fill="#016FD0" />
    <text x="50" y="26" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="white" textAnchor="middle">
      AMEX
    </text>
  </svg>
);

const BhimUpiSVG = () => (
  <svg viewBox="0 0 110 36" height="22" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,30 14,10 22,30" fill="#00B0EF" />
    <polygon points="10,30 18,14 26,30" fill="#F7941D" opacity="0.85" />
    <text x="30" y="24" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#00B0EF">
      BHIM
    </text>
    <text x="72" y="24" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#F7941D">
      UPI
    </text>
  </svg>
);

const GPaySVG = () => (
  <svg viewBox="0 0 90 30" height="22" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="22" fontFamily="Arial" fontWeight="700" fontSize="17" fill="#4285F4">
      G
    </text>
    <text x="15" y="22" fontFamily="Arial" fontWeight="400" fontSize="16" fill="#5F6368">
      Pay
    </text>
  </svg>
);

const NetBankingSVG = () => (
  <svg viewBox="0 0 80 32" height="20" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="13" fontFamily="Arial" fontWeight="700" fontSize="12" fill="#1A1F71">
      NET
    </text>
    <text x="2" y="28" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#1A1F71">
      Banking
    </text>
  </svg>
);

const EMISVG = () => (
  <svg viewBox="0 0 52 26" height="18" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="20" fontFamily="Arial" fontWeight="900" fontSize="17" fill="#2D2D2D">
      EMI
    </text>
  </svg>
);

const FOOTER_HEADING =
  'font-heading text-xl font-bold text-site-text after:mt-2.5 after:block after:h-0.5 after:w-8 after:rounded after:bg-site-accent-dark';

const FOOTER_LINK =
  'text-[15px] font-medium text-site-muted no-underline transition hover:text-site-accent-dark md:hover:translate-x-1';

const IMPORTANT_LINK =
  'inline-flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-site-accent-dark/25';

const PAY_PILL =
  'flex h-11 min-w-16 items-center justify-center rounded-md border border-site-border bg-site-surface px-3 shadow-[0_1px_3px_rgba(51,37,26,0.06)] transition hover:-translate-y-px hover:shadow-[0_3px_10px_rgba(51,37,26,0.1)]';

function PaymentPills({ compact = false }) {
  const pill = compact ? `${PAY_PILL} h-10 min-w-[58px] px-2.5` : PAY_PILL;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className={pill}>
        <VisaSVG />
      </div>
      <div className={pill}>
        <MastercardSVG />
      </div>
      <div className={pill}>
        <MaestroSVG />
      </div>
      <div className={`${pill} bg-[#016FD0]`}>
        <AmexSVG />
      </div>
      <div className={pill}>
        <BhimUpiSVG />
      </div>
      <div className={`${pill} min-w-[72px]`}>
        <GPaySVG />
      </div>
      <div className={`${pill} min-w-[70px]`}>
        <NetBankingSVG />
      </div>
      <div className={`${pill} min-w-[52px]`}>
        <EMISVG />
      </div>
    </div>
  );
}

function SocialCircles({ links }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {links.map((s) => (
        <a
          key={s.name}
          href={s.link}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
          style={{ background: s.color }}
          title={s.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

function NewsletterForm({ email, setEmail, loading, onSubmit, idPrefix = 'footer' }) {
  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xs">
      <input
        id={`${idPrefix}-email`}
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 rounded-l-lg border border-site-border bg-site-surface px-3.5 py-2.5 font-body text-sm text-site-text outline-none focus:border-site-accent-dark"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-r-lg border-0 bg-site-primary px-5 py-2.5 font-body text-sm font-semibold text-site-cream transition hover:bg-[#241a12] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Wait...' : 'Subscribe'}
      </button>
    </form>
  );
}

function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [authState, setAuthState] = useState({ isStudent: false, isAdmin: false, isCounsellor: false });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const syncAuthState = useCallback(() => {
    setAuthState({
      isStudent: Boolean(localStorage.getItem('studentToken')),
      isAdmin: Boolean(localStorage.getItem('adminToken')),
      isCounsellor: Boolean(localStorage.getItem('counsellorToken')),
    });
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/newsletter/subscribe`, { email });
      if (!isMounted.current) return;
      if (data.success) {
        toast.success(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.message || 'Subscription failed.');
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error(error.response?.data?.message || 'Network error. Please try again.');
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [syncAuthState]);

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: '#0084FF',
      link: settings?.facebookUrl || '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.777 6.977 6.977 1.28.058 1.688.072 4.947.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.773-2.618 6.977-6.977.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-4.354-2.618-6.773-6.977-6.977C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
      color: '#E1306C',
      link: settings?.instagramUrl || '#',
    },
    {
      name: 'X',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: '#000000',
      link: settings?.twitterUrl || '#',
    },
    {
      name: 'YouTube',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: '#FF0000',
      link: settings?.youtubeUrl || '#',
    },
    {
      name: 'WhatsApp',
      icon: <i className="fab fa-whatsapp text-xl" />,
      color: '#25D366',
      link: settings?.whatsappNumber
        ? `https://wa.me/${settings.whatsappNumber}`
        : `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  ];

  const quickLinks = (
    <>
      <li>
        <Link to="/" className={FOOTER_LINK}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/courses" className={FOOTER_LINK}>
          Courses
        </Link>
      </li>
      <li>
        <Link to="/book-consultation" className={FOOTER_LINK}>
          Book a Consultation
        </Link>
      </li>
      <li>
        <Link to="/live" className={FOOTER_LINK}>
          Live Astrologers
        </Link>
      </li>
      <li>
        <Link to={authState.isStudent ? '/dashboard' : '/login'} className={FOOTER_LINK}>
          {authState.isStudent ? 'Student Dashboard' : 'Student Login'}
        </Link>
      </li>
      <li>
        <Link to={authState.isCounsellor ? '/counsellor/desk' : '/counsellor/login'} className={FOOTER_LINK}>
          {authState.isCounsellor ? 'Counsellor Desk' : 'Counsellor Login'}
        </Link>
      </li>
      {authState.isAdmin && (
        <li>
          <Link to="/admin" className={FOOTER_LINK}>
            Admin Dashboard
          </Link>
        </li>
      )}
      <li>
        <Link to="/blog" className={FOOTER_LINK}>
          Blog
        </Link>
      </li>
    </>
  );

  const importantLinks = (
    <>
      <li>
        <Link to="/about" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          About Us
        </Link>
      </li>
      <li>
        <Link to="/contact" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          Contact Us
        </Link>
      </li>
      <li>
        <Link to="/privacy-policy" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          Privacy Policy
        </Link>
      </li>
      <li>
        <Link to="/terms-and-conditions" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          Terms &amp; Conditions
        </Link>
      </li>
      <li>
        <Link to="/refund-policy" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          Refund Policy
        </Link>
      </li>
      <li>
        <Link to="/careers" className={`${FOOTER_LINK} ${IMPORTANT_LINK}`}>
          Careers
        </Link>
      </li>
    </>
  );

  const contactItems = (
    <>
      <li className="flex items-center gap-2.5 text-[15px] text-site-muted">
        <i className="fas fa-phone-alt text-site-accent-dark" />
        <span>{settings?.contactPhone || CONTACT_PHONE_DISPLAY}</span>
      </li>
      <li className="flex items-center gap-2.5 text-[15px] text-site-muted">
        <i className="fas fa-envelope text-site-accent-dark" />
        <span>info@dsastroinstitute.com</span>
      </li>
      <li className="mt-1 flex items-start gap-2.5 text-[15px] text-site-muted">
        <i className="fas fa-map-marker-alt mt-1 text-site-accent-dark" />
        <span>
          D321, Vibhuti Khand
          <br />
          Lucknow, UP-226010
        </span>
      </li>
    </>
  );

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-site-border bg-site-bg font-body text-site-text">
      <div
        className="h-1 bg-gradient-to-r from-site-primary via-site-accent-dark to-site-primary"
        aria-hidden
      />

      {/* Desktop */}
      <div className={`${PAGE_WRAP} hidden py-12 pb-8 md:block`}>
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-[1.8fr_1fr_1fr_1.35fr] lg:gap-[2.125rem]">
          <div className="md:col-span-3 lg:col-span-1">
            <Link to="/" className="mb-5 inline-flex items-center no-underline">
              <img
                className="block h-[clamp(5rem,8vw,6.5rem)] w-[clamp(5rem,8vw,6.5rem)] object-contain"
                src={SITE_LOGO}
                alt={SITE_LOGO_ALT}
              />
            </Link>
            <p className={`mb-4 max-w-xs ${TW_BODY_SM}`}>
              India&apos;s trusted platform for live astrology courses, personalised consultations
              &amp; astrology products.
            </p>
            <div className="mt-2.5 max-w-xs">
              <p className={`${TW_H3} mb-2.5 text-base`}>Subscribe to our Newsletter</p>
              <NewsletterForm
                email={email}
                setEmail={setEmail}
                loading={loading}
                onSubmit={handleSubscribe}
              />
            </div>
          </div>

          <div>
            <h5 className={`${FOOTER_HEADING} mb-6`}>Quick Links</h5>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{quickLinks}</ul>
          </div>

          <div>
            <h5 className={`${FOOTER_HEADING} mb-6`}>Important Links</h5>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{importantLinks}</ul>
          </div>

          <div>
            <h5 className={`${FOOTER_HEADING} mb-6`}>Contact Info</h5>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{contactItems}</ul>
          </div>
        </div>
      </div>

      {/* Desktop trust row */}
      <div className={`${PAGE_WRAP} hidden border-b border-site-border pb-10 pt-2 md:flex md:items-center md:justify-between md:gap-10`}>
        <div className="flex flex-col gap-3.5">
          <p className="m-0 text-[15px] font-semibold text-site-muted">Follow Us On</p>
          <SocialCircles links={socialLinks} />
        </div>
        <div className="flex flex-col items-end gap-3.5">
          <p className="m-0 text-[15px] font-semibold text-site-muted">We Accept Secure Payment</p>
          <PaymentPills />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-6 px-5 py-8 md:hidden">
        <Link to="/" className="inline-flex items-center no-underline">
          <img className="block h-[5rem] w-[5rem] object-contain" src={SITE_LOGO} alt={SITE_LOGO_ALT} />
        </Link>

        <p className={`m-0 ${TW_BODY_SM}`}>
          India&apos;s trusted platform for live astrology courses, personalised consultations
          &amp; astrology products.
        </p>

        <div className="w-full">
          <p className={`${FOOTER_HEADING} mb-1 text-base`}>Newsletter</p>
          <NewsletterForm
            idPrefix="footer-mobile"
            email={email}
            setEmail={setEmail}
            loading={loading}
            onSubmit={handleSubscribe}
          />
        </div>

        <div className="h-px w-full bg-site-border" />

        <div className="grid grid-cols-2 gap-7">
          <div>
            <p className={`${FOOTER_HEADING} mb-3.5 text-[15px]`}>Quick Links</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {quickLinks}
            </ul>
          </div>
          <div>
            <p className={`${FOOTER_HEADING} mb-3.5 text-[15px]`}>Important</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {importantLinks}
            </ul>
          </div>
        </div>

        <div>
          <p className={`${FOOTER_HEADING} mb-3.5 text-[15px]`}>Contact Info</p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li className="flex items-start gap-2 text-sm text-site-muted">
              <i className="fas fa-phone-alt mt-0.5 text-site-accent-dark" />
              <span>{settings?.contactPhone || CONTACT_PHONE_DISPLAY}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-site-muted">
              <i className="fas fa-envelope mt-0.5 text-site-accent-dark" />
              <span className="break-all">info@dsastroinstitute.com</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-site-muted">
              <i className="fas fa-map-marker-alt mt-0.5 text-site-accent-dark" />
              <span>
                D321, Vibhuti Khand
                <br />
                Lucknow, UP-226010
              </span>
            </li>
          </ul>
        </div>

        <div className="h-px w-full bg-site-border" />

        <div className="flex flex-col gap-3.5">
          <p className="m-0 text-[15px] font-semibold text-site-text">Follow Us On</p>
          <SocialCircles links={socialLinks} />
        </div>

        <div className="flex flex-col gap-3.5">
          <p className="m-0 text-[15px] font-semibold text-site-text">We Accept Secure Payment</p>
          <PaymentPills compact />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-site-border/60 bg-site-sand px-4 py-4 sm:px-6">
        <div className={`${PAGE_WRAP} !px-0 flex flex-col items-center justify-between gap-3 text-sm text-site-muted md:flex-row`}>
          <p className="m-0 text-center md:text-left">
            &copy; {currentYear} {SITE_NAME_LLP}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/privacy-policy" className="font-semibold text-site-accent-dark no-underline hover:text-site-primary">
              Privacy Policy
            </Link>
            <span className="text-site-accent-dark/50">|</span>
            <Link
              to="/terms-and-conditions"
              className="font-semibold text-site-accent-dark no-underline hover:text-site-primary"
            >
              Terms &amp; Conditions
            </Link>
            <span className="text-site-accent-dark/50">|</span>
            <Link to="/refund-policy" className="font-semibold text-site-accent-dark no-underline hover:text-site-primary">
              Refund &amp; Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
