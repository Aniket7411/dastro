import React, { useEffect, useState } from 'react';
import { ChevronRight, Flame, Play, Video, X, Zap } from 'lucide-react';

const SEGMENTS_BY_DIGIT = {
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

const SEGMENT_CLASS = {
  a: 'left-[18%] top-0 h-[9%] w-[64%]',
  b: 'right-0 top-[10%] h-[35%] w-[13%]',
  c: 'right-0 bottom-[10%] h-[35%] w-[13%]',
  d: 'bottom-0 left-[18%] h-[9%] w-[64%]',
  e: 'bottom-[10%] left-0 h-[35%] w-[13%]',
  f: 'left-0 top-[10%] h-[35%] w-[13%]',
  g: 'left-[18%] top-[45.5%] h-[9%] w-[64%]',
};

function SevenSegmentDigit({ digit }) {
  const activeSegments = SEGMENTS_BY_DIGIT[digit] || [];

  return (
    <span className="relative inline-block h-[2.45rem] w-[1.42rem] sm:h-[3.85rem] sm:w-[2.2rem]" aria-hidden="true">
      {Object.entries(SEGMENT_CLASS).map(([segment, position]) => {
        const isActive = activeSegments.includes(segment);
        return (
          <span
            key={segment}
            className={`absolute rounded-full transition-colors duration-300 ${position} ${
              isActive
                ? 'bg-[#ff9a5f] shadow-[0_0_8px_rgba(255,154,95,0.9),0_0_18px_rgba(255,89,70,0.45)]'
                : 'bg-[#5a3440]/28 shadow-none'
            }`}
          />
        );
      })}
    </span>
  );
}

function SevenSegmentNumber({ value }) {
  return (
    <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5" aria-label={value}>
      {value.split('').map((digit, index) => (
        <SevenSegmentDigit key={`${digit}-${index}`} digit={digit} />
      ))}
    </span>
  );
}

function TimerColon() {
  return (
    <span className="flex h-[2.45rem] flex-col items-center justify-center gap-2 pb-1 sm:h-[3.85rem] sm:gap-3" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a5f] shadow-[0_0_9px_rgba(255,154,95,0.95)] sm:h-2 sm:w-2" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a5f] shadow-[0_0_9px_rgba(255,154,95,0.95)] sm:h-2 sm:w-2" />
    </span>
  );
}

