import React, { useState, useEffect, useRef } from 'react';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import { invalidateCoursesCache } from '../hooks/useCourses';
import AdminCourseCategories from './AdminCourseCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, uploadVideo, fetchUploadStatus } from '../utils/uploadMedia';

const COURSE_TYPE_CONFIG = {
  Recorded: {
    optionLabel: 'Recorded Course — Buy online when payment is enabled',
    badge: 'Recorded',
    badgeClass: 'lms-type-badge--recorded',
    summary: 'Until Razorpay keys are added, visitors see ENQUIRE NOW and leads go to admin for sales callbacks. After keys are added, BUY NOW + payment + student access activate automatically.',
    flow: 'Now: ENQUIRE NOW → Lead. Later: BUY NOW → Payment → Dashboard',
    priceLabel: 'Selling price (Rs.)',
    priceHint: 'Shown on course page. Used at checkout once payment keys are configured.',
    validityLabel: 'Access validity (days)',
    validityHint: 'How long enrolled students can watch videos after purchase.',
    frontendCta: 'BUY NOW (or ENQUIRE NOW until payment live)',
    videosHint: 'Add lesson videos — unlocked for students after purchase.',
  },
  Live: {
    optionLabel: 'Live Course — Enquiry only (no online payment)',
    badge: 'Live',
    badgeClass: 'lms-type-badge--live',
    summary: 'Instructor-led live batches. No payment gateway — visitors submit an enquiry and your team contacts them.',
    flow: 'Listing → Course detail → ENQUIRE NOW → Lead in admin panel',
    priceLabel: 'Indicative price (Rs.)',
    priceHint: 'Display-only reference price. Payment is not collected online for live courses.',
    validityLabel: 'Program duration (days)',
    validityHint: 'Approximate batch length for display (e.g. 30–60 days). Not used for video access.',
    frontendCta: 'ENQUIRE NOW',
    videosHint: 'Optional intro/preview clips only. Main delivery is live classes (Zoom/Meet).',
  },
};

