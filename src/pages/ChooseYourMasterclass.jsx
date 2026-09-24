import { useEffect, useRef, useState } from 'react';
import SEO from '../components/SEO';
import LazyOnView from '../components/LazyOnView';
import { WB_PAGE_NO_CTA, WB_PAGE_SHELL } from '../components/webinar/tokens';
import useMasterclassRegistration from '../hooks/useMasterclassRegistration';

import HubHero from '../components/masterclass-hub/HubHero';
import ClassSelector from '../components/masterclass-hub/ClassSelector';
import HubValueBand from '../components/masterclass-hub/HubValueBand';
import HubFaqSection from '../components/masterclass-hub/HubFaqSection';
import HubBottomCTA from '../components/masterclass-hub/HubBottomCTA';
import HubRegistrationModal from '../components/masterclass-hub/HubRegistrationModal';
import SeatReservedOverlay from '../components/masterclass-hub/SeatReservedOverlay';
import MentorSection from '../components/face-reading/MentorSection';
import DsAstroTestimonials from '../components/face-reading/DsAstroTestimonials';
import FooterMinimal from '../components/face-reading/FooterMinimal';
import { MASTERCLASSES } from '../data/masterclassHubData';

function ChooseYourMasterclass() {
  const [activeId, setActiveId] = useState(MASTERCLASSES[0].id);
  const [ctaVisible, setCtaVisible] = useState(true);
  const selectorRef = useRef(null);

  const selectedClass = MASTERCLASSES.find((mc) => mc.id === activeId) || MASTERCLASSES[0];
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    isModalOpen,
    openModal,
    closeModal: handleCloseModal,
    showSuccessModal,
  } = useMasterclassRegistration(selectedClass);

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, []);

  const scrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOpenModal = (id) => {
    if (id) setActiveId(id);
    openModal();
  };
  const handleDismissCta = () => setCtaVisible(false);
  const handleShowCta = () => setCtaVisible(true);

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

      {showSuccessModal && <SeatReservedOverlay />}
    </div>
  );
}

export default ChooseYourMasterclass;
