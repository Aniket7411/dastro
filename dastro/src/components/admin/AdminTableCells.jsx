import { getInitials } from '../../utils/adminTableUtils';

const AVATAR_COLORS = ['blue', 'violet', 'cyan', 'emerald', 'amber', 'rose', 'indigo'];

function hashColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function AdminPersonCell({ name, primary, secondary, meta, avatar, color }) {
  const displayName = name || primary || '—';
  const tone = color || hashColor(displayName);

  return (
    <div className="atd-person">
      <div className={`atd-avatar atd-avatar--${tone}`}>
        {avatar || getInitials(displayName)}
      </div>
      <div className="atd-person__meta">
        <div className="atd-primary">{displayName}</div>
        {secondary && <div className="atd-secondary">{secondary}</div>}
        {meta && <div className="atd-meta">{meta}</div>}
      </div>
    </div>
  );
}

export function AdminBadge({ children, tone = 'slate', uppercase = false }) {
  return (
    <span className={`atd-badge atd-badge--${tone} ${uppercase ? 'atd-badge--upper' : ''}`}>
      {children}
    </span>
  );
}

export function AdminStatusDot({ label, tone = 'amber' }) {
  return (
    <span className={`atd-status atd-status--${tone}`}>
      <span className="atd-status__dot" />
      {label}
    </span>
  );
}

export function AdminActionGroup({ children }) {
  return <div className="atd-actions">{children}</div>;
}

export function AdminIconButton({ children, onClick, title, tone = 'indigo', href, target, rel }) {
  const className = `atd-icon-btn atd-icon-btn--${tone}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={className} title={title}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} title={title}>
      {children}
    </button>
  );
}
