import { Link } from 'react-router-dom';
import { LogOut, Plus, Sparkles } from 'lucide-react';
import { BTN, PAGE_WRAP, TYPE } from './tokens';

export default function DashboardHero({
  greeting,
  studentName,
  enrolledCount,
  onLogout,
}) {
  return (
    <header className="relative -mt-site-header w-full overflow-hidden border-b border-site-accent-dark/10 bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className={`relative z-10 flex flex-col gap-3 pt-site-header pb-8 sm:gap-4 sm:pb-10 lg:flex-row lg:items-end lg:justify-between lg:pb-11 ${PAGE_WRAP}`}
      >
        <div className="min-w-0 flex-1">
          <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 shadow-[0_0_12px_rgba(245,201,141,0.12)] backdrop-blur-sm ${TYPE.heroKicker}`}>
            <Sparkles size={11} />
            {greeting}
          </span>
          <h1 className={TYPE.heroTitle}>
            Welcome back,{' '}
            <span className={TYPE.heroName}>{studentName}</span>
          </h1>
          <p className={`mt-2 max-w-xl ${TYPE.heroLead}`}>
            {enrolledCount > 0
              ? 'Track progress, download materials, and continue learning.'
              : 'Browse recorded courses to start your Vedic astrology journey.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link to="/recorded-courses" className={BTN.hero}>
            <Plus size={15} />
            Explore Courses
          </Link>
          <button type="button" onClick={onLogout} className={`${BTN.heroGhost} lg:hidden`}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
