import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, ChevronRight, Trash2, Loader2, PlayCircle, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function InterviewHistory({ onViewDetail, onNew }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/interview/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this interview record?')) return;
    try {
      await api.delete(`/api/interview/history/${id}`);
      setHistory(prev => prev.filter(h => h._id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
        <p className="text-xs font-semibold uppercase tracking-wider">Retrieving past sessions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Past Interview Sessions</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Review your performance history, score progression, and AI evaluation feedback</p>
        </div>
        <button onClick={onNew} className="btn-primary flex items-center justify-center text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs self-start sm:self-auto">
          <PlayCircle className="w-4 h-4 mr-2" /> Start New Session
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/90 rounded-2xl text-center py-16 px-4 space-y-4 border-2 border-dashed border-gray-200 dark:border-gray-700/80">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No interview records found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm mx-auto mt-1">
              Complete your first AI mock interview session to record analytics, scores, and evaluation history.
            </p>
          </div>
          <button onClick={onNew} className="btn-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-xs">
            Launch Practice Cockpit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              onClick={() => onViewDetail(session._id)}
              className="bg-white dark:bg-gray-800/90 rounded-2xl p-5 cursor-pointer border border-gray-200/80 dark:border-gray-700/80 hover:border-indigo-500/80 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-2xs hover:shadow-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-md uppercase tracking-wider font-mono ${
                    session.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                    session.overallScore >= 60 ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    Score: {session.overallScore ?? 0}/100
                  </span>
                  {session.difficulty && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-600/60">
                      {session.difficulty}
                    </span>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {session.interviewType}
                </h3>

                <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-y-1 gap-x-3">
                  {session.targetRole && (
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Target: {session.targetRole}</span>
                  )}
                  {session.targetRole && session.completedAt && <span>•</span>}
                  {session.completedAt && (
                    <span className="flex items-center font-mono">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {new Date(session.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  {session.duration && <span>•</span>}
                  {session.duration && (
                    <span className="flex items-center font-mono">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {Math.floor((session.duration || 0)/60)}m {((session.duration||0)%60)}s
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700/60 justify-end">
                <button
                  onClick={(e) => handleDelete(session._id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
