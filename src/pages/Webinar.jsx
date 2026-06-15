import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

import LogoCarousel from '../components/webinar/LogoCarousel';
import NewsCarousel from '../components/webinar/NewsCarousel';
import PictureGallery from '../components/webinar/PictureGallery';
import VideoReviewCarousel from '../components/webinar/VideoReviewCarousel';
import TextReviewCarousel from '../components/webinar/TextReviewCarousel';

import HeroSection from '../components/webinar/HeroSection';
import WhySection from '../components/webinar/WhySection';
import PatternsSection from '../components/webinar/PatternsSection';
import LearnSection from '../components/webinar/LearnSection';
import MentorSection from '../components/webinar/MentorSection';
import ItinerarySection from '../components/webinar/ItinerarySection';
import FaqSection from '../components/webinar/FaqSection';
import FixedBottomCTA from '../components/webinar/FixedBottomCTA';
import RegistrationModal from '../components/webinar/RegistrationModal';
import TailwindPage from '../components/layout/TailwindPage';
import { WB_PAGE } from '../components/webinar/tokens';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

function Webinar() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({ duration: 1000, once: true });
    }

    const timerKey = 'webinar_timer_v4';
    let endTime = localStorage.getItem(timerKey);

    if (!endTime) {
      endTime = String(new Date().getTime() + 24 * 60 * 60 * 1000);
      localStorage.setItem(timerKey, endTime);
    } else {
      endTime = String(parseInt(endTime, 10));
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(endTime, 10) - now;

      if (distance < 0) {
        const newEnd = String(new Date().getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem(timerKey, newEnd);
        endTime = newEnd;
      }
    }, 1000);

    return () => clearInterval(interval);
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
          type: 'Webinar',
          courseName: '2-Day Mega Astrology Webinar',
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

  return (
    <TailwindPage className={WB_PAGE}>
      <HeroSection onJoinNow={handleOpenModal} />
      <LogoCarousel />
      <NewsCarousel />
      <WhySection onJoinNow={handleOpenModal} />
      <PictureGallery />
      <PatternsSection onJoinNow={handleOpenModal} />
      <LearnSection onJoinNow={handleOpenModal} />
      <VideoReviewCarousel />
      <TextReviewCarousel />
      <MentorSection onJoinNow={handleOpenModal} />
      <ItinerarySection />
      <FaqSection />
      <FixedBottomCTA onJoinNow={handleOpenModal} />
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </TailwindPage>
  );
}

export default Webinar;
