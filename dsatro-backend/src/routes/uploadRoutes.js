import express from 'express';
import multer from 'multer';
import { adminAuth } from '../middleware/authMiddleware.js';
import {
  getUploadStatus,
  uploadImage,
  uploadVideo,
  uploadResume,
} from '../controllers/uploadController.js';

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: (Number(process.env.SUPABASE_MAX_VIDEO_MB) || 500) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files are allowed'));
  },
});

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = (file.originalname || '').toLowerCase().slice(file.originalname.lastIndexOf('.'));
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  },
});

router.get('/status', getUploadStatus);
router.post('/image', adminAuth, imageUpload.single('file'), uploadImage);
router.post('/video', adminAuth, videoUpload.single('file'), uploadVideo);
router.post('/resume', resumeUpload.single('file'), uploadResume);

export default router;
