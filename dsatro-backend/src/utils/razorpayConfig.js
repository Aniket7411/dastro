import Razorpay from 'razorpay';

export const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const placeholderValues = new Set([
    'your_rzp_key_here',
    'your_rzp_secret_here',
    'rzp_test_placeholder',
    'secret_placeholder'
  ]);

  if (!keyId || !keySecret || placeholderValues.has(keyId) || placeholderValues.has(keySecret)) {
    const missing = [
      (!keyId || placeholderValues.has(keyId)) ? 'RAZORPAY_KEY_ID' : '',
      (!keySecret || placeholderValues.has(keySecret)) ? 'RAZORPAY_KEY_SECRET' : ''
    ].filter(Boolean).join(', ');

    throw new Error(`${missing} is not configured with valid Razorpay credentials`);
  }

  return { keyId, keySecret };
};

export const createRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

/** Dev/test checkout without live Razorpay keys */
export const isMockPaymentAllowed = () =>
  process.env.ALLOW_MOCK_PAYMENT === 'true' || process.env.NODE_ENV === 'development';

/** True when checkout is available (live keys or mock test mode) */
export const isPaymentEnabled = () => {
  try {
    getRazorpayConfig();
    return true;
  } catch {
    return isMockPaymentAllowed();
  }
};

export const getPaymentMode = () => {
  try {
    const { keyId } = getRazorpayConfig();
    return keyId.startsWith('rzp_live_') ? 'live' : 'test';
  } catch {
    return isMockPaymentAllowed() ? 'mock' : 'disabled';
  }
};
