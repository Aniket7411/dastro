import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Info,
  Phone,
  Shield,
  Sparkles,
} from 'lucide-react';
import toast from '@/utils/toast';
import ConsultationModal from '../components/ConsultationModal';
import SuccessModal from '../components/SuccessModal';
import SEO from '../components/SEO';
import { OverlayLoader } from '../components/PageLoader';
import { PAGE, PAGE_WRAP, TYPE, BTN } from '../components/consultation/tokens';
import { useConsultationService } from '../utils/consultationApi';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import {
  BOOKING_MODES,
  submitConsultationBooking,
  fetchConsultationPaymentConfig,
  getEmptyConsultationForm,
} from '../utils/consultationBooking';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

const BADGE_STYLES = {
  purple: 'border-violet-200 bg-violet-50 text-violet-800',
  pink: 'border-rose-200 bg-rose-50 text-rose-800',
  orange: 'border-amber-200 bg-amber-50 text-amber-900',
  red: 'border-red-200 bg-red-50 text-red-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

const TRUST_POINTS = [
  { icon: Shield, title: 'Private session', desc: 'Your chart and conversation stay confidential.' },
  { icon: FileText, title: 'Structured review', desc: 'Focused analysis on your chosen life area.' },
  { icon: Sparkles, title: 'Practical remedies', desc: 'Actionable Vedic guidance when relevant.' },
  { icon: Headphones, title: 'Expert astrologer', desc: 'One-to-one time with an experienced practitioner.' },
];

function MetaChip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border border-site-accent-dark/12 bg-site-bg px-2 py-0.5 font-body text-[0.6875rem] font-semibold text-site-muted sm:px-2.5 sm:py-1 sm:text-xs ${className}`}
    >
      {children}
    </span>
  );
}

function badgeBg(color) {
  if (color === 'pink') return 'bg-rose-500/95';
  if (color === 'orange') return 'bg-amber-600/95';
  if (color === 'red') return 'bg-red-600/95';
  if (color === 'green') return 'bg-emerald-600/95';
  return 'bg-violet-600/95';
}

function BookingPanel({ service, displayTitle, paymentNote, onPayNow, onCallback, className = '', compact = false }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-[0_2px_12px_rgba(74,44,42,0.06)] ${className}`}
    >
      {!compact ? (
        <div className="relative h-28 overflow-hidden xl:h-32">
          <img src={service.img} alt={displayTitle} className="block h-full w-full object-cover" />
          {service.badge ? (
            <span
              className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-white shadow-sm ${badgeBg(service.badgeColor)}`}
            >
              {service.badge}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={`space-y-2.5 ${compact ? 'p-3.5 sm:p-4' : 'p-4'}`}>
        <div className={compact ? 'flex flex-wrap items-end justify-between gap-3' : ''}>
          <div>
            <p className="!m-0 font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">
              Session fee
            </p>
            <p className={`${TYPE.price} !mt-0.5 !text-[clamp(1.25rem,2.5vw,1.625rem)]`}>{service.priceLabel}</p>
            {service.duration ? (
              <p className={`${TYPE.caption} !mt-0.5 !text-[0.75rem]`}>{service.duration} consultation</p>
            ) : null}
          </div>
          {compact ? (
            <div className="flex flex-1 flex-col gap-2 min-[480px]:max-w-[16rem] min-[480px]:flex-none">
              {ONLINE_PAYMENT_ENABLED ? (
                <>
                  <button
                    type="button"
                    onClick={onPayNow}
                    className={`${BTN.primary} w-full !min-h-[2.375rem] !py-2 !text-xs`}
                  >
                    <CreditCard size={14} aria-hidden />
                    Pay &amp; Book
                  </button>
                  <button
                    type="button"
                    onClick={onCallback}
                    className={`${BTN.outline} w-full !min-h-[2.375rem] !py-2 !text-xs`}
                  >
                    <Phone size={14} aria-hidden />
                    Request callback
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onCallback}
                  className={`${BTN.primary} w-full !min-h-[2.375rem] !py-2 !text-xs`}
                >
                  <Phone size={14} aria-hidden />
                  Request callback
                </button>
              )}
            </div>
          ) : null}
        </div>

        {!compact ? (
          <div className="flex flex-col gap-2">
            {ONLINE_PAYMENT_ENABLED ? (
              <>
                <button
                  type="button"
                  onClick={onPayNow}
                  className={`${BTN.primary} w-full !min-h-[2.5rem] !py-2.5 !text-xs`}
                >
                  <CreditCard size={15} aria-hidden />
                  Pay &amp; Book
                </button>
                <button
                  type="button"
                  onClick={onCallback}
                  className={`${BTN.outline} w-full !min-h-[2.5rem] !py-2.5 !text-xs`}
                >
                  <Phone size={15} aria-hidden />
                  Request callback
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCallback}
                className={`${BTN.primary} w-full !min-h-[2.5rem] !py-2.5 !text-xs`}
              >
                <Phone size={15} aria-hidden />
                Request callback
              </button>
            )}
          </div>
        ) : null}

        {paymentNote && ONLINE_PAYMENT_ENABLED ? (
          <p className={`${TYPE.caption} !flex items-start gap-1.5 !text-[0.6875rem]`}>
            <Info size={12} className="mt-0.5 shrink-0 text-site-accent-dark" aria-hidden />
            {paymentNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ConsultationDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { service, loading, error } = useConsultationService(serviceId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState(BOOKING_MODES.PAY_LATER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [formData, setFormData] = useState(getEmptyConsultationForm());

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ONLINE_PAYMENT_ENABLED) {
      fetchConsultationPaymentConfig().then(setPaymentConfig);
    }
  }, [serviceId]);

  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        consultationType: service.title,
        serviceId: service.id,
        priceLabel: service.priceLabel,
      }));
    }
  }, [service]);

  if (loading) {
    return (
      <div className={PAGE}>
        <OverlayLoader label="Loading consultation…" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className={PAGE}>
        <div className={`${PAGE_WRAP} py-16 text-center sm:py-20`}>
          <h2 className={TYPE.h2}>Consultation not found</h2>
          <p className={`${TYPE.bodySm} !mt-2 mx-auto max-w-md`}>
            {error || 'This session may have been moved or is no longer available.'}
          </p>
          <Link to="/book-consultation" className={`${BTN.primary} ${BTN.static} !mt-6 inline-flex !min-h-[2.5rem]`}>
            <ArrowLeft size={15} aria-hidden />
            Back to consultations
          </Link>
        </div>
      </div>
    );
  }

  const badgeStyle = BADGE_STYLES[service.badgeColor] || BADGE_STYLES.purple;
  const displayTitle = service.short || service.title;
  const showFullTitle = service.short && service.short !== service.title;

  const openBooking = (mode) => {
    setBookingMode(ONLINE_PAYMENT_ENABLED ? mode : BOOKING_MODES.PAY_LATER);
    setIsModalOpen(true);
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    setIsSubmitting(true);

    try {
      await submitConsultationBooking({
        formData,
        service,
        bookingMode,
        sanitizedPhone,
        navigate,
        onSuccess: ({ mode }) => {
          setIsModalOpen(false);
          if (mode === BOOKING_MODES.PAY_NOW) return;
          setSuccessMessage(
            'We received your request. Our team will call you within 24 hours to confirm your session.'
          );
          setIsSuccessOpen(true);
          setFormData(getEmptyConsultationForm());
        },
        onDismiss: () => setIsSubmitting(false),
      });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentNote =
    paymentConfig?.mode === 'test'
      ? 'Checkout runs in test mode.'
      : paymentConfig?.mode === 'mock'
        ? 'Payments are simulated until Razorpay keys are configured.'
        : null;

  return (
    <div className={PAGE}>
      <SEO
        title={`${displayTitle} — Consultation`}
        description={service.desc}
        url={`/book-consultation/${service.id}`}
      />

      <section className="border-b border-site-accent-dark/8 py-5 sm:py-6">
        <div className={PAGE_WRAP}>
          <Link to="/book-consultation" className={`${TYPE.backLink} !mb-4 sm:!mb-5`}>
            <ArrowLeft size={15} aria-hidden />
            All consultations
          </Link>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-10">
            {/* Main content — always first column on desktop */}
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {service.category ? <span className={TYPE.kicker}>{service.category}</span> : null}
                {service.badge ? (
                  <MetaChip className={`!border ${badgeStyle}`}>{service.badge}</MetaChip>
                ) : null}
                {service.duration ? (
                  <MetaChip>
                    <Clock size={11} className="text-site-accent" aria-hidden />
                    {service.duration}
                  </MetaChip>
                ) : null}
              </div>

              <h1 className={TYPE.h1}>{displayTitle}</h1>
              {showFullTitle ? (
                <p className={`${TYPE.caption} !mt-1.5 !text-[0.8125rem] !text-site-muted`}>{service.title}</p>
              ) : null}

              <p className={`${TYPE.bodySm} !mt-3 max-w-2xl !text-[0.8125rem] sm:!text-sm`}>{service.desc}</p>

              {/* Mobile / tablet booking — visible without scrolling past a large image */}
              <BookingPanel
                className="mt-5 lg:hidden"
                service={service}
                displayTitle={displayTitle}
                paymentNote={paymentNote}
                onPayNow={() => openBooking(BOOKING_MODES.PAY_NOW)}
                onCallback={() => openBooking(BOOKING_MODES.PAY_LATER)}
                compact
              />

              {service.highlights?.length > 0 ? (
                <div className="mt-5 sm:mt-6">
                  <h2 className={`${TYPE.h3} !mb-2.5 !text-sm sm:!text-base`}>This session covers</h2>
                  <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
                    {service.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 font-body text-[0.8125rem] leading-snug text-site-primary sm:text-sm"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-site-accent"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Desktop sidebar — content left, booking right */}
            <aside className="hidden lg:sticky lg:top-[8.75rem] lg:block lg:self-start">
              <BookingPanel
                service={service}
                displayTitle={displayTitle}
                paymentNote={paymentNote}
                onPayNow={() => openBooking(BOOKING_MODES.PAY_NOW)}
                onCallback={() => openBooking(BOOKING_MODES.PAY_LATER)}
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-site-surface/60 py-6 sm:py-8">
        <div className={PAGE_WRAP}>
          <h2 className={`${TYPE.h2} !mb-4 sm:!mb-5`}>Every session includes</h2>
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-3.5">
            {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-site-accent-dark/10 bg-white p-3.5 sm:p-4"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-site-accent/12 text-site-accent-dark">
                  <Icon size={16} strokeWidth={2} aria-hidden />
                </div>
                <h3 className={`${TYPE.h3} !text-sm`}>{title}</h3>
                <p className={`${TYPE.bodySm} !mt-1 !text-[0.75rem] !leading-snug sm:!text-xs`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isFixedService
        bookingMode={bookingMode}
        priceLabel={service.priceLabel}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Request received"
        message={successMessage}
      />

      <OverlayLoader visible={isSubmitting} label="Submitting your request…" />
    </div>
  );
}

export default ConsultationDetail;
