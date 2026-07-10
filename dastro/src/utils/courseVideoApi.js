import API_BASE from './api';

export function mergeCourseVideosFromApi(data) {
  if (!data) return [];
  const lessons = data.videos || [];
  const previews = data.previewVideos || [];
  return [...previews, ...lessons].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function countEnrolledVideos(videos) {
  return videos?.filter((v) => v.visibility !== 'public').length ?? 0;
}

export async function fetchCoursePreviewVideos(courseIdOrSlug) {
  const res = await fetch(
    `${API_BASE}/api/courses/${encodeURIComponent(courseIdOrSlug)}/preview-videos`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Could not load preview videos');
  }
  return data.videos || [];
}

export function getVideoProvider(video) {
  if (!video) return 'bunny';
  return (
    video.videoProvider
    || (video.otp && video.playbackInfo ? 'vdocipher' : null)
    || (video.videoUrl ? 'supabase' : null)
    || 'bunny'
  );
}

export function getVideoPlayerSrc(video) {
  if (!video) return '';
  const provider = getVideoProvider(video);
  if (provider === 'supabase') {
    return video.videoUrl || video.embedUrl || '';
  }
  if (provider === 'vdocipher' && video.otp && video.playbackInfo) {
    return `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(video.otp)}&playbackInfo=${encodeURIComponent(video.playbackInfo)}`;
  }
  return video.signedEmbedUrl || video.embedUrl || '';
}
