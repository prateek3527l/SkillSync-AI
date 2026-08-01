import { useState } from 'react';

const COLUMNS = ['Saved', 'Applied', 'Assessment', 'Interview', 'HR Round', 'Final Round', 'Offer', 'Rejected', 'Accepted'];

const COLUMN_COLORS = {
  'Saved':       'border-gray-300 dark:border-gray-600',
  'Applied':     'border-blue-400 dark:border-blue-500',
  'Assessment':  'border-yellow-400 dark:border-yellow-500',
  'Interview':   'border-indigo-400 dark:border-indigo-500',
  'HR Round':    'border-purple-400 dark:border-purple-500',
  'Final Round': 'border-orange-400 dark:border-orange-500',
  'Offer':       'border-emerald-400 dark:border-emerald-500',
  'Rejected':    'border-red-400 dark:border-red-500',
  'Accepted':    'border-green-400 dark:border-green-500',
};

const HEADER_COLORS = {
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

export default function KanbanBoard({ jobs, onEdit, onStatusChange }) {
  const [dragId, setDragId] = useState(null);

  const handleDragStart = (e, jobId) => {
    setDragId(jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (dragId) {
      const job = jobs.find(j => j._id === dragId);
      if (job && job.applicationStatus !== newStatus) {
        onStatusChange(dragId, newStatus);
      }
    }
    setDragId(null);
  };

  const getJobsByStatus = (status) => jobs.filter(j => j.applicationStatus === status);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {COLUMNS.map(col => {
          const colJobs = getJobsByStatus(col);
          return (
            <div
              key={col}
              className={`w-60 flex-shrink-0 rounded-xl border-t-4 ${COLUMN_COLORS[col]} bg-gray-50 dark:bg-gray-800/50`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
            >
              <div className={`px-3 py-2 rounded-t-lg ${HEADER_COLORS[col]} flex items-center justify-between`}>
                <span className="text-xs font-bold">{col}</span>
                <span className="w-5 h-5 bg-white/50 dark:bg-gray-900/30 rounded-full flex items-center justify-center text-xs font-bold">{colJobs.length}</span>
              </div>

              <div className="p-2 space-y-2 min-h-[200px]">
                {colJobs.map(job => (
                  <div
                    key={job._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job._id)}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 ${dragId === job._id ? 'opacity-40' : ''}`}
                    onClick={() => onEdit(job)}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="w-7 h-7 flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300 text-xs">
                        {job.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{job.companyName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.jobTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{job.workMode}</span>
                      <span className={`text-xs font-semibold ${job.priority === 'High' ? 'text-red-500' : job.priority === 'Medium' ? 'text-yellow-500' : 'text-gray-300'}`}>
                        {job.priority}
                      </span>
                    </div>

                    {job.applicationDeadline && (() => {
                      const days = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
                      return days >= 0 && days <= 5 ? (
                        <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {days}d left</p>
                      ) : null;
                    })()}
                  </div>
                ))}
                {colJobs.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
