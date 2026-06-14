import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

function PredictiveAstrology() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: 'intermediate'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (ONLINE_PAYMENT_ENABLED) {
      toast('Payment gateway will open here once live keys are configured.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: normalizeIndianMobile(formData.phone),
          type: 'Course',
          leadType: 'LIVE COURSE LEAD',
          status: 'ENQUIRY RECEIVED',
          paymentStatus: 'NOT REQUIRED',
          courseName: 'Predictive Astrology Course',
          experience: formData.experience,
          city: formData.city,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Enquiry received! We will call you within 24 hours.');
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', city: '', experience: 'intermediate' });
      } else {
        toast.error(data.message || 'Could not submit enquiry.');
      }
    } catch {
      toast.error('Could not submit enquiry. Please try again.');
    }
  };

  const highlights = [
    { num: '35+', label: 'Hours Content', icon: '⏱️' },
    { num: '8', label: 'Weeks Duration', icon: '📅' },
    { num: '1.5K+', label: 'Students', icon: '👥' },
    { num: '4.9', label: 'Rating', icon: '⭐' }
  ];

  const courseSteps = [
    { icon: '🎯', title: 'Event Prediction', desc: 'Predict specific events' },
    { icon: '📅', title: 'Timing', desc: 'Master transit & dasha' },
    { icon: '💼', title: 'Career', desc: 'Professional predictions' },
    { icon: '💑', title: 'Marriage', desc: 'Relationship timing' },
    { icon: '🏥', title: 'Health', desc: 'Medical astrology' },
    { icon: '🌟', title: 'Yearly', desc: 'Annual forecasting' }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const reviews = [
    { name: 'Rajesh Kumar', rating: 5, text: 'Now I can confidently predict timing of events. The transit section is gold!', avatar: '/images/10350949.png' },
    { name: 'Meera Patel', rating: 5, text: 'Best predictive astrology course online. Practical and accurate techniques.', avatar: '/images/10350961.png' },
    { name: 'Anil Sharma', rating: 4, text: 'Great focus on practical prediction. Changed how I read charts completely.', avatar: '/images/10350969.png' }
  ];

  const faqs = [
    { q: 'Do I need prior astrology knowledge?', a: 'Yes, you should know basics of chart reading before taking this course.' },
    { q: 'Will I learn exact timing of events?', a: 'Yes, the course focuses on precise timing using multiple techniques.' },
    { q: 'Can I predict marriage after this?', a: 'Yes, you will learn specific techniques for marriage timing prediction.' }
  ];

  return (
    <section className="predictive-unique-page">
      {/* Dynamic Hero Section */}
      <div className="hero-v2">
        <div className="hero-bg-accent"></div>
        <div className="container">
          <div className="row align-items-center min-vh-80 py-5">
            <div className="col-xl-7 col-lg-6 text-lg-start text-center">
              <div className="hero-glass-card" data-aos="fade-right">
                <div className="unique-badge">
                  <span className="pulse-dot"></span>
                  Professional Predictive Mastery
                </div>
                <h1 className="display-3 fw-bold mb-4">
                  Master the Art of <span className="text-gradient">Accurate Predictions</span>
                </h1>
                <p className="lead mb-5 opacity-75">
                  Learn to predict life events with remarkable precision. Master Vimshottari Dasha, 
                  Transits, and advanced planetary combinations for professional forecasting.
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
                    {ONLINE_PAYMENT_ENABLED ? 'Enroll Now for ₹1299' : 'Request callback — ₹1299'}
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
                  <img src="/images/tengyart-VgijAV-e97Y-unsplash.jpg" alt="Predictive Study" className="img-main" />
                  <div className="floating-badge top-right">
                    <span className="fs-4">🎯</span>
                    <span>Event Mastery</span>
                  </div>
                  <div className="floating-badge bottom-left">
                    <span className="fs-4">🕒</span>
                    <span>Timing Precision</span>
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
            <h2 className="display-5 fw-bold mb-3">Predictive Mastery Roadmap</h2>
            <p className="text-muted fs-5">A systematic approach to professional forecasting</p>
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
                  {currentStep === 0 && 'Learn to predict specific life events with remarkable accuracy. Master the techniques for identifying what events will manifest in a person\'s life and when they will occur.'}
                  {currentStep === 1 && 'Master the art of timing using transits (Gochara), Dasha systems, and Ashtakavarga. Learn when planets will trigger specific events in a person\'s life.'}
                  {currentStep === 2 && 'Predict career changes, promotions, job switches, and financial gains. Learn techniques for professional consultation and career guidance.'}
                  {currentStep === 3 && 'Master marriage timing prediction using Navamsa, 7th house analysis, and Dasha of significators. Learn compatibility assessment techniques.'}
                  {currentStep === 4 && 'Learn medical astrology techniques to predict health issues and their timing. Understand which planets cause which health problems and when.'}
                  {currentStep === 5 && 'Create comprehensive yearly predictions using Tajaka, solar returns, and annual chart techniques. Master the art of yearly forecasting for clients.'}
                </p>
                <button className="btn btn-link p-0 text-gradient fw-bold" onClick={() => setShowModal(true)}>
                  Explore this module <i className="fas fa-arrow-right ms-2"></i>
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
              { icon: 'video', title: 'Intensive Classes', desc: '20-24 interactive live sessions focused on practical prediction' },
              { icon: 'book-open', title: 'Prediction Tools', desc: 'Custom cheat sheets and prediction templates' },
              { icon: 'infinity', title: 'Forever Access', desc: 'Revisit complex prediction sessions anytime' },
              { icon: 'certificate', title: 'Professional Cert', desc: 'Certified Predictive Astrologer credential' },
              { icon: 'users', title: 'Consultants Hub', desc: 'Network with practicing professional astrologers' },
              { icon: 'headset', title: 'Live Case Studies', desc: 'Analyse real charts with direct mentor feedback' }
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
                <h2 className="display-4 fw-bold mb-4">Sarah Mitchell</h2>
                <p className="fs-5 text-muted mb-5 leading-relaxed">
                  International astrologer with 10+ years of experience in predictive astrology. 
                  Expert in transit analysis and timing predictions. Known for accurate 
                  forecasting and practical teaching approach.
                </p>
                <div className="d-flex gap-4">
                  <div className="text-center">
                    <div className="fs-2 fw-bold text-gradient">2.5k+</div>
                    <small className="text-muted">Students</small>
                  </div>
                  <div className="vr"></div>
                  <div className="text-center">
                    <div className="fs-2 fw-bold text-gradient">10+</div>
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
                <img src="/images/istockphoto-1200677760-612x612.jpg" alt="Instructor" className="img-fluid rounded-circle shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-v2 py-5 bg-gradient-v2 text-white text-center">
        <div className="container py-4">
          <h2 className="mb-5">Real Predictive Success Stories</h2>
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
            <h2 className="display-5 fw-bold mb-3">Start Your Predictive Career</h2>
            <p className="fs-5 mb-4 opacity-75">Join the next batch of professional forecasters</p>
            <div className="price-tag mb-5">
              <span className="text-muted text-decoration-line-through fs-4 me-2">₹6500</span>
              <span className="display-4 fw-bold text-gradient font-price">₹1299</span>
            </div>
            <button className="btn-v2-primary btn-lg px-5 py-3" onClick={() => setShowModal(true)}>
              Enroll and Start Predicting
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
              <h3>Predictive Course Enrollment</h3>
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
                <label className="form-label">Experience Level</label>
                <select className="form-select-v2" name="experience" value={formData.experience} onChange={handleInputChange}>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="policy-notice mb-3" style={{ fontSize: '12px', color: '#6b6b8a', lineHeight: '1.4', textAlign: 'center' }}>
                {ONLINE_PAYMENT_ENABLED ? (
                  <>By proceeding with the payment, you agree to our <a href="/terms-and-conditions" style={{ color: '#8B4A1E', textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/refund-policy" style={{ color: '#8B4A1E', textDecoration: 'underline' }}>Refund &amp; Cancellation Policy</a>.</>
                ) : (
                  <>By submitting, you agree to our <a href="/terms-and-conditions" style={{ color: '#8B4A1E', textDecoration: 'underline' }}>Terms &amp; Conditions</a>. Our team will call you within 24 hours.</>
                )}
              </div>
              <button type="submit" className="btn-v2-primary w-100">
                {ONLINE_PAYMENT_ENABLED ? 'Proceed to Payment (₹1299)' : 'Request callback (₹1299)'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .predictive-unique-page {
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

        .font-price,
        .display-4.font-price {
          font-family: var(--font-price, 'DM Sans', sans-serif) !important;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
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
          perspective: 1000px;
        }

        .img-main {
          width: 100%;
          height: clamp(350px, 45vw, 550px);
          object-fit: cover;
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(139, 74, 30, 0.15);
          border: 4px solid white;
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

        .top-right { top: -10px; right: -20px; }
        .bottom-left { bottom: -10px; left: -20px; animation-delay: 2s; }

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
            display: none; 
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

export default PredictiveAstrology;