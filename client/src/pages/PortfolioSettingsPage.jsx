import { useState, useEffect } from 'react';
import { Save, Globe, EyeOff, Layout, Palette, Settings2, Code, Share2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PortfolioSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/portfolio/settings');
      setSettings(res.data);
    } catch (error) {
      toast.error('Failed to load portfolio settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value, category = null) => {
    setSettings(prev => {
      if (category) {
        return { ...prev, [category]: { ...prev[category], [field]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/portfolio/settings', settings);
      toast.success('Portfolio settings saved!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${settings.username}`;
    navigator.clipboard.writeText(url);
    toast.success('Public link copied to clipboard!');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Builder</h1>
          <p className="text-gray-500 dark:text-gray-400">Customize your public developer portfolio.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Form */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Settings2 className="w-5 h-5 mr-2 text-primary-500" /> General Info
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Username / URL</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                  {window.location.host}/portfolio/
                </span>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="flex-1 block w-full rounded-none rounded-r-lg sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                <input type="text" value={settings.headline} onChange={(e) => handleChange('headline', e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" value={settings.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability Status</label>
              <input type="text" value={settings.availabilityStatus} onChange={(e) => handleChange('availabilityStatus', e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="e.g. Actively looking for Fall 2026 Internships" />
            </div>
          </div>

          {/* Coding Profiles */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary-500" /> Coding Profiles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['github', 'leetcode', 'hackerrank', 'codeforces'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{platform}</label>
                  <input 
                    type="text" 
                    value={settings.codingProfiles[platform]} 
                    onChange={(e) => handleChange(platform, e.target.value, 'codingProfiles')} 
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    placeholder={`${platform} username/url`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-4">
              <Globe className="w-5 h-5 mr-2 text-primary-500" /> Visibility
            </h2>
            
            <label className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.preferences.isPublic} 
                onChange={(e) => handleChange('isPublic', e.target.checked, 'preferences')}
                className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" 
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Publish Portfolio</p>
                <p className="text-xs text-gray-500">Make it visible to everyone</p>
              </div>
            </label>

            {settings.preferences.isPublic && (
              <div className="space-y-3 mb-6">
                <button onClick={handleCopyLink} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Share2 className="w-4 h-4 mr-2" /> Copy Link
                </button>
                <a href={`/portfolio/${settings.username}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center px-4 py-2 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50">
                  View Live Site
                </a>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Visible Sections</h3>
              <div className="space-y-2">
                {Object.keys(settings.preferences.visibleSections).map(section => (
                  <label key={section} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={settings.preferences.visibleSections[section]} 
                      onChange={(e) => {
                        const newVisible = { ...settings.preferences.visibleSections, [section]: e.target.checked };
                        handleChange('visibleSections', newVisible, 'preferences');
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{section}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-4">
              <Palette className="w-5 h-5 mr-2 text-primary-500" /> Theme
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accent Color</label>
                <select 
                  value={settings.preferences.accentColor} 
                  onChange={(e) => handleChange('accentColor', e.target.value, 'preferences')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="indigo">Indigo</option>
                  <option value="blue">Blue</option>
                  <option value="emerald">Emerald</option>
                  <option value="purple">Purple</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Layout Style</label>
                <select 
                  value={settings.preferences.layoutStyle} 
                  onChange={(e) => handleChange('layoutStyle', e.target.value, 'preferences')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="modern">Modern (Cards)</option>
                  <option value="minimal">Minimal (Clean)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
