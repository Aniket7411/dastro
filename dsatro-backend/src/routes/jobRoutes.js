import express from 'express';
import { 
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  applyForJob, 
  getApplications, 
  updateApplicationStatus, 
  deleteApplication 
} from '../controllers/jobController.js';
import { adminAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public routes
router.get('/', getJobs);
router.post('/apply', applyForJob);

// Admin routes
router.post('/', adminAuth, createJob);
router.put('/:id', adminAuth, updateJob);
router.delete('/:id', adminAuth, deleteJob);

router.get('/applications', adminAuth, getApplications);
router.put('/applications/:id', adminAuth, updateApplicationStatus);
router.delete('/applications/:id', adminAuth, deleteApplication);

export default router;
