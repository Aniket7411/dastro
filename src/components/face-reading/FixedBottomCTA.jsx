import { useState, useEffect } from 'react';
import { Flame, Video, Play, Zap, ChevronRight } from 'lucide-react';
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

export function DigitalTimer() {
  const [time, setTime] = useState({ h: '02', m: '00' });

  useEffect(() => {
    const getTarget = () => {
      let target = localStorage.getItem('fr_masterclass_timer');
      if (!target || parseInt(target, 10) < Date.now()) {
        target = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        localStorage.setItem('fr_masterclass_timer', target.toString());
      }
      return parseInt(target, 10);
    };

    const target = getTarget();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor(diff / 60000) % 60;

      setTime({
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-6 md:gap-14 border border-[#F38025]/80 bg-[#160B05] rounded-[10px] md:rounded-[16px] px-5 py-2.5 md:px-8 md:py-3 w-full justify-center md:justify-start">
      <div className="flex flex-col items-center">
        <span className="text-[36px] md:text-[52px] leading-normal py-1 px-1 font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#FFD363] to-[#F39C12] drop-shadow-sm" style={{ transform: 'skewX(-6deg)' }}>
          {time.h}
        </span>
        <span className="text-[9px] md:text-[12px] font-bold text-white tracking-[0.1em] uppercase -mt-1 md:-mt-1">
          HOURS
        </span>
      </div>
      <div className="w-[1px] h-10 md:h-14 bg-[#7A5B45] shrink-0" />
      <div className="flex flex-col items-center">
        <span className="text-[36px] md:text-[52px] leading-normal py-1 px-1 font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#FFD363] to-[#F39C12] drop-shadow-sm" style={{ transform: 'skewX(-6deg)' }}>
          {time.m}
        </span>
        <span className="text-[9px] md:text-[12px] font-bold text-white tracking-[0.1em] uppercase -mt-1 md:-mt-1">
          MINUTES
        </span>
      </div>
    </div>
  );
}

export default function FixedBottomCTA({ onJoinNow, isModalOpen }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isModalOpen || !isVisible) return null;

  if (isDismissed) {
    return (
      <div className={`fixed bottom-4 md:bottom-6 left-4 md:left-6 z-[90] ${Z_TIMER_BAR}`}>
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-2 rounded-full bg-[#181818] border border-white/10 px-3 py-2 shadow-lg transition hover:scale-[1.02]"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#F54B00] shadow-[0_0_8px_rgba(245,75,0,0.8)]" />
          <span className="text-white text-[13px] font-semibold tracking-tight">Masterclass — tap to view</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[calc(100%-2rem)] md:max-w-[760px] z-[90] ${Z_TIMER_BAR}`}>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute -top-3 -right-2 md:-top-4 md:-right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#180E09] border border-[#3E2312] text-white/60 shadow-lg transition hover:text-white hover:bg-[#2A180E]"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="bg-[#180E09] border-t md:border border-[#2A180E] rounded-[18px] p-3 md:p-4 shadow-[0_-8px_36px_rgba(243,128,37,0.14)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between mx-2 md:mx-0">

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] to-[#D75317] text-white shadow-sm">
              <Flame className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Next batch starting soon</span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#FFD363]">Limited seats available</span>
            </div>
          </div>
          <DigitalTimer />
        </div>

        <div className="flex flex-col gap-3 md:w-[340px] md:items-end">
          <div className="flex flex-wrap justify-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3E2312] bg-[#1D130D] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
              <Video className="h-3 w-3 text-[#FFD363]" />
              Live on Zoom
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3E2312] bg-[#1D130D] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
              <Play className="h-3 w-3 text-[#FFD363]" />
              Recording incl.
            </div>
          </div>

          <button
            onClick={onJoinNow}
            className="rounded-[14px] bg-gradient-to-br from-[#FFD659] to-[#E98214] px-4 py-3 text-left text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-[0.5px] hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold leading-none">Join Masterclass</p>
                <p className="text-[18px] font-black leading-none">₹499</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A0E08] text-[#FFD363] shadow-inner">
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </div>
            </div>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-slate-950/80">Early bird price</span>
          </button>
        </div>
      </div>
    </div>
  );
}
