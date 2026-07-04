import { useLocation, useNavigate } from 'react-router-dom';

const HIDE_ON = ['/admin', '/student/course', '/astrologer'];

export default function AstrologerChatFab() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  // Course detail pages have their own persistent CTA (a fixed mobile price
  // bar, and a sticky enroll sidebar on desktop) sharing the bottom-right
  // corner — reposition this FAB there so it never collides with either.
  const isCourseDetailPage = pathname.startsWith('/courses/');

  const positionCls = isCourseDetailPage
    ? 'bottom-[9.75rem] right-[0.9rem] sm:right-5 lg:bottom-[5.6rem] lg:right-auto lg:left-5'
    : 'bottom-[5.2rem] right-[0.9rem] sm:bottom-[5.6rem] sm:right-5';

  return (
    <button
      type="button"
      aria-label="Chat with an Astrologer"
      onClick={() => navigate('/astrologer')}
      className={`fixed z-[1039] inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-full border-0 bg-gradient-to-br from-site-accent-dark to-site-accent py-[0.5rem] pl-[0.55rem] pr-[0.8rem] text-[0.73rem] font-bold text-white shadow-[0_8px_24px_rgba(139,74,30,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(139,74,30,0.45)] active:translate-y-0 sm:gap-[0.45rem] sm:py-[0.6rem] sm:pl-3 sm:pr-4 sm:text-[0.8rem] ${positionCls}`}
    >
      <span
        aria-hidden="true"
        className="flex h-[1.6rem] w-[1.6rem] shrink-0 items-center justify-center rounded-full bg-white/20 text-[0.65rem] sm:h-[1.9rem] sm:w-[1.9rem] sm:text-xs"
      >
        ✦
      </span>
      <span className="hidden sm:inline">Chat with Astrologer</span>
      <span className="sm:hidden">Astro Chat</span>
    </button>
  );
}
