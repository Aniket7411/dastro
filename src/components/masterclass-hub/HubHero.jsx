import { WB_WRAP, WB_HIGHLIGHT, WB_BADGE, WB_BADGE_ICON, WB_TITLE_HERO, TYPE } from '../webinar/tokens';
import HeroCarousel from './HeroCarousel';

const STATS = [
  { value: '5', label: 'Live Masterclasses' },
  { value: '10k+', label: 'Students Taught' },
  { value: '5000+', label: 'Consultations' },
  { value: 'Sony TV', label: 'Featured On' },
];

function HubHero({ activeId, onSelect, onJoinNow, onExplore }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-5 sm:pt-6 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(238,102,98,0.08),transparent_60%)]" />
      <div className={`${WB_WRAP} relative`}>
        <div className="mb-3 flex justify-center sm:mb-4" data-aos="fade-up">
          <div className={WB_BADGE}>
            <span className={WB_BADGE_ICON}>
              <i className="fas fa-gem" aria-hidden="true" />
            </span>
            5 Masterclasses · 1 Mentor · ₹499 each
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl text-center" data-aos="fade-up">
          <h1 className={`wb-hero-title ${WB_TITLE_HERO}`}>
            5 Ancient Sciences. <span className={WB_HIGHLIGHT}>One Live Classroom.</span>
          </h1>
          <p
            className={`${TYPE.lead} mx-auto max-w-[40ch] text-center mt-2 sm:mt-3 text-slate-600`}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            5 live 2-day masterclasses with Damini Shukla — pick yours below for ₹499.
          </p>
        </div>

        <HeroCarousel activeId={activeId} onSelect={onSelect} onJoinNow={onJoinNow} />

        <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3" data-aos="fade-up" data-aos-delay="200">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-[14px] border border-slate-200 bg-white/70 px-2 py-2.5 text-center shadow-sm backdrop-blur">
              <p className="m-0 font-heading text-lg font-extrabold text-[#3B2261] sm:text-xl">{stat.value}</p>
              <p className="m-0 mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center sm:mt-5" data-aos="fade-up" data-aos-delay="250">
          <button
            type="button"
            onClick={onExplore}
            className="m-0 inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-6 font-body text-[13.5px] font-bold text-white shadow-[0_10px_24px_rgba(238,102,98,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(238,102,98,0.36)]"
          >
            Explore All 5 Masterclasses
            <i className="fas fa-arrow-down text-[12px]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HubHero;
