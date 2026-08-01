import { Trophy, Target, TrendingUp, AlertCircle, BookOpen, Star, RefreshCw } from 'lucide-react';

export default function InterviewResults({ session, onRetake, onHistory }) {
  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Score */}
      <div className="card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-purple-500" />
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Interview Completed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{session.interviewType} • {session.targetRole}</p>
        
        <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 border-primary-100 dark:border-primary-900/30">
          <span className="text-4xl font-black text-primary-600 dark:text-primary-400">{session.overallScore}</span>
          <span className="text-xs font-semibold text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Technical', val: session.technicalScore, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Communication', val: session.communicationScore, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Confidence', val: session.confidenceScore, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Time Mgmt', val: session.timeManagementScore, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border border-gray-100 dark:border-gray-800 ${s.bg}`}>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Overall Feedback */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary-500" /> Overall Assessment
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {session.overallFeedback}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths & Weaknesses */}
        <div className="card">
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" /> Top Strengths
          </h3>
          <ul className="space-y-3">
            {session.strengths?.map((s, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mt-8 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" /> Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {session.weaknesses?.map((w, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2.5 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Plan */}
        <div className="card">
          <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" /> Suggested Improvements
          </h3>
          <ul className="space-y-3 mb-8">
            {session.suggestedImprovements?.map((imp, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                <span className="text-indigo-500 mr-2.5 font-bold">{i + 1}.</span>
                {imp}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" /> Recommended Study Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {session.studyTopics?.map((topic, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-100 dark:border-blue-800">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <button onClick={onRetake} className="btn-primary flex items-center justify-center">
          <RefreshCw className="w-4 h-4 mr-2" /> Practice Again
        </button>
        <button onClick={onHistory} className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          View All History
        </button>
      </div>
    </div>
  );
}
