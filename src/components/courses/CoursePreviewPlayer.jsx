import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { getVideoPlayerSrc, getVideoProvider } from '../../utils/courseVideoApi';

function PreviewFrame({ video, autoPlay = false }) {
  const src = getVideoPlayerSrc(video);
  const provider = getVideoProvider(video);

  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#1a0f08] p-4 text-center">
        <p className="!m-0 font-body text-xs text-white/70 sm:text-sm">Preview is being prepared. Please check back shortly.</p>
      </div>
    );
  }

  if (provider === 'supabase') {
    return (
      <video
        key={video._id}
        src={src}
        title={video.title || 'Course preview'}
        controls
        controlsList="nodownload"
        playsInline
        autoPlay={autoPlay}
        className="absolute inset-0 h-full w-full bg-black object-cover"
      />
    );
  }

  return (
    <iframe
      key={video._id}
      src={src}
      title={video.title || 'Course preview'}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 h-full w-full border-0"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

function MobilePoster({
  posterUrl,
  title,
  onPlay,
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group absolute inset-0 w-full cursor-pointer border-0 bg-black p-0"
      aria-label={title ? `Play ${title}` : 'Play introductory video'}
    >
      <img
        src={posterUrl}
        alt={title ? `${title} preview` : 'Course preview'}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" aria-hidden />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-site-primary/95 text-white shadow-lg transition group-hover:scale-105 group-hover:bg-site-accent">
          <Play size={22} fill="currentColor" className="ml-0.5" aria-hidden />
        </span>
      </span>
      <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-site-primary/90 px-2 py-0.5 font-body text-[0.5625rem] font-bold uppercase tracking-wider text-white">
        <Play size={9} fill="currentColor" aria-hidden />
        Preview
      </span>
    </button>
  );
}

export default function CoursePreviewPlayer({
  videos = [],
  loading = false,
  compact = false,
  inline = false,
  posterUrl = '',
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobilePlaying, setMobilePlaying] = useState(false);
  const activeVideo = videos[activeIndex] || videos[0];
  const poster = posterUrl || '/images/vedic_thumbnail.png';

  useEffect(() => {
    setMobilePlaying(false);
  }, [activeIndex]);

  const frameClass = inline
    ? 'relative aspect-video w-full overflow-hidden rounded-xl border border-site-accent-dark/10 bg-black shadow-[0_6px_18px_rgba(42,15,2,0.1)]'
    : compact
      ? 'relative aspect-video w-full overflow-hidden rounded-lg border border-site-accent-dark/10 bg-black shadow-md'
      : 'relative aspect-video w-full overflow-hidden rounded-xl border border-site-accent-dark/10 bg-black shadow-[0_10px_28px_rgba(0,0,0,0.14)]';

  const wrapClass = inline ? 'w-full max-w-lg sm:max-w-xl lg:max-w-2xl' : '';

  if (loading) {
    return (
      <div className={`${wrapClass} ${className}`}>
        <div className={`${frameClass} bg-[#1a0f08]`}>
          <div className="flex h-full min-h-[10rem] items-center justify-center">
            <p className="!m-0 font-body text-xs text-white/60 sm:text-sm">Loading preview…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!videos.length) return null;

  const showMobilePoster = inline && !mobilePlaying;

  return (
    <div className={`${wrapClass} ${className}`}>
      <div className={frameClass}>
        {inline ? (
          <>
            <div className="absolute inset-0 hidden md:block">
              <PreviewFrame video={activeVideo} />
            </div>
            <div className="absolute inset-0 md:hidden">
              {showMobilePoster ? (
                <MobilePoster
                  posterUrl={poster}
                  title={activeVideo?.title}
                  onPlay={() => setMobilePlaying(true)}
                />
              ) : (
                <PreviewFrame video={activeVideo} autoPlay />
              )}
            </div>
          </>
        ) : (
          <PreviewFrame video={activeVideo} />
        )}

        {!(inline && showMobilePoster) ? (
          <span className="pointer-events-none absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-site-primary/90 px-2 py-0.5 font-body text-[0.5625rem] font-bold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.625rem]">
            <Play size={9} fill="currentColor" aria-hidden />
            Preview
          </span>
        ) : null}
      </div>

      {activeVideo?.title ? (
        <p className="!mt-2 !mb-0 font-body text-sm font-semibold text-site-primary">{activeVideo.title}</p>
      ) : null}

      {videos.length > 1 ? (
        <div className="!mt-2 flex flex-wrap gap-2">
          {videos.map((video, index) => (
            <button
              key={video._id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-lg border px-2.5 py-1 font-body text-xs font-semibold transition ${
                index === activeIndex
                  ? 'border-site-accent bg-site-accent/10 text-site-primary'
                  : 'border-site-accent-dark/15 bg-white text-site-muted hover:border-site-accent/30'
              }`}
            >
              {video.title || `Preview ${index + 1}`}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
