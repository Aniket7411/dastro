import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_PURPLE, WB_SECTION, WB_SECTION_HEADER, TYPE } from '../webinar/tokens';
import { HUB_FAQS } from '../../data/masterclassHubData';

function HubFaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_HEADER}>
          <h2 className={TYPE.h2Center}>
            <span className={WB_HIGHLIGHT}>FAQ&apos;s:</span> <span className={WB_PURPLE}>Here&apos;s everything you may ask</span>
          </h2>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {HUB_FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={faq.q}
                className="cursor-pointer overflow-hidden rounded-lg bg-[#3B2261] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveFaq(isOpen ? null : idx);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between min-h-[60px] gap-3 px-[20px] py-[18px]">
                  <span className={`${TYPE.faqQ} pr-[44px]`}>{faq.q}</span>
                  <i
                    className={`fas fa-chevron-down shrink-0 text-xs text-white/90 transition-transform duration-200 sm:text-sm ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className={`overflow-hidden bg-white transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className={`${TYPE.faqA} border-t border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4`}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HubFaqSection;
