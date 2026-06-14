import React from 'react';

function WhySection({ onJoinNow }) {
  const struggles = [
    "You're working hard but promotions or recognition feel stuck",
    "You attract the same type of person again and again.",
    "You earn but somehow it doesn't stay or grow the way you want",
    "You feel like you're living someone else's script, not your own",
    "You feel misunderstood by people close to you."
  ];

  return (
    <section className="why-section">
      <div className="container">
        <h2 className="why-title" data-aos="fade-up">Kabhi socha hai <span className="text-highlight">“Why does this keep happening to me?”</span></h2>
        <div className="why-cards-flex" data-aos="fade-up">
          {struggles.map((text, i) => (
            <div className="why-card-v2" key={i}>
              <span className="icon"><i className="fas fa-question-circle"></i></span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-5 fw-bold fs-5">The answer lies in your kundli 👇</p>
        <div className="text-center mt-4">
          <button onClick={onJoinNow} className="cta-button">Uncover Life’s Secrets – Join Now</button>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
