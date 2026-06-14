import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PURE SVG 7-SEGMENT DISPLAY — DS-Digital replica
// ─────────────────────────────────────────────────────────────────────────────

const W = 15, H = 26, T = 3.2, G = 1.2, SK = 0;
// reasoning tej hota to samjh aata kya likha hai ye sab 
// w= wid, g= gap
const SEG_POINTS = {
  a: [[G+SK,G],[W-G+SK,G],[W-G-T+SK,G+T],[G+T+SK,G+T]],
  b: [[W-G+SK,G*2],[W-G,H/2-G],[W-G-T,H/2-G-T],[W-G-T+SK,G*2+T]],
  c: [[W-G,H/2+G],[W-G-SK,H-G*2],[W-G-T-SK,H-G*2-T],[W-G-T,H/2+G+T]],
  d: [[G+T-SK,H-G-T],[W-G-T-SK,H-G-T],[W-G-SK,H-G],[G-SK,H-G]],
  e: [[G,H/2+G],[G+T,H/2+G+T],[G+T-SK,H-G*2-T],[G-SK,H-G*2]],
  f: [[G+SK,G*2],[G+T+SK,G*2+T],[G+T,H/2-G-T],[G,H/2-G]],
  g: [[G+T,H/2-T/2],[W-G-T,H/2-T/2],[W-G-T,H/2+T/2],[G+T,H/2+T/2]],
};

const DIGIT_MAP = {
  "0":["a","b","c","d","e","f"],
  "1":["b","c"],
  "2":["a","b","g","e","d"],
  "3":["a","b","g","c","d"],
  "4":["f","g","b","c"],
  "5":["a","f","g","c","d"],
  "6":["a","f","g","e","c","d"],
  "7":["a","b","c"],
  "8":["a","b","c","d","e","f","g"],
  "9":["a","b","c","d","f","g"],
};

const pts = (arr) => arr.map(([x, y]) => `${x},${y}`).join(" ");
const SEGS = Object.fromEntries(Object.entries(SEG_POINTS).map(([k, v]) => [k, pts(v)]));

const ON_COLOR  = "#ffaa22";
const OFF_COLOR = "rgba(255,90,0,0.09)";
const ON_FILTER =
  "drop-shadow(0 0 2px rgba(255,180,30,1)) " +
  "drop-shadow(0 0 6px rgba(255,130,0,0.85)) " +
  "drop-shadow(0 0 14px rgba(255,80,0,0.55))";

function Digit({ char }) {
  const on = new Set(DIGIT_MAP[char] || []);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
      {Object.entries(SEGS).map(([key, points]) => {
        const lit = on.has(key);
        return (
          <polygon
            key={key}
            points={points}
            fill={lit ? ON_COLOR : OFF_COLOR}
            style={{ filter: lit ? ON_FILTER : "none" }}
          />
        );
      })}
    </svg>
  );
}

function SegColon({ visible }) {
  const DW = 3.2, DH = 7, CX = 6;
  const color = visible ? "#ff8c00" : "rgba(255,90,0,0.09)";
  const glow  = visible
    ? "drop-shadow(0 0 3px rgba(255,160,0,0.95)) drop-shadow(0 0 8px rgba(255,90,0,0.7))"
    : "none";
  return (
    <svg width={12} height={H} viewBox={`0 0 12 ${H}`} style={{ overflow: "visible", display: "block" }}>
      <rect x={CX-DW/2} y={H*0.28-DH/2} width={DW} height={DH} rx={1.5} fill={color} style={{ filter: glow }} />
      <rect x={CX-DW/2} y={H*0.72-DH/2} width={DW} height={DH} rx={1.5} fill={color} style={{ filter: glow }} />
    </svg>
  );
}

function DigitPair({ value, label }) {
  const str = String(value).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        <Digit char={str[0]} />
        <Digit char={str[1]} />
      </div>
      <span style={ss.segLabel}>{label}</span>
    </div>
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "webinar_cta_timer_v3";

function getOrCreateTarget(hours = 24) {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const stored = parseInt(s, 10);
      if (stored > Date.now()) return stored;
    }
  } catch (_) {}
  const t = Date.now() + hours * 3600 * 1000;
  try { localStorage.setItem(STORAGE_KEY, String(t)); } catch (_) {}
  return t;
}

