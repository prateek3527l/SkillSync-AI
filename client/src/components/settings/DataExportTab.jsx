import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export default function DataExportTab() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const res = await api.post('/api/settings/export');
      const dataStr = JSON.stringify(res.data, null, 2);
      
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillsync-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Data exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Data & Export</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Download a copy of your data for your own records.</p>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Export your data</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          You can request a copy of your personal data at any time. This export will include your profile, portfolio configurations, projects, mock interview transcripts, and job tracking pipeline.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => handleExport('json')} 
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FileJson className="w-4 h-4 mr-2 text-indigo-500" /> Export as JSON
          </button>

          <button 
            onClick={() => toast.error('CSV Export coming soon')} 
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" /> Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
