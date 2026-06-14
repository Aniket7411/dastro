import React from 'react';

function LearnSection({ onJoinNow }) {
  const learningPoints = [
    { icon: "fa-sun", title: "Basics of Vedic Astrology:", desc: "Understand the simple rules that Vedic astrology is built on." },
    { icon: "fa-th", title: "Understanding Your Birth Chart/Kundali", desc: "Learn about the secrets in your birth chart." },
    { icon: "fa-star", title: "How Planets Affect Your Life:", desc: "See how planets influence important parts of your life like your job, love life, and money." },
    { icon: "fa-globe", title: "Effects of Planetary Movements:", desc: "Explore how the movement of planets can affect you." },
    { icon: "fa-gem", title: "Astrology Advice for Different Life Areas:", desc: "Get specific advice for bettering your career, relationships, and health." },
    { icon: "fa-book-open", title: "Practical Applications of Astrology:", desc: "How to read patterns in other people's charts" },
    { icon: "fa-comment-dots", title: "Case studies:", desc: "Real charts, real situations, real insights" },
    { icon: "fa-arrow-right", title: "Next steps:", desc: "How to start your own consultation as a highly-paid astrologer" }
  ];

  return (
    <section className="learn-section">
      <div className="container">
        <h2 className="section-title text-center mb-5">What <span className="text-highlight">You Will Learn</span> In 2 Days</h2>
        <div className="learn-grid">
          {learningPoints.map((item, i) => (
            <div className="learn-card-v2" key={i} data-aos="fade-up">
              <div className="learn-icon-v2"><i className={`fas ${item.icon}`}></i></div>
              <div className="learn-content-v2">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <button onClick={onJoinNow} className="cta-button">Uncover Life’s Secrets – Join Now</button>
        </div>
      </div>
    </section>
  );
}

export default LearnSection;
