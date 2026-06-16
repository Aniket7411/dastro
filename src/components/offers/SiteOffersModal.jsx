import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Copy, Gift, MessageCircle, Tag, Sparkles } from 'lucide-react';
import toast from '@/utils/toast';
import { BTN } from '../consultation/tokens';
import { ModalPortal, ModalOverlay, useModalLock } from '../modal/ModalLayer';
import {
  dismissOfferIds,
  fetchPublicOffers,
  filterVisibleOffers,
  formatOfferDate,
  formatOfferDiscount,
  offerBadge,
} from '../../utils/offerApi';

const TYPE_ICON = {
  money_coupon: Tag,
  first_chat_free: MessageCircle,
  percentage_off: Sparkles,
  fixed_discount: Gift,
  custom: Gift,
};

function OfferCard({ offer, onCopyCode }) {
  const Icon = TYPE_ICON[offer.type] || Gift;
  const discount = formatOfferDiscount(offer);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-site-accent-dark/12 bg-site-bg/60 sm:flex-row">
      {offer.thumbnail ? (
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-36 md:w-44">
          <img
            src={offer.thumbnail}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center bg-gradient-to-br from-site-accent/20 to-site-accent-dark/10 sm:aspect-auto sm:w-36 md:w-44">
          <Icon className="h-10 w-10 text-site-accent-dark/70" aria-hidden />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-site-accent/15 px-2 py-0.5 font-body text-[0.625rem] font-bold uppercase tracking-wide text-site-accent-dark">
            {offerBadge(offer.type)}
          </span>
          {discount ? (
            <span className="font-price text-sm font-bold text-site-accent-dark">{discount}</span>
          ) : null}
        </div>

        <h3 className="m-0 font-heading text-base font-bold leading-snug text-site-primary sm:text-lg">
          {offer.title}
        </h3>

        {offer.subtitle ? (
          <p className="m-0 text-xs font-semibold text-site-accent-dark sm:text-sm">{offer.subtitle}</p>
        ) : null}

        {offer.description ? (
          <p className="m-0 line-clamp-3 text-xs leading-relaxed text-site-muted sm:text-sm">
            {offer.description}
          </p>
        ) : null}

        {offer.couponCode ? (
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-lg border border-dashed border-site-accent-dark/25 bg-white px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-site-primary sm:text-sm">
              {offer.couponCode}
            </code>
            <button
              type="button"
              onClick={() => onCopyCode(offer.couponCode)}
              className="m-0 inline-flex cursor-pointer items-center gap-1 rounded-full border-0 bg-site-primary px-2.5 py-1 font-body text-[0.6875rem] font-bold text-white transition hover:bg-site-accent-dark"
            >
              <Copy className="h-3 w-3" aria-hidden />
              Copy
            </button>
          </div>
        ) : null}

        <p className="m-0 text-[0.6875rem] text-site-soft">
          Valid till {formatOfferDate(offer.validTill)}
        </p>

        {offer.ctaLink ? (
          <Link
            to={offer.ctaLink}
            className={`${BTN.pill} mt-auto w-fit no-underline`}
            onClick={() => {}}
          >
            {offer.ctaLabel || 'Claim Offer'}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function SiteOffersModal() {
  const [offers, setOffers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    if (offers.length) {
      dismissOfferIds(offers.map((o) => o._id || o.offerId));
    }
    setIsOpen(false);
  }, [offers]);

  useModalLock(isOpen, close);

  useEffect(() => {
    let cancelled = false;
    let timer;

    (async () => {
      try {
        const list = await fetchPublicOffers();
        if (cancelled) return;
        const visible = filterVisibleOffers(list);
        if (visible.length > 0) {
          setOffers(visible);
          timer = setTimeout(() => setIsOpen(true), 1400);
        }
      } catch (err) {
        console.error('Offers load failed:', err);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error('Could not copy code');
    }
  };

  if (!isOpen || offers.length === 0) return null;

  return (
    <ModalPortal open={isOpen}>
      <ModalOverlay onClose={close}>
        <div
          className="relative flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-site-accent-dark/12 bg-white shadow-[0_24px_64px_rgba(42,15,2,0.22)] sm:max-w-xl sm:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-offers-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-site-accent-dark/10 bg-gradient-to-r from-site-accent/12 to-transparent px-4 py-3.5 sm:px-5 sm:py-4">
            <button
              type="button"
              onClick={close}
              aria-label="Close offers"
              className="absolute right-3 top-3 m-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-site-accent-dark/15 bg-white text-site-accent-dark transition hover:bg-site-bg"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <p className="m-0 mb-1 font-body text-[0.625rem] font-bold uppercase tracking-[0.12em] text-site-accent-dark">
              Limited time
            </p>
            <h2 id="site-offers-title" className="m-0 pr-8 font-heading text-lg font-extrabold text-site-primary sm:text-xl">
              Special offers for you
            </h2>
            <p className="m-0 mt-1 text-xs text-site-muted sm:text-sm">
              Coupons, free chat &amp; more — grab them before they expire.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3.5 sm:space-y-3.5 sm:px-5 sm:py-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer._id || offer.offerId}
                offer={offer}
                onCopyCode={copyCode}
              />
            ))}
          </div>

          <div className="shrink-0 border-t border-site-accent-dark/10 px-4 py-3 sm:px-5">
            <button type="button" onClick={close} className={`${BTN.outline} w-full`}>
              Maybe later
            </button>
          </div>
        </div>
      </ModalOverlay>
    </ModalPortal>
  );
}

export default SiteOffersModal;
