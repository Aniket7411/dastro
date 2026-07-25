import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from '../utils/toast';
import API_BASE from '../utils/api';
import SEO from '../components/SEO';
import { WB_PAGE, WB_PAGE_NO_CTA, WB_PAGE_SHELL } from '../components/webinar/tokens';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

import HeroSection from '../components/face-reading/HeroSection';
import WhySection from '../components/face-reading/WhySection';
import PatternsSection from '../components/face-reading/PatternsSection';
import LearnSection from '../components/face-reading/LearnSection';
import WhoIsThisForSection from '../components/face-reading/WhoIsThisForSection';
import ItinerarySection from '../components/face-reading/ItinerarySection';
import MentorSection from '../components/face-reading/MentorSection';
import TextReviewCarousel from '../components/face-reading/TextReviewCarousel';
import FaqSection from '../components/face-reading/FaqSection';
import FixedBottomCTA from '../components/face-reading/FixedBottomCTA';
import RegistrationModal from '../components/face-reading/RegistrationModal';
import FooterMinimal from '../components/face-reading/FooterMinimal';

function FaceReadingMasterclass() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type: 'Masterclass', // Different type
          courseName: '2-Day Face Reading Masterclass',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Registration initiated. Redirecting to secure payment...');
        setIsModalOpen(false);
        navigate(
          `/payment?leadId=${data.leadId}&name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}&phone=${data.phone}&amount=${data.amount}&orderId=${data.orderId}&keyId=${data.keyId}`,
        );
      } else {
        toast.error(data.error || data.message || 'Failed to initiate registration. Please try again.');
      }
    } catch (err) {
      toast.error(`Connection Error: Unable to reach server. ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDismissCta = () => setCtaVisible(false);
  const handleShowCta = () => setCtaVisible(true);

  // We add pageBottomPad so the sticky CTA doesn't cover footer content
  const pageBottomPad = ctaVisible ? WB_PAGE : WB_PAGE_NO_CTA;

  return (
    <div className={`${WB_PAGE_SHELL} flex flex-col min-h-screen bg-slate-50`}>
      <SEO
        title="2-Day Face Reading Masterclass by Damini Shukla — Live on Zoom | ₹499"
        description="Learn to decode anyone’s personality through their face. 2-day live face reading masterclass (Samudrika Shastra) with Damini Shukla — 1 & 2 Aug, 6–8 PM. Recording included. Enroll for ₹499."
        url="/face-reading-masterclass"
      />
      
      {/* Main Content Area */}
      <div className="flex-grow">
          <HeroSection onJoinNow={handleOpenModal} />
          <WhySection onJoinNow={handleOpenModal} />
          <PatternsSection onJoinNow={handleOpenModal} />
          <LearnSection onJoinNow={handleOpenModal} />
          <WhoIsThisForSection />
          <ItinerarySection />
          <MentorSection onJoinNow={handleOpenModal} />
          <TextReviewCarousel />
          <FaqSection />
      </div>

      <div className={`bg-[#2A1647] ${pageBottomPad}`}>
        <FooterMinimal />
      </div>

      <FixedBottomCTA
        visible={ctaVisible}
        onJoinNow={handleOpenModal}
        onDismiss={handleDismissCta}
        onShow={handleShowCta}
      />

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default FaceReadingMasterclass;
