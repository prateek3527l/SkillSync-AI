import { useState, useEffect, useContext } from 'react';
import {
  User,
  Palette,
  Bell,
  Shield,
  Lock,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Database,
  AlertOctagon,
  CheckCircle,
  Loader,
  X,
  Menu
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
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setSaveStatus('saving');
    try {
      await api.put(`/api/settings/${section}`, data);
      setSaveStatus('saved');
      toast.success('Settings saved successfully');
      if (section === 'profile') loadUser(); // Refresh global user context
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      toast.error(error.response?.data?.message || 'Failed to save settings');
      setTimeout(() => setSaveStatus(''), 4000);
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
    setSaveStatus('saving');
    try {
      await api.put('/api/settings/security/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setSaveStatus('saved');
      toast.success('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      toast.error(error.response?.data?.message || 'Failed to update password');
      setTimeout(() => setSaveStatus(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-400">Loading settings panel...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy Control', icon: Shield },
    { id: 'security', label: 'Security & Auth', icon: Lock },
    { id: 'accounts', label: 'Connected Profiles', icon: LinkIcon },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Export', icon: Database },
    { id: 'danger', label: 'Danger Zone', icon: AlertOctagon, danger: true },
  ];

  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Settings';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn font-sans">

      {/* Settings Page Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account and application preferences.</p>
        </div>

        {/* Inline save notifications status */}
        <div className="text-xs font-semibold">
          {saveStatus === 'saving' && (
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center">
              <Loader className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 dark:text-emerald-450 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Changes saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-rose-600 flex items-center">
              <AlertOctagon className="w-3.5 h-3.5 mr-1.5" /> Unable to save changes
            </span>
          )}
        </div>
      </div>

      {/* MOBILE TAB BAR SELECTOR */}
      <div className="md:hidden relative z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-xl text-xs font-bold"
        >
          <span>{activeTabLabel}</span>
          <Menu className="w-4 h-4 text-slate-500" />
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 rounded-xl shadow-lg overflow-hidden py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-slate-50 text-indigo-600 dark:bg-slate-950 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TWO-COLUMN LAYOUT DESKTOP */}
      <div className="flex flex-col md:flex-row gap-8 relative items-start">

        {/* Navigation Sidebar Panel */}
        <nav className="hidden md:block w-60 flex-shrink-0 space-y-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? (tab.danger
                        ? 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/10'
                        : 'bg-indigo-50 border-indigo-100/30 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400')
                    : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950 hover:text-slate-850 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive && !tab.danger ? 'text-indigo-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Content Panel area */}
        <div className="flex-1 w-full min-w-0 bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl">

          {/* PROFILE CONFIG */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Public Profile</h2>
                <p className="text-[11px] text-slate-400 mt-1">This information will be displayed publicly on your portfolio.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input type="text" value={settings.profile.name} onChange={e => handleChange('profile', 'name', e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Professional Headline</label>
                  <input type="text" value={settings.profile.headline} onChange={e => handleChange('profile', 'headline', e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Location</label>
                  <input type="text" value={settings.profile.location} onChange={e => handleChange('profile', 'location', e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Short Bio</label>
                  <textarea rows={4} value={settings.profile.bio} onChange={e => handleChange('profile', 'bio', e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>

                <div className="pt-2">
                  <button onClick={() => handleSave('profile', settings.profile)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE CONFIG */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Appearance Settings</h2>
                <p className="text-[11px] text-slate-400 mt-1">Customize visual themes for SkillSync AI.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Theme Mode</label>
                  <select value={settings.appearance.theme} onChange={e => handleChange('appearance', 'theme', e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                    <option value="system">System Default</option>
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Accent Color</label>
                  <select value={settings.appearance.accentColor} onChange={e => handleChange('appearance', 'accentColor', e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                    <option value="indigo">Indigo</option>
                    <option value="blue">Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button onClick={() => handleSave('appearance', settings.appearance)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Theme Options
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS CONFIG */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Notifications</h2>
                <p className="text-[11px] text-slate-400 mt-1">Configure when you receive updates.</p>
              </div>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={e => handleChange('notifications', key, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
                    />
                  </label>
                ))}
                <div className="pt-2">
                  <button onClick={() => handleSave('notifications', settings.notifications)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Notification Options
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY CONFIG */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Privacy Control</h2>
                <p className="text-[11px] text-slate-400 mt-1">Manage public profile visibility parameters.</p>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3.5 mb-6 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl cursor-pointer border border-slate-200/50 dark:border-slate-800/80">
                  <input
                    type="checkbox"
                    checked={settings.privacy.isPublic}
                    onChange={e => handleChange('privacy', 'isPublic', e.target.checked)}
                    className="w-4.5 h-4.5 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Public Portfolio Link</p>
                    <p className="text-[10px] text-slate-550">Allows external recruiters to view your web CV.</p>
                  </div>
                </label>

                <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mt-4">Visible Sections</h3>
                {Object.entries(settings.privacy.visibleSections).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={e => {
                        const newSections = { ...settings.privacy.visibleSections, [key]: e.target.checked };
                        handleChange('privacy', 'visibleSections', newSections);
                      }}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-200"
                    />
                  </label>
                ))}
                <div className="pt-2">
                  <button onClick={() => handleSave('privacy', settings.privacy)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Privacy Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY CONFIG */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Security Credentials</h2>
                <p className="text-[11px] text-slate-400 mt-1">Manage passwords and active authentication keys.</p>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current Password</label>
                  <input type="password" required value={passwords.current} onChange={e => setPasswords(p => ({...p, current: e.target.value}))} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New Password (Min 6 chars)</label>
                  <input type="password" required minLength={6} value={passwords.new} onChange={e => setPasswords(p => ({...p, new: e.target.value}))} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm New Password</label>
                  <input type="password" required minLength={6} value={passwords.confirm} onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Update Security Key
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CONNECTED PROFILES */}
          {activeTab === 'accounts' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Connected Profiles</h2>
                <p className="text-[11px] text-slate-400 mt-1">Configure profile user URLs for resume analysis.</p>
              </div>
              <div className="space-y-4">
                {Object.keys(settings.connectedAccounts).map(platform => (
                  <div key={platform} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200/80 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-950/20">
                    <span className="text-xs font-semibold capitalize text-slate-700 dark:text-slate-350">{platform} Username</span>
                    <input
                      type="text"
                      placeholder={`${platform} username`}
                      value={settings.connectedAccounts[platform]}
                      onChange={e => handleChange('connectedAccounts', platform, e.target.value)}
                      className="w-full sm:w-2/3 mt-2 sm:mt-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                <div className="pt-2">
                  <button onClick={() => handleSave('connectedAccounts', settings.connectedAccounts)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Profiles
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATION PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Preferences</h2>
                <p className="text-[11px] text-slate-400 mt-1">Default views and parameters for job searches.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Default View</label>
                    <select value={settings.preferences.defaultDashboard} onChange={e => handleChange('preferences', 'defaultDashboard', e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                      <option value="overview">Overview</option>
                      <option value="projects">Projects</option>
                      <option value="jobs">Job Tracker</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Language</label>
                    <select value={settings.preferences.language} onChange={e => handleChange('preferences', 'language', e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Weekly Target Applications</label>
                  <input type="number" min="1" max="100" value={settings.preferences.weeklyGoals} onChange={e => handleChange('preferences', 'weeklyGoals', Number(e.target.value))} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Role Title</label>
                  <input type="text" value={settings.preferences.preferredRole} onChange={e => handleChange('preferences', 'preferredRole', e.target.value)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500" placeholder="e.g. Full Stack Developer" />
                </div>
                <div className="pt-2">
                  <button onClick={() => handleSave('preferences', settings.preferences)} disabled={saving} className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Save Application Options
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EXPORTS TAB */}
          {activeTab === 'data' && <DataExportTab />}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && <DangerZoneTab />}

        </div>

      </div>

    </div>
  );
}
