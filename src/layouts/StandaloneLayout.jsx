import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SITE_LOGO, SITE_LOGO_ALT } from '../utils/brandAssets';

const SHELL_LINK =
  '!no-underline decoration-transparent visited:!no-underline hover:!no-underline focus:!no-underline';

const NAV_LINK = `${SHELL_LINK} rounded-full px-4 py-2 text-sm font-bold !text-[#6f4a32] visited:!text-[#6f4a32] transition hover:!bg-[#f8ead8] hover:!text-[#2a0f02]`;

const BTN_GHOST = `${SHELL_LINK} hidden rounded-full border border-[#ead8c6] bg-transparent px-3 py-2 text-xs font-black !text-[#6f4a32] visited:!text-[#6f4a32] transition hover:!border-[#c8832a] hover:!bg-[#fffaf4] hover:!text-[#2a0f02] sm:inline-flex`;

const BTN_SOLID = `${SHELL_LINK} inline-flex items-center gap-2 rounded-full border-0 bg-[#2a0f02] px-4 py-2 text-xs font-black !text-white visited:!text-white shadow-lg shadow-[#8b4a1e]/20 transition hover:!bg-[#8b4a1e] hover:!text-white`;

const FOOTER_LINK = `${SHELL_LINK} !text-[#fff7ed] visited:!text-[#fff7ed] opacity-85 transition hover:!text-[#fff7ed] hover:opacity-100`;

const LOGO_WRAP = `${SHELL_LINK} flex min-w-0 items-center gap-3 !text-inherit visited:!text-inherit`;

const pageMeta = [
  {
    match: (path) => path === '/login',
    eyebrow: 'Student Access',
    title: 'Student Portal',
    description: 'Sign in and continue your enrolled courses.',
    primary: { label: 'View Courses', to: '/courses' },
    secondary: { label: 'Home', to: '/' }
  },
  {
    match: (path) => path === '/dashboard',
    eyebrow: 'Learning Area',
    title: 'My Dashboard',
    description: 'Track enrolled courses, materials, offers, and progress.',
    primary: { label: 'Courses', to: '/courses' },
    secondary: { label: 'Home', to: '/' }
  },
  {
    match: (path) => path.startsWith('/student/course/'),
    eyebrow: 'Course Player',
    title: 'Class Videos',
    description: 'Watch your protected lessons and continue learning.',
    primary: { label: 'Dashboard', to: '/dashboard' },
    secondary: { label: 'Courses', to: '/courses' }
  },
  {
    match: (path) => path === '/webinar',
    eyebrow: 'Live Session',
    title: 'Webinar Registration',
    description: 'Reserve your seat for the upcoming astrology session.',
    primary: { label: 'Consultation', to: '/consultations' },
    secondary: { label: 'Home', to: '/' }
  },
  {
    match: (path) => path === '/course-inquiry',
    eyebrow: 'Course Inquiry',
    title: 'Astrology Course',
    description: 'Ask questions and start your guided learning journey.',
    primary: { label: 'All Courses', to: '/courses' },
    secondary: { label: 'Contact', to: '/contact' }
  },
  {
    match: (path) => path.startsWith('/payment-success'),
    eyebrow: 'Payment Complete',
    title: 'Booking Confirmed',
    description: 'Your transaction was completed successfully.',
    primary: { label: 'Dashboard', to: '/dashboard' },
    secondary: { label: 'Home', to: '/' }
  },
  {
    match: (path) => path.startsWith('/payment-failed'),
    eyebrow: 'Payment Status',
    title: 'Payment Failed',
    description: 'Review the payment status and try again securely.',
    primary: { label: 'Try Again', to: '/webinar' },
    secondary: { label: 'Contact', to: '/contact' }
  },
  {
    match: (path) => path.startsWith('/payment'),
    eyebrow: 'Secure Checkout',
    title: 'Payment',
    description: 'Complete your registration with a secure checkout.',
    primary: { label: 'Need Help?', to: '/contact' },
    secondary: { label: 'Home', to: '/' }
  },
  {
    match: () => true,
    eyebrow: 'Cosmic Light',
    title: 'Astrology Guidance',
    description: 'Navigate courses, consultations, tools, and shop pages.',
    primary: { label: 'Home', to: '/' },
    secondary: { label: 'Courses', to: '/courses' }
  }
];

function getPageMeta(pathname) {
  return pageMeta.find((item) => item.match(pathname)) || pageMeta[pageMeta.length - 1];
}

function StandaloneLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = getPageMeta(pathname);
  const [authState, setAuthState] = useState({ isStudent: false, isAdmin: false });

  const syncAuthState = () => {
    setAuthState({
      isStudent: Boolean(localStorage.getItem('studentToken')),
      isAdmin: Boolean(localStorage.getItem('adminToken'))
    });
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    syncAuthState();
    navigate('/login');
  };

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [pathname]);

  return (
    <div className="contextual-shell min-h-screen bg-[#fff7ed] font-body text-[#2a0f02] [&_a]:decoration-transparent">
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-[1030] border-b border-[#ead8c6] bg-[#fffaf3]/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className={LOGO_WRAP}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-[#8b4a1e]/20 sm:h-10 sm:w-10">
              <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-full w-full object-contain p-0.5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-black uppercase tracking-[0.24em] text-[#c8832a]">
                {meta.eyebrow}
              </span>
              <span className="block truncate font-serif text-lg font-bold text-[#2a0f02] sm:text-xl">
                {meta.title}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link className={NAV_LINK} to="/">
              Home
            </Link>
            <Link className={NAV_LINK} to="/courses">
              Courses
            </Link>
            <Link className={NAV_LINK} to="/consultations">
              Consultation
            </Link>
            {authState.isStudent ? (
              <Link className={NAV_LINK} to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link className={NAV_LINK} to="/login">
                Student Login
              </Link>
            )}
            {authState.isAdmin && (
              <Link className={NAV_LINK} to="/admin">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link to={meta.secondary.to} className={BTN_GHOST}>
              {meta.secondary.label}
            </Link>
            <Link to={meta.primary.to} className={BTN_SOLID}>
              {meta.primary.label}
              <i className="fas fa-arrow-right text-[11px]"></i>
            </Link>
            {authState.isStudent && pathname !== '/login' && (
              <button
                type="button"
                onClick={handleStudentLogout}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#ead8c6] text-[#6f4a32] transition hover:border-[#c8832a] hover:bg-[#f8ead8] sm:inline-flex"
                aria-label="Logout"
              >
                <i className="fas fa-sign-out-alt text-xs"></i>
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <main className="contextual-main min-h-[calc(100vh-174px)]">
        <Outlet />
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="border-t border-[#ead8c6] bg-[#2a0f02] text-[#fff7ed]"
      >
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-[1.3fr_1fr_auto] md:items-center lg:px-8">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#f5c98d]">{meta.eyebrow}</p>
            <p className="mb-0 max-w-xl text-sm leading-6 text-[#f8ead8]">{meta.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-bold">
            <Link className={FOOTER_LINK} to="/privacy-policy">Privacy</Link>
            <Link className={FOOTER_LINK} to="/terms-and-conditions">Terms</Link>
            <Link className={FOOTER_LINK} to="/contact">Support</Link>
          </div>

          <p className="mb-0 text-xs font-bold text-[#d8b894]">&copy; 2026 Cosmic Light Astrology</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default StandaloneLayout;
