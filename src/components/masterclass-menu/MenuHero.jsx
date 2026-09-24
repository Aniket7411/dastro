import { HELP_LINK, PRICE, SUBJECT_ACCENT } from './menuTheme';

const STATS = [
  { value: '10k+', label: 'Students' },
  { value: '5000+', label: 'Consultations' },
  { value: 'Sony TV', label: 'Featured on' },
];

/** Badge positions around the orbit, clockwise from the top (percent of the orbit box). */
const ORBIT_POSITIONS = [
  { left: '50%', top: '3%' },
  { left: '94%', top: '36%' },
  { left: '77%', top: '88%' },
  { left: '23%', top: '88%' },
  { left: '6%', top: '36%' },
];

function OrbitBadge({ mc, position, delay, onPick }) {
  const accent = SUBJECT_ACCENT[mc.id];
  return (
    <button
      type="button"
      onClick={() => onPick(mc.id)}
      className="mcm-float group absolute z-10 flex items-center gap-2 rounded-full border border-white/15 bg-[#160a24]/85 p-1.5 text-left text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-white/40 sm:py-2 sm:pl-2 sm:pr-4"
      aria-label={`${mc.title} masterclass dekhiye`}
      style={{ ...position, animationDelay: `${delay}s` }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] text-white sm:h-8 sm:w-8 sm:text-[13px]"
        style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
      >
        <i className={`fas ${mc.icon}`} aria-hidden="true" />
      </span>
      <span className="hidden whitespace-nowrap text-[13px] font-semibold sm:inline">{mc.menu.label.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</span>
    </button>
  );
}

function MenuHero({ classes, onPick, onExplore }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0C0515] text-white">
      {/* Cosmic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_35%,#3a1454_0%,transparent_60%),radial-gradient(60%_50%_at_10%_90%,rgba(238,102,98,0.22),transparent_65%),linear-gradient(180deg,#0C0515_0%,#150824_60%,#1c0c2e_100%)]" />
        <div className="mcm-stars absolute inset-0 opacity-60" />
        <div className="mcm-stars-2 absolute inset-0" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-y-8 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-8 lg:gap-y-0 lg:pb-24 lg:pt-16">
          {/* Copy — row 1 on desktop; the stats sit under it (row 2) while the orbit spans both */}
          <div className="[text-align:center] lg:col-start-1 lg:row-start-1 lg:self-end lg:[text-align:left]">
            <div className="mcm-rise inline-flex items-center gap-2 rounded-full border border-[#EE6662]/40 bg-[#EE6662]/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#FFB4A6] sm:text-xs">
              <span className="mcm-pulse h-2 w-2 rounded-full bg-[#EE6662]" />
              LIVE MASTERCLASS · {PRICE} ONLY
            </div>

            <h1
              className="mcm-rise mb-0 mt-[20px] font-heading text-[34px] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[46px] lg:text-[58px]"
              style={{ animationDelay: '.08s' }}
            >
              Aap kaun si <span className="mcm-shine">Live Masterclass</span> join karna chahte hain?
            </h1>

            <p
              className="mcm-rise mb-0 mt-[20px] max-w-[34rem] text-[15px] leading-relaxed text-white/70 [margin-inline:auto] sm:text-[17px] lg:[margin-inline:0]"
              style={{ animationDelay: '.16s' }}
            >
              {classes.length} subjects, har masterclass sirf {PRICE} mein — 2 din, 2 ghante roz, Damini Ma&apos;am ke saath
              live. Apna subject chuniye, baaki hum sambhal lenge.
            </p>

            <div
              className="mcm-rise mt-7 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
              style={{ animationDelay: '.24s' }}
            >
              <button
                type="button"
                onClick={onExplore}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-7 text-[15px] font-bold text-white shadow-[0_14px_34px_rgba(238,102,98,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(238,102,98,0.5)] sm:w-auto"
              >
                Apna subject chuniye
                <i className="fas fa-arrow-down text-[12px]" aria-hidden="true" />
              </button>
              <a
                href={HELP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                <i className="fab fa-whatsapp text-[#25D366]" aria-hidden="true" />
                Pehle baat karni hai?
              </a>
            </div>
          </div>

          {/* Orbit visual */}
          <div className="relative mx-auto aspect-square w-full max-w-[340px] self-center sm:max-w-[440px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[520px]">
            <div className="absolute inset-[6%] overflow-hidden rounded-full opacity-45 [mask-image:radial-gradient(circle,#000_55%,transparent_71%)]">
              <img src="/zodiac_wheel.webp" alt="" width="900" height="900" className="mcm-spin h-full w-full object-cover" fetchPriority="high" />
            </div>
            <div className="absolute inset-[3%] rounded-full border border-dashed border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FFC463] via-[#EE6662] to-[#7B3FE4] p-[3px] shadow-[0_0_60px_rgba(238,102,98,0.55)]">
              <img
                src="/updatedmentor.webp"
                alt="Damini Ma'am, your mentor"
                width="400"
                height="400"
                className="h-full w-full rounded-full object-cover object-[50%_28%]"
              />
            </div>
            <div className="absolute left-1/2 top-[74%] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#160a24]/90 px-3 py-1 text-[11px] font-semibold text-white/85 backdrop-blur sm:text-xs">
              Damini Ma&apos;am · Your mentor
            </div>
            {classes.map((mc, i) => (
              <OrbitBadge key={mc.id} mc={mc} position={ORBIT_POSITIONS[i % ORBIT_POSITIONS.length]} delay={i * 0.6} onPick={onPick} />
            ))}
          </div>

          {/* Stats — below the circle on mobile, under the copy on desktop */}
          <dl
            className="mcm-rise mb-0 grid w-full max-w-md grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-[20px] [margin-inline:auto] [text-align:center] lg:col-start-1 lg:row-start-2 lg:mt-9 lg:self-start lg:divide-x-0 lg:[margin-inline:0] lg:[text-align:left]"
            style={{ animationDelay: '.32s' }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse px-1 lg:px-0">
                <dt className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/55 sm:text-[11px] sm:tracking-[0.14em]">{s.label}</dt>
                <dd className="m-0 font-heading text-[22px] font-bold leading-none text-white sm:text-[26px]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Fade into the cream cards section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#FAF6EE] sm:h-16" />
    </section>
  );
}

export default MenuHero;
