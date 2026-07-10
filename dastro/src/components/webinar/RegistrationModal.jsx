import { ModalPortal, ModalOverlay, useModalLock } from '../modal/ModalLayer';
import { MODAL_INPUT, MODAL_LABEL } from '../modal/modalTypography';
import { WB_CTA, WB_CTA_FREE, WB_HIGHLIGHT, TYPE } from './tokens';

function RegistrationModal({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  onJoinFree,
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
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-[#3B2261] to-[#2a1845] p-6 text-white sm:p-8">
                <h4 className={`${TYPE.h2} mb-3 !text-white`}>
                  Join the <br />
                  <span className={WB_HIGHLIGHT}>Masterclass</span>
                </h4>
                <p className={`${TYPE.bodySmOnDark} mb-5`}>
                  Unlock your cosmic potential with India&apos;s leading astrology mentor.
                </p>
                <ul className="m-0 space-y-2.5 p-0">
                  {[
                    '2 Days Live Training',
                    'Practical Reading Skills',
                    'Q&A with DS Astrology mentors',
                  ].map((point) => (
                    <li key={point} className={`${TYPE.bodySmOnDark} flex items-center gap-2.5`}>
                      <i className="fa fa-check-circle shrink-0 text-sm text-[#EE6662]" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5">
                  <h3 id="webinar-modal-title" className={`${TYPE.h3} mb-1`}>
                    Reserve Your Seat
                  </h3>
                  <p className={TYPE.bodySm}>Limited Seats Available at ₹99/-</p>
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
                      placeholder="Enter Your Full Name"
                      className={MODAL_INPUT}
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
                      placeholder="Enter Your Best Email"
                      className={MODAL_INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor="webinar-phone" className={MODAL_LABEL}>
                      Phone Number
                    </label>
                    <input
                      id="webinar-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10-Digit Mobile Number"
                      className={MODAL_INPUT}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${WB_CTA} w-full justify-center`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Registration'}
                  </button>
                  <p className={`${TYPE.caption} text-center !normal-case !tracking-normal`}>
                    <i className="fas fa-lock mr-1.5" aria-hidden="true" />
                    Secured by Razorpay
                  </p>
                  {onJoinFree ? (
                    <div className="border-t border-slate-100 pt-3 text-center">
                      <p className={`${TYPE.bodySm} !mb-2`}>Not ready to pay ₹99?</p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onJoinFree();
                        }}
                        className={`${WB_CTA_FREE} w-full justify-center`}
                      >
                        Want to join free webinar?
                      </button>
                    </div>
                  ) : null}
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
