import { useEffect, useState } from 'react';

function TimerUnit({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="course-offer-timer__unit">
      <div className="course-offer-timer__digits" aria-hidden="true">
        <span className="course-offer-timer__digit">{display[0]}</span>
        <span className="course-offer-timer__digit">{display[1]}</span>
      </div>
      <span className="course-offer-timer__label">{label}</span>
    </div>
  );
}

export default function CourseTimer({ courseId, label = 'Offer closes in' }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const [colonOn, setColonOn] = useState(true);

  useEffect(() => {
    const storageKey = `course_timer_${courseId || 'default'}`;

    const getOrCreateTarget = (hours = 5) => {
      try {
        const stored = parseInt(localStorage.getItem(storageKey), 10);
        if (stored > Date.now()) return stored;
      } catch {
        /* ignore */
      }
      const target = Date.now() + hours * 3600 * 1000;
      try {
        localStorage.setItem(storageKey, String(target));
      } catch {
        /* ignore */
      }
      return target;
    };

    let target = getOrCreateTarget(5);

    const tick = () => {
      const now = Date.now();
      if (target <= now) {
        target = now + 5 * 3600 * 1000;
        try {
          localStorage.setItem(storageKey, String(target));
        } catch {
          /* ignore */
        }
      }
      const diff = target - now;
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
      setColonOn((v) => !v);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [courseId]);

  return (
    <div className="course-offer-timer" role="timer" aria-live="polite">
      <p className="course-offer-timer__title">{label}</p>
      <div className="course-offer-timer__panel">
        <TimerUnit value={time.h} label="Hours" />
        <span className={`course-offer-timer__colon ${colonOn ? 'is-on' : ''}`} aria-hidden="true">:</span>
        <TimerUnit value={time.m} label="Mins" />
        <span className={`course-offer-timer__colon ${colonOn ? 'is-on' : ''}`} aria-hidden="true">:</span>
        <TimerUnit value={time.s} label="Secs" />
      </div>
    </div>
  );
}
