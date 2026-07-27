import { useState, useEffect } from 'react';
import { Z_TIMER_BAR } from '../webinar/tokens';

function getNextSundayMidnightIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const nowIst = new Date(nowUtc + istOffset);
  
  const day = nowIst.getDay(); // 0 is Sunday
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  
  let targetIst = new Date(nowIst);
  targetIst.setDate(nowIst.getDate() + daysUntilSunday);
  targetIst.setHours(23, 59, 0, 0);
  
  if (day === 0 && nowIst.getTime() > targetIst.getTime()) {
    targetIst.setDate(targetIst.getDate() + 7);
  }
  
  return targetIst.getTime() - istOffset;
}

export function SimpleDigitalTimer() {
  const [time, setTime] = useState({ d: 0, h: '00', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const target = getNextSundayMidnightIST();
      const diff = Math.max(0, target - Date.now());

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000) % 24;
      const minutes = Math.floor(diff / 60000) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      setTime({
        d: days,
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0')
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.10em] text-white/60">ENDS IN</span>
      <span className="font-body text-[17px] font-bold text-white tabular-nums tracking-wider">
        {time.d > 0 && `${time.d}d `}{time.h}:{time.m}:{time.s}
      </span>
    </div>
  );
}

export default function FixedBottomCTA({ onJoinNow, isModalOpen }) {
  // Hide completely if modal is open to prevent overlapping and respect Z ladder (FR-01)
  if (isModalOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 w-full ${Z_TIMER_BAR} border-t border-white/10 bg-[#141118] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.5)]`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        
        {/* Price and Timer Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-end gap-2">
            <span className="font-body text-[20px] font-black leading-none text-[#F0703C]">
              ₹499
            </span>
            <span className="text-[13px] text-white/55 line-through decoration-white/30 mb-0.5">
              ₹1,999
            </span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-white/10" />
          <SimpleDigitalTimer />
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onJoinNow}
          className="relative shrink-0 flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] border-0 bg-gradient-to-br from-[#EE6662] to-[#D9534F] px-5 font-body text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(238,102,98,0.3)] transition hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(238,102,98,0.4)]"
        >
          Enroll - ₹499
        </button>

      </div>
    </div>
  );
}
