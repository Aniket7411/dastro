import Course from '../models/Course.js';
import CourseVideo from '../models/CourseVideo.js';
import mongoose from 'mongoose';
import { uniqueSlug } from '../utils/slugify.js';
import {
  createBunnyVideo,
  extractBunnyVideoId,
  getBunnyEmbedUrl,
  getBunnyLibraryId,
  getBunnyPlaybackInfo,
  uploadBunnyVideoFile
} from '../utils/bunnyHelper.js';
import {
  parseOptionalNonNegativeInt,
  normalizeBatchDetails,
  normalizeCurriculum,
  normalizeFaqs,
} from '../utils/coursePayload.js';
import {
  SUPABASE_STORAGE_BUCKET,
  deleteFromSupabase,
  extractPathFromPublicUrl,
  createSignedUrl,
} from '../utils/supabaseStorage.js';
import { cacheClear, cacheGet, cacheKeyFrom, cacheSet } from '../utils/ttlCache.js';

const COURSES_CACHE_NS = 'courses';
const COURSES_TTL_MS = 30_000;

async function findCourseByIdOrSlug(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Course.findById(idOrSlug).lean();
    if (byId) return byId;
  }
  return Course.findOne({ slug: String(idOrSlug).toLowerCase(), isActive: true }).lean();
}

async function resolveVideoPlayback(video) {
  const provider =
    video.videoProvider ||
    (video.videoUrl ? 'supabase' : video.vdoCipherVideoId ? 'vdocipher' : 'bunny');

  if (provider === 'supabase' && video.videoUrl) {
    const bucket = video.storageBucket || SUPABASE_STORAGE_BUCKET;
    const path = video.storagePath || extractPathFromPublicUrl(video.videoUrl, bucket);
    if (path) {
      const signedUrl = await createSignedUrl(path, bucket, 3600);
      if (signedUrl) {
        return { videoProvider: 'supabase', videoUrl: signedUrl, embedUrl: signedUrl };
      }
    }
    return {
      videoProvider: 'supabase',
      videoUrl: video.videoUrl,
      embedUrl: video.videoUrl,
    };
  }

  if (video.bunnyVideoId) {
    try {
      const bunnyPlayback = getBunnyPlaybackInfo(video.bunnyVideoId, 3600);
      return {
        videoProvider: 'bunny',
        bunnyVideoId: video.bunnyVideoId,
        embedUrl: bunnyPlayback.playbackUrl,
        signedEmbedUrl: bunnyPlayback.playbackUrl,
        expiresAt: bunnyPlayback.expiresAt,
      };
    } catch (err) {
      console.error('Bunny playback URL error:', err.message);
    }
  }

  if (video.vdoCipherVideoId && process.env.VDOCIPHER_API_SECRET) {
    try {
      const vdoRes = await fetch(`https://dev.vdocipher.com/api/videos/${video.vdoCipherVideoId}/otp`, {
        method: 'POST',
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ttl: 3600 }),
      });
      const vdoData = await vdoRes.json();
      if (vdoRes.ok) {
        return {
          videoProvider: 'vdocipher',
          vdoCipherVideoId: video.vdoCipherVideoId,
          otp: vdoData.otp,
          playbackInfo: vdoData.playbackInfo,
        };
      }
    } catch (err) {
      console.error('VdoCipher preview error:', err.message);
    }
  }

  return { videoProvider: provider, embedUrl: '' };
}

const formatInstructor = (instructor) => {
  if (!instructor) return '';
  if (typeof instructor === 'string') return instructor;
  return {
    name: instructor.name || '',
    bio: instructor.bio || '',
    image: instructor.image || '',
  };
};

const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Master'];

const normalizeLevel = (level) => {
  if (!level) return 'Beginner';
  const legacyMap = { Advanced: 'Master', 'All Levels': 'Beginner' };
  const normalized = legacyMap[level] || level;
  return COURSE_LEVELS.includes(normalized) ? normalized : 'Beginner';
};

const normalizeInstructor = (instructor) => {
  if (!instructor) return '';
  if (typeof instructor === 'string') return instructor.trim();
  return instructor.name?.trim() || '';
};

