import { DASHBOARD_ROOT, PAGE_WRAP } from './tokens';
import { InlineLoader, Skel, StatCard } from './ui';

export default function DashboardLoading() {
  return (
    <div className={DASHBOARD_ROOT}>
      <div className="relative -mt-site-header bg-gradient-to-br from-[#1e0c02] via-[#3a1c0c] to-site-accent-dark px-4 pb-10 pt-site-header sm:px-6 sm:pb-12">
        <Skel className="mb-2 h-3 w-24 bg-white/10" />
        <Skel className="mb-2 h-8 w-72 max-w-full bg-white/10" />
        <Skel className="h-3.5 w-96 max-w-full bg-white/10" />
      </div>
      <div className={PAGE_WRAP}>
        <div className="pb-5 pt-4 sm:pt-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex min-h-0 items-center gap-3.5 rounded-xl border border-t-2 border-site-accent-dark/10 bg-white px-4 py-3.5">
                <Skel className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skel className="h-2.5 w-16" />
                  <Skel className="h-5 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <InlineLoader label="Preparing your dashboard…" />
    </div>
  );
}

export function DashboardStats({ stats }) {
  return (
    <div className={`${PAGE_WRAP} pb-1 pt-4 sm:pt-5`}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
