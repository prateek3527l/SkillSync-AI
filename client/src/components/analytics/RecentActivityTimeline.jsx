import { Briefcase, FileText, Monitor, CheckCircle, Clock } from 'lucide-react';

export default function RecentActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500">No recent activity.</p>
      </div>
    );
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'briefcase': return <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'file-text': return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'monitor': return <Monitor className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBg = (iconName) => {
    switch (iconName) {
      case 'briefcase': return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'file-text': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'monitor': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-gray-400" /> Recent Activity
      </h3>

      <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 space-y-6">
        {activities.map((activity, idx) => (
          <div key={activity.id || idx} className="relative pl-6 group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] p-1.5 rounded-full border-2 bg-white dark:bg-gray-900 ${getBg(activity.icon)} group-hover:scale-110 transition-transform`}>
              {getIcon(activity.icon)}
            </div>

            {/* Content */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
                {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{activity.type}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
