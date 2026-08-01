import { useState, useEffect, useContext } from 'react';
import { 
  User, Palette, Bell, Shield, Lock, Link as LinkIcon, 
  Settings as SettingsIcon, Database, AlertOctagon 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

import DataExportTab from '../components/settings/DataExportTab';
import DangerZoneTab from '../components/settings/DangerZoneTab';

export default function SettingsPage() {
  const { user, loadUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Security tab state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      setSettings(res.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, data) => {
    setSaving(true);
    try {
      await api.put(`/api/settings/${section}`, data);
      toast.success('Settings saved successfully');
      if (section === 'profile') loadUser(); // Refresh global user context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/api/settings/security/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-gray-500">Loading your settings...</div>;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'accounts', label: 'Connected Accounts', icon: LinkIcon },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Export', icon: Database },
    { id: 'danger', label: 'Danger Zone', icon: AlertOctagon, danger: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and personal details.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? (tab.danger ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white')
                    : (tab.danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive && !tab.danger ? 'text-primary-500' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Public Profile</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">This information will be displayed publicly on your portfolio.</p>
              </div>
              <div className="card space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" value={settings.profile.name} onChange={e => handleChange('profile', 'name', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Professional Headline</label>
                  <input type="text" value={settings.profile.headline} onChange={e => handleChange('profile', 'headline', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea rows={4} value={settings.profile.bio} onChange={e => handleChange('profile', 'bio', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" value={settings.profile.location} onChange={e => handleChange('profile', 'location', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <button onClick={() => handleSave('profile', settings.profile)} disabled={saving} className="btn-primary">Save Profile</button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize how SkillSync AI looks to you and your visitors.</p>
              </div>
              <div className="card space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <select value={settings.appearance.theme} onChange={e => handleChange('appearance', 'theme', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm">
                    <option value="system">System Default</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Accent Color</label>
                  <select value={settings.appearance.accentColor} onChange={e => handleChange('appearance', 'accentColor', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm">
                    <option value="indigo">Indigo</option>
                    <option value="blue">Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
                <button onClick={() => handleSave('appearance', settings.appearance)} disabled={saving} className="btn-primary mt-4">Save Appearance</button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage how and when you receive updates.</p>
              </div>
              <div className="card space-y-4">
                {Object.entries(settings.notifications).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={val} 
                      onChange={e => handleChange('notifications', key, e.target.checked)} 
                      className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" 
                    />
                  </label>
                ))}
                <button onClick={() => handleSave('notifications', settings.notifications)} disabled={saving} className="btn-primary mt-4">Save Notifications</button>
              </div>
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Privacy</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control what information is visible on your public portfolio.</p>
              </div>
              <div className="card space-y-4">
                <label className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700">
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.isPublic} 
                    onChange={e => handleChange('privacy', 'isPublic', e.target.checked)} 
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" 
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Enable Public Portfolio</p>
                    <p className="text-xs text-gray-500">Allow recruiters to view your portfolio via your unique link.</p>
                  </div>
                </label>
                
                <h3 className="text-sm font-bold mt-4 mb-2">Visible Sections</h3>
                {Object.entries(settings.privacy.visibleSections).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between py-2 cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <input 
                      type="checkbox" 
                      checked={val} 
                      onChange={e => {
                        const newSections = { ...settings.privacy.visibleSections, [key]: e.target.checked };
                        handleChange('privacy', 'visibleSections', newSections);
                      }} 
                      className="w-5 h-5 text-primary-600 rounded border-gray-300" 
                    />
                  </label>
                ))}
                <button onClick={() => handleSave('privacy', settings.privacy)} disabled={saving} className="btn-primary mt-4">Save Privacy</button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Security</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password and secure your account.</p>
              </div>
              <form onSubmit={handlePasswordChange} className="card space-y-4">
                <h3 className="text-md font-bold mb-2">Change Password</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input type="password" required value={passwords.current} onChange={e => setPasswords(p => ({...p, current: e.target.value}))} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" required minLength={6} value={passwords.new} onChange={e => setPasswords(p => ({...p, new: e.target.value}))} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input type="password" required minLength={6} value={passwords.confirm} onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary mt-4">Update Password</button>
              </form>
            </div>
          )}

          {/* CONNECTED ACCOUNTS TAB */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Connected Accounts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Link external platforms for quick login and portfolio import.</p>
              </div>
              <div className="card space-y-4">
                {Object.keys(settings.connectedAccounts).map(platform => (
                  <div key={platform} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <span className="font-semibold capitalize mb-2 sm:mb-0 text-gray-800 dark:text-gray-200">{platform}</span>
                    <input 
                      type="text" 
                      placeholder="Username or Profile URL"
                      value={settings.connectedAccounts[platform]} 
                      onChange={e => handleChange('connectedAccounts', platform, e.target.value)} 
                      className="w-full sm:w-2/3 rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm" 
                    />
                  </div>
                ))}
                <button onClick={() => handleSave('connectedAccounts', settings.connectedAccounts)} disabled={saving} className="btn-primary mt-4">Save Accounts</button>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Preferences</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure language, timezone, and application defaults.</p>
              </div>
              <div className="card space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Dashboard View</label>
                    <select value={settings.preferences.defaultDashboard} onChange={e => handleChange('preferences', 'defaultDashboard', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm">
                      <option value="overview">Overview</option>
                      <option value="projects">Projects</option>
                      <option value="jobs">Job Tracker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select value={settings.preferences.language} onChange={e => handleChange('preferences', 'language', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Weekly Application Goal</label>
                  <input type="number" min="1" max="100" value={settings.preferences.weeklyGoals} onChange={e => handleChange('preferences', 'weeklyGoals', Number(e.target.value))} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Job Role</label>
                  <input type="text" value={settings.preferences.preferredRole} onChange={e => handleChange('preferences', 'preferredRole', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm" placeholder="e.g. Full Stack Developer" />
                </div>
                <button onClick={() => handleSave('preferences', settings.preferences)} disabled={saving} className="btn-primary mt-4">Save Preferences</button>
              </div>
            </div>
          )}

          {/* DATA EXPORT TAB */}
          {activeTab === 'data' && <DataExportTab />}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && <DangerZoneTab />}

        </div>
      </div>
    </div>
  );
}