import React from 'react';

function HeroSection({ onJoinNow }) {
  return (
    <section className="webinar-hero">
      <div className="container">
        <div className="hero-badge-wrapper" data-aos="fade-up">
          <div className="hero-badge">
            <span className="icon"><i className="fas fa-calendar-alt"></i></span>
            2-Days Mega Astrology Webinar
          </div>
        </div>
        
        <h1 className="hero-title" data-aos="fade-up">
          Remove <span className="text-highlight">Uncertainty</span> from Your <span className="text-highlight">Career, Relationships and Finances</span> using <span className="text-purple">Astrology</span>
        </h1>
        
        <div className="hero-main-grid mt-5">
          <div className="hero-video-box" data-aos="fade-right">
            <video src="/videohomefinal.mp4" controls poster="/images/bg-bannerpic.jpg" className="w-100 d-block"></video>
            <div className="video-label-tag">BY – ASTRO AVA</div>
          </div>

          <div className="hero-info-side" data-aos="fade-left">
            <div className="info-cards-grid">
              <div className="info-card">
                <div className="info-icon"><i className="fas fa-calendar-day"></i></div>
                <div className="info-text"><h4>Date</h4><p>25th – 26th April</p></div>
              </div>
              <div className="info-card">
                <div className="info-icon"><i className="fas fa-clock"></i></div>
                <div className="info-text"><h4>Time:</h4><p>1:00 PM</p></div>
              </div>
              <div className="info-card">
                <div className="info-icon"><i className="fas fa-hourglass-half"></i></div>
                <div className="info-text"><h4>Duration:</h4><p>4 Hours</p></div>
              </div>
              <div className="info-card">
                <div className="info-icon"><i className="fas fa-laptop"></i></div>
                <div className="info-text"><h4>Format:</h4><p>2 days Webinar</p></div>
              </div>
            </div>

            <div className="mentor-summary-card">
              <div className="featured-label-mini text-center mb-3"><span className="badge bg-danger">Your Instructor</span></div>
              <div className="mentor-header">
                <img src="/images/mentor-ava.png" alt="Mentor" className="mentor-pic-small" />
                <div className="mentor-title-box">
                  <p>Expert in Vedic astrology and other disciplines of astrology, recognized as India's leading voice in astrology.</p>
                </div>
              </div>
              <div className="mentor-stats-row">
                <div className="m-stat"><h4>1 Lakh+</h4><p>Students taught</p></div>
                <div className="m-stat"><h4>50 Million+</h4><p>Views across social media</p></div>
                <div className="m-stat"><h4>50+ Years</h4><p>of legacy</p></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-5" data-aos="zoom-in">
          <button onClick={onJoinNow} className="cta-button">Uncover Life’s Secrets – Join Now</button>
          <p className="mt-3 fw-bold">Book Your Seat Now – Hurry Up! <span className="text-danger">Few Seats Left</span></p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
