import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarCheck,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  PlayCircle,
  Radio,
  Shield,
  User,
  X,
} from 'lucide-react';
import { SITE_LOGO, SITE_LOGO_ALT } from '../utils/brandAssets';

const REPORT_ITEMS = [
  '2026 Financial Horoscope Based on Your Birth Chart',
  '2026 Career Horoscope Based on Your Birth Chart',
  '2026 Marriage Horoscope Based on Your Birth Chart',
  '2026 Wealth Horoscope Based on Your Birth Chart',
  '2026 Love Horoscope Based on Your Birth Chart',
];

const mobileNavItemClass =
  'block px-4 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] !text-site-text !no-underline transition hover:!text-site-accent-dark hover:!no-underline';

const NAV_LINK_BASE =
  'relative inline-flex items-center gap-1 px-2.5 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] !no-underline decoration-transparent transition-colors hover:!no-underline hover:!text-site-accent-dark sm:px-3 sm:text-xs';

const NAV_LINK_ACTIVE =
  '!text-site-accent-dark visited:!text-site-accent-dark after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[70%] after:-translate-x-1/2 after:rounded-full after:bg-site-accent-dark';

const NAV_LINK_IDLE = '!text-site-text visited:!text-site-text';

const NAV_ACTION_BTN =
  'inline-flex items-center justify-center gap-1.5 !rounded-full border-0 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.06em] transition hover:-translate-y-px sm:px-[1.125rem] sm:py-2.5 sm:text-xs';

const COURSE_LINKS = [
  { label: 'Live Classes', to: '/live-courses', Icon: Radio },
  { label: 'Recorded Courses', to: '/recorded-courses', Icon: PlayCircle },
];

