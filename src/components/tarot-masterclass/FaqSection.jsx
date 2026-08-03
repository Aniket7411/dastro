import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_PURPLE, WB_SECTION, WB_SECTION_HEADER, TYPE } from '../webinar/tokens';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'When is the next batch? / Batch kab hai?',
      a: 'The masterclass runs for 2 days, 2 hours each evening, live on Zoom. We run batches regularly, and your exact batch dates and timing are shared on WhatsApp immediately after you register. Our team also calls you to confirm your slot personally, so you can pick the batch that suits you best.',
    },
    {
      q: 'What if the batch timing doesn\'t suit me?',
      a: 'No problem. Tell our team on the confirmation call and we will move you to the next batch at no extra cost. And even if you miss a live session, the full recording is included - so nothing is lost.',
    },
    {
      q: 'What happens after I pay?',
      a: 'Three things, within minutes: (1) you get a confirmation on WhatsApp and email; (2) your batch dates, timing and Zoom link are shared with you; (3) our team calls you to confirm your slot and answer any question before the class. Support: +91 90055 75577 on WhatsApp.',
    },
    {
      q: 'Is the session recorded?',
      a: 'Yes. Every session is recorded and the recording is included with your registration - even if you attend live.',
    },
    {
      q: 'What should I keep ready?',
      a: 'A notebook, a mirror, and two or three photos of family or friends for the live practice reading. Nothing else - no prior astrology knowledge needed.',
    },
    {
      q: 'What is the fee?',
      a: 'Launch offer ₹500 only (actual price ₹1,999). Price goes back up when the timer ends.',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_HEADER}>
          <h2 className={TYPE.h2Center}>
            <span className={WB_HIGHLIGHT}>FAQ&apos;s:</span>{' '}
            <span className={WB_PURPLE}>Here&apos;s everything you may ask</span>
          </h2>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {faqs.map((faq, idx) => {
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
                  <p className={`${TYPE.faqA} border-t border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4`}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
