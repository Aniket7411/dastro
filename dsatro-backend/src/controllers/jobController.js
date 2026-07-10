import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import asyncHandler from 'express-async-handler';
import { notify } from '../utils/notify.js';

// --- JOB POSTINGS (Public/Admin) ---

const formatPublicJob = (job) => ({
  _id: job._id,
  title: job.title,
  location: job.location,
  type: job.type,
  department: job.department,
  description: job.description,
  requirements: job.requirements || [],
  salaryRange: job.salaryRange || job.salary || '',
  isActive: job.isActive,
  postedAt: job.postedAt || job.createdAt,
});

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
const countApplicantsForJob = async (job) => {
  const jobId = job._id;
  const title = job.title;
  return JobApplication.countDocuments({
    $or: [
      { jobId },
      { jobId: null, appliedRole: title },
      { jobId: { $exists: false }, appliedRole: title },
    ],
  });
};

export const getJobs = asyncHandler(async (req, res) => {
  const isAdmin = Boolean(req.headers.authorization);
  const filter = isAdmin ? {} : { isActive: true };
  const jobs = await Job.find(filter).sort({ createdAt: -1 });

  const formatted = await Promise.all(
    jobs.map(async (job) => {
      const base = formatPublicJob(job);
      if (!isAdmin) return base;
      const applicantCount = await countApplicantsForJob(job);
      return { ...base, applicantCount };
    })
  );

  res.json({ success: true, jobs: formatted });
});

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json({ success: true, job });
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.json({ success: true, job: updatedJob });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    await job.deleteOne();
    res.json({ success: true, message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});


// --- JOB APPLICATIONS ---

// @desc    Submit a job application
// @route   POST /api/jobs/apply
// @access  Public
export const applyForJob = asyncHandler(async (req, res) => {
  const {
    fullName,
    name,
    email,
    phone,
    city,
    totalExperience,
    specialization,
    languages,
    appliedRole,
    jobId,
    coverLetter,
    resumeUrl,
  } = req.body;

  const applicantName = name || fullName;
  let role = appliedRole || '';
  let resolvedJobId = jobId || null;

  if (jobId) {
    const job = await Job.findById(jobId);
    role = job?.title || role || String(jobId);
    resolvedJobId = job?._id || jobId;
  } else if (role) {
    const job = await Job.findOne({ title: role });
    resolvedJobId = job?._id || null;
  }

  if (!applicantName || !email || !phone) {
    res.status(400);
    throw new Error('Name, email, and phone are required.');
  }

  if (!resumeUrl) {
    res.status(400);
    throw new Error('Resume upload is required. Please upload your resume first.');
  }

  const application = await JobApplication.create({
    fullName: applicantName,
    email,
    phone,
    city,
    totalExperience,
    specialization,
    languages,
    jobId: resolvedJobId || undefined,
    appliedRole: role,
    coverLetter,
    resumeUrl,
  });

  notify({
    title: 'New Job Application',
    message: `${applicantName} applied for ${role || 'a position'} (${specialization || 'General'})`,
    type: 'job_application',
    icon: 'fa-briefcase',
    color: 'violet',
    link: 'jobs',
    meta: { applicationId: application._id, name: applicantName, role },
  });

  res.status(201).json({ success: true, application });
});

// @desc    Get all applications (Admin)
// @route   GET /api/jobs/applications
// @access  Private/Admin
export const getApplications = asyncHandler(async (req, res) => {
  const { role, jobId, specialization, search, status } = req.query;
  const query = {};

  if (jobId) {
    const job = await Job.findById(jobId).select('title');
    query.$or = [{ jobId }];
    if (job?.title) {
      query.$or.push({ appliedRole: job.title });
    }
  } else if (role) {
    query.appliedRole = role;
  }

  if (specialization) query.specialization = specialization;
  if (status) query.status = status;
  if (search) {
    const searchClause = {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    };
    if (query.$or) {
      query.$and = [{ $or: query.$or }, searchClause];
      delete query.$or;
    } else {
      Object.assign(query, searchClause);
    }
  }

  const applications = await JobApplication.find(query).sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

// @desc    Update application status
// @route   PUT /api/jobs/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);

  if (application) {
    application.status = req.body.status || application.status;
    const updatedApplication = await application.save();
    res.json({ success: true, application: updatedApplication });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

// @desc    Delete application
// @route   DELETE /api/jobs/applications/:id
// @access  Private/Admin
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);
  if (application) {
    await application.deleteOne();
    res.json({ success: true, message: 'Application removed' });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});
