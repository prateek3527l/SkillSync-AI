import { useState } from 'react';
import { Sparkles, Clock, Target, Brain, ChevronRight } from 'lucide-react';

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
  { label: 'Beginner', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', desc: 'Fundamentals & concepts' },
  { label: 'Intermediate', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', desc: 'Real-world application' },
  { label: 'Advanced', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', desc: 'Expert-level depth' },
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Mock Interview</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure your session and practice with realistic AI-generated questions</p>
      </div>

      {/* Interview Type */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Interview Type</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose the type of interview you want to practice</p>

        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">General</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERVIEW_TYPES.filter(t => t.category === 'general').map(type => (
              <button
                key={type.label}
                onClick={() => setConfig(p => ({ ...p, interviewType: type.label }))}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  config.interviewType === type.label
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Technical Topics</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTERVIEW_TYPES.filter(t => t.category === 'tech').map(type => (
              <button
                key={type.label}
                onClick={() => setConfig(p => ({ ...p, interviewType: type.label }))}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  config.interviewType === type.label
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Config Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Role */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary-500" /> Target Role
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">What position are you preparing for?</p>
          <select
            value={config.targetRole}
            onChange={e => setConfig(p => ({ ...p, targetRole: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
          >
            {TARGET_ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Question Count */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary-500" /> Session Length
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">How many questions do you want?</p>
          <div className="grid grid-cols-4 gap-2">
            {QUESTION_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setConfig(p => ({ ...p, questionCount: n }))}
                className={`py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                  config.questionCount === n
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">≈ {estimatedMinutes} minutes</p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Difficulty Level</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.label}
              onClick={() => setConfig(p => ({ ...p, difficulty: d.label }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.difficulty === d.label ? d.bg + ' border-current ' + d.color : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <p className={`font-bold text-sm ${config.difficulty === d.label ? d.color : 'text-gray-700 dark:text-gray-300'}`}>{d.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col items-center space-y-3">
        {!config.interviewType && (
          <p className="text-sm text-amber-600 dark:text-amber-400">⚠️ Please select an interview type to continue</p>
        )}
        <button
          onClick={handleStart}
          disabled={!config.interviewType || loading}
          className="btn-primary flex items-center text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" /> Start Interview
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
