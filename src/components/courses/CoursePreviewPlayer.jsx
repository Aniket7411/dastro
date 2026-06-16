import { useState } from 'react';
import { Play } from 'lucide-react';
import { getVideoPlayerSrc, getVideoProvider } from '../../utils/courseVideoApi';

function PreviewFrame({ video }) {
  const src = getVideoPlayerSrc(video);
  const provider = getVideoProvider(video);

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#1a0f08] p-6 text-center">
        <p className="!m-0 font-body text-sm text-white/70">Preview is being prepared. Please check back shortly.</p>
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
        className="h-full w-full bg-black"
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
      className="h-full w-full border-0"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

export default function CoursePreviewPlayer({
  videos = [],
  loading = false,
  compact = false,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex] || videos[0];

  if (loading) {
    return (
      <div
        className={`relative aspect-video overflow-hidden rounded-xl border border-site-accent-dark/10 bg-[#1a0f08] ${className}`}
      >
        <div className="flex h-full items-center justify-center">
          <p className="!m-0 font-body text-sm text-white/60">Loading preview…</p>
        </div>
      </div>
    );
  }

  if (!videos.length) return null;

  return (
    <div className={className}>
      <div
        className={`relative aspect-video overflow-hidden rounded-xl border border-site-accent-dark/10 bg-black shadow-[0_10px_28px_rgba(0,0,0,0.14)] ${
          compact ? 'rounded-lg' : ''
        }`}
      >
        <PreviewFrame video={activeVideo} />
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-site-primary/90 px-2.5 py-1 font-body text-[0.625rem] font-bold uppercase tracking-wider text-white">
          <Play size={10} fill="currentColor" aria-hidden />
          Free preview
        </span>
      </div>

      {activeVideo?.title ? (
        <p className="!mt-2 !mb-0 font-body text-sm font-semibold text-site-primary">{activeVideo.title}</p>
      ) : null}
      {activeVideo?.description ? (
        <p className="!mt-1 !mb-0 font-body text-xs leading-relaxed text-site-muted">{activeVideo.description}</p>
      ) : null}

      {videos.length > 1 ? (
        <div className="!mt-3 flex flex-wrap gap-2">
          {videos.map((video, index) => (
            <button
              key={video._id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-lg border px-3 py-1.5 font-body text-xs font-semibold transition ${
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
