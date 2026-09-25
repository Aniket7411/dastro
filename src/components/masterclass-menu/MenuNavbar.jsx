import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_LOGO, SITE_LOGO_ALT } from '../../utils/brandAssets';
import { SUBJECT_ACCENT } from './menuTheme';

function MenuNavbar({ classes }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (!panelRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav
      className={`sticky top-0 z-[80] border-b border-[#EFE6D8] bg-white transition-shadow ${
        scrolled || open ? 'shadow-[0_6px_20px_rgba(31,26,22,0.08)]' : ''
      }`}
      aria-label="Masterclass navigation"
    >
      <div className="relative mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-4 sm:h-[88px] sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center" aria-label="DS Astrology home">
          <img src={SITE_LOGO} alt={SITE_LOGO_ALT} width="72" height="72" className="h-[60px] w-[60px] object-contain sm:h-[72px] sm:w-[72px]" />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mcm-nav-panel"
          aria-label={open ? 'Menu band kijiye' : 'Menu kholiye'}
          className={`group relative flex h-11 items-center gap-2.5 rounded-full pl-4 pr-3.5 text-[13px] font-semibold tracking-wide transition duration-200 hover:shadow-[0_8px_20px_-8px_rgba(42,22,71,0.6)] ${
            open ? 'bg-[#EE6662] text-white' : 'bg-[#2A1647] text-white hover:bg-[#3B2261]'
          }`}
        >
          <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
          <span className="relative block h-[14px] w-[22px]" aria-hidden="true">
            <span className={`absolute right-0 h-[2px] rounded-full bg-current transition-all duration-300 ${open ? 'top-[6px] w-[22px] rotate-45' : 'top-0 w-[22px]'}`} />
            <span className={`absolute right-0 top-[6px] h-[2px] rounded-full bg-current transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-[14px] opacity-100 group-hover:w-[22px]'}`} />
            <span className={`absolute right-0 h-[2px] rounded-full bg-current transition-all duration-300 ${open ? 'top-[6px] w-[22px] -rotate-45' : 'top-[12px] w-[18px] group-hover:w-[22px]'}`} />
          </span>
        </button>

        <div
          id="mcm-nav-panel"
          ref={panelRef}
          className={`absolute right-4 top-[calc(100%+8px)] w-[min(360px,calc(100vw-32px))] origin-top-right rounded-2xl border border-[#EFE6D8] bg-white p-[8px] shadow-[0_24px_60px_-12px_rgba(31,26,22,0.28)] transition duration-200 sm:right-6 lg:right-10 ${
            open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
          }`}
        >
          <p className="m-0 px-[12px] pb-[6px] pt-[8px] text-[11px] font-semibold tracking-[0.16em] text-[#9A8B7C]">MASTERCLASSES</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {classes.map((mc) => {
              const accent = SUBJECT_ACCENT[mc.id];
              const active = pathname === mc.detailsPath;
              return (
                <li key={mc.id}>
                  <Link
                    to={mc.detailsPath}
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                    className={`flex items-center gap-[12px] rounded-xl px-[12px] py-[10px] transition hover:bg-[#FAF6EE] ${active ? 'bg-[#FAF6EE]' : ''}`}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] text-white"
                      style={{ background: accent }}
                    >
                      <i className={`fas ${mc.icon}`} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-[#1F1A16]">{mc.title}</span>
                      <span className="block truncate text-[12px] text-[#7A6B5D]">{mc.menu.title}</span>
                    </span>
                    <i className="fas fa-chevron-right text-[11px] text-[#C9B99F]" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-[6px] border-t border-[#EFE6D8] pt-[6px]">
            <Link
              to="/masterclasses"
              onClick={() => {
                close();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-center gap-2 rounded-xl px-[12px] py-[10px] text-[13px] font-semibold text-[#EE6662] transition hover:bg-[#FFF1EF]"
            >
              Sabhi masterclasses dekhiye
              <i className="fas fa-arrow-right text-[11px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MenuNavbar;
