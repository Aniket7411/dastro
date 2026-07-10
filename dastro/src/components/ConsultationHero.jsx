import { Search, Sparkles, Shield, Clock, Star, X } from 'lucide-react';
import { PAGE_WRAP } from './consultation/tokens';

const SEARCH_HINTS = ['Tarot', 'Marriage', 'Career', 'Remedies'];

const TRUST_STATS = [
  { icon: Star, label: '4.9/5 Rating', sub: 'Verified clients' },
  { icon: Shield, label: '100% Private', sub: 'Confidential sessions' },
  { icon: Clock, label: '24hr Callback', sub: 'After booking' },
];

export default function ConsultationHero({
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalServices,
  loading,
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#8B4A1E]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A0F02] via-[#5C2D12] to-[#8B4A1E]" aria-hidden />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: 'url(/images/premium_tarot.png)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A0F02]/95 via-[#2A0F02]/85 to-[#2A0F02]/50" aria-hidden />

      <div className={`relative py-10 sm:py-12 lg:py-14 ${PAGE_WRAP}`}>
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C8832A]/40 bg-[#C8832A]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[#F0D4B5]">
              <Sparkles size={12} className="text-[#C8832A]" />
              Divine Guidance
            </span>
            <h1 className="font-heading text-[clamp(1.85rem,4.5vw,2.85rem)] font-extrabold leading-tight text-white">
              Book Your{' '}
              <span className="bg-gradient-to-r from-[#EBC9A3] to-[#C8832A] bg-clip-text text-transparent">
                Consultation
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/85 sm:text-base">
              Vedic astrology, tarot, kundali matching and spiritual remedies — filter by category,
              duration and price, then book with complete confidentiality.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {TRUST_STATS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex min-w-[9rem] flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C8832A]/25 text-[#EBC9A3]">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{label}</span>
                    <span className="block text-[0.68rem] text-white/65">{sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B4A1E]/70">Find a service</p>
            <p className="mt-1 mb-4 text-sm text-[#5C3D26]">
              {loading ? (
                'Loading catalog…'
              ) : (
                <>
                  <strong className="text-[#2A0F02]">{totalServices ?? 0}</strong> expert sessions
                </>
              )}
            </p>
            <label htmlFor="consult-search" className="sr-only">
              Search consultation services
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#8B4A1E]/20 bg-[#FDF6EE] px-4 py-3 focus-within:border-[#C8832A] focus-within:ring-2 focus-within:ring-[#C8832A]/25">
              <Search size={18} className="shrink-0 text-[#8B4A1E]" />
              <input
                id="consult-search"
                type="search"
                placeholder="Career, Tarot, Marriage…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-[#2A0F02] outline-none placeholder:text-[#8B4A1E]/45"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B4A1E]/10 text-[#8B4A1E] hover:bg-[#8B4A1E]/20"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-[#8B4A1E]/70">Popular:</span>
              {SEARCH_HINTS.map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => onSearchChange(hint === 'Remedies' ? 'Spell' : hint)}
                  className="rounded-lg border border-[#8B4A1E]/15 bg-white px-2.5 py-1 text-xs font-semibold text-[#8B4A1E] hover:border-[#C8832A]"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
