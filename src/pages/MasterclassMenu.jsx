import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HubRegistrationModal from '../components/masterclass-hub/HubRegistrationModal';
import SeatReservedOverlay from '../components/masterclass-hub/SeatReservedOverlay';
import useMasterclassRegistration from '../hooks/useMasterclassRegistration';
import { MASTERCLASSES, MENU_ORDER } from '../data/masterclassHubData';

const PRICE = '₹499';
const HELP_NUMBER = '+91 90055 75577';
const HELP_LINK = 'https://wa.me/919005575577';

const MENU_CLASSES = MENU_ORDER.map((id) => MASTERCLASSES.find((mc) => mc.id === id)).filter(Boolean);

function MenuCard({ mc, index, onBook }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#E3D9C9] bg-white">
      <div className="aspect-video w-full border-b border-[#E3D9C9] bg-[#F1E8D9]">
        <img
          src={mc.image}
          alt={`${mc.title} live masterclass`}
          width="1920"
          height="1080"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-grow flex-col gap-2.5 p-[18px] lg:gap-3 lg:p-6">
        <div className="text-[10px] font-semibold tracking-[0.14em] text-[#8A4B22] lg:text-[11px]">
          {mc.menu.label}
          <span className="lg:hidden"> · {PRICE}</span>
        </div>
        <h2 className="m-0 font-heading text-[19px] font-semibold leading-[1.28] text-[#1F1A16] lg:text-[21px]">
          {mc.menu.title}
        </h2>
        <p className="m-0 text-sm leading-normal text-[#4A4038]">{mc.menu.description}</p>
        <div className="hidden flex-wrap gap-2 text-xs text-[#3A302A] lg:flex">
          {['2 din', '2 ghante roz', PRICE].map((chip) => (
            <span key={chip} className="rounded-full bg-[#F6F0E6] px-2.5 py-[5px]">{chip}</span>
          ))}
        </div>
        <div className="mt-auto flex gap-2.5 pt-1 lg:pt-1.5">
          <button
            type="button"
            onClick={() => onBook(mc.id)}
            className="flex h-[46px] flex-grow items-center justify-center rounded-lg bg-[#8A4B22] text-sm font-semibold text-white transition-colors hover:bg-[#6E3A19] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A4B22]"
          >
            {PRICE} mein book karein
          </button>
          <Link
            to={mc.detailsPath}
            className="flex h-[46px] items-center justify-center rounded-lg border border-[#C9B99F] px-3.5 text-sm font-semibold text-[#3A302A] transition-colors hover:border-[#8A4B22] hover:text-[#8A4B22] lg:px-4"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function MasterclassMenu() {
  const [selectedId, setSelectedId] = useState(MENU_CLASSES[0].id);
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

  const handleBook = (id) => {
    setSelectedId(id);
    openModal();
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] font-body text-[#1F1A16]">
      <SEO
        title="Live Masterclasses — Face Reading, Handwriting, Kundli, Tarot & Numerology | DS Astro Institute"
        description={`Live 2-day masterclasses with Damini Ma'am on Zoom — Face Reading, Handwriting & Signature, Vedic Astrology, Tarot and Numerology. ${PRICE} each, recording included.`}
        url="/masterclasses"
      />

      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-7 pt-6 lg:gap-10 lg:px-20 lg:pb-14 lg:pt-12">
        <header className="flex items-center justify-between border-b border-[#E3D9C9] pb-3.5 lg:pb-5">
          <Link to="/" className="flex items-center gap-2.5 lg:gap-3.5">
            <img src="/dsnewlogo.png" alt="" width="44" height="44" className="h-9 w-9 object-contain lg:h-11 lg:w-11" />
            <span className="font-heading text-[15px] font-semibold tracking-[0.02em] text-[#1F1A16] lg:text-[17px]">
              DS Astro Institute
            </span>
          </Link>
          <div className="flex items-center gap-7 text-sm text-[#4A4038]">
            <span className="hidden lg:inline">Live on Zoom · Recording included</span>
            <a
              href={HELP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-[#8A4B22] hover:text-[#6E3A19] lg:text-sm"
            >
              <span className="lg:hidden">Help</span>
              <span className="hidden lg:inline">Help: {HELP_NUMBER}</span>
            </a>
          </div>
        </header>

        <section className="flex max-w-[900px] flex-col gap-3 lg:gap-4">
          <div className="text-[11px] font-semibold tracking-[0.14em] text-[#8A4B22] lg:text-xs">
            LIVE MASTERCLASS · {PRICE}
          </div>
          <h1 className="m-0 font-heading text-[31px] font-bold leading-[1.15] text-[#1F1A16] lg:text-[50px] lg:leading-[1.12]">
            Aap kaun si Live Masterclass <br className="hidden lg:block" />
            join karna chahte hain?
          </h1>
          <p className="m-0 hidden text-lg leading-[1.55] text-[#4A4038] lg:block">
            {MENU_CLASSES.length} subjects, har masterclass sirf {PRICE} mein — 2 din, 2 ghante roz, Damini Ma'am ke saath
            live. Apna subject choose kijiye aur seedha uske page par jaaiye.
          </p>
          <p className="m-0 text-[15px] leading-[1.55] text-[#4A4038] lg:hidden">
            {MENU_CLASSES.length} subjects · har masterclass {PRICE} · 2 din · 2 ghante roz · live on Zoom, recording included.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {MENU_CLASSES.map((mc, i) => (
            <MenuCard key={mc.id} mc={mc} index={i} onBook={handleBook} />
          ))}
        </section>

        <footer className="flex flex-col gap-2 border-t border-[#E3D9C9] pt-[18px] text-[13px] leading-normal text-[#4A4038] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pt-[22px] lg:text-sm">
          <span>
            Har masterclass live hoti hai aur recording bhi milti hai. Batch ki date aur time payment ke baad share ki
            jaati hai.
          </span>
          <span className="font-semibold text-[#3A302A] lg:shrink-0">
            Sawaal hai? Call ya WhatsApp:{' '}
            <a href={HELP_LINK} target="_blank" rel="noopener noreferrer" className="text-[#8A4B22] hover:text-[#6E3A19]">
              {HELP_NUMBER}
            </a>
          </span>
        </footer>
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

      {showSuccessModal && <SeatReservedOverlay />}
    </div>
  );
}

export default MasterclassMenu;