export default function FuturisticBottomCTA({ onJoinNow, isModalOpen = false }) {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);
  const [isHidden, setIsHidden] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setIsReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return undefined;

    const interval = window.setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timeLeft]);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={() => setIsHidden(false)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#ff9b42]/35 bg-[#120816]/95 px-4 py-3 text-sm font-bold text-white shadow-[0_14px_34px_rgba(0,0,0,0.42),0_0_20px_rgba(255,111,37,0.25)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffb84d] shadow-[0_0_12px_rgba(255,184,77,0.9)]" />
        Show offer
      </button>
    );
  }

  if (isModalOpen) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-2 pb-2 transition-[opacity,transform] duration-500 ease-out sm:px-4 sm:pb-4 ${
        isReady ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto max-w-[920px]">
        <div className="relative overflow-hidden rounded-[18px] border border-[#ff9b42]/35 bg-[#100617] text-white shadow-[0_18px_60px_rgba(0,0,0,0.55),0_0_34px_rgba(255,81,60,0.28)] sm:rounded-[22px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,45,116,0.34),transparent_24%),radial-gradient(circle_at_82%_56%,rgba(255,133,43,0.26),transparent_28%),linear-gradient(115deg,rgba(255,255,255,0.06),transparent_32%,rgba(255,255,255,0.04))]" />
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(120deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(35deg,rgba(255,123,53,0.14)_1px,transparent_1px)] [background-size:58px_58px]" />

          <button
            type="button"
            onClick={() => setIsHidden(true)}
            className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
            aria-label="Hide offer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 p-3 sm:p-4">
            <div className="flex flex-col gap-3 pr-8 min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between sm:pr-10">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#221134] shadow-[0_0_0_1px_rgba(255,105,56,0.35),0_0_28px_rgba(255,45,116,0.55)] sm:h-14 sm:w-14">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#ff265f] via-[#ff6a27] to-[#ffb545] opacity-85 blur-[1px]" />
                  <Flame className="relative h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[1rem] font-extrabold leading-tight text-white sm:text-[1.35rem]">
                    Next batch starting soon
                  </h3>
                  <p className="text-[0.8rem] font-bold leading-tight text-[#ffc463] sm:text-[0.95rem]">
                    Limited Seats Available
                  </p>
                  <div className="mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#ffc463] via-[#ff8f4a] to-transparent sm:w-52" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5f8c]/35 bg-white/8 px-3 py-1.5 text-[0.72rem] font-bold text-white shadow-[inset_0_0_14px_rgba(255,255,255,0.05)]">
                  <Video className="h-3.5 w-3.5 fill-[#ff7756] text-[#ff7756]" />
                  Live on Zoom
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5f8c]/35 bg-white/8 px-3 py-1.5 text-[0.72rem] font-bold text-white shadow-[inset_0_0_14px_rgba(255,255,255,0.05)]">
                  <Play className="h-3.5 w-3.5 fill-[#ff9c39] text-[#ff9c39]" />
                  Recording Incl.
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 min-[760px]:grid-cols-[1.08fr_0.92fr]">
              <div className="flex min-h-[86px] items-center justify-center rounded-[16px] border border-[#ff8b55]/25 bg-[#0b0613]/90 px-4 py-3 shadow-[inset_0_0_22px_rgba(255,112,57,0.08)] sm:min-h-[112px] sm:rounded-[20px]">
                <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-2 text-center sm:gap-4">
                  {[
                    { value: hours, label: 'Hours' },
                    { value: minutes, label: 'Minutes' },
                    { value: seconds, label: 'Seconds' },
                  ].map(({ value, label }, index) => (
                    <React.Fragment key={label}>
                      {index > 0 && <TimerColon />}
                      <div className="min-w-0">
                        <SevenSegmentNumber value={value} />
                        <span className="mt-1 block text-[0.58rem] font-bold uppercase text-white/72 sm:mt-2 sm:text-[0.78rem]">
                          {label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="relative flex min-h-[96px] items-center justify-between overflow-hidden rounded-[16px] border border-[#ff7a3a]/70 bg-[#1d092b] px-4 py-3 shadow-[0_0_22px_rgba(255,93,47,0.35)] sm:min-h-[112px] sm:rounded-[20px] sm:px-5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_48%,rgba(255,156,55,0.28),transparent_29%),linear-gradient(135deg,rgba(255,28,126,0.35),rgba(49,10,80,0.65))]" />
                <div className="relative min-w-0">
                  <div className="mb-2 inline-flex items-center gap-1 rounded-[6px] border border-[#ffb24f]/65 bg-[#341144]/95 px-2.5 py-1 text-[0.62rem] font-black uppercase text-[#ffd36d] shadow-[0_0_14px_rgba(255,108,43,0.32)] sm:absolute sm:-top-7 sm:left-0 sm:text-[0.72rem]">
                    <Zap className="h-3 w-3 fill-[#ffd36d] text-[#ffd36d]" />
                    <span className="whitespace-nowrap">Special price for early enrollees!</span>
                  </div>
                  <p className="text-[1rem] font-extrabold leading-none text-white sm:text-[1.25rem]">Join Masterclass</p>
                  <div className="mt-1.5 flex flex-wrap items-end gap-2">
                    <span className="text-[2rem] font-black leading-none text-[#ffc24d] drop-shadow-[0_0_12px_rgba(255,194,77,0.55)] sm:text-[2.85rem]">
                      ₹499
                    </span>
                    <span className="pb-1 text-[0.95rem] font-bold text-white/45 line-through sm:text-[1.15rem]">₹1,999</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onJoinNow?.()}
                  className="group relative ml-3 inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#ffad56]/60 bg-[#2b1037] text-[#ffd482] shadow-[0_0_22px_rgba(255,134,54,0.7),inset_0_0_16px_rgba(255,148,54,0.16)] transition duration-200 hover:scale-105 hover:bg-[#3a1647] active:scale-95 sm:h-16 sm:w-16"
                  aria-label="Join Masterclass Now"
                >
                  <ChevronRight className="h-8 w-8 stroke-[3] transition-transform group-hover:translate-x-0.5 sm:h-10 sm:w-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
