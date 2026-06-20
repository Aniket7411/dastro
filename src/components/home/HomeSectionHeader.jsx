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
}) {
  const center = align === 'center';

  return (
    <header
      className={`mb-5 sm:mb-6 ${center ? 'text-center' : 'text-left'} ${className}`}
      data-aos="fade-up"
    >
      {kicker ? (
        <h5 className={`section-subtitle ${center ? 'expertise-subtitle' : 'about-subtitle'}`}>
          {kicker}
        </h5>
      ) : null}

      <h2 id={id} className="section-title mt-2">
        {title}
        {titleHighlight ? (
          <>
            {' '}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        ) : null}
      </h2>

      {subtitle ? (
        <p
          className={`section-desc mt-3 ${center ? 'mx-auto' : ''} ${subtitleClassName}`}
          style={center && !subtitleClassName ? { maxWidth: '650px' } : undefined}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

/** Smaller heading block inside a home section (e.g. carousel vs grid). */
export function HomeSubsectionHeader({ title, titleHighlight, subtitle, subtitleClassName = '', className = '' }) {
  return (
    <div className={`mb-4 text-center sm:mb-5 ${className}`} data-aos="fade-up">
      <h3 className="home-subsection-title m-0">
        {title}
        {titleHighlight ? (
          <>
            {' '}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        ) : null}
      </h3>
      {subtitle ? (
        <p
          className={`section-desc mx-auto mt-2 mb-0 ${subtitleClassName}`}
          style={{ maxWidth: subtitleClassName ? undefined : '560px', fontSize: '0.92rem' }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
