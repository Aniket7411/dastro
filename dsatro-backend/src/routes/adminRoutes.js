import express from 'express';
import {
  createCounsellor,
  counsellorForgotPassword,
  counsellorResetPassword,
  deleteCounsellor,
  exportNeoDoveLeads,
  listCounsellors,
  listFreeConsultationLeads,
  resetCounsellorPassword,
  suspendCounsellor,
  unsuspendCounsellor,
  updateCounsellor,
} from '../controllers/freeConsultationController.js';
import multer from 'multer';
import { getDashboardStats, getConsultations, updateConsultation, getAdminUsers, getAdminOrders, approveEnrollmentAccess, updateEnrollmentAccess, updateEnrollmentValidity, confirmLeadAccess } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCourses,
  getAdminCourse,
  getAdminCourseVideos,
  addCourseVideo,
  uploadCourseVideo,
  updateCourseVideo,
  getAdminCourseVideoPreview,
  reorderVideos,
  deleteCourseVideo
} from '../controllers/courseController.js';
import {
  createBanner,
  createMaterial,
  deleteBanner,
  deleteMaterial,
  getAdminBanners,
  getAdminMaterials,
  updateBanner,
  updateMaterial
} from '../controllers/adminContentController.js';
import {
  getAdminCatalog,
  resyncCatalog,
  createCategory as createConsultationCategory,
  updateCategory as updateConsultationCategory,
  deleteCategory as deleteConsultationCategory,
  createService,
  updateService,
  deleteService,
} from '../controllers/consultationCatalogAdminController.js';
import {
  getAdminCategories as getAdminCourseCategories,
  createCategory as createCourseCategory,
  updateCategory as updateCourseCategory,
  deleteCategory as deleteCourseCategory,
} from '../controllers/courseCategoryController.js';
import {
  getAdminAstrologers,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
  suspendAstrologer,
  unsuspendAstrologer,
  setAstrologerLiveStatus,
  resetAstrologerPassword,
  getLiveSettings,
  updateLiveSettings,
  getSessionLogs,
  getSessionMessages,
} from '../controllers/astrologerController.js';

const router = express.Router();
const videoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 1024
  }
});

router.get('/stats', adminAuth, getDashboardStats);

// User & Order Management (Admin)
router.get('/users', adminAuth, getAdminUsers);
router.get('/orders', adminAuth, getAdminOrders);
router.post('/leads/:id/confirm-access', adminAuth, confirmLeadAccess);
router.put('/enrollments/:id/access', adminAuth, updateEnrollmentAccess);
router.put('/enrollments/:id/approve', adminAuth, approveEnrollmentAccess);
router.put('/enrollments/:id/validity', adminAuth, updateEnrollmentValidity);

// Course Management (Admin)
router.get('/courses', adminAuth, getAdminCourses);
router.get('/courses/:id', adminAuth, getAdminCourse);
router.get('/courses/:id/videos', adminAuth, getAdminCourseVideos);
router.post('/courses', adminAuth, createCourse);
router.put('/courses/:id', adminAuth, updateCourse);
router.delete('/courses/:id', adminAuth, deleteCourse);

// Course Video Management (Admin)
router.post('/courses/:id/videos', adminAuth, addCourseVideo);
router.post('/courses/:id/videos/upload', adminAuth, videoUpload.single('videoFile'), uploadCourseVideo);
router.put('/courses/:id/videos/reorder', adminAuth, reorderVideos);
router.get('/courses/:id/videos/:vid/preview', adminAuth, getAdminCourseVideoPreview);
router.put('/courses/:id/videos/:vid', adminAuth, videoUpload.single('videoFile'), updateCourseVideo);
router.delete('/courses/:id/videos/:vid', adminAuth, deleteCourseVideo);

// Student dashboard content management (Admin)
router.get('/banners', adminAuth, getAdminBanners);
router.post('/banners', adminAuth, createBanner);
router.put('/banners/:id', adminAuth, updateBanner);
router.delete('/banners/:id', adminAuth, deleteBanner);

router.get('/course-materials', adminAuth, getAdminMaterials);
router.post('/course-materials', adminAuth, createMaterial);
router.put('/course-materials/:id', adminAuth, updateMaterial);
router.delete('/course-materials/:id', adminAuth, deleteMaterial);

// Consultation Management (Admin)
router.get('/consultations', adminAuth, getConsultations);
router.put('/consultations/:id', adminAuth, updateConsultation);

// Course subject categories (Admin)
router.get('/course-categories', adminAuth, getAdminCourseCategories);
router.post('/course-categories', adminAuth, createCourseCategory);
router.put('/course-categories/:id', adminAuth, updateCourseCategory);
router.delete('/course-categories/:id', adminAuth, deleteCourseCategory);

// Consultation service catalog (Admin)
router.get('/consultation-catalog', adminAuth, getAdminCatalog);
router.post('/consultation-catalog/resync', adminAuth, resyncCatalog);
router.post('/consultation-categories', adminAuth, createConsultationCategory);
router.put('/consultation-categories/:slug', adminAuth, updateConsultationCategory);
router.delete('/consultation-categories/:slug', adminAuth, deleteConsultationCategory);
router.post('/consultation-services', adminAuth, createService);
router.put('/consultation-services/:slug', adminAuth, updateService);
router.delete('/consultation-services/:slug', adminAuth, deleteService);

// Astrologer Management (Admin)
router.get('/astrologers', adminAuth, getAdminAstrologers);
router.post('/astrologers', adminAuth, createAstrologer);
router.put('/astrologers/:id', adminAuth, updateAstrologer);
router.delete('/astrologers/:id', adminAuth, deleteAstrologer);
router.put('/astrologers/:id/suspend', adminAuth, suspendAstrologer);
router.put('/astrologers/:id/unsuspend', adminAuth, unsuspendAstrologer);
router.put('/astrologers/:id/live-status', adminAuth, setAstrologerLiveStatus);
router.put('/astrologers/:id/reset-password', adminAuth, resetAstrologerPassword);

// Live Chat Settings & Session Logs (Admin)
router.get('/live-settings', adminAuth, getLiveSettings);
router.put('/live-settings', adminAuth, updateLiveSettings);
router.get('/live-sessions', adminAuth, getSessionLogs);
router.get('/live-sessions/:sessionId/messages', adminAuth, getSessionMessages);

// Notifications (Admin)
router.get('/notifications/unread-count', adminAuth, getUnreadCount);
router.get('/notifications', adminAuth, getNotifications);
router.put('/notifications/read-all', adminAuth, markAllRead);
router.put('/notifications/:id/read', adminAuth, markAsRead);
router.delete('/notifications', adminAuth, clearAllNotifications);
router.delete('/notifications/:id', adminAuth, deleteNotification);

// Free consultation funnel (counsellor leads + NeoDove export)
router.get('/free-consultation/leads', adminAuth, listFreeConsultationLeads);
router.get('/free-consultation/export', adminAuth, exportNeoDoveLeads);
router.get('/counsellors', adminAuth, listCounsellors);
router.post('/counsellors', adminAuth, createCounsellor);
router.put('/counsellors/:id', adminAuth, updateCounsellor);
router.delete('/counsellors/:id', adminAuth, deleteCounsellor);
router.put('/counsellors/:id/suspend', adminAuth, suspendCounsellor);
router.put('/counsellors/:id/unsuspend', adminAuth, unsuspendCounsellor);
router.put('/counsellors/:id/reset-password', adminAuth, resetCounsellorPassword);

export default router;
