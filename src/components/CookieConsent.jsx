import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
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
    <div
      className="fixed bottom-3 left-1/2 z-[99999] w-[calc(100%-1.25rem)] max-w-[62.5rem] -translate-x-1/2 rounded-lg border border-site-accent/25 bg-[#1a1a1a] px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.28)] sm:bottom-5 sm:w-[calc(100%-2rem)] sm:rounded-xl sm:px-5 sm:py-4 md:px-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="flex flex-col items-stretch gap-2.5 sm:gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
        <p
          id="cookie-consent-title"
          className="m-0 text-center text-[0.6875rem] leading-snug text-white/90 sm:text-left sm:text-sm sm:leading-relaxed md:flex-1"
        >
          We use cookies to improve your experience and analyze traffic. By clicking &quot;Accept All&quot;, you agree to
          non-essential cookies per our{' '}
          <Link to="/privacy-policy" className="font-semibold text-site-accent underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-2 sm:gap-2.5 md:w-auto">
          <button
            type="button"
            onClick={handleReject}
            className="min-h-8 flex-1 rounded-md border border-white/20 bg-transparent px-2.5 py-1.5 text-[0.6875rem] font-semibold leading-none text-white/75 transition hover:border-white/35 hover:bg-white/10 hover:text-white sm:min-h-9 sm:px-3.5 sm:py-2 sm:text-xs md:flex-none md:px-4"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="min-h-8 flex-1 rounded-md border border-site-accent-dark bg-site-accent-dark px-2.5 py-1.5 text-[0.6875rem] font-semibold leading-none text-white transition hover:bg-[#6b340e] sm:min-h-9 sm:px-3.5 sm:py-2 sm:text-xs md:flex-none md:px-4"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
