import asyncHandler from 'express-async-handler';
import {
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKET,
  uploadBufferToSupabase,
} from '../utils/supabaseStorage.js';

export const getUploadStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    configured: isSupabaseConfigured(),
    bucket: SUPABASE_STORAGE_BUCKET,
  });
});

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('Image file is required');
  }

  if (!req.file.mimetype?.startsWith('image/')) {
    res.status(400);
    throw new Error('Only image files are allowed');
  }

  const folder = (req.body.folder || 'thumbnails').replace(/[^a-zA-Z0-9/_-]/g, '') || 'thumbnails';
  const result = await uploadBufferToSupabase({
    buffer: req.file.buffer,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    folder,
  });

  res.status(201).json({
    success: true,
    url: result.publicUrl,
    publicUrl: result.publicUrl,
    path: result.path,
    bucket: result.bucket,
  });
});

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('Video file is required');
  }

  if (!req.file.mimetype?.startsWith('video/')) {
    res.status(400);
    throw new Error('Only video files are allowed');
  }

  const maxMb = Number(process.env.SUPABASE_MAX_VIDEO_MB) || 500;
  if (req.file.size > maxMb * 1024 * 1024) {
    res.status(400);
    throw new Error(`Video must be under ${maxMb} MB`);
  }

  const folder = (req.body.folder || 'videos').replace(/[^a-zA-Z0-9/_-]/g, '') || 'videos';
  const result = await uploadBufferToSupabase({
    buffer: req.file.buffer,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    folder,
  });

  res.status(201).json({
    success: true,
    url: result.publicUrl,
    publicUrl: result.publicUrl,
    videoUrl: result.publicUrl,
    path: result.path,
    bucket: result.bucket,
  });
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('Resume file is required');
  }

  const allowed = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);

  if (!allowed.has(req.file.mimetype)) {
    res.status(400);
    throw new Error('Only PDF, DOC, and DOCX files are allowed');
  }

  const result = await uploadBufferToSupabase({
    buffer: req.file.buffer,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    folder: 'resumes',
  });

  res.status(201).json({
    success: true,
    url: result.publicUrl,
    resumeUrl: result.publicUrl,
    path: result.path,
    bucket: result.bucket,
  });
});
