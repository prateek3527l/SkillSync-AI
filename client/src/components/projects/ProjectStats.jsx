import { Briefcase, CheckCircle, Clock, Star } from 'lucide-react';

export default function ProjectStats({ projects }) {
  const total = projects.length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  const featured = projects.filter(p => p.featured).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="card py-4 px-6 flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/50 dark:text-indigo-400">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{total}</p>
        </div>
      </div>

      <div className="card py-4 px-6 flex items-center space-x-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/50 dark:text-emerald-400">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Completed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{completed}</p>
        </div>
      </div>

      <div className="card py-4 px-6 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/50 dark:text-blue-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">In Progress</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{inProgress}</p>
        </div>
      </div>

      <div className="card py-4 px-6 flex items-center space-x-4">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg dark:bg-yellow-900/50 dark:text-yellow-400">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Featured</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{featured}</p>
        </div>
      </div>
    </div>
  );
}
