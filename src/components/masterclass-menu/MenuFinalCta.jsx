import { HELP_LINK, HELP_NUMBER, PRICE } from './menuTheme';

function MenuFinalCta({ onExplore }) {
  return (
    <section className="bg-[#FAF6EE] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mcm-reveal relative isolate mx-auto max-w-[1080px] overflow-hidden rounded-[28px] bg-[#150824] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="mcm-stars absolute inset-0 opacity-50" />
          <div className="absolute -right-24 -top-24 h-80 w-80 overflow-hidden rounded-full opacity-30">
            <img src="/zodiac_wheel.webp" alt="" className="mcm-spin h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_100%,rgba(238,102,98,0.3),transparent_70%)]" />
        </div>

        <h2 className="m-0 font-heading text-white text-[28px] font-bold leading-tight sm:text-[42px]">
          Aapka pehla step, <span className="mcm-shine">sirf {PRICE}</span> mein
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
          Har masterclass live hoti hai aur recording bhi milti hai. Batch ki date aur time payment ke baad share ki jaati hai.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-7 text-[15px] font-bold text-white shadow-[0_14px_34px_rgba(238,102,98,0.4)] transition hover:-translate-y-0.5 sm:w-auto"
          >
            Masterclass chuniye
            <i className="fas fa-arrow-up text-[12px]" aria-hidden="true" />
          </button>
          <a
            href={HELP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            <i className="fab fa-whatsapp text-[#25D366]" aria-hidden="true" />
            {HELP_NUMBER}
          </a>
        </div>
      </div>
    </section>
  );
}

export default MenuFinalCta;
