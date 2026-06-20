import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { CONTACT_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contactInfo';
import { SITE_LOGO, SITE_LOGO_ALT, SITE_NAME_LLP } from '../utils/brandAssets';

// --- Pure SVG Components for Payment Methods ---

/* VISA — clean italic bold text, exact brand colours */
const VisaSVG = () => (
  <svg viewBox="0 0 80 28" height="22" xmlns="http://www.w3.org/2000/svg">
    <text
      x="4" y="22"
      fontFamily="'Times New Roman', Georgia, serif"
      fontWeight="700"
      fontStyle="italic"
      fontSize="24"
      fill="#1A1F71"
      letterSpacing="1"
    >VISA</text>
  </svg>
);

/* MASTERCARD — two overlapping circles + "Mastercard" label */
const MastercardSVG = () => (
  <svg viewBox="0 0 90 44" height="30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="16" fill="#EB001B" />
    <circle cx="52" cy="18" r="16" fill="#F79E1B" />
    {/* overlap blend */}
    <path d="M40 5.5a16 16 0 0 1 0 25 16 16 0 0 1 0-25z" fill="#FF5F00" />
    <text x="45" y="40" fontFamily="Arial" fontWeight="600" fontSize="9" fill="#555" textAnchor="middle">Mastercard</text>
  </svg>
);

/* MAESTRO — red + blue circles + "maestro" label */
const MaestroSVG = () => (
  <svg viewBox="0 0 90 44" height="30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="18" r="16" fill="#EB001B" />
    <circle cx="52" cy="18" r="16" fill="#00A2E1" />
    {/* overlap blend */}
    <path d="M40 5.5a16 16 0 0 1 0 25 16 16 0 0 1 0-25z" fill="#7B4EA0" opacity="0.85" />
    <text x="45" y="40" fontFamily="Arial" fontWeight="600" fontSize="9" fill="#555" textAnchor="middle">maestro</text>
  </svg>
);

const RuPaySVG = () => (
  <svg viewBox="0 0 100 32" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5l-5 22h6l5-22h-6z" fill="#F26522" />
    <path d="M30 5h-8l-2 9h6c4 0 6 2 6 5s-2 5-6 5h-4l-2 7h6l2-9h2c6 0 9-3 9-7.5S34.5 5 30 5z" fill="#283593" />
    <text x="45" y="24" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#1A237E" fontStyle="italic">RuPay</text>
  </svg>
);

const UPISVG = () => (
  <svg viewBox="0 0 100 32" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4h4l-3 10-3-10z" fill="#FF9933" />
    <text x="25" y="24" fontFamily="Arial" fontWeight="900" fontSize="20" fill="#2D2D2D">UPI</text>
  </svg>
);

const AmexSVG = () => (
  <svg viewBox="0 0 100 40" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="40" rx="2" fill="#016FD0" />
    <text x="50" y="26" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="white" textAnchor="middle">AMEX</text>
  </svg>
);

/* ---- NEW SVGs ---- */
const BhimUpiSVG = () => (
  <svg viewBox="0 0 110 36" height="22" xmlns="http://www.w3.org/2000/svg">
    {/* BHIM triangle logo */}
    <polygon points="6,30 14,10 22,30" fill="#00B0EF" />
    <polygon points="10,30 18,14 26,30" fill="#F7941D" opacity="0.85" />
    {/* BHIM text */}
    <text x="30" y="24" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#00B0EF">BHIM</text>
    {/* UPI text */}
    <text x="72" y="24" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#F7941D">UPI</text>
  </svg>
);

const GPaySVG = () => (
  <svg viewBox="0 0 80 28" height="22" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#5F6368">G</text>
    <text x="10" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#4285F4">o</text>
    <text x="20" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#EA4335">o</text>
    <text x="30" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#FBBC05">g</text>
    <text x="40" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#34A853">l</text>
    <text x="47" y="22" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#EA4335">e</text>
    <text x="0" y="38" fontFamily="Arial" fontWeight="700" fontSize="13" fill="#5F6368">Pay</text>
  </svg>
);

const GPayPillSVG = () => (
  <svg viewBox="0 0 90 32" height="22" xmlns="http://www.w3.org/2000/svg">
    {/* Coloured G */}
    <text x="2" y="24" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="20" fill="#4285F4">G</text>
    <text x="16" y="24" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="20" fill="#EA4335">o</text>
    <text x="29" y="24" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="20" fill="#FBBC05">o</text>
    <text x="42" y="24" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="20" fill="#34A853">g</text>
    <text x="55" y="24" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="20" fill="#EA4335">le</text>
    <text x="2" y="42" fontFamily="'Google Sans',Arial" fontWeight="700" fontSize="18" fill="#5F6368">Pay</text>
  </svg>
);

/* Google Pay compact */
const GooglePaySVG = () => (
  <svg viewBox="0 0 72 26" height="20" xmlns="http://www.w3.org/2000/svg">
    <text x="1" y="19" fontFamily="Arial" fontWeight="700" fontSize="15" fill="#4285F4">G</text>
    <text x="12" y="19" fontFamily="Arial" fontWeight="500" fontSize="14" fill="#5F6368">Pay</text>
  </svg>
);

const NetBankingSVG = () => (
  <svg viewBox="0 0 100 32" height="18" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="14" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#1A1F71">NET</text>
    <text x="2" y="28" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#1A1F71">Banking</text>
  </svg>
);

const EMISVG = () => (
  <svg viewBox="0 0 60 32" height="18" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="23" fontFamily="Arial" fontWeight="900" fontSize="18" fill="#2D2D2D">EMI</text>
  </svg>
);

function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const [authState, setAuthState] = useState({ isStudent: false, isAdmin: false });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => { return () => { isMounted.current = false; }; }, []);

  const syncAuthState = useCallback(() => {
    setAuthState({
      isStudent: Boolean(localStorage.getItem('studentToken')),
      isAdmin: Boolean(localStorage.getItem('adminToken'))
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

  // Map social links from settings
  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: '#0084FF',
      link: settings?.facebookUrl || '#'
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.777 6.977 6.977 1.28.058 1.688.072 4.947.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.773-2.618 6.977-6.977.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-4.354-2.618-6.773-6.977-6.977C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
      color: '#E1306C',
      link: settings?.instagramUrl || '#'
    },
    {
      name: 'X',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: '#000000',
      link: settings?.twitterUrl || '#'
    },
    {
      name: 'YouTube',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: '#FF0000',
      link: settings?.youtubeUrl || '#'
    },
    {
      name: 'WhatsApp',
      icon: (
        <i className="fab fa-whatsapp" style={{ fontSize: '20px' }}></i>
      ),
      color: '#25D366',
      link: settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : `https://wa.me/${WHATSAPP_NUMBER}`
    },
  ];

  return (
    <>
      <style>{`
        .fb-root { 
          background: #FDF6EE; 
          font-family: 'Jost', sans-serif; 
          position: relative; 
          overflow: hidden; 
          margin-top: 80px;
          border-top: 1px solid rgba(139, 74, 30, 0.1);
        }

        .fb-top-bar {
          height: 4px;
          background: linear-gradient(90deg, #2A0F02, #8B4A1E, #2A0F02);
          background-size: 200% 100%;
          animation: fb-shift 6s linear infinite;
        }
        @keyframes fb-shift { 0%{background-position:0%} 100%{background-position:200%} }

        .fb-inner { position: relative; z-index: 1; max-width: 90rem; margin: 0 auto; padding: 52px 1rem 34px; }
        
        /* Desktop Grid */
        .fb-grid { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.35fr; gap: 34px; }
        
        .fb-logo { display: inline-flex; align-items: center; text-decoration: none; margin-bottom: 20px; }
        .fb-logo-img { display: block; height: clamp(4.5rem, 7vw, 6rem); max-width: min(16rem, 72vw); object-fit: contain; }

        .fb-desc { font-size: 15px; line-height: 1.7; color: #5C3D26; max-width: 320px; margin-bottom: 30px; }
        .fb-head { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #2A0F02; margin-bottom: 25px; }
        .fb-head::after { content: ''; display: block; width: 30px; height: 3px; background: #8B4A1E; margin-top: 10px; border-radius: 2px; }

        .fb-nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; }
        .fb-nav li a { color: #5C3D26; text-decoration: none; font-size: 15px; font-weight: 500; transition: all 0.2s; }
        .fb-nav li a:hover { color: #8B4A1E; transform: translateX(5px); display: inline-block; }
        .fb-nav li i { color: #8B4A1E !important; }

        .fb-important-link {
          align-items: center;
          display: inline-flex;
          gap: 0.5rem;
        }

        .fb-important-link::before {
          background: rgba(139, 74, 30, 0.18);
          border-radius: 999px;
          content: '';
          height: 0.42rem;
          width: 0.42rem;
        }

        /* Newsletter Desktop */
        .fb-newsletter-head { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #2A0F02; margin-bottom: 10px; }
        .fb-newsletter { margin-top: 10px; max-width: 320px; }
        .fb-email-row { display: flex; }
        .fb-email-input {
          flex: 1; padding: 10px 14px; font-size: 14px;
          border: 1px solid #D4B896; border-radius: 8px 0 0 8px;
          background: white; outline: none; color: #333;
        }
        .fb-join-btn {
          padding: 10px 20px; background: #2A0F02; color: white;
          border: none; border-radius: 0 8px 8px 0; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: background 0.2s;
        }
        .fb-join-btn:hover { background: #5C3D26; }
        .fb-join-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ─── Desktop Trust Section ─── */
        .fb-desktop-trust {
          max-width: 90rem;
          margin: 0 auto;
          padding: 28px 1rem 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border-bottom: 1px solid #EAEAEA;
        }

        .desktop-social { display: flex; flex-direction: column; gap: 14px; }
        .desktop-payment { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; }
        .trust-label { font-size: 15px; font-weight: 600; color: #555; letter-spacing: 0.1px; }

        .social-pill-row { display: flex; gap: 10px; }
        .soc-circle {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; text-decoration: none;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .soc-circle:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.18); }

        /* Payment pills row */
        .payment-pill-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }
        .pay-pill {
          background: white;
          border: 1px solid #E8E8E8;
          border-radius: 6px;
          padding: 5px 12px;
          height: 44px;
          min-width: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .pay-pill:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.1); transform: translateY(-1px); }

        /* NET Banking pill needs a bit more width due to two lines */
        .pay-pill-netbanking { min-width: 70px; }
        .pay-pill-emi { min-width: 50px; }

        /* Phone Layout — hidden on desktop */
        .fb-phone-section { display: none; }

        .fb-bot-wrap { background: #f7eadb; padding: 18px 1rem; border-top: 1px solid rgba(139,74,30,0.14); }
        .fb-bot { max-width: 90rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; color: #5C3D26; font-size: 14px; gap: 1rem; }
        .fb-legal a { color: #8B4A1E; text-decoration: none; font-weight: 700; }
        .fb-legal a:hover { color: #2A0F02; }


        @media(max-width: 767px) {
          /* Hide desktop sections */
          .fb-inner, .fb-desktop-trust, .chat-btn-desktop { display: none !important; }

          /* Phone section wrapper */
          .fb-phone-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 20px 16px;
            gap: 24px;
            background: #FDF6EE;
          }

          /* Logo (reuse desktop classes — ensure they work on mobile) */
          .fb-logo { margin-bottom: 0; }
          .fb-logo-img { height: 4.5rem; max-width: 12rem; }

          /* Description */
          .phone-desc { font-size: 14px; line-height: 1.7; color: #5C3D26; margin: 0; }

          /* Horizontal rule */
          .phone-hr { width: 100%; height: 1px; background: rgba(139,74,30,0.15); margin: 4px 0; }

          /* Nav 2-column grid */
          .phone-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; width: 100%; }
          .phone-nav-head {
            font-size: 15px; font-weight: 700; color: #2A0F02;
            margin-bottom: 14px; position: relative; padding-bottom: 10px;
          }
          .phone-nav-head::after {
            content: ''; position: absolute; bottom: 0; left: 0;
            width: 28px; height: 3px; background: #8B4A1E; border-radius: 2px;
          }
          .phone-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
          .phone-nav-list li a { color: #5C3D26; text-decoration: none; font-size: 14px; font-weight: 500; }
          .phone-nav-list li i { color: #8B4A1E !important; }

          /* Newsletter */
          .phone-newsletter { width: 100%; }
          .phone-email-row { display: flex; margin-top: 14px; }
          .phone-email-input {
            flex: 1; padding: 10px 14px; font-size: 14px;
            border: 1px solid #D4B896; border-radius: 8px 0 0 8px;
            background: white; outline: none; color: #333;
          }
          .phone-join-btn {
            padding: 10px 20px; background: #2A0F02; color: white;
            border: none; border-radius: 0 8px 8px 0; font-size: 14px;
            font-weight: 600; cursor: pointer;
          }
          .phone-join-btn:disabled { opacity: 0.7; cursor: not-allowed; }

          /* Follow Us On block */
          .phone-follow-block { display: flex; flex-direction: column; gap: 14px; width: 100%; }
          .phone-section-label { font-size: 15px; font-weight: 600; color: #222; }
          .phone-soc-row { display: flex; gap: 10px; flex-wrap: wrap; }
          .phone-soc-row .soc-circle { width: 42px; height: 42px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }

          /* Payment block */
          .phone-pay-block { display: flex; flex-direction: column; gap: 14px; width: 100%; }
          .phone-pay-grid { display: flex; flex-wrap: wrap; gap: 8px; }
          .phone-pay-grid .pay-pill {
            height: 40px; min-width: 58px; padding: 4px 10px;
            background: white; border: 1px solid #E8E8E8;
            border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          }

          .fb-bot { flex-direction: column; gap: 12px; text-align: center; }
          .fb-legal { display: flex; flex-wrap: wrap; justify-content: center; }
          .fb-legal a { margin: 0 8px; }

        }

        @media(max-width: 1100px) and (min-width: 768px) {
          .fb-grid { grid-template-columns: 1.4fr 1fr 1fr; }
          .fb-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>

      <footer className="fb-root">
        <div className="fb-top-bar" />

        {/* --- DESKTOP INNER CONTENT --- */}
        <div className="fb-inner">
          <div className="fb-grid">
            <div>
              <Link to="/" className="fb-logo">
                <img className="fb-logo-img" src={SITE_LOGO} alt={SITE_LOGO_ALT} />
              </Link>
              <p className="fb-desc" style={{ marginBottom: '15px' }}>India's trusted platform for live astrology courses, personalised consultations &amp; astrology products.</p>
              
              <div className="fb-newsletter">
                <div className="fb-newsletter-head">Subscribe to our Newsletter</div>
                <form onSubmit={handleSubscribe} className="fb-email-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="fb-email-input"
                    required
                  />
                  <button type="submit" className="fb-join-btn" disabled={loading}>
                    {loading ? 'Wait...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
            <div>
              <h5 className="fb-head">Quick Links</h5>
              <ul className="fb-nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/book-consultation">Book a Consultation</Link></li>
                <li><Link to={authState.isStudent ? '/dashboard' : '/login'}>{authState.isStudent ? 'Student Dashboard' : 'Student Login'}</Link></li>
                {authState.isAdmin && <li><Link to="/admin">Admin Dashboard</Link></li>}
                {/* <li><Link to="/shop">Merchandise</Link></li> */}
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="fb-head">Important Links</h5>
              <ul className="fb-nav">
                <li><Link className="fb-important-link" to="/about">About Us</Link></li>
                <li><Link className="fb-important-link" to="/contact">Contact Us</Link></li>
                <li><Link className="fb-important-link" to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="fb-important-link" to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
                <li><Link className="fb-important-link" to="/refund-policy">Refund Policy</Link></li>
                <li><Link className="fb-important-link" to="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="fb-head">Contact Info</h5>
              <ul className="fb-nav" style={{ gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#5C3D26', fontSize: '15px' }}>
                  <i className="fas fa-phone-alt" style={{ color: '#8B4A1E' }}></i>
                  <span>{settings?.contactPhone || CONTACT_PHONE_DISPLAY}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#5C3D26', fontSize: '15px' }}>
                  <i className="fas fa-envelope" style={{ color: '#8B4A1E' }}></i>
                  <span>info@dsastroinstitute.com</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#5C3D26', fontSize: '15px', marginTop: '4px' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#8B4A1E', marginTop: '4px' }}></i>
                  <span>D321, Vibhuti Khand<br/>Lucknow, UP-226010</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- DESKTOP TRUST SECTION (updated to match reference image) --- */}
        <div className="fb-desktop-trust">
          {/* Left: Follow Us On */}
          <div className="desktop-social">
            <div className="trust-label">Follow Us On</div>
            <div className="social-pill-row">
              {socialLinks.map(s => (
                <a key={s.name} href={s.link} className="soc-circle" style={{ background: s.color }} title={s.name}>{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Right: Payment Methods — matching the reference screenshot */}
          <div className="desktop-payment">
            <div className="trust-label">We Accept Secure Payment</div>
            <div className="payment-pill-row">
              {/* Visa */}
              <div className="pay-pill"><VisaSVG /></div>

              {/* Mastercard */}
              <div className="pay-pill"><MastercardSVG /></div>

              {/* Maestro */}
              <div className="pay-pill"><MaestroSVG /></div>

              {/* Amex */}
              <div className="pay-pill" style={{ background: '#016FD0' }}><AmexSVG /></div>

              {/* BHIM UPI */}
              <div className="pay-pill"><BhimUpiSVG /></div>

              {/* Google Pay */}
              <div className="pay-pill" style={{ minWidth: '72px' }}>
                <svg viewBox="0 0 90 30" height="22" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="22" fontFamily="Arial" fontWeight="700" fontSize="17" fill="#4285F4">G</text>
                  <text x="15" y="22" fontFamily="Arial" fontWeight="400" fontSize="16" fill="#5F6368">Pay</text>
                </svg>
              </div>

              {/* NET Banking */}
              <div className="pay-pill pay-pill-netbanking">
                <svg viewBox="0 0 80 32" height="20" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="13" fontFamily="Arial" fontWeight="700" fontSize="12" fill="#1A1F71">NET</text>
                  <text x="2" y="28" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#1A1F71">Banking</text>
                </svg>
              </div>

              {/* EMI */}
              <div className="pay-pill pay-pill-emi">
                <svg viewBox="0 0 52 26" height="18" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="20" fontFamily="Arial" fontWeight="900" fontSize="17" fill="#2D2D2D">EMI</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* === PHONE SECTION — full footer for mobile === */}
        <div className="fb-phone-section">

          {/* Logo */}
          <Link to="/" className="fb-logo">
            <img className="fb-logo-img" src={SITE_LOGO} alt={SITE_LOGO_ALT} />
          </Link>

          {/* Description */}
          <p className="phone-desc">India's trusted platform for live astrology courses, personalised consultations &amp; astrology products.</p>

          <div className="phone-newsletter">
            <div className="phone-nav-head" style={{ marginBottom: '4px' }}>Newsletter</div>
            <form onSubmit={handleSubscribe} className="phone-email-row" style={{ marginTop: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="phone-email-input"
                required
              />
              <button type="submit" className="phone-join-btn" disabled={loading}>
                {loading ? 'Wait...' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="phone-hr" />

          {/* Nav columns */}
          <div className="phone-nav-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div className="phone-nav-head">Quick Links</div>
              <ul className="phone-nav-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/book-consultation">Book a Consultation</Link></li>
                <li><Link to={authState.isStudent ? '/dashboard' : '/login'}>{authState.isStudent ? 'Student Dashboard' : 'Student Login'}</Link></li>
                {authState.isAdmin && <li><Link to="/admin">Admin Dashboard</Link></li>}
                {/* <li><Link to="/shop">Merchandise</Link></li> */}
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <div className="phone-nav-head">Important</div>
              <ul className="phone-nav-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund-policy">Refund Policy</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="phone-nav-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <div className="phone-nav-head">Contact Info</div>
              <ul className="phone-nav-list" style={{ gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#5C3D26', fontSize: '14px' }}>
                  <i className="fas fa-phone-alt" style={{ color: '#8B4A1E', marginTop: '3px' }}></i>
                  <span>{settings?.contactPhone || CONTACT_PHONE_DISPLAY}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#5C3D26', fontSize: '14px', wordBreak: 'break-all' }}>
                  <i className="fas fa-envelope" style={{ color: '#8B4A1E', marginTop: '3px' }}></i>
                  <span>info@dsastroinstitute.com</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#5C3D26', fontSize: '14px' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#8B4A1E', marginTop: '3px' }}></i>
                  <span>D321, Vibhuti Khand<br/>Lucknow, UP-226010</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="phone-hr" />

          {/* Follow Us On */}
          <div className="phone-follow-block">
            <div className="phone-section-label">Follow Us On</div>
            <div className="phone-soc-row">
              {socialLinks.map(s => (
                <a key={s.name} href={s.link} className="soc-circle" style={{ background: s.color }} title={s.name}>{s.icon}</a>
              ))}
            </div>
          </div>

          {/* We Accept Secure Payment */}
          <div className="phone-pay-block">
            <div className="phone-section-label">We Accept Secure Payment</div>
            <div className="phone-pay-grid">
              <div className="pay-pill"><VisaSVG /></div>
              <div className="pay-pill"><MastercardSVG /></div>
              <div className="pay-pill"><MaestroSVG /></div>
              <div className="pay-pill" style={{ background: '#016FD0' }}><AmexSVG /></div>
              <div className="pay-pill"><BhimUpiSVG /></div>
              <div className="pay-pill" style={{ minWidth: '68px' }}>
                <svg viewBox="0 0 90 30" height="20" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="22" fontFamily="Arial" fontWeight="700" fontSize="17" fill="#4285F4">G</text>
                  <text x="15" y="22" fontFamily="Arial" fontWeight="400" fontSize="16" fill="#5F6368">Pay</text>
                </svg>
              </div>
              <div className="pay-pill" style={{ minWidth: '66px' }}>
                <svg viewBox="0 0 80 32" height="20" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="13" fontFamily="Arial" fontWeight="700" fontSize="12" fill="#1A1F71">NET</text>
                  <text x="2" y="28" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#1A1F71">Banking</text>
                </svg>
              </div>
              <div className="pay-pill" style={{ minWidth: '52px' }}>
                <svg viewBox="0 0 52 26" height="18" xmlns="http://www.w3.org/2000/svg">
                  <text x="2" y="20" fontFamily="Arial" fontWeight="900" fontSize="17" fill="#2D2D2D">EMI</text>
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="fb-bot-wrap">
          <div className="fb-bot">
            <p className="mb-0">&copy; {currentYear} {SITE_NAME_LLP}. All rights reserved.</p>
            <div className="fb-legal" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <span style={{ color: '#8B4A1E', opacity: 0.5 }}>|</span>
              <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
              <span style={{ color: '#8B4A1E', opacity: 0.5 }}>|</span>
              <Link to="/refund-policy">Refund &amp; Cancellation Policy</Link>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;
