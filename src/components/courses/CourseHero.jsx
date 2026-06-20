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
          <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 pb-6 sm:px-6 sm:pb-8 lg:px-12">
            <h1 className="font-heading text-3xl font-bold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
              {heading}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {subtitle}
            </p>
            {!loading && (
              <p className="mt-3 text-xs font-medium text-white/60">
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
    <header className="mx-auto w-full max-w-[90rem] border-b border-site-accent-dark/10 px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6 lg:px-12">
      <h1 className="font-heading text-2xl font-bold leading-tight text-site-primary sm:text-3xl lg:text-4xl">
        {heading}
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-site-muted sm:text-base">
        {subtitle}
      </p>
      {!loading && (
        <p className="mt-2 text-xs font-medium text-site-muted">
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
