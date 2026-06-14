/**
 * Shared responsive page banner with background image + overlay.
 * Uses site-page-banner classes in index.css (left-aligned, compact height).
 */
function PageBanner({
  title,
  subtitle,
  kicker,
  image = '',
  overlayOpacity = 0.72,
  accentWord = ''
}) {
  const titleParts = accentWord && title.includes(accentWord)
    ? title.split(accentWord)
    : null;

  return (
    <section
      className="site-page-banner"
      aria-label={title}
    >
      <div
        className="site-page-banner__bg site-page-banner__bg--fallback"
        aria-hidden="true"
      />
      {image ? (
        <div
          className="site-page-banner__bg site-page-banner__bg--image"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      ) : null}
      <div
        className="site-page-banner__overlay"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
      <div className="site-page-banner__content">
        {kicker ? (
          <span className="site-page-banner__kicker">{kicker}</span>
        ) : null}
        <h1 className="site-page-banner__title">
          {titleParts ? (
            <>
              {titleParts[0]}
              <span className="site-page-banner__accent">{accentWord}</span>
              {titleParts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle ? (
          <p className="site-page-banner__subtitle">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}

export default PageBanner;
