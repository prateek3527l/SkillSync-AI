const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    notifications: {
      resumeAnalysis: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      jobReminders: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: false },
      securityAlerts: { type: Boolean, default: true },
    },
    preferences: {
      defaultDashboard: { type: String, enum: ['overview', 'projects', 'jobs', 'interviews'], default: 'overview' },
      language: { type: String, default: 'en' },
      dateFormat: { type: String, enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], default: 'MM/DD/YYYY' },
      timeZone: { type: String, default: 'UTC' },
      weeklyGoals: { type: Number, default: 5 },
      defaultInterviewType: { type: String, default: 'Behavioral Interview' },
      preferredRole: { type: String, default: 'Software Engineer' },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
