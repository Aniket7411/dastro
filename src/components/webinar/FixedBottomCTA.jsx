import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const W = 9;
const H = 16;
const T = 2.2;
const G = 0.8;
const SK = 0;

const SEG_POINTS = {
  a: [[G + SK, G], [W - G + SK, G], [W - G - T + SK, G + T], [G + T + SK, G + T]],
  b: [[W - G + SK, G * 2], [W - G, H / 2 - G], [W - G - T, H / 2 - G - T], [W - G - T + SK, G * 2 + T]],
  c: [[W - G, H / 2 + G], [W - G - SK, H - G * 2], [W - G - T - SK, H - G * 2 - T], [W - G - T, H / 2 + G + T]],
  d: [[G + T - SK, H - G - T], [W - G - T - SK, H - G - T], [W - G - SK, H - G], [G - SK, H - G]],
  e: [[G, H / 2 + G], [G + T, H / 2 + G + T], [G + T - SK, H - G * 2 - T], [G - SK, H - G * 2]],
  f: [[G + SK, G * 2], [G + T + SK, G * 2 + T], [G + T, H / 2 - G - T], [G, H / 2 - G]],
  g: [[G + T, H / 2 - T / 2], [W - G - T, H / 2 - T / 2], [W - G - T, H / 2 + T / 2], [G + T, H / 2 + T / 2]],
};

const DIGIT_MAP = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'g', 'c', 'd'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'g', 'e', 'c', 'd'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

const pts = (arr) => arr.map(([x, y]) => `${x},${y}`).join(' ');
const SEGS = Object.fromEntries(Object.entries(SEG_POINTS).map(([k, v]) => [k, pts(v)]));

const ON_COLOR = '#ffaa22';
const OFF_COLOR = 'rgba(255,90,0,0.09)';
const ON_FILTER =
  'drop-shadow(0 0 2px rgba(255,180,30,1)) drop-shadow(0 0 5px rgba(255,130,0,0.8))';

function Digit({ char }) {
  const on = new Set(DIGIT_MAP[char] || []);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block overflow-visible">
      {Object.entries(SEGS).map(([key, points]) => {
        const lit = on.has(key);
        return (
          <polygon
            key={key}
            points={points}
            fill={lit ? ON_COLOR : OFF_COLOR}
            style={{ filter: lit ? ON_FILTER : 'none' }}
          />
        );
      })}
    </svg>
  );
}

function SegColon({ visible }) {
  const dw = 2.2;
  const dh = 4.5;
  const cx = 4;
  const color = visible ? '#ff8c00' : OFF_COLOR;
  const glow = visible ? 'drop-shadow(0 0 3px rgba(255,160,0,0.9))' : 'none';
  return (
    <svg width={8} height={H} viewBox={`0 0 8 ${H}`} className="block overflow-visible">
      <rect x={cx - dw / 2} y={H * 0.28 - dh / 2} width={dw} height={dh} rx={1} fill={color} style={{ filter: glow }} />
      <rect x={cx - dw / 2} y={H * 0.72 - dh / 2} width={dw} height={dh} rx={1} fill={color} style={{ filter: glow }} />
    </svg>
  );
}

function DigitPair({ value, label }) {
  const str = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex gap-0.5">
        <Digit char={str[0]} />
        <Digit char={str[1]} />
      </div>
      <span className="font-body text-[0.4375rem] font-bold uppercase tracking-wider text-white/35 sm:text-[0.5rem]">
        {label}
      </span>
    </div>
  );
}

const STORAGE_KEY = 'webinar_cta_timer_v3';

function getOrCreateTarget(hours = 24) {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const stored = parseInt(s, 10);
      if (stored > Date.now()) return stored;
    }
  } catch {
    /* ignore */
  }
  const t = Date.now() + hours * 3600 * 1000;
  try {
    localStorage.setItem(STORAGE_KEY, String(t));
  } catch {
    /* ignore */
  }
  return t;
}

