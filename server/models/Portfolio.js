const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // One portfolio per user
    },
    username: {
      type: String,
      required: true,
      unique: true, // Public URL identifier
      lowercase: true,
      trim: true,
    },
    headline: { type: String, default: 'Software Developer' },
    location: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    availabilityStatus: { type: String, default: 'Open to Opportunities' },
    
    about: {
      education: { type: String, default: '' },
      experience: { type: String, default: '' },
      careerGoals: { type: String, default: '' },
    },
    
    skills: {
      frontend: [{ type: String }],
      backend: [{ type: String }],
      database: [{ type: String }],
      tools: [{ type: String }],
      softSkills: [{ type: String }],
    },
    
    codingProfiles: {
      github: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      hackerrank: { type: String, default: '' },
      codeforces: { type: String, default: '' },
    },
    
    contact: {
      emailEnabled: { type: Boolean, default: true },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      accentColor: { type: String, default: 'indigo' },
      layoutStyle: { type: String, enum: ['modern', 'minimal'], default: 'modern' },
      isPublic: { type: Boolean, default: false },
      visibleSections: {
        about: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true },
        codingProfiles: { type: Boolean, default: true },
        resume: { type: Boolean, default: false }, // Private by default
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
