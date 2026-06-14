import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Gem,
  Loader2,
  Play,
  Shield,
  EyeOff,
} from 'lucide-react';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import { isValidIndianMobile, normalizeIndianMobile } from '../utils/validation';

const WRAP = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const CARD = 'rounded-2xl border border-site-accent-dark/12 bg-white shadow-sm';

const consultInputCls = [
  'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5',
  'text-sm font-semibold text-white outline-none transition',
  'placeholder:text-white/50 focus:border-site-accent focus:ring-2 focus:ring-site-accent/25',
].join(' ');

function CoursePlayerLoading() {
  return (
    <div className="tw-surface flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-site-bg py-16">
      <Loader2 size={32} className="animate-spin text-site-accent" />
      <p className="text-sm font-semibold text-site-muted">Loading course…</p>
    </div>
  );
}

function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [validity, setValidity] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [securityNotice, setSecurityNotice] = useState('');
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultData, setConsultData] = useState({
    preferredDatetime: '',
    notes: '',
    mobile: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const token = localStorage.getItem('studentToken');
  const protectedIdentity =
    studentProfile?.email ||
    studentProfile?.mobile ||
    localStorage.getItem('studentName') ||
    'Protected student access';

  const getVideoProvider = (video) =>
    video?.videoProvider ||
    video?.provider ||
    (video?.otp && video?.playbackInfo ? 'vdocipher' : video?.videoUrl ? 'supabase' : 'bunny');

  const getPlayerSrc = (video) => {
    if (!video) return '';

    if (getVideoProvider(video) === 'supabase') {
      return video.videoUrl || video.playbackUrl || video.signedEmbedUrl || video.embedUrl || '';
    }

    if (getVideoProvider(video) === 'vdocipher') {
      if (video.otp && video.playbackInfo) {
        return `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(video.otp)}&playbackInfo=${encodeURIComponent(video.playbackInfo)}`;
      }
      return (
        video.signedEmbedUrl ||
        video.drmEmbedUrl ||
        video.secureEmbedUrl ||
        video.embedUrl ||
        video.videoUrl ||
        video.secureUrl ||
        ''
      );
    }

    return (
      video.signedEmbedUrl ||
      video.drmEmbedUrl ||
      video.secureEmbedUrl ||
      video.embedUrl ||
      video.videoUrl ||
      video.secureUrl ||
      ''
    );
  };

  const isActiveVideo = (vid) =>
    activeVideo?._id === vid._id ||
    activeVideo?.videoId === vid.videoId ||
    activeVideo?.id === vid.id;

  const updateVideoProgress = async (videoId, isCompleted = false) => {
    if (!videoId) return;

    try {
      await fetch(`${API_BASE}/api/student/video/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: id, videoId, isCompleted }),
      });
    } catch {
      // optional
    }
  };

  const handleSelectVideo = (video) => {
    setActiveVideo(video);
    const videoId = video.videoId || video._id || video.id;
    updateVideoProgress(videoId, false);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [courseRes, videosRes, validityRes] = await Promise.all([
          fetch(`${API_BASE}/api/student/course/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/student/course/${id}/videos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/student/course/${id}/validity`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const courseData = await courseRes.json();
        const videosData = await videosRes.json();
        const validityData = await validityRes.json();

        if (!courseRes.ok || courseData.success === false) {
          throw new Error(courseData.message || 'Unable to load course details');
        }

        if (!videosRes.ok || videosData.success === false) {
          throw new Error(videosData.message || 'Unable to load course videos');
        }

        const rawCoursePayload = courseData.course || courseData.data || courseData;
        const coursePayload = {
          ...rawCoursePayload,
          id: rawCoursePayload.id || rawCoursePayload._id || rawCoursePayload.courseId,
          title: rawCoursePayload.title || rawCoursePayload.courseTitle || 'Course',
          description:
            rawCoursePayload.description ||
            rawCoursePayload.shortDescription ||
            'Continue your enrolled course lessons.',
        };
        const videosPayload = videosData.videos || videosData.data || videosData || [];
        const validityPayload = validityData.validity || validityData.data || validityData;

        setCourse(coursePayload);
        setVideos(videosPayload);
        setValidity(validityPayload);
        setActiveVideo(videosPayload.length > 0 ? videosPayload[0] : null);

        fetch(`${API_BASE}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((profileData) => {
            if (profileData.success) setStudentProfile(profileData.profile);
          })
          .catch(() => {});
      } catch (err) {
        toast.error(err.message || 'Network error loading course');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate, token]);

  useEffect(() => {
    const blockedKeys = new Set(['PrintScreen']);

    const showNotice = (message) => {
      setSecurityNotice(message);
      window.clearTimeout(window.__courseSecurityNoticeTimer);
      window.__courseSecurityNoticeTimer = window.setTimeout(() => setSecurityNotice(''), 2200);
    };

    const blockEvent = (event, message) => {
      event.preventDefault();
      event.stopPropagation();
      showNotice(message);
      return false;
    };

    const handleKeyDown = (event) => {
      const key = event.key;
      const lowerKey = key.toLowerCase();
      const isSave = (event.ctrlKey || event.metaKey) && lowerKey === 's';
      const isPrint = (event.ctrlKey || event.metaKey) && lowerKey === 'p';
      const isDevTools =
        key === 'F12' ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          ['i', 'j', 'c'].includes(lowerKey));
      const isScreenClip =
        (event.metaKey && event.shiftKey && ['3', '4', '5', 's'].includes(lowerKey)) ||
        (event.ctrlKey && event.shiftKey && lowerKey === 's');

      if (blockedKeys.has(key) || isSave || isPrint || isDevTools || isScreenClip) {
        blockEvent(event, 'Screen capture and download shortcuts are restricted for course videos.');
      }
    };

    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    const handleVisibility = () => setIsWindowFocused(!document.hidden);

    const handleContextMenu = (event) =>
      blockEvent(event, 'Right click is disabled for protected videos.');
    const handleCopy = (event) => blockEvent(event, 'Copy is disabled on protected course pages.');
    const handleDragStart = (event) =>
      blockEvent(event, 'Dragging content is disabled on protected course pages.');

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('dragstart', handleDragStart, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearTimeout(window.__courseSecurityNoticeTimer);
    };
  }, []);

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!isValidIndianMobile(consultData.mobile)) {
      toast.error('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setBookingLoading(true);
    const sanitizedMobile = normalizeIndianMobile(consultData.mobile);

    try {
      const res = await fetch(`${API_BASE}/api/student/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: id,
          preferredDatetime: consultData.preferredDatetime,
          notes: consultData.notes,
          mobile: sanitizedMobile,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Consultation request submitted! We will contact you soon.');
        setShowConsultForm(false);
      } else {
        toast.error(data.message || 'Failed to book consultation');
      }
    } catch {
      toast.error('Network error while booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <CoursePlayerLoading />;
  if (!course) return null;

  return (
    <div
      className="tw-surface min-h-screen w-full select-none bg-site-bg py-8 font-body text-site-text sm:py-10 lg:py-12"
      onContextMenu={(e) => e.preventDefault()}
    >
      <SEO
        title={course.title}
        description={course.description}
        url={`/student/course/${id}`}
      />

      {securityNotice && (
        <div className="fixed left-1/2 top-24 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-full bg-site-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg">
          <Shield size={14} />
          {securityNotice}
        </div>
      )}

      <div className={`${WRAP} pb-14 sm:pb-16`}>
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-site-primary no-underline transition hover:text-site-accent"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
          {/* Main column */}
          <div className="min-w-0 space-y-6 sm:space-y-8">
            {/* Video player */}
            <div
              className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              onContextMenu={(e) => e.preventDefault()}
            >
              {activeVideo ? (
                <>
                  {getVideoProvider(activeVideo) === 'supabase' ? (
                    <video
                      key={activeVideo.videoId || activeVideo._id}
                      src={getPlayerSrc(activeVideo)}
                      title={activeVideo.title || 'Course video'}
                      controls
                      controlsList="nodownload"
                      playsInline
                      onContextMenu={(e) => e.preventDefault()}
                      className="h-full w-full bg-black transition-[filter] duration-200"
                      style={{ filter: isWindowFocused ? 'none' : 'blur(12px)' }}
                    />
                  ) : (
                    <iframe
                      src={getPlayerSrc(activeVideo)}
                      title={activeVideo.title || 'Course video'}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-full w-full border-0 transition-[filter] duration-200"
                      style={{ filter: isWindowFocused ? 'none' : 'blur(12px)' }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media;"
                      allowFullScreen={false}
                    />
                  )}
                  <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
                    <div className="student-watermark-float text-[13px] font-bold text-white/45">
                      {protectedIdentity}
                    </div>
                    <div className="student-watermark-grid">
                      {Array.from({ length: 18 }).map((_, index) => (
                        <span key={index}>{protectedIdentity}</span>
                      ))}
                    </div>
                    {!isWindowFocused && (
                      <div className="student-focus-shield">
                        <EyeOff size={28} className="text-site-accent" />
                        <strong>Video hidden while this window is not active</strong>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-white">
                  <p className="font-heading text-lg font-bold">No videos uploaded for this course yet.</p>
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className={`${CARD} p-5 sm:p-6`}>
              <h1 className="font-heading text-xl font-extrabold text-site-primary sm:text-2xl">
                {activeVideo ? activeVideo.title : course.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-site-muted sm:text-base">
                {course.description}
              </p>
              {validity && (
                <div className="mt-5 rounded-xl border border-site-accent/20 bg-site-bg p-4 sm:p-5">
                  <p className="text-sm font-extrabold text-site-primary">Course validity</p>
                  <dl className="mt-3 space-y-2 text-sm text-site-muted">
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt>Valid from</dt>
                      <dd className="font-semibold text-site-text">{validity.validFrom || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt>Valid till</dt>
                      <dd className="font-semibold text-site-text">{validity.validTill || 'N/A'}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt>Days remaining</dt>
                      <dd className="font-bold text-site-accent-dark">
                        {validity.daysRemaining ?? 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Consultation */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-site-primary to-[#1a0a01] p-5 text-white shadow-md sm:p-6">
              <div className="course-consult-head flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-[#f5c98d] sm:text-xl">
                    <Gem size={20} />
                    Book your 1 free consultation
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#fff7ed]/90">
                    Please book this only after completing the course, otherwise discussion quality
                    may suffer.
                  </p>
                </div>
                {!showConsultForm && (
                  <button
                    type="button"
                    onClick={() => setShowConsultForm(true)}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-site-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-site-accent-dark sm:min-h-[42px]"
                  >
                    Book free consultation
                  </button>
                )}
              </div>

              {showConsultForm && (
                <form
                  onSubmit={handleConsultSubmit}
                  className="mt-6 border-t border-white/10 pt-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-1">
                      <span className="mb-1.5 block text-xs font-semibold text-white/70">
                        Mobile number (WhatsApp)
                      </span>
                      <input
                        type="tel"
                        required
                        value={consultData.mobile}
                        onChange={(e) => setConsultData({ ...consultData, mobile: e.target.value })}
                        className={consultInputCls}
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </label>
                    <label className="block sm:col-span-1">
                      <span className="mb-1.5 block text-xs font-semibold text-white/70">
                        Preferred date &amp; time
                      </span>
                      <input
                        type="datetime-local"
                        required
                        value={consultData.preferredDatetime}
                        onChange={(e) =>
                          setConsultData({ ...consultData, preferredDatetime: e.target.value })
                        }
                        className={`${consultInputCls} [color-scheme:dark]`}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold text-white/70">
                        Questions / focus areas (optional)
                      </span>
                      <textarea
                        rows={2}
                        value={consultData.notes}
                        onChange={(e) => setConsultData({ ...consultData, notes: e.target.value })}
                        className={`${consultInputCls} resize-y`}
                      />
                    </label>
                  </div>
                  <div className="course-consult-actions mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowConsultForm(false)}
                      className="rounded-xl px-4 py-2.5 text-sm font-bold text-white/80 transition hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-site-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-site-accent-dark disabled:opacity-60"
                    >
                      {bookingLoading ? 'Submitting…' : 'Confirm request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar curriculum */}
          <aside className={`${CARD} flex max-h-[800px] flex-col overflow-hidden lg:sticky lg:top-6`}>
            <div className="border-b border-site-accent-dark/10 px-5 py-4 sm:px-6 sm:py-5">
              <h2 className="font-heading text-base font-extrabold text-site-primary">
                Course curriculum
              </h2>
              <p className="mt-1 text-xs font-semibold text-site-muted">
                {videos.length} video lesson{videos.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {videos.map((vid, index) => {
                const active = isActiveVideo(vid);
                return (
                  <button
                    key={vid._id || vid.videoId || vid.id}
                    type="button"
                    onClick={() => handleSelectVideo(vid)}
                    className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition sm:px-4 sm:py-3.5 ${
                      active
                        ? 'border border-site-accent bg-site-bg'
                        : 'border border-transparent hover:bg-site-bg/80'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active
                          ? 'bg-site-accent text-white'
                          : 'bg-site-accent-dark/10 text-site-muted'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-sm leading-snug ${
                        active ? 'font-extrabold text-site-primary' : 'font-semibold text-site-text'
                      }`}
                    >
                      {vid.title}
                    </span>
                    {active && <Play size={14} className="shrink-0 text-site-muted" />}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes studentWatermarkMove {
          0% { transform: translate(0, 0); }
          25% { transform: translate(55vw, 8vh); }
          50% { transform: translate(35vw, 35vh); }
          75% { transform: translate(8vw, 22vh); }
          100% { transform: translate(0, 0); }
        }

        .student-watermark-float {
          position: absolute;
          top: 18%;
          left: 8%;
          animation: studentWatermarkMove 34s linear infinite;
          text-shadow: 0 1px 3px rgba(0,0,0,0.55);
        }

        .student-watermark-grid {
          position: absolute;
          inset: -12%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 42px 28px;
          transform: rotate(-18deg);
          opacity: 0.2;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
          text-transform: lowercase;
        }

        .student-watermark-grid span {
          white-space: nowrap;
          text-shadow: 0 1px 3px rgba(0,0,0,0.7);
        }

        .student-focus-shield {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(0,0,0,0.78);
          color: #fff;
          text-align: center;
          padding: 24px;
        }

        @media (max-width: 768px) {
          .student-watermark-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px 18px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default CoursePlayer;