function DigitalTimer() {
  const [time, setTime] = useState({ h: 24, m: 0, s: 0 });
  const [colonOn, setColon] = useState(true);

  useEffect(() => {
    let target = getOrCreateTarget(24);
    const tick = () => {
      const now = Date.now();
      if (target <= now) {
        target = now + 24 * 3600 * 1000;
        try {
          localStorage.setItem(STORAGE_KEY, String(target));
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
      setColon((v) => !v);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className="!m-0 font-body text-[0.4375rem] font-semibold uppercase tracking-[0.12em] text-white/55 sm:text-[0.5rem]">
        Offer ends
      </p>
      <div className="relative overflow-hidden rounded-md border border-orange-500/25 bg-[#0a0a0a]/90 px-1.5 py-0.5 sm:px-2 sm:py-1">
        <div className="relative z-[1] flex items-center gap-0.5">
          <DigitPair value={time.h} label="HRS" />
          <div className="-mt-1">
            <SegColon visible={colonOn} />
          </div>
          <DigitPair value={time.m} label="MIN" />
          <div className="-mt-1">
            <SegColon visible={colonOn} />
          </div>
          <DigitPair value={time.s} label="SEC" />
        </div>
      </div>
    </div>
  );
}

function PriceBlock() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="!m-0 font-body text-[0.6875rem] font-semibold uppercase !text-white sm:text-xs">
        Only
      </span>
      <span
        className="!m-0 bg-gradient-to-br from-[#ffcc44] via-[#ff8800] to-[#ff5500] bg-clip-text font-body text-xl font-black leading-none text-transparent sm:text-2xl"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(255,140,0,0.24))' }}
      >
        ₹99
      </span>
    </div>
  );
}

function EnrollButton({ onClick, fullWidth }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-[1] inline-flex !m-0 cursor-pointer appearance-none items-center justify-center gap-1.5 overflow-hidden rounded-md border-0 bg-gradient-to-r from-[#ff9800] via-[#ff6200] to-[#ff4000] px-3 py-1.5 font-body !text-xs !font-bold !text-white shadow-[0_3px_10px_rgba(255,90,0,0.3)] transition hover:-translate-y-px ${
        fullWidth ? 'min-h-8 w-full' : 'min-h-8 w-auto min-w-[7.5rem]'
      }`}
    >
      <span className="relative">Enroll — ₹99</span>
    </button>
  );
}

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return mobile;
}

export default function FixedBottomCTA({ onJoinNow, onJoinFree, onDismiss }) {
  const isMobile = useIsMobile(640);

  return (
    <div
      className="wb-fixed-cta wb-fixed-cta__bar fixed bottom-0 left-0 z-[9999] w-full overflow-hidden rounded-t-xl border border-b-0 border-orange-500/20 bg-[#0c0c0c]/95 px-2.5 py-1.5 backdrop-blur-md sm:px-3 sm:py-2"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 15% 50%, rgba(255,140,0,0.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(255,100,0,0.04) 0%, transparent 55%)',
      }}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-1.5 top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
        aria-label="Hide offer bar"
      >
        <X size={12} aria-hidden />
      </button>

      <div className="relative z-[1] mx-auto w-full max-w-4xl">
        {isMobile ? (
          <div className="flex flex-col items-center gap-1.5 pr-6">
            <div className="flex w-full items-center justify-center gap-3">
              <PriceBlock />
              <DigitalTimer />
            </div>
            <EnrollButton onClick={onJoinNow} fullWidth />
            <button
              type="button"
              onClick={onJoinFree}
              className="!m-0 border-0 bg-transparent p-0 font-body text-[0.6875rem] font-semibold text-white/75 underline-offset-2 transition hover:text-white hover:underline"
            >
              Want to join free webinar?
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-3 pr-8">
            <PriceBlock />
            <DigitalTimer />
            <div className="flex flex-col items-end gap-1">
              <EnrollButton onClick={onJoinNow} />
              <button
                type="button"
                onClick={onJoinFree}
                className="!m-0 border-0 bg-transparent p-0 font-body text-[0.6875rem] font-semibold text-white/75 underline-offset-2 transition hover:text-white hover:underline"
              >
                Free webinar instead?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
