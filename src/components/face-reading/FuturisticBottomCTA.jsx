import React, { useState, useEffect } from 'react';
import { Flame, Video, Play, Zap, ChevronRight } from 'lucide-react';

export default function FuturisticBottomCTA({ onJoinNow }) {
  // Timer State (Default: 2 Hours, 00 Minutes, 00 Seconds)
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format time values with leading zeros
  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    /* Fixed Container at the bottom of the screen */
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-black/80 backdrop-blur-lg border-t border-[#3b1254]">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Glowing Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0714] via-[#1a0b2e] to-[#0d0714] border border-[#ff2a8d]/40 p-4 sm:p-5 text-white shadow-[0_0_30px_rgba(255,42,141,0.25)]">
          
          {/* Top Section: Title & Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            
            {/* Header / Title */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff0055] via-[#ff5500] to-[#ffaa00] shadow-[0_0_18px_rgba(255,85,0,0.8)] animate-pulse">
                <Flame className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-[1rem] sm:text-[1.125rem] font-extrabold tracking-wide text-white leading-tight">
                  Next batch starting soon
                </h3>
                <p className="text-[0.75rem] sm:text-[0.8125rem] font-semibold text-[#ffaa00] tracking-wider">
                  Limited Seats Available
                </p>
              </div>
            </div>

            {/* Live Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b0d2d] border border-[#ff00a0]/30 text-[0.75rem] font-medium text-purple-200">
                <Video className="w-3.5 h-3.5 text-[#ff00a0]" />
                <span>Live on Zoom</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b0d2d] border border-[#ff00a0]/30 text-xs font-medium text-purple-200">
                <Play className="w-3.5 h-3.5 text-[#ff5500] fill-[#ff5500]" />
                <span className="text-[0.75rem]">Recording Incl.</span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Countdown & Pricing CTA */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-2 items-stretch">
            
            {/* Digital LED Timer Box */}
            <div className="col-span-1 md:col-span-6 flex items-center justify-between rounded-xl bg-[#090312]/90 border border-[#ff00a0]/30 px-3 sm:px-4 py-2.5 shadow-inner min-w-0 h-full">
              
              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="text-[1.15rem] sm:text-[1.5rem] font-mono font-black tracking-widest text-[#ff6a00] drop-shadow-[0_0_6px_rgba(255,106,0,0.8)] leading-tight">
                  {hours}
                </span>
                <span className="text-[0.56rem] sm:text-[0.625rem] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                  <span className="sm:hidden">H</span>
                  <span className="hidden sm:inline">HRS</span>
                </span>
              </div>

              <span className="text-[0.95rem] sm:text-[1.15rem] font-mono font-bold text-[#ff00a0] animate-ping px-1">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-[1.15rem] sm:text-[1.5rem] font-mono font-black tracking-widest text-[#ff6a00] drop-shadow-[0_0_6px_rgba(255,106,0,0.8)] leading-tight">
                  {minutes}
                </span>
                <span className="text-[0.56rem] sm:text-[0.625rem] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                  <span className="sm:hidden">M</span>
                  <span className="hidden sm:inline">MIN</span>
                </span>
              </div>

              <span className="text-[0.95rem] sm:text-[1.15rem] font-mono font-bold text-[#ff00a0] animate-ping px-1">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-[1.15rem] sm:text-[1.5rem] font-mono font-black tracking-widest text-[#ff6a00] drop-shadow-[0_0_6px_rgba(255,106,0,0.8)] leading-tight">
                  {seconds}
                </span>
                <span className="text-[0.56rem] sm:text-[0.625rem] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                  <span className="sm:hidden">S</span>
                  <span className="hidden sm:inline">SEC</span>
                </span>
              </div>

            </div>

            {/* Glowing Action Box */}
            <div className="col-span-1 md:col-span-6 relative flex items-center justify-end md:justify-between rounded-xl bg-gradient-to-r from-[#17052c] to-[#2b083d] border-2 border-[#ff00a0] px-3 sm:px-4 py-2.5 shadow-[0_0_20px_rgba(255,0,160,0.4)] min-w-0 h-full">
              
              {/* Floating Highlight Tag */}
              <div className="hidden sm:inline-flex absolute -top-3 left-4 items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ff00a0] to-[#ff5500] text-[0.65rem] sm:text-[0.7rem] font-extrabold text-white tracking-wide shadow-md">
                <Zap className="w-3 h-3 fill-white" />
                <span>Special price for early enrollees!</span>
              </div>

              {/* Pricing Information (hidden on very small screens so button remains visible) */}
              <div className="block mt-1 min-w-0">
                <p className="text-[0.62rem] sm:text-[0.78rem] font-semibold text-gray-300 truncate">
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Join Masterclass</span>
                </p>
                <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-1">
                  <span className="text-[0.95rem] sm:text-[1.25rem] font-black text-[#ffaa00] drop-shadow-[0_0_6px_rgba(255,170,0,0.6)]">₹499</span>
                  <span className="text-[0.68rem] sm:text-[0.8rem] font-semibold text-gray-500 line-through">₹1,999</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onJoinNow?.()}
                  className="relative group inline-flex items-center justify-center px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#ff5500] to-[#ff00a0] text-white shadow-[0_0_12px_rgba(255,85,0,0.5)] hover:scale-105 active:scale-95 transition-transform gap-2 ml-2 sm:ml-0"
                  aria-label="Join Masterclass Now"
                >
                  <span className=" sm:inline text-[0.8rem] sm:text-[0.95rem] font-bold px-1">Enroll</span>

                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