const getCourseTypeConfig = (type) => COURSE_TYPE_CONFIG[type === 'Live' ? 'Live' : 'Recorded'];

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoCourse, setVideoCourse] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [videoForm, setVideoForm] = useState({ title: '', bunnyVideoId: '', sortOrder: '', videoProvider: 'supabase' });
  const [videoFile, setVideoFile] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoModalLoading, setVideoModalLoading] = useState(false);
  const [editingCourseVideos, setEditingCourseVideos] = useState([]);
  const [editingCourseVideosLoading, setEditingCourseVideosLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [courseSubmitMessage, setCourseSubmitMessage] = useState('');
  const [thumbUploading, setThumbUploading] = useState(false);
  const thumbInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Astrology',
    description: '',
    longDesc: '',
    courseType: 'Recorded',
    level: 'Beginner',
    duration: '',
    instructor: '',
    topics: [],
    price: '',
    validityDays: '',
    thumbnailUrl: ''
  });
  const [topicInput, setTopicInput] = useState('');
  const [courseCategories, setCourseCategories] = useState([]);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  
  const [initialVideoForm, setInitialVideoForm] = useState({ title: '', bunnyVideoId: '', sortOrder: '', videoProvider: 'supabase' });
  const [initialVideoFile, setInitialVideoFile] = useState(null);
  const [initialVideos, setInitialVideos] = useState([]);
  const [editVideoDrafts, setEditVideoDrafts] = useState([]);

  const videoProviders = {
    supabase: {
      label: 'Supabase Storage',
      idLabel: 'Video URL',
      fieldLabel: 'Supabase Video URL',
      placeholder: 'Auto-filled after upload, or paste an existing Supabase URL',
      fileHint: 'Upload the video file first — it goes to Supabase, then the URL is saved in MongoDB.'
    },
    bunny: {
      label: 'Bunny.net',
      idLabel: 'Bunny Video ID',
      fieldLabel: 'Bunny.net Video ID or URL',
      placeholder: 'Paste Bunny Stream URL or video ID',
      fileHint: 'If a file is selected, it will be uploaded to Bunny.net automatically.'
    },
    vdocipher: {
      label: 'VdoCipher',
      idLabel: 'VdoCipher Video ID',
      fieldLabel: 'VdoCipher Video ID',
      placeholder: 'Paste VdoCipher video ID',
      fileHint: 'Upload will be connected to VdoCipher after backend keys are configured.'
    }
  };

  const getVideoProvider = (video) => video?.videoProvider || video?.provider || 'supabase';
  const getProviderConfig = (provider = 'bunny') => videoProviders[provider] || videoProviders.bunny;
  const getProviderLabel = (provider = 'bunny') => getProviderConfig(provider).label;
  const getProviderIdLabel = (provider = 'bunny') => getProviderConfig(provider).idLabel;

  const getVideoValue = (video) => {
    return (
      video?.videoUrl ||
      video?.vdocipherVideoId ||
      video?.vdoCipherVideoId ||
      video?.vdoVideoId ||
      video?.bunnyVideoId ||
      video?.signedEmbedUrl ||
      video?.drmEmbedUrl ||
      video?.secureEmbedUrl ||
      video?.videoUrl ||
      video?.url ||
      video?.playbackUrl ||
      video?.embedUrl ||
      video?.videoId ||
      video?.id ||
      ''
    );
  };

  const getVideoEmbedUrl = (video) => (
    video?.signedEmbedUrl ||
    video?.drmEmbedUrl ||
    video?.secureEmbedUrl ||
    video?.embedUrl ||
    video?.videoUrl ||
    video?.secureUrl ||
    ''
  );

  const getSavedVideoFromResponse = (data) => data?.video || data?.courseVideo || data?.bunny || null;

  const getVideoRowId = (video) => video?._id || video?.id || video?.videoId;

  const copyVideoValue = async (video) => {
    const value = getVideoValue(video);
    if (!value) {
      toast.error(`No ${getProviderIdLabel(getVideoProvider(video))} saved yet`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${getProviderIdLabel(getVideoProvider(video))} copied`);
    } catch {
      toast.error('Could not copy video ID');
    }
  };

  const openVideoPreview = async (video, courseId = videoCourse?._id || editingCourse?._id) => {
    const videoId = getVideoRowId(video);
    const token = localStorage.getItem('adminToken');

    if (!token) {
      toast.error('Admin login required');
      return;
    }

    if (!courseId || !videoId) {
      toast.error('Video preview is not available yet');
      return;
    }

    setPreviewLoadingId(videoId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos/${videoId}/preview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await parseApiResponse(res);

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to load video preview');
        return;
      }

      setPreviewVideo(data.video);
    } catch (err) {
      console.error('Failed to load video preview:', err);
      toast.error('Network error while loading video preview');
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const closeVideoPreview = () => {
    setPreviewVideo(null);
  };

  const getCourseVideoCount = (course) => (
    course?.videoCount ??
    course?.videosCount ??
    course?.videos?.length ??
    0
  );

  const syncCourseVideoCount = (courseId, videos) => {
    const count = videos?.length || 0;
    setCourses((currentCourses) => currentCourses.map((course) => (
      course._id === courseId ? { ...course, videoCount: count, videosCount: count } : course
    )));
    setVideoCourse((currentCourse) => (
      currentCourse?._id === courseId ? { ...currentCourse, videoCount: count, videosCount: count } : currentCourse
    ));
    setEditingCourse((currentCourse) => (
      currentCourse?._id === courseId ? { ...currentCourse, videoCount: count, videosCount: count } : currentCourse
    ));
  };

  const totalVideos = courses.reduce((count, course) => count + getCourseVideoCount(course), 0);
  const activeCourses = courses.filter((course) => course.isActive).length;
  const [supabaseStatus, setSupabaseStatus] = useState({ ready: false, bucket: '', issues: ['Checking upload configuration...'] });

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`);
      const data = await parseApiResponse(res);
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchUploadStatus().then(setSupabaseStatus);
    const token = localStorage.getItem('adminToken');
    fetch(`${API_BASE}/api/admin/course-categories`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourseCategories(data.categories?.filter((c) => c.isActive) || []);
      })
      .catch(() => setCourseCategories([]));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoInputChange = (e) => {
    setVideoForm({ ...videoForm, [e.target.name]: e.target.value });
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files?.[0] || null);
  };

  const resetVideoForm = () => {
    setVideoForm({ title: '', bunnyVideoId: '', sortOrder: '', videoProvider: 'supabase' });
    setVideoFile(null);
    setEditingVideoId(null);
  };

  const buildVideoDraft = ({
    localId,
    title,
    bunnyVideoId,
    sortOrder,
    file,
    fallbackOrder,
    videoProvider = 'supabase',
    videoUrl = '',
    storagePath = '',
    storageBucket = '',
  }) => ({
    localId,
    title,
    bunnyVideoId: videoUrl || bunnyVideoId,
    videoUrl: videoUrl || bunnyVideoId || '',
    storagePath,
    storageBucket,
    videoProvider,
    sortOrder: Number(sortOrder) || fallbackOrder || 0,
    file,
    sourceLabel: file
      ? `${file.name} (${getProviderLabel(videoProvider)})`
      : (videoUrl || bunnyVideoId || `${getProviderLabel(videoProvider)} pending upload`)
  });

  const resetInitialVideoForm = () => {
    setInitialVideoForm({ title: '', bunnyVideoId: '', sortOrder: '', videoProvider: 'supabase' });
    setInitialVideoFile(null);
  };

  const addInitialVideoDraft = () => {
    if (!initialVideoForm.title) {
      toast.error('Video title is required before adding it to the list');
      return;
    }

    if (!initialVideoForm.bunnyVideoId && !initialVideoFile) {
      toast.error(`Please paste a ${getProviderIdLabel(initialVideoForm.videoProvider)} or select a video file`);
      return;
    }

    setInitialVideos((current) => ([
      ...current,
      buildVideoDraft({
        localId: `${Date.now()}-${current.length}`,
        title: initialVideoForm.title,
        bunnyVideoId: initialVideoForm.bunnyVideoId,
        videoProvider: initialVideoForm.videoProvider,
        sortOrder: initialVideoForm.sortOrder,
        file: initialVideoFile,
        fallbackOrder: current.length
      })
    ]));
    resetInitialVideoForm();
  };

  const removeInitialVideoDraft = (localId) => {
    setInitialVideos((current) => current.filter((video) => video.localId !== localId));
  };

  const addEditVideoDraft = () => {
    if (!videoForm.title) {
      toast.error('Video title is required before adding it to the queue');
      return;
    }

    if (!videoForm.bunnyVideoId && !videoFile) {
      toast.error(`Please paste a ${getProviderIdLabel(videoForm.videoProvider)} or select a video file`);
      return;
    }

    setEditVideoDrafts((current) => ([
      ...current,
      buildVideoDraft({
        localId: `${Date.now()}-${current.length}`,
        title: videoForm.title,
        bunnyVideoId: videoForm.bunnyVideoId,
        videoProvider: videoForm.videoProvider,
        sortOrder: videoForm.sortOrder,
        file: videoFile,
        fallbackOrder: editingCourseVideos.length + current.length
      })
    ]));
    resetVideoForm();
  };

  const removeEditVideoDraft = (localId) => {
    setEditVideoDrafts((current) => current.filter((video) => video.localId !== localId));
  };

  const startEditingVideo = (video) => {
    setEditingVideoId(video._id || video.id || video.videoId);
    setVideoForm({
      title: video.title || '',
      bunnyVideoId: getVideoValue(video),
      sortOrder: video.sortOrder ?? '',
      videoProvider: getVideoProvider(video)
    });
    setVideoFile(null);
  };

  const resolveSupabaseVideoPayload = async (draftVideo) => {
    let videoUrl = draftVideo.videoUrl || draftVideo.bunnyVideoId || '';
    let storagePath = draftVideo.storagePath || '';
    let storageBucket = draftVideo.storageBucket || '';

    if (draftVideo.file) {
      const uploaded = await uploadVideo(draftVideo.file, 'videos');
      videoUrl = uploaded.publicUrl;
      storagePath = uploaded.path;
      storageBucket = uploaded.bucket;
    }

    if (!videoUrl) {
      throw new Error('Upload a video file or paste a Supabase video URL.');
    }

    return { videoUrl, storagePath, storageBucket };
  };

  const parseApiResponse = async (res) => {
    const text = await res.text();
    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      return {
        success: false,
        message: text.length > 180 ? `${text.slice(0, 180)}...` : text
      };
    }
  };

  const fetchCourseVideos = async (courseId) => {
    setVideoModalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}`);
      const data = await parseApiResponse(res);
      if (data.success) {
        const videos = data.videos || [];
        setCourseVideos(videos);
        syncCourseVideoCount(courseId, videos);
      } else {
        toast.error(data.message || 'Failed to load course videos');
      }
    } catch (err) {
      console.error('Failed to load course videos:', err);
      toast.error('Failed to load course videos');
    } finally {
      setVideoModalLoading(false);
    }
  };

  const openVideoModal = async (course) => {
    setVideoCourse(course);
    setShowVideoModal(true);
    resetVideoForm();
    await fetchCourseVideos(course._id);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setVideoCourse(null);
    setCourseVideos([]);
    resetVideoForm();
    setEditVideoDrafts([]);
  };

  const submitCourseVideo = async (courseId, onSuccess, videoId = editingVideoId) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Admin login required');
      return false;
    }

    if (!videoForm.title) {
      toast.error('Video title is required');
      return false;
    }

    const hasVideoFile = !!videoFile;
    const hasVideoId = !!videoForm.bunnyVideoId;

    if (!hasVideoFile && !hasVideoId) {
      toast.error(`Please provide a ${getProviderIdLabel(videoForm.videoProvider)} or select a file to upload.`);
      return false;
    }

    setVideoLoading(true);

    try {
      let res;
      const provider = videoForm.videoProvider || 'supabase';

      if (provider === 'supabase') {
        const { videoUrl, storagePath, storageBucket } = await resolveSupabaseVideoPayload({
          file: videoFile,
          bunnyVideoId: videoForm.bunnyVideoId,
          videoUrl: videoForm.bunnyVideoId,
        });

        res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : ''}`, {
          method: videoId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: videoForm.title,
            videoProvider: 'supabase',
            videoUrl,
            storagePath,
            storageBucket,
            sortOrder: Number(videoForm.sortOrder) || 0
          })
        });
      } else if (videoFile) {
        const formData = new FormData();
        formData.append('title', videoForm.title);
        formData.append('sortOrder', Number(videoForm.sortOrder) || 0);
        formData.append('videoProvider', provider);
        if (videoForm.bunnyVideoId) {
          formData.append('videoId', videoForm.bunnyVideoId);
          if (provider === 'vdocipher') {
            formData.append('vdocipherVideoId', videoForm.bunnyVideoId);
          } else {
            formData.append('bunnyVideoId', videoForm.bunnyVideoId);
          }
        }
        formData.append('videoFile', videoFile);

        res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : '/upload'}`, {
          method: videoId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      } else {
        const payload = {
          title: videoForm.title,
          videoProvider: provider,
          sortOrder: Number(videoForm.sortOrder) || 0
        };

        payload.videoId = videoForm.bunnyVideoId;
        if (provider === 'vdocipher') {
          payload.vdocipherVideoId = videoForm.bunnyVideoId;
        } else {
          payload.bunnyVideoId = videoForm.bunnyVideoId;
        }

        res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : ''}`, {
          method: videoId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await parseApiResponse(res);
      if (data.success) {
        const savedVideoId = getVideoValue(getSavedVideoFromResponse(data));
        toast.success(savedVideoId ? `${videoId ? 'Video updated' : 'Video added'}: ${savedVideoId}` : (videoId ? 'Video updated' : 'Video added to course'));
        resetVideoForm();
        if (onSuccess) await onSuccess();
        return true;
      } else {
        toast.error(data.message || (videoId ? 'Failed to update video' : 'Failed to add video'));
        return false;
      }
    } catch (err) {
      console.error('Failed to add course video:', err);
      toast.error(videoId ? 'Network error while updating video' : 'Network error while adding video');
      return false;
    } finally {
      setVideoLoading(false);
    }
  };

  const submitVideoDraft = async (courseId, draftVideo, token, videoId = null) => {
    const provider = draftVideo.videoProvider || 'supabase';
    let res;

    if (provider === 'supabase') {
      const { videoUrl, storagePath, storageBucket } = await resolveSupabaseVideoPayload(draftVideo);

      res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : ''}`, {
        method: videoId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: draftVideo.title,
          videoProvider: 'supabase',
          videoUrl,
          storagePath,
          storageBucket,
          sortOrder: Number(draftVideo.sortOrder) || 0
        })
      });
    } else if (draftVideo.file) {
      const videoData = new FormData();
      videoData.append('title', draftVideo.title);
      videoData.append('sortOrder', Number(draftVideo.sortOrder) || 0);
      videoData.append('videoProvider', provider);
      if (draftVideo.bunnyVideoId) {
        videoData.append('videoId', draftVideo.bunnyVideoId);
        if (provider === 'vdocipher') {
          videoData.append('vdocipherVideoId', draftVideo.bunnyVideoId);
        } else {
          videoData.append('bunnyVideoId', draftVideo.bunnyVideoId);
        }
      }
      videoData.append('videoFile', draftVideo.file);

      res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : '/upload'}`, {
        method: videoId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: videoData
      });
    } else {
      res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos${videoId ? `/${videoId}` : ''}`, {
        method: videoId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: draftVideo.title,
          videoId: draftVideo.bunnyVideoId,
          bunnyVideoId: provider === 'vdocipher' ? undefined : draftVideo.bunnyVideoId,
          vdocipherVideoId: provider === 'vdocipher' ? draftVideo.bunnyVideoId : undefined,
          videoProvider: provider,
          sortOrder: Number(draftVideo.sortOrder) || 0
        })
      });
    }

    const data = await parseApiResponse(res);
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Video save failed (${res.status})`);
    }
    return data;
  };

  const refreshEditingCourseVideos = async () => {
    if (!editingCourse?._id) return [];
    const res = await fetch(`${API_BASE}/api/courses/${editingCourse._id}`);
    const data = await parseApiResponse(res);
    if (!data.success) return [];
    const videos = data.videos || [];
    setEditingCourseVideos(videos);
    syncCourseVideoCount(editingCourse._id, videos);
    return videos;
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoCourse) return;
    await submitCourseVideo(videoCourse._id, () => fetchCourseVideos(videoCourse._id));
  };

  const handleAddVideoFromEditModal = async () => {
    if (!editingCourse?._id) return;
    if (editingVideoId) {
      await submitCourseVideo(editingCourse._id, refreshEditingCourseVideos);
      return;
    }
    addEditVideoDraft();
  };

  const uploadEditVideoDrafts = async () => {
    if (!editingCourse?._id || editVideoDrafts.length === 0) return;
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Admin login required');
      return;
    }

    setVideoLoading(true);
    try {
      for (let index = 0; index < editVideoDrafts.length; index += 1) {
        await submitVideoDraft(editingCourse._id, editVideoDrafts[index], token);
      }
      toast.success(`${editVideoDrafts.length} video${editVideoDrafts.length === 1 ? '' : 's'} attached`);
      setEditVideoDrafts([]);
      resetVideoForm();
      await refreshEditingCourseVideos();
    } catch (err) {
      toast.error(err.message || 'Failed to attach queued videos');
    } finally {
      setVideoLoading(false);
    }
  };

  const requestConfirm = (config) => {
    setConfirmDialog(config);
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  const runConfirmedAction = async () => {
    const action = confirmDialog?.onConfirm;
    closeConfirm();
    if (action) await action();
  };

  const handleDeleteVideo = async (videoId, courseId = videoCourse?._id, onSuccess) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Admin login required');
      return;
    }

    if (!courseId) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/courses/${courseId}/videos/${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await parseApiResponse(res);
      if (data.success) {
        toast.success('Video removed successfully');
        resetVideoForm();
        if (onSuccess) {
          await onSuccess();
        } else {
          await fetchCourseVideos(courseId);
        }
      } else {
        toast.error(data.message || 'Failed to remove video');
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
      toast.error('Network error while deleting video');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCourseSubmitting(true);
    setCourseSubmitMessage(editingCourse ? 'Saving course...' : 'Creating course...');
    const token = localStorage.getItem('adminToken');
    const url = editingCourse 
      ? `${API_BASE}/api/admin/courses/${editingCourse._id}`
      : `${API_BASE}/api/admin/courses`;
      
    const method = editingCourse ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          courseType: formData.courseType === 'Live' ? 'Live' : 'Recorded',
          price: Math.round(parseInt(String(formData.price).replace(/[^0-9]/g, ''), 10)) || 0,
          validityDays: Math.round(parseInt(String(formData.validityDays).replace(/[^0-9]/g, ''), 10)) || 0,
        })
      });
      const data = await parseApiResponse(res);
      
      if (data.success) {
        let initialVideoFailed = false;
        // If creating a new course and videos were queued, attach each one after the course exists.
        if (!editingCourse && initialVideos.length > 0) {
          const courseId = data.course._id;
          const token = localStorage.getItem('adminToken');
          setCourseSubmitMessage(`Attaching ${initialVideos.length} video${initialVideos.length === 1 ? '' : 's'}...`);
          
          for (let index = 0; index < initialVideos.length; index += 1) {
            const draftVideo = initialVideos[index];
            setCourseSubmitMessage(`${draftVideo.file ? 'Uploading' : 'Attaching'} video ${index + 1} of ${initialVideos.length}...`);

            try {
              await submitVideoDraft(courseId, { ...draftVideo, sortOrder: Number(draftVideo.sortOrder) || index }, token);
            } catch (err) {
              initialVideoFailed = true;
              console.error('Failed to add initial video:', err);
              toast.error(`Course created, but video ${index + 1} failed: ${err.message || 'Network error'}`);
              break;
            }
          }

          if (!initialVideoFailed) toast.success('Course created and videos attached.');
        }

        if (initialVideoFailed) {
          setEditingCourse(data.course);
          resetVideoForm();
          setEditingCourseVideos([]);
          setEditingCourseVideosLoading(false);
          fetchCourses();
          return;
        }
        
        if (editingCourse || initialVideos.length === 0) {
          toast.success(editingCourse ? 'Course updated!' : 'Course created!');
        }
        setInitialVideos([]);
        setShowModal(false);
        invalidateCoursesCache();
        fetchCourses();
      } else {
        toast.error(data.message || `Operation failed (${res.status})`);
      }
    } catch (err) {
      toast.error(err.message || 'Network error');
    } finally {
      setCourseSubmitting(false);
      setCourseSubmitMessage('');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await parseApiResponse(res);
      if (data.success) {
        toast.success('Course deleted');
        fetchCourses();
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const confirmDeleteCourse = (course) => {
    requestConfirm({
      title: 'Delete course?',
      message: `This will deactivate "${course.title}". Students will no longer see it as an active course.`,
      confirmLabel: 'Delete Course',
      danger: true,
      onConfirm: () => handleDelete(course._id)
    });
  };

  const confirmDeleteVideo = (video, courseId = videoCourse?._id, onSuccess) => {
    requestConfirm({
      title: 'Remove video?',
      message: `Remove "${video.title || 'this video'}" from this course?`,
      confirmLabel: 'Remove Video',
      danger: true,
      onConfirm: () => handleDeleteVideo(video._id, courseId, onSuccess)
    });
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setVideoForm({ title: '', bunnyVideoId: '', sortOrder: '', videoProvider: 'supabase' });
      setVideoFile(null);
      setEditVideoDrafts([]);
      setFormData({
        title: course.title,
        slug: course.slug || '',
        category: course.category || 'Astrology',
        description: course.description || '',
        longDesc: course.longDesc || '',
        courseType: course.courseType || 'Recorded',
        level: course.level || 'Beginner',
        duration: course.duration || '',
        instructor: course.instructor || '',
        topics: Array.isArray(course.topics) ? course.topics : [],
        price: course.price,
        validityDays: course.validityDays,
        thumbnailUrl: course.thumbnailUrl || ''
      });
      setTopicInput('');
      // Fetch videos for this course
      setEditingCourseVideosLoading(true);
      fetch(`${API_BASE}/api/courses/${course._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const videos = data.videos || [];
            setEditingCourseVideos(videos);
            syncCourseVideoCount(course._id, videos);
          }
          setEditingCourseVideosLoading(false);
        })
        .catch(() => {
          setEditingCourseVideos([]);
          setEditingCourseVideosLoading(false);
        });
    } else {
      setEditingCourse(null);
      setFormData({ title: '', slug: '', category: 'Astrology', description: '', longDesc: '', courseType: 'Recorded', level: 'Beginner', duration: '', instructor: '', topics: [], price: '', validityDays: '', thumbnailUrl: '' });
      setTopicInput('');
      resetInitialVideoForm();
      setInitialVideos([]);
      setEditVideoDrafts([]);
      setEditingCourseVideos([]);
    }
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="text-center py-5"><div className="lf-spinner"></div></div>;
  }

  return (
    <div className="lms-studio">
      <div className="lms-hero">
        <div className="lms-hero-copy">
          <span className="lms-eyebrow">Course Operations</span>
          <h2>Course Studio</h2>
          <p>Manage course details, pricing, access validity, and attached class videos from one clean workspace.</p>
        </div>
        <button className="lms-primary-action" onClick={() => openModal()}>
          <i className="fas fa-plus"></i>
          <span>New Course</span>
        </button>
      </div>

      <div
        className={`lms-supabase-status ${supabaseStatus.ready ? 'lms-supabase-status--ready' : 'lms-supabase-status--warn'}`}
        style={{
          marginBottom: '1rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          border: `1px solid ${supabaseStatus.ready ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
          background: supabaseStatus.ready ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          fontSize: '0.88rem',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
          <i className={`fas ${supabaseStatus.ready ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} style={{ marginRight: '0.45rem' }} />
          Server upload (Supabase) {supabaseStatus.ready ? 'configured' : 'not ready'}
        </strong>
        <span>Bucket: <code>{supabaseStatus.bucket}</code></span>
        {' · '}
        <span>Backend keys: {supabaseStatus.ready ? 'set' : 'missing in backend .env'}</span>
        {!supabaseStatus.ready && supabaseStatus.issues.length > 0 && (
          <ul style={{ margin: '0.5rem 0 0 1.1rem', padding: 0 }}>
            {supabaseStatus.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="lms-metrics">
        <div className="lms-metric">
          <span className="lms-metric-label">Total Courses</span>
          <strong>{courses.length}</strong>
        </div>
        <div className="lms-metric">
          <span className="lms-metric-label">Active Courses</span>
          <strong>{activeCourses}</strong>
        </div>
        <div className="lms-metric">
          <span className="lms-metric-label">Attached Videos</span>
          <strong>{totalVideos}</strong>
        </div>
        <button
          type="button"
          className="lms-primary-action"
          style={{ marginLeft: 'auto', alignSelf: 'center' }}
          onClick={() => setShowCategoryPanel((v) => !v)}
        >
          <i className={`fas fa-${showCategoryPanel ? 'chevron-up' : 'tags'}`}></i>
          <span>{showCategoryPanel ? 'Hide Categories' : 'Manage Categories'}</span>
        </button>
      </div>

      {showCategoryPanel && (
        <div className="lms-table-card" style={{ marginBottom: '1rem' }}>
          <AdminCourseCategories embedded />
        </div>
      )}

      <div className="lms-table-card">
        <div className="lms-table-head">
          <div>
            <h3>Course Library</h3>
            <p>Edit a course to add, replace, update, or delete videos. Use the camera button only to preview saved videos.</p>
          </div>
        </div>
        <table className="lms-table">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Validity</th>
              <th>Videos</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="lms-empty-row">No courses found in the database.</div>
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course._id}>
                  <td>
                    <div className="lms-course-cell">
                      <img 
                        src={course.thumbnailUrl || '/images/vedic_thumbnail.png'} 
                        alt={course.title}
                      />
                      <div>
                        <strong>{course.title}</strong>
                        <span>{course.description || 'No description added yet'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`lms-type-badge ${getCourseTypeConfig(course.courseType).badgeClass}`}>
                      {getCourseTypeConfig(course.courseType).badge}
                    </span>
                  </td>
                  <td className="lms-price">Rs. {course.price}</td>
                  <td>{course.validityDays} days</td>
                  <td>
                    <span className="lms-video-count">
                      <i className="fas fa-play-circle"></i>
                      {getCourseVideoCount(course)}
                    </span>
                  </td>
                  <td>
                    <span className={`lms-status ${course.isActive ? 'lms-status--active' : 'lms-status--inactive'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="lms-actions">
                      <button className="lms-icon-btn" title="Preview course videos" onClick={() => openVideoModal(course)}>
                        <i className="fas fa-video"></i>
                      </button>
                      <button className="lms-icon-btn" title="Edit course" onClick={() => openModal(course)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="lms-icon-btn lms-icon-btn--danger" title="Delete course" onClick={() => confirmDeleteCourse(course)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay lms-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="course-modal lms-course-modal"
            >
              {courseSubmitting && (
                <div className="lms-operation-overlay">
                  <div className="lf-spinner"></div>
                  <p>{courseSubmitMessage || 'Saving...'}</p>
                </div>
              )}
              <div className="course-modal-header">
                <div>
                  <h3 className="course-modal-title">{editingCourse ? 'Edit Course & Videos' : 'Create New Course'}</h3>
                  <p className="course-modal-subtitle">{editingCourse ? 'Update course details, video list, previews, replacements, and deletes from one place.' : 'Add course details and queue one or more videos before saving.'}</p>
                </div>
                <button type="button" className="modal-close-btn" disabled={courseSubmitting} onClick={() => setShowModal(false)}>
                  <i className="fas fa-times" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="course-form">
                <div className="form-section">
                  <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
                  </div>

                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">URL Slug</label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="auto-generated-from-title if empty"
                        />
                        <p className="form-hint">Public URL: /courses/{formData.slug || 'your-slug'}</p>
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">Subject Category</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="form-input">
                          {courseCategories.length > 0 ? (
                            courseCategories.map((cat) => (
                              <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))
                          ) : (
                            <>
                              <option value="Astrology">Astrology</option>
                              <option value="Vedic Astrology">Vedic Astrology</option>
                              <option value="Tarot">Tarot</option>
                            </>
                          )}
                        </select>
                        <p className="form-hint">Live vs Recorded is set below as Course Type.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={2}
                      placeholder="Brief summary shown on course listing cards"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Overview <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.82rem' }}>(shown on detail page)</span></label>
                    <textarea
                      name="longDesc"
                      value={formData.longDesc}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={4}
                      placeholder="Detailed description of the course, goals, and outcomes…"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">Level</label>
                        <select name="level" value={formData.level} onChange={handleInputChange} className="form-input">
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. 3 Months, 45 Hours"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Instructor Name <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.82rem' }}>(optional)</span></label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. Pankaj Soni"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">What You Will Learn <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.82rem' }}>(array list)</span></label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <input
                        type="text"
                        value={topicInput}
                        onChange={e => setTopicInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const t = topicInput.trim();
                            if (t) { setFormData(prev => ({ ...prev, topics: [...prev.topics, t] })); setTopicInput(''); }
                          }
                        }}
                        className="form-input"
                        placeholder="Type a topic and press Enter or click Add"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ whiteSpace: 'nowrap', padding: '0 14px', fontSize: '0.85rem' }}
                        onClick={() => {
                          const t = topicInput.trim();
                          if (t) { setFormData(prev => ({ ...prev, topics: [...prev.topics, t] })); setTopicInput(''); }
                        }}
                      >
                        + Add
                      </button>
                    </div>
                    {formData.topics.length > 0 && (
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {formData.topics.map((topic, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface, #f8f9fa)', borderRadius: 8, padding: '6px 10px', fontSize: '0.88rem' }}>
                            <i className="fas fa-check-circle" style={{ color: '#C8832A', fontSize: '0.8rem', flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{topic}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, topics: prev.topics.filter((_, j) => j !== i) }))}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 4px', fontSize: '0.8rem', lineHeight: 1 }}
                            >
                              <i className="fas fa-times" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {formData.topics.length === 0 && (
                      <p className="form-hint">No topics added yet. Add items students will learn in this course.</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Type</label>
                    <select name="courseType" value={formData.courseType} onChange={handleInputChange} className="form-input" required>
                      <option value="Recorded">{COURSE_TYPE_CONFIG.Recorded.optionLabel}</option>
                      <option value="Live">{COURSE_TYPE_CONFIG.Live.optionLabel}</option>
                    </select>
                  </div>

                  <div className={`lms-course-type-info ${formData.courseType === 'Live' ? 'lms-course-type-info--live' : 'lms-course-type-info--recorded'}`}>
                    <strong>{getCourseTypeConfig(formData.courseType).badge} course flow</strong>
                    <p>{getCourseTypeConfig(formData.courseType).summary}</p>
                    <p className="lms-course-type-flow">
                      <span>Frontend CTA:</span> <code>{getCourseTypeConfig(formData.courseType).frontendCta}</code>
                      <span> · </span>
                      <span>{getCourseTypeConfig(formData.courseType).flow}</span>
                    </p>
                  </div>

                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">{getCourseTypeConfig(formData.courseType).priceLabel}</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="^[0-9]+$"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          onBlur={e => {
                            const v = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                            if (!isNaN(v)) setFormData(prev => ({ ...prev, price: String(v) }));
                          }}
                          className="form-input"
                          placeholder={formData.courseType === 'Live' ? 'e.g. 15000 (display only)' : 'e.g. 3000'}
                          required
                        />
                        <p className="form-hint">{getCourseTypeConfig(formData.courseType).priceHint}</p>
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">{getCourseTypeConfig(formData.courseType).validityLabel}</label>
                        <input
                          type="number"
                          name="validityDays"
                          value={formData.validityDays}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder={formData.courseType === 'Live' ? 'e.g. 60' : 'e.g. 365'}
                          required
                        />
                        <p className="form-hint">{getCourseTypeConfig(formData.courseType).validityHint}</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Thumbnail Image
                      <span className="optional"> (Optional — uploads via backend to Supabase, URL saved in MongoDB)</span>
                    </label>

                    {/* File upload row */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <input
                        ref={thumbInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('Image must be under 5 MB.');
                            return;
                          }
                          setThumbUploading(true);
                          try {
                            const url = await uploadImage(file, 'thumbnails');
                            setFormData(prev => ({ ...prev, thumbnailUrl: url }));
                            toast.success('Image uploaded successfully!');
                          } catch (err) {
                            toast.error('Upload failed: ' + err.message);
                          } finally {
                            setThumbUploading(false);
                            if (thumbInputRef.current) thumbInputRef.current.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', height: '36px', padding: '0 14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => thumbInputRef.current?.click()}
                        disabled={thumbUploading}
                      >
                        {thumbUploading
                          ? <><span className="lf-spinner" style={{ width: '12px', height: '12px', borderTopColor: 'var(--primary)', borderColor: 'var(--border)' }} /> Uploading…</>
                          : <><i className="fas fa-cloud-upload-alt" /> Upload Image</>
                        }
                      </button>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or paste a URL below</span>
                    </div>

                    {/* URL fallback input */}
                    <input
                      type="text"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://… or /images/your_image.png"
                    />

                    {/* Preview */}
                    {formData.thumbnailUrl && (
                      <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail preview"
                          style={{ height: '80px', width: '130px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', display: 'block' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                          title="Remove image"
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#ef4444', border: 'none', color: '#fff',
                            fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <i className="fas fa-times" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="section-title">Video Management</h4>
                  <p className="section-hint">{getCourseTypeConfig(formData.courseType).videosHint}</p>
                  {editingCourse ? (
                    <>
                      <p className="section-hint">Saved videos attached to this course. Preview, edit, replace, or delete them here.</p>
                      {editingCourseVideosLoading ? (
                        <div className="text-center py-3"><div className="lf-spinner"></div></div>
                      ) : editingCourseVideos && editingCourseVideos.length > 0 ? (
                        <div className="videos-preview">
                          {editingCourseVideos.map((video) => (
                            <div key={video._id} className="video-preview-item">
                              <div className="video-preview-info">
                                <div className="video-preview-title">{video.title}</div>
                                <div className="video-preview-provider">{getProviderLabel(getVideoProvider(video))}</div>
                                <div className="video-saved-id">
                                  <span>{getProviderIdLabel(getVideoProvider(video))}</span>
                                  <code>{getVideoValue(video) || 'No video ID saved'}</code>
                                </div>
                              </div>
                              <div className="video-preview-actions">
                                <button type="button" className="lms-mini-btn" onClick={() => openVideoPreview(video, editingCourse._id)} disabled={previewLoadingId === (video._id || video.id || video.videoId)}>
                                  {previewLoadingId === (video._id || video.id || video.videoId) ? 'Loading...' : 'Preview'}
                                </button>
                                <button type="button" className="lms-mini-btn" onClick={() => copyVideoValue(video)}>
                                  Copy ID
                                </button>
                                <button type="button" className="lms-mini-btn" onClick={() => startEditingVideo(video)}>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="lms-mini-btn lms-mini-btn--danger"
                                  onClick={() => confirmDeleteVideo(video, editingCourse._id, async () => {
                                    const res = await fetch(`${API_BASE}/api/courses/${editingCourse._id}`);
                                    const data = await parseApiResponse(res);
                                    if (data.success) {
                                      const videos = data.videos || [];
                                      setEditingCourseVideos(videos);
                                      syncCourseVideoCount(editingCourse._id, videos);
                                    }
                                  })}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">No videos attached yet. Use the form below to add the first video.</div>
                      )}
                      <div className="initial-video-grid edit-video-grid">
                        <div className="form-group">
                          <label className="form-label">Video Title</label>
                          <input
                            type="text"
                            name="title"
                            value={videoForm.title}
                            onChange={handleVideoInputChange}
                            className="form-input"
                            placeholder="e.g., Lesson 2"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Video Provider</label>
                          <select
                            name="videoProvider"
                            value={videoForm.videoProvider}
                            onChange={handleVideoInputChange}
                            className="form-input"
                          >
                            <option value="supabase">Supabase Storage (recommended)</option>
                            <option value="bunny">Bunny.net</option>
                            <option value="vdocipher">VdoCipher</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">{getProviderConfig(videoForm.videoProvider).fieldLabel}</label>
                          <input
                            type="text"
                            name="bunnyVideoId"
                            value={videoForm.bunnyVideoId}
                            onChange={handleVideoInputChange}
                            className="form-input"
                            placeholder={getProviderConfig(videoForm.videoProvider).placeholder}
                          />
                          <p className="form-hint">Paste an existing {getProviderLabel(videoForm.videoProvider)} video ID, or upload a file.</p>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Upload Video File</label>
                          <div className="file-input-wrap">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoFileChange}
                            />
                          </div>
                          <p className="form-hint">{getProviderConfig(videoForm.videoProvider).fileHint}</p>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Sort Order</label>
                          <input
                            type="number"
                            name="sortOrder"
                            value={videoForm.sortOrder}
                            onChange={handleVideoInputChange}
                            className="form-input"
                            placeholder="0"
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary add-video-inline-btn"
                          disabled={videoLoading}
                          onClick={handleAddVideoFromEditModal}
                        >
                          {videoLoading ? (editingVideoId ? 'Updating...' : 'Adding...') : (editingVideoId ? 'Update Selected Video' : 'Add Video to Queue')}
                        </button>
                        {editingVideoId && (
                          <button type="button" className="btn btn-secondary add-video-inline-btn" onClick={resetVideoForm}>
                            Cancel Edit
                          </button>
                        )}
                        {editVideoDrafts.length > 0 && (
                          <div className="queued-video-list">
                            <div className="video-panel-title">
                              <h4>Queued Videos</h4>
                              <span>{editVideoDrafts.length}</span>
                            </div>
                            {editVideoDrafts.map((video, index) => (
                              <div className="queued-video-item" key={video.localId}>
                                <div className="video-item-index">{index + 1}</div>
                                <div className="queued-video-info">
                                  <strong>{video.title}</strong>
                                  <span>{video.sourceLabel}</span>
                                </div>
                                <button type="button" className="lms-mini-btn lms-mini-btn--danger" onClick={() => removeEditVideoDraft(video.localId)}>
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="btn btn-primary add-video-inline-btn"
                              disabled={videoLoading}
                              onClick={uploadEditVideoDrafts}
                            >
                              {videoLoading ? 'Uploading...' : `Upload ${editVideoDrafts.length} Queued Video${editVideoDrafts.length === 1 ? '' : 's'}`}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="initial-video-grid">
                      <p className="section-hint">Queue one or more videos now. They will be attached after the course is created.</p>

                      <div className="form-group">
                        <label className="form-label">Video Title <span className="optional">(Optional)</span></label>
                        <input 
                          type="text" 
                          value={initialVideoForm.title} 
                          onChange={(e) => setInitialVideoForm({ ...initialVideoForm, title: e.target.value })}
                          className="form-input"
                          placeholder="e.g., Introduction to Astrology"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Video Provider</label>
                        <select
                          value={initialVideoForm.videoProvider}
                          onChange={(e) => setInitialVideoForm({ ...initialVideoForm, videoProvider: e.target.value })}
                          className="form-input"
                        >
                          <option value="supabase">Supabase Storage (recommended)</option>
                          <option value="bunny">Bunny.net</option>
                          <option value="vdocipher">VdoCipher</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{getProviderConfig(initialVideoForm.videoProvider).fieldLabel} <span className="optional">(Optional)</span></label>
                        <input 
                          type="text" 
                          value={initialVideoForm.bunnyVideoId} 
                          onChange={(e) => setInitialVideoForm({ ...initialVideoForm, bunnyVideoId: e.target.value })}
                          className="form-input"
                          placeholder={getProviderConfig(initialVideoForm.videoProvider).placeholder}
                        />
                        <p className="form-hint">Paste your {getProviderLabel(initialVideoForm.videoProvider)} video ID here, OR upload a file below.</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Or Upload Video File <span className="optional">(Optional)</span></label>
                        <div className="file-input-wrap">
                          <input 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => setInitialVideoFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <p className="form-hint">{getProviderConfig(initialVideoForm.videoProvider).fileHint}</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Sort Order <span className="optional">(Optional)</span></label>
                        <input
                          type="number"
                          value={initialVideoForm.sortOrder}
                          onChange={(e) => setInitialVideoForm({ ...initialVideoForm, sortOrder: e.target.value })}
                          className="form-input"
                          placeholder="0"
                        />
                      </div>

                      <button type="button" className="btn btn-secondary add-video-inline-btn" onClick={addInitialVideoDraft}>
                        Add Video to List
                      </button>

                      {initialVideos.length > 0 && (
                        <div className="queued-video-list">
                          <div className="video-panel-title">
                            <h4>Videos Ready to Attach</h4>
                            <span>{initialVideos.length}</span>
                          </div>
                          {initialVideos.map((video, index) => (
                            <div className="queued-video-item" key={video.localId}>
                              <div className="video-item-index">{index + 1}</div>
                              <div className="queued-video-info">
                                <strong>{video.title}</strong>
                                  <span>{video.sourceLabel}</span>
                              </div>
                              <button type="button" className="lms-mini-btn lms-mini-btn--danger" onClick={() => removeInitialVideoDraft(video.localId)}>
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" disabled={courseSubmitting} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={courseSubmitting}>
                    {courseSubmitting ? 'Please wait...' : (editingCourse ? 'Save Changes' : 'Create Course')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideoModal && (
          <div className="modal-overlay lms-modal-overlay">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="video-modal lms-video-modal"
            >
              <div className="video-modal-header">
                <div>
                  <span className="lms-eyebrow">Course Videos</span>
                  <h3 className="video-modal-title">Preview Videos</h3>
                  <p className="video-modal-subtitle">{videoCourse?.title} - open Edit Course to add, replace, update, or delete videos</p>
                </div>
                <button type="button" className="modal-close-btn" onClick={closeVideoModal}><i className="fas fa-times" /></button>
              </div>

              {videoModalLoading ? (
                <div className="text-center py-4"><div className="lf-spinner"></div></div>
              ) : (
                <div className="video-modal-content">
                  <div className="video-list-panel">
                    <div className="video-panel-title">
                      <h4>Posted Videos</h4>
                      <span>{courseVideos.length}</span>
                    </div>
                    {courseVideos.length === 0 ? (
                      <div className="video-empty-state">
                        <i className="fas fa-film"></i>
                        <p>No videos attached yet.</p>
                        <button type="button" className="lms-mini-btn" onClick={() => { closeVideoModal(); openModal(videoCourse); }}>
                          Add from Edit Course
                        </button>
                      </div>
                    ) : (
                      <div className="video-list">
                        {courseVideos.map((video, index) => (
                          <div key={video._id || video.id || `${video.title || 'video'}-${index}`} className="video-item">
                            <div className="video-item-index">{index + 1}</div>
                            <div className="video-item-info">
                              <div className="video-item-title">{video.title || `Video ${index + 1}`}</div>
                              <div className="video-item-provider">{getProviderLabel(getVideoProvider(video))}</div>
                              <div className="video-saved-id">
                                <span>{getProviderIdLabel(getVideoProvider(video))}</span>
                                <code>{getVideoValue(video) || 'No video ID saved'}</code>
                              </div>
                            </div>
                            <button type="button" className="lms-mini-btn" onClick={() => openVideoPreview(video, videoCourse?._id)} disabled={previewLoadingId === (video._id || video.id || video.videoId)}>
                              {previewLoadingId === (video._id || video.id || video.videoId) ? 'Loading...' : 'Preview'}
                            </button>
                            <button type="button" className="lms-mini-btn" onClick={() => copyVideoValue(video)}>
                              Copy ID
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {courseVideos.length > 0 && (
                    <div className="video-preview-modal-actions">
                      <button type="button" className="btn btn-secondary" onClick={closeVideoModal}>
                        Close
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => { closeVideoModal(); openModal(videoCourse); }}>
                        Edit Course Videos
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDialog && (
          <div className="modal-overlay lms-confirm-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="lms-confirm-modal"
            >
              <div className={`lms-confirm-icon ${confirmDialog.danger ? 'lms-confirm-icon--danger' : ''}`}>
                <i className={`fas ${confirmDialog.danger ? 'fa-trash' : 'fa-check'}`}></i>
              </div>
              <div>
                <h3>{confirmDialog.title}</h3>
                <p>{confirmDialog.message}</p>
              </div>
              <div className="lms-confirm-actions">
                <button type="button" className="btn btn-secondary" onClick={closeConfirm}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${confirmDialog.danger ? 'lms-danger-action' : 'btn-primary'}`}
                  onClick={runConfirmedAction}
                >
                  {confirmDialog.confirmLabel || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewVideo && (
          <div className="modal-overlay lms-preview-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="lms-preview-modal"
            >
              <div className="lms-preview-header">
                <div>
                  <span className="lms-eyebrow">Video Preview</span>
                  <h3>{previewVideo.title || 'Course video'}</h3>
                  <p>{getProviderLabel(getVideoProvider(previewVideo))} - {getVideoValue(previewVideo)}</p>
                </div>
                <button type="button" className="modal-close-btn" onClick={closeVideoPreview}><i className="fas fa-times" /></button>
              </div>
              <div className="lms-preview-frame">
                {getVideoProvider(previewVideo) === 'supabase' ? (
                  <video
                    src={getVideoEmbedUrl(previewVideo)}
                    title={previewVideo.title || 'Video preview'}
                    controls
                    playsInline
                    style={{ width: '100%', height: '100%', background: '#000' }}
                  />
                ) : (
                  <iframe
                    src={getVideoEmbedUrl(previewVideo)}
                    title={previewVideo.title || 'Video preview'}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminCourses;
