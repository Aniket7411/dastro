import { Loader2 } from 'lucide-react';
import { BTN, STAT_CARD, TYPE } from './tokens';

export function Skel({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-site-accent-dark/15 ${className}`} />;
}

export function StatCard({ label, value, icon: Icon, iconBg, cardBg, topBorder }) {
  return (
    <div className={`${STAT_CARD} ${topBorder || ''} ${cardBg || 'bg-white'}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm ${iconBg}`}
      >
        <Icon size={17} strokeWidth={2.25} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate ${TYPE.statLabel}`}>{label}</p>
        <p className={`mt-0.5 ${TYPE.statValue}`}>{value}</p>
      </div>
    </div>
  );
}

export function ProgressBar({ value, thin = false }) {
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div className={`w-full overflow-hidden rounded-full bg-site-accent-dark/10 ${thin ? 'h-1.5' : 'h-2'}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-site-accent-dark to-site-accent transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SectionHead({ icon: Icon, title, badge, iconCls }) {
  const cls = iconCls || 'bg-site-accent/10 text-site-accent-dark';
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls}`}>
          <Icon size={16} />
        </div>
        <h2 className={TYPE.sectionTitle}>{title}</h2>
      </div>
      {badge}
    </div>
  );
}

export function Pill({ children, active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-[11px] font-bold ${
        active
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'bg-site-bg text-site-muted'
      }`}
    >
      {children}
    </span>
  );
}

export function BtnPrimary({ children, className = '', ...rest }) {
  return (
    <button type="button" className={`${BTN.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function BtnOutline({ children, className = '', ...rest }) {
  return (
    <button type="button" className={`${BTN.outline} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function InlineLoader({ label = 'Loading…' }) {
  return (
    <p className={`flex items-center justify-center gap-2 py-6 ${TYPE.metaBold}`}>
      <Loader2 size={16} className="animate-spin text-site-accent" />
      {label}
    </p>
  );
}
