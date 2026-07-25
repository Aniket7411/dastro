import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_PURPLE, WB_SECTION, WB_SECTION_HEADER, TYPE } from '../webinar/tokens';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Where will the masterclass take place?',
      a: 'Live on Zoom. The joining link will be sent on WhatsApp and email after registration.',
    },
    {
      q: 'Is the session recorded?',
      a: 'Yes! Recording access of both days is included — attend live for practice sessions, revise with recordings.',
    },
    {
      q: 'What is the fee?',
      a: 'Launch offer ₹499 only (actual price ₹1,999). Price goes back up when the timer ends.',
    },
    {
      q: 'Do I need any prior knowledge of astrology?',
      a: 'No. This is a beginner-friendly masterclass in simple language. If you can see a face, you can learn to read it.',
    },
    {
      q: 'Will I get a certificate?',
      a: 'The masterclass does not include a certificate. Certification is part of our complete Face Reading Mastery course.',
    },
    {
      q: 'Who should attend?',
      a: 'Anyone 16+ — professionals, homemakers, students, business owners. You may also attend with family on one screen.',
    },
    {
      q: 'What should I keep ready?',
      a: 'A notebook, a pen, and a mirror or your phone’s front camera — you will do live practice!',
    },
    {
      q: 'What happens after I pay?',
      a: "Share your payment screenshot on WhatsApp (+91 90055 75577). You'll receive confirmation + the Zoom link + reminders before each session.",
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
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                  <span className={TYPE.faqQ}>{faq.q}</span>
                  <i
                    className={`fas fa-chevron-down shrink-0 text-xs text-white/90 transition-transform duration-300 sm:text-sm ${isOpen ? 'rotate-180' : ''}`}
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
