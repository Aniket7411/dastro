import React from 'react';

function ItinerarySection() {
  return (
    <section className="breakdown-section py-5 bg-white">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">2-Day <span className="text-highlight">Itinerary</span></h2>
        </div>
        <div className="days-grid">
          <div className="day-card" data-aos="fade-up">
            <div className="day-header">DAY 1</div>
            <h3 className="day-title">The Foundation</h3>
            <ul className="day-content text-dark">
              <li><i className="fas fa-play"></i> 12 Zodiac Signs & Houses Decode</li>
              <li><i className="fas fa-play"></i> Role of 9 Planets in Life</li>
              <li><i className="fas fa-play"></i> Basic Birth Chart Reading</li>
              <li><i className="fas fa-play"></i> Q&A Session</li>
            </ul>
          </div>
          <div className="day-card" data-aos="fade-up" data-aos-delay="200">
            <div className="day-header">DAY 2</div>
            <h3 className="day-title">Prediction & Remedies</h3>
            <ul className="day-content text-dark">
              <li><i className="fas fa-play"></i> Career & Wealth Indicators</li>
              <li><i className="fas fa-play"></i> Relationship Compatibility</li>
              <li><i className="fas fa-play"></i> Low-cost Daily Remedies</li>
              <li><i className="fas fa-play"></i> Live Chart Reading</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItinerarySection;
