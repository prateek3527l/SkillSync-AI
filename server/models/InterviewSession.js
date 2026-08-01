const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  questionType: { type: String, enum: ['technical', 'behavioral', 'hr', 'followup'] },
  difficulty: String,
  expectedTopics: [String],
  userAnswer: { type: String, default: '' },
  timeTaken: { type: Number, default: 0 }, // seconds
  evaluation: {
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    relevanceScore: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    strengths: [String],
    improvements: [String],
  }
}, { _id: false });

const interviewSessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    interviewType: {
      type: String,
      required: true,
      enum: ['HR Interview', 'Technical Interview', 'Behavioral Interview', 'JavaScript', 'React',
             'Node.js', 'Express.js', 'MongoDB', 'SQL', 'DSA', 'System Design', 'Custom Interview'],
    },
    targetRole: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    questions: [questionSchema],
    overallScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    timeManagementScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    studyTopics: [String],
    suggestedImprovements: [String],
    startedAt: { type: Date },
    completedAt: { type: Date },
    duration: { type: Number, default: 0 }, // seconds
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    // Future AI extensions
    voiceEnabled: { type: Boolean, default: false },
    codingRoundEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
