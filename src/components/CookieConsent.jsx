import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
          By clicking "Accept All", you consent to our use of non-essential cookies in accordance with our <a href="/privacy-policy" style={{color: '#C8832A', textDecoration: 'underline'}}>Privacy Policy</a>.
        </p>
        <div className="cookie-buttons">
          <button className="btn-reject" onClick={handleReject}>Reject Non-Essential</button>
          <button className="btn-accept" onClick={handleAccept}>Accept All</button>
        </div>
      </div>
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 1000px;
          background-color: #1a1a1a;
          color: #f1f1f1;
          padding: 20px 25px;
          z-index: 99999;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid rgba(200, 131, 42, 0.2);
          animation: slideUp 0.5s ease-out forwards;
        }
        @keyframes slideUp {
          from { bottom: -100px; opacity: 0; }
          to { bottom: 20px; opacity: 1; }
        }
        .cookie-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .cookie-content p {
          margin: 0;
          font-size: 0.95rem;
          text-align: center;
          line-height: 1.6;
          color: #ffffff !important;
        }
        .cookie-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        .cookie-buttons button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        .btn-reject {
          background: transparent;
          border: 1px solid #555;
          color: #ccc;
        }
        .btn-reject:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .btn-accept {
          background: #8b4513;
          border: 1px solid #8b4513;
          color: #ffffff;
        }
        .btn-accept:hover {
          background: #6b340e;
          border-color: #6b340e;
        }
        @media (min-width: 768px) {
          .cookie-content {
            flex-direction: row;
            justify-content: space-between;
          }
          .cookie-content p {
            text-align: left;
            flex: 1;
          }
          .cookie-buttons {
            width: auto;
            flex-shrink: 0;
          }
          .cookie-buttons button {
            padding: 10px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