const normalizeCoursePayload = (payload = {}) => {
  const data = { ...payload };

  if (data.level !== undefined) data.level = normalizeLevel(data.level);
  if (data.instructor !== undefined) data.instructor = normalizeInstructor(data.instructor);
  if (Array.isArray(data.topics)) {
    data.topics = data.topics.map((topic) => String(topic).trim()).filter(Boolean);
  }
  if (data.description !== undefined) data.description = String(data.description).trim();
  if (data.longDesc !== undefined) data.longDesc = String(data.longDesc).trim();
  if (data.duration !== undefined) data.duration = String(data.duration).trim();
  if (data.tier !== undefined) data.tier = String(data.tier).trim();
  if (data.category !== undefined) {
    data.category = String(data.category).trim() || 'Astrology';
  }

  if (data.price !== undefined) data.price = parseOptionalNonNegativeInt(data.price);
  if (data.mrp !== undefined) data.mrp = parseOptionalNonNegativeInt(data.mrp);
  if (data.validityDays !== undefined) data.validityDays = parseOptionalNonNegativeInt(data.validityDays);

  if (data.curriculum !== undefined) data.curriculum = normalizeCurriculum(data.curriculum);
  if (data.batchDetails !== undefined) data.batchDetails = normalizeBatchDetails(data.batchDetails);
  if (data.faqs !== undefined) data.faqs = normalizeFaqs(data.faqs);

  return data;
};

const formatCourseListItem = (course, modulesCount, videoCount) => ({
  _id: course._id,
  slug: course.slug || String(course._id),
  title: course.title,
  description: course.description || '',
  thumbnailUrl: course.thumbnailUrl || '',
  price: course.price ?? null,
  mrp: course.mrp ?? null,
  courseType: course.courseType === 'Live' ? 'Live' : 'Recorded',
  category: course.category || 'Astrology',
  tier: course.tier || '',
  validityDays: course.validityDays,
  level: normalizeLevel(course.level),
  instructor: formatInstructor(course.instructor),
  duration: course.duration || '',
  topics: course.topics || [],
  modulesCount: modulesCount ?? course.modulesCount ?? 0,
  videoCount: videoCount ?? modulesCount ?? course.modulesCount ?? 0,
  isActive: course.isActive,
  createdAt: course.createdAt || null,
});

const formatCourseDetail = (course, modulesCount) => ({
  _id: course._id,
  slug: course.slug || String(course._id),
  title: course.title,
  description: course.description || '',
  thumbnailUrl: course.thumbnailUrl || '',
  price: course.price ?? null,
  mrp: course.mrp ?? null,
  courseType: course.courseType === 'Live' ? 'Live' : 'Recorded',
  category: course.category || 'Astrology',
  tier: course.tier || '',
  validityDays: course.validityDays,
  level: normalizeLevel(course.level),
  instructor: formatInstructor(course.instructor),
  duration: course.duration || '',
  modulesCount: modulesCount ?? course.modulesCount ?? 0,
  topics: course.topics || [],
  longDesc: course.longDesc || course.description || '',
  curriculum: course.curriculum || [],
  learningOutcomes: course.learningOutcomes || [],
  batchDetails: course.batchDetails || null,
  faqs: course.faqs || [],
  testimonials: course.testimonials || [],
  isActive: course.isActive,
});

const formatPublicVideo = (video) => ({
  _id: video._id,
  title: video.title,
  description: video.description || '',
  duration: video.duration || 0,
  sortOrder: video.sortOrder ?? 0,
  visibility: video.visibility === 'public' ? 'public' : 'enrolled',
});

