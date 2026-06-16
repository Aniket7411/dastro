import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
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

const WRAP = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12';
const CARD = 'rounded-2xl border border-site-accent-dark/12 bg-white shadow-sm';

const consultInputCls = [
  'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5',
  'font-body text-sm font-semibold text-white outline-none transition',
  'placeholder:text-white/50 focus:border-site-accent focus:ring-2 focus:ring-site-accent/25',
].join(' ');

function CoursePlayerLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-site-bg py-10">
      <Loader2 size={32} className="animate-spin text-site-accent" />
      <p className="font-body text-sm font-semibold text-site-muted">Loading course…</p>
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
  const [accessPending, setAccessPending] = useState(false);

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
          if (videosData.code === 'PENDING_APPROVAL' || videosRes.status === 403) {
            setAccessPending(true);
          } else {
            throw new Error(videosData.message || 'Unable to load course videos');
          }
        }

        const rawCourse = courseData.course || courseData.data || courseData;
        const coursePayload = {
          ...rawCourse,
          id: rawCourse.id || rawCourse._id || rawCourse.courseId,
          title: rawCourse.title || rawCourse.courseTitle || 'Course',
          description:
            rawCourse.description ||
            rawCourse.shortDescription ||
            'Continue your enrolled course lessons.',
        };
        const videosPayload = videosData.success === false ? [] : (videosData.videos || videosData.data || videosData || []);
        const validityPayload = validityData.validity || validityData.data || validityData;

        setCourse(coursePayload);
        setVideos(videosPayload);
        setValidity(validityPayload);
        setActiveVideo(videosPayload.length > 0 ? videosPayload[0] : null);
        setAccessPending(
          videosData.code === 'PENDING_APPROVAL'
          || rawCourse.accessApproved === false
          || rawCourse.accessStatus === 'pending'
        );

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
    const handleCopy = (event) =>
      blockEvent(event, 'Copy is disabled on protected course pages.');
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

  const activeIndex = videos.findIndex((v) => isActiveVideo(v));

  return (
    <div
      className="min-h-screen w-full select-none bg-site-bg font-body text-site-text"
      onContextMenu={(e) => e.preventDefault()}
    >
      <SEO
        title={course.title}
        description={course.description}
        url={`/student/course/${id}`}
      />

      {securityNotice && (
        <div className="fixed left-1/2 top-24 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-full bg-site-primary px-5 py-2.5 font-body text-sm font-bold text-white shadow-lg">
          <Shield size={14} />
          {securityNotice}
        </div>
      )}

      <div className={`${WRAP} py-4 pb-10 sm:py-5 sm:pb-12`}>
        {/* Back link */}
        <Link
          to="/dashboard"
          className="mb-3 inline-flex items-center gap-1.5 font-body text-sm font-bold text-site-primary no-underline transition hover:text-site-accent sm:mb-4"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to dashboard
        </Link>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

          {/* ── Left column ── */}
          <div className="min-w-0 space-y-4">

            {/* Video player — capped width so height stays compact */}
            <div className="mx-auto w-full max-w-2xl lg:max-w-3xl">
            <div
              className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
              onContextMenu={(e) => e.preventDefault()}
            >
              {accessPending ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-site-primary to-[#3a1c0c] p-6 text-center">
                  <Clock size={32} className="text-site-accent" aria-hidden />
                  <p className="!m-0 font-heading text-lg font-bold text-white">Awaiting admin approval</p>
                  <p className="!m-0 max-w-sm font-body text-sm leading-relaxed text-white/80">
                    Your enrolment is confirmed. Lesson videos unlock once an admin approves your access.
                    You can revisit the course page to watch the free introductory video.
                  </p>
                  <Link
                    to="/dashboard"
                    className="mt-2 inline-flex rounded-lg bg-white/15 px-4 py-2 font-body text-sm font-bold text-white no-underline transition hover:bg-white/25"
                  >
                    Back to dashboard
                  </Link>
                </div>
              ) : activeVideo ? (
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
                        <strong className="font-body">Video hidden while this window is not active</strong>
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
            </div>

            {/* Lesson info */}
            <div className={`${CARD} overflow-hidden`}>
              {/* Progress indicator strip */}
              {videos.length > 0 && (
                <div className="h-1 w-full bg-site-accent-dark/8">
                  <div
                    className="h-full bg-gradient-to-r from-site-accent-dark to-site-accent transition-all duration-500"
                    style={{ width: `${((activeIndex + 1) / videos.length) * 100}%` }}
                  />
                </div>
              )}

              <div className="p-4 sm:p-5">
                {/* Lesson label */}
                {videos.length > 0 && (
                  <p className="mb-1.5 font-body text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-site-accent">
                    Lesson {activeIndex + 1} of {videos.length}
                  </p>
                )}

                <h1 className="font-heading text-lg font-extrabold leading-snug text-site-primary sm:text-xl">
                  {activeVideo ? activeVideo.title : course.title}
                </h1>

                <p className="mt-2 font-body text-sm leading-relaxed text-site-muted">
                  {course.description}
                </p>

                {validity && (
                  <div className="mt-4 rounded-xl border border-site-accent-dark/10 bg-site-bg p-3.5 sm:p-4">
                    <p className="mb-2.5 font-body text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-site-accent">
                      Course validity
                    </p>
                    <dl className="space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="flex items-center gap-1.5 font-body text-xs font-semibold text-site-muted">
                          <CalendarClock size={12} className="text-site-accent-dark/60" />
                          Valid from
                        </dt>
                        <dd className="font-body text-xs font-bold text-site-primary">{validity.validFrom || 'N/A'}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="flex items-center gap-1.5 font-body text-xs font-semibold text-site-muted">
                          <CalendarClock size={12} className="text-site-accent-dark/60" />
                          Valid till
                        </dt>
                        <dd className="font-body text-xs font-bold text-site-primary">{validity.validTill || 'N/A'}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-site-accent-dark/8 pt-2.5">
                        <dt className="flex items-center gap-1.5 font-body text-xs font-semibold text-site-muted">
                          <Clock size={12} className="text-site-accent-dark/60" />
                          Days remaining
                        </dt>
                        <dd className="font-body text-xs font-black text-site-accent-dark">
                          {validity.daysRemaining ?? 'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-site-primary via-[#2e1208] to-[#1a0a01] shadow-md">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-[#f5c98d] sm:text-xl">
                      <Gem size={19} />
                      Book your 1 free consultation
                    </h2>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-[#fff7ed]/85">
                      Complete the course first — then book to get the most from your session.
                    </p>
                  </div>
                  {!showConsultForm && (
                    <button
                      type="button"
                      onClick={() => setShowConsultForm(true)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-site-accent px-5 py-2.5 font-body text-sm font-bold text-white transition hover:bg-site-accent-dark sm:min-h-[42px]"
                    >
                      <CheckCircle2 size={15} />
                      Book consultation
                    </button>
                  )}
                </div>

                {showConsultForm && (
                  <form
                    onSubmit={handleConsultSubmit}
                    className="mt-5 border-t border-white/10 pt-5"
                  >
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block font-body text-[11px] font-bold uppercase tracking-wide text-white/60">
                          Mobile (WhatsApp)
                        </span>
                        <input
                          type="tel"
                          required
                          value={consultData.mobile}
                          onChange={(e) =>
                            setConsultData({ ...consultData, mobile: e.target.value })
                          }
                          className={consultInputCls}
                          inputMode="numeric"
                          maxLength={10}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block font-body text-[11px] font-bold uppercase tracking-wide text-white/60">
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
                        <span className="mb-1.5 block font-body text-[11px] font-bold uppercase tracking-wide text-white/60">
                          Questions / focus areas (optional)
                        </span>
                        <textarea
                          rows={2}
                          value={consultData.notes}
                          onChange={(e) =>
                            setConsultData({ ...consultData, notes: e.target.value })
                          }
                          className={`${consultInputCls} resize-y`}
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowConsultForm(false)}
                        className="rounded-xl px-4 py-2.5 font-body text-sm font-bold text-white/70 transition hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-site-accent px-6 py-2.5 font-body text-sm font-bold text-white transition hover:bg-site-accent-dark disabled:opacity-60"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          'Confirm request'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar curriculum ── */}
          <aside className={`${CARD} flex flex-col overflow-hidden lg:sticky lg:top-[8.5rem] lg:max-h-[calc(100vh-9.5rem)]`}>
            {/* Header */}
            <div className="shrink-0 border-b border-site-accent-dark/10 bg-gradient-to-br from-amber-50/60 to-transparent px-4 py-3">
              <h2 className="font-heading text-sm font-extrabold text-site-primary">
                Course curriculum
              </h2>
              <p className="mt-0.5 font-body text-xs font-semibold text-site-muted">
                {videos.length} lesson{videos.length !== 1 ? 's' : ''}{' '}
                {activeIndex >= 0 && (
                  <span className="text-site-accent">· on {activeIndex + 1}</span>
                )}
              </p>
            </div>

            {/* Lesson list */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-2.5">
              {videos.length === 0 ? (
                <p className="py-8 text-center font-body text-xs font-semibold text-site-muted">
                  No lessons available yet.
                </p>
              ) : (
                videos.map((vid, index) => {
                  const active = isActiveVideo(vid);
                  return (
                    <button
                      key={vid._id || vid.videoId || vid.id}
                      type="button"
                      onClick={() => handleSelectVideo(vid)}
                      className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition ${
                        active
                          ? 'border border-site-accent/30 bg-site-accent/5 shadow-sm'
                          : 'border border-transparent hover:bg-site-bg hover:border-site-accent-dark/10'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                          active
                            ? 'bg-site-accent text-white shadow-sm'
                            : 'bg-site-accent-dark/8 text-site-muted'
                        }`}
                      >
                        {active ? <Play size={11} strokeWidth={3} /> : index + 1}
                      </span>
                      <span
                        className={`min-w-0 flex-1 font-body text-[0.8125rem] leading-snug ${
                          active
                            ? 'font-bold text-site-primary'
                            : 'font-semibold text-site-text'
                        }`}
                      >
                        {vid.title}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes studentWatermarkMove {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(55vw, 8vh); }
          50%  { transform: translate(35vw, 35vh); }
          75%  { transform: translate(8vw, 22vh); }
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
