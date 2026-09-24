import { useEffect, useRef, useState } from 'react';
import SEO from '../components/SEO';
import LazyOnView from '../components/LazyOnView';
import HubRegistrationModal from '../components/masterclass-hub/HubRegistrationModal';
import HubFaqSection from '../components/masterclass-hub/HubFaqSection';
import SeatReservedOverlay from '../components/masterclass-hub/SeatReservedOverlay';
import MentorSection from '../components/face-reading/MentorSection';
import DsAstroTestimonials from '../components/face-reading/DsAstroTestimonials';
import FooterMinimal from '../components/face-reading/FooterMinimal';
import MenuNavbar from '../components/masterclass-menu/MenuNavbar';
import MenuHero from '../components/masterclass-menu/MenuHero';
import MenuCard from '../components/masterclass-menu/MenuCard';
import MenuJourney from '../components/masterclass-menu/MenuJourney';
import MenuFinalCta from '../components/masterclass-menu/MenuFinalCta';
import useReveal from '../components/masterclass-menu/useReveal';
import WhatsAppFab from '../components/masterclass-menu/WhatsAppFab';
import { MENU_CSS, PRICE, cardAnchor } from '../components/masterclass-menu/menuTheme';
import useMasterclassRegistration from '../hooks/useMasterclassRegistration';
import { MASTERCLASSES, MENU_ORDER } from '../data/masterclassHubData';

const MENU_CLASSES = MENU_ORDER.map((id) => MASTERCLASSES.find((mc) => mc.id === id)).filter(Boolean);

/** Centre an incomplete last row: 2 columns on tablet/laptop, 3 on wide desktop. */
function cardPlacement(index, total) {
  const isLast = index === total - 1;
  const classes = [];
  if (total % 2 === 1 && isLast) classes.push('md:col-start-2');
  if (total % 3 === 1 && isLast) classes.push('xl:col-start-3');
  else if (total % 3 === 2 && index === total - 2) classes.push('xl:col-start-2');
  else if (total % 2 === 1 && isLast) classes.push('xl:col-start-auto');
  return classes.join(' ');
}

function MasterclassMenu() {
  const [selectedId, setSelectedId] = useState(MENU_CLASSES[0].id);
  const [highlightId, setHighlightId] = useState(null);
  const cardsRef = useRef(null);
  const highlightTimer = useRef(null);
  const revealRef = useReveal();

  const selectedClass = MENU_CLASSES.find((mc) => mc.id === selectedId) || MENU_CLASSES[0];
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    isModalOpen,
    openModal,
    closeModal,
    showSuccessModal,
  } = useMasterclassRegistration(selectedClass);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  const handleBook = (id) => {
    setSelectedId(id);
    openModal();
  };

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickSubject = (id) => {
    const card = document.getElementById(cardAnchor(id));
    if (!card) return;
    card.setAttribute('data-in', '');
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Restart the glow even when the same subject is picked twice in a row.
    setHighlightId(null);
    window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => {
      setHighlightId(id);
      highlightTimer.current = window.setTimeout(() => setHighlightId(null), 2400);
    }, 450);
  };

  return (
    <div ref={revealRef} className="tw-page min-h-screen overflow-x-clip bg-[#FAF6EE] font-body text-[#1F1A16]">
      <style>{MENU_CSS}</style>
      <SEO
        title="Live Masterclasses — Face Reading, Handwriting, Kundli, Tarot & Numerology | DS Astro Institute"
        description={`Live 2-day masterclasses with Damini Ma'am on Zoom — Face Reading, Handwriting & Signature, Vedic Astrology, Tarot and Numerology. ${PRICE} each, recording included.`}
        url="/masterclasses"
      />

      <MenuNavbar classes={MENU_CLASSES} />

      <MenuHero classes={MENU_CLASSES} onPick={pickSubject} onExplore={scrollToCards} />

      <section ref={cardsRef} className="scroll-mt-4 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="mcm-reveal mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[#EE6662] sm:text-xs">
              {MENU_CLASSES.length} SUBJECTS · 1 MENTOR · 2 DIN
            </p>
            <h2 className="m-0 mt-3 font-heading text-[28px] font-bold leading-tight text-[#1F1A16] sm:text-[40px]">
              Apni <span className="text-[#EE6662]">masterclass</span> chuniye
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#5A4E44] sm:text-[16px]">
              Har card par ek click — book karein ya pehle details dekhein.
            </p>
          </div>

          <div className="mx-auto grid max-w-[460px] grid-cols-1 gap-[20px] md:max-w-none md:grid-cols-4 md:gap-[24px] xl:grid-cols-6 xl:gap-[28px]">
            {MENU_CLASSES.map((mc, i) => (
              <div key={mc.id} className={`flex md:col-span-2 ${cardPlacement(i, MENU_CLASSES.length)}`}>
                <MenuCard mc={mc} index={i} highlighted={highlightId === mc.id} onBook={handleBook} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MenuJourney />

      <div className="bg-slate-50 pt-6 sm:pt-8">
        <MentorSection />
      </div>

      <LazyOnView minHeight="600px">
        <DsAstroTestimonials onJoinNow={scrollToCards} />
      </LazyOnView>

      <HubFaqSection />

      <MenuFinalCta onExplore={scrollToCards} />

      <div className="bg-[#2A1647]">
        <FooterMinimal />
      </div>

      <HubRegistrationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedClass={selectedClass}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <WhatsAppFab hidden={isModalOpen || showSuccessModal} />

      {showSuccessModal && <SeatReservedOverlay />}
    </div>
  );
}

export default MasterclassMenu;
