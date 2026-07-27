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
          className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl mx-2 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="webinar-modal-title"
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/95 text-slate-900 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6662]"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>

          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            {/* HERO BAND */}
            <div className="relative w-full bg-[#3B2261] overflow-hidden rounded-t-2xl sm:h-[170px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a1845] via-[#2a1845]/60 to-transparent" />
              <div className="relative z-[2] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full overflow-hidden sm:w-[40%]">
                  <img
                    src="/images/damini.webp"
                    alt="Damini Shukla"
                    className="h-[180px] w-full object-cover object-right-top sm:h-full"
                    width="400"
                    height="170"
                  />
                </div>
                <div className="flex min-w-[0] flex-1 flex-col justify-center px-4 py-4 sm:px-6 sm:py-4 text-white">
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#EE6662] sm:text-xs">
                    Launch Offer
                  </span>
                  <h4 className={`${TYPE.h2} !text-white !leading-tight`}>
                    2-Day Face Reading <br className="block sm:hidden" />
                    <span className={WB_HIGHLIGHT}>Masterclass</span>
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
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
                          className={`${MODAL_INPUT} text-[16px] min-h-[48px] rounded-[12px] !pl-11 focus:ring-2`}
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
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}

export default RegistrationModal;
