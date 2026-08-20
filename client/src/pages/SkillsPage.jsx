import { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Loader, 
  Check, 
  BookOpen,
  Filter,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & DevOps'
};

const suggestedSkillsList = {
  frontend: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Redux', 'Vue.js', 'HTML5', 'CSS3', 'Vite'],
  backend: ['Node.js', 'Express.js', 'NestJS', 'Python', 'Go', 'Java', 'Django', 'FastAPI', 'GraphQL'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Elasticsearch'],
  tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Vercel', 'Nginx', 'GitHub Actions', 'Linux']
};

export default function SkillsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  // Skills state matching database Portfolio schema
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    database: [],
    tools: []
  });

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('frontend');

  const fetchSkillsData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/api/settings');
      if (res.data?.profile?.skills) {
        setSkills({
          frontend: res.data.profile.skills.frontend || [],
          backend: res.data.profile.skills.backend || [],
          database: res.data.profile.skills.database || [],
          tools: res.data.profile.skills.tools || []
        });
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const handleSaveSkills = async (updatedSkills) => {
    setSaving(true);
    try {
      await api.put('/api/settings/profile', { skills: updatedSkills });
      setSkills(updatedSkills);
      toast.success('Skills database updated successfully!');
    } catch (err) {
      console.error('Error saving skills:', err);
      toast.error('Failed to save skills updates');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const trimmed = newSkillName.trim();
    // Prevent duplicate entries
    const exists = Object.values(skills).some(list => 
      list.some(s => s.toLowerCase() === trimmed.toLowerCase())
    );

    if (exists) {
      toast.error('Skill is already configured in your list');
      return;
    }

    const updated = {
      ...skills,
      [newSkillCategory]: [...skills[newSkillCategory], trimmed]
    };

    handleSaveSkills(updated);
    setNewSkillName('');
  };

  const handleDeleteSkill = (category, skillToDelete) => {
    const updated = {
      ...skills,
      [category]: skills[category].filter(s => s !== skillToDelete)
    };
    handleSaveSkills(updated);
  };

  // Generate dynamic AI Insights based on real skill arrays
  const getAISkillInsights = () => {
    const totalCount = Object.values(skills).flat().length;
    if (totalCount === 0) return null;

    const hasReact = skills.frontend.some(s => s.toLowerCase() === 'react');
    const hasNode = skills.backend.some(s => s.toLowerCase() === 'node.js');
    const hasTS = skills.frontend.concat(skills.backend).some(s => s.toLowerCase() === 'typescript');
    const hasDocker = skills.tools.some(s => s.toLowerCase() === 'docker');

    if (hasReact && hasNode && !hasTS) {
      return {
        focus: 'TypeScript Adoption',
        advice: 'You have solid frontend (React) and backend (Node.js) blocks. Integrating TypeScript will bridge compilation safety and make you highly relevant for senior full-stack roles.',
        action: 'Add TypeScript to your learning path.'
      };
    }

    if (hasNode && !hasDocker) {
      return {
        focus: 'Containerization & DevOps',
        advice: 'Your backend competence is strong. Adding Docker container packaging will ease local microservice deployment pipelines and optimize target system design checks.',
        action: 'Learn Docker container creation.'
      };
    }

    return {
      focus: 'System Architecture Expansion',
      advice: 'Your technology core is balanced. To stand out to tech recruiters, focus on structural cloud deployment patterns (like AWS ECS/Vercel pipelines) and automated test coverages.',
      action: 'Explore cloud infrastructure patterns.'
    };
  };

  // Generate dynamic skill gaps (if they have certain skills but miss logical counterparts)
  const getDynamicSkillGaps = () => {
    const gaps = [];
    const all = Object.values(skills).flat().map(s => s.toLowerCase());

    if (all.includes('react') && !all.includes('next.js')) {
      gaps.push({
        name: 'Next.js',
        why: 'Required for Server-Side Rendering (SSR) React positions',
        suggestion: 'Explore Next.js App Router guidelines'
      });
    }
    if (all.includes('node.js') && !all.includes('docker')) {
      gaps.push({
        name: 'Docker',
        why: 'Standard container package runtime for backend microservices',
        suggestion: 'Build a Node.js Dockerfile setup'
      });
    }
    if (all.includes('react') && !all.includes('typescript')) {
      gaps.push({
        name: 'TypeScript',
        why: 'Standard codebase requirement for scalable JavaScript systems',
        suggestion: 'Refactor basic React component declarations to TS'
      });
    }

    return gaps.slice(0, 3);
  };

  const aiInsight = getAISkillInsights();
  const skillGaps = getDynamicSkillGaps();
  const totalSkillsCount = Object.values(skills).flat().length;

  // Calculate percentage coverage for simple radar representation
  const getCategoryStrengths = () => {
    const maxVal = Math.max(1, skills.frontend.length, skills.backend.length, skills.database.length, skills.tools.length);
    return {
      frontend: (skills.frontend.length / maxVal) * 100,
      backend: (skills.backend.length / maxVal) * 100,
      database: (skills.database.length / maxVal) * 100,
      tools: (skills.tools.length / maxVal) * 100
    };
  };

  const categoryStrengths = getCategoryStrengths();

  // Render error screen
  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl animate-fadeIn">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-950 dark:text-white">Unable to load your skills</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          Something went wrong fetching your portfolio profile details. Please try again.
        </p>
        <button 
          onClick={fetchSkillsData}
          className="mt-6 flex items-center px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Load
        </button>
      </div>
    );
  }

  // Render loader skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          <div className="lg:col-span-8 h-[400px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="lg:col-span-4 h-[400px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Editorial Header */}
      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Skill Analysis</h1>
          <p className="text-xs text-slate-500 mt-1">
            Understand where your skills are strongest — and where your next opportunity lies.
          </p>
        </div>
        {saving && (
          <div className="flex items-center text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-full">
            <Loader className="w-3 h-3 mr-1.5 animate-spin" /> Saving changes...
          </div>
        )}
      </div>

      {/* TWO-COLUMN GRID COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Skill Lists, Filters, and Management Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
            
            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500">
              <button 
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${selectedFilter === 'all' ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent'}`}
              >
                All Skills
              </button>
              {Object.keys(categoryLabels).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${selectedFilter === cat ? 'bg-indigo-50 border-indigo-200/30 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'border-transparent'}`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Search Input bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search stack skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* MAIN SKILL CHIP SNAPSHOT LIST */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            
            {totalSkillsCount > 0 ? (
              <div className="space-y-6">
                {Object.entries(skills).map(([category, list]) => {
                  // Apply filters and searches
                  if (selectedFilter !== 'all' && selectedFilter !== category) return null;
                  
                  const filteredList = list.filter(s => 
                    s.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (filteredList.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {categoryLabels[category]} Stack ({filteredList.length})
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {filteredList.map((skill, idx) => (
                          <div 
                            key={idx} 
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl hover:border-rose-500/30 hover:bg-rose-500/5 dark:hover:bg-rose-950/20 group transition-all"
                          >
                            <span className="text-xs text-slate-700 dark:text-slate-200">{skill}</span>
                            <button 
                              onClick={() => handleDeleteSkill(category, skill)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-all rounded"
                              aria-label={`Remove ${skill}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Award className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-xs text-slate-500">Your skill profile is empty.</p>
                <p className="text-[10px] text-slate-400 mt-1">Add your first skills below to initiate career analyzer modules.</p>
              </div>
            )}
          </div>

          {/* ADD SKILL FORM PANEL */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Add Technologies</h3>
            
            <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500"
                placeholder="E.g. GraphQL, AWS Lambda, Kubernetes..."
              />
              <select 
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-300"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="tools">Tools & DevOps</option>
              </select>
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-600/10"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Skill
              </button>
            </form>

            {/* SUGGESTED PRE-SELECTIONS BAR */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions</div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkillsList[newSkillCategory].map((sugg) => {
                  const alreadyHas = skills[newSkillCategory].some(s => s.toLowerCase() === sugg.toLowerCase());
                  if (alreadyHas) return null;
                  return (
                    <button 
                      key={sugg}
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...skills,
                          [newSkillCategory]: [...skills[newSkillCategory], sugg]
                        };
                        handleSaveSkills(updated);
                      }}
                      className="text-[9px] font-medium bg-slate-150/50 hover:bg-indigo-50 border border-slate-200/50 dark:bg-slate-950 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/20 px-2.5 py-1 rounded-lg transition-all"
                    >
                      + {sugg}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI insights and strengths radar representation */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SKILL STRENGTHS VISUAL INDEX */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coverage Index</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Frontend Dev</span>
                  <span className="text-slate-400">{skills.frontend.length} skills</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${categoryStrengths.frontend}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Backend Dev</span>
                  <span className="text-slate-400">{skills.backend.length} skills</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-650 rounded-full" style={{ width: `${categoryStrengths.backend}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Database</span>
                  <span className="text-slate-400">{skills.database.length} skills</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${categoryStrengths.database}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Tools & DevOps</span>
                  <span className="text-slate-400">{skills.tools.length} skills</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${categoryStrengths.tools}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI SKILL INSIGHT */}
          <div className="bg-gradient-to-br from-indigo-900/10 via-indigo-950/5 to-transparent dark:from-indigo-950/30 p-5 rounded-3xl border border-indigo-500/20 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center space-x-2 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-indigo-500/20 w-fit">
              <Sparkles className="w-3 h-3" />
              <span>AI Skill Insight</span>
            </div>

            {aiInsight ? (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Recommendation: {aiInsight.focus}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{aiInsight.advice}</p>
                <div className="flex items-center text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  <Check className="w-3.5 h-3.5 mr-1" /> {aiInsight.action}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 leading-normal">
                  Add more technologies to unlock personalized career mapping insights.
                </p>
              </div>
            )}
          </div>

          {/* SKILL GAPS LOG */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Identified Gaps</h3>
            
            {skillGaps.length > 0 ? (
              <div className="space-y-3">
                {skillGaps.map((gap, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{gap.name}</span>
                      <span className="text-[8px] font-bold uppercase text-amber-500">Recommended</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">{gap.why}</p>
                    <p className="text-[9px] font-semibold text-slate-450 italic">Action: {gap.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[10px] text-slate-500">No skill gaps identified yet. Add core framework technologies to evaluate matches.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
