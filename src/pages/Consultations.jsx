import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, CalendarCheck, FlaskConical, Lock, Scale, SearchX, Sparkles } from 'lucide-react';
import toast from '@/utils/toast';
import ConsultationModal from '../components/ConsultationModal';
import { OverlayLoader } from '../components/PageLoader';
import BookConsultationCTA from '../components/BookConsultationCTA';
import ConsultationServiceCard from '../components/ConsultationServiceCard';
import { ConsultationFilterBar } from '../components/ConsultationFilters';
import SuccessModal from '../components/SuccessModal';
import SEO from '../components/SEO';
import { PAGE, PAGE_WRAP, TYPE, BTN, CHIP, CHIP_GHOST, CARD_FLEX_LIST, CARD_FLEX_ITEM } from '../components/consultation/tokens';
import { useConsultationCatalog, toggleInList } from '../utils/consultationApi';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import {
  BOOKING_MODES,
  submitConsultationBooking,
  getEmptyConsultationForm,
} from '../utils/consultationBooking';

const GUIDELINES = [
  { icon: Lock, title: 'Confidentiality', text: 'All sessions are private & confidential' },
  { icon: CalendarCheck, title: 'Prior Booking', text: 'Mandatory for all consultation types' },
  { icon: Ban, title: 'Refund Policy', text: 'No refund after booking completion' },
  { icon: Scale, title: 'Divine Balance', text: 'Results depend on karma & planetary timing' },
  { icon: FlaskConical, title: 'Remedies', text: 'Suggested only after proper analysis' },
];

const SORT_OPTIONS = [
  { value: 'sortOrder:asc', label: 'Recommended' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'title:asc', label: 'Name: A–Z' },
];

function ResultsSkeleton() {
  return (
    <ul className={CARD_FLEX_LIST}>
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className={CARD_FLEX_ITEM}>
          <div className="animate-pulse overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm">
            <div className="aspect-[2/1] bg-site-accent-dark/10" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 rounded-full bg-site-accent-dark/10" />
              <div className="h-3 w-full rounded-full bg-site-accent-dark/8" />
              <div className="mt-3 flex justify-between border-t border-site-accent-dark/8 pt-3">
                <div className="h-5 w-16 rounded-full bg-site-accent-dark/10" />
                <div className="h-8 w-20 rounded-full bg-site-accent-dark/10" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <button type="button" onClick={onRemove} className={CHIP}>
      {label}
      <span className="text-[0.625rem] opacity-50">✕</span>
    </button>
  );
}

function CardGrid({ cards }) {
  return (
    <ul className={CARD_FLEX_LIST}>
      {cards.map((card, i) => (
        <li key={card.id ?? i} className={CARD_FLEX_ITEM}>
          <ConsultationServiceCard card={card} detailPath="/book-consultation" />
        </li>
      ))}
    </ul>
  );
}

