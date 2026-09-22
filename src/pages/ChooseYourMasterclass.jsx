import { useEffect, useRef, useState } from 'react';
import toast from '../utils/toast';
import API_BASE from '../utils/api';
import SEO from '../components/SEO';
import LazyOnView from '../components/LazyOnView';
import { WB_PAGE_NO_CTA, WB_PAGE_SHELL } from '../components/webinar/tokens';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

import HubHero from '../components/masterclass-hub/HubHero';
import ClassSelector from '../components/masterclass-hub/ClassSelector';
import HubValueBand from '../components/masterclass-hub/HubValueBand';
import HubFaqSection from '../components/masterclass-hub/HubFaqSection';
import HubBottomCTA from '../components/masterclass-hub/HubBottomCTA';
import HubRegistrationModal from '../components/masterclass-hub/HubRegistrationModal';
import MentorSection from '../components/face-reading/MentorSection';
import DsAstroTestimonials from '../components/face-reading/DsAstroTestimonials';
import FooterMinimal from '../components/face-reading/FooterMinimal';
import { MASTERCLASSES } from '../data/masterclassHubData';

function ChooseYourMasterclass() {
  const [activeId, setActiveId] = useState(MASTERCLASSES[0].id);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  const selectorRef = useRef(null);

  const selectedClass = MASTERCLASSES.find((mc) => mc.id === activeId) || MASTERCLASSES[0];

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, []);

  const scrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData({ ...formData, [name]: nextValue });
  };

  const handleOpenModal = (id) => {
    if (id) setActiveId(id);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleDismissCta = () => setCtaVisible(false);
  const handleShowCta = () => setCtaVisible(true);

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
          city: formData.city.trim(),
          type: 'Webinar',
          courseName: selectedClass.courseName,
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
          city: data.city || formData.city.trim(),
          amount: String(data.amount || '49900'),
          ref: data.leadId ? `DS-${String(data.leadId).slice(-6).toUpperCase()}` : `DS-${Date.now().toString().slice(-6)}`,
          courseName: data.courseName || selectedClass.courseName,
        });

        window.setTimeout(() => {
          window.location.assign(`/${selectedClass.paymentPage}?${query.toString()}`);
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

  const pageBottomPad = ctaVisible ? 'pb-44 sm:pb-32' : WB_PAGE_NO_CTA;

  return (
    <div className={`${WB_PAGE_SHELL} flex flex-col min-h-screen bg-slate-50`}>
      <SEO
        title="Choose Your Masterclass — Tarot, Vedic Astrology, Numerology, Handwriting & Face Reading | DS Astro Institute"
        description="5 live 2-day masterclasses with Damini Shukla — Tarot, Vedic Astrology, Vedic Numerology, Handwriting & Signature, Face Reading. Pick yours for ₹499. Recording + notes included."
        url="/choose-your-masterclass"
      />

      <div className="flex-grow">
        <HubHero activeId={activeId} onSelect={setActiveId} onJoinNow={handleOpenModal} onExplore={scrollToSelector} />
        <ClassSelector
          activeId={activeId}
          onSelect={setActiveId}
          onJoinNow={handleOpenModal}
          panelRef={selectorRef}
        />
        <HubValueBand />
        <MentorSection onJoinNow={() => handleOpenModal()} />
        <LazyOnView minHeight="600px">
          <DsAstroTestimonials onJoinNow={() => handleOpenModal()} />
        </LazyOnView>
        <HubFaqSection />
      </div>

      <div className={`bg-[#2A1647] ${pageBottomPad}`}>
        <FooterMinimal />
      </div>

      <HubBottomCTA
        onJoinNow={() => handleOpenModal()}
        isModalOpen={isModalOpen}
        activeTitle={`Join ${selectedClass.title} Masterclass`}
        visible={ctaVisible}
        onDismiss={handleDismissCta}
        onShow={handleShowCta}
      />

      <HubRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedClass={selectedClass}
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

export default ChooseYourMasterclass;
