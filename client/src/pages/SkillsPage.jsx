import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Search,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Loader2,
  Check,
  BookOpen,
  Filter,
  RefreshCw,
  Code2,
  Server,
  Database as DbIcon,
  Wrench,
  X,
  Target,
  ArrowRight,
  Layers
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & DevOps'
};

const categoryIcons = {
  frontend: Code2,
  backend: Server,
  database: DbIcon,
  tools: Wrench
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

  const totalSkillsCount = Object.values(skills).flat().length;

  // Calculate actual category counts from stored data
  const categoryCounts = {
    frontend: skills.frontend.length,
    backend: skills.backend.length,
    database: skills.database.length,
    tools: skills.tools.length
  };

  // Generate dynamic AI Insights based on real stored skill arrays
  const getAISkillInsights = () => {
    if (totalSkillsCount === 0) return null;

    const hasReact = skills.frontend.some(s => s.toLowerCase() === 'react');
    const hasNode = skills.backend.some(s => s.toLowerCase() === 'node.js');
    const hasTS = skills.frontend.concat(skills.backend).some(s => s.toLowerCase() === 'typescript');
    const hasDocker = skills.tools.some(s => s.toLowerCase() === 'docker');

    if (hasReact && hasNode && !hasTS) {
      return {
        focus: 'TypeScript Integration',
        advice: 'Your stack has solid React and Node.js primitives. Adding TypeScript will improve strict typing and enhance full-stack developer role matching.',
        action: 'Add TypeScript'
      };
    }

    if (hasNode && !hasDocker) {
      return {
        focus: 'DevOps & Containerization',
        advice: 'Your backend core is established. Adding Docker container packaging will increase deployment compatibility for microservices.',
        action: 'Add Docker'
      };
    }

    return {
      focus: 'Stack Architecture Expansion',
      advice: 'Your tech profile is balanced across multiple layers. Continue expanding cloud deployment and automated pipeline tools.',
      action: 'Add DevOps Tools'
    };
  };

  const aiInsight = getAISkillInsights();

  // Render error screen
  if (error) {
    return (
      <div className="card min-h-[350px] flex flex-col items-center justify-center text-center p-8 border-rose-200 dark:border-rose-900/40">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Unable to Load Skills Data</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Failed to fetch your profile settings from the server. Please check your connection.
        </p>
        <button
          onClick={fetchSkillsData}
          className="btn-primary mt-6 text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry Load
        </button>
      </div>
    );
  }

  // Render loader skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mt-6" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">

      {/* 1. PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Skill Profile
            </h1>
            <span className="badge badge-primary font-mono text-[10px]">
              {totalSkillsCount} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage technical competencies that drive your AI job matching and resume gap analysis.
          </p>
        </div>

        {saving && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold self-start md:self-auto">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving Changes...</span>
          </div>
        )}
      </motion.div>

      {/* 2. SKILL PROFILE OVERVIEW STATS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {Object.entries(categoryLabels).map(([catKey, label]) => {
          const Icon = categoryIcons[catKey];
          const count = categoryCounts[catKey];
          const isSelected = selectedFilter === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setSelectedFilter(selectedFilter === catKey ? 'all' : catKey)}
              className={`card p-4 text-left transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {count}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {label}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {count === 1 ? '1 technology' : `${count} technologies`}
              </p>

              {/* Progress visual bar relative to max */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalSkillsCount > 0 ? (count / totalSkillsCount) * 100 : 0}%` }}
                />
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* 3. MAIN SECTION: MY SKILLS & ADD SKILL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: MY SKILLS DISPLAY (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">

          {/* FILTER & SEARCH BAR */}
          <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All ({totalSkillsCount})
              </button>

              {Object.entries(categoryLabels).map(([catKey, label]) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedFilter(catKey)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    selectedFilter === catKey
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {label} ({categoryCounts[catKey]})
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* MY SKILLS CATEGORY GROUPS */}
          {totalSkillsCount > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {Object.entries(categoryLabels).map(([catKey, label]) => {
                if (selectedFilter !== 'all' && selectedFilter !== catKey) return null;

                const list = skills[catKey] || [];
                const filteredList = list.filter(s =>
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filteredList.length === 0 && searchQuery) return null;

                const Icon = categoryIcons[catKey];

                return (
                  <motion.div
                    key={catKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {label}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {filteredList.length} {filteredList.length === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>

                    {filteredList.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <AnimatePresence>
                          {filteredList.map((skill, idx) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-rose-300 dark:hover:border-rose-900/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all"
                            >
                              <span>{skill}</span>
                              <button
                                onClick={() => handleDeleteSkill(catKey, skill)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                                title={`Remove ${skill}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        No skills added to {label} yet.
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* 6. ONBOARDING EMPTY STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12 text-center flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-300 dark:border-slate-700"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Layers className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Build Your Technical Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Add your first skills to unlock target role matching, gap analysis, and tailored career recommendations.
                </p>
              </div>
              <button
                onClick={() => {
                  const inputEl = document.getElementById('new-skill-input');
                  if (inputEl) inputEl.focus();
                }}
                className="btn-primary py-2.5 px-6 text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Your First Skill
              </button>
            </motion.div>
          )}

        </div>

        {/* RIGHT COLUMN: ADD SKILL & CAREER RELEVANCE (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 4. ADD SKILL COMPACT PANEL */}
          <div className="card p-6 space-y-4 border-t-4 border-t-indigo-600">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" /> Add New Technology
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Modifies your saved technical profile in real-time.
              </p>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skill Name</label>
                <input
                  id="new-skill-input"
                  type="text"
                  required
                  placeholder="e.g. TypeScript, GraphQL, Docker..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="input-field text-xs cursor-pointer"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="tools">Tools & DevOps</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Add to {categoryLabels[newSkillCategory]}</span>
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Suggestions for {categoryLabels[newSkillCategory]}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkillsList[newSkillCategory].map((sugg) => {
                  const currentList = skills[newSkillCategory] || [];
                  const alreadyHas = currentList.some(s => s.toLowerCase() === sugg.toLowerCase());
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
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      {sugg}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. CAREER RELEVANCE & AI INSIGHT */}
          {aiInsight && (
            <div className="card p-6 bg-slate-900 text-white dark:bg-slate-900 border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Career Relevance Insight
                </h4>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-white">Focus: {aiInsight.focus}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiInsight.advice}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <Target className="w-3.5 h-3.5" />
                <span>Action: {aiInsight.action}</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
