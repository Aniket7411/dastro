import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { WHATSAPP_NUMBER } from '../utils/contactInfo';
import { matchQuestion } from '../data/chatQA';


const fallbackWhatsappNumber = WHATSAPP_NUMBER;

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
  const [isTyping, setIsTyping] = useState(false);
  const [answer, setAnswer] = useState('Hi, I can help with courses, consultations, shop remedies, student login, and payments.');

  const shouldHide = pathname.startsWith('/admin') || pathname.startsWith('/student/course');
  // Course detail pages show a fixed price/CTA bar at the bottom on
  // mobile/tablet — lift this FAB clear of it so they don't overlap.
  const hasMobileStickyBar = pathname.startsWith('/courses/');
  const whatsappNumber = useMemo(() => normalizeWhatsappNumber(settings?.whatsappNumber), [settings?.whatsappNumber]);

  if (shouldHide) return null;

  const openWhatsApp = (message) => {
    const text = encodeURIComponent(message || 'Hello, I need help with DS Astrology website.');
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const answerQuestion = (text) => {
    const query = text.trim();
    if (!query) return;

    // First try the 70 Q&A bank
    const answerFromQA = matchQuestion(query);
    if (answerFromQA) {
      setAnswer(answerFromQA);
      return;
    }

    // Then try existing suggested questions just in case
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
    setIsTyping(false);
    answerQuestion(question);
  };

  const lowerQuestion = question.trim().toLowerCase();
  const liveMatches = isTyping
    ? suggestedQuestions.filter((item) => item.keywords.some((keyword) => keyword.includes(lowerQuestion) || lowerQuestion.includes(keyword)))
    : [];

  const wrapperPositionCls = hasMobileStickyBar ? 'bottom-24 lg:bottom-5' : 'bottom-[0.9rem] sm:bottom-5';

  return (
    <div className={`fixed z-[1040] right-[0.9rem] sm:right-5 ${wrapperPositionCls}`}>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Website help chat"
          className="absolute bottom-16 right-0 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-site-accent-dark/[0.14] bg-white shadow-[0_22px_55px_rgba(42,15,2,0.18)] sm:bottom-[4.2rem]"
        >
          <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-site-primary to-site-accent-dark p-4 text-white">
            <div>
              <span className="block text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-white/80">
                Website Help
              </span>
              <strong className="mt-[0.2rem] block text-base font-bold leading-tight">
                How can we guide you?
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {!isTyping && (
            <div className="p-4">
              <p className="mb-[0.85rem] text-[0.92rem] leading-[1.55] text-site-muted">{answer}</p>
              <div className="flex flex-wrap gap-[0.45rem]">
                {suggestedQuestions.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      setQuestion(item.question);
                      setIsTyping(false);
                      answerQuestion(item.question);
                    }}
                    className="rounded-full border border-site-accent-dark/[0.14] bg-[#fff7ee] px-[0.62rem] py-[0.42rem] text-[0.78rem] font-extrabold text-site-primary"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && liveMatches.length > 0 && (
            <div className="p-4">
              <div className="flex flex-wrap gap-[0.45rem]">
                {liveMatches.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      setQuestion(item.question);
                      setIsTyping(false);
                      answerQuestion(item.question);
                    }}
                    className="rounded-full border border-site-accent-dark/[0.14] bg-[#fff7ee] px-[0.62rem] py-[0.42rem] text-[0.78rem] font-extrabold text-site-primary"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="grid grid-cols-[1fr_auto] gap-2 border-t border-site-accent-dark/[0.14] p-[0.85rem]"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={question}
              onChange={(event) => {
                const value = event.target.value;
                setQuestion(value);
                setIsTyping(value.trim().length > 0);
              }}
              placeholder="Ask about courses, payment, shop..."
              className="min-w-0 rounded-full border border-site-accent-dark/[0.14] px-[0.82rem] py-[0.62rem] text-[0.88rem] text-site-text outline-none focus:border-site-accent focus:ring-[3px] focus:ring-site-accent/[0.12]"
            />
            <button
              type="submit"
              aria-label="Ask question"
              className="flex h-[2.45rem] w-[2.45rem] items-center justify-center rounded-full border-0 bg-site-primary text-white"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          <button
            type="button"
            onClick={() => openWhatsApp(question)}
            className="flex w-full items-center justify-center gap-2 border-0 border-t border-[rgba(15,118,64,0.14)] bg-[#e9fff2] p-[0.85rem] text-sm font-extrabold text-[#0f7640]"
          >
            <i className="fab fa-whatsapp"></i>
            Continue on WhatsApp
          </button>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open help chat"
          className="flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full border border-white/[0.18] bg-site-primary text-white shadow-[0_16px_35px_rgba(42,15,2,0.28)] transition hover:-translate-y-0.5 hover:bg-[#6b3514]"
        >
          <i className="fas fa-comments"></i>
        </button>
      )}
    </div>
  );
}

export default FloatingChatAssistant;
