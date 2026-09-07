import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Target, Brain, ChevronRight, Check } from 'lucide-react';

const INTERVIEW_TYPES = [
  { label: 'HR Interview', icon: '🤝', category: 'general' },
  { label: 'Technical Interview', icon: '⚙️', category: 'general' },
  { label: 'Behavioral Interview', icon: '💬', category: 'general' },
  { label: 'JavaScript', icon: '🟡', category: 'tech' },
  { label: 'React', icon: '⚛️', category: 'tech' },
  { label: 'Node.js', icon: '🟢', category: 'tech' },
  { label: 'Express.js', icon: '🚂', category: 'tech' },
  { label: 'MongoDB', icon: '🍃', category: 'tech' },
  { label: 'SQL', icon: '🗄️', category: 'tech' },
  { label: 'DSA', icon: '🔗', category: 'tech' },
  { label: 'System Design', icon: '🏗️', category: 'tech' },
  { label: 'Custom Interview', icon: '✨', category: 'general' },
];

const TARGET_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Software Engineering Intern', 'MERN Stack Developer',
  'React Developer', 'Node.js Developer', 'DevOps Engineer',
  'Mobile Developer', 'Data Engineer',
];

const DIFFICULTIES = [
  { label: 'Beginner', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60', desc: 'Fundamentals & core concepts' },
  { label: 'Intermediate', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60', desc: 'Real-world application & scenarios' },
  { label: 'Advanced', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60', desc: 'Expert depth & architectural design' },
];

const QUESTION_COUNTS = [3, 5, 7, 10];

export default function InterviewSetup({ onStart, loading }) {
  const [config, setConfig] = useState({
    interviewType: '',
    targetRole: 'Frontend Developer',
    difficulty: 'Intermediate',
    questionCount: 5,
  });

  const estimatedMinutes = config.questionCount * 2;

  const handleStart = () => {
    if (!config.interviewType) return;
    onStart(config);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-sm border border-indigo-500/20">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          AI Interview Cockpit Setup
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-xs md:text-sm">
          Customize your targeted interview session with real-time AI evaluation and role-tailored questions.
        </p>
      </div>

      {/* Main Configuration Form Card */}
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 md:p-8 border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-8">

        {/* 1. Interview Type Selection */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-700/60 pb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">1. Select Interview Type</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Choose a general format or focus on a specific technical domain
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">General Formats</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INTERVIEW_TYPES.filter(t => t.category === 'general').map(type => {
                  const isSelected = config.interviewType === type.label;
                  return (
                    <motion.button
                      key={type.label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setConfig(p => ({ ...p, interviewType: type.label }))}
                      className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100 shadow-2xs font-semibold'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-xs md:text-sm font-semibold">{type.label}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Technical Topics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INTERVIEW_TYPES.filter(t => t.category === 'tech').map(type => {
                  const isSelected = config.interviewType === type.label;
                  return (
                    <motion.button
                      key={type.label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setConfig(p => ({ ...p, interviewType: type.label }))}
                      className={`relative flex items-center justify-between px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100 shadow-2xs'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">{type.icon}</span>
                        <span className="text-xs font-semibold truncate">{type.label}</span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Target Role & 3. Session Length Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          {/* Target Role */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
              <Target className="w-4 h-4 mr-2 text-indigo-500" /> 2. Target Role
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Position level to adapt question context</p>
            <select
              value={config.targetRole}
              onChange={e => setConfig(p => ({ ...p, targetRole: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" /> 3. Session Length
              </h2>
              <span className="text-xs font-semibold text-gray-400 font-mono">≈ {estimatedMinutes}m duration</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total number of questions</p>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map(n => (
                <button
                  key={n}
                  onClick={() => setConfig(p => ({ ...p, questionCount: n }))}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                    config.questionCount === n
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {n} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Difficulty Level */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">4. Difficulty Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map(d => {
              const isSelected = config.difficulty === d.label;
              return (
                <button
                  key={d.label}
                  onClick={() => setConfig(p => ({ ...p, difficulty: d.label }))}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? `${d.bg} ${d.color} border-current shadow-2xs ring-1 ring-current`
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider">{d.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Launch Action & Validation */}
      <div className="flex flex-col items-center space-y-3">
        {!config.interviewType && (
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800">
            ⚠️ Please select an interview type to launch session
          </p>
        )}
        <motion.button
          whileHover={{ scale: config.interviewType && !loading ? 1.01 : 1 }}
          whileTap={{ scale: config.interviewType && !loading ? 0.99 : 1 }}
          onClick={handleStart}
          disabled={!config.interviewType || loading}
          className="btn-primary flex items-center justify-center text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2.5" />
              Initializing AI Cockpit...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Launch Interview Cockpit
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
