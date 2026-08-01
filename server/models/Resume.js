const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // One active resume per user
    },
    originalFileName: {
      type: String,
      required: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    resumeScore: {
      type: Number,
      default: 0,
    },
    aiFeedback: {
      type: [String],
      default: [],
    },
    analysis: {
      overallScore: { type: Number },
      atsScore: { type: Number },
      formattingScore: { type: Number },
      grammarScore: { type: Number },
      keywordScore: { type: Number },
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestedImprovements: [String],
      rewrittenBulletPoints: [String],
      summary: String,
      lastAnalyzedAt: Date
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
