import { useState, useContext, useEffect } from 'react';
import { Camera, Save, Github, Linkedin, Globe, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        await updateProfile({ name, email, bio });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:space-x-6 space-y-4 md:space-y-0">
          <div className="relative self-center md:self-auto">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing || loading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  disabled={!isEditing || loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 disabled:opacity-70"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea 
                disabled={!isEditing || loading}
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 disabled:opacity-70"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input type="text" disabled={!isEditing || loading} placeholder="GitHub URL" className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 disabled:opacity-70 text-gray-900 dark:text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input type="text" disabled={!isEditing || loading} placeholder="LinkedIn URL" className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 disabled:opacity-70 text-gray-900 dark:text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input type="text" disabled={!isEditing || loading} placeholder="Portfolio URL" className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 disabled:opacity-70 text-gray-900 dark:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}