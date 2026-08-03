import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'fr_masterclass_timer';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export function getTargetTimestamp() {
  if (typeof window === 'undefined') return Date.now() + TWO_HOURS_MS;

  let target = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();
  if (!target || Number(target) < now) {
    target = String(now + TWO_HOURS_MS);
    localStorage.setItem(STORAGE_KEY, target);
  }
  return Number(target);
}

export function formatTime(diff) {
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  return {
    h: String(hours).padStart(2, '0'),
    m: String(minutes).padStart(2, '0'),
    s: String(seconds).padStart(2, '0'),
  };
}

export function SimpleDigitalTimer() {
  const [time, setTime] = useState({ h: '02', m: '00', s: '00' });

  useEffect(() => {
    const target = getTargetTimestamp();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime(formatTime(diff));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 text-white">
      <span className="text-[10px] uppercase tracking-[0.18em] text-white/70">2-hour countdown</span>
      <span className="font-sans text-[20px] font-semibold tabular-nums sm:text-[22px]">{time.h}:{time.m}:{time.s}</span>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/60">
        <span>hours</span>
        <span>minutes</span>
        <span>seconds</span>
      </div>
    </div>
  );
}

export function DigitalTimer() {
  const [time, setTime] = useState({ h: '02', m: '00', s: '00' });

  useEffect(() => {
    const target = getTargetTimestamp();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime(formatTime(diff));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 rounded-[24px] border border-white/10 bg-[#12070f]/95 p-3 text-center text-white sm:gap-3 sm:p-4">
      {[
        { label: 'HOURS', value: time.h },
        { label: 'MINUTES', value: time.m },
        { label: 'SECONDS', value: time.s },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-[16px] bg-[#1f111f]/95 p-3 sm:p-4">
          <p className="text-[26px] font-bold tabular-nums text-white sm:text-[30px]">{value}</p>
          <span className="mt-2 block text-[10px] uppercase tracking-[0.24em] text-slate-300 sm:text-[11px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function FixedBottomCTA({ onJoinNow, isModalOpen, visible = true, onDismiss, onShow }) {
  const [time, setTime] = useState({ h: '02', m: '00', s: '00' });
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = getTargetTimestamp();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime(formatTime(diff));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!visible) {
      setIsVisible(false);
      setIsMounted(false);
      return undefined;
    }

    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsMounted(true);
      } else {
        setIsVisible(false);
        window.setTimeout(() => setIsMounted(false), 280);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  useEffect(() => {
    if (!isMounted) return undefined;
    const id = window.setTimeout(() => setIsVisible(true), 40);
    return () => window.clearTimeout(id);
  }, [isMounted]);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={onShow}
        className="fixed bottom-4 right-4 z-[90] inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#11080f]/95 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ffb646] shadow-[0_0_8px_rgba(255,182,70,0.6)]" />
        Show offer
      </button>
    );
  }

  if (isModalOpen || !isMounted) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-[90] transform transition duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className="mx-4 mb-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b070c]/95 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl max-h-[85vh] sm:max-h-none">
        <div className="relative flex max-h-[85vh] flex-col overflow-y-auto p-3 sm:p-4">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Hide offer"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-white sm:items-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb646] to-[#ff9f12] shadow-[0_10px_24px_rgba(255,154,19,0.24)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 9 7 9 10c0 3 3 4 3 4s3-1 3-4c0-3-3-8-3-8z" />
                  <path d="M12 22c4.418 0 8-3.582 8-8 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 4.418 3.582 8 8 8z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-white">Next batch starting soon</p>
                <p className="text-sm font-semibold text-[#ffd659]">Limited seats available</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-start gap-2 text-[11px] text-slate-100 sm:justify-end">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Live on Zoom</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Recording incl.</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            <div className="rounded-[24px] border border-white/10 bg-[#140712]/95 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Offer expires in</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.26em] text-slate-300">2-hour countdown</p>
                </div>
                <div className="rounded-full bg-[#1a1017] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200">Live</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { value: time.h, label: 'HRS' },
                  { value: time.m, label: 'MIN' },
                  { value: time.s, label: 'SEC' },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-2xl bg-[#1b1119] px-2 py-2.5 text-center">
                    <p className="text-[24px] font-black tabular-nums text-white sm:text-[28px]">{value}</p>
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.3em] text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#f9c737] via-[#ffb63e] to-[#f18917] p-3 sm:p-4">
              <div className="rounded-full border border-[#ffffff]/20 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f1000] shadow-sm">
                Special price for early enrollees
              </div>
              <div className="mt-4 flex h-full flex-col justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#231600]">Join Masterclass</p>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <span className="text-[30px] font-black leading-none tracking-tight text-[#231600] sm:text-[36px]">₹499</span>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2a1400]/80 line-through">₹1,999</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onJoinNow?.()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#170b08] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-black"
                >
                  <span>Reserve your seat</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
