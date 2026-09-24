export const PRICE = '₹499';
export const MRP = '₹1,999';
export const HELP_NUMBER = '+91 90055 75577';
export const HELP_LINK = 'https://wa.me/919005575577';

/** Per-subject accent used for glows, chips and card top-lines. */
export const SUBJECT_ACCENT = {
  'face-reading': '#EE6662',
  'handwriting-signature': '#F0A23C',
  'vedic-astrology': '#E8793A',
  tarot: '#A07BFF',
  'vedic-numerology': '#E2B84A',
};

export const cardAnchor = (id) => `mc-${id}`;

/** Keyframes + reveal classes for the menu page, scoped with an `mcm-` prefix. */
export const MENU_CSS = `
@keyframes mcm-spin { to { transform: rotate(360deg); } }
@keyframes mcm-twinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes mcm-float { 0%,100% { transform: translate(-50%,-50%) translateY(0); } 50% { transform: translate(-50%,-50%) translateY(-6px); } }
@keyframes mcm-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes mcm-shine { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@keyframes mcm-select {
  0% { box-shadow: 0 0 0 0 var(--mcm-accent), 0 12px 30px -18px rgba(31,26,22,.25); }
  25% { box-shadow: 0 0 0 3px var(--mcm-accent), 0 22px 44px -14px var(--mcm-accent); }
  100% { box-shadow: 0 0 0 0 transparent, 0 12px 30px -18px rgba(31,26,22,.25); }
}
@keyframes mcm-ring { 0% { box-shadow: 0 0 0 0 rgba(238,102,98,.55); } 100% { box-shadow: 0 0 0 14px rgba(238,102,98,0); } }

.mcm-stars, .mcm-stars-2 {
  background-image:
    radial-gradient(1.2px 1.2px at 22px 34px, #fff, transparent),
    radial-gradient(1px 1px at 118px 82px, rgba(255,255,255,.85), transparent),
    radial-gradient(1.5px 1.5px at 176px 20px, #ffd9a8, transparent),
    radial-gradient(1px 1px at 64px 150px, rgba(255,255,255,.7), transparent),
    radial-gradient(1.3px 1.3px at 196px 168px, #fff, transparent);
  background-size: 220px 200px;
}
.mcm-stars-2 { background-size: 310px 270px; background-position: 90px 60px; animation: mcm-twinkle 4.5s ease-in-out infinite; }
.mcm-spin { animation: mcm-spin 140s linear infinite; }
.mcm-float { animation: mcm-float 5s ease-in-out infinite; }
.mcm-rise { animation: mcm-rise .8s cubic-bezier(.16,1,.3,1) both; }
.mcm-shine {
  background: linear-gradient(90deg, #FFC463 0%, #EE6662 30%, #FFB27A 50%, #EE6662 70%, #FFC463 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: mcm-shine 6s linear infinite;
}
.mcm-pulse { animation: mcm-ring 1.8s ease-out infinite; }
.mcm-selected { animation: mcm-select 2.2s ease-out both; }
.mcm-reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.mcm-reveal[data-in] { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .mcm-spin, .mcm-float, .mcm-stars-2, .mcm-shine, .mcm-pulse, .mcm-rise { animation: none !important; }
  .mcm-selected { animation: none; box-shadow: 0 0 0 3px var(--mcm-accent); }
  .mcm-reveal { opacity: 1; transform: none; transition: none; }
}
`;
