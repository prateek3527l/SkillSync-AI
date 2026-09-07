import { useState } from 'react';
import { AlertOctagon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function DangerZoneTab() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      toast.error('Please enter your password to confirm');
      return;
    }

    setDeleting(true);
    try {
      await api.delete('/api/settings/account', { data: { password } });
      toast.success('Account successfully deleted');
      // Redirect to login handled by AuthContext if we dispatch logout or reload
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1 flex items-center">
          <AlertOctagon className="w-5 h-5 mr-2" /> Danger Zone
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Irreversible and destructive actions.</p>
      </div>

      <div className="card border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Once you delete your account, there is no going back. Please be certain. All your projects, resume data, interview transcripts, and job tracking pipelines will be permanently wiped from our servers.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200 dark:border-red-800 shadow-sm mt-4">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Are you absolutely sure?</p>
            <p className="text-xs text-gray-500 mb-4">This action cannot be undone. Enter your password to confirm.</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-red-500 focus:border-red-500"
            />

            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete my account'}
              </button>
              <button
                onClick={() => { setShowConfirm(false); setPassword(''); }}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
