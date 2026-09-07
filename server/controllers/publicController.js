const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Project = require('../models/Project');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');

// --- PUBLIC ENDPOINTS (No Auth Required) ---

// @desc    Get public portfolio by username
// @route   GET /api/public/portfolio/:username
// @access  Public
const getPublicPortfolio = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();

    // Find portfolio and populate basic user info
    const portfolio = await Portfolio.findOne({ username, 'preferences.isPublic': true })
      .populate('userId', 'name profileImage bio email');

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio not found or is private');
    }

    const userId = portfolio.userId._id;

    // Fetch related public data based on visibility preferences
    let projects = [];
    if (portfolio.preferences.visibleSections.projects) {
      projects = await Project.find({ createdBy: userId });
      // In a real app we might filter by a "isPublic" flag on the project itself
    }

    let stats = null;
    if (portfolio.preferences.visibleSections.achievements) {
      // Calculate career highlights
      const interviews = await InterviewSession.find({ userId, status: 'completed' });
      const avgScore = interviews.length > 0
        ? Math.round(interviews.reduce((a, b) => a + b.overallScore, 0) / interviews.length)
        : 0;

      const resume = await Resume.findOne({ userId }).sort({ uploadDate: -1 });

      stats = {
        mockInterviewsCompleted: interviews.length,
        averageInterviewScore: avgScore,
        resumeScore: resume ? resume.resumeScore : null,
        projectsCompleted: projects.length,
      };
    }

    let resumeUrl = null;
    if (portfolio.preferences.visibleSections.resume) {
      const resume = await Resume.findOne({ userId }).sort({ uploadDate: -1 });
      if (resume) {
        resumeUrl = resume.fileUrl || `/uploads/${resume.storedFileName}`;
      }
    }

    // Format response ensuring no sensitive data is leaked
    const responseData = {
      profile: {
        name: portfolio.userId.name,
        profileImage: portfolio.userId.profileImage,
        headline: portfolio.headline,
        bio: portfolio.userId.bio,
        location: portfolio.location,
        experienceYears: portfolio.experienceYears,
        availabilityStatus: portfolio.availabilityStatus,
      },
      about: portfolio.preferences.visibleSections.about ? portfolio.about : null,
      skills: portfolio.preferences.visibleSections.skills ? portfolio.skills : null,
      contact: {
        email: portfolio.contact.emailEnabled ? portfolio.userId.email : null,
        linkedin: portfolio.contact.linkedin,
        github: portfolio.codingProfiles.github,
        twitter: portfolio.contact.twitter,
        website: portfolio.contact.website,
      },
      codingProfiles: portfolio.preferences.visibleSections.codingProfiles ? portfolio.codingProfiles : null,
      preferences: {
        theme: portfolio.preferences.theme,
        accentColor: portfolio.preferences.accentColor,
        layoutStyle: portfolio.preferences.layoutStyle,
        visibleSections: portfolio.preferences.visibleSections,
      },
      projects,
      stats,
      resumeUrl
    };

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// --- PRIVATE ENDPOINTS (JWT Auth Required) ---

// @desc    Get user's portfolio settings
// @route   GET /api/portfolio/settings
// @access  Private
const getPortfolioSettings = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });

    // Auto-create defaults if it doesn't exist
    if (!portfolio) {
      // Generate a default username from their name
      const baseUsername = req.user.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      let username = baseUsername;
      let count = 1;

      while (await Portfolio.findOne({ username })) {
        username = `${baseUsername}${count}`;
        count++;
      }

      portfolio = await Portfolio.create({
        userId: req.user.id,
        username,
      });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's portfolio settings
// @route   PUT /api/portfolio/settings
// @access  Private
const updatePortfolioSettings = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio not found');
    }

    // Check username uniqueness if they are changing it
    if (req.body.username && req.body.username !== portfolio.username) {
      const exists = await Portfolio.findOne({ username: req.body.username });
      if (exists) {
        res.status(400);
        throw new Error('Username is already taken');
      }
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPortfolio,
  getPortfolioSettings,
  updatePortfolioSettings
};