function CoursesDropdown({ coursesActive }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <li
      className="relative flex list-none items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${NAV_LINK_BASE} ${
          coursesActive ? NAV_LINK_ACTIVE : open ? '!text-site-accent-dark' : NAV_LINK_IDLE
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Courses
        <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 pt-2 transition-opacity ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="overflow-hidden rounded-xl border border-site-accent-dark/15 bg-white py-1 shadow-lg">
          {COURSE_LINKS.map(({ label, to, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium !text-site-text !no-underline decoration-transparent transition-colors visited:!text-site-text hover:!no-underline hover:bg-[#fff8ef] hover:!text-site-accent-dark"
              >
                <Icon className="h-4 w-4 shrink-0 opacity-60" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function NavLink({ to, match, children, onClick, className = '' }) {
  const location = useLocation();
  const isActive = match === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(match);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE} ${className}`}
    >
      {children}
    </Link>
  );
}

export default function SiteNavbar({
  authState,
  isLoginPage,
  onBookConsultation,
  onStudentLogout,
  onAdminLogout,
}) {
  const location = useLocation();
  const headerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const coursesActive = COURSE_LINKS.some((link) => location.pathname.startsWith(link.to));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileCoursesOpen(false);
    setMobileToolsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const syncHeaderOffset = () => {
      document.documentElement.style.setProperty('--spacing-site-header', `${el.offsetHeight}px`);
    };

    syncHeaderOffset();

    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(el);
    window.addEventListener('resize', syncHeaderOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderOffset);
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const guestDesktopLinks = (
    <>
      <li className="flex list-none items-center">
        <NavLink to="/" match="/">Home</NavLink>
      </li>
      <CoursesDropdown coursesActive={coursesActive} />
      <li className="flex list-none items-center">
        <NavLink to="/book-consultation" match="/book-consultation">Consultations</NavLink>
      </li>
      <li className="flex list-none items-center">
        <NavLink to="/about" match="/about">About</NavLink>
      </li>
      <li className="flex list-none items-center">
        <NavLink to="/contact" match="/contact">Contact</NavLink>
      </li>
    </>
  );

  const studentDesktopLinks = (
    <>
      <li className="flex list-none items-center">
        <NavLink to="/" match="/">Home</NavLink>
      </li>
      <li className="flex list-none items-center">
        <NavLink to="/dashboard" match="/dashboard">My Courses</NavLink>
      </li>
      <CoursesDropdown coursesActive={coursesActive} />
      <li className="flex list-none items-center">
        <NavLink to="/book-consultation" match="/book-consultation">Consultations</NavLink>
      </li>
      <li className="flex list-none items-center">
        <NavLink to="/contact" match="/contact">Contact</NavLink>
      </li>
    </>
  );

  const accountActions = (
    <>
      {authState.isAdmin && (
        <Link
          to="/admin"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-site-accent-dark/15 bg-[#fffaf4] px-3 py-2 text-xs font-bold !text-site-accent-dark !no-underline transition hover:!no-underline hover:border-site-accent hover:bg-white"
        >
          <Shield className="h-3.5 w-3.5" />
          Admin
        </Link>
      )}
      {authState.isStudent ? (
        <div className="flex items-center gap-1.5">
          <Link
            to="/dashboard"
            className="inline-flex max-w-[9rem] items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-site-accent-dark/15 bg-[#fffaf4] px-3 py-2 text-xs font-bold !text-site-accent-dark !no-underline transition hover:!no-underline hover:border-site-accent hover:bg-white"
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{authState.studentName}</span>
          </Link>
          <button
            type="button"
            onClick={onStudentLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-site-accent-dark/15 bg-white text-site-accent-dark transition hover:border-site-accent hover:bg-[#fff3ea]"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : !isLoginPage ? (
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-site-accent-dark/15 bg-[#fffaf4] px-3 py-2 text-xs font-bold !text-site-accent-dark !no-underline transition hover:!no-underline hover:border-site-accent hover:bg-white"
        >
          <User className="h-3.5 w-3.5" />
          Student Login
        </Link>
      ) : null}
      <button
        type="button"
        onClick={onBookConsultation}
        className={`${NAV_ACTION_BTN} bg-gradient-to-br from-site-primary to-site-accent-dark text-white shadow-md hover:shadow-lg`}
      >
        <CalendarCheck className="h-3.5 w-3.5" />
        Book Consultation
      </button>
    </>
  );

  const mobilePrimaryLinks = authState.isStudent
    ? [
        { label: 'Home', to: '/', match: '/' },
        { label: 'My Courses', to: '/dashboard', match: '/dashboard' },
        { label: 'Consultations', to: '/book-consultation', match: '/book-consultation' },
        { label: 'Contact', to: '/contact', match: '/contact' },
      ]
    : [
        { label: 'Home', to: '/', match: '/' },
        { label: 'Consultations', to: '/book-consultation', match: '/book-consultation' },
        { label: 'About', to: '/about', match: '/about' },
        { label: 'Contact', to: '/contact', match: '/contact' },
      ];

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[1020] w-full bg-site-bg shadow-[0_1px_0_0_rgba(139,74,30,0.08)] [&_a]:!no-underline [&_a:hover]:!no-underline [&_a:visited]:!no-underline"
    >
      {/* Report ticker — fixed height so main padding always matches */}
      <div className="flex h-9 shrink-0 items-center overflow-hidden border-b border-site-accent-dark/15 bg-site-bg sm:h-8">
        <div className="flex h-full shrink-0 items-center bg-site-accent-dark px-3 text-[0.625rem] font-bold uppercase tracking-wider text-white sm:px-4 sm:text-xs">
          Popular Reports
        </div>
        <div className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-6 pl-3 pr-6 sm:gap-10">
            {[...REPORT_ITEMS, ...REPORT_ITEMS].map((text, index) => (
              <span
                key={`${text}-${index}`}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-site-muted sm:text-sm"
              >
                <span className="rounded-full bg-site-accent px-2 py-0.5 text-[0.625rem] font-extrabold uppercase text-white">
                  New
                </span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`border-b border-site-accent-dark/15 bg-site-bg transition-shadow ${
          scrolled ? 'shadow-[0_4px_20px_rgba(139,74,30,0.12)]' : 'shadow-[0_2px_8px_rgba(139,74,30,0.06)]'
        }`}
      >
        <div className="mx-auto flex h-[4rem] w-full max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8 xl:grid xl:grid-cols-[auto_1fr_auto] xl:justify-normal">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center justify-self-start no-underline" aria-label="DS Institute home">
            <img
              src={SITE_LOGO}
              alt={SITE_LOGO_ALT}
              className="h-11 w-auto object-contain sm:h-12 lg:h-14"
              fetchPriority="high"
            />
          </Link>

          {/* Desktop navigation — centered */}
          <nav className="hidden items-center justify-center xl:flex" aria-label="Main navigation">
            <ul className="flex flex-row flex-nowrap items-center gap-0.5 lg:gap-1">
              {authState.isStudent ? studentDesktopLinks : guestDesktopLinks}
            </ul>
          </nav>

          {/* Right column: desktop actions + mobile menu */}
          <div className="flex items-center justify-end gap-2.5 justify-self-end">
            <div className="hidden items-center gap-2.5 xl:flex">{accountActions}</div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-site-primary bg-white text-site-primary shadow-sm transition hover:border-site-accent hover:bg-[#fffaf4] xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-[1054] bg-site-primary/45 transition-opacity xl:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobile}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 z-[1055] flex h-full w-full max-w-sm flex-col bg-site-bg shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-site-accent-dark/15 px-4 py-3">
          <Link to="/" onClick={closeMobile} className="flex items-center gap-2 no-underline">
            <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-10 w-auto" />
            <span className="font-heading text-sm font-bold text-site-accent-dark">DS Institute</span>
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-site-accent-dark transition hover:bg-site-accent/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          <ul className="m-0 list-none p-0">
            {mobilePrimaryLinks.map((item) => (
              <li key={item.to} className="border-b border-site-accent-dark/10">
                <NavLink to={item.to} match={item.match} onClick={closeMobile} className="block px-4 py-3.5">
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="border-b border-site-accent-dark/10">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[0.6875rem] font-bold !uppercase tracking-[0.08em] text-site-text"
                onClick={() => setMobileCoursesOpen((open) => !open)}
                aria-expanded={mobileCoursesOpen}
              >
                Courses
                <ChevronDown className={`h-4 w-4 text-site-accent-dark transition-transform ${mobileCoursesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCoursesOpen && (
                <ul className="m-0 list-none space-y-1 border-t border-site-accent-dark/10 bg-[#fffaf4] px-3 py-2">
                  {COURSE_LINKS.map(({ label, to, Icon }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => {
                          setMobileCoursesOpen(false);
                          closeMobile();
                        }}
                        className="flex items-center gap-2 rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5 text-sm font-medium !text-site-muted !no-underline transition visited:!text-site-muted hover:!no-underline hover:bg-[#fff3e6] hover:!text-site-accent-dark"
                      >
                        <Icon className="h-4 w-4 opacity-60" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="border-b border-site-accent-dark/10">
              <Link
                to="/astrologer"
                onClick={closeMobile}
                className={mobileNavItemClass}
              >
                Astrologers
              </Link>
            </li>

            <li className="border-b border-site-accent-dark/10">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-text"
                onClick={() => setMobileToolsOpen((open) => !open)}
                aria-expanded={mobileToolsOpen}
              >
                Free Tools
                <ChevronDown className={`h-4 w-4 text-site-accent-dark transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileToolsOpen && (
                <ul className="m-0 list-none space-y-1 border-t border-site-accent-dark/10 bg-[#fffaf4] px-3 py-2">
                  {[
                    { label: 'All Free Tools', to: '/free-tools' },
                    { label: 'Numerology', to: '/numerology' },
                    { label: 'Tarot Reading', to: '/tarot' },
                    { label: 'Love Calculator', to: '/love' },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={closeMobile}
                className="block rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5 text-sm font-medium !text-site-muted !no-underline transition visited:!text-site-muted hover:!no-underline hover:bg-[#fff3e6] hover:!text-site-accent-dark"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {!authState.isStudent && (
              <>
                <li className="border-b border-site-accent-dark/10">
                  <Link
                    to="/blog"
                    onClick={closeMobile}
                    className={mobileNavItemClass}
                  >
                    Blog
                  </Link>
                </li>
                <li className="border-b border-site-accent-dark/10">
                  <Link
                    to="/careers"
                    onClick={closeMobile}
                    className={`flex items-center gap-2 ${mobileNavItemClass.replace('block ', '')}`}
                  >
                    Careers
                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[0.625rem] font-bold normal-case tracking-normal text-white">
                      We&apos;re hiring
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="grid gap-2.5 p-4">
            {authState.isAdmin && (
              <Link
                to="/admin"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 rounded-xl border border-site-accent-dark/15 bg-[#fff8ef] px-4 py-3 text-xs font-bold uppercase tracking-wide !text-site-text !no-underline hover:!no-underline"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
            {authState.isStudent ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-site-accent-dark px-4 py-3 text-xs font-bold uppercase tracking-wide !text-site-accent-dark !no-underline hover:!no-underline"
                >
                  <GraduationCap className="h-4 w-4" />
                  Student Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    onStudentLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-site-accent-dark/15 bg-[#fff8ef] px-4 py-3 text-xs font-bold uppercase tracking-wide !text-site-text !no-underline"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : !isLoginPage ? (
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-site-accent-dark px-4 py-3 text-xs font-bold uppercase tracking-wide !text-site-accent-dark !no-underline hover:!no-underline"
              >
                <User className="h-4 w-4" />
                Student Login
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                closeMobile();
                onBookConsultation();
              }}
              className="flex items-center justify-center gap-2 !rounded-full bg-gradient-to-br from-site-accent-dark to-site-primary px-4 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-md"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Consultation
            </button>
            {authState.isAdmin && (
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  onAdminLogout();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-site-accent-dark/15 bg-[#fff8ef] px-4 py-3 text-xs font-bold uppercase tracking-wide text-site-text"
              >
                <LogOut className="h-4 w-4" />
                Admin Logout
              </button>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
}
