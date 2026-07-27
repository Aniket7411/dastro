import { ModalPortal, ModalOverlay, useModalLock } from '../modal/ModalLayer';
import { MODAL_INPUT, MODAL_LABEL } from '../modal/modalTypography';
import { WB_CTA, WB_HIGHLIGHT, TYPE } from '../webinar/tokens';
import { SimpleDigitalTimer } from './FixedBottomCTA';

function RegistrationModal({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
}) {
  useModalLock(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <ModalPortal open={isOpen}>
      <ModalOverlay onClose={onClose} className="!items-center !p-3 sm:!p-4">
        <div
          className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="webinar-modal-title"
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border-0 bg-black/10 text-xl text-slate-700 transition hover:bg-black/20"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>

          <div className="overflow-y-auto">
            {/* HERO BAND */}
            <div className="relative h-[140px] w-full sm:h-[170px] bg-[#3B2261] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a1845] to-[#3B2261]/80 z-[1]" />
              <img 
                src="/images/masterclass-hero.webp" 
                alt="Damini Shukla" 
                className="absolute right-0 top-0 h-full w-[60%] object-cover object-right-top opacity-90 sm:w-[50%]"
                width="400"
                height="170"
              />
              <div className="absolute left-0 top-0 flex h-full w-2/3 flex-col justify-center p-5 z-[2] sm:p-6">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#EE6662] sm:text-xs">
                  Launch Offer
                </span>
                <h4 className={`${TYPE.h2} !text-white !leading-tight`}>
                  2-Day Face Reading <br className="hidden sm:block"/>
                  <span className={WB_HIGHLIGHT}>Masterclass</span>
                </h4>
              </div>
            </div>

            {/* MIRRORED TIMER STRIP */}
            <div className="flex w-full items-center justify-center gap-3 bg-[#141118] px-4 py-2 border-b border-white/5">
              <SimpleDigitalTimer />
            </div>

            <div className="grid md:grid-cols-2">
              <div className="bg-slate-50 p-6 sm:p-8 hidden md:block">
                <div className="mb-5">
                  <h3 id="webinar-modal-title" className={`${TYPE.h3} mb-1`}>
                    Reserve Your Seat
                  </h3>
                  <p className={TYPE.bodySm}>2 Days · 2 hrs/day · Live on Zoom</p>
                </div>
                
                <div className="mb-6 flex items-end gap-2">
                  <span className="font-body text-3xl font-black text-[#F0703C]">₹499</span>
                  <span className="text-slate-400 line-through mb-1">₹1,999</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EE6662] mb-1.5 ml-1">Launch Offer</span>
                </div>

                <ul className="m-0 space-y-3 p-0">
                  {[
                    'Live on Zoom + Recording included',
                    'Learn the 160+ Snapshot Technique',
                    'No prior astrology knowledge needed',
                  ].map((point) => (
                    <li key={point} className={`${TYPE.bodySm} flex items-start gap-2.5 !text-slate-700 font-medium`}>
                      <i className="fa fa-check-circle shrink-0 text-[15px] text-[#EE6662] pt-[2px]" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 sm:p-6 bg-white">
                <div className="mb-5 md:hidden">
                  <h3 id="webinar-modal-title" className={`${TYPE.h3} mb-1`}>
                    Reserve Your Seat
                  </h3>
                  <p className={`${TYPE.bodySm} mb-3`}>2 Days · 2 hrs/day · Live on Zoom</p>
                  <div className="flex items-end gap-2">
                    <span className="font-body text-2xl font-black text-[#F0703C]">₹499</span>
                    <span className="text-slate-400 line-through mb-0.5">₹1,999</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="webinar-name" className={MODAL_LABEL}>
                      Full Name
                    </label>
                    <input
                      id="webinar-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Enter Your Full Name"
                      className={`${MODAL_INPUT} text-[16px] min-h-[48px] rounded-[12px] focus:ring-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="webinar-email" className={MODAL_LABEL}>
                      Email Address
                    </label>
                    <input
                      id="webinar-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter Your Best Email"
                      className={`${MODAL_INPUT} text-[16px] min-h-[48px] rounded-[12px] focus:ring-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="webinar-phone" className={MODAL_LABEL}>
                      Phone (WhatsApp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                        +91
                      </span>
                      <input
                        id="webinar-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="10-Digit Mobile Number"
                        className={`${MODAL_INPUT} text-[16px] min-h-[48px] rounded-[12px] pl-11 focus:ring-2`}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`${WB_CTA} w-full justify-center min-h-[48px] rounded-[12px] !text-[15px]`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Registration - ₹499'}
                  </button>
                  <div className="flex flex-col items-center gap-1.5 pt-1 text-center text-slate-500">
                    <p className="m-0 text-[11px] font-medium flex items-center gap-1.5">
                      <i className="fas fa-lock" aria-hidden="true" />
                      Secured by Razorpay · UPI, cards
                    </p>
                    <p className="m-0 text-[11px] font-medium text-slate-600">
                      Batch dates & Zoom link on WhatsApp right after registration
                    </p>
                    <a 
                      href="https://wa.me/919005575577"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="m-0 text-[11px] font-medium text-green-600 hover:underline mt-1"
                    >
                      Need help? WhatsApp +91 90055 75577
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}

export default RegistrationModal;
