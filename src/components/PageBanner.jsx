import { PAGE_WRAP } from '../utils/siteTokens';

function PageBanner({
  title,
  subtitle,
  kicker,
  image = '',
  overlayOpacity = 0.72,
  accentWord = '',
}) {
  const titleParts =
    accentWord && title.includes(accentWord) ? title.split(accentWord) : null;

  return (
    <section
      className="relative isolate block w-full overflow-hidden"
      style={{ minHeight: 'clamp(150px, 20vw, 240px)' }}
      aria-label={title}
    >
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-site-primary to-site-accent-dark"
        aria-hidden="true"
      />
      {image ? (
        <div
          className="absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      ) : null}
      <div
        className="absolute inset-0 z-[2] bg-site-primary"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
      <div
        className={`relative z-[3] w-full py-[clamp(1.75rem,4vw,2.5rem)] text-left ${PAGE_WRAP}`}
      >
        {kicker ? (
          <span className="mb-2 block font-body text-kicker font-extrabold uppercase tracking-[0.14em] text-[#f0d4b5]">
            {kicker}
          </span>
        ) : null}
        <h1 className="mb-2 font-heading text-[clamp(1.5rem,2.5vw,1.875rem)] font-extrabold leading-tight text-white">
          {titleParts ? (
            <>
              {titleParts[0]}
              <span className="text-site-accent">{accentWord}</span>
              {titleParts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle ? (
          <p className="m-0 max-w-[40rem] text-base leading-relaxed text-white/88">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}

export default PageBanner;
