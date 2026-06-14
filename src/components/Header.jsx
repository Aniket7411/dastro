import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ConsultationModal from './ConsultationModal';
import SuccessModal from './SuccessModal';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import { handleRazorpayPayment } from '../utils/paymentUtils';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const brandName = 'DS Institute';
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState({
    isStudent: false,
    isAdmin: false,
    studentName: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [desktopDropdownLocked, setDesktopDropdownLocked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: 'General Consultation',
    dob: '',
    tob: '',
    pob: '',
    message: ''
  });

  const handleConsultChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const readAuthState = () => ({
    isStudent: Boolean(localStorage.getItem('studentToken')),
    isAdmin: Boolean(localStorage.getItem('adminToken')),
    studentName: localStorage.getItem('studentName') || 'Student'
  });

  const syncAuthState = () => {
    setAuthState(readAuthState());
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    syncAuthState();
    navigate('/login');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    syncAuthState();
    navigate('/admin/login');
  };

  const navLinkTypography = 'type-nav';

  const navLinkClass = (path) => {
    const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
    return `nav-link ${navLinkTypography}${isActive ? ' active' : ''}`;
  };

  const isStudentLoginPage = location.pathname === '/login';

  const toggleMobileGroup = (group) => {
    setOpenMobileGroup((current) => (current === group ? null : group));
  };

  const closeDesktopDropdown = () => {
    setDesktopDropdownLocked(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const unlockDesktopDropdown = () => {
    setDesktopDropdownLocked(false);
  };

  // Desktop nav: max 5 items. COURSES is a dropdown to keep the bar clean.
  const desktopNavItems = authState.isStudent
    ? [
        { label: 'HOME', to: '/', match: '/' },
        { label: 'MY COURSES', to: '/dashboard', match: '/dashboard' },
        {
          label: 'COURSES',
          dropdown: [
            { label: 'Live Classes', to: '/live-courses', icon: 'fa-broadcast-tower' },
            { label: 'Recorded Courses', to: '/recorded-courses', icon: 'fa-play-circle' }
          ]
        },
        { label: 'CONSULTATIONS', to: '/book-consultation', match: '/book-consultation' },
        { label: 'SHOP', to: '/shop', match: '/shop' },
        { label: 'CONTACT', to: '/contact', match: '/contact' }
      ]
    : [
        { label: 'HOME', to: '/', match: '/' },
        {
          label: 'COURSES',
          dropdown: [
            { label: 'Live Classes', to: '/live-courses', icon: 'fa-broadcast-tower' },
            { label: 'Recorded Courses', to: '/recorded-courses', icon: 'fa-play-circle' }
          ]
        },
        { label: 'CONSULTATIONS', to: '/book-consultation', match: '/book-consultation' },
        { label: 'SHOP', to: '/shop', match: '/shop' },
        { label: 'ABOUT', to: '/about', match: '/about' },
        { label: 'CONTACT', to: '/contact', match: '/contact' }
      ];

  // Mobile offcanvas keeps flat links for easy thumb navigation
  const mobileNavLinks = authState.isStudent
    ? [
        { label: 'HOME', to: '/', match: '/' },
        { label: 'MY COURSES', to: '/dashboard', match: '/dashboard' },
        { label: 'LIVE CLASSES', to: '/live-courses', match: '/live-courses' },
        { label: 'RECORDED COURSES', to: '/recorded-courses', match: '/recorded-courses' },
        { label: 'CONSULTATIONS', to: '/book-consultation', match: '/book-consultation' },
        { label: 'SHOP', to: '/shop', match: '/shop' },
        { label: 'CONTACT', to: '/contact', match: '/contact' }
      ]
    : [
        { label: 'HOME', to: '/', match: '/' },
        { label: 'LIVE CLASSES', to: '/live-courses', match: '/live-courses' },
        { label: 'RECORDED COURSES', to: '/recorded-courses', match: '/recorded-courses' },
        { label: 'CONSULTATIONS', to: '/book-consultation', match: '/book-consultation' },
        { label: 'SHOP', to: '/shop', match: '/shop' },
        { label: 'ABOUT', to: '/about', match: '/about' },
        { label: 'CONTACT', to: '/contact', match: '/contact' }
      ];

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    
    // Use Razorpay Flow if price is present
    if (formData.price) {
      const onSuccess = () => {
        setIsConsultModalOpen(false);
        setIsSuccessOpen(true);
        setFormData({ name: '', email: '', phone: '', consultationType: 'General Consultation', dob: '', tob: '', pob: '', message: '', price: '' });
        setIsSubmitting(false);
      };
      
      const success = await handleRazorpayPayment({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: sanitizedPhone
      }, onSuccess);
      if (!success) {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type: 'Consultation', 
          courseName: formData.consultationType 
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsConsultModalOpen(false);
        setIsSuccessOpen(true);
        setFormData({ name: '', email: '', phone: '', consultationType: 'General Consultation', dob: '', tob: '', pob: '', message: '' });
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    // AOS Init
    if (window.AOS) {
      window.AOS.init();
    }

    // Scroll effect
    const handleScroll = () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    // Report Bar Animation Logic
    const handleReportAnimation = () => {
      const content = document.getElementById('reportScrollContent');
      if (!content) return;
      
      content.style.animation = 'scrollLeftSmooth 38s linear infinite';
      if (!content.hasAttribute('data-cloned')) {
        const originalHTML = content.innerHTML;
        content.innerHTML = originalHTML + originalHTML;
        content.setAttribute('data-cloned', 'true');
      }
    };

    window.addEventListener('resize', handleReportAnimation);
    window.addEventListener('scroll', handleScroll);
    handleReportAnimation();
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleReportAnimation);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [location.pathname]);

  useEffect(() => {
    closeDesktopDropdown();
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        :root {
          --primary-color: #8B4A1E;
          --accent-color: #C8832A;
          --glass-border: rgba(200, 131, 42, 0.18);
          --premium-shadow: 0 4px 24px rgba(139, 74, 30, 0.08);
        }

        /* Fixed header wrapper — holds ticker + navbar together */
        .header-fixed-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1020;
          width: 100%;
        }

        /* Report Bar */
        .report-bar {
          display: flex;
          align-items: center;
          background: var(--bg-color);
          padding: 0;
          overflow-x: hidden;
          border-bottom: 1px solid var(--glass-border);
          width: 100%;
          position: relative;
        }
        
        .report-bar .label {
          background: var(--primary-color);
          color: #fff;
          font-weight: 700;
          padding: 0.45rem 4%;
          white-space: nowrap;
          z-index: 3;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          box-shadow: 2px 0 8px rgba(0,0,0,0.02);
        }
        
        .scroll-wrapper {
          overflow-x: hidden;
          flex: 1;
          width: 100%;
        }
        
        .scroll-wrapper::-webkit-scrollbar {
          display: none;
        }
        
        .scroll-content {
          display: inline-flex;
          gap: clamp(15px, 3vw, 40px);
          white-space: nowrap;
          padding: 0 1rem 0 0.5rem;
          align-items: center;
        }
        
        .item {
          color: var(--text-content);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .new {
          background: var(--accent-color);
          color: #fff;
          padding: 2px 8px;
          border-radius: 30px;
          text-transform: uppercase;
          font-weight: 800;
        }

        @media (min-width: 1200px) {
          .navbar-collapse.collapse {
            visibility: visible !important;
            display: flex !important;
          }
        }

        @keyframes scrollLeftSmooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-48%); }
        }

        /* Navbar — scoped to .site-header (never bare "header"; page heroes use <div>) */
        .site-header {
          background: rgba(253, 246, 238, 0.9) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          position: relative;
          top: 0;
          z-index: 10;
          width: 100%;
          min-height: clamp(3.5rem, 5vw, 4.25rem);
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          padding: 0.25rem 0;
        }

        .site-header.scrolled {
          background: rgba(253, 246, 238, 0.98) !important;
          box-shadow: 0 0.25rem 1.25rem rgba(139, 74, 30, 0.1);
          min-height: clamp(3.25rem, 4.5vw, 4rem);
        }

        .site-header .container-fluid {
          gap: 1rem;
          align-items: center;
          width: 100%;
        }

        .site-header > nav {
          width: 100%;
        }

        .nav-inner {
          width: 100%;
          max-width: none;
          margin-inline: auto;
        }

        .logo-icon-wrapper {
          width: auto;
          height: auto;
          background: transparent;
          border: 0;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          overflow: visible;
        }

        .logo-icon-wrapper img {
          height: clamp(52px, 7vw, 80px);
          width: auto;
          object-fit: contain;
          display: block;
        }

        .logo-icon-wrapper:hover {
          transform: none;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex: 1 1 auto;
          min-width: 0;
        }

        .navbar-nav {
          gap: 0.5rem;
        }

        @media (min-width: 1200px) {
          .nav-inner {
            display: grid !important;
            grid-template-columns: auto 1fr auto;
            column-gap: clamp(1rem, 2vw, 2rem);
            align-items: center;
          }

          .navbar-collapse {
            justify-self: center;
            display: flex !important;
            visibility: visible !important;
          }

          .header-actions {
            justify-self: end;
          }

          .navbar-nav {
            gap: 0;
            justify-content: center;
          }

          .navbar-nav .nav-link {
            color: var(--text-main) !important;
            padding: 0.4rem 0.55rem !important;
            transition: color 0.2s ease;
            position: relative;
            white-space: nowrap;
            background: none;
            border: none;
          }

          .navbar-nav .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0.15rem;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--primary-color);
            transition: width 0.25s ease;
            transform: translateX(-50%);
            border-radius: 2px;
          }

          .navbar-nav .nav-link:hover::after,
          .navbar-nav .nav-link.active::after {
            width: 70%;
          }

          .navbar-nav .nav-link:hover,
          .navbar-nav .nav-link.active {
            color: var(--primary-color) !important;
          }

          /* Hover Dropdown for COURSES */
          .nav-item.dropdown {
            position: relative;
          }

          .nav-item.dropdown:hover > .dropdown-menu,
          .nav-item.dropdown:focus-within > .dropdown-menu {
            display: block;
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: all;
          }

          .dropdown-menu {
            display: block;
            opacity: 0;
            visibility: hidden;
            transform: translateY(6px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(6px);
            margin-top: 0;
            border-radius: 12px;
            padding: 0.5rem;
            min-width: 11rem;
            background: #fff;
            border: 1px solid var(--glass-border) !important;
            box-shadow: 0 8px 24px rgba(139, 74, 30, 0.12) !important;
            z-index: 1050;
          }

          .nav-item.dropdown:hover > .dropdown-menu,
          .nav-item.dropdown:focus-within > .dropdown-menu {
            transform: translateX(-50%) translateY(0);
          }

          .nav-item.dropdown.dropdown-locked:hover > .dropdown-menu,
          .nav-item.dropdown.dropdown-locked:focus-within > .dropdown-menu {
            display: block;
            opacity: 0;
            visibility: hidden;
            transform: translateX(-50%) translateY(6px);
            pointer-events: none;
          }

          .dropdown-menu .dropdown-item {
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            color: var(--text-main) !important;
            transition: background 0.15s ease, color 0.15s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .dropdown-menu .dropdown-item:hover {
            background: #fff8ef;
            color: var(--primary-color) !important;
          }

          .btn-consult-header {
            background: linear-gradient(135deg, #2A0F02, #8B4A1E);
            color: #fff !important;
            padding: 0.5rem 0.95rem;
            border-radius: 2rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            box-shadow: 0 4px 12px rgba(42, 15, 2, 0.2);
            transition: all 0.25s ease;
            white-space: nowrap;
          }

          .btn-consult-header:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(42, 15, 2, 0.28);
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-account-header {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            border: 1px solid var(--glass-border);
            background: #fffaf4;
            color: var(--primary-color) !important;
            padding: 0.45rem 0.75rem;
            border-radius: 2rem;
            text-decoration: none;
            white-space: nowrap;
            transition: all 0.2s ease;
            letter-spacing: 0.02em;
          }

          .btn-account-header:hover {
            border-color: var(--accent-color);
            background: #fff;
            transform: translateY(-1px);
          }

          .btn-logout-header {
            width: 2.3rem;
            height: 2.3rem;
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            background: #fff;
            color: var(--primary-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .btn-logout-header:hover {
            background: #fff3ea;
            border-color: var(--accent-color);
          }
        }

        @media (min-width: 1400px) {
          .navbar-nav .nav-link {
            padding: 0.45rem 0.7rem !important;
          }
          .btn-consult-header {
            padding: 0.55rem 1.1rem;
          }
          .btn-account-header {
            padding: 0.5rem 0.9rem;
          }
        }

        .mobile-offcanvas {
          background: var(--bg-color);
          width: min(100%, 24rem) !important;
          max-width: 24rem;
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          z-index: 1055;
          overflow-y: auto;
          transform: translateX(100%);
          transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: -4px 0 24px rgba(139, 74, 30, 0.15);
        }

        .mobile-offcanvas.is-open {
          transform: translateX(0);
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(42, 15, 2, 0.45);
          z-index: 1054;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-backdrop.is-open {
          opacity: 1;
          pointer-events: all;
        }

        .mobile-offcanvas .offcanvas-header {
          padding: 1.1rem 1.2rem;
        }

        .mobile-offcanvas .nav-link {
          color: var(--text-main);
          padding: 0.9rem 1.1rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mob-drop-trigger {
          width: 2.75rem;
          height: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 1px solid var(--glass-border);
          background: rgba(139, 74, 30, 0.05);
        }

        .mob-drop-trigger[aria-expanded="true"] {
          background: var(--primary-color);
        }

        .mob-drop-trigger[aria-expanded="true"] i {
          transform: rotate(180deg);
          color: #fff !important;
        }

        .mobile-offcanvas .dropdown-item {
          padding: 0.75rem 1.25rem;
          color: var(--text-content);
          border-bottom: 1px solid rgba(200, 131, 42, 0.08);
          background: #FFFDFB;
          display: block;
        }

        .mobile-offcanvas .dropdown-item:active {
          background: #FDF6EE;
        }

        .mobile-menu-group {
          border-bottom: 1px solid var(--glass-border);
          padding: 0.9rem 1.25rem 1rem;
        }

        .mobile-menu-heading {
          align-items: center;
          background: transparent;
          border: 0;
          color: var(--text-main);
          display: flex;
          justify-content: space-between;
          margin-bottom: 0;
          padding: 0;
          text-transform: uppercase;
          width: 100%;
        }

        .mobile-menu-heading i {
          color: var(--primary-color);
          transition: transform 0.2s ease;
        }

        .mobile-menu-heading.is-open i {
          transform: rotate(180deg);
        }

        .mobile-submenu {
          display: grid;
          gap: 0.45rem;
          margin-top: 0.65rem;
        }

        .mobile-submenu.is-collapsed {
          display: none;
        }

        .mobile-submenu .dropdown-item {
          background: #fffaf4;
          border: 1px solid rgba(200, 131, 42, 0.12);
          border-radius: 0.55rem;
          color: var(--text-content) !important;
          padding: 0.65rem 0.8rem;
        }

        .mobile-submenu .dropdown-item:hover {
          background: #fff3e6;
          color: var(--primary-color) !important;
        }

        .btn-mobile-cta {
          border-radius: 0.9rem !important;
          padding: 0.85rem 0;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
        }

        .btn-menu-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--glass-border);
          background: #fffaf4;
          color: var(--text-main);
          border-radius: 2rem;
          padding: 0.5rem 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .btn-menu-header:hover {
          border-color: var(--accent-color);
          color: var(--primary-color);
          background: #fff;
          transform: translateY(-1px);
        }

        .btn-menu-header i {
          color: var(--primary-color);
        }
        
        .btn-mobile-cta.primary-cta {
          background: linear-gradient(135deg, var(--primary-color), #2A0F02);
          color: #fff !important;
          box-shadow: 0 0.5rem 1.25rem rgba(42, 15, 2, 0.25);
        }
        
        .btn-mobile-cta.secondary-cta {
          background: #fff;
          color: var(--primary-color) !important;
          border: 0.15rem solid var(--primary-color) !important;
          box-shadow: 0 0.35rem 0.9rem rgba(139, 74, 30, 0.12);
        }

        .btn-mobile-cta.ghost-cta {
          background: #fff8ef;
          color: var(--text-main) !important;
          border: 1px solid var(--glass-border) !important;
          box-shadow: none;
        }

        .btn-mobile-cta:active {
          transform: scale(0.98);
        }

        .navbar-toggler {
          border: 0.08rem solid var(--glass-border) !important;
          padding: 0.65rem 0.75rem;
          color: #fff !important;
          background: var(--primary-color) !important;
          border-radius: 0.75rem;
          font-size: var(--text-nav);
          box-shadow: 0 0.25rem 0.75rem rgba(139, 74, 30, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .navbar-toggler i {
          color: #fff !important;
        }

        .navbar-toggler:focus {
          box-shadow: none !important;
        }

        .navbar-toggler:hover {
          transform: scale(1.05);
          background: var(--accent-color) !important;
        }

        @media (max-width: 1199px) {
          .site-header,
          .site-header > nav {
            width: 100% !important;
            flex-grow: 1 !important;
            display: flex !important;
            min-height: 3.75rem !important;
          }
          .site-header .container-fluid {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .navbar-toggler {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            transform: none !important;
            z-index: 1000 !important;
            margin: 0 !important;
            order: 2;
          }
          .navbar-brand {
            margin: 0 !important;
            max-width: 100%;
            order: 1;
            flex: 1 1 auto;
          }
          .navbar-brand .fb-logo-name {
            font-size: var(--h5-size);
          }
          .navbar-collapse {
            width: 100%;
            margin-top: 0.75rem;
          }
        }

        @media (max-width: 640px) {
          .report-bar .label {
            padding-inline: var(--page-pad-x);
          }

          .new {
            padding: 0.08rem 0.38rem;
          }
        }
      `}</style>

      <div className="header-fixed-wrapper">
      <section className="report-bar">
        <div className="label">Popular Reports</div>
        <div className="scroll-wrapper" id="reportScrollWrapper">
          <div className="scroll-content" id="reportScrollContent">
            <span className="item"><b className="new">New</b> 2026 Financial Horoscope Based on Your Birth Chart</span>
            <span className="item"><b className="new">New</b> 2026 Career Horoscope Based on Your Birth Chart</span>
            <span className="item"><b className="new">New</b> 2026 Marriage Horoscope Based on Your Birth Chart</span>
            <span className="item"><b className="new">New</b> 2026 Wealth Horoscope Based on Your Birth Chart</span>
            <span className="item"><b className="new">New</b> 2026 Career Horoscope Based on Your Birth Chart</span>
            <span className="item"><b className="new">New</b> 2026 Love Horoscope Based on Your Birth Chart</span>
          </div>
        </div>
      </section>

      <header className="site-header w-100 mb-0">
        <nav className="navbar navbar-expand-xl navbar-light py-2">
          <div className="container-fluid nav-inner px-3 px-md-4 px-lg-5 d-flex align-items-center justify-content-between flex-nowrap">
            <Link className="navbar-brand d-flex align-items-center p-0 me-0" to="/" style={{ flexShrink: 0 }} aria-label="DS Institute home">
              <div className="logo-icon-wrapper">
                <img src="/newbg.webp" alt="DS Institute logo" fetchpriority="high" />
              </div>
            </Link>
             
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} color="#fff" strokeWidth={2.5} />
            </button>

            <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                {desktopNavItems.map((item) => (
                  item.dropdown ? (
                    <li
                      className={`nav-item dropdown${desktopDropdownLocked ? ' dropdown-locked' : ''}`}
                      key={item.label}
                      onMouseLeave={unlockDesktopDropdown}
                    >
                      <button
                        type="button"
                        className={`nav-link ${navLinkTypography}${item.dropdown.some(d => location.pathname.startsWith(d.to)) ? ' active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.label} <i className="fas fa-chevron-down ms-1 text-[0.65rem] opacity-70"></i>
                      </button>
                      <ul className="dropdown-menu list-unstyled m-0" style={{ padding: '0.4rem' }}>
                        {item.dropdown.map((d) => (
                          <li key={d.to}>
                            <Link
                              className="dropdown-item type-body-sm"
                              to={d.to}
                              onClick={closeDesktopDropdown}
                            >
                              {d.icon && <i className={`fas ${d.icon}`} style={{ width: '16px', opacity: 0.6 }}></i>}
                              {d.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item" key={item.to}>
                      <Link className={navLinkClass(item.match)} to={item.to}>{item.label}</Link>
                    </li>
                  )
                ))}
              </ul>
            </div>

            <div className="header-actions d-none d-xl-flex ms-auto" style={{ flexShrink: 0 }}>
              {authState.isAdmin && (
                <Link to="/admin" className="btn-account-header type-btn">
                  <i className="fas fa-user-shield"></i>
                  Admin
                </Link>
              )}
              {authState.isStudent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Link to="/dashboard" className="btn-account-header type-btn" style={{ maxWidth: '9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <i className="fas fa-graduation-cap"></i>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '7rem' }}>{authState.studentName}</span>
                  </Link>
                  <button type="button" onClick={handleStudentLogout} className="btn-logout-header" aria-label="Logout" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : !isStudentLoginPage ? (
                <Link to="/login" className="btn-account-header type-btn">
                  <i className="fas fa-user"></i>
                  Student Login
                </Link>
              ) : null}
              <button onClick={() => setIsConsultModalOpen(true)} className="btn btn-consult-header border-0 type-btn uppercase">
                Book Consultation
              </button>
            </div>
          </div>
        </nav>
      </header>
      </div>{/* /header-fixed-wrapper */}

      <div className={`mobile-backdrop${isMobileMenuOpen ? ' is-open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`mobile-offcanvas${isMobileMenuOpen ? ' is-open' : ''}`} tabIndex="-1">
        <div className="offcanvas-header border-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.2rem' }}>
          <h5 className="offcanvas-title fw-bold d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', margin: 0 }}>
            <img src="/newbg.webp" alt={brandName} style={{ height: '40px', width: 'auto' }} />
            {brandName}
          </h5>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--primary-color)' }}
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>
        <div className="offcanvas-body p-0">
          <ul className="navbar-nav">
            {mobileNavLinks.map((item) => (
              <li className="nav-item" key={item.to}>
                <Link className="nav-link" to={item.to} onClick={() => setIsMobileMenuOpen(false)}>{item.label}</Link>
              </li>
            ))}

            <li className="nav-item">
              <div className="mobile-menu-group">
                <button
                  type="button"
                  className={`mobile-menu-heading ${openMobileGroup === 'shop' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileGroup('shop')}
                  aria-expanded={openMobileGroup === 'shop'}
                >
                  <span>ASTRO SHOP</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className={`mobile-submenu ${openMobileGroup === 'shop' ? '' : 'is-collapsed'}`}>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>All Astro Products</Link>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Gemstones</Link>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Rudraksha</Link>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Yantras</Link>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Puja Kits</Link>
                  <Link className="dropdown-item" to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Bracelets</Link>
                </div>
              </div>
            </li>

            <li className="nav-item"><Link className="nav-link" to="/astrologer" onClick={() => setIsMobileMenuOpen(false)}>ASTROLOGERS</Link></li>

            <li className="nav-item">
              <div className="mobile-menu-group">
                <button
                  type="button"
                  className={`mobile-menu-heading ${openMobileGroup === 'tools' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileGroup('tools')}
                  aria-expanded={openMobileGroup === 'tools'}
                >
                  <span>FREE TOOLS</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className={`mobile-submenu ${openMobileGroup === 'tools' ? '' : 'is-collapsed'}`}>
                  <Link className="dropdown-item" to="/free-tools" onClick={() => setIsMobileMenuOpen(false)}>All Free Tools</Link>
                  <Link className="dropdown-item" to="/numerology" onClick={() => setIsMobileMenuOpen(false)}>Numerology</Link>
                  <Link className="dropdown-item" to="/tarot" onClick={() => setIsMobileMenuOpen(false)}>Tarot Reading</Link>
                  <Link className="dropdown-item" to="/love" onClick={() => setIsMobileMenuOpen(false)}>Love Calculator</Link>
                </div>
              </div>
            </li>

            <li className="nav-item"><Link className="nav-link" to="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blog" onClick={() => setIsMobileMenuOpen(false)}>BLOG</Link></li>
            <li className="nav-item">
              <Link className="nav-link" to="/careers" onClick={() => setIsMobileMenuOpen(false)}>
                CAREERS
                <span className="badge bg-danger ms-2" style={{ fontSize: '0.7rem' }}>WE'RE HIRING</span>
              </Link>
            </li>
            
            <li className="nav-item p-4 d-grid gap-3">
              {authState.isAdmin && (
                <Link to="/admin" className="btn btn-mobile-cta ghost-cta" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-user-shield"></i> ADMIN DASHBOARD
                </Link>
              )}
              {authState.isStudent ? (
                <>
                  <Link to="/dashboard" className="btn btn-mobile-cta secondary-cta" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="fas fa-graduation-cap"></i> STUDENT DASHBOARD
                  </Link>
                  <button type="button" onClick={handleStudentLogout} className="btn btn-mobile-cta ghost-cta" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="fas fa-sign-out-alt"></i> LOGOUT
                  </button>
                </>
              ) : !isStudentLoginPage ? (
                <Link to="/login" className="btn btn-mobile-cta secondary-cta" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-user"></i> STUDENT LOGIN
                </Link>
              ) : null}
              <button onClick={() => setIsConsultModalOpen(true)} className="btn btn-mobile-cta primary-cta">
                <i className="fas fa-calendar-check"></i> BOOK CONSULTATION
              </button>
              <Link to="/live-courses" className="btn btn-mobile-cta ghost-cta" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-graduation-cap"></i> COURSES
              </Link>
              {authState.isAdmin && (
                <button type="button" onClick={handleAdminLogout} className="btn btn-mobile-cta ghost-cta" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-lock"></i> ADMIN LOGOUT
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      <ConsultationModal 
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        formData={formData}
        handleChange={handleConsultChange}
        handleSubmit={handleConsultSubmit}
        isSubmitting={isSubmitting}
        isFixedService={!!formData.consultationType}
      />

      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Consultation Booked!"
        message="Your consultation request has been received. Our team will contact you shortly to confirm the schedule."
      />
    </>
  );
}

export default Header;
