import { HUB_INCLUSIONS } from '../../data/masterclassHubData';
import { PRICE } from './menuTheme';

const STEPS = [
  { icon: 'fa-hand-pointer', title: 'Subject chuniye', text: 'Jo subject aapko sabse zyada kheenchta hai, uska card chuniye.' },
  { icon: 'fa-user-edit', title: `Form bhariye & ${PRICE} pay kijiye`, text: 'Naam, phone aur city — 30 second ka kaam. Phir secure payment.' },
  { icon: 'fa-video', title: 'Zoom par live judiye', text: 'Batch date, time aur Zoom link WhatsApp aur email par aa jaata hai.' },
];

function MenuJourney() {
  return (
    <section className="relative isolate overflow-hidden bg-[#150824] py-[32px] text-white sm:py-[44px]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mcm-stars absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_20%,rgba(123,63,228,0.28),transparent_70%),radial-gradient(45%_50%_at_10%_85%,rgba(238,102,98,0.2),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
        <div className="mcm-reveal mx-auto max-w-2xl text-center">
          <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#FFB4A6] sm:text-xs">HAR MASTERCLASS MEIN</p>
          <h2 className="m-0 mt-3 font-heading text-white text-[28px] font-bold leading-tight sm:text-[38px]">
            Sirf {PRICE} mein <span className="mcm-shine">itna kuch</span>
          </h2>
        </div>

        <ul className="mb-0 mt-[22px] grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {HUB_INCLUSIONS.map((item, i) => (
            <li
              key={item.text}
              className="mcm-reveal flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.07] sm:p-5"
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EE6662] to-[#7B3FE4] text-[15px] shadow-[0_8px_20px_rgba(238,102,98,0.3)]">
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </span>
              <span className="text-[14px] leading-relaxed text-white/80">{item.text}</span>
            </li>
          ))}
        </ul>

        <div className="mcm-reveal mt-[34px] text-center">
          <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#FFB4A6] sm:text-xs">JOIN KAISE KAREIN</p>
          <h2 className="m-0 mt-3 font-heading text-white text-[28px] font-bold leading-tight sm:text-[38px]">Bas 3 steps</h2>
        </div>

        <div className="relative mt-[22px]">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-[#EE6662]/0 via-[#EE6662]/60 to-[#EE6662]/0 md:block" />
          <ol className="relative m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="mcm-reveal relative text-center" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#EE6662]/50 bg-[#1f0c33] text-[18px] text-[#FFB4A6] shadow-[0_0_30px_rgba(238,102,98,0.35)]">
                  <i className={`fas ${step.icon}`} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#EE6662] text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="m-0 mt-4 font-heading text-[18px] font-semibold text-white">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[18rem] text-[14px] leading-relaxed text-white/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default MenuJourney;
