import { useState, useEffect, useContext } from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Monitor, 
  Activity, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  
  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Real App Data States
  const [overview, setOverview] = useState({
    totalProjects: 0,
    resumeScore: 0,
    totalInterviews: 0,
    averageInterviewScore: 0,
    profileCompletion: 85
  });
  const [activity, setActivity] = useState([]);
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    database: [],
    tools: []
  });
  const [latestFeedback, setLatestFeedback] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Parallel requests for all real endpoints
      const [overviewRes, activityRes, settingsRes, interviewRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get('/api/analytics/activity'),
        api.get('/api/settings'),
        api.get('/api/interview/history')
      ]);

      if (overviewRes.data) setOverview(overviewRes.data);
      if (activityRes.data) setActivity(activityRes.data);
      if (settingsRes.data?.profile?.skills) setSkills(settingsRes.data.profile.skills);
      
      // Get latest completed interview feedback for the AI INSIGHT box
      if (interviewRes.data && interviewRes.data.length > 0) {
        const completed = interviewRes.data.filter(s => s.status === 'completed');
        if (completed.length > 0) {
          // Sort by completed date desc
          completed.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
          setLatestFeedback(completed[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate dynamic recommendations based on real skills
  const getDynamicRecommendations = () => {
    const recs = [];
    const allSkills = [...skills.frontend, ...skills.backend, ...skills.database];
    
    if (allSkills.includes('React') || skills.frontend.length > 1) {
      recs.push({
        role: 'Frontend Developer',
        match: 'Strong Match',
        skills: skills.frontend.slice(0, 3),
        why: 'Based on your projects and React/Frontend skillset.'
      });
    }
    if (allSkills.includes('Node.js') || skills.backend.length > 1) {
      recs.push({
        role: 'Backend Engineer',
        match: 'Good Match',
        skills: [...skills.backend, ...skills.database].slice(0, 3),
        why: 'Based on your backend logic and data architecture skills.'
      });
    }
    
    return recs;
  };

  const activeRecs = getDynamicRecommendations();
  const totalSkillsCount = skills.frontend.length + skills.backend.length + skills.database.length + skills.tools.length;

  // Render Error State
  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-3xl animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">Unable to load your dashboard</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Please check your connection to the server and click the retry button below.
        </p>
        <button 
          onClick={fetchDashboardData}
          className="mt-6 flex items-center px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Retry Fetch
        </button>
      </div>
    );
  }

  // Render Skeleton Loader
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 h-[350px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[350px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {user?.name ? `Good morning, ${user.name}.` : 'Welcome back.'}
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Here's a snapshot of your skills, progress, and career opportunities.
          </p>
        </div>
        <Link 
          to="/interview" 
          className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/10"
        >
          <Zap className="w-3.5 h-3.5 mr-2" /> Start Mock Interview
        </Link>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-250/20 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile Strength</span>
            <User className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview.profileCompletion}%
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${overview.profileCompletion}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-250/20 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Projects</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview.totalProjects}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center">
            Active repositories linked
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-250/20 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Interview Score</span>
            <Monitor className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview.averageInterviewScore}<span className="text-xs text-slate-400">/100</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center">
            Across {overview.totalInterviews} session{overview.totalInterviews !== 1 && 's'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-250/20 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">ATS Resume Grade</span>
            <FileText className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {overview.resumeScore || overview.atsScore || 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center">
            {overview.resumeScore ? 'Resume evaluated' : 'No resume uploaded'}
          </div>
        </div>
      </div>

      {/* Main Grid: AI Insights Centerpiece & Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Centerpiece AI Insight */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI INSIGHT CARD */}
          <div className="bg-gradient-to-br from-indigo-900/10 via-indigo-950/5 to-transparent dark:from-indigo-950/30 p-6 rounded-3xl border border-indigo-500/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-indigo-500" />
            </div>

            <div className="flex items-center space-x-2 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-indigo-500/20 w-fit">
              <Sparkles className="w-3 h-3" />
              <span>AI Insight Recommendation</span>
            </div>

            {latestFeedback ? (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Focus on {latestFeedback.interviewType} Optimization
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {latestFeedback.overallFeedback || "Your performance is strong! Target improvements in technical explanation speed."}
                </p>
                
                {latestFeedback.weaknesses?.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Areas to Review</div>
                    <div className="flex flex-wrap gap-2">
                      {latestFeedback.weaknesses.slice(0, 3).map((w, idx) => (
                        <span key={idx} className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded border border-indigo-200/10">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <Link 
                    to={`/interview`}
                    className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
                  >
                    <span>Retake Mock Interview Session</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Awaiting profile insights
                </h3>
                <p className="text-xs text-slate-500 leading-normal max-w-md">
                  Your first AI insight will appear here once your profile has enough information. Start by taking an evaluation mock interview.
                </p>
                <div className="pt-3">
                  <Link 
                    to="/interview"
                    className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Take First Mock Interview
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* CAREER RECOMMENDATIONS */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Target Role Matches</h3>
              <span className="text-[10px] text-slate-400">Dynamic matches</span>
            </div>

            {activeRecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRecs.map((rec, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.role}</span>
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                          {rec.match}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal mb-3">{rec.why}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                      {rec.skills.map((s, sidx) => (
                        <span key={sidx} className="text-[9px] bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">Complete your profile to receive personalized recommendations.</p>
                <Link to="/profile" className="inline-flex items-center text-xs font-bold text-indigo-600 mt-3 hover:underline">
                  Go to Profile settings <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Skill Snapshot & Timelines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUICK ACTIONS */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to="/projects"
                className="flex items-center justify-center p-3 border border-slate-250/20 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-semibold text-xs text-center"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Project
              </Link>
              <Link 
                to="/profile"
                className="flex items-center justify-center p-3 border border-slate-250/20 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-semibold text-xs text-center"
              >
                Edit Profile
              </Link>
              <Link 
                to="/resume"
                className="flex items-center justify-center p-3 border border-slate-250/20 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-semibold text-xs text-center"
              >
                Scan Resume
              </Link>
              <Link 
                to="/analytics"
                className="flex items-center justify-center p-3 border border-slate-250/20 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-semibold text-xs text-center"
              >
                View Analytics
              </Link>
            </div>
          </div>

          {/* SKILL SNAPSHOT */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Skills</h3>
              <span className="text-[10px] font-bold text-slate-400">{totalSkillsCount} Configured</span>
            </div>
            
            {totalSkillsCount > 0 ? (
              <div className="space-y-3">
                {skills.frontend.length > 0 && (
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Frontend</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.frontend.slice(0, 5).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-850">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.backend.length > 0 && (
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Backend</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.backend.slice(0, 5).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-850">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500">Add your first skills to start building your profile.</p>
                <Link to="/settings" className="inline-flex items-center text-xs font-bold text-indigo-600 mt-2 hover:underline">
                  Configure Skills <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY TIMELINE */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity</h3>
            
            {activity.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {activity.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start space-x-3.5 relative">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center flex-shrink-0 z-10 border border-slate-200/30 dark:border-slate-800/30">
                      <Activity className="w-3 h-3 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{act.type}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{act.description}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(act.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[11px] text-slate-500">Your recent activities will appear here as you interact with the app.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}