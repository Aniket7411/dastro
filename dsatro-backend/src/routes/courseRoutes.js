import express from 'express';
import { getActiveCourses, getCourseById, getRelatedCourses, getCoursePreviewVideos } from '../controllers/courseController.js';
import { getPublicCategories } from '../controllers/courseCategoryController.js';

const router = express.Router();

router.get('/categories', getPublicCategories);
router.get('/', getActiveCourses);
router.get('/:id/related', getRelatedCourses);
router.get('/:id/preview-videos', getCoursePreviewVideos);
router.get('/:id', getCourseById);

export default router;
