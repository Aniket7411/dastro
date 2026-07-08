import { Link } from 'react-router-dom';
import {
  SITE_BTN_COPPER,
  SITE_BTN_PRIMARY,
  SITE_BTN_TONAL,
  SITE_BTN_TONAL_ON_DARK,
} from '../utils/siteTokens';

const LINK = '!no-underline decoration-transparent visited:!no-underline hover:!no-underline';

export default function HomeBannerCTAs({ primaryCta, onDark = false }) {
  const primaryClass = onDark
    ? `${LINK} ${SITE_BTN_TONAL_ON_DARK}`
    : `${LINK} ${SITE_BTN_PRIMARY}`;

  const secondaryClass = onDark
    ? `${LINK} ${SITE_BTN_COPPER}`
    : `${LINK} ${SITE_BTN_TONAL}`;

  return (
    <div className="mt-4 flex w-full max-w-lg flex-wrap items-center justify-start gap-3.5 max-lg:mx-auto max-lg:justify-center">
      <Link to={primaryCta?.path || '/courses'} className={primaryClass}>
        {primaryCta?.label || 'View courses'}
      </Link>

      <Link to="/consultations" className={secondaryClass}>
        Book Consultation
      </Link>
    </div>
  );
}
