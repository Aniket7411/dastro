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
            className="absolute right-3 top-3 sm:right-4 sm:top-4 z-[100] flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white text-slate-900 shadow-md transition hover:bg-slate-100 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6662]"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>

          <div className="flex h-full min-h-0 flex-col md:flex-row overflow-hidden">
            {/* LEFT COLUMN: HERO IMAGE & TITLE */}
            <div className="relative w-full md:w-[45%] bg-[#3B2261] overflow-hidden shrink-0 flex flex-row md:flex-col items-center md:items-stretch md:justify-end group p-5 md:p-0">

              {/* IMAGE WRAPPER */}
              <div className="relative w-[45%] sm:w-[38%] md:w-full aspect-[3/4] md:aspect-auto md:absolute md:inset-0 rounded-xl md:rounded-none overflow-hidden shrink-0 shadow-2xl md:shadow-none border-2 border-white/15 md:border-none bg-[#2a1845]">
                <img
                  src="/images/damini-new.webp"
                  alt="Damini Shukla"
                  className="absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-[#1a0f2e]/60 to-transparent z-[1]" />
              </div>

              {/* TITLE WRAPPER */}
              <div className="relative z-[2] flex-1 pl-4 md:pl-0 md:p-6 lg:p-8 text-white md:mt-auto">
                <span className="mb-2 md:mb-3 inline-block rounded-full bg-gradient-to-r from-[#EE6662] to-[#D9534F] px-2.5 py-1 md:px-3.5 md:py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/20">
                  Launch Offer
                </span>
                <h4 className={`${TYPE.h2} !text-white !leading-tight text-[18px] sm:text-[22px] md:text-[28px] lg:text-[34px] drop-shadow-md`}>
                  2-Day Face Reading <br className="hidden md:block" />
                  <span className={WB_HIGHLIGHT}>Masterclass</span>
                </h4>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTENT & FORM */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-50 relative">
              {/* TIMER STRIP */}
              {/* <div className="flex w-full items-center justify-center gap-3 bg-[#141118] px-4 py-3 border-b border-white/5 shrink-0 shadow-sm z-10">
                <SimpleDigitalTimer />
              </div> */}

              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="mb-2 border-b border-slate-200 pb-2">
                  <h3 id="webinar-modal-title" className={`${TYPE.h3} mb-3 text-slate-800 flex items-center gap-2.5`}>
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#3B2261] text-white text-[11px] shadow-sm">
                      <i className="fas fa-ticket-alt" />
                    </span>
                    Reserve Your Seat
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-600 mb-5">
                    <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200"><i className="far fa-calendar-alt text-slate-400"></i> 2 Days</span>
                    <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200"><i className="far fa-clock text-slate-400"></i> 2 hrs/day</span>
                    <span className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 text-green-700"><i className="fas fa-video text-green-500"></i> Live on Zoom</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-50/80 to-red-50/80 border border-orange-100/60 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#EE6662] to-[#D9534F] text-white text-[9px] font-black px-3 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
                      Save ₹1,500
                    </div>
                    <p className="text-[11px] font-bold text-orange-800/70 mb-1 uppercase tracking-wider">Limited Time Offer</p>
                    <div className="flex items-end gap-3">
                      <span className="font-body text-[36px] sm:text-[40px] font-black leading-none text-[#F0703C] tracking-tight">₹499</span>
                      <span className="text-slate-400 line-through mb-1.5 font-bold text-lg">₹1,999</span>
                    </div>
                  </div>
                </div>

                <div className="mb-7">
                  <ul className="m-0 space-y-3.5 p-0">
                    {[
                      'Live on Zoom + Recording included',
                      'Learn the 160+ Snapshot Technique',
                      'No prior astrology knowledge needed',
                    ].map((point) => (
                      <li key={point} className={`${TYPE.bodySm} flex items-start gap-3 !text-slate-700 font-semibold`}>
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <i className="fa fa-check text-[10px] text-green-600" aria-hidden="true" />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
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
                      className={`${MODAL_INPUT} text-[16px] min-h-[52px] rounded-[12px] bg-white border-slate-200 shadow-sm focus:ring-2`}
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
                      className={`${MODAL_INPUT} text-[16px] min-h-[52px] rounded-[12px] bg-white border-slate-200 shadow-sm focus:ring-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="webinar-phone" className={MODAL_LABEL}>
                      Phone (WhatsApp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-200 pr-2">
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
                        className={`${MODAL_INPUT} text-[16px] min-h-[52px] rounded-[12px] bg-white border-slate-200 shadow-sm !pl-[60px] focus:ring-2`}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`${WB_CTA} w-full justify-center min-h-[56px] rounded-[12px] !text-[16px] shadow-lg shadow-red-500/25 transition-transform hover:-translate-y-1`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Registration - ₹499'}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 pt-2 text-center text-slate-500">
                    <p className="m-0 text-[11px] font-bold flex items-center gap-1.5 text-slate-400">
                      <i className="fas fa-lock" aria-hidden="true" />
                      Secured by Razorpay · UPI, cards
                    </p>
                    <p className="m-0 text-[11px] font-medium text-slate-600 mt-1">
                      Batch dates & Zoom link on WhatsApp right after registration
                    </p>
                    <a
                      href="https://wa.me/919005575577"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-0 text-[11px] font-bold text-green-600 hover:underline hover:text-green-700 mt-1 transition-colors"
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
