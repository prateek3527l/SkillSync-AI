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
  AlertTriangle,
  RotateCcw,
  Award,
  CheckCircle2,
  Layers,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

      // Get latest completed interview feedback for the primary focus centerpiece
      if (interviewRes.data && interviewRes.data.length > 0) {
        const completed = interviewRes.data.filter(s => s.status === 'completed');
        if (completed.length > 0) {
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
        why: 'Based on your registered React & frontend skill entries.'
      });
    }
    if (allSkills.includes('Node.js') || skills.backend.length > 1) {
      recs.push({
        role: 'Backend Engineer',
        match: 'Good Match',
        skills: [...skills.backend, ...skills.database].slice(0, 3),
        why: 'Based on your backend logic & database architecture.'
      });
    }

    return recs;
  };

  const activeRecs = getDynamicRecommendations();
  const totalSkillsCount = skills.frontend.length + skills.backend.length + skills.database.length + skills.tools.length;

  // Render Error State
  if (error) {
    return (
      <div className="card max-w-lg mx-auto text-center py-12 px-6 my-8 space-y-4">
        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Unable to load dashboard data</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Please check your network connection and server status.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-primary"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retry Fetch
        </button>
      </div>
    );
  }

  // Render Skeleton Loader
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-3.5 w-72 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-[220px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-[180px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-[200px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-[160px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {user?.name ? `Welcome back, ${user.name}` : 'Career Command Center'}
            </h1>
            <span className="badge badge-indigo">Career Readiness Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your skill profile, evaluate ATS resumes, and practice mock technical interviews.
          </p>
        </div>

        {/* Compact Bar Actions */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Link to="/resume" className="btn-secondary flex-1 sm:flex-none text-xs">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Scan Resume
          </Link>
          <Link to="/interview" className="btn-primary flex-1 sm:flex-none text-xs">
            <Zap className="w-3.5 h-3.5 mr-1.5" /> Start AI Interview
          </Link>
        </div>
      </div>

      {/* 2. CAREER OVERVIEW PROGRESS BANNER (PRIMARY CARD) */}
      <div className="dashboard-card-outline p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Career Readiness Dashboard</h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Overall Profile Strength: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{overview.profileCompletion}%</span>
          </span>
        </div>

        {/* Coherent Progress Bar Strip */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${overview.profileCompletion}%` }} />
        </div>

        {/* 4 Unified Career Pillar Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80">
          <div className="pt-2 sm:pt-0 sm:px-2 first:px-0 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Strength</span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">{overview.profileCompletion}%</div>
            <p className="text-[10px] text-slate-500">Core setup status</p>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ATS Resume Health</span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {overview.resumeScore || overview.atsScore || 0}%
            </div>
            <p className="text-[10px] text-slate-500">
              {overview.resumeScore ? 'PDF scanned' : 'No resume uploaded'}
            </p>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Interview Score</span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {overview.averageInterviewScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <p className="text-[10px] text-slate-500">
              {overview.totalInterviews > 0 ? `${overview.totalInterviews} session(s) taken` : '0 sessions taken'}
            </p>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linked Projects</span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">{overview.totalProjects}</div>
            <p className="text-[10px] text-slate-500">
              {overview.totalProjects > 0 ? 'Repos linked' : 'No projects yet'}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT MAIN PANEL (8 Cols): Centerpiece & Target Role */}
        <div className="lg:col-span-8 space-y-6">

          {/* 3. PRIMARY CAREER INSIGHT CENTERPIECE (FOCUS CARD) */}
          <div className="dashboard-card-outline dashboard-card-focus p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">What to Focus on Next</h3>
              </div>
              <span className="badge badge-indigo">AI Career Direction</span>
            </div>

            {latestFeedback ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Practice Technical Explanation: {latestFeedback.interviewType}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {latestFeedback.overallFeedback || "Your technical depth is solid. Continue improving response speed and terminology precision."}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 flex-shrink-0 ml-3">
                    {new Date(latestFeedback.completedAt).toLocaleDateString()}
                  </span>
                </div>

                {latestFeedback.weaknesses?.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Improvement Areas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {latestFeedback.weaknesses.slice(0, 4).map((w, idx) => (
                        <span key={idx} className="badge badge-slate text-[10px]">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/interview"
                    className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Take New AI Interview Session <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                  <Link to="/analytics" className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">
                    View Interview Trends &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              /* Polished Empty State for Focus Centerpiece */
              <div className="py-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Start your first AI Mock Interview session</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      Once completed, SkillSync AI will analyze your technical depth and provide actionable focus points here.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <Link to="/interview" className="btn-primary text-xs">
                    Take First Mock Interview <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                  <Link to="/resume" className="btn-secondary text-xs">
                    Upload Resume First
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. TARGET ROLE & COMPETENCY MATCHES (PRIMARY CARD) */}
          <div className="dashboard-card-outline dashboard-card-outline-delay-1 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Target Role Skill Alignments</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Matched against your configured tech stack</p>
              </div>
              <Link to="/skills" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Manage Stack &rarr;
              </Link>
            </div>

            {activeRecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRecs.map((rec, idx) => (
                  <div key={idx} className="card-flat bg-slate-50/50 dark:bg-slate-950/40 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.role}</span>
                      <span className="badge badge-emerald">{rec.match}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{rec.why}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rec.skills.map((s, sidx) => (
                        <span key={sidx} className="text-[9px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Polished Empty State for Target Roles */
              <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <Layers className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No skill categories configured yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add your frontend, backend, or database skills to discover dynamic job role matches.
                </p>
                <div className="pt-2">
                  <Link to="/skills" className="btn-secondary text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Technical Skills
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR PANEL (4 Cols): Skills, Activity, Quick Actions */}
        <div className="lg:col-span-4 space-y-6">

          {/* 5. TOP SKILLS BREAKDOWN (SECONDARY CARD) */}
          <div className="dashboard-card-outline dashboard-card-outline-delay-2 p-6 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Top Technical Skills</h3>
              <span className="text-[10px] font-bold text-slate-400">{totalSkillsCount} Configured</span>
            </div>

            {totalSkillsCount > 0 ? (
              <div className="space-y-3">
                {skills.frontend.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Frontend</span>
                      <span>{skills.frontend.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skills.frontend.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="badge badge-slate text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.backend.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Backend</span>
                      <span>{skills.backend.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skills.backend.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="badge badge-slate text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.database?.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Database</span>
                      <span>{skills.database.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skills.database.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="badge badge-slate text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Polished Empty State for Top Skills */
              <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500">No skills registered yet.</p>
                <Link to="/skills" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:underline">
                  Configure Skill Matrix <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* 6. RECENT ACTIVITY TIMELINE (SECONDARY CARD) */}
          <div className="dashboard-card-outline dashboard-card-outline-delay-1 p-6 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Recent Activity</h3>
              <Activity className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {activity.length > 0 ? (
              <div className="space-y-2.5">
                {activity.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">{act.type}</p>
                      <p className="text-[10px] text-slate-500 truncate">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-[11px] text-slate-500">No recent activity logged.</p>
              </div>
            )}
          </div>

          {/* 7. QUICK ACTION BUTTONS (SECONDARY CARD) */}
          <div className="dashboard-card-outline dashboard-card-outline-delay-2 p-4 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Workspace Actions</span>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/projects" className="btn-secondary text-[11px] py-2">
                <Plus className="w-3 h-3 mr-1" /> Add Project
              </Link>
              <Link to="/jobs" className="btn-secondary text-[11px] py-2">
                Job Tracker
              </Link>
              <Link to="/profile" className="btn-secondary text-[11px] py-2">
                Edit Profile
              </Link>
              <Link to="/analytics" className="btn-secondary text-[11px] py-2">
                Analytics
              </Link>
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
