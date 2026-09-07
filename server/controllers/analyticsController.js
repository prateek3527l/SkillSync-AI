const Project = require('../models/Project');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');
const JobApplication = require('../models/JobApplication');
const Goal = require('../models/Goal');
const User = require('../models/User');

// @desc    Get dashboard overview KPIs
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [projects, resumes, interviews, jobs, user] = await Promise.all([
      Project.countDocuments({ createdBy: userId }),
      Resume.findOne({ userId }).sort({ uploadDate: -1 }),
      InterviewSession.find({ userId, status: 'completed' }),
      JobApplication.find({ createdBy: userId }),
      User.findById(userId)
    ]);

    const totalInterviews = interviews.length;
    const avgInterviewScore = totalInterviews > 0
      ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / totalInterviews)
      : 0;

    const profileCompletion = user.profileImage && user.bio ? 100 : 85; // Simplistic for now

    const applicationsSubmitted = jobs.length;
    const interviewsScheduled = jobs.filter(j => j.currentStage === 'Interview').length;
    const offersReceived = jobs.filter(j => j.currentStage === 'Offer').length;

    res.status(200).json({
      totalProjects: projects,
      featuredProjects: 0, // Placeholder
      resumeScore: resumes ? resumes.resumeScore : 0,
      atsScore: resumes ? resumes.resumeScore : 0,
      totalInterviews,
      averageInterviewScore: avgInterviewScore,
      applicationsSubmitted,
      interviewsScheduled,
      offersReceived,
      profileCompletion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview analytics
// @route   GET /api/analytics/interviews
// @access  Private
const getInterviewAnalytics = async (req, res, next) => {
  try {
    const interviews = await InterviewSession.find({ userId: req.user.id, status: 'completed' }).sort({ completedAt: 1 });

    // Time series for scores
    const trend = interviews.map(i => ({
      date: i.completedAt.toLocaleDateString(),
      technical: i.technicalScore,
      communication: i.communicationScore,
      confidence: i.confidenceScore,
      overall: i.overallScore,
    }));

    // Radar chart data based on average
    let radar = [];
    if (interviews.length > 0) {
      const avg = (key) => Math.round(interviews.reduce((a, b) => a + (b[key]||0), 0) / interviews.length);
      radar = [
        { subject: 'Technical', A: avg('technicalScore'), fullMark: 100 },
        { subject: 'Communication', A: avg('communicationScore'), fullMark: 100 },
        { subject: 'Confidence', A: avg('confidenceScore'), fullMark: 100 },
        { subject: 'Relevance', A: avg('relevanceScore'), fullMark: 100 },
        { subject: 'Time Mgmt', A: avg('timeManagementScore'), fullMark: 100 },
      ];
    }

    res.status(200).json({ trend, radar });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs pipeline
// @route   GET /api/analytics/jobs
// @access  Private
const getJobAnalytics = async (req, res, next) => {
  try {
    const jobs = await JobApplication.find({ createdBy: req.user.id });

    const pipeline = [
      { name: 'Saved', value: jobs.filter(j => j.currentStage === 'Saved').length },
      { name: 'Applied', value: jobs.filter(j => j.currentStage === 'Applied').length },
      { name: 'Assessment', value: jobs.filter(j => j.currentStage === 'Assessment').length },
      { name: 'Interview', value: jobs.filter(j => j.currentStage === 'Interview').length },
      { name: 'Offer', value: jobs.filter(j => j.currentStage === 'Offer').length },
      { name: 'Rejected', value: jobs.filter(j => j.applicationStatus === 'Rejected').length },
    ];

    res.status(200).json({ pipeline });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent chronological activity
// @route   GET /api/analytics/activity
// @access  Private
const getActivityTimeline = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [projects, jobs, interviews] = await Promise.all([
      Project.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5),
      JobApplication.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5),
      InterviewSession.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(5),
    ]);

    let timeline = [];

    projects.forEach(p => timeline.push({
      id: `proj-${p._id}`,
      type: 'Project Created',
      description: `Created project: ${p.title}`,
      date: p.createdAt,
      icon: 'briefcase'
    }));

    jobs.forEach(j => timeline.push({
      id: `job-${j._id}`,
      type: 'Job Application',
      description: `Applied to ${j.jobTitle} at ${j.companyName}`,
      date: j.createdAt,
      icon: 'file-text'
    }));

    interviews.forEach(i => timeline.push({
      id: `int-${i._id}`,
      type: 'Interview Completed',
      description: `Completed ${i.interviewType} (Score: ${i.overallScore})`,
      date: i.completedAt,
      icon: 'monitor'
    }));

    // Sort by date descending
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(timeline.slice(0, 10)); // Top 10 recent
  } catch (error) {
    next(error);
  }
};

// @desc    Get goals
// @route   GET /api/analytics/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    let goals = await Goal.find({ userId: req.user.id });

    // Seed some goals if empty for demonstration
    if (goals.length === 0) {
      goals = await Goal.insertMany([
        { userId: req.user.id, title: 'Complete 5 Projects', category: 'Projects', targetValue: 5, currentValue: 2 },
        { userId: req.user.id, title: 'Apply to 50 Jobs', category: 'Applications', targetValue: 50, currentValue: 12 },
        { userId: req.user.id, title: 'Complete 10 Mock Interviews', category: 'Interviews', targetValue: 10, currentValue: 3 },
      ]);
    }

    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getInterviewAnalytics,
  getJobAnalytics,
  getActivityTimeline,
  getGoals
};
