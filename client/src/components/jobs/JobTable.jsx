import { Edit, Trash2, ExternalLink, Star } from 'lucide-react';

const STATUS_COLORS = {
  'Saved':       'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Applied':     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Assessment':  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Interview':   'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'HR Round':    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Final Round': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'Offer':       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Rejected':    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'Accepted':    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const PRIORITY_COLORS = { High: 'text-red-500', Medium: 'text-yellow-500', Low: 'text-gray-300' };

export default function JobTable({ jobs, onEdit, onDelete }) {
  if (jobs.length === 0) return null;

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Applied</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Deadline</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {jobs.map(job => (
              <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300 text-sm">
                      {job.companyName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{job.companyName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{job.jobTitle}</p>
                    {job.location && <p className="text-xs text-gray-400">{job.location}</p>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[job.applicationStatus]}`}>
                    {job.applicationStatus}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{job.jobType} · {job.workMode}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {job.applicationDate ? new Date(job.applicationDate).toLocaleDateString() : '—'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {job.applicationDeadline ? (
                    <span className={`text-xs font-medium ${new Date(job.applicationDeadline) < new Date() ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  ) : <span className="text-xs text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`${PRIORITY_COLORS[job.priority]} text-xs font-semibold`}>{job.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => onEdit(job)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(job._id)} className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
