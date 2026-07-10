import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { reportPaymentFailure } from '../utils/paymentUtils';
import { SITE_LOGO } from '../utils/brandAssets';
import PaymentCheckoutCard from '../components/payment/PaymentCheckoutCard';

function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const leadId = searchParams.get('leadId');
  const name = decodeURIComponent(searchParams.get('name') || '');
  const email = decodeURIComponent(searchParams.get('email') || '');
  const phone = searchParams.get('phone') || '';
  const rawAmount = searchParams.get('amount') || '9900';
  const orderId = searchParams.get('orderId');
  const keyId = searchParams.get('keyId');

  const totalAmountNum = parseFloat(rawAmount) / 100 || 99;
  const totalAmount = totalAmountNum.toFixed(2);
  const cgst = (totalAmountNum * 0.0763).toFixed(2);
  const sgst = (totalAmountNum * 0.0763).toFixed(2);
  const baseAmount = (totalAmountNum - cgst - sgst).toFixed(2);

  useEffect(() => {
    if (!leadId) {
      toast.error('Invalid Session');
      navigate('/webinar');
    }
  }, [leadId, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    if (orderId && orderId.startsWith('order_mock_')) {
      toast.success('Simulating Payment...');
      setTimeout(async () => {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/leads/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: 'mock_signature',
              leadId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Payment Successful!');
            navigate(`/payment-success?txn=mock_txn_${Date.now()}`);
          }
        } catch {
          toast.error('Verification Error');
        } finally {
          setIsProcessing(false);
        }
      }, 1500);
      return;
    }

    const resScript = await loadRazorpay();
    if (!resScript) {
      toast.error('Razorpay SDK failed to load');
      setIsProcessing(false);
      return;
    }

    if (!keyId) {
      toast.error('Payment gateway key is missing. Please contact support.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: keyId,
      amount: rawAmount,
      currency: 'INR',
      name: 'DS Astrology',
      description: 'Webinar Registration',
      image: SITE_LOGO,
      order_id: orderId,
      handler: async function (response) {
        setIsProcessing(true);
        try {
          const verifyRes = await fetch(`${API_BASE}/api/leads/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, leadId }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Booking Confirmed!');
            navigate(`/payment-success?txn=${response.razorpay_payment_id}`);
          } else {
            toast.error('Payment verification failed.');
          }
        } catch {
          toast.error('Connection Error');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: { name, email, contact: phone },
      theme: { color: '#6b4a44' },
      modal: { ondismiss: () => setIsProcessing(false) },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      toast.error(`Payment Failed: ${response.error.description}`);
      reportPaymentFailure({
        leadId,
        orderId,
        paymentFor: 'Webinar',
        error: response.error,
      });
      setIsProcessing(false);
    });
    paymentObject.open();
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-site-bg px-4 py-6 font-body text-site-text sm:items-center sm:px-6 sm:py-8 lg:px-12">
      <PaymentCheckoutCard
        baseAmount={baseAmount}
        cgst={cgst}
        sgst={sgst}
        totalAmount={totalAmount}
        name={name}
        email={email}
        phone={phone}
        isProcessing={isProcessing}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default Payment;