// @desc    Get all active courses (Public)
// @route   GET /api/courses?courseType=Live|Recorded&category=slug&limit=8
export const getActiveCourses = async (req, res) => {
  try {
    const filter = { isActive: true };
    const { courseType, category, limit } = req.query;

    if (courseType === 'Live' || courseType === 'Recorded') {
      filter.courseType = courseType;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const cacheKey = cacheKeyFrom({
      courseType: courseType || '',
      category: category || '',
      limit: limit || '',
    });
    const cached = cacheGet(COURSES_CACHE_NS, cacheKey);
    if (cached) return res.json(cached);

    let query = Course.find(filter).sort({ createdAt: -1 }).lean();
    if (limit) {
      const parsed = Math.min(Math.max(parseInt(limit, 10) || 0, 1), 50);
      query = query.limit(parsed);
    }

    const courses = await query;
    const videoCounts = courses.length
      ? await CourseVideo.aggregate([
          { $match: { courseId: { $in: courses.map((course) => course._id) } } },
          { $group: { _id: '$courseId', count: { $sum: 1 } } },
        ])
      : [];
    const videoCountByCourseId = new Map(videoCounts.map((item) => [String(item._id), item.count]));
    const coursesWithVideoCounts = courses.map((course) => {
      const count = videoCountByCourseId.get(String(course._id)) || course.modulesCount || 0;
      return formatCourseListItem(course, count, count);
    });

    const payload = { success: true, courses: coursesWithVideoCounts };
    cacheSet(COURSES_CACHE_NS, cacheKey, payload, COURSES_TTL_MS);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get course by ID or slug (Public)
// @route   GET /api/courses/:idOrSlug
export const getCourseById = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let course;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      course = await Course.findById(idOrSlug).lean();
    }
    if (!course) {
      course = await Course.findOne({ slug: idOrSlug.toLowerCase(), isActive: true }).lean();
    }
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const allVideos = await CourseVideo.find({ courseId: course._id }).sort({ sortOrder: 1 });
    const lessonVideos = allVideos.filter((v) => v.visibility !== 'public');
    const previewVideos = allVideos.filter((v) => v.visibility === 'public');
    const lessonCount = lessonVideos.length || course.modulesCount || 0;

    const previewWithPlayback = await Promise.all(
      previewVideos.map(async (video) => {
        const playback = await resolveVideoPlayback(video);
        return {
          ...formatPublicVideo(video),
          ...playback,
        };
      })
    );

    res.json({
      success: true,
      course: formatCourseDetail(course, lessonCount),
      previewVideos: previewWithPlayback,
      lessonCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get public intro/preview videos with playback (no auth)
// @route   GET /api/courses/:id/preview-videos
export const getCoursePreviewVideos = async (req, res) => {
  try {
    const course = await findCourseByIdOrSlug(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const videos = await CourseVideo.find({ courseId: course._id, visibility: 'public' }).sort({
      sortOrder: 1,
    });

    const mapped = await Promise.all(
      videos.map(async (video) => {
        const playback = await resolveVideoPlayback(video);
        return {
          _id: video._id,
          title: video.title,
          description: video.description || '',
          duration: video.duration || 0,
          sortOrder: video.sortOrder ?? 0,
          visibility: 'public',
          ...playback,
        };
      })
    );

    res.json({ success: true, videos: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Get related courses for a given course (Public)
// @route   GET /api/courses/:id/related
export const getRelatedCourses = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let current;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      current = await Course.findById(idOrSlug).select('_id category courseType').lean();
    }
    if (!current) {
      current = await Course.findOne({ slug: idOrSlug.toLowerCase(), isActive: true })
        .select('_id category courseType')
        .lean();
    }
    if (!current) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const courses = await Course.find({
      isActive: true,
      _id: { $ne: current._id },
      $or: [{ category: current.category }, { courseType: current.courseType }],
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    const videoCounts = await CourseVideo.aggregate([
      { $match: { courseId: { $in: courses.map((c) => c._id) } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);
    const videoCountMap = new Map(videoCounts.map((v) => [String(v._id), v.count]));

    const related = courses.map((c) => {
      const count = videoCountMap.get(String(c._id)) || c.modulesCount || 0;
      return formatCourseListItem(c, count, count);
    });

    res.json({ success: true, courses: related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all courses for admin (includes inactive)
// @route   GET /api/admin/courses
export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    const videoCounts = await CourseVideo.aggregate([
      { $match: { courseId: { $in: courses.map((course) => course._id) } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);
    const videoCountByCourseId = new Map(videoCounts.map((item) => [String(item._id), item.count]));
    res.json({
      success: true,
      courses: courses.map((course) => {
        const count = videoCountByCourseId.get(String(course._id)) || course.modulesCount || 0;
        return formatCourseListItem(course, count, count);
      }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single course for admin edit (full document)
// @route   GET /api/admin/courses/:id
export const getAdminCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all videos for a course (Admin — includes storage metadata)
// @route   GET /api/admin/courses/:id/videos
export const getAdminCourseVideos = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const allVideos = await CourseVideo.find({ courseId: course._id }).sort({ sortOrder: 1 }).lean();
    const formatAdminVideo = (video) => ({
      ...formatPublicVideo(video),
      videoProvider: video.videoProvider || (video.videoUrl ? 'supabase' : 'bunny'),
      videoUrl: video.videoUrl || undefined,
      bunnyVideoId: video.bunnyVideoId || undefined,
      vdocipherVideoId: video.vdoCipherVideoId || undefined,
      storagePath: video.storagePath || '',
      storageBucket: video.storageBucket || '',
    });

    const lessonVideos = allVideos.filter((v) => v.visibility !== 'public');
    const previewVideos = allVideos.filter((v) => v.visibility === 'public');

    res.json({
      success: true,
      videos: lessonVideos.map(formatAdminVideo),
      previewVideos: previewVideos.map(formatAdminVideo),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Create a new course (Admin)
// @route   POST /api/admin/courses
export const createCourse = async (req, res) => {
  try {
    const {
      title, description, price, mrp, validityDays, thumbnailUrl, courseType,
      level, instructor, duration, modulesCount, curriculum,
      learningOutcomes, batchDetails, faqs, testimonials, topics, longDesc,
      slug: rawSlug, category, tier,
    } = req.body;
    const normalizedCourseType = courseType === 'Live' ? 'Live' : 'Recorded';
    const slug = await uniqueSlug(Course, rawSlug || title);
    const normalized = normalizeCoursePayload({
      title,
      slug,
      category: category?.trim() || 'Astrology',
      tier,
      description,
      longDesc,
      topics,
      price,
      mrp,
      validityDays,
      thumbnailUrl,
      courseType: normalizedCourseType,
      level,
      instructor,
      duration,
      modulesCount,
      curriculum,
      learningOutcomes,
      batchDetails,
      faqs,
      testimonials,
    });
    const course = await Course.create(normalized);
    cacheClear(COURSES_CACHE_NS);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a course (Admin)
// @route   PUT /api/admin/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const existing = await Course.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Course not found' });

    const updates = normalizeCoursePayload({
      ...req.body,
      courseType: req.body.courseType !== undefined
        ? (req.body.courseType === 'Live' ? 'Live' : 'Recorded')
        : existing.courseType,
    });
    if (updates.slug !== undefined || updates.title !== undefined) {
      updates.slug = await uniqueSlug(
        Course,
        updates.slug || updates.title || existing.title,
        existing._id
      );
    }
    if (updates.category !== undefined) {
      updates.category = updates.category?.trim() || 'Astrology';
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
    cacheClear(COURSES_CACHE_NS);
    res.json({ success: true, course });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Course slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Soft delete a course (Admin)
// @route   DELETE /api/admin/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    cacheClear(COURSES_CACHE_NS);
    res.json({ success: true, message: 'Course deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const isSupabaseProvider = (provider) => provider === 'supabase';

const parseVisibility = (value) => (value === 'public' ? 'public' : 'enrolled');

async function removeSupabaseVideoAsset(video) {
  if (!video?.videoUrl && !video?.storagePath) return;
  if (video.videoProvider && !isSupabaseProvider(video.videoProvider)) return;

  const bucket = video.storageBucket || SUPABASE_STORAGE_BUCKET;
  const path = video.storagePath || extractPathFromPublicUrl(video.videoUrl, bucket);
  if (!path) return;

  await deleteFromSupabase({ path, bucket });
}

// @desc    Add video to course (Admin)
// @route   POST /api/admin/courses/:id/videos
export const addCourseVideo = async (req, res) => {
  try {
    const {
      title,
      bunnyVideoId,
      vdocipherVideoId,
      videoProvider = 'bunny',
      videoUrl,
      storagePath,
      storageBucket,
      sortOrder,
      visibility,
    } = req.body;
    const courseId = req.params.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Video title is required' });
    }

    if (parseVisibility(visibility) === 'public') {
      const existingIntro = await CourseVideo.findOne({ courseId, visibility: 'public' });
      if (existingIntro) {
        return res.status(409).json({
          success: false,
          message: 'An introductory video already exists. Remove it before adding a new one.',
        });
      }
    }

    if (isSupabaseProvider(videoProvider)) {
      if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'Video URL is required after Supabase upload' });
      }

      const video = await CourseVideo.create({
        courseId,
        title,
        videoProvider: 'supabase',
        videoUrl,
        storagePath: storagePath || '',
        storageBucket: storageBucket || '',
        sourceType: 'supabase',
        status: 'ready',
        sortOrder: Number(sortOrder) || 0,
        visibility: parseVisibility(visibility),
      });

      return res.status(201).json({ success: true, video });
    }

    if (videoProvider === 'vdocipher') {
      if (!vdocipherVideoId) {
        return res.status(400).json({ success: false, message: 'VdoCipher video ID is required' });
      }

      const video = await CourseVideo.create({
        courseId,
        title,
        vdoCipherVideoId: vdocipherVideoId,
        videoProvider: 'vdocipher',
        sourceType: 'bunny-id',
        status: 'ready',
        sortOrder: Number(sortOrder) || 0,
        visibility: parseVisibility(visibility),
      });

      return res.status(201).json({ success: true, video });
    }

    if (!bunnyVideoId) {
      return res.status(400).json({ success: false, message: 'Video title and Bunny.net video ID or URL are required' });
    }

    const cleanBunnyVideoId = extractBunnyVideoId(bunnyVideoId);
    const bunnyLibraryId = getBunnyLibraryId();
    const video = await CourseVideo.create({
      courseId,
      title,
      bunnyVideoId: cleanBunnyVideoId,
      videoProvider: 'bunny',
      bunnyLibraryId,
      sourceType: 'bunny-id',
      status: 'ready',
      sortOrder: Number(sortOrder) || 0,
      visibility: parseVisibility(visibility),
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Upload video to Bunny Stream and add it to a course (Admin)
// @route   POST /api/admin/courses/:id/videos/upload
export const uploadCourseVideo = async (req, res) => {
  try {
    const { title, sortOrder, visibility } = req.body;
    const courseId = req.params.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Video title is required' });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'Video file is required' });
    }

    const bunnyVideo = await createBunnyVideo(title);
    const uploadResult = await uploadBunnyVideoFile(bunnyVideo.guid, req.file.buffer);

    const video = await CourseVideo.create({
      courseId,
      title,
      bunnyVideoId: bunnyVideo.guid,
      videoProvider: 'bunny',
      bunnyLibraryId: getBunnyLibraryId(),
      bunnyStatus: bunnyVideo.status ?? null,
      bunnyEncodeProgress: bunnyVideo.encodeProgress ?? null,
      sourceType: 'upload',
      sortOrder: Number(sortOrder) || 0,
      visibility: parseVisibility(visibility),
    });

    res.status(201).json({
      success: true,
      message: uploadResult.message || 'Video uploaded to Bunny.net',
      video,
      bunny: {
        guid: bunnyVideo.guid,
        status: bunnyVideo.status,
        encodeProgress: bunnyVideo.encodeProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Bunny upload failed' });
  }
};

// @desc    Update or replace a course video (Admin)
// @route   PUT /api/admin/courses/:id/videos/:vid
export const updateCourseVideo = async (req, res) => {
  try {
    const {
      title,
      bunnyVideoId,
      vdocipherVideoId,
      videoProvider,
      videoUrl,
      storagePath,
      storageBucket,
      sortOrder,
      visibility,
    } = req.body;
    const courseId = req.params.id;
    const video = await CourseVideo.findOne({ _id: req.params.vid, courseId });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (title) video.title = title;
    if (sortOrder !== undefined) video.sortOrder = Number(sortOrder) || 0;
    if (visibility !== undefined) video.visibility = parseVisibility(visibility);

    const nextProvider = videoProvider || video.videoProvider || 'supabase';

    if (isSupabaseProvider(nextProvider)) {
      if (!videoUrl && !video.videoUrl) {
        return res.status(400).json({ success: false, message: 'Supabase video URL is required' });
      }

      const nextPath = storagePath || (videoUrl ? extractPathFromPublicUrl(videoUrl, storageBucket || video.storageBucket || SUPABASE_STORAGE_BUCKET) : '');
      const currentPath = video.storagePath || extractPathFromPublicUrl(video.videoUrl, video.storageBucket || SUPABASE_STORAGE_BUCKET);
      if (videoUrl && currentPath && nextPath && currentPath !== nextPath) {
        try {
          await removeSupabaseVideoAsset(video);
        } catch (err) {
          console.error('Supabase cleanup on video replace failed:', err.message);
        }
      }

      video.videoProvider = 'supabase';
      video.sourceType = 'supabase';
      video.status = 'ready';
      if (videoUrl) video.videoUrl = videoUrl;
      if (storagePath) video.storagePath = storagePath;
      if (storageBucket) video.storageBucket = storageBucket;
      video.bunnyVideoId = undefined;
      video.vdoCipherVideoId = undefined;
      await video.save();

      return res.json({ success: true, message: 'Video updated successfully', video });
    }

    if (nextProvider === 'vdocipher') {
      const nextVdoId = vdocipherVideoId || video.vdoCipherVideoId;
      if (!nextVdoId) {
        return res.status(400).json({ success: false, message: 'VdoCipher video ID is required' });
      }

      video.videoProvider = 'vdocipher';
      video.vdoCipherVideoId = nextVdoId;
      video.sourceType = 'bunny-id';
      video.status = 'ready';
      await video.save();

      return res.json({ success: true, message: 'Video updated successfully', video });
    }

    let cleanBunnyVideoId = bunnyVideoId ? extractBunnyVideoId(bunnyVideoId) : video.bunnyVideoId;
    if (!cleanBunnyVideoId && !req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'Bunny.net video ID or URL is required' });
    }

    if (req.file?.buffer) {
      if (!cleanBunnyVideoId) {
        const bunnyVideo = await createBunnyVideo(title || video.title);
        cleanBunnyVideoId = bunnyVideo.guid;
        video.bunnyStatus = bunnyVideo.status ?? null;
        video.bunnyEncodeProgress = bunnyVideo.encodeProgress ?? null;
      }
      await uploadBunnyVideoFile(cleanBunnyVideoId, req.file.buffer);
      video.sourceType = 'upload';
    } else if (bunnyVideoId) {
      video.sourceType = 'bunny-id';
    }

    video.bunnyVideoId = cleanBunnyVideoId;
    video.videoProvider = 'bunny';
    video.bunnyLibraryId = getBunnyLibraryId();
    video.status = 'ready';
    await video.save();

    res.json({ success: true, message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Video update failed' });
  }
};

// @desc    Get signed admin preview URL for a course video
// @route   GET /api/admin/courses/:id/videos/:vid/preview
export const getAdminCourseVideoPreview = async (req, res) => {
  try {
    const courseId = req.params.id;
    const video = await CourseVideo.findOne({ _id: req.params.vid, courseId });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (isSupabaseProvider(video.videoProvider)) {
      if (!video.videoUrl) {
        return res.status(400).json({ success: false, message: 'No Supabase video URL saved for this video' });
      }

      const bucket = video.storageBucket || SUPABASE_STORAGE_BUCKET;
      const path = video.storagePath || extractPathFromPublicUrl(video.videoUrl, bucket);
      let playbackUrl = video.videoUrl;
      if (path) {
        const signed = await createSignedUrl(path, bucket, 3600);
        if (signed) playbackUrl = signed;
      }

      return res.json({
        success: true,
        video: {
          _id: video._id,
          title: video.title,
          videoUrl: playbackUrl,
          videoProvider: 'supabase',
          embedUrl: playbackUrl,
        }
      });
    }

    if (video.vdoCipherVideoId) {
      return res.json({
        success: true,
        video: {
          _id: video._id,
          title: video.title,
          vdoCipherVideoId: video.vdoCipherVideoId,
          videoProvider: 'vdocipher',
          embedUrl: '',
        }
      });
    }

    if (!video.bunnyVideoId) {
      return res.status(400).json({ success: false, message: 'No playable video reference saved for this video' });
    }

    const embedUrl = getBunnyEmbedUrl(video.bunnyVideoId, 3600);
    res.json({
      success: true,
      video: {
        _id: video._id,
        title: video.title,
        bunnyVideoId: video.bunnyVideoId,
        videoProvider: video.videoProvider || 'bunny',
        embedUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create video preview' });
  }
};

// @desc    Reorder course videos (Admin)
// @route   PUT /api/admin/courses/:id/videos/reorder
export const reorderVideos = async (req, res) => {
  try {
    const { videoOrders } = req.body; // Array of { videoId, sortOrder }
    if (!Array.isArray(videoOrders)) {
      return res.status(400).json({ success: false, message: 'videoOrders must be an array' });
    }

    const updatePromises = videoOrders.map(item =>
      CourseVideo.findByIdAndUpdate(item.videoId, { sortOrder: item.sortOrder })
    );
    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Videos reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete video from course (Admin)
// @route   DELETE /api/admin/courses/:id/videos/:vid
export const deleteCourseVideo = async (req, res) => {
  try {
    const video = await CourseVideo.findOne({ _id: req.params.vid, courseId: req.params.id });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    let storageWarning = null;
    try {
      await removeSupabaseVideoAsset(video);
    } catch (err) {
      console.error('Supabase delete failed:', err.message);
      storageWarning = err.message;
    }

    await CourseVideo.findByIdAndDelete(video._id);

    res.json({
      success: true,
      message: storageWarning
        ? `Video removed from course. Storage cleanup warning: ${storageWarning}`
        : 'Video removed',
      storageWarning: storageWarning || undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
