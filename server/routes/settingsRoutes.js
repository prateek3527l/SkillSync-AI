const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSettings);
router.put('/profile', updateProfileSettings);
router.put('/appearance', updateAppearanceSettings);
router.put('/notifications', updateNotificationsSettings);
router.put('/privacy', updatePrivacySettings);
router.put('/preferences', updatePreferencesSettings);
router.put('/connected-accounts', updateConnectedAccounts);
router.put('/connectedAccounts', updateConnectedAccounts);
router.put('/security/password', updatePassword);
router.post('/export', exportData);
router.delete('/account', deleteAccount);

module.exports = router;
