/**
 * Home page section intro — uses Home.jsx legacy classes so headings
 * stay visible alongside Bootstrap (not TailwindPage-isolated).
 */
export default function HomeSectionHeader({
  kicker,
  title,
  titleHighlight,
  subtitle,
  subtitleClassName = '',
  id,
  align = 'center',
  className = '',
  showAccent = false,
}) {
  const center = align === 'center';

  return (
    <header
      className={`mb-6 sm:mb-8 ${center ? 'text-center' : 'text-left'} ${className}`}
      data-aos="fade-up"
    >
      {kicker ? (
        <h5 className={`section-subtitle ${center ? 'expertise-subtitle' : 'about-subtitle'}`}>
          {kicker}
        </h5>
      ) : null}

      <h2 id={id} className="section-title mt-2 sm:mt-3">
        {title}
        {titleHighlight ? (
          <>
            {' '}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        ) : null}
      </h2>

      {center && showAccent ? (
        <div
          className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-site-accent via-site-accent-dark to-site-accent sm:mt-4"
          aria-hidden
        />
      ) : null}

      {subtitle ? (
        <p
          className={`section-desc mt-3 sm:mt-4 ${center ? 'mx-auto' : ''} ${subtitleClassName}`}
          style={center && !subtitleClassName ? { maxWidth: '42rem' } : undefined}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

/** Smaller heading block inside a home section (e.g. carousel vs grid). */
export function HomeSubsectionHeader({
  title,
  titleHighlight,
  subtitle,
  subtitleClassName = '',
  className = '',
  showAccent = false,
}) {
  return (
    <div className={`mb-5 text-center sm:mb-6 ${className}`} data-aos="fade-up">
      <h3 className="home-subsection-title m-0">
        {title}
        {titleHighlight ? (
          <>
            {' '}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        ) : null}
      </h3>
      {showAccent ? (
        <div
          className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-gradient-to-r from-site-accent to-site-accent-dark"
          aria-hidden
        />
      ) : null}
      {subtitle ? (
        <p
          className={`section-desc mx-auto mt-2 mb-0 sm:mt-3 ${subtitleClassName}`}
          style={{ maxWidth: subtitleClassName ? undefined : '36rem' }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
