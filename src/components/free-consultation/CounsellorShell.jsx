import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { SITE_LOGO, SITE_LOGO_ALT } from '../../utils/brandAssets';
import { BTN_OUTLINE, SHELL, WRAP } from './tokens';

export default function CounsellorShell({ counsellorName, onLogout, children }) {
  return (
    <div className={`${SHELL} tw-page`}>
      <header className="border-b border-site-accent-dark/10 bg-white/95 backdrop-blur-sm">
        <div className={`${WRAP} flex flex-wrap items-center justify-between gap-3 !py-3 sm:!py-4`}>
          <Link to="/counsellor/desk" className="flex min-w-0 items-center gap-2.5 no-underline">
            <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-9 w-9 rounded-lg object-contain sm:h-10 sm:w-10" />
            <div className="min-w-0">
              <p className="truncate font-body text-[10px] font-bold uppercase tracking-[0.14em] text-site-accent">
                Free consultation desk
              </p>
              <p className="truncate font-body text-sm font-extrabold text-site-primary sm:text-base">
                DS Astrology
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {counsellorName ? (
              <span className="hidden font-body text-xs font-semibold text-site-muted sm:inline">
                {counsellorName}
              </span>
            ) : null}
            <button type="button" onClick={onLogout} className={BTN_OUTLINE}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
