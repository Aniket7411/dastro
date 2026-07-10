import express from 'express';
import { 
  getBlogs, 
  getAdminBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/admin', adminAuth, getAdminBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', adminAuth, createBlog);
router.put('/:id', adminAuth, updateBlog);
router.delete('/:id', adminAuth, deleteBlog);

export default router;
