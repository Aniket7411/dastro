import { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const [messages, setMessages] = useState([
    { id: 1, text: 'Namaste, and welcome to DS Astro Institute! I can help with courses, consultations, kundli readings and more. What would you like to know?', sender: 'bot' }
  ]);
  
  const clearChat = () => {
    setMessages([
      { id: Date.now(), text: 'Namaste, and welcome to DS Astro Institute! I can help with courses, consultations, kundli readings and more. What would you like to know?', sender: 'bot' }
    ]);
    setIsTyping(false);
    setQuestion('');
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const shouldHide = pathname.startsWith('/admin') || pathname.startsWith('/student/course');
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

    // Add user message
    const userMsg = { id: Date.now(), text: query, sender: 'user' };
    
    // Determine bot response
    let botResponseText = '';
    const answerFromQA = matchQuestion(query);
    if (answerFromQA) {
      botResponseText = answerFromQA;
    } else {
      const lowerQuery = query.toLowerCase();
      const matched = suggestedQuestions.find((item) => item.keywords.some((keyword) => lowerQuery.includes(keyword)));
      if (matched) {
        botResponseText = matched.answer;
      }
    }
    
    if (botResponseText) {
      setMessages((prev) => [...prev, userMsg, { id: Date.now() + 1, text: botResponseText, sender: 'bot' }]);
    } else {
      setMessages((prev) => [...prev, userMsg, { 
        id: Date.now() + 1, 
        text: 'I am not fully sure about this. Please continue on WhatsApp and our team will help you directly.', 
        sender: 'bot',
        isFallback: true 
      }]);
      openWhatsApp(query);
    }
    
    setQuestion('');
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Website help chat"
            className="absolute bottom-16 right-0 flex h-[28rem] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-site-accent-dark/[0.14] bg-white shadow-[0_22px_55px_rgba(42,15,2,0.18)] sm:bottom-[4.2rem]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-br from-site-primary to-site-accent-dark p-4 text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <i className="fas fa-robot text-lg"></i>
                </div>
                <div>
                  <span className="block text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-white/80">
                    Website Help
                  </span>
                  <strong className="mt-[0.1rem] block text-[0.95rem] font-bold leading-tight">
                    How can we guide you?
                  </strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    title="Clear Chat"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-white transition hover:bg-white/20 hover:text-red-200"
                  >
                    <i className="fas fa-trash-alt text-[0.85rem]"></i>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-0 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 custom-scrollbar">
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-[0.65rem] text-[0.9rem] leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'rounded-tr-sm bg-site-primary text-white'
                          : 'rounded-tl-sm bg-white text-site-muted border border-gray-100'
                      }`}
                    >
                      {msg.text}
                      {msg.isFallback && (
                        <button
                          onClick={() => openWhatsApp(messages[messages.length - 2]?.text)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#20bd5a]"
                        >
                          <i className="fab fa-whatsapp text-sm"></i>
                          Chat on WhatsApp
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Suggestions / Live Matches */}
                {!isTyping && messages.length === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex flex-wrap gap-2">
                    {suggestedQuestions.map((item) => (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => answerQuestion(item.question)}
                        className="rounded-full border border-site-accent-dark/[0.14] bg-[#fff7ee] px-3 py-1.5 text-xs font-bold text-site-primary transition hover:bg-site-primary hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isTyping && liveMatches.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {liveMatches.map((item) => (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => answerQuestion(item.question)}
                        className="rounded-full border border-site-accent-dark/[0.14] bg-[#fff7ee] px-3 py-1.5 text-xs font-bold text-site-primary transition hover:bg-site-primary hover:text-white"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form
              className="flex shrink-0 items-center gap-2 border-t border-gray-200 bg-white p-3"
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
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-site-text outline-none transition focus:border-site-primary focus:bg-white focus:ring-[3px] focus:ring-site-primary/10"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                aria-label="Ask question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-site-primary text-white transition hover:bg-site-primary/90 disabled:opacity-50"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open help chat"
            className="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full border border-white/[0.18] bg-site-primary text-white shadow-[0_16px_35px_rgba(42,15,2,0.28)]"
          >
            <i className="fas fa-comment-dots text-xl"></i>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FloatingChatAssistant;
