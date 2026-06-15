import { useState, useEffect } from 'react';

const W = 11;
const H = 20;
const T = 2.6;
const G = 1;
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
  const dw = 2.6;
  const dh = 5.5;
  const cx = 5;
  const color = visible ? '#ff8c00' : OFF_COLOR;
  const glow = visible ? 'drop-shadow(0 0 3px rgba(255,160,0,0.9))' : 'none';
  return (
    <svg width={10} height={H} viewBox={`0 0 10 ${H}`} className="block overflow-visible">
      <rect x={cx - dw / 2} y={H * 0.28 - dh / 2} width={dw} height={dh} rx={1.2} fill={color} style={{ filter: glow }} />
      <rect x={cx - dw / 2} y={H * 0.72 - dh / 2} width={dw} height={dh} rx={1.2} fill={color} style={{ filter: glow }} />
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
      <span className="font-body text-[0.5rem] font-bold uppercase tracking-wider text-white/35 sm:text-[0.5625rem]">
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
  } catch (_) {
    /* ignore */
  }
  const t = Date.now() + hours * 3600 * 1000;
  try {
    localStorage.setItem(STORAGE_KEY, String(t));
  } catch (_) {
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
        } catch (_) {
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
    <div className="flex flex-col items-center gap-1">
      <p className="!m-0 font-body text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/55 sm:text-[0.5625rem]">
        OFFER ENDS IN
      </p>
      <div className="relative overflow-hidden rounded-lg border border-orange-500/25 bg-[#0a0a0a]/90 px-2 py-1 sm:px-2.5 sm:py-1.5">
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-60"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)',
          }}
        />
        <div className="relative z-[1] flex items-center gap-0.5 sm:gap-1">
          <DigitPair value={time.h} label="HRS" />
          <div className="-mt-1.5">
            <SegColon visible={colonOn} />
          </div>
          <DigitPair value={time.m} label="MINS" />
          <div className="-mt-1.5">
            <SegColon visible={colonOn} />
          </div>
          <DigitPair value={time.s} label="SECS" />
        </div>
      </div>
    </div>
  );
}

function OfferBadge({ compact }) {
  return (
    <div
      className={`inline-flex w-fit items-center gap-1 rounded border border-white/15 bg-white/5 font-body font-bold uppercase text-orange-400 shadow-[inset_0_0_8px_rgba(0,0,0,0.25)] ${
        compact ? 'px-1.5 py-0.5 text-[0.5rem] tracking-[0.08em]' : 'px-2 py-0.5 text-[0.5625rem] tracking-[0.1em] sm:text-[0.625rem]'
      }`}
    >
      <svg width={compact ? 8 : 9} height={compact ? 10 : 11} viewBox="0 0 10 13" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M6 0L0 7.5h4L2.5 13 10 5H6L7.5 0z" fill="#ffaa00" />
      </svg>
      <span>LIMITED TIME OFFER</span>
    </div>
  );
}

function PriceBlock({ compact }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${compact ? '' : 'gap-2 sm:gap-2.5'}`}>
      <span
        className={`!m-0 font-body font-semibold uppercase !text-white ${
          compact ? 'text-xs tracking-wide' : 'text-sm tracking-wide sm:text-base'
        }`}
      >
        {compact ? 'Only' : 'ONLY'}
      </span>
      <span
        className={`!m-0 bg-gradient-to-br from-[#ffcc44] via-[#ff8800] to-[#ff5500] bg-clip-text font-body font-black leading-none text-transparent ${
          compact ? 'text-2xl' : 'text-3xl sm:text-4xl'
        }`}
        style={{ filter: 'drop-shadow(0 2px 6px rgba(255,140,0,0.28))' }}
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
      className={`relative z-[1] inline-flex !m-0 cursor-pointer appearance-none items-center justify-center gap-2 overflow-hidden rounded-lg border-0 bg-gradient-to-r from-[#ff9800] via-[#ff6200] to-[#ff4000] font-body !text-sm !font-bold !text-white shadow-[0_4px_14px_rgba(255,90,0,0.35)] transition hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(255,90,0,0.45)] ${
        fullWidth ? 'min-h-9 w-full px-4 py-2' : 'min-h-9 w-auto min-w-[9.5rem] px-5 py-2 sm:min-h-10 sm:px-6'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent" />
      <div className="wb-fixed-cta__shimmer pointer-events-none absolute top-0 h-[80%] w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="relative">Enroll Now</span>
      <span className="wb-fixed-cta__arrow relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/18">
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

function Divider() {
  return (
    <div
      className="mx-1 h-9 w-px shrink-0 rounded-full sm:mx-2 sm:h-10"
      style={{
        background: 'linear-gradient(to bottom, transparent, #ff9900 40%, #ff5500 60%, transparent)',
        boxShadow: '0 0 8px rgba(255,120,0,0.45)',
      }}
      aria-hidden="true"
    />
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

function OfferPriceGroup({ compact }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <OfferBadge compact={compact} />
      <PriceBlock compact={compact} />
    </div>
  );
}

export default function FixedBottomCTA({ onJoinNow }) {
  const isMobile = useIsMobile(640);

  return (
    <div
      className="wb-fixed-cta wb-fixed-cta__bar fixed bottom-0 left-0 z-[9999] w-full overflow-hidden rounded-t-2xl border border-b-0 border-orange-500/20 bg-[#0c0c0c]/95 px-3 py-2 backdrop-blur-md sm:rounded-t-[1.125rem] sm:px-4 sm:py-2.5"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 15% 50%, rgba(255,140,0,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(255,100,0,0.04) 0%, transparent 55%)',
      }}
    >
      <div className="relative z-[1] mx-auto w-full justify-around">
        {isMobile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center justify-center">
                <OfferPriceGroup compact />
              </div>
              <Divider />
              <div className="flex min-w-0 flex-1 items-center justify-center">
                <DigitalTimer />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <EnrollButton onClick={onJoinNow} fullWidth />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-4 lg:gap-6">
            <div className="flex shrink-0 items-center justify-center">
              <OfferPriceGroup />
            </div>
            <div className="flex shrink-0 items-center justify-center">
              <DigitalTimer />
            </div>
            <div className="flex shrink-0 items-center justify-center">
              <EnrollButton onClick={onJoinNow} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
