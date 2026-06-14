import React from 'react';

function PatternsSection({ onJoinNow }) {
  const patterns = [
    {
      icon: "fa-fingerprint",
      title: "Aapki personality ka blueprint",
      desc: "why you react the way you do",
      delay: "0"
    },
    {
      icon: "fa-coins",
      title: "Career aur money ka zone",
      desc: "kaunse areas naturally strong hain, kahan effort zyada lagega",
      delay: "100"
    },
    {
      icon: "fa-users",
      title: "Relationships ka dynamics",
      desc: "why you attract certain people, aur unke saath issues kyun repeat hote hain",
      delay: "200"
    },
    {
      icon: "fa-heartbeat",
      title: "Health aur energy cycles",
      desc: "kab body support karti hai, kab rest chahiye",
      delay: "0"
    },
    {
      icon: "fa-history",
      title: "Timing",
      desc: "kab push karna hai, kab wait karna hai",
      delay: "100"
    }
  ];

  return (
    <section className="patterns-section bg-light py-5">
      <div className="container">
        <h2 className="section-title mb-3">Astrology is not about predictions. It's about <span className="text-highlight">PATTERNS.</span></h2>
        <p className="text-muted mb-5">Planets ki positions, houses ka system, signs ka energy—ye sab ek framework hai jo explain karta hai:</p>
        
        <div className="patterns-grid">
          {patterns.map((pattern, i) => (
            <div className="pattern-card" key={i} data-aos="fade-up" data-aos-delay={pattern.delay}>
              <div className="pattern-icon"><i className={`fas ${pattern.icon}`}></i></div>
              <h4>{pattern.title}</h4>
              <p>{pattern.desc}</p>
            </div>
          ))}
          <div className="text-center d-flex align-items-center justify-content-center">
             <button onClick={onJoinNow} className="cta-button">Uncover Life’s Secrets – Join Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatternsSection;
