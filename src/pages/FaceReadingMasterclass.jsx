import { useEffect, useState } from 'react';
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
// import TextReviewCarousel from '../components/face-reading/TextReviewCarousel';
import DsAstroTestimonials from '../components/face-reading/DsAstroTestimonials';
import FaqSection from '../components/face-reading/FaqSection';
// import FixedBottomCTA from '../components/face-reading/FixedBottomCTA';
import FuturisticBottomCTA from '../components/face-reading/FuturisticBottomCTA';
import RegistrationModal from '../components/face-reading/RegistrationModal';
import FooterMinimal from '../components/face-reading/FooterMinimal';

function FaceReadingMasterclass() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData({ ...formData, [name]: nextValue });
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
          courseName: '2-Day Face Reading Masterclass',
          amount: 499,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setShowSuccessModal(true);
        toast.success('Seat reserved. Opening payment page...');
        const query = new URLSearchParams({
          leadId: data.leadId,
          name: data.name || formData.name.trim(),
          email: data.email || formData.email.trim(),
          phone: data.phone || sanitizedPhone,
          amount: String(data.amount || '49900'),
          ref: data.leadId ? `DS-${String(data.leadId).slice(-6).toUpperCase()}` : `DS-${Date.now().toString().slice(-6)}`,
          courseName: data.courseName || '2-Day Face Reading Masterclass',
        });

        window.setTimeout(() => {
          window.location.assign(`/ds-astro-payment-page.html?${query.toString()}`);
        }, 1200);
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
  const pageBottomPad = ctaVisible ? 'pb-44 sm:pb-32' : WB_PAGE_NO_CTA;

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
          {/* <TextReviewCarousel /> */}`r`n          <DsAstroTestimonials onJoinNow={handleOpenModal} />
          <FaqSection />
      </div>

      <div className={`bg-[#2A1647] ${pageBottomPad}`}>
        <FooterMinimal />
      </div>

      {/* Old CTA retained for reference — commented out while new CTA is active */}
      {/*
      <FixedBottomCTA
        visible={ctaVisible}
        isModalOpen={isModalOpen}
        onJoinNow={handleOpenModal}
        onDismiss={handleDismissCta}
        onShow={handleShowCta}
      />
      */}

      <FuturisticBottomCTA onJoinNow={handleOpenModal} isModalOpen={isModalOpen} />

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-[360px] rounded-[18px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.32)] ring-1 ring-white/60">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <i className="fas fa-check text-xl" aria-hidden="true" />
            </div>
            <h2 className="m-0 font-heading text-[22px] font-extrabold leading-tight text-[#2A1647]">Seat Reserved</h2>
            <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-relaxed text-slate-600">
              Your details are saved. Taking you to the payment page for the final ₹499 step.
            </p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[#EE6662]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaceReadingMasterclass;
