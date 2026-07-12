import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { matchQuestion } from '../../data/chatQA';
import { WHATSAPP_NUMBER } from '../../utils/contactInfo';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste, and welcome to DS Astro Institute! I can help with courses, consultations, kundli readings and more. What would you like to know?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInputValue("");
    
    const answer = matchQuestion(userMsg);
    
    setTimeout(() => {
      if (answer) {
        setMessages(prev => [...prev, { text: answer, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "I'm not sure about that. Let me connect you to our team on WhatsApp!", 
          sender: 'bot' 
        }]);
        
        setTimeout(() => {
          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(userMsg)}`;
          window.open(url, '_blank');
        }, 1500);
      }
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-site-accent/20 flex flex-col">
          <div className="bg-gradient-to-r from-site-primary to-site-accent-dark text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg m-0">Website Help</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-white/80 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="h-[350px] overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-site-primary text-white self-end rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-sm shadow-sm'}`}>
                <p className="text-sm leading-relaxed m-0">{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-site-primary/30"
            />
            <button 
              onClick={handleSend}
              className="bg-site-primary text-white p-2.5 rounded-full hover:bg-site-primary/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-site-primary to-site-accent-dark text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
