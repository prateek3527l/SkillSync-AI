const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Settings = require('../models/Settings');
const Project = require('../models/Project');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');
const JobApplication = require('../models/JobApplication');
const bcrypt = require('bcrypt');

// Helper to ensure Settings and Portfolio exist for user
const ensureSettingsExist = async (userId, user) => {
  let settings = await Settings.findOne({ userId });
  if (!settings) {
    settings = await Settings.create({ userId });
  }

  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) {
    const baseUsername = user.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let count = 1;
    while (await Portfolio.findOne({ username })) {
      username = `${baseUsername}${count}`;
      count++;
    }
    portfolio = await Portfolio.create({ userId, username });
  }
  return { settings, portfolio };
};

// @desc    Get all user settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    
    const { settings, portfolio } = await ensureSettingsExist(user._id, user);

    res.status(200).json({
      profile: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        username: portfolio.username,
        headline: portfolio.headline,
        location: portfolio.location,
        about: portfolio.about,
        skills: portfolio.skills,
      },
      appearance: {
        theme: portfolio.preferences.theme,
        accentColor: portfolio.preferences.accentColor,
        layoutStyle: portfolio.preferences.layoutStyle,
      },
      notifications: settings.notifications,
      privacy: {
        isPublic: portfolio.preferences.isPublic,
        visibleSections: portfolio.preferences.visibleSections,
      },
      connectedAccounts: portfolio.codingProfiles,
      preferences: settings.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile Settings
// @route   PUT /api/settings/profile
// @access  Private
const updateProfileSettings = async (req, res, next) => {
  try {
    const { name, profileImage, bio, username, headline, location, about, skills } = req.body;
    const userId = req.user.id;

    // Update User
    if (name || profileImage !== undefined || bio !== undefined) {
      const updateData = {};
      if (name) updateData.name = name;
      if (profileImage !== undefined) updateData.profileImage = profileImage;
      if (bio !== undefined) updateData.bio = bio;
      await User.findByIdAndUpdate(userId, updateData);
    }

    // Update Portfolio
    if (username || headline !== undefined || location !== undefined || about || skills) {
      if (username) {
        const existing = await Portfolio.findOne({ username });
        if (existing && existing.userId.toString() !== userId) {
          res.status(400); throw new Error('Username already taken');
        }
      }
      
      const pUpdate = {};
      if (username) pUpdate.username = username;
      if (headline !== undefined) pUpdate.headline = headline;
      if (location !== undefined) pUpdate.location = location;
      if (about) pUpdate.about = about;
      if (skills) pUpdate.skills = skills;

      await Portfolio.findOneAndUpdate({ userId }, { $set: pUpdate });
    }

    res.status(200).json({ message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Appearance Settings
// @route   PUT /api/settings/appearance
// @access  Private
const updateAppearanceSettings = async (req, res, next) => {
  try {
    const { theme, accentColor, layoutStyle } = req.body;
    await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { 'preferences.theme': theme, 'preferences.accentColor': accentColor, 'preferences.layoutStyle': layoutStyle } }
    );
    res.status(200).json({ message: 'Appearance updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Notifications Settings
// @route   PUT /api/settings/notifications
// @access  Private
const updateNotificationsSettings = async (req, res, next) => {
  try {
    await Settings.findOneAndUpdate({ userId: req.user.id }, { $set: { notifications: req.body } });
    res.status(200).json({ message: 'Notifications updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Privacy Settings
// @route   PUT /api/settings/privacy
// @access  Private
const updatePrivacySettings = async (req, res, next) => {
  try {
    const { isPublic, visibleSections } = req.body;
    await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { 'preferences.isPublic': isPublic, 'preferences.visibleSections': visibleSections } }
    );
    res.status(200).json({ message: 'Privacy updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Preferences Settings
// @route   PUT /api/settings/preferences
// @access  Private
const updatePreferencesSettings = async (req, res, next) => {
  try {
    await Settings.findOneAndUpdate({ userId: req.user.id }, { $set: { preferences: req.body } });
    res.status(200).json({ message: 'Preferences updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Connected Accounts
// @route   PUT /api/settings/connected-accounts
// @access  Private
const updateConnectedAccounts = async (req, res, next) => {
  try {
    await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { codingProfiles: req.body } }
    );
    res.status(200).json({ message: 'Connected accounts updated' });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password (Security)
// @route   PUT /api/settings/security/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) { res.status(404); throw new Error('User not found'); }
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) { res.status(401); throw new Error('Incorrect current password'); }

    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export All Data
// @route   POST /api/settings/export
// @access  Private
const exportData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [user, portfolio, projects, resumes, interviews, jobs] = await Promise.all([
      User.findById(userId).lean(),
      Portfolio.findOne({ userId }).lean(),
      Project.find({ createdBy: userId }).lean(),
      Resume.find({ userId }).lean(),
      InterviewSession.find({ userId }).lean(),
      JobApplication.find({ createdBy: userId }).lean(),
    ]);

    // Don't export password hashes
    delete user.password;

    const exportData = {
      user,
      portfolio,
      projects,
      resumes,
      interviews,
      jobs,
      exportedAt: new Date().toISOString()
    };

    res.status(200).json(exportData);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Account
// @route   DELETE /api/settings/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) { res.status(401); throw new Error('Incorrect password'); }

    const userId = user._id;

    // Delete all associated data
    await Promise.all([
      Project.deleteMany({ createdBy: userId }),
      Resume.deleteMany({ userId }),
      InterviewSession.deleteMany({ userId }),
      JobApplication.deleteMany({ createdBy: userId }),
      Portfolio.deleteOne({ userId }),
      Settings.deleteOne({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({ message: 'Account and all data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateProfileSettings,
  updateAppearanceSettings,
  updateNotificationsSettings,
  updatePrivacySettings,
  updatePreferencesSettings,
  updateConnectedAccounts,
  updatePassword,
  exportData,
  deleteAccount
};
