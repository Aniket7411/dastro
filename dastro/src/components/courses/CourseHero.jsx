import { PAGE_WRAP, TW_H1, TW_BODY, TW_BODY_SM } from '../../utils/siteTokens';

export default function CourseHero({
  heading,
  subtitle,
  heroImg,
  loading,
  courseCount,
  typeLabel,
  typeLabelPlural,
  categoryCount,
}) {
  const countLabel = courseCount === 1 ? typeLabel : (typeLabelPlural ?? `${typeLabel}s`);

  if (heroImg) {
    return (
      <header className="relative -mt-site-header mb-4 w-full overflow-hidden border-b border-site-accent-dark/10 sm:mb-5 bg-[#0d0d0d]">
        <div className="relative flex min-h-[min(16rem,52svh)] flex-col justify-end pt-site-header sm:min-h-72 lg:min-h-80">
          <img
            src={heroImg}
            alt={heading}
            className="absolute inset-x-0 bottom-0 top-site-header-sticky w-full object-cover object-center"
          />
          <div
            className="absolute inset-x-0 bottom-0 top-site-header-sticky bg-gradient-to-r from-black/60 via-black/40 to-black/20"
            aria-hidden
          />
          <div className={`relative z-10 ${PAGE_WRAP} pb-8 sm:pb-10`}>
            <h1 className={`${TW_H1} text-white drop-shadow-md`}>
              {heading}
            </h1>
            <p className={`mt-3 max-w-2xl ${TW_BODY} text-white/85`}>
              {subtitle}
            </p>
            {!loading && (
              <p className={`mt-4 ${TW_BODY_SM} text-white/65`}>
                <span className="font-bold tabular-nums text-white/90">{courseCount}</span>
                {' '}
                {countLabel}
                {' '}
                available
                {categoryCount > 1 && (
                  <>
                    {' · '}
                    <span className="font-bold tabular-nums text-white/90">{categoryCount - 1}</span>
                    {' '}
                    categories
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${PAGE_WRAP} border-b border-site-accent-dark/10 pb-4 pt-6 sm:pb-5 sm:pt-8`}>
      <h1 className={TW_H1}>
        {heading}
      </h1>
      <p className={`mt-2 max-w-2xl ${TW_BODY}`}>
        {subtitle}
      </p>
      {!loading && (
        <p className={`mt-3 ${TW_BODY_SM}`}>
          <span className="font-bold tabular-nums text-site-primary">{courseCount}</span>
          {' '}
          {countLabel}
          {' '}
          available
          {categoryCount > 1 && (
            <>
              {' · '}
              <span className="font-bold tabular-nums text-site-primary">{categoryCount - 1}</span>
              {' '}
              categories
            </>
          )}
        </p>
      )}
    </header>
  );
}
