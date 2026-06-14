import React, { useState } from 'react';

function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: "Where can I join the webinar?", a: "After a successful payment, you’ll be directed to a thank you page. There, you can click on the Join WhatsApp button to join the webinar’s group." },
    { q: "Where will the webinar take place?", a: "The webinar will be conducted online via Zoom. You can easily join from any where using a mobile device or laptop." },
    { q: "Will there be reminders sent out before the webinar begins?", a: "Absolutely! We’ll ensure you’re reminded about the webinar through emails, SMS, and WhatsApp notifications." },
    { q: "Is there a registration fee for the webinar?", a: "While this webinar’s content is valued at ₹1999, we are offering it for just ₹99 to make it accessible for everyone." },
    { q: "Who should attend this webinar?", a: "This webinar is ideal for anyone interested in gaining deeper insights into astrology—whether you’re a beginner curious about the basics or someone looking to understand advanced astrological concepts." },
    { q: "What should I have ready for the webinar?", a: "All you need is an open mind ready to explore the universe of astrology. Having a notebook handy to jot down important points would be beneficial." },
    { q: "Can I participate in this webinar with my family or partners?", a: "Yes, absolutely! We encourage you to join with your family or partners. Learning together can enhance understanding and application of the astrological insights shared." }
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2 className="faq-title-main">
            <span className="faq-title-highlight">FAQ’S:</span> <span className="faq-title-text">Here’s everything you may ask</span>
          </h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, idx) => (
            <div className="faq-item" key={idx} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <i className={`fas fa-chevron-down faq-chevron ${activeFaq === idx ? 'rotate' : ''}`}></i>
              </div>
              <div className={`faq-answer ${activeFaq === idx ? 'active' : ''}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
