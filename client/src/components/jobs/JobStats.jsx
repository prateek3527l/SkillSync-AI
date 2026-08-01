import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp, AlertCircle } from 'lucide-react';

export default function JobStats({ jobs }) {
  const total = jobs.length;
  const interviews = jobs.filter(j => ['Interview', 'HR Round', 'Final Round'].includes(j.applicationStatus)).length;
  const offers = jobs.filter(j => j.applicationStatus === 'Offer' || j.applicationStatus === 'Accepted').length;
  const rejected = jobs.filter(j => j.applicationStatus === 'Rejected').length;
  const acceptanceRate = offers > 0 && total > 0 ? Math.round((offers / total) * 100) : 0;
  const upcoming = jobs.filter(j => {
    const deadline = j.applicationDeadline;
    if (!deadline) return false;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  }).length;

  const stats = [
    { label: 'Total Applied', value: total, icon: Briefcase, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Interviews', value: interviews, icon: Clock, color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Offers', value: offers, icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'red', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    { label: 'Accept Rate', value: `${acceptanceRate}%`, icon: TrendingUp, color: 'purple', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    { label: 'Due This Week', value: upcoming, icon: AlertCircle, color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, bg, text }) => (
        <div key={label} className="card py-4 px-4 flex flex-col items-center text-center">
          <div className={`p-2 ${bg} rounded-lg mb-2`}>
            <Icon className={`w-5 h-5 ${text}`} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
