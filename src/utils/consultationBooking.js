import API_BASE from './api';
import toast from '@/utils/toast';
import { loadRazorpayScript, reportPaymentFailure, buildPaymentSuccessPath } from './paymentUtils';
import { SITE_LOGO } from './brandAssets';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

export const BOOKING_MODES = {
  PAY_NOW: 'pay_now',
  PAY_LATER: 'pay_later',
};

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  consultationType: '',
  serviceId: '',
  dob: '',
  tob: '',
  pob: '',
  message: '',
  price: '',
  priceLabel: '',
};

export const getEmptyConsultationForm = () => ({ ...EMPTY_FORM });

const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return parseInt(String(value).replace(/[₹,\s]/g, ''), 10) || 0;
};

const buildLeadPayload = ({ formData, service, bookingMode, sanitizedPhone }) => {
  const base = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: sanitizedPhone,
    type: 'Consultation',
    consultationType: formData.consultationType || service?.title || 'General Consultation',
    serviceId: service?.id || formData.serviceId || undefined,
    dob: formData.dob,
    tob: formData.tob,
    pob: formData.pob,
    message: formData.message || '',
    bookingMode,
  };

  if (bookingMode === BOOKING_MODES.PAY_NOW) {
    const amount = service?.price ?? parsePrice(formData.price);
    return { ...base, amount, bookingMode: BOOKING_MODES.PAY_NOW };
  }

  return {
    ...base,
    bookingMode: BOOKING_MODES.PAY_LATER,
    quotedAmount: (service?.price ?? parsePrice(formData.price)) || undefined,
  };
};

const openRazorpayCheckout = async ({
  data,
  formData,
  service,
  onSuccess,
  onDismiss,
  navigate,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    toast.error('Razorpay SDK failed to load. Check your connection.');
    onDismiss?.();
    return false;
  }

  if (!data.orderId) {
    toast.error('Order ID not generated. Please try again.');
    onDismiss?.();
    return false;
  }

  return new Promise((resolve) => {
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'DS Astrology',
      description: `Consultation: ${formData.consultationType}`,
      image: SITE_LOGO,
      order_id: data.orderId,
      handler: async (response) => {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/leads/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              leadId: data.leadId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            if (navigate) {
              navigate(buildPaymentSuccessPath({
                type: 'consultation',
                txn: response.razorpay_payment_id,
              }));
            } else {
              onSuccess?.({ leadId: data.leadId, mode: BOOKING_MODES.PAY_NOW });
            }
            resolve(true);
          } else {
            toast.error('Payment verification failed.');
            onDismiss?.();
            if (navigate) {
              reportPaymentFailure({
                leadId: data.leadId,
                orderId: data.orderId,
                consultationType: formData.consultationType,
                paymentFor: 'Consultation',
                error: { description: 'Payment verification failed' },
                navigate,
                type: 'consultation',
                serviceId: service?.id || formData.serviceId,
              });
            }
            resolve(false);
          }
        } catch {
          toast.error('Error verifying payment.');
          onDismiss?.();
          resolve(false);
        }
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      theme: { color: '#8B4A1E' },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          resolve(false);
        },
      },
    };

    if (data.isMock) {
      toast.success('Test mode: simulating payment success…');
      options.handler({
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: data.orderId,
        razorpay_signature: 'mock_signature',
      });
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      reportPaymentFailure({
        leadId: data.leadId,
        orderId: data.orderId,
        consultationType: formData.consultationType,
        paymentFor: 'Consultation',
        error: response.error,
        navigate,
        type: 'consultation',
        serviceId: service?.id || formData.serviceId,
      });
      onDismiss?.();
      resolve(false);
    });
    rzp.open();
  });
};

/**
 * Unified consultation booking — pay now (Razorpay) or pay later (callback request).
 */
export async function submitConsultationBooking({
  formData,
  service = null,
  bookingMode = BOOKING_MODES.PAY_LATER,
  sanitizedPhone,
  onSuccess,
  onDismiss,
  navigate,
}) {
  const payload = buildLeadPayload({ formData, service, bookingMode, sanitizedPhone });

  const response = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!data.success) {
    toast.error(data.error || data.message || 'Failed to submit booking');
    onDismiss?.();
    return false;
  }

  const effectiveMode =
    !ONLINE_PAYMENT_ENABLED && bookingMode === BOOKING_MODES.PAY_NOW
      ? BOOKING_MODES.PAY_LATER
      : bookingMode;

  if (effectiveMode === BOOKING_MODES.PAY_NOW && data.orderId) {
    return openRazorpayCheckout({ data, formData, service, onSuccess, onDismiss, navigate });
  }

  onSuccess?.({ leadId: data.leadId, mode: BOOKING_MODES.PAY_LATER });
  return true;
}

export async function fetchConsultationPaymentConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/consultations/payment-config`);
    const data = await res.json();
    return data.success ? data : null;
  } catch {
    return null;
  }
}