function DigitalTimer() {
  const [time, setTime]     = useState({ h: 24, m: 0, s: 0 });
  const [colonOn, setColon] = useState(true);

  useEffect(() => {
    let target = getOrCreateTarget(24);
    const tick = () => {
      const now = Date.now();
      if (target <= now) {
        target = now + 24 * 3600 * 1000;
        try { localStorage.setItem(STORAGE_KEY, String(target)); } catch (_) {}
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
    <div style={ss.timerRoot}>
      <p style={ss.timerLabel}>OFFER ENDS IN</p>
      <div style={ss.timerBox}>
        <div style={ss.scanlines} />
        <div style={ss.timerInner}>
          <DigitPair value={time.h} label="HRS"  />
          <div style={{ marginTop: -10 }}><SegColon visible={colonOn} /></div>
          <DigitPair value={time.m} label="MINS" />
          <div style={{ marginTop: -10 }}><SegColon visible={colonOn} /></div>
          <DigitPair value={time.s} label="SECS" />
        </div>
      </div>
    </div>
  );
}

// ─── Enroll Button ────────────────────────────────────────────────────────────
function EnrollButton({ onClick, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const btnStyle = {
    ...ss.btn,
    ...(isMobile ? ss.btnMobile : ss.btnDesktop),
    ...(hovered ? ss.btnHover : {}),
  };

  return (
    <button
      style={btnStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={ss.btnShine} />
      <div style={ss.shimmer} className="btn-shimmer" />
      <span style={ss.btnText}>Enroll Now</span>
      <span style={ss.btnIcon} className="arrow-anim">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

// ─── useIsMobile ──────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 600) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return mobile;
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function FixedBottomCTA({ onJoinNow }) {
  const isMobile = useIsMobile(600);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes ctaGlow {
          0%,100% { box-shadow: 0 -4px 24px rgba(255,120,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05); }
          50%      { box-shadow: 0 -6px 48px rgba(255,120,0,0.40), inset 0 1px 0 rgba(255,255,255,0.10); }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(250%)  skewX(-20deg); }
        }
        @keyframes arrowPulse {
          0%,100% { transform: translateX(0); }
          50%     { transform: translateX(4px); }
        }
        .cta-root   { animation: ctaGlow 3.5s ease-in-out infinite; }
        .btn-shimmer{ animation: shimmerSweep 3s ease-in-out infinite; }
        .arrow-anim { animation: arrowPulse 1s ease-in-out infinite; }
      `}</style>

      <div className="cta-root" style={{ ...ss.cta, ...(isMobile ? ss.ctaMobile : ss.ctaDesktop) }}>
        <div style={ss.ambientGlow} />

        {isMobile ? (
          /* ── MOBILE layout: badge+price left | timer right, button full-width below ── */
          <>
            <div style={ss.mobileTopRow}>
              {/* Left Container */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ ...ss.badge, fontSize: 7 }}>
                  <svg width="9" height="11" viewBox="0 0 10 13" fill="none">
                    <path d="M6 0L0 7.5h4L2.5 13 10 5H6L7.5 0z" fill="#ffaa00" />
                  </svg>
                  <span>LIMITED TIME OFFER</span>
                </div>
                <div style={ss.priceRow}>
                  <span style={ss.onlyText}>Only</span>
                  <span style={ss.amount}>₹99</span>
                </div>
              </div>
 
              {/* 🔥 Vertical Divider */}
              <div style={ss.dividerLine}></div>
 
              {/* Right Container */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DigitalTimer />
              </div>
            </div>

            {/* Full-width button */}
            <div style={{ paddingTop: 10 }}>
              <EnrollButton onClick={onJoinNow} isMobile={true} />
            </div>
          </>
        ) : (
          /* ── DESKTOP layout: Badge | Price | Divider | Timer | Button ── */
          <div style={ss.desktopRow}>
            {/* 1. Badge */}
            <div style={ss.badge}>
              <svg width="12" height="15" viewBox="0 0 10 13" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 0L0 7.5h4L2.5 13 10 5H6L7.5 0z" fill="#ffaa00" />
              </svg>
              <span>LIMITED TIME OFFER</span>
            </div>

            {/* 2. Price Row */}
            <div style={ss.priceRowDesktop}>
              <span style={ss.onlyTextDesktop}>ONLY</span>
              <span style={ss.amountDesktop}>₹99</span>
            </div>

            {/* 🔥 Vertical Divider */}
            <div style={ss.dividerLine}></div>

            {/* 3. Timer */}
            <div style={ss.desktopTimerWrapper}>
              <DigitalTimer />
            </div>

            {/* 4. Enroll Button */}
            <div style={ss.desktopButtonWrapper}>
              <EnrollButton onClick={onJoinNow} isMobile={false} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────
const BASE_CTA = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  zIndex: 9999,
  background: "linear-gradient(135deg, #1a1a1a 0%, #111 60%, #1c1410 100%)",
  border: "1.5px solid rgba(255,160,30,0.20)",
  borderBottom: "none",
  overflow: "hidden",
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
};

const ss = {
  cta: BASE_CTA,
  ctaMobile:  { borderRadius: "16px 16px 0 0", padding: "5px 6px 5px" },
  ctaDesktop: { 
    borderRadius: "20px 20px 0 0", 
    padding: "8px 60px 10px",
    width: "100%",
    bottom: 0,
    left: 0,
    transform: "none",
    border: "1.5px solid rgba(255,160,30,0.25)",
    borderBottom: "none",
    backdropFilter: "blur(15px)",
    backgroundColor: "rgba(12, 12, 12, 0.94)",
  },

  ambientGlow: {
    position: "absolute", inset: 0,
    background:
      "radial-gradient(ellipse at 15% 50%, rgba(255,140,0,0.07) 0%, transparent 55%)," +
      "radial-gradient(ellipse at 85% 50%, rgba(255,100,0,0.05) 0%, transparent 55%)",
    pointerEvents: "none",
  },

  // Mobile rows
  mobileTopRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 10,
    position: "relative", zIndex: 1,
  },
  mobileLeft:  { display: "flex", flexDirection: "column", gap: 5, flex: 1, alignItems: "center" },
  mobileRight: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1 },

  // Desktop row
  desktopRow: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", position: "relative", zIndex: 1, gap: "60px",
  },
  priceRowDesktop: { display: "flex", alignItems: "center", gap: "18px" },
  desktopTimerWrapper: { display: "flex", alignItems: "center" },
  desktopButtonWrapper: { display: "flex", alignItems: "center" },

  vDivider: {
    width: 1, height: 72, flexShrink: 0,
    background: "linear-gradient(to bottom, transparent, rgba(255,150,0,0.28), transparent)",
  },

  // Badge
  badge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "rgba(255,255,255,0.05)",
    border: "1.2px solid rgba(255,255,255,0.15)",
    borderRadius: "5px", padding: "3px 6px", width: "fit-content",
    fontSize: 10, fontWeight: 700, color: "#ff9900",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
    letterSpacing: "1px", textTransform: "uppercase",
  },

  priceRow: { display: "flex", alignItems: "center", gap: 6, padding: "2px 0", marginTop: 6 },
  onlyText: { fontSize: "1.5rem", fontWeight: 500, color: "#fff", textTransform: "uppercase", letterSpacing: "1px" },
  onlyTextDesktop: { fontSize: "2.2rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "2px" },
  amount: {
    fontSize: "3.2rem", fontWeight: 900,
    background: "linear-gradient(135deg, #ffcc44 0%, #ff8800 50%, #ff5500 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", lineHeight: 1,
    filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.3))",
  },
  amountDesktop: {
    fontSize: "5.2rem", fontWeight: 950,
    background: "linear-gradient(135deg, #ffcc44 0%, #ff8800 50%, #ff5500 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", lineHeight: 1,
    filter: "drop-shadow(0 4px 15px rgba(255,140,0,0.4))",
  },
  dividerLine: {
    width: "2px",
    height: 60,
    background: "linear-gradient(to bottom, transparent, #ff9900 40%, #ff5500 60%, transparent)",
    boxShadow: `
      0 0 6px rgba(255,150,0,0.9),
      0 0 18px rgba(255,120,0,0.7),
      0 0 40px rgba(255,80,0,0.5)
    `,
    borderRadius: "3px",
    flexShrink: 0,
    margin: "0 10px",
  },
  priceBox: {
    background: "rgba(10, 10, 10, 0.8)",
    padding: "6px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,140,0,0.25)",
    boxShadow: "inset 0 2px 15px rgba(0,0,0,0.8), 0 0 20px rgba(255,100,0,0.1)",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(4px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  // Timer
  timerRoot: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "5px" },
  timerLabel: {
    margin: 0, fontSize: 8, fontWeight: 400,
    color: "rgba(255,255,255,0.60)", letterSpacing: "2px", textTransform: "uppercase",
  },
  timerBox: {
    background: "rgba(10, 10, 10, 0.8)", padding: "6px 12px",
    borderRadius: 12, border: "1px solid rgba(255,140,0,0.25)",
    boxShadow: "inset 0 2px 15px rgba(0,0,0,0.8), 0 0 20px rgba(255,100,0,0.1)",
    position: "relative", overflow: "hidden",
    backdropFilter: "blur(4px)",
  },
  scanlines: {
    position: "absolute", inset: 0, borderRadius: 10,
    background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)",
    pointerEvents: "none", zIndex: 2,
  },
  timerInner: { display: "flex", alignItems: "center", gap: 3, position: "relative", zIndex: 1 },
  segLabel: {
    fontSize: 7, fontWeight: 700,
    color: "rgba(255,255,255,0.35)", letterSpacing: "1px",
    textTransform: "uppercase", fontFamily: "'Poppins', sans-serif",
  },

  // Button
  btn: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
    border: "none", borderRadius: 10, cursor: "pointer",
    background: "linear-gradient(100deg, #ff9800 0%, #ff6200 45%, #ff4000 100%)",
    boxShadow: "0 5px 24px rgba(255,90,0,0.42), inset 0 1px 0 rgba(255,220,100,0.22)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden", fontFamily: "'Poppins', sans-serif",
    whiteSpace: "nowrap",
  },
  btnMobile: { width: "100%", padding: "8px 16px" },
  btnDesktop: { width: "fit-content", minWidth: "240px", padding: "14px 40px" },
  btnHover: {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 12px 32px rgba(255,90,0,0.55), inset 0 1px 0 rgba(255,220,100,0.3)",
  },
  btnShine: {
    position: "absolute", inset: 0, borderRadius: 100,
    background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 52%)",
    pointerEvents: "none",
  },
  shimmer: {
    position: "absolute", top: 0, width: "35%", height: "80%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
    pointerEvents: "none",
  },
  btnText: { fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "0.2px", position: "relative" },
  btnIcon: {
    width: 30, height:26 , flexShrink: 0,
    background: "rgba(255,255,255,0.18)", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
};