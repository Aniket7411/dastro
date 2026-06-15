import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_PURPLE, WB_SECTION, WB_SECTION_HEADER, TYPE } from './tokens';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Where can I join the webinar?',
      a: "After a successful payment, you'll be directed to a thank you page. There, you can click on the Join WhatsApp button to join the webinar's group.",
    },
    {
      q: 'Where will the webinar take place?',
      a: 'The webinar will be conducted online via Zoom. You can easily join from any where using a mobile device or laptop.',
    },
    {
      q: 'Will there be reminders sent out before the webinar begins?',
      a: "Absolutely! We'll ensure you're reminded about the webinar through emails, SMS, and WhatsApp notifications.",
    },
    {
      q: 'Is there a registration fee for the webinar?',
      a: "While this webinar's content is valued at ₹1999, we are offering it for just ₹99 to make it accessible for everyone.",
    },
    {
      q: 'Who should attend this webinar?',
      a: "This webinar is ideal for anyone interested in gaining deeper insights into astrology—whether you're a beginner curious about the basics or someone looking to understand advanced astrological concepts.",
    },
    {
      q: 'What should I have ready for the webinar?',
      a: 'All you need is an open mind ready to explore the universe of astrology. Having a notebook handy to jot down important points would be beneficial.',
    },
    {
      q: 'Can I participate in this webinar with my family or partners?',
      a: 'Yes, absolutely! We encourage you to join with your family or partners. Learning together can enhance understanding and application of the astrological insights shared.',
    },
  ];

  return (
    <section className={`${WB_SECTION} bg-white`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_HEADER}>
          <h2 className={TYPE.h2Center}>
            <span className={WB_HIGHLIGHT}>FAQ&apos;S:</span>{' '}
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
