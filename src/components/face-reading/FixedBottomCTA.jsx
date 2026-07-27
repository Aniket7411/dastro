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
        <span className="text-[36px] md:text-[52px] leading-[1.1] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#FFD363] to-[#F39C12] drop-shadow-sm" style={{ transform: 'skewX(-6deg)' }}>
          {time.h}
        </span>
        <span className="text-[9px] md:text-[12px] font-bold text-white tracking-[0.1em] uppercase mt-0.5 md:mt-1">
          HOURS
        </span>
      </div>
      <div className="w-[1px] h-10 md:h-14 bg-[#7A5B45] shrink-0" />
      <div className="flex flex-col items-center">
        <span className="text-[36px] md:text-[52px] leading-[1.1] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#FFD363] to-[#F39C12] drop-shadow-sm" style={{ transform: 'skewX(-6deg)' }}>
          {time.m}
        </span>
        <span className="text-[9px] md:text-[12px] font-bold text-white tracking-[0.1em] uppercase mt-0.5 md:mt-1">
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
          className="flex items-center gap-2.5 bg-[#1A1A1A] border border-white/10 rounded-full pl-3 pr-4 py-2.5 shadow-xl hover:scale-[1.02] transition-transform animate-in fade-in slide-in-from-left-4 duration-300"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#F54B00] shadow-[0_0_8px_rgba(245,75,0,0.8)]" />
          <span className="text-white text-[13px] md:text-[14px] font-bold tracking-tight">Masterclass — tap to view offer</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[calc(100%-2rem)] md:max-w-[840px] z-[90] ${Z_TIMER_BAR}`}>
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute -top-3 -right-2 md:-top-4 md:-right-4 w-7 h-7 md:w-10 md:h-10 bg-[#180E09] border border-[#3E2312] rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-[#2A180E] shadow-lg z-[100] transition-colors"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="bg-[#180E09] border-t md:border border-[#2A180E] rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-[0_-10px_40px_rgba(243,128,37,0.15)] md:shadow-[0_0_50px_rgba(243,128,37,0.15)] flex flex-row items-center justify-between gap-4 md:gap-8 mx-1 mb-1 md:mx-0 md:mb-0">

        {/* Left Area */}
        <div className="w-[49%] md:w-auto flex flex-col items-start gap-3 md:gap-5">
          {/* Fire + Title */}
          <div className="flex flex-col w-full relative">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative w-11 h-11 md:w-14 md:h-14 shrink-0 rounded-full bg-gradient-to-br from-[#F5A623] to-[#D75317] flex items-center justify-center shadow-[0_0_24px_rgba(242,140,40,0.5)] z-10">
                <Flame className="w-5 h-5 md:w-7 md:h-7 text-white fill-white" />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-white font-bold text-[14px] md:text-[22px] leading-tight mb-0.5 md:mb-1">Next batch starting soon</span>
                <span className="text-[#FFD363] text-[10px] md:text-[15px] font-medium leading-tight">Limited Seats Available</span>
              </div>
            </div>
            {/* Faded Line */}
            <div className="absolute bottom-[-10px] md:bottom-[-12px] left-[52px] md:left-[72px] h-[1.5px] md:h-[2px] w-[140px] md:w-[200px] bg-gradient-to-r from-[#FFD363] to-transparent opacity-80" />
          </div>

          {/* Timer Box */}
          <DigitalTimer />
        </div>

        {/* Right Area */}
        <div className="w-[49%] md:w-[380px] flex flex-col items-end gap-3 md:gap-5">
          {/* Tags */}
          <div className="flex items-center gap-2.5 md:gap-3 w-full justify-end">
            <div className="bg-[#1D130D] border border-[#3E2312] rounded-full px-3 py-1 md:px-4 md:py-1.5 flex items-center gap-1 md:gap-2 shadow-sm">
              <Video className="w-3 h-3 md:w-4 md:h-4 text-[#FFD363] fill-[#FFD363]" />
              <span className="text-white text-[9px] md:text-[13px] font-medium leading-none">Live on Zoom</span>
            </div>
            <div className="bg-[#1D130D] border border-[#3E2312] rounded-full px-3 py-1 md:px-4 md:py-1.5 flex items-center gap-1 md:gap-2 shadow-sm">
              <Play className="w-3 h-3 md:w-4 md:h-4 text-[#FFD363] fill-[#FFD363]" />
              <span className="text-white text-[9px] md:text-[13px] font-medium leading-none">Recording incl.</span>
            </div>
          </div>

          {/* Button Container */}
          <div className="relative w-full mt-2 md:mt-2">
            {/* Floating Tag */}
            <div className="absolute -top-3.5 md:-top-4 left-3 md:left-6 bg-gradient-to-r from-[#FFD659] to-[#F19D17] rounded-[4px] md:rounded-md px-2.5 md:px-3.5 py-[5px] md:py-1.5 flex items-center gap-1 md:gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.4)] z-20 border border-[#F19D17]/50">
              <Zap className="w-3 h-3 md:w-4 md:h-4 text-black fill-black" />
              <span className="text-[9px] md:text-[12px] font-bold text-black leading-none">Special price for early enrollees!</span>
            </div>

            {/* Main Button */}
            <button onClick={onJoinNow} className="w-full block rounded-[12px] md:rounded-[16px] bg-gradient-to-b from-[#FFD659] to-[#E98214] transition-transform duration-300 hover:scale-[1.02] shadow-[0_8px_20px_rgba(233,130,20,0.3)] p-3 md:p-5 relative overflow-hidden group">
              <div className="flex items-center justify-between w-full h-full relative z-10">
                <div className="flex flex-col items-start gap-0.5 md:gap-1">
                  <span className="text-black font-semibold text-[13px] md:text-[18px] leading-none">Join Masterclass</span>
                  <div className="flex items-baseline gap-2 md:gap-3 mt-1 md:mt-1">
                    <span className="text-black font-black text-[26px] md:text-[40px] leading-none tracking-tight">₹499</span>
                    <span className="text-[#7A6B5D] line-through text-[13px] md:text-[20px] font-bold decoration-[#7A6B5D]/60">₹1,999</span>
                  </div>
                </div>
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#1A0E08] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-black transition-colors">
                  <ChevronRight className="w-4.5 h-4.5 md:w-7 md:h-7 text-[#FFD363]" strokeWidth={2.5} />
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
