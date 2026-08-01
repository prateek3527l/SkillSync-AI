import { useState, useEffect } from 'react';
import { Download, SlidersHorizontal, Loader, Briefcase, FileText, Monitor, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Components
import KPICard from '../components/analytics/KPICard';
import { InterviewRadarChart, PipelineChart, InterviewTrendChart } from '../components/analytics/Charts';
import GoalTracker from '../components/analytics/GoalTracker';
import AIInsights from '../components/analytics/AIInsights';
import RecentActivityTimeline from '../components/analytics/RecentActivityTimeline';
import Achievements from '../components/analytics/Achievements';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: null,
    interviews: null,
    jobs: null,
    activity: [],
    goals: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, interviewsRes, jobsRes, activityRes, goalsRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get('/api/analytics/interviews'),
        api.get('/api/analytics/jobs'),
        api.get('/api/analytics/activity'),
        api.get('/api/analytics/goals'),
      ]);

      setStats({
        overview: overviewRes.data,
        interviews: interviewsRes.data,
        jobs: jobsRes.data,
        activity: activityRes.data,
        goals: goalsRes.data
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Analytics report exported as PDF (Placeholder)');
  };

  if (loading || !stats.overview) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
        <p className="text-gray-500 font-medium">Aggregating career data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Career Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive insights into your career preparation progress.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Customize
          </button>
          <button onClick={handleExport} className="btn-primary flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Projects" 
          value={stats.overview.totalProjects} 
          icon={Briefcase} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up" trendValue="+1"
        />
        <KPICard 
          title="Resume Score" 
          value={`${stats.overview.resumeScore}/100`} 
          icon={FileText} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend={stats.overview.resumeScore >= 80 ? 'up' : 'flat'} trendValue="Stable"
        />
        <KPICard 
          title="Interviews Completed" 
          value={stats.overview.totalInterviews} 
          icon={Monitor} 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          trend="up" trendValue="+3 this month"
        />
        <KPICard 
          title="Job Applications" 
          value={stats.overview.applicationsSubmitted} 
          icon={CheckCircle} 
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          trend="up" trendValue="Active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <AIInsights stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Interview Performance Trend</h3>
              <InterviewTrendChart data={stats.interviews?.trend} />
            </div>
            
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Mock Interview Strengths</h3>
              <InterviewRadarChart data={stats.interviews?.radar} />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Application Pipeline</h3>
            <PipelineChart data={stats.jobs?.pipeline} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GoalTracker goals={stats.goals} />
          <Achievements stats={stats} />
          <RecentActivityTimeline activities={stats.activity} />
        </div>
      </div>
    </div>
  );
}