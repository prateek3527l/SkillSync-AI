import { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader,
  Award,
  ChevronRight,
  RefreshCw,
  Zap,
  TrendingUp,
  Bookmark,
  Check,
  Circle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const standardRoles = [
  {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    category: 'Engineering',
    requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    description: 'Design and manage end-to-end web applications, scaling from responsive frontends to schema layouts.',
    actionRoute: '/interview',
    actionLabel: 'Practice Mock Session'
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    category: 'UI/UX Design',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
    description: 'Orchestrate interface layout pages, optimize component render cycles, and ensure accessible markup.',
    actionRoute: '/resume',
    actionLabel: 'Scan Resume Compatibility'
  },
  {
    id: 'backend',
    title: 'Backend Systems Developer',
    category: 'Architecture',
    requiredSkills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis'],
    description: 'Build performant, secure application programming interfaces (APIs) and query optimization threads.',
    actionRoute: '/projects',
    actionLabel: 'Create Project Showcase'
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Engineer',
    category: 'Infrastructure',
    requiredSkills: ['Git', 'Docker', 'Kubernetes', 'AWS'],
    description: 'Build scalable deployment pipelines, manage container runtimes, and monitor production infrastructures.',
    actionRoute: '/skills',
    actionLabel: 'Manage Tech Stack'
  }
];

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  // Filtering states
  const [filterType, setFilterType] = useState('all');

  const fetchProfileSkills = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/api/settings');
      if (res.data?.profile?.skills) {
        const s = res.data.profile.skills;
        const all = [
          ...(s.frontend || []),
          ...(s.backend || []),
          ...(s.database || []),
          ...(s.tools || [])
        ];
        setUserSkills(all);
      }
    } catch (err) {
      console.error('Error fetching settings for recommendations:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileSkills();
  }, []);

  // Compute actual match metrics dynamically for each standard role
  const getMappedRecommendations = () => {
    const allUser = userSkills.map(s => s.toLowerCase());

    return standardRoles.map(role => {
      const matched = role.requiredSkills.filter(req => allUser.includes(req.toLowerCase()));
      const missing = role.requiredSkills.filter(req => !allUser.includes(req.toLowerCase()));
      const score = Math.round((matched.length / role.requiredSkills.length) * 100);

      let level = 'Low Match';
      if (score >= 70) level = 'Strong Match';
      else if (score >= 40) level = 'Moderate Match';

      return {
        ...role,
        score,
        level,
        matched,
        missing
      };
    }).sort((a, b) => b.score - a.score); // Sort by highest match score
  };

  const recommendations = getMappedRecommendations();

  // Filtered recommendations
  const filteredRecs = recommendations.filter(rec => {
    if (filterType === 'strong') return rec.score >= 70;
    if (filterType === 'moderate') return rec.score >= 40 && rec.score < 70;
    if (filterType === 'gaps') return rec.missing.length > 0;
    return true;
  });

  const topMatch = recommendations[0];

  // AI recommendations statement based on calculated scores
  const getAIExplanation = () => {
    if (userSkills.length === 0) return null;
    if (topMatch && topMatch.score >= 75) {
      return `Your technology core strongly supports ${topMatch.title} positions. You have acquired ${topMatch.matched.length} key competencies. Focus on bridging the remaining gap: ${topMatch.missing.join(', ')} to maximize application success rate.`;
    }
    if (topMatch && topMatch.score >= 40) {
      return `You are in a moderate transition phase toward ${topMatch.title} paths. Acquire more hands-on database experience or deploy microservices to accelerate matching.`;
    }
    return 'Your profile is currently balanced. Add structured frontend or backend frameworks in settings to unlock target opportunity metrics.';
  };

  const aiInsight = getAIExplanation();

  // Render error screen
  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl animate-fadeIn">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">Unable to load recommendations</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Please check your connection and try reloading the career optimizer module.
        </p>
        <button
          onClick={fetchProfileSkills}
          className="mt-6 flex items-center px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  // Render skeleton loader
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl mt-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="h-[250px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[250px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">

      {/* Page Header */}
      <div className="border-b border-slate-250/60 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Recommendations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Opportunities matched to your skills, experience, and goals.
        </p>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-lg border transition-all ${filterType === 'all' ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900'}`}
        >
          All Roles ({recommendations.length})
        </button>
        <button
          onClick={() => setFilterType('strong')}
          className={`px-3.5 py-1.5 rounded-lg border transition-all ${filterType === 'strong' ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900'}`}
        >
          Strong Matches ({recommendations.filter(r => r.score >= 70).length})
        </button>
        <button
          onClick={() => setFilterType('moderate')}
          className={`px-3.5 py-1.5 rounded-lg border transition-all ${filterType === 'moderate' ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900'}`}
        >
          Moderate Matches ({recommendations.filter(r => r.score >= 40 && r.score < 70).length})
        </button>
        <button
          onClick={() => setFilterType('gaps')}
          className={`px-3.5 py-1.5 rounded-lg border transition-all ${filterType === 'gaps' ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900'}`}
        >
          Roles with Gaps ({recommendations.filter(r => r.missing.length > 0).length})
        </button>
      </div>

      {/* THREE-COLUMN LAYOUT: Centerpiece match vs secondary list */}
      {userSkills.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT PANEL: TOP MATCH & SECONDARY OPPORTUNITIES */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. PRIMARY RECOMMENDATION: TOP MATCH */}
            {topMatch && filterType === 'all' && (
              <div className="bg-gradient-to-br from-indigo-900/10 via-indigo-950/5 to-transparent dark:from-indigo-950/20 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase text-indigo-500/30 tracking-widest pointer-events-none">
                  Top Recommended Path
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {topMatch.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {topMatch.title}
                    </h2>
                  </div>

                  {/* Dynamic percentage circle */}
                  <div className="relative w-16 h-16 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-sm bg-white dark:bg-slate-900">
                    <span>{topMatch.score}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  {topMatch.description}
                </p>

                {/* Match Details: Matches vs Gaps lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matching Skills ({topMatch.matched.length})</div>
                    <div className="space-y-1.5">
                      {topMatch.matched.map((m, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-700 dark:text-slate-355 font-semibold">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0" /> {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acquisition Gaps ({topMatch.missing.length})</div>
                    <div className="space-y-1.5">
                      {topMatch.missing.length > 0 ? (
                        topMatch.missing.map((m, idx) => (
                          <div key={idx} className="flex items-center text-xs text-slate-500 font-medium">
                            <Circle className="w-3.5 h-3.5 text-slate-300 mr-2 flex-shrink-0" /> {m}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">All Requirements Matched!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active route CTA */}
                <div className="pt-2">
                  <Link
                    to={topMatch.actionRoute}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <span>{topMatch.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 2. SECONDARY RECOMMENDATIONS LIST */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {filterType === 'all' ? 'Other Matched Opportunities' : 'Filtered Opportunities'}
              </h3>

              {filteredRecs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecs.map((rec) => {
                    // Skip top match if showing "All" view to maintain hierarchy
                    if (filterType === 'all' && rec.id === topMatch.id) return null;

                    return (
                      <div key={rec.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                {rec.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                                {rec.title}
                              </h4>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rec.score >= 70 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450' : rec.score >= 40 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-slate-50 text-slate-500'}`}>
                              {rec.score}% match
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-505 leading-relaxed">{rec.description}</p>
                        </div>

                        {/* Brief Gaps preview */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                          {rec.missing.length > 0 ? (
                            <div className="text-[9px] text-slate-400 flex items-center gap-1">
                              <span>Acquisition gaps:</span>
                              <span className="font-semibold text-slate-500">{rec.missing.join(', ')}</span>
                            </div>
                          ) : (
                            <div className="text-[9px] text-emerald-500 font-bold">✓ 100% matched</div>
                          )}
                        </div>

                        <Link
                          to={rec.actionRoute}
                          className="inline-flex items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                        >
                          <span>{rec.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                  <p className="text-xs text-slate-500">No opportunities match the selected criteria filter.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: AI Explanation Panel */}
          <div className="lg:col-span-4 space-y-6">

            {/* AI RECOMMENDATION INSIGHT */}
            <div className="bg-gradient-to-br from-indigo-900/10 via-indigo-950/5 to-transparent dark:from-indigo-950/30 p-5 rounded-3xl border border-indigo-500/20 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center space-x-2 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-indigo-500/20 w-fit">
                <Sparkles className="w-3 h-3" />
                <span>AI Recommendation Insight</span>
              </div>

              {aiInsight ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-550 leading-relaxed font-medium">
                    "{aiInsight}"
                  </p>
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                    <Link to="/skills" className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Update Tech Stack skills <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-550">
                    Configure your technology skills stack to unlock customized career path matches.
                  </p>
                </div>
              )}
            </div>

            {/* RECOMMENDATIONS METHODOLOGY */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Match System</h3>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Matches are calculated in real-time by inspecting the required technologies of standard industry developer roles against the current skills configured in your profile.
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* EMPTY STATE: NO PROFILE SKILLS */
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl">
          <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-950 dark:text-white">Recommendations are locked</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
            Please configure your technical skills stack profile first to unlock personalized matching indexes.
          </p>
          <div className="mt-6">
            <Link
              to="/skills"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Add Profile Skills <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
