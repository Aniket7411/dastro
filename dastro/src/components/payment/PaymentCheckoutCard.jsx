import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/currency';
import { PaymentInput, PaymentSelect } from './PaymentField';

function PriceRow({ label, value, sub = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={sub ? 'text-sm text-site-muted sm:text-[0.9rem]' : 'text-base font-medium text-site-text'}>
        {label}
      </span>
      <span className={sub ? 'text-sm text-site-muted sm:text-[0.95rem]' : 'text-lg font-bold text-site-text'}>
        {value}
      </span>
    </div>
  );
}

export default function PaymentCheckoutCard({
  baseAmount,
  cgst,
  sgst,
  totalAmount,
  name,
  email,
  phone,
  isProcessing,
  onCheckout,
}) {
  return (
    <div className="w-full max-w-[540px] overflow-hidden rounded-[14px] border border-site-accent-dark/14 bg-white shadow-[0_10px_24px_rgba(42,15,2,0.06)]">
      <div className="bg-site-primary px-5 py-4 text-center text-base font-extrabold text-white sm:text-lg">
        DS Astrology - Mega Astrology Webinar
      </div>

      <div className="p-4 sm:p-6 md:p-7">
        <PriceRow label="Amount" value={formatINR(baseAmount)} />
        <p className="mt-2 text-sm text-site-soft">Please note that this payment is non-refundable.</p>

        <div className="mt-4">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-xs text-site-soft sm:flex-1 sm:text-sm">
              GST Identification Number (Optional)
            </label>
            <PaymentInput className="sm:w-36" />
          </div>

          <PriceRow label="CGST9 (9%)" value={formatINR(cgst)} sub />
          <div className="mt-2">
            <PriceRow label="SGST9 (9%)" value={formatINR(sgst)} sub />
          </div>
        </div>

        <div className="-mx-4 mt-4 flex items-center justify-between border-y border-site-accent-dark/14 bg-[#fffbf5] px-4 py-4 sm:-mx-6 sm:px-6 md:-mx-7 md:px-7">
          <span className="text-lg text-site-text">Total</span>
          <span className="text-xl font-extrabold text-site-text">{formatINR(totalAmount)}</span>
        </div>

        <div className="mt-5">
          <h6 className="mb-4 text-sm font-bold text-site-text sm:text-[0.9rem]">Contact Details</h6>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PaymentInput placeholder="Full Name*" value={name} readOnly />
            <PaymentInput placeholder="Email*" value={email} readOnly />
            <PaymentInput
              className="sm:col-span-2"
              placeholder="WhatsApp Number With Country Code*"
              value={phone}
              readOnly
            />
          </div>
        </div>

        <div className="mt-4">
          <h6 className="mb-4 text-sm font-bold text-site-text sm:text-[0.9rem]">Billing Address</h6>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PaymentSelect className="sm:col-span-2">
              <option>India</option>
            </PaymentSelect>
            <PaymentSelect>
              <option>Uttar Pradesh</option>
            </PaymentSelect>
            <PaymentInput placeholder="City" />
          </div>
        </div>

        <div className="mt-5 sm:mt-8">
          <p className="mb-4 text-center text-xs leading-relaxed text-site-soft sm:text-[13px]">
            By proceeding with the payment, you agree to our{' '}
            <Link to="/terms-and-conditions" className="font-medium text-[#6b4a44] underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link to="/refund-policy" className="font-medium text-[#6b4a44] underline">
              Refund &amp; Cancellation Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={onCheckout}
            disabled={isProcessing}
            className="w-full cursor-pointer rounded-[9px] border-0 bg-site-primary px-4 py-4 text-base font-semibold text-white transition hover:bg-[#6b3514] disabled:cursor-wait disabled:bg-slate-400"
          >
            {isProcessing ? 'Processing...' : 'Checkout with Razorpay'}
          </button>
        </div>
      </div>
    </div>
  );
}
