import { Building2, MapPin, Calendar, ExternalLink, Edit, Trash2, Clock, Star } from 'lucide-react';

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

const PRIORITY_COLORS = {
  'High':   'text-red-500',
  'Medium': 'text-yellow-500',
  'Low':    'text-gray-400',
};

export default function JobCard({ job, onEdit, onDelete }) {
  const isUpcoming = job.applicationDeadline && new Date(job.applicationDeadline) > new Date();
  const daysUntilDeadline = job.applicationDeadline
    ? Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="card group relative flex flex-col h-full">
      {/* Priority Indicator */}
      <div className={`absolute top-3 right-3 ${PRIORITY_COLORS[job.priority]}`}>
        <Star className={`w-4 h-4 ${job.priority === 'High' ? 'fill-current' : ''}`} />
      </div>

      {/* Action buttons on hover */}
      <div className="absolute top-3 right-8 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={() => onEdit(job)} className="p-1.5 bg-white dark:bg-gray-700 rounded-md shadow hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-500">
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(job._id)} className="p-1.5 bg-white dark:bg-gray-700 rounded-md shadow hover:text-red-600 dark:hover:text-red-400 text-gray-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-base">
          {job.companyName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate pr-10">{job.companyName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{job.jobTitle}</p>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.applicationStatus]}`}>
          {job.applicationStatus}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          {job.jobType}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {job.workMode}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 flex-1">
        {job.location && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" /> {job.location}
          </div>
        )}
        {job.applicationDate && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            Applied: {new Date(job.applicationDate).toLocaleDateString()}
          </div>
        )}
        {job.interviewDate && (
          <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
            Interview: {new Date(job.interviewDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
        {daysUntilDeadline !== null && daysUntilDeadline > 0 ? (
          <span className={`text-xs font-medium ${daysUntilDeadline <= 3 ? 'text-red-500' : 'text-gray-400'}`}>
            {daysUntilDeadline <= 3 ? `⚠️ ` : ''}{daysUntilDeadline}d until deadline
          </span>
        ) : daysUntilDeadline !== null && daysUntilDeadline <= 0 ? (
          <span className="text-xs text-gray-400">Deadline passed</span>
        ) : (
          <span className="text-xs text-gray-400">No deadline set</span>
        )}

        {job.jobUrl && (
          <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
