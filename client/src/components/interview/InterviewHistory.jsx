import { useState, useEffect } from 'react';
import { Clock, Trophy, ChevronRight, Trash2, Loader, PlayCircle } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader className="w-8 h-8 animate-spin mb-4 text-primary-500" />
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Interviews</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review your progress and AI feedback</p>
        </div>
        <button onClick={onNew} className="btn-primary flex items-center text-sm">
          <PlayCircle className="w-4 h-4 mr-2" /> New Interview
        </button>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-16 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No interviews yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start your first AI mock interview to practice and improve.</p>
          <button onClick={onNew} className="btn-primary">Start Practice</button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(session => (
            <div 
              key={session._id} 
              onClick={() => onViewDetail(session._id)}
              className="card p-5 cursor-pointer hover:border-primary-500 transition-all flex flex-col md:flex-row md:items-center justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase ${
                    session.overallScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    session.overallScore >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    Score: {session.overallScore}/100
                  </span>
                  <span className="text-xs font-semibold text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded">
                    {session.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {session.interviewType}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  Target: {session.targetRole}
                  <span className="mx-2">•</span>
                  {new Date(session.completedAt).toLocaleDateString()}
                  <span className="mx-2">•</span>
                  <Clock className="w-3.5 h-3.5 mr-1" /> {Math.floor((session.duration || 0)/60)}m {((session.duration||0)%60)}s
                </p>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleDelete(session._id, e)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="p-2 text-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
