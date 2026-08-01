const mongoose = require('mongoose');

const jobApplicationSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Full Time', 'Part Time', 'Freelance'],
      default: 'Full Time',
    },
    employmentType: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    salaryRange: {
      type: String,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
    },
    currentStage: {
      type: String,
      default: '',
    },
    applicationStatus: {
      type: String,
      enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'HR Round', 'Final Round', 'Offer', 'Rejected', 'Accepted'],
      default: 'Saved',
    },
    source: {
      type: String,
      default: '',
    },
    jobUrl: {
      type: String,
      default: '',
    },
    recruiterName: {
      type: String,
      default: '',
    },
    recruiterEmail: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    interviewDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    // Prepared for future AI features
    aiMatchScore: {
      type: Number,
      default: null,
    },
    aiMissingSkills: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
