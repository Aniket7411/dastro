import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  studentLogin,
  studentLogout,
  forgotPassword,
  resetPassword,
  changePassword,
  getStudentProfile,
  updateStudentProfile,
  getMyCourses,
  getCourseDetails,
  getCourseVideos,
  updateVideoProgress,
  getCourseValidity,
  getCourseMaterials,
  getBanners,
  getMerchandise,
  getNewCourses,
  getOffers,
  bookCourseConsultation,
  getMyConsultations
} from '../controllers/studentController.js';

const router = express.Router();

// Public routes
router.post('/login', studentLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require student login)
router.use(protect);

router.post('/logout', studentLogout);

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/change-password', changePassword);

router.get('/courses', getMyCourses);
router.get('/course/:courseId', getCourseDetails);

router.get('/course/:courseId/videos', getCourseVideos);
router.post('/video/progress', updateVideoProgress);

router.get('/course/:courseId/validity', getCourseValidity);

router.get('/course/:courseId/materials', getCourseMaterials);

router.get('/banners', getBanners);
router.get('/merchandise', getMerchandise);
router.get('/new-courses', getNewCourses);
router.get('/offers', getOffers);

// Keeping original consultations route
router.post('/consultations', bookCourseConsultation);
router.get('/consultations', getMyConsultations);

export default router;
