import { useEffect, useState } from 'react';
import { ModalPortal, ModalOverlay, useModalLock } from '../modal/ModalLayer';
import { MODAL_INPUT, MODAL_LABEL } from '../modal/modalTypography';
import { WB_CTA, WB_HIGHLIGHT, TYPE } from '../webinar/tokens';
import { formatTime, getTargetTimestamp } from './FixedBottomCTA';
import PhoneInput from '../PhoneInput';

function OfferTimer() {
  const [time, setTime] = useState({ h: '02', m: '00', s: '00' });

  useEffect(() => {
    const target = getTargetTimestamp();
    const tick = () => setTime(formatTime(Math.max(0, target - Date.now())));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rounded-[10px] border border-[#F0703C]/25 bg-white/90 px-2 py-1.5 text-left shadow-[0_8px_18px_rgba(240,112,60,0.16)] sm:rounded-[12px] sm:px-3 sm:py-2">
      <p className="m-0 text-[7px] font-black uppercase tracking-[0.14em] text-[#B94A2F] sm:text-[8px] sm:tracking-[0.18em]">Offer ends in</p>
      <p className="m-0 mt-1 font-body text-[15px] font-black leading-none tracking-[0.02em] text-[#F0703C] tabular-nums sm:text-[24px] sm:tracking-tight">
        {time.h}:{time.m}:{time.s}
      </p>
    </div>
  );
}
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
          className="relative mx-2 flex max-h-[calc(100vh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.34)] ring-1 ring-white/15 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="webinar-modal-title"
        >
          <button
            type="button"
            className="absolute right-3 top-14 z-[100] flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6662] sm:right-4 sm:top-11 sm:h-10 sm:w-10"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa fa-times" aria-hidden="true" />
          </button>

          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="grid w-full grid-cols-1 md:grid-cols-[0.82fr_1.18fr] md:min-h-[252px] lg:min-h-[280px]">
              <div className="relative mt-2 h-[275px] w-full overflow-hidden rounded-t-[6px] bg-white p-2 sm:mt-0 sm:h-[310px] sm:p-3 md:order-2 md:h-auto md:rounded-t-none md:rounded-tr-[14px]">
                <img
                  src="/facereading/facereadingreview.webp"
                  alt="Damini Shukla"
                  className="h-full w-full rounded-[14px] object-contain object-center transition-transform duration-1000"
                />
              </div>

              <div className="hidden flex-col justify-center border-t border-white/10 bg-[#3B2261] px-5 py-4 text-white md:order-1 md:flex md:border-r md:border-t-0 md:border-white/10 md:px-6 md:py-5 lg:px-7 lg:py-5">
                <span className="mb-1.5 inline-flex w-fit rounded-full bg-gradient-to-r from-[#EE6662] to-[#D9534F] px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-red-500/20 sm:text-[8px]">
                  Launch Offer
                </span>
                <h4 className={`${TYPE.h2} !m-0 !text-white !leading-[1.08] text-[21px] drop-shadow-md sm:text-[24px] md:text-[28px] lg:text-[31px]`}>
                  2-Day Face Reading{' '}
                  <span className={`${WB_HIGHLIGHT} ml-1 inline-block`}>Masterclass</span>
                </h4>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTENT & FORM */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
              {/* TIMER STRIP */}
              {/* <div className="flex w-full items-center justify-center gap-3 bg-[#141118] px-4 py-3 border-b border-white/5 shrink-0 shadow-sm z-10">
                <SimpleDigitalTimer />
              </div> */}

              <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                <div className="mb-3 rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <h3 id="webinar-modal-title" className={`${TYPE.h3} mb-2 flex items-center gap-2 text-[18px] text-slate-800 sm:text-[20px]`}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B2261] text-[11px] text-white shadow-sm">
                      <i className="fas fa-ticket-alt" />
                    </span>
                    2-Day Tarot Masterclass
                  </h3>

                  <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600 sm:text-[12px]">
                    <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200"><i className="far fa-calendar-alt text-slate-400"></i> 2 Days</span>
                    <span className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200"><i className="far fa-clock text-slate-400"></i> 2 hrs/day</span>
                    <span className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 text-green-700"><i className="fas fa-video text-green-500"></i> Live on Zoom</span>
                  </div>

                  <div className="relative overflow-hidden rounded-[14px] border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-red-50 p-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] sm:p-4">
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-[#EE6662] to-[#D9534F] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                      Save ₹1,500
                    </div>
                    <div className="flex flex-row items-end justify-between gap-2 pt-3 sm:gap-4 sm:pt-2">
                      <div>
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-orange-800/70">Limited Time Offer</p>
                        <div className="flex items-end gap-3">
                          <span className="font-body text-[28px] font-black leading-none tracking-tight text-[#F0703C] sm:text-[38px]">₹500</span>
                          <span className="mb-1 text-sm font-bold text-slate-400 line-through sm:mb-1.5 sm:text-lg">₹1,999</span>
                        </div>
                      </div>
                      <div className="w-[128px] shrink-0 sm:w-auto sm:min-w-[168px]">
                        <OfferTimer />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <ul className="m-0 grid gap-1.5 p-0 sm:grid-cols-3">
                    {[
                      'Live on Zoom + Recording included',
                      'Learn the Image + Element + Number Method',
                      'Deck zaroori nahi - cards screen par dikhaye jaayenge',
                    ].map((point) => (
                      <li key={point} className={`${TYPE.bodySm} flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 !text-[12px] !leading-snug !text-slate-700 font-semibold shadow-sm`}>
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                          <i className="fa fa-check text-[10px] text-green-600" aria-hidden="true" />
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="webinar-name" className={`${MODAL_LABEL} !mb-1 !text-[11px]`}>
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
                      className={`${MODAL_INPUT} text-[15px] min-h-[44px] rounded-[10px] bg-white border-slate-200 shadow-sm focus:ring-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="webinar-email" className={`${MODAL_LABEL} !mb-1 !text-[11px]`}>
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
                      className={`${MODAL_INPUT} text-[15px] min-h-[44px] rounded-[10px] bg-white border-slate-200 shadow-sm focus:ring-2`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="webinar-phone" className={`${MODAL_LABEL} !mb-1 !text-[11px]`}>
                      Phone (WhatsApp)
                    </label>
                    <div className="relative">
                      <PhoneInput
                        id="webinar-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="Mobile Number"
                        className={`${MODAL_INPUT} text-[15px] min-h-[44px] rounded-[10px] bg-white border-slate-200 shadow-sm focus:ring-2`}
                      />
                    </div>
                  </div>

                  <div className="pt-1 sm:col-span-2">
                    <button
                      type="submit"
                      className={`${WB_CTA} w-full justify-center min-h-[48px] rounded-[10px] !text-[14px] shadow-lg shadow-red-500/25 transition-transform hover:-translate-y-1`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Registration - ₹500'}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1 pt-0.5 text-center text-slate-500 sm:col-span-2">
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
                      Need help? WhatsApp 9005575577
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
