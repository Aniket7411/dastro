import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const fallbackWhatsappNumber = '910000000000';

const suggestedQuestions = [
  {
    label: 'Courses',
    question: 'Which astrology course should I choose?',
    keywords: ['course', 'class', 'learn', 'certification', 'vedic', 'advanced'],
    answer: 'You can start with the beginner or Vedic astrology course if you are new. For deeper prediction skills, explore Advanced Astrology, Predictive Astrology, or Certification Courses.'
  },
  {
    label: 'Consultation',
    question: 'How can I book a consultation?',
    keywords: ['consultation', 'booking', 'book', 'appointment', 'astrologer'],
    answer: 'Go to Consultations, choose the service that matches your concern, and submit the booking form. The team will guide you through the next step.'
  },
  {
    label: 'Shop',
    question: 'How do I choose a gemstone or remedy?',
    keywords: ['gemstone', 'remedy', 'shop', 'rudraksha', 'yantra', 'bracelet', 'puja'],
    answer: 'For gemstones or remedies, it is best to choose after birth chart analysis. You can browse the Astro Shop, or contact support for a recommendation.'
  },
  {
    label: 'Student Login',
    question: 'Where can I watch my course videos?',
    keywords: ['login', 'student', 'video', 'dashboard', 'watch', 'access'],
    answer: 'Use Student Login, then open your dashboard. Your enrolled courses and protected class videos will be available there.'
  },
  {
    label: 'Payment',
    question: 'What should I do if payment fails?',
    keywords: ['payment', 'failed', 'refund', 'checkout', 'transaction'],
    answer: 'If payment fails, retry from the payment page or contact support with your name, phone number, and transaction details.'
  }
];

function normalizeWhatsappNumber(value) {
  return String(value || fallbackWhatsappNumber).replace(/[^\d]/g, '') || fallbackWhatsappNumber;
}

function FloatingChatAssistant() {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Hi, I can help with courses, consultations, shop remedies, student login, and payments.');

  const shouldHide = pathname.startsWith('/admin') || pathname.startsWith('/student/course');
  const whatsappNumber = useMemo(() => normalizeWhatsappNumber(settings?.whatsappNumber), [settings?.whatsappNumber]);

  if (shouldHide) return null;

  const openWhatsApp = (message) => {
    const text = encodeURIComponent(message || 'Hello, I need help with DS Institute website.');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const answerQuestion = (text) => {
    const query = text.trim();
    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const matched = suggestedQuestions.find((item) => item.keywords.some((keyword) => lowerQuery.includes(keyword)));

    if (matched) {
      setAnswer(matched.answer);
      return;
    }

    setAnswer('I am not fully sure about this. Please continue on WhatsApp and our team will help you directly.');
    openWhatsApp(query);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    answerQuestion(question);
  };

  return (
    <div className="floating-chat-assistant">
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label="Website help chat">
          <div className="chat-head">
            <div>
              <span>Website Help</span>
              <strong>How can we guide you?</strong>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-body">
            <p>{answer}</p>
            <div className="chat-suggestions">
              {suggestedQuestions.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setQuestion(item.question);
                    answerQuestion(item.question);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about courses, payment, shop..."
            />
            <button type="submit" aria-label="Ask question">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          <button type="button" className="chat-whatsapp" onClick={() => openWhatsApp(question)}>
            <i className="fab fa-whatsapp"></i>
            Continue on WhatsApp
          </button>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          className="chat-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open help chat"
        >
          <i className="fas fa-comments"></i>
        </button>
      )}

      <style>{`
        .floating-chat-assistant {
          bottom: 1.25rem;
          position: fixed;
          right: 1.25rem;
          z-index: 1040;
        }

        .chat-fab {
          align-items: center;
          background: var(--site-primary, #2a0f02);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          box-shadow: 0 16px 35px rgba(42, 15, 2, 0.28);
          color: #fff;
          display: flex;
          height: 3.4rem;
          justify-content: center;
          width: 3.4rem;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .chat-fab:hover {
          background: var(--site-primary-hover, #6b3514);
          transform: translateY(-2px);
        }

        .chat-panel {
          background: #fff;
          border: 1px solid var(--site-border, rgba(139, 74, 30, 0.14));
          border-radius: 14px;
          bottom: 4.2rem;
          box-shadow: 0 22px 55px rgba(42, 15, 2, 0.18);
          overflow: hidden;
          position: absolute;
          right: 0;
          width: min(21rem, calc(100vw - 2rem));
        }

        .chat-head {
          align-items: center;
          background: linear-gradient(135deg, #2a0f02, #8b4a1e);
          color: #fff;
          display: flex;
          justify-content: space-between;
          padding: 1rem;
        }

        .chat-head span {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          opacity: 0.78;
          text-transform: uppercase;
        }

        .chat-head strong {
          display: block;
          font-size: 1rem;
          line-height: 1.2;
          margin-top: 0.2rem;
        }

        .chat-head button,
        .chat-form button {
          align-items: center;
          border: 0;
          border-radius: 999px;
          display: flex;
          justify-content: center;
        }

        .chat-head button {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          height: 2rem;
          width: 2rem;
        }

        .chat-body {
          padding: 1rem;
        }

        .chat-body p {
          color: var(--site-text-muted, #5c3d26);
          font-size: 0.92rem;
          line-height: 1.55;
          margin-bottom: 0.85rem;
        }

        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .chat-suggestions button {
          background: #fff7ee;
          border: 1px solid var(--site-border, rgba(139, 74, 30, 0.14));
          border-radius: 999px;
          color: var(--site-primary, #2a0f02);
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.42rem 0.62rem;
        }

        .chat-form {
          border-top: 1px solid var(--site-border, rgba(139, 74, 30, 0.14));
          display: grid;
          gap: 0.5rem;
          grid-template-columns: 1fr auto;
          padding: 0.85rem;
        }

        .chat-form input {
          border: 1px solid var(--site-border, rgba(139, 74, 30, 0.14));
          border-radius: 999px;
          color: var(--site-text, #2a0f02);
          font-size: 0.88rem;
          min-width: 0;
          outline: none;
          padding: 0.62rem 0.82rem;
        }

        .chat-form input:focus {
          border-color: var(--site-accent, #c8832a);
          box-shadow: 0 0 0 3px rgba(200, 131, 42, 0.12);
        }

        .chat-form button {
          background: var(--site-primary, #2a0f02);
          color: #fff;
          height: 2.45rem;
          width: 2.45rem;
        }

        .chat-whatsapp {
          align-items: center;
          background: #e9fff2;
          border: 0;
          border-top: 1px solid rgba(15, 118, 64, 0.14);
          color: #0f7640;
          display: flex;
          font-size: 0.9rem;
          font-weight: 800;
          gap: 0.5rem;
          justify-content: center;
          padding: 0.85rem;
          width: 100%;
        }

        @media (max-width: 520px) {
          .floating-chat-assistant {
            bottom: 0.9rem;
            right: 0.9rem;
          }

          .chat-panel {
            bottom: 4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FloatingChatAssistant;
