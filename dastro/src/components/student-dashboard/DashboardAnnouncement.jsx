import { Megaphone, X } from 'lucide-react';
import { PAGE_WRAP, TYPE } from './tokens';

export default function DashboardAnnouncement({ text, onDismiss }) {
  if (!text) return null;

  return (
    <div className="relative z-30 w-full bg-amber-400 px-4 py-2.5 sm:px-6">
      <div className={`${PAGE_WRAP} flex items-center gap-3 !px-0`}>
        <Megaphone size={15} className="shrink-0 text-amber-900" />
        <p className={`min-w-0 flex-1 truncate ${TYPE.metaBold} text-amber-900 sm:text-sm`}>
          {text}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss announcement"
          className="sd-btn shrink-0 rounded-full border-0 bg-transparent p-1 text-amber-900/70 transition hover:bg-amber-900/10 hover:text-amber-900"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
