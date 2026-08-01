import { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Monitor, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const [interviewStats, setInterviewStats] = useState({ count: 0, avgScore: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const interviewRes = await api.get('/api/interview/history');
        const history = interviewRes.data;
        
        const count = history.length;
        const avgScore = count > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / count) : 0;
        
        setInterviewStats({
          count,
          avgScore,
          recent: history.slice(0, 3)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's your career progress.</p>
        </div>
        <Link to="/interview?tab=setup" className="btn-primary flex items-center">
          <Zap className="w-4 h-4 mr-2" /> Start Mock Interview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/50 dark:text-indigo-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Profile</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/50 dark:text-emerald-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Projects</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/50 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg Int. Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : interviewStats.avgScore}</p>
          </div>
        </div>

        <Link to="/interview?tab=history" className="card flex items-center space-x-4 hover:border-primary-500 transition-colors cursor-pointer group">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/50 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Interviews Taken</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : interviewStats.count}</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="card lg:col-span-2 min-h-[300px] flex flex-col justify-center items-center text-center">
          <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Weekly Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">Chart placeholder. Your activity for the last 7 days will appear here.</p>
        </div>

        <div className="card min-h-[300px]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Interviews</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : interviewStats.recent.length === 0 ? (
              <p className="text-sm text-gray-500">No recent interviews.</p>
            ) : (
              interviewStats.recent.map((interview) => (
                <div key={interview._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{interview.interviewType}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>Score: {interview.overallScore}/100</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(interview.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}