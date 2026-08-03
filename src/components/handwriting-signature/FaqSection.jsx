import { useState } from 'react';
import { WB_WRAP, WB_HIGHLIGHT, WB_PURPLE, WB_SECTION, WB_SECTION_HEADER, TYPE } from '../webinar/tokens';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Next batch kab hai? / When is the next batch?',
      a: 'Masterclass 2 din chalti hai, roz 2 ghante, shaam ko, live on Zoom. Hum batches regularly chalate hain - aapki exact batch date aur timing registration ke turant baad WhatsApp par share ki jaati hai. Hamari team aapko call karke slot personally confirm bhi karti hai, taaki aap apne hisaab se batch choose kar sakein.',
    },
    {
      q: 'Batch timing suit na kare to?',
      a: 'Koi dikkat nahi. Aap agli batch mein shift kar sakte hain, aur dono din ki recording aapko milti hai - miss hone par bhi poora content aapke paas rehta hai.',
    },
    {
      q: 'Payment ke baad kya hoga?',
      a: 'Payment screenshot bhejne ke baad hamari team manually verify karti hai (kuch hi ghanton mein). Uske baad working day par subah 10 se shaam 7 ke beech call karke aapki batch ka din aur time confirm kiya jaata hai, aur Zoom link WhatsApp par time se pehle bhej diya jaata hai.',
    },
    {
      q: 'Session record hota hai?',
      a: 'Haan. Dono din ki recording aapko di jaati hai, saath mein dono din ke PDF notes bhi.',
    },
    {
      q: 'Class ke liye kya ready rakhna hai?',
      a: 'Sirf teen cheezein - bina line wala (plain) A4 paper, ek normal pen jisse aap roz likhte hain, aur ek notebook. Class mein aap apni handwriting aur signature khud likhkar analyse karenge, isliye ye class ke time saamne rakhiye.',
    },
    {
      q: 'Kya mujhe pehle se graphology ya astrology aani chahiye?',
      a: 'Bilkul nahi. Ye masterclass zero se shuru hoti hai. Graphology ke liye kisi belief system ki bhi zarurat nahi - ye observation ka system hai.',
    },
    {
      q: 'Kya certificate milega?',
      a: 'Is 2-din ki masterclass ka certificate nahi milta - ye ek practical learning session hai. Aapko recording aur PDF notes milte hain.',
    },
    {
      q: 'Fee kitni hai?',
      a: '₹500 (MRP ₹1,999). Isme dono live sessions, recording aur PDF notes shamil hain.',
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
