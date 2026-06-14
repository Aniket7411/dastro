import React from 'react';

function MentorSection({ onJoinNow }) {
  const mediaLogos = [
    "Aaj Tak",
    "Fox Interviewer",
    "Outlook",
    "LatestLY"
  ];

  return (
    <section className="mentor-v2-section">
      <div className="container">
        <h2 className="mentor-v2-title">Meet Your <span className="text-highlight">Mentor</span></h2>
        <div className="mentor-v2-grid">
          <div className="mentor-v2-info" data-aos="fade-right">
            <ul className="mentor-list">
              <li><i className="fas fa-chevron-right"></i> 51+ years of legacy</li>
              <li><i className="fas fa-chevron-right"></i> Thousands of successful consultations completed</li>
              <li><i className="fas fa-chevron-right"></i> Expert in Vedic Astrology, Numerology, and Vastu</li>
              <li><i className="fas fa-chevron-right"></i> Proven track record of training successful astrologers.</li>
              <li><i className="fas fa-chevron-right"></i> Global clientele from India, US, UK, & Middle East</li>
            </ul>
            <div className="mentor-bio-long">
              <p><strong>Award Winning Expert in Astrology & more</strong><br/>DS Institute brings expert guidance across astrology and related disciplines like numerology, vastu shastra, palmistry, and tarot reading.</p>
              <p className="mt-4"><strong>Spiritual Learning Platform</strong><br/>DS Institute hosts guided sessions, Q&A series, and learning programs for seekers who want practical astrology knowledge with clear mentorship.</p>
              <p className="mt-4"><strong>Occult Instructor</strong><br/>His expertise lies in Numerology, Astrology, Vastu Shastra, Palmistry and has taught 5K+ students. He is a renowned astrologer and numerologist taking forward a legacy of 49 years</p>
            </div>
            <div className="mt-5">
              <button onClick={onJoinNow} className="cta-button">Uncover Life’s Secrets – Join Now</button>
            </div>
          </div>
          <div className="mentor-v2-img-side" data-aos="fade-left">
            <div className="mentor-image-v2">
              <img src="/images/mentor-ava.png" alt="DS Institute mentor" />
            </div>
            <div className="mentor-media-logos">
              {mediaLogos.map((logo, i) => (
                <div className="media-logo-item" key={i}><span>{logo}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MentorSection;
