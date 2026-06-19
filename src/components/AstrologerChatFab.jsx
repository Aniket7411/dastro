import { useLocation, useNavigate } from 'react-router-dom';

const HIDE_ON = ['/admin', '/student/course', '/astrologer'];

export default function AstrologerChatFab() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Chat with an Astrologer"
        onClick={() => navigate('/astrologer')}
        className="astro-chat-fab"
      >
        <span className="astro-chat-fab__icon" aria-hidden="true">✦</span>
        <span className="astro-chat-fab__full">Chat with Astrologer</span>
        <span className="astro-chat-fab__short">Astro Chat</span>
      </button>

      <style>{`
        .astro-chat-fab {
          align-items: center;
          background: linear-gradient(135deg, #8b4a1e 0%, #c8832a 100%);
          border: none;
          border-radius: 999px;
          bottom: 5.6rem;
          box-shadow: 0 8px 24px rgba(139, 74, 30, 0.35);
          color: #fff;
          cursor: pointer;
          display: flex;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          gap: 0.45rem;
          letter-spacing: 0.01em;
          padding: 0.6rem 1rem 0.6rem 0.75rem;
          position: fixed;
          right: 1.25rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
          z-index: 1039;
        }

        .astro-chat-fab:hover {
          box-shadow: 0 12px 32px rgba(139, 74, 30, 0.45);
          transform: translateY(-2px);
        }

        .astro-chat-fab:active {
          transform: translateY(0);
        }

        .astro-chat-fab__icon {
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          font-size: 0.75rem;
          height: 1.9rem;
          justify-content: center;
          width: 1.9rem;
          flex-shrink: 0;
        }

        .astro-chat-fab__short { display: none; }

        @media (max-width: 480px) {
          .astro-chat-fab {
            bottom: 5.2rem;
            right: 0.9rem;
            font-size: 0.73rem;
            padding: 0.5rem 0.8rem 0.5rem 0.55rem;
            gap: 0.35rem;
          }

          .astro-chat-fab__icon {
            height: 1.6rem;
            width: 1.6rem;
            font-size: 0.65rem;
          }

          .astro-chat-fab__full  { display: none; }
          .astro-chat-fab__short { display: inline; }
        }
      `}</style>
    </>
  );
}
