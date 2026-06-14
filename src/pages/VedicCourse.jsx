import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function VedicCourse() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: 'beginner'
  });

  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Enrollment form submitted! Redirecting to payment...');
  };

  const handlePayment = () => {
    alert('Redirecting to secure payment gateway...\nCourse Fee: ₹699');
  };

  const courseSteps = [
    { icon: '🔮', title: 'Foundations', desc: 'Zodiac signs & basic charts' },
    { icon: '🌟', title: 'Planets', desc: '9 Navagrahas & their powers' },
    { icon: '🏛️', title: 'Houses', desc: '12 Bhavas & life areas' },
    { icon: '🌙', title: 'Nakshatras', desc: '27 lunar mansions' },
    { icon: '⚡', title: 'Predictions', desc: 'Timing & forecasting' },
    { icon: '💫', title: 'Mastery', desc: 'Professional practice' }
  ];

  const highlights = [
    { num: '25+', label: 'Hours Content', icon: '⏱️' },
    { num: '10', label: 'Weeks Duration', icon: '📅' },
    { num: '5K+', label: 'Students', icon: '👥' },
    { num: '4.9', label: 'Rating', icon: '⭐' }
  ];

  const reviews = [
    { name: 'Priya Sharma', rating: 5, text: 'Best astrology course! The instructor explains everything so clearly.', avatar: '/images/10350949.png' },
    { name: 'Rahul Patel', rating: 5, text: 'Worth every rupee. Now I can read charts confidently!', avatar: '/images/10350961.png' },
    { name: 'Anita Gupta', rating: 4, text: 'Great content and amazing support. Highly recommended.', avatar: '/images/10350969.png' }
  ];

  const faqs = [
    { q: 'Is this course for beginners?', a: 'Yes! We start from basics and progress to advanced techniques.' },
    { q: 'How long do I have access?', a: 'Lifetime access to all course materials and recordings.' },
    { q: 'Is the certificate recognized?', a: 'Yes, our certification is valued in the astrology community.' }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="vedic-unique-page">
      {/* Dynamic Hero Section */}
      <div className="hero-v2">
        <div className="hero-bg-accent"></div>
        <div className="container">
          <div className="row align-items-center min-vh-80 py-5">
            <div className="col-xl-7 col-lg-6 text-lg-start text-center">
              <div className="hero-glass-card" data-aos="fade-right">
                <div className="unique-badge">
                  <span className="pulse-dot"></span>
                  Limited Batch Starting Soon
                </div>
                <h1 className="display-3 fw-bold mb-4">
                  Unlock the Secrets of <br />
                  <span className="text-gradient">Vedic Astrology</span>
                </h1>
                <p className="lead mb-5 opacity-75">
                  Embark on a transformative journey from basic charts to professional mastery. 
                  Learn the ancient wisdom of Navagrahas, Bhavas, and Nakshatras.
                </p>
                
                <div className="stats-grid mb-5">
                  {highlights.map((h, i) => (
                    <div key={i} className="stat-pill">
                      <span className="fs-3">{h.icon}</span>
                      <div>
                        <div className="stat-num">{h.num}</div>
                        <div className="stat-label">{h.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-start justify-content-center">
                  <button className="btn-v2-primary" onClick={() => setShowModal(true)}>
                    Enroll Now for ₹699
                  </button>
                  <button className="btn-v2-outline" onClick={() => setShowModal(true)}>
                    <i className="fas fa-play me-2"></i> Watch Preview
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-xl-5 col-lg-6 mt-5 mt-lg-0">
              <div className="hero-visual-v2" data-aos="zoom-in">
                <div className="image-stack">
                  <img src="/images/moon.jpg" alt="Vedic Study" className="img-main" />
                  <div className="floating-badge top-right">
                    <span className="fs-4">🏆</span>
                    <span>Certified Course</span>
                  </div>
                  <div className="floating-badge bottom-left">
                    <span className="fs-4">👥</span>
                    <span>5K+ Community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Learning Path Section */}
      <div className="path-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Your Cosmic Roadmap</h2>
            <p className="text-muted fs-5">A structured 6-stage progression to mastery</p>
          </div>

          <div className="roadmap-container">
            {courseSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`roadmap-item ${currentStep === idx ? 'active' : ''}`}
                onClick={() => setCurrentStep(idx)}
              >
                <div className="roadmap-line"></div>
                <div className="roadmap-circle">
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-num">{idx + 1}</span>
                </div>
                <div className="roadmap-text">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="step-details-card mt-5" data-aos="fade-up">
            <div className="row g-0">
              <div className="col-md-2 d-flex align-items-center justify-content-center bg-gradient-v2 text-white p-4 rounded-start">
                <span className="display-1 opacity-25">{currentStep + 1}</span>
              </div>
              <div className="col-md-10 p-4 p-lg-5">
                <h3 className="mb-3 text-gradient d-inline-block">Stage {currentStep + 1}: {courseSteps[currentStep].title}</h3>
                <p className="fs-5 leading-relaxed">
                  {currentStep === 0 && 'Begin your journey by understanding the 12 zodiac signs, their characteristics, and how to construct basic birth charts. Learn the fundamental principles that form the foundation of Vedic Astrology.'}
                  {currentStep === 1 && 'Dive deep into the 9 planets (Navagrahas), their significations, strengths, and relationships. Master the art of analyzing planetary positions and their effects on human life.'}
                  {currentStep === 2 && 'Explore the 12 houses (Bhavas) representing different life areas. Understand house lords, karakas, and how to interpret the various domains of life through astrology.'}
                  {currentStep === 3 && 'Study the 27 Nakshatras (lunar mansions) that add precision to predictions. Learn their deities, symbols, and how they influence personality and events.'}
                  {currentStep === 4 && 'Master Dasha systems, transits, and timing techniques. Learn to predict when events will manifest and understand the unfolding of karma through time.'}
                  {currentStep === 5 && 'Combine all knowledge for professional practice. Learn ethics, consultation techniques, and how to build a successful astrology career with confidence.'}
                </p>
                <button className="btn btn-link p-0 text-gradient fw-bold" onClick={() => setShowModal(true)}>
                  Start this stage today <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="features-v2 py-5 bg-light-soft">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: 'video', title: 'Live Classes', desc: '25-30 interactive sessions with experts' },
              { icon: 'book-open', title: 'Resources', desc: 'Handcrafted PDFs and cheat sheets' },
              { icon: 'infinity', title: 'Lifetime Access', desc: 'Rewatch anytime, anywhere' },
              { icon: 'certificate', title: 'Certification', desc: 'Recognized professional credential' },
              { icon: 'users', title: 'Private Group', desc: 'Connect with fellow astrologers' },
              { icon: 'headset', title: 'Dedicated Support', desc: 'Direct access to mentors' }
            ].map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="feature-card-v2" data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className="feature-icon-box">
                    <i className={`fas fa-${f.icon}`}></i>
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor Spotlight */}
      <div className="instructor-v2 py-5 overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 order-2 order-lg-1">
              <div className="instructor-content" data-aos="fade-right">
                <span className="text-gradient fw-bold text-uppercase ls-1">Master Instructor</span>
                <h2 className="display-4 fw-bold mb-4">Pandit Rajesh Sharma</h2>
                <p className="fs-5 text-muted mb-5 leading-relaxed">
                  With over 15 years of rigorous study and 3,500+ successful students, 
                  Pandit Rajesh brings a unique blend of traditional wisdom and modern application 
                  to his teaching style.
                </p>
                <div className="d-flex gap-4">
                  <div className="text-center">
                    <div className="fs-2 fw-bold text-gradient">3.5k+</div>
                    <small className="text-muted">Students</small>
                  </div>
                  <div className="vr"></div>
                  <div className="text-center">
                    <div className="fs-2 fw-bold text-gradient">15+</div>
                    <small className="text-muted">Years Exp</small>
                  </div>
                  <div className="vr"></div>
                  <div className="text-center">
                    <div className="fs-2 fw-bold text-gradient">4.9/5</div>
                    <small className="text-muted">Rating</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 order-1 order-lg-2">
              <div className="instructor-visual-v2" data-aos="fade-left">
                <div className="circle-bg"></div>
                <img src="/images/depositphotos_81108858-stock-photo-casual-business-indian-boy-portrait.jpg" alt="Instructor" className="img-fluid rounded-circle shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-v2 py-5 bg-gradient-v2 text-white text-center">
        <div className="container py-4">
          <h2 className="mb-5">Loved by Aspiring Astrologers</h2>
          <div className="row g-4 justify-content-center">
            {reviews.map((r, i) => (
              <div key={i} className="col-lg-4">
                <div className="review-card-v2" data-aos="zoom-in" data-aos-delay={i * 100}>
                  <img src={r.avatar} alt={r.name} className="review-avatar" />
                  <p className="fst-italic mb-3">"{r.text}"</p>
                  <h6 className="fw-bold mb-0">{r.name}</h6>
                  <div className="stars mt-2">{'★'.repeat(r.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="final-cta-v2 py-5 text-center" id="enroll">
        <div className="container">
          <div className="cta-glass-box p-5 rounded-5 shadow-lg" data-aos="flip-up">
            <h2 className="display-5 fw-bold mb-3">Begin Your Vedic Mastery</h2>
            <p className="fs-5 mb-4 opacity-75">Secure your spot in the upcoming batch at a special price</p>
            <div className="price-tag mb-5">
              <span className="text-muted text-decoration-line-through fs-4 me-2">₹4100</span>
              <span className="display-4 fw-bold text-gradient">₹699</span>
            </div>
            <button className="btn-v2-primary btn-lg px-5 py-3" onClick={() => setShowModal(true)}>
              Enroll Instantly
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-v2 py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Frequently Asked Questions</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {faqs.map((f, i) => (
                <details key={i} className="faq-item-v2 mb-3">
                  <summary className="fw-bold p-3 bg-white rounded-3 shadow-sm">{f.q}</summary>
                  <div className="p-3 bg-white border-top">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showModal && (
        <div className="modal-overlay-v2" onClick={() => setShowModal(false)}>
          <div className="modal-card-v2" onClick={e => e.stopPropagation()}>
            <div className="modal-header-v2">
              <h3>Course Enrollment</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body-v2">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control-v2" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control-v2" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control-v2" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Experience</label>
                <select className="form-select-v2" name="experience" value={formData.experience} onChange={handleInputChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="policy-notice mb-3" style={{ fontSize: '12px', color: '#6b6b8a', lineHeight: '1.4', textAlign: 'center' }}>
                By proceeding with the payment, you agree to our <a href="/terms-and-conditions" style={{ color: '#8B4A1E', textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/refund-policy" style={{ color: '#8B4A1E', textDecoration: 'underline' }}>Refund &amp; Cancellation Policy</a>.
              </div>
              <button type="submit" className="btn-v2-primary w-100" onClick={handlePayment}>
                Proceed to Payment (₹699)
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .vedic-unique-page {
          --primary-grad: linear-gradient(135deg, #8B4A1E, #C8832A);
          --soft-bg: #FDF6EE;
          --card-bg: #FFFBF5;
          --text-deep: #2A0F02;
          --text-main: #3D1A08;
          --text-light: #9B6640;
          font-family: 'Inter', sans-serif;
          color: var(--text-main);
          overflow-x: hidden;
          background-color: var(--soft-bg);
        }

        h1, h2, h3, .roadmap-text h4, .display-3, .display-4, .display-5 {
          font-family: 'Playfair Display', serif !important;
          color: var(--text-deep);
        }

        .text-gradient {
          background: var(--primary-grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bg-gradient-v2 {
          background: var(--primary-grad);
        }

        .btn-v2-primary {
          background: #2A0F02;
          color: white;
          border: none;
          padding: 14px 35px;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(42, 15, 2, 0.2);
        }

        .btn-v2-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(42, 15, 2, 0.3);
          background-color: #000000;
          color: white;
        }

        .btn-v2-outline {
          background: transparent;
          border: 2px solid #8B4A1E;
          color: #8B4A1E;
          padding: 12px 35px;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.3s;
        }

        .btn-v2-outline:hover {
          background: #8B4A1E;
          color: white;
        }

        /* Hero V2 */
        .hero-v2 {
          position: relative;
          padding-top: 80px;
          background: linear-gradient(180deg, #FDF6EE 0%, #FFFBF5 100%);
        }

        .hero-bg-accent {
          position: absolute;
          top: -10%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(200, 131, 42, 0.08) 0%, transparent 70%);
          z-index: 0;
        }

        .hero-glass-card {
          position: relative;
          z-index: 1;
        }

        .unique-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          background: #FFFBF5;
          border-radius: 50px;
          box-shadow: 0 5px 15px rgba(139, 74, 30, 0.08);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 25px;
          border: 1px solid rgba(200, 131, 42, 0.15);
          color: #8B4A1E;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 15px;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFBF5;
          padding: 10px 15px;
          border-radius: 15px;
          border: 1px solid rgba(200, 131, 42, 0.1);
          box-shadow: 0 4px 10px rgba(139, 74, 30, 0.05);
        }

        .stat-num { font-weight: 800; color: #8B4A1E; font-size: 18px; }
        .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-light); }

        .image-stack {
          position: relative;
          padding: 20px;
        }

        .img-main {
          width: 100%;
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }

        .floating-badge {
          position: absolute;
          background: #FFFBF5;
          padding: 15px 25px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(200, 131, 42, 0.15);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          animation: float 4s ease-in-out infinite;
          z-index: 2;
          color: #2A0F02;
          font-weight: 600;
        }

        .top-right { top: -20px; right: -10px; }
        .bottom-left { bottom: -20px; left: -10px; animation-delay: 2s; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* Roadmap */
        .roadmap-container {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 50px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .roadmap-item {
          flex: 1;
          min-width: 140px;
          text-align: center;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }

        .roadmap-line {
          position: absolute;
          top: 30px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e0e0e8;
          z-index: -1;
        }

        .roadmap-item:last-child .roadmap-line { display: none; }

        .roadmap-circle {
          width: 60px;
          height: 60px;
          background: #FFFBF5;
          border: 2px solid rgba(200, 131, 42, 0.2);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s;
        }

        .roadmap-item.active .roadmap-circle {
          border-color: #8B4A1E;
          background: var(--primary-grad);
          color: white;
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(139, 74, 30, 0.2);
        }

        .step-icon { font-size: 24px; }
        .step-num {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #2A0F02;
          color: white;
          border-radius: 50%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .roadmap-text h4 { font-size: 16px; font-weight: 700; margin-bottom: 5px; }
        .roadmap-text p { font-size: 12px; color: #6b6b8a; display: none; }

        @media (min-width: 992px) {
           .roadmap-text p { display: block; }
        }

        .step-details-card {
          background: #FFFBF5;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(139, 74, 30, 0.05);
          border: 1px solid rgba(200, 131, 42, 0.15);
        }

        /* Feature Cards */
        .feature-card-v2 {
          background: #FFFBF5;
          padding: 35px;
          border-radius: 25px;
          height: 100%;
          transition: all 0.3s;
          border: 1px solid rgba(200, 131, 42, 0.1);
          box-shadow: 0 10px 30px rgba(139, 74, 30, 0.03);
        }

        .feature-card-v2:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(139, 74, 30, 0.08);
          border-color: #C8832A;
        }

        .feature-icon-box {
          width: 60px;
          height: 60px;
          background: rgba(200, 131, 42, 0.1);
          color: #8B4A1E;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 25px;
        }

        /* Instructor Visual */
        .instructor-visual-v2 {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .circle-bg {
          position: absolute;
          width: 110%;
          height: 110%;
          background: radial-gradient(circle, rgba(200, 131, 42, 0.15) 0%, transparent 70%);
          z-index: -1;
          border-radius: 50%;
        }

        .instructor-visual-v2 img {
          width: 400px;
          height: 400px;
          object-fit: cover;
          border: 10px solid white;
        }

        /* Testimonials */
        .review-card-v2 {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          height: 100%;
        }

        .review-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 15px;
          border: 2px solid white;
        }

        /* CTA Box */
        .cta-glass-box {
          background: #FFFBF5;
          border: 1px solid rgba(200, 131, 42, 0.15);
          box-shadow: 0 30px 60px rgba(139, 74, 30, 0.1);
        }

        /* Modal V2 */
        .modal-overlay-v2 {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-card-v2 {
          background: #FFFBF5;
          width: 100%;
          max-width: 500px;
          border-radius: 25px;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          border: 1px solid rgba(200, 131, 42, 0.2);
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header-v2 {
          background: #FDF6EE;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(200, 131, 42, 0.15);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          line-height: 1;
        }

        .modal-body-v2 { padding: 30px; }

        .form-control-v2, .form-select-v2 {
          width: 100%;
          padding: 12px 15px;
          border-radius: 10px;
          background: #FFFFFF;
          border: 1.5px solid rgba(200, 131, 42, 0.2);
          transition: border-color 0.3s;
          color: #3D1A08;
        }

        .form-control-v2:focus {
          border-color: #8B4A1E;
          outline: none;
          box-shadow: 0 0 0 4px rgba(139, 74, 30, 0.1);
        }

        /* Responsive Fixes */
        @media (max-width: 991px) {
          .display-3 { font-size: 2.8rem; }
          .hero-v2 { padding-top: 60px; }
          .image-stack { padding: 10px; }
          .instructor-visual-v2 img { width: 320px; height: 320px; }
        }

        @media (max-width: 768px) {
          .display-3 { font-size: 2.2rem; }
          .hero-v2 { padding-top: 40px; text-align: center; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stat-pill { padding: 8px 12px; }
          .img-main { height: 300px; border-radius: 20px; }
          .floating-badge { padding: 10px 15px; font-size: 12px; }
          .top-right { top: -5px; right: -5px; }
          .bottom-left { bottom: -5px; left: -5px; }
          
          .roadmap-container { 
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            gap: 20px;
            padding: 20px 10px 40px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; 
          }
          .roadmap-container::-webkit-scrollbar { display: none; }

          .roadmap-item { 
            flex: 0 0 140px !important;
            text-align: center;
            display: block;
          }
          .roadmap-line { 
            display: none; /* Hide line on mobile for better horizontal flow */
          }
          .roadmap-circle { margin: 0 auto 15px; flex-shrink: 0; }
          .roadmap-text h4 { font-size: 14px; }
          .roadmap-text p { display: none; } 
          
          .instructor-v2 { text-align: center; }
          .instructor-visual-v2 img { width: 250px; height: 250px; }
          
          .cta-glass-box { padding: 30px 20px; border-radius: 30px; }
        }

        @media (max-width: 480px) {
          .display-3 { font-size: 1.8rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .btn-v2-primary, .btn-v2-outline { width: 100%; }
          .roadmap-container { 
            padding-left: 15px;
            padding-right: 15px;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
          }
          .roadmap-item { flex: 0 0 130px !important; }
          .roadmap-text h4 { font-size: 13px; }
        }
      `}</style>
    </section>
  );
}

export default VedicCourse;