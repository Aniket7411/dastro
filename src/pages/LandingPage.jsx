import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';


function LandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Robust type detection
  const isCourse = location.pathname.includes('course-inquiry') || searchParams.get('type') === 'course';
  const type = isCourse ? 'Course' : 'Webinar';
  
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize AOS with proper settings
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-in-out'
      });
    } else {
      // Fallback - load AOS if not present
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
      script.onload = () => {
        if (window.AOS) {
          window.AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-in-out'
          });
        }
      };
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
      document.head.appendChild(link);
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const content = {
    Webinar: {
      title: "Unlock the Secrets of Your Future",
      subtitle: "Join the 2-Day Mega Astrology Workshop & Transform Your Life",
      badge: "✨ FREE LIVE MASTERCLASS ✨",
      courseName: "2-Day Mega Astrology Webinar",
      accent: "#ff6a00", 
      accentSecondary: "#ff0080",
      heroImage: "/images/bg-bannerpic.jpg",
      heroVideo: "/videohomefinal.mp4",
      layout: "split",
      stats: [
        { label: "Happy Students", val: "1L+" },
        { label: "Star Rating", val: "4.9/5" },
        { label: "Expert Experience", val: "16+ Years" }
      ],
      cta: "🎯 CLAIM MY FREE SEAT 🎯"
    },
    Course: {
      title: "Master Vedic Astrology",
      subtitle: "From Beginner to Professional Certified Astrologer in 12 Weeks",
      badge: "🌟 ISO 9001:2015 CERTIFIED 🌟",
      courseName: "Advanced Vedic Astrology Certification",
      accent: "#8a2be2", 
      accentSecondary: "#4b0082",
      heroImage: "/images/moon.jpg",
      heroVideo: "/videohomefinal.mp4",
      layout: "centered",
      stats: [
        { label: "Course Duration", val: "12 Weeks" },
        { label: "Expert Modules", val: "24+" },
        { label: "Learning Level", val: "Beginner → Pro" }
      ],
      curriculum: [
        { title: "🌟 The Foundation", desc: "Planetary strengths, houses, and zodiac signs mastery." },
        { title: "📊 Predictive Mastery", desc: "Timing events using Dasha and Gochar (Transit) systems." },
        { title: "💎 Remedial Science", desc: "Gemstones, Mantras, and modern Vedic remedies." },
        { title: "🎓 Professional Practice", desc: "How to handle clients and build a consultation career." }
      ],
      cta: "🚀 ENROLL IN MASTERCLASS 🚀"
    }
  }[type];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedPhone = formData.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').replace(/^0(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(sanitizedPhone)) {
      toast.error('📞 Please enter a valid 10-digit phone number.');
      return;
    }
    if (formData.name.trim().length < 3) {
      toast.error('📝 Please enter your full name (min 3 characters).');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      toast.error('📧 Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type,
          courseName: content.courseName
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('✅ Registration Successful!');
        if (data.paymentUrl) {
          navigate(data.paymentUrl);
        } else if (data.leadId && data.orderId) {
          const paymentParams = new URLSearchParams({
            leadId: data.leadId,
            name: data.name || formData.name,
            email: data.email || formData.email,
            phone: data.phone || sanitizedPhone,
            amount: String(data.amount || 9900),
            orderId: data.orderId,
            keyId: data.keyId || ''
          });
          navigate(`/payment?${paymentParams.toString()}`);
        } else {
          toast.success(data.message || 'Request submitted successfully.');
        }
      } else toast.error('❌ Error submitting form. Please try again.');
    } catch (err) { toast.error('🌐 Network Error. Please check your connection.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className={`lp-container lp-${type.toLowerCase()}`}>
      {/* Global Theme Styles - Brighter, Bolder, Accessible */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');
        
        :root {
          --lp-purple: #6C3CE1;
          --lp-purple-light: #8B5CF6;
          --lp-accent: #FF6B35;
          --lp-accent-pink: #E31B7A;
          --lp-text-dark: #1A1A2E;
          --lp-text-muted: #2D3A4B;
          --lp-bg-white: #FFFFFF;
          --lp-bg-offwhite: #F8FAFF;
          --shadow-sm: 0 4px 12px rgba(0,0,0,0.05);
          --shadow-md: 0 10px 30px rgba(0,0,0,0.08);
          --shadow-lg: 0 25px 50px -12px rgba(0,0,0,0.15);
          --shadow-xl: 0 35px 60px -15px rgba(108,60,225,0.2);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-size: 18px;
        }
        
        .lp-container { 
          background: linear-gradient(135deg, var(--lp-bg-white) 0%, var(--lp-bg-offwhite) 100%);
          color: var(--lp-text-dark); 
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; 
          overflow-x: hidden; 
          line-height: 1.5;
        }
        
        /* AOS animations */
        [data-aos] {
          opacity: 0;
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        [data-aos].aos-animate {
          opacity: 1;
        }
        
        .text-gradient { 
          background: linear-gradient(135deg, var(--lp-purple) 0%, var(--lp-accent) 100%);
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text;
        }
        
        .text-highlight { 
          color: var(--lp-accent); 
        }
        
        .mystic-btn { 
          background: linear-gradient(135deg, var(--lp-purple) 0%, var(--lp-accent) 100%);
          color: #fff; 
          border: none; 
          border-radius: 60px; 
          padding: 16px 36px; 
          font-weight: 700; 
          font-size: 1.1rem;
          transition: all 0.3s ease; 
          box-shadow: 0 8px 20px rgba(108, 60, 225, 0.3); 
          cursor: pointer; 
          letter-spacing: 0.5px;
          width: 100%;
        }
        
        .mystic-btn:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 15px 35px rgba(108, 60, 225, 0.45); 
          filter: brightness(1.05);
        }
        
        .mystic-btn-outline {
          background: transparent;
          border: 2px solid var(--lp-purple);
          color: var(--lp-purple);
          box-shadow: none;
          padding: 12px 30px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .mystic-btn-outline:hover {
          background: var(--lp-purple);
          color: white;
          transform: translateY(-2px);
        }
        
        /* Modern Nav */
        .lp-nav { 
          position: fixed; 
          top: 0; 
          width: 100%; 
          padding: 18px 0; 
          z-index: 1000; 
          background: rgba(255,255,255,0.95); 
          backdrop-filter: blur(12px); 
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s;
        }
        
        .container {
          max-width: var(--container-public);
          margin: 0 auto;
          padding-left: var(--page-pad-x);
          padding-right: var(--page-pad-x);
        }
        
        .d-flex {
          display: flex;
        }
        
        .justify-content-between {
          justify-content: space-between;
        }
        
        .align-items-center {
          align-items: center;
        }
        
        .logo-text { 
          font-family: 'Inter', sans-serif; 
          font-size: 1.8rem; 
          font-weight: 800; 
          background: linear-gradient(135deg, var(--lp-purple) 30%, var(--lp-accent) 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        
        /* Hero Section */
        .lp-hero { 
          position: relative; 
          padding: 160px 0 100px; 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
        }
        
        .hero-bg { 
          position: absolute; 
          inset: 0; 
          z-index: 0; 
          opacity: 0.05;
          background: radial-gradient(circle at 20% 40%, var(--lp-purple-light) 0%, transparent 70%);
        }
        
        .hero-content { 
          position: relative; 
          z-index: 2; 
          max-width: var(--container-public);
          margin: 0 auto; 
          padding-left: var(--page-pad-x);
          padding-right: var(--page-pad-x);
          width: 100%; 
        }
        
        .split-layout { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 80px; 
          align-items: center; 
        }
        
        .centered-layout { 
          text-align: center; 
          max-width: 950px; 
          margin: 0 auto; 
        }
        
        .badge-premium { 
          display: inline-block; 
          padding: 8px 22px; 
          background: linear-gradient(135deg, rgba(108,60,225,0.1) 0%, rgba(255,107,53,0.1) 100%);
          border-radius: 60px; 
          color: var(--lp-purple); 
          font-weight: 800; 
          font-size: 0.85rem; 
          letter-spacing: 1px; 
          margin-bottom: 28px; 
          border: 1px solid rgba(108,60,225,0.2);
        }
        
        .hero-h1 { 
          font-size: clamp(2.5rem, 6vw, 4.5rem); 
          font-weight: 800; 
          line-height: 1.2; 
          margin-bottom: 28px; 
          color: var(--lp-text-dark);
          letter-spacing: -0.02em;
        }
        
        .hero-p { 
          font-size: 1.2rem; 
          color: var(--lp-text-muted); 
          margin-bottom: 48px; 
          line-height: 1.7; 
          max-width: 90%;
          font-weight: 500;
        }
        
        /* Video Card */
        .video-box { 
          border-radius: 32px; 
          overflow: hidden; 
          background: #fff; 
          box-shadow: var(--shadow-xl); 
          max-width: 540px; 
          margin: 0 0 40px 0; 
          transition: all 0.4s;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .video-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 40px 70px -20px rgba(108,60,225,0.3);
        }
        
        .video-box video { 
          width: 100%; 
          display: block; 
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }
        
        /* Form Card */
        .form-card-glass { 
          background: rgba(255,255,255,0.98); 
          backdrop-filter: blur(2px);
          border: 1px solid rgba(108,60,225,0.12); 
          border-radius: 36px; 
          padding: 52px 44px; 
          box-shadow: var(--shadow-md); 
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .form-card-glass:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }
        
        .form-card-glass h3 { 
          font-size: 1.9rem; 
          font-weight: 800; 
          margin-bottom: 36px; 
          color: var(--lp-text-dark);
          text-align: center;
        }
        
        .input-box { 
          margin-bottom: 28px; 
          text-align: left; 
        }
        
        .input-box label { 
          display: block; 
          margin-bottom: 10px; 
          color: var(--lp-text-dark); 
          font-size: 0.9rem; 
          font-weight: 700; 
        }
        
        .input-box input { 
          width: 100%; 
          padding: 16px 20px; 
          background: var(--lp-bg-offwhite); 
          border: 2px solid #E5E7EB; 
          border-radius: 24px; 
          color: var(--lp-text-dark); 
          transition: all 0.2s; 
          font-size: 1rem; 
          font-family: inherit;
          font-weight: 500;
        }
        
        .input-box input:focus { 
          border-color: var(--lp-purple); 
          background: #fff; 
          outline: none; 
          box-shadow: 0 0 0 4px rgba(108,60,225,0.15);
        }
        
        .w-100 {
          width: 100%;
        }
        
        .text-center {
          text-align: center;
        }
        
        .mt-3 {
          margin-top: 1rem;
        }
        
        .mt-4 {
          margin-top: 1.5rem;
        }
        
        .mb-5 {
          margin-bottom: 3rem;
        }
        
        .small {
          font-size: 0.85rem;
        }
        
        .text-muted {
          color: var(--lp-text-muted);
        }
        
        /* Curriculum Section */
        .curr-section { 
          padding: 120px 0; 
          background: var(--lp-bg-offwhite); 
        }
        
        .curr-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 32px; 
          margin-top: 60px; 
        }
        
        .curr-card { 
          background: var(--lp-bg-white); 
          border: 1px solid rgba(108,60,225,0.1); 
          padding: 42px 32px; 
          border-radius: 32px; 
          transition: all 0.3s; 
          box-shadow: var(--shadow-sm);
        }
        
        .curr-card:hover { 
          border-color: var(--lp-purple-light); 
          transform: translateY(-8px); 
          box-shadow: var(--shadow-lg); 
        }
        
        .curr-card i { 
          font-size: 2.5rem; 
          color: var(--lp-purple); 
          margin-bottom: 24px; 
          display: block; 
        }
        
        .curr-card h4 { 
          font-size: 1.5rem; 
          margin-bottom: 16px; 
          color: var(--lp-text-dark); 
          font-weight: 800; 
        }
        
        .curr-card p { 
          color: var(--lp-text-muted); 
          line-height: 1.65; 
          font-size: 1rem;
          font-weight: 500;
        }
        
        /* Instructor */
        .inst-section { 
          padding: 120px 0; 
          background: var(--lp-bg-white); 
        }
        
        .inst-flex { 
          display: flex; 
          align-items: center; 
          gap: 80px; 
          max-width: 1100px; 
          margin: 0 auto; 
        }
        
        .inst-img { 
          flex: 0 0 340px; 
          border-radius: 36px; 
          overflow: hidden; 
          border: 6px solid var(--lp-bg-white); 
          box-shadow: var(--shadow-lg); 
        }
        
        .inst-img img { 
          width: 100%; 
          display: block; 
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }
        
        .inst-text h2 { 
          font-size: 2.5rem; 
          margin-bottom: 24px; 
          color: var(--lp-text-dark); 
          font-weight: 800; 
          letter-spacing: -0.02em;
        }
        
        .inst-text p { 
          font-size: 1.1rem; 
          color: var(--lp-text-muted); 
          line-height: 1.7; 
          font-weight: 500;
        }
        
        /* Stats Bar */
        .stats-bar { 
          padding: 80px 0; 
          background: linear-gradient(135deg, var(--lp-purple) 0%, var(--lp-accent) 100%);
          color: white;
        }
        
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          text-align: center; 
          max-width: 1000px; 
          margin: 0 auto; 
          gap: 50px;
        }
        
        .stat-val { 
          font-size: 3.5rem; 
          font-weight: 800; 
          line-height: 1; 
          margin-bottom: 12px; 
          color: white;
        }
        
        .stat-label { 
          font-weight: 700; 
          letter-spacing: 1.5px; 
          font-size: 0.95rem; 
          opacity: 0.95;
          text-transform: uppercase;
        }
        
        /* Countdown */
        .countdown-strip { 
          padding: 120px 0; 
          text-align: center; 
          background: linear-gradient(135deg, #F8F9FF 0%, #FFFFFF 100%);
        }
        
        .timer-row { 
          display: flex; 
          justify-content: center; 
          gap: 32px; 
          margin: 56px 0 48px; 
        }
        
        .t-box { 
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%);
          padding: 32px 28px; 
          border-radius: 36px; 
          min-width: 130px; 
          box-shadow: var(--shadow-md); 
          border: 1px solid rgba(108,60,225,0.1);
        }
        
        .t-box h4 { 
          font-size: 3.5rem; 
          font-weight: 800; 
          color: var(--lp-purple); 
          margin: 0; 
          line-height: 1;
        }
        
        .t-box p { 
          margin-top: 14px; 
          color: var(--lp-text-muted); 
          font-size: 0.9rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 1.5px;
        }
        
        .big-btn {
          padding: 18px 50px;
          font-size: 1.2rem;
          width: auto;
          display: inline-block;
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .split-layout { 
            grid-template-columns: 1fr; 
            gap: 60px; 
            text-align: center; 
          }
          
          .hero-p {
            max-width: 100%;
          }
          
          .video-box {
            margin: 0 auto 40px;
          }
          
          .inst-flex { 
            flex-direction: column; 
            text-align: center; 
            gap: 48px;
          }
          
          .inst-img { 
            flex: 0 0 auto; 
            width: 300px; 
            margin: 0 auto; 
          }
          
          .stats-grid { 
            grid-template-columns: 1fr; 
            gap: 48px; 
          }
          
          .timer-row { 
            gap: 20px; 
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .t-box { 
            min-width: 110px; 
            padding: 24px 20px; 
          }
          
          .t-box h4 { 
            font-size: 2.5rem; 
          }
          
          .lp-hero { 
            padding-top: 130px; 
          }
          
          .form-card-glass {
            padding: 40px 28px;
            max-width: 500px;
            margin: 0 auto;
          }
          
          .container {
            padding: 0 24px;
          }
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: var(--page-pad-x);
            padding-right: var(--page-pad-x);
          }
          
          .hero-h1 {
            font-size: 2rem;
          }
          
          .hero-p {
            font-size: 1rem;
          }
          
          .stats-bar {
            padding: 60px 0;
          }
          
          .stat-val {
            font-size: 2.5rem;
          }
          
          .t-box {
            min-width: 85px;
            padding: 18px 12px;
          }
          
          .t-box h4 {
            font-size: 1.8rem;
          }
          
          .t-box p {
            font-size: 0.7rem;
          }
          
          .big-btn {
            padding: 14px 28px;
            font-size: 1rem;
          }
          
          .form-card-glass h3 {
            font-size: 1.5rem;
          }
          
          .curr-card {
            padding: 32px 24px;
          }
          
          .curr-card h4 {
            font-size: 1.3rem;
          }
        }
      `}</style>

      {/* Minimal Navigation */}
      <nav className="lp-nav" data-aos="fade-down" data-aos-duration="600">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="logo-text">DS Astrology</div>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="mystic-btn-outline d-none d-md-block">
            📋 Register Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="hero-bg"></div>
        
        <div className="hero-content">
          {content.layout === 'split' ? (
            <div className="split-layout">
              <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
                <span className="badge-premium">{content.badge}</span>
                <h1 className="hero-h1">Let the Stars Shape<br/><span className="text-gradient">Your Journey</span></h1>
                <p className="hero-p">{content.subtitle}</p>
                <div className="video-box" data-aos="zoom-in" data-aos-duration="700" data-aos-delay="200">
                  <video src={content.heroVideo} autoPlay muted loop playsInline></video>
                </div>
              </div>
              <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="300">
                <div className="form-card-glass">
                  <h3>🔮 Secure Your Spot 🔮</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="input-box">
                      <label>📝 Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                    </div>
                    <div className="input-box">
                      <label>📧 Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div className="input-box">
                      <label>📞 Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10 digit mobile number" />
                    </div>
                    
                    <div className="input-box consent-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
                      <input type="checkbox" id="consent-lp1" name="consent" required style={{ width: 'auto', marginTop: '4px', padding: 0 }} />
                      <label htmlFor="consent-lp1" style={{ fontSize: '13px', color: 'var(--lp-text-muted)', lineHeight: '1.4', margin: 0, fontWeight: 'normal' }}>
                        I agree to the <a href="/privacy-policy" style={{ color: 'var(--lp-purple)', textDecoration: 'underline' }}>Privacy Policy</a> and consent to DS Astrology LLP contacting me via phone, email, and WhatsApp.
                      </label>
                    </div>

                    <button type="submit" className="mystic-btn" disabled={isSubmitting}>
                      {isSubmitting ? '⏳ Processing...' : content.cta}
                    </button>
                  </form>
                  <p className="text-center mt-3 text-muted small">🔒 Your data is 100% safe & secure 🔒</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="centered-layout">
              <div data-aos="fade-down" data-aos-duration="700">
                <span className="badge-premium">{content.badge}</span>
                <h1 className="hero-h1">{content.title}</h1>
                <p className="hero-p">{content.subtitle}</p>
              </div>
              
              <div className="video-box" style={{maxWidth: '720px', margin: '0 auto 48px'}} data-aos="zoom-in" data-aos-duration="800" data-aos-delay="100">
                <video src={content.heroVideo} autoPlay muted loop playsInline></video>
              </div>

              <div className="form-card-glass" style={{maxWidth: '560px', margin: '0 auto'}} data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                <h3>📚 Download Curriculum & Register 📚</h3>
                <form onSubmit={handleSubmit}>
                  <div className="input-box">
                    <label>📝 Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                  </div>
                  <div className="input-box">
                    <label>📧 Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                  </div>
                  <div className="input-box">
                    <label>📞 Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10 digit mobile number" />
                  </div>
                  
                  <div className="input-box consent-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
                    <input type="checkbox" id="consent-lp2" name="consent" required style={{ width: 'auto', marginTop: '4px', padding: 0 }} />
                    <label htmlFor="consent-lp2" style={{ fontSize: '13px', color: 'var(--lp-text-muted)', lineHeight: '1.4', margin: 0, fontWeight: 'normal' }}>
                      I agree to the <a href="/privacy-policy" style={{ color: 'var(--lp-purple)', textDecoration: 'underline' }}>Privacy Policy</a> and consent to DS Astrology LLP contacting me via phone, email, and WhatsApp.
                    </label>
                  </div>

                  <button type="submit" className="mystic-btn" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Enrolling...' : content.cta}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section - Brighter Gradient */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {content.stats.map((s, i) => (
              <div className="stat-item" key={i} data-aos="fade-up" data-aos-duration="600" data-aos-delay={i * 150}>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">⭐ {s.label} ⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Curriculum Section (Only for Course) */}
      {type === 'Course' && content.curriculum && (
        <section className="curr-section">
          <div className="container">
            <div className="text-center mb-5" data-aos="fade-up" data-aos-duration="700">
              <span className="badge-premium">📖 The Curriculum 📖</span>
              <h2 className="hero-h1">What You Will <span className="text-gradient">Learn</span></h2>
            </div>
            <div className="curr-grid">
              {content.curriculum.map((item, i) => (
                <div className="curr-card" key={i} data-aos="fade-up" data-aos-duration="600" data-aos-delay={i * 100}>
                  <i className="fas fa-book-open"></i>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instructor Section */}
      <section className="inst-section">
        <div className="container">
          <div className="inst-flex">
            <div className="inst-img" data-aos="fade-right" data-aos-duration="800">
              <img src="/images/bg-bannerpic.jpg" alt="Instructor" />
            </div>
            <div className="inst-text" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">
              <span className="badge-premium">👨‍🏫 The Mentor 👩‍🏫</span>
              <h2>Master the Art with <span className="text-gradient">Expert Guidance</span></h2>
              <p>
                With over 16 years of experience in Vedic Astrology, our lead instructor has helped thousands 
                of students unlock their true potential. This course is designed to take you from a curious 
                beginner to a professional consultant with practical, real-world case studies.
              </p>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="mystic-btn mt-4" style={{width: 'auto'}}>
                🚀 Join The Journey 🚀
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Strip */}
      <section className="countdown-strip">
        <div className="container" data-aos="flip-up" data-aos-duration="800">
          <h2 className="hero-h1">⏰ Registration <span className="text-gradient">Closing Soon</span> ⏰</h2>
          <p className="hero-p" style={{maxWidth: '600px', margin: '0 auto'}}>Don't miss the chance to start your professional career.</p>
          <div className="timer-row">
            <div className="t-box"><h4>{String(timeLeft.hours).padStart(2, '0')}</h4><p>Hours</p></div>
            <div className="t-box"><h4>{String(timeLeft.minutes).padStart(2, '0')}</h4><p>Mins</p></div>
            <div className="t-box"><h4>{String(timeLeft.seconds).padStart(2, '0')}</h4><p>Secs</p></div>
          </div>
          <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mystic-btn big-btn" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="200">
            🎯 Reserve Your Seat Now 🎯
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
