const JobApplication = require('../models/JobApplication');

// @desc    Get all job applications for user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
  try {
    const jobs = await JobApplication.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job application
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res, next) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job application not found');
    }
    if (job.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    const job = await JobApplication.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res, next) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job application not found');
    }
    if (job.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    const updated = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job application not found');
    }
    if (job.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }
    await job.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Job application deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
