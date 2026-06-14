import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';


function CourseInquiry() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type: 'Course',
          courseName: 'Advanced Vedic Astrology Course'
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Registration initiated. Redirecting to payment...');
        navigate(data.paymentUrl);
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="webinar-landing"> {/* Reusing the same base class for consistent theme */}
      {/* 1. Hero Section */}
      <section className="webinar-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="pulse-badge">Professional Certification</div>
              <h1 className="hero-title">
                Master the Science of Stars <br/>
                <span className="text-highlight">Become a Certified Astrologer</span>
              </h1>
              
              <div className="hero-video-wrapper mt-4">
                <video src="/videohomefinal.mp4" controls poster="/images/bg-bannerpic.jpg" className="sales-video"></video>
              </div>

              <div className="webinar-meta mt-4">
                <div className="meta-item">
                  <i className="fas fa-layer-group"></i>
                  <span>Comprehensive 12-Week Curriculum</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-certificate"></i>
                  <span>ISO Certified Certificate on Completion</span>
                </div>
              </div>
            </div>
            
            <div className="hero-form-wrapper">
              <div className="lead-form-card">
                <div className="form-header">
                  <h3>Enroll Now</h3>
                  <p className="alert-text"><i className="fas fa-bolt"></i> Next Batch Starts Soon!</p>
                </div>
                <form onSubmit={handleSubmit} className="lead-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your best email" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit Indian mobile number" />
                  </div>
                  <div className="form-group">
                    <label>Complete Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter your full address" />
                  </div>
                  
                  <div className="form-group consent-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <input type="checkbox" id="consent-course" name="consent" required style={{ width: 'auto', marginTop: '4px' }} />
                    <label htmlFor="consent-course" style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.4', margin: 0 }}>
                      I agree to the <a href="/privacy-policy" style={{ color: '#ff6a00' }}>Privacy Policy</a> and consent to DS Institute LLP contacting me via phone, email, and WhatsApp.
                    </label>
                  </div>

                  <button type="submit" className="cta-button primary-cta ripple-effect w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Reserve Your Seat'}
                  </button>
                  <p className="secure-text text-center mt-3"><i className="fas fa-lock"></i> Your data is 100% secure.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Authority / Trust Section */}
      <section className="authority-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">5,000+</h3>
              <p className="stat-label">Certified Astrologers</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Community Support</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">Practical Knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who Should Attend */}
      <section className="audience-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Is This Course <span className="text-gradient">For You?</span></h2>
            <div className="header-underline"></div>
          </div>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="check-icon"><i className="fas fa-check-circle"></i></div>
              <p>Beginners with zero prior knowledge wanting to learn from scratch.</p>
            </div>
            <div className="audience-card">
              <div className="check-icon"><i className="fas fa-check-circle"></i></div>
              <p>Professionals seeking to add astrology as a secondary income stream.</p>
            </div>
            <div className="audience-card">
              <div className="check-icon"><i className="fas fa-check-circle"></i></div>
              <p>Individuals wanting to decode their own destiny and help family members.</p>
            </div>
            <div className="audience-card">
              <div className="check-icon"><i className="fas fa-check-circle"></i></div>
              <p>Practicing astrologers wanting to deepen their predictive accuracy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What You Will Learn */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Course <span className="text-gradient">Modules</span></h2>
            <div className="header-underline"></div>
          </div>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-number">01</div>
              <div className="benefit-text">
                <h4>Foundational Astrology</h4>
                <p>Master the 9 Planets, 12 Zodiac Signs, and 12 Houses in depth.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">02</div>
              <div className="benefit-text">
                <h4>Predictive Techniques</h4>
                <p>Learn timing of events using Vimshottari Dasha and planetary transits.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">03</div>
              <div className="benefit-text">
                <h4>Marriage & Career</h4>
                <p>Specialized modules on relationship compatibility and career growth.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-number">04</div>
              <div className="benefit-text">
                <h4>Vedic Remedies</h4>
                <p>Prescribe accurate gemstones, mantras, and lifestyle remedies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Instructor Section */}
      <section className="instructor-section">
        <div className="container">
          <div className="instructor-grid">
            <div className="instructor-image">
              <img src="/images/middle-img.png" alt="Instructor" />
            </div>
            <div className="instructor-info">
              <h5 className="sub-heading">YOUR LEAD MENTOR</h5>
              <h2 className="instructor-name">DS Institute</h2>
              <p className="instructor-bio">
                With over 16 years of deep astrological research and practice, DS Institute has transformed the lives of over 100,000 individuals globally. Known for pinpoint accuracy and practical remedies, it bridges ancient Vedic wisdom with modern life challenges.
              </p>
              <ul className="instructor-achievements">
                <li><i className="fas fa-star"></i> Featured in Top Astrology Journals</li>
                <li><i className="fas fa-star"></i> Gold Medalist in Vedic Astrology</li>
                <li><i className="fas fa-star"></i> Consultant to Top Industry Leaders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Student Success <span className="text-gradient">Stories</span></h2>
            <div className="header-underline mx-auto"></div>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="review-text">"The structured curriculum made it so easy to learn. I am now doing paid consultations thanks to DS Institute's guidance."</p>
              <p className="reviewer-name">- Amit R.</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="review-text">"Best astrology course out there. The practical case studies helped me understand predictive astrology in a real-world setting."</p>
              <p className="reviewer-name">- Kavita S.</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="review-text">"I joined to understand my own chart, but the depth of knowledge provided was mind-blowing. Highly recommended."</p>
              <p className="reviewer-name">- Rohan M.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="final-cta-section">
        <div className="container text-center">
          <h2 className="final-title">Ready to Start Your Astrological Journey?</h2>
          <p className="final-subtitle">Join thousands of others who have turned their passion into a profession.</p>
          <button className="cta-button primary-cta pulse-anim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Enroll Today
          </button>
          <p className="secure-text"><i className="fas fa-lock"></i> 100% Secure Checkout</p>
        </div>
      </section>

      <style>{`
        :root {
          --brand-dark: #070913;
          --brand-navy: #0b1220;
          --brand-accent: #ff6a00;
          --brand-highlight: #ff0080;
          --brand-light: #ffffff;
          --brand-gray: #a0aec0;
          --gradient-bg: linear-gradient(135deg, #070913 0%, #1a0b2e 100%);
          --gradient-cta: linear-gradient(135deg, #ff6a00 0%, #ff9500 100%);
        }

        .webinar-landing {
          font-family: 'Inter', 'Merriweather Sans', sans-serif;
          background-color: var(--brand-dark);
          color: var(--brand-light);
          overflow-x: hidden;
        }

        .container {
          max-width: var(--container-public);
          margin: 0 auto;
          padding-left: var(--page-pad-x);
          padding-right: var(--page-pad-x);
        }

        .text-highlight {
          background: linear-gradient(135deg, var(--brand-accent), var(--brand-highlight));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .section-header { margin-bottom: 40px; }
        .section-title {
          font-size: clamp(42px, 5vw, 48px) !important;
          font-weight: 800 !important;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--brand-accent), var(--brand-highlight));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 991px) {
          .section-title { font-size: clamp(2.2rem, 5vw, 2.8rem) !important; }
        }

        @media (max-width: 767px) {
          .section-title { font-size: clamp(1.8rem, 6vw, 2.2rem) !important; }
        }

        .header-underline { height: 4px; width: 60px; background: var(--brand-accent); border-radius: 2px; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-center { text-align: center; }
        .fw-bold { font-weight: 700; }

        .cta-button {
          display: inline-block;
          background: var(--gradient-cta);
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          padding: 16px 40px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 106, 0, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cta-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 30px rgba(255, 106, 0, 0.6);
        }

        .webinar-hero { padding: 140px 0 80px; background: var(--gradient-bg); position: relative; }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .pulse-badge { display: inline-block; background: rgba(255, 106, 0, 0.1); color: var(--brand-accent); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(255, 106, 0, 0.3); font-weight: 600; margin-bottom: 20px; animation: pulse 2s infinite; }
        
        .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; margin-bottom: 15px; }
        .hero-subtitle { font-size: 1.5rem; font-weight: 500; color: #e2e8f0; margin-bottom: 30px; }
        
        .hero-video-wrapper { width: 100%; max-width: 600px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.1); box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
        .sales-video { width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover; }
        
        .hero-form-wrapper { position: relative; z-index: 10; }
        .lead-form-card { background: rgba(20,20,35,0.95); border: 1px solid rgba(255,106,0,0.3); padding: 35px 30px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); backdrop-filter: blur(10px); }
        .form-header h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 5px; color: #fff; text-align: center; }
        .form-header .alert-text { text-align: center; margin-bottom: 20px; color: #ff4757; font-weight: 700; }
        .form-group { margin-bottom: 20px; text-align: left; }
        .form-group label { display: block; font-size: 0.95rem; color: var(--brand-gray); margin-bottom: 8px; font-weight: 500; }
        .form-group input { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5); color: #fff; font-size: 1rem; transition: all 0.3s; }
        .form-group input:focus { border-color: var(--brand-accent); outline: none; box-shadow: 0 0 15px rgba(255,106,0,0.2); }
        .w-100 { width: 100%; }

        .webinar-meta { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .meta-item { display: flex; align-items: center; gap: 12px; font-size: 1.1rem; }
        .meta-item i { color: var(--brand-accent); font-size: 1.3rem; width: 24px; text-align: center; }

        .authority-section { padding: 40px 0; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; text-align: center; }
        .stat-number { font-size: 2.5rem; font-weight: 800; color: var(--brand-accent); margin-bottom: 5px; }
        .stat-label { font-size: 1.1rem; color: var(--brand-gray); text-transform: uppercase; letter-spacing: 1px; }

        .audience-section { padding: 80px 0; background: var(--brand-dark); }
        .audience-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
        .audience-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 30px; border-radius: 16px; display: flex; align-items: flex-start; gap: 15px; transition: transform 0.3s; }
        .audience-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.04); }
        .check-icon { color: #00d2d3; font-size: 1.5rem; flex-shrink: 0; }
        .audience-card p { font-size: 1.1rem; line-height: 1.6; margin: 0; }

        .benefits-section { padding: 80px 0; background: var(--brand-navy); }
        .benefits-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
        .benefit-item { display: flex; gap: 20px; align-items: flex-start; }
        .benefit-number { font-size: 3rem; font-weight: 900; color: rgba(255,106,0,0.2); line-height: 1; }
        .benefit-text h4 { font-size: 1.4rem; font-weight: 700; margin-bottom: 10px; color: var(--brand-accent); }
        .benefit-text p { font-size: 1.1rem; color: var(--brand-gray); line-height: 1.6; }

        .instructor-section { padding: 100px 0; background: var(--brand-dark); }
        .instructor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .instructor-image img { width: 100%; max-width: 450px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .sub-heading { color: var(--brand-accent); letter-spacing: 3px; font-weight: 600; margin-bottom: 10px; }
        .instructor-name { font-size: 3rem; font-weight: 800; margin-bottom: 20px; }
        .instructor-bio { font-size: 1.1rem; color: var(--brand-gray); line-height: 1.8; margin-bottom: 30px; }
        .instructor-achievements { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; }
        .instructor-achievements li { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 500; }
        .instructor-achievements i { color: #feca57; }

        .testimonials-section { padding: 80px 0; background: var(--brand-dark); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 50px; }
        .testimonial-card { background: rgba(255,255,255,0.02); padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .stars { color: #feca57; font-size: 1.2rem; margin-bottom: 15px; letter-spacing: 2px; }
        .review-text { font-size: 1.1rem; font-style: italic; color: var(--brand-gray); line-height: 1.6; margin-bottom: 20px; }
        .reviewer-name { font-weight: 700; color: #fff; }

        .final-cta-section { padding: 100px 0; background: var(--gradient-bg); position: relative; overflow: hidden; }
        .final-title { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 800; margin-bottom: 20px; }
        .final-subtitle { font-size: 1.2rem; color: var(--brand-gray); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
        .secure-text { margin-top: 20px; font-size: 0.9rem; color: var(--brand-gray); }
        
        .pulse-anim { animation: pulseBtn 2s infinite; }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 106, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 106, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 106, 0, 0); }
        }
        @keyframes pulseBtn {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 106, 0, 0.7); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(255, 106, 0, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 106, 0, 0); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 992px) {
          .hero-grid, .instructor-grid { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .hero-video-wrapper { margin: 0 auto; }
          .hero-form-wrapper { margin-top: 20px; max-width: 500px; margin-left: auto; margin-right: auto; }
          .webinar-meta { align-items: center; }
          .stats-grid { grid-template-columns: 1fr; gap: 40px; }
          .instructor-achievements li { justify-content: center; }
        }
        @media (max-width: 768px) {
          .benefits-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default CourseInquiry;
