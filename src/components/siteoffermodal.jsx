import React, { useState } from 'react';
import { X, User, Phone, Sparkles, Gift } from 'lucide-react';

const OfferModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log('Form Submitted:', formData);
    alert(`Coupon claimed successfully for ${formData.name}!`);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-700 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Top Section: Hero Image Banner */}
        <div className="relative h-48 bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1604335399105-a0c5e5fd8521?q=80&w=600&auto=format&fit=crop" 
            alt="First Order Reward" 
            className="object-cover w-full h-full opacity-90"
          />
          {/* Badge overlapping the image bottom-left */}
          <div className="absolute bottom-4 left-6 flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9900] text-white text-xs font-bold tracking-wide uppercase rounded-full shadow-md">
            <Gift size={14} />
            First Order Reward
          </div>
        </div>

        {/* Bottom Section: Details & Form */}
        <div className="p-6 md:p-8">
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-1 px-3 py-1 mb-3 text-xs font-semibold text-[#A66E4E] bg-[#FAF3EE] rounded-full">
            <Sparkles size={12} className="text-[#A66E4E]" />
            LIMITED WELCOME COUPON
          </div>

          {/* Heading Content */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 tracking-tight leading-tight mb-2">
            Claim your first offer coupon
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Enter your details and unlock the code before scheduling your first order.
          </p>

          {/* Lead Generation Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full py-3.5 pl-12 pr-4 text-sm text-gray-900 bg-[#F4F6F9] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#009FB7] transition-all"
              />
            </div>

            {/* Mobile Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Mobile number"
                className="w-full py-3.5 pl-12 pr-4 text-sm text-gray-900 bg-[#F4F6F9] border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#009FB7] transition-all"
              />
            </div>

            {/* CTA Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 text-sm font-semibold text-white bg-[#009FB7] hover:bg-[#008398] active:scale-[0.99] rounded-2xl shadow-lg shadow-[#009FB7]/20 transition-all"
            >
              Claim your coupon
              <Sparkles size={16} />
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default OfferModal;