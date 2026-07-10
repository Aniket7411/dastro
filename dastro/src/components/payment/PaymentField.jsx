import { ChevronDown } from 'lucide-react';

export function PaymentInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-[9px] border border-site-accent-dark/14 bg-white px-2.5 py-2.5 text-sm text-site-text outline-none transition focus:border-site-primary focus:ring-[3px] focus:ring-site-accent-dark/10 ${className}`}
      {...props}
    />
  );
}

export function PaymentSelect({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none rounded-[9px] border border-site-accent-dark/14 bg-white px-2.5 py-2.5 pr-8 text-sm text-site-text outline-none transition focus:border-site-primary focus:ring-[3px] focus:ring-site-accent-dark/10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-site-muted"
        aria-hidden
      />
    </div>
  );
}
