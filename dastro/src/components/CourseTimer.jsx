import { useEffect, useState } from 'react';

function TimerUnit({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex min-w-[3.4rem] flex-col items-center gap-[0.35rem]">
      <div className="flex gap-[0.28rem]" aria-hidden="true">
        <span className="flex h-[2.1rem] min-w-[1.55rem] items-center justify-center rounded-lg bg-gradient-to-b from-site-primary to-[#5c3d26] px-[0.2rem] text-[1.15rem] font-extrabold leading-none text-[#fef3c7] tabular-nums shadow-[inset_0_-2px_0_rgba(0,0,0,0.25),0_2px_6px_rgba(42,15,2,0.2)]">
          {display[0]}
        </span>
        <span className="flex h-[2.1rem] min-w-[1.55rem] items-center justify-center rounded-lg bg-gradient-to-b from-site-primary to-[#5c3d26] px-[0.2rem] text-[1.15rem] font-extrabold leading-none text-[#fef3c7] tabular-nums shadow-[inset_0_-2px_0_rgba(0,0,0,0.25),0_2px_6px_rgba(42,15,2,0.2)]">
          {display[1]}
        </span>
      </div>
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#7c4a2c]">
        {label}
      </span>
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
    <div className="w-full" role="timer" aria-live="polite">
      <p className="mb-[0.55rem] text-center text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
        {label}
      </p>
      <div className="flex items-center justify-center gap-[0.35rem] rounded-[14px] border border-site-accent/35 bg-gradient-to-br from-[#fffdf8] to-[#f8ebda] px-[0.65rem] py-[0.85rem] shadow-[0_10px_24px_rgba(42,15,2,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <TimerUnit value={time.h} label="Hours" />
        <span
          className={`-mt-[1.1rem] text-[1.35rem] font-extrabold leading-none text-site-accent-dark transition-opacity ${colonOn ? 'opacity-100' : 'opacity-25'}`}
          aria-hidden="true"
        >
          :
        </span>
        <TimerUnit value={time.m} label="Mins" />
        <span
          className={`-mt-[1.1rem] text-[1.35rem] font-extrabold leading-none text-site-accent-dark transition-opacity ${colonOn ? 'opacity-100' : 'opacity-25'}`}
          aria-hidden="true"
        >
          :
        </span>
        <TimerUnit value={time.s} label="Secs" />
      </div>
    </div>
  );
}
