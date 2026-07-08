import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeConsultationCard from '../HomeConsultationCard';
import ConsultationServicesCarousel from '../ConsultationServicesCarousel';
import { HomeSubsectionHeader } from './HomeSectionHeader';
import { COURSE_GRID, COURSE_GRID_ITEM } from '../consultation/tokens';
import { CourseGridSkeleton } from '../PageLoader';
import { fetchConsultationCatalog, mapConsultationServiceToHomeCard } from '../../utils/consultationApi';

const FEATURED_LIMIT = 4;
const CAROUSEL_LIMIT = 6;

export default function HomeConsultationsSection({ onBook }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchConsultationCatalog({ sortBy: 'sortOrder', sortOrder: 'asc' })
      .then((data) => {
        if (cancelled) return;
        setServices(data.services || []);
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(
    () => services.map(mapConsultationServiceToHomeCard),
    [services]
  );

  const carouselItems = useMemo(() => cards.slice(0, CAROUSEL_LIMIT), [cards]);
  const featuredItems = useMemo(() => cards.slice(0, FEATURED_LIMIT), [cards]);

  return (
    <>
      {loading ? (
        <div className="mb-10 h-48 animate-pulse rounded-2xl bg-site-sand/60 sm:h-56" aria-hidden />
      ) : carouselItems.length > 0 ? (
        <ConsultationServicesCarousel items={carouselItems} onBook={onBook} />
      ) : null}

      <HomeSubsectionHeader
        className="mt-1 sm:mt-2"
        title="Featured"
        titleHighlight="Sessions"
        subtitle="Our most booked consultations — request a callback or learn more about each service."
        subtitleClassName="lg:whitespace-nowrap"
        showAccent
      />

      {loading ? (
        <CourseGridSkeleton />
      ) : featuredItems.length > 0 ? (
        <ul className={COURSE_GRID} data-aos="fade-up">
          {featuredItems.map((item, idx) => (
            <li
              key={item.id || item.link}
              className={COURSE_GRID_ITEM}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <HomeConsultationCard item={item} onBook={onBook} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-center text-sm text-site-muted">
          Consultation services are being updated. Check back soon or browse the full catalog.
        </p>
      )}

      <div className="mt-6 text-center sm:mt-8" data-aos="fade-up">
        <Link
          to="/consultations"
          className="btn mystic-btn-outline px-5 !no-underline visited:!no-underline hover:!no-underline"
        >
          View All Consultations
        </Link>
      </div>
    </>
  );
}