function Consultations() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getEmptyConsultationForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState(BOOKING_MODES.PAY_LATER);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [sortValue, setSortValue] = useState('sortOrder:asc');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const [sortBy, sortOrder] = sortValue.split(':');

  const catalogFilters = useMemo(
    () => ({
      categories: selectedCategories,
      durations: selectedDurations,
      badges: selectedBadges,
      minPrice: priceMin,
      maxPrice: priceMax,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    }),
    [selectedCategories, selectedDurations, selectedBadges, priceMin, priceMax, debouncedSearch, sortBy, sortOrder]
  );

  const {
    categories: consultationCategories,
    filterMeta,
    total,
    loading: catalogLoading,
    error: catalogError,
  } = useConsultationCatalog(catalogFilters);

  useEffect(() => {
    if (catalogError) toast.error(catalogError);
  }, [catalogError]);

  const activeFilterCount =
    selectedCategories.length +
    selectedDurations.length +
    selectedBadges.length +
    (priceMin != null ? 1 : 0) +
    (priceMax != null ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedDurations([]);
    setSelectedBadges([]);
    setPriceMin(null);
    setPriceMax(null);
    setSearchQuery('');
  };

  const hasActiveFilters = activeFilterCount > 0 || debouncedSearch.trim().length > 0;
  const showGrouped = selectedCategories.length <= 1 && !debouncedSearch.trim();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = getContactValidationError(formData);
    if (err) {
      toast.error(err);
      return;
    }
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    setIsSubmitting(true);
    try {
      const service = formData.serviceId
        ? {
            id: formData.serviceId,
            title: formData.consultationType,
            price: parseInt(String(formData.price).replace(/[₹,]/g, ''), 10) || undefined,
            priceLabel: formData.priceLabel,
          }
        : null;
      await submitConsultationBooking({
        formData,
        service,
        bookingMode,
        sanitizedPhone,
        navigate,
        onSuccess: ({ mode }) => {
          setIsModalOpen(false);
          if (mode === BOOKING_MODES.PAY_NOW) return;
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

  const openGeneralEnquiry = () => {
    setBookingMode(BOOKING_MODES.PAY_LATER);
    setFormData(getEmptyConsultationForm());
    setIsModalOpen(true);
  };

  const filterBarProps = {
    filterMeta,
    selectedCategories,
    selectedDurations,
    selectedBadges,
    priceMin,
    priceMax,
    onToggleCategory: (id) => setSelectedCategories((p) => toggleInList(p, id)),
    onClearCategories: () => setSelectedCategories([]),
    onToggleDuration: (value) => setSelectedDurations((p) => toggleInList(p, value)),
    onToggleBadge: (value) => setSelectedBadges((p) => toggleInList(p, value)),
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    onClearAll: clearAllFilters,
    activeFilterCount,
    sortValue,
    onSortChange: setSortValue,
    sortOptions: SORT_OPTIONS,
    total,
    loading: catalogLoading,
    hasActiveFilters,
  };

  return (
    <>
      <SEO
        title="Consultation Services"
        description="Understand your life path, remove confusion, and make decisions with confidence."
        url="/book-consultation"
      />

      <div className={PAGE}>
        <header className={`${PAGE_WRAP} border-b border-site-accent-dark/8 pb-4 pt-6 sm:pb-5 sm:pt-7`}>
          <h1 className={TYPE.h1}>Book a Consultation</h1>
          <p className={`${TYPE.bodySm} !mt-1.5 max-w-xl !text-[0.8125rem]`}>
            Browse sessions by category, filter by duration or price, and book online.
          </p>
        </header>

        <ConsultationFilterBar {...filterBarProps} />

        <div className={`${PAGE_WRAP} py-4 sm:py-5`}>
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5 sm:mb-5 sm:gap-2">
              {selectedCategories.map((id) => {
                const label = filterMeta?.categories?.find((c) => c.id === id)?.name || id;
                return (
                  <ActiveChip key={`cat-${id}`} label={label} onRemove={() => setSelectedCategories((p) => toggleInList(p, id))} />
                );
              })}
              {selectedDurations.map((dur) => (
                <ActiveChip key={`dur-${dur}`} label={dur} onRemove={() => setSelectedDurations((p) => toggleInList(p, dur))} />
              ))}
              {selectedBadges.map((badge) => (
                <ActiveChip key={`badge-${badge}`} label={badge} onRemove={() => setSelectedBadges((p) => toggleInList(p, badge))} />
              ))}
              {(priceMin != null || priceMax != null) && (
                <ActiveChip
                  label={`₹${priceMin ?? filterMeta?.priceRange?.min} – ₹${priceMax ?? filterMeta?.priceRange?.max}`}
                  onRemove={() => {
                    setPriceMin(null);
                    setPriceMax(null);
                  }}
                />
              )}
              {debouncedSearch && <ActiveChip label={`"${debouncedSearch}"`} onRemove={() => setSearchQuery('')} />}
              <button type="button" onClick={clearAllFilters} className={CHIP_GHOST}>
                Clear all
              </button>
            </div>
          )}

          {catalogLoading ? (
            <ResultsSkeleton />
          ) : total > 0 ? (
            showGrouped ? (
              <div className="flex flex-col gap-7 sm:gap-8">
                {consultationCategories.map((cat, idx) => (
                  <section key={cat.slug ?? idx} aria-labelledby={`cat-${idx}`}>
                    <div className="mb-3 sm:mb-4">
                      <h2 id={`cat-${idx}`} className={`${TYPE.h2} flex flex-wrap items-baseline gap-x-2 gap-y-0.5`}>
                        <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-md bg-site-accent/15 px-1.5 py-0.5 font-body text-xs font-bold tabular-nums text-site-accent-dark">
                          {cat.cards.length}
                        </span>
                        <span>{cat.name}</span>
                      </h2>
                      {cat.description && (
                        <p className={`${TYPE.bodySm} !mt-1 line-clamp-2 max-w-3xl !text-[0.8125rem]`}>{cat.description}</p>
                      )}
                    </div>
                    <CardGrid cards={cat.cards} />
                  </section>
                ))}
              </div>
            ) : (
              <CardGrid cards={consultationCategories.flatMap((c) => c.cards)} />
            )
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-site-accent/12 text-site-accent-dark">
                <SearchX size={28} />
              </div>
              <h2 className={TYPE.h2}>No consultations found</h2>
              <p className={`${TYPE.bodySm} !mt-2`}>Adjust your filters or clear them to see all sessions.</p>
              <button type="button" onClick={clearAllFilters} className={`${BTN.primary} ${BTN.static} !mt-8`}>
                Clear filters
              </button>
            </div>
          )}

          {!catalogLoading && total > 0 && (
            <>
              <section
                className="mt-10 overflow-hidden rounded-xl border border-site-accent-dark/12 bg-white shadow-sm sm:mt-12"
                aria-labelledby="consult-guidelines"
              >
                <div className="border-b border-site-accent-dark/8 bg-gradient-to-r from-site-bg to-site-surface px-6 py-5 sm:px-8 sm:py-6">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-site-accent/12 text-site-accent-dark">
                      <Sparkles size={18} aria-hidden />
                    </span>
                    <h2 id="consult-guidelines" className={TYPE.h2}>
                      Important Guidelines
                    </h2>
                  </div>
                </div>
                <ul className="m-0 grid list-none grid-cols-1 divide-y divide-site-accent-dark/6 p-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
                  {GUIDELINES.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-3.5 p-5 sm:p-6">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-site-accent/10 text-site-accent-dark">
                        <Icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      <div>
                        <p className="!m-0 font-body text-sm font-bold text-site-primary">{title}</p>
                        <p className={`${TYPE.caption} !mt-1`}>{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <BookConsultationCTA onBookClick={openGeneralEnquiry} />
            </>
          )}
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isFixedService={!!formData.consultationType && !!formData.serviceId}
        bookingMode={bookingMode}
        priceLabel={formData.priceLabel}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Consultation Request Received!"
        message="Your details have been securely sent to our experts. We will contact you on your provided phone number within 24 hours to schedule the session."
      />

      <OverlayLoader visible={isSubmitting} label="Submitting your request…" />
    </>
  );
}

export default Consultations;
