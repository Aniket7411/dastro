import { Link } from 'react-router-dom';
import { History, LogOut, Phone, UserRound } from 'lucide-react';
import { SITE_LOGO, SITE_LOGO_ALT } from '../../utils/brandAssets';
import { BTN_OUTLINE, DESK_SHELL, DESK_WRAP } from './tokens';

const TABS = [
  { id: 'new', label: 'New call', icon: Phone },
  { id: 'history', label: 'Past calls', icon: History },
];

export default function CounsellorShell({
  counsellorName,
  onLogout,
  activeTab = 'new',
  onTabChange,
  children,
}) {
  return (
    <div className={`${DESK_SHELL} tw-page flex min-h-screen flex-col`}>
      <header className="shrink-0 border-b border-[#000] bg-[#fff]">
        <div className={`${DESK_WRAP} flex items-center justify-between gap-2 !py-2 sm:!py-2.5`}>
          <Link to="/counsellor/desk" className="flex min-w-0 items-center gap-2 no-underline">
            <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-9 w-9 rounded-md object-contain sm:h-10 sm:w-10" />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-body text-[9px] font-bold uppercase tracking-[0.12em] text-[#444] sm:text-[10px]">
                Free consultation desk
              </p>
              <p className="truncate font-body text-sm font-extrabold text-[#000]">
                DS Astrology
              </p>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {counsellorName ? (
              <span className="hidden max-w-[120px] items-center gap-1 truncate font-body text-[11px] font-semibold text-[#444] sm:inline-flex lg:max-w-[180px]">
                <UserRound size={12} className="shrink-0" aria-hidden />
                {counsellorName}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onLogout}
              className={`${BTN_OUTLINE} !min-h-8 !px-3 !py-1.5 !text-xs`}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {onTabChange ? (
          <div className={`${DESK_WRAP} !pt-0 !pb-2`}>
            <nav className="flex gap-1 border border-[#000] p-0.5" aria-label="Desk sections">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-2 py-2 font-body text-xs font-bold transition sm:text-[13px] ${
                      isActive
                        ? 'bg-[#000] text-[#fff]'
                        : 'bg-[#fff] text-[#000] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <Icon size={14} aria-hidden />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
