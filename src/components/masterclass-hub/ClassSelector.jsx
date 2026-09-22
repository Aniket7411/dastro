import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_SECTION, WB_SECTION_INTRO, WB_INTRO_TITLE, WB_INTRO_BODY, TYPE } from '../webinar/tokens';
import { MASTERCLASSES } from '../../data/masterclassHubData';

const INFO_CHIPS = [
  { icon: 'fa-hourglass-half', label: 'DURATION', value: '2 Days' },
  { icon: 'fa-clock', label: 'SESSIONS', value: '2 hrs / day' },
  { icon: 'fa-laptop', label: 'FORMAT', value: 'Live on Zoom' },
  { icon: 'fa-video', label: 'ACCESS', value: 'Recording incl.' },
];

function ClassSelector({ activeId, onSelect, onJoinNow, panelRef }) {
  const [tab, setTab] = useState('learn');
  const active = MASTERCLASSES.find((mc) => mc.id === activeId) || MASTERCLASSES[0];

  return (
    <section id="masterclass-selector" ref={panelRef} className={`${WB_SECTION} bg-white scroll-mt-20`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO} data-aos="fade-up">
          <h2 className={WB_INTRO_TITLE}>
            Choose Your <span className={WB_HIGHLIGHT}>Masterclass</span>
          </h2>
          <p className={WB_INTRO_BODY}>Same live format, same mentor, same ₹499 — pick the one that calls you.</p>
        </div>

        {/* Selector grid */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5" data-aos="fade-up">
          {MASTERCLASSES.map((mc) => {
            const isActive = mc.id === active.id;
            return (
              <button
                key={mc.id}
                type="button"
                onClick={() => { setTab('learn'); onSelect(mc.id); }}
                aria-pressed={isActive}
                className={`group flex flex-col items-center gap-2 rounded-[16px] border p-3 text-center transition sm:p-4 ${
                  isActive
                    ? 'border-[#EE6662] bg-[#FFF5F4] shadow-[0_12px_28px_rgba(238,102,98,0.22)]'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#EE6662]/40 hover:shadow-md'
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-lg sm:h-12 sm:w-12 ${
                    isActive ? 'bg-[#EE6662] text-white' : 'bg-slate-100 text-[#3B2261] group-hover:bg-[#EE6662]/10'
                  }`}
                >
                  <i className={`fas ${mc.icon}`} aria-hidden="true" />
                </span>
                <span className={`text-[12.5px] font-bold leading-tight sm:text-[13px] ${isActive ? 'text-[#3B2261]' : 'text-slate-700'}`}>
                  {mc.title}
                </span>
                {isActive && (
                  <span className="rounded-full bg-[#EE6662] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div key={active.id} className="hub-panel-enter mt-8 rounded-[22px] border border-slate-200 bg-[#FAF9F6] p-3 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-5 lg:p-7">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:items-center">
            <div className="relative mx-auto aspect-video w-full max-w-lg overflow-hidden rounded-[16px] border border-slate-200 bg-slate-50 shadow-md">
              <img src={active.image} alt={active.title} className="absolute inset-0 h-full w-full object-contain" loading="eager" />
              <div className="absolute left-3 top-3 rounded-full bg-[#3B2261]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                2-Day Masterclass
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="font-heading text-[22px] font-extrabold leading-tight text-[#3B2261] sm:text-[28px]">
                {active.tagline}
              </h3>
              <p className={`${TYPE.lead} mx-auto mt-2 max-w-xl text-slate-600 lg:mx-0`}>{active.hook}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
                {INFO_CHIPS.map((chip) => (
                  <div key={chip.label} className="flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-2.5 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EE6662] text-[11px] text-white sm:h-8 sm:w-8">
                      <i className={`fas ${chip.icon}`} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="m-0 text-[9px] font-bold uppercase tracking-widest text-[#EE6662] sm:text-[10px]">{chip.label}</p>
                      <p className="m-0 truncate text-[12px] font-bold text-slate-800 sm:text-[13px]">{chip.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-4 flex flex-col gap-1.5 text-left">
                {active.highlights.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[13px] font-semibold leading-snug text-slate-700 sm:text-[14px]">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-green-100">
                      <i className="fa fa-check text-[9px] text-green-600" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <button
                  type="button"
                  onClick={() => onJoinNow(active.id)}
                  className="m-0 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-6 font-body text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(238,102,98,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(238,102,98,0.38)] sm:w-auto"
                >
                  Reserve My Seat — ₹499
                  <i className="fas fa-arrow-right text-[12px]" aria-hidden="true" />
                </button>
                <span className="text-[11px] font-semibold text-slate-500">₹1,999 <span className="line-through">value</span> · launch price</span>
              </div>

              {/* Learn / Who-for tabs */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="mb-3 flex justify-center gap-2 lg:justify-start">
                  {[
                    { id: 'learn', label: "What You'll Learn" },
                    { id: 'whoFor', label: 'Who This Is For' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-bold transition sm:text-[12.5px] ${
                        tab === t.id ? 'bg-[#3B2261] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <ul className="flex flex-col gap-1.5 text-left">
                  {(tab === 'learn' ? active.learn : active.whoFor).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-slate-600 sm:text-[13.5px]">
                      <i className="fas fa-circle mt-[5px] text-[4px] text-[#EE6662]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hub-panel-enter { animation: hubPanelFade .45s cubic-bezier(.2,.7,.3,1); }
        @keyframes hubPanelFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hub-panel-enter { animation: none; } }
      `}</style>
    </section>
  );
}

export default ClassSelector;
