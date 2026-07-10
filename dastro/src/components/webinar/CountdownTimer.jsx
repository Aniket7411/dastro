import { useState, useEffect } from 'react';

const CountdownTimer = ({ minimal = false }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 24 Hour Persistence Logic
    const getTargetTime = () => {
      const stored = localStorage.getItem('webinar_timer_v4');
      if (stored) {
        const target = parseInt(stored);
        if (target > Date.now()) return target;
      }
      
      const newTarget = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('webinar_timer_v4', newTarget.toString());
      return newTarget;
    };

    let targetTime = getTargetTime();

    const timer = setInterval(() => {
      const now = Date.now();
      let difference = targetTime - now;

      if (difference <= 0) {
        // Reset for another 24 hours
        targetTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('webinar_timer_v4', targetTime.toString());
        difference = targetTime - Date.now();
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (minimal) {
    return (
      <div className="digital-timer-minimal">
        <div className="timer-header-mini">OFFER ENDS IN</div>
        <div className="timer-box-wrapper">
          <div className="timer-display-mini">
            <div className="timer-slot">
              <span className="slot-val">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="slot-label">HRS</span>
            </div>
            <span className="slot-sep">:</span>
            <div className="timer-slot">
              <span className="slot-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="slot-label">MINS</span>
            </div>
            <span className="slot-sep">:</span>
            <div className="timer-slot">
              <span className="slot-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="slot-label">SECS</span>
            </div>
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
          
          .digital-timer-minimal {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          .timer-header-mini {
            font-size: 0.7rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: center;
            width: 100%;
            opacity: 0.8;
          }
          .timer-box-wrapper {
            background: #000000;
            padding: 12px 25px;
            border-radius: 12px;
            border: 1px solid rgba(255, 157, 0, 0.4);
            box-shadow: 0 0 25px rgba(0, 0, 0, 1);
          }
          .timer-display-mini {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .timer-slot {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 50px;
          }
          .slot-val {
            font-size: 2.8rem;
            font-weight: 700;
            color: #ff9d00;
            line-height: 1;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 25px rgba(255, 157, 0, 0.9);
          }
          .slot-label {
            font-size: 0.6rem;
            font-weight: 700;
            color: #ffffff;
            margin-top: 8px;
            letter-spacing: 1.5px;
            opacity: 0.6;
          }
          .slot-sep {
            color: #ff9d00;
            font-weight: 700;
            font-size: 2.2rem;
            margin-top: -20px;
            text-shadow: 0 0 25px rgba(255, 157, 0, 0.9);
          }
          @media (max-width: 600px) {
            .slot-val { font-size: 2.2rem; }
            .slot-sep { font-size: 1.8rem; margin-top: -15px; }
            .timer-box-wrapper { padding: 10px 18px; }
            .timer-slot { min-width: 40px; }
            .timer-display-mini { gap: 10px; }
          }
          @media (max-width: 480px) {
            .slot-val { font-size: 1.8rem; }
            .slot-sep { font-size: 1.5rem; margin-top: -12px; }
            .timer-box-wrapper { padding: 8px 15px; }
            .timer-slot { min-width: 35px; }
            .timer-display-mini { gap: 8px; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="countdown-timer-container">
      <div className="timer-title">OFFER EXPIRES IN</div>
      <div className="timer-display">
        <div className="timer-unit">
          <span className="unit-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="unit-label">HOURS</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-unit">
          <span className="unit-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="unit-label">MINS</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-unit">
          <span className="unit-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="unit-label">SECS</span>
        </div>
      </div>
      <style>{`
        .countdown-timer-container {
          background: #fff;
          border: 2px solid #3B2261;
          padding: 30px 50px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          max-width: max-content;
          margin: 40px auto;
          box-shadow: 0 15px 35px rgba(59, 34, 97, 0.1);
        }
        .timer-title { font-size: 0.9rem; font-weight: 900; color: #3B2261; letter-spacing: 2px; }
        .timer-display { display: flex; align-items: center; gap: 15px; }
        .timer-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #3B2261;
          padding: 12px 20px;
          border-radius: 15px;
          min-width: 85px;
        }
        .unit-value { font-size: 2.8rem; font-weight: 900; color: #fff; line-height: 1; }
        .unit-label { font-size: 0.65rem; font-weight: 800; color: rgba(255, 255, 255, 0.6); margin-top: 5px; }
        .timer-separator { font-size: 2rem; font-weight: 900; color: #EE6662; }
        @media (max-width: 576px) {
          .countdown-timer-container { padding: 20px 30px; }
          .unit-value { font-size: 2rem; }
          .timer-unit { min-width: 70px; padding: 10px; }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;
