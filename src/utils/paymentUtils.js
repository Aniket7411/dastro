import API_BASE from './api';
import toast from '@/utils/toast';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const buildPaymentFailedPath = ({
  type = 'payment',
  reason = '',
  leadId = '',
  txn = '',
  courseName = '',
  serviceId = '',
} = {}) => {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (reason) params.set('reason', reason);
  if (leadId) params.set('leadId', leadId);
  if (txn) params.set('txn', txn);
  if (courseName) params.set('course', courseName);
  if (serviceId) params.set('service', serviceId);
  return `/payment-failed?${params.toString()}`;
};

export const buildPaymentSuccessPath = ({
  type = 'payment',
  txn = '',
  courseName = '',
} = {}) => {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (txn) params.set('txn', txn);
  if (courseName) params.set('course', courseName);
  return `/payment-success?${params.toString()}`;
};

export const reportPaymentFailure = async ({
  leadId,
  orderId,
  courseId,
  courseName,
  consultationType,
  paymentFor = 'Consultation',
  error,
  navigate,
  type,
  serviceId,
}) => {
  const reason = error?.description || error?.reason || error?.message || 'Payment failed or was cancelled';
  const failedType = type || (paymentFor === 'Recorded Course' ? 'course' : paymentFor === 'Consultation' ? 'consultation' : 'payment');

  try {
    await fetch(`${API_BASE}/api/leads/payment-failed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
        orderId,
        courseId,
        courseName,
        consultationType,
        paymentFor,
        status:
          paymentFor === 'Recorded Course'
            ? 'Recorded Course Lead - Failed Payment'
            : 'Consultation Lead - Not Paid',
        paymentStatus: 'FAILED',
        failureReason: reason,
        razorpayError: error || null,
      }),
    });
  } catch (err) {
    console.warn('Unable to report payment failure', err);
  }

  if (navigate) {
    navigate(buildPaymentFailedPath({
      type: failedType,
      reason,
      leadId: leadId || '',
      txn: orderId || error?.metadata?.payment_id || '',
      courseName: courseName || '',
      serviceId: serviceId || '',
    }));
  } else {
    toast.error(reason);
  }
};

export const handleRazorpayPayment = async (formData, onSuccess, navigate) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Razorpay SDK failed to load. Check your connection.');
      return false;
    }

    const amount = parseInt(formData.price.replace('₹', '').replace(',', ''), 10);
    const payload = { ...formData, amount, type: 'Consultation', consultationType: formData.consultationType };

    const response = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    
    if (!data.success) {
      toast.error(data.error || data.message || 'Failed to initiate booking');
      return false;
    }

    const options = {
      key: data.keyId,
      name: "DS Astro Institute",
      description: `Consultation Booking: ${formData.consultationType}`,
      image: "/images/logo.png",
      order_id: data.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/leads/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              leadId: data.leadId
            })
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            if (navigate) {
              navigate(buildPaymentSuccessPath({
                type: 'consultation',
                txn: response.razorpay_payment_id,
              }));
            } else {
              onSuccess?.();
            }
          } else {
            toast.error('Payment verification failed.');
            if (navigate) {
              navigate(buildPaymentFailedPath({
                type: 'consultation',
                reason: 'Payment verification failed',
                leadId: data.leadId,
                txn: response.razorpay_payment_id,
              }));
            }
          }
        } catch (err) {
          toast.error('Error verifying payment.');
        }
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone
      },
      theme: {
        color: "#8B4A1E"
      }
    };

    if (data.isMock) {
      toast.success("Test Mode: Simulating Payment Success...");
      options.handler({
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: data.orderId,
        razorpay_signature: "mock_signature"
      });
    } else {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        reportPaymentFailure({
          leadId: data.leadId,
          orderId: data.orderId,
          consultationType: formData.consultationType,
          paymentFor: 'Consultation',
          error: response.error,
          navigate,
          type: 'consultation',
        });
      });
      rzp.open();
    }
    return true;
  } catch (err) {
    toast.error('Error: ' + err.message);
    return false;
  }
};
