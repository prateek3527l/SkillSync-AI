import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, AlertCircle, BookOpen, Star, RefreshCw, History } from 'lucide-react';

export default function InterviewResults({ session, onRetake, onHistory }) {
  if (!session) return null;

  const score = session.overallScore ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. Header Completion Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800/90 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden space-y-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs border-t-4 border-t-indigo-600"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-center shadow-2xs">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            Interview Session Completed
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
            {session.interviewType} • {session.targetRole} ({session.difficulty} Level)
          </p>
        </div>

        {/* Overall Score Circle Indicator */}
        <div className="pt-2">
          <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-8 border-indigo-100 dark:border-indigo-950/60 bg-white dark:bg-gray-800 shadow-sm">
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{score}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Overall Score</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Score Breakdown Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Technical', val: session.technicalScore, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40' },
          { label: 'Communication', val: session.communicationScore, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40' },
          { label: 'Confidence', val: session.confidenceScore, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40' },
          { label: 'Time Mgmt', val: session.timeManagementScore, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg} text-center space-y-1 bg-white dark:bg-gray-800`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black ${s.color} font-mono`}>{s.val ?? 0}</p>
          </div>
        ))}
      </motion.div>

      {/* 3. Overall Feedback */}
      {session.overallFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 md:p-8 space-y-3 border border-gray-200/80 dark:border-gray-700/80 shadow-xs"
        >
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
            <Star className="w-4 h-4 mr-2 text-indigo-500" /> Overall AI Assessment
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {session.overallFeedback}
          </p>
        </motion.div>
      )}

      {/* 4. Detailed Strengths, Weaknesses, Improvements, Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Strengths & Weaknesses */}
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 space-y-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
          {session.strengths?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 mr-2" /> Key Strengths
              </h3>
              <ul className="space-y-2.5">
                {session.strengths.map((s, i) => (
                  <li key={i} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.weaknesses?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700/60">
              <h3 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 mr-2" /> Areas for Improvement
              </h3>
              <ul className="space-y-2.5">
                {session.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2.5 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Improvements & Study Topics */}
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 space-y-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
          {session.suggestedImprovements?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center uppercase tracking-wider">
                <Target className="w-4 h-4 mr-2" /> Actionable Recommendations
              </h3>
              <ul className="space-y-2.5">
                {session.suggestedImprovements.map((imp, i) => (
                  <li key={i} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-indigo-500 font-bold mr-2 text-xs font-mono">{i + 1}.</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.studyTopics?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700/60">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center uppercase tracking-wider">
                <BookOpen className="w-4 h-4 mr-2" /> Recommended Focus Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.studyTopics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 5. Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
      >
        <button onClick={onRetake} className="btn-primary flex items-center justify-center text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-xs">
          <RefreshCw className="w-4 h-4 mr-2" /> Practice Again
        </button>
        <button
          onClick={onHistory}
          className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center shadow-2xs"
        >
          <History className="w-4 h-4 mr-2" /> View Interview History
        </button>
      </motion.div>
    </div>
  );
}
