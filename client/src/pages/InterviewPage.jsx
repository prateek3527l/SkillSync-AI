import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, History as HistoryIcon } from 'lucide-react';
import InterviewSetup from '../components/interview/InterviewSetup';
import InterviewActive from '../components/interview/InterviewActive';
import InterviewResults from '../components/interview/InterviewResults';
import InterviewHistory from '../components/interview/InterviewHistory';
import api from '../services/api';

export default function InterviewPage() {
  const [view, setView] = useState('setup'); // setup, active, results, history
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // If URL has ?tab=history, default to history
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'history') {
      setView('history');
    }
  }, []);

  const handleStart = async (config) => {
    setLoading(true);
    try {
      const res = await api.post('/api/interview/start', config);
      setSession(res.data);
      setView('active');
      toast.success('Interview session created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionIndex, answer, timeTaken) => {
    setLoading(true);
    try {
      const res = await api.post('/api/interview/answer', {
        sessionId: session._id,
        questionIndex,
        answer,
        timeTaken
      });
      return res.data.evaluation;
    } catch (error) {
      toast.error('Failed to submit answer');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!window.confirm('Are you sure you want to finish the interview now?')) return;

    const finishPromise = api.post('/api/interview/finish', { sessionId: session._id });

    toast.promise(finishPromise, {
      loading: 'Generating AI evaluation and feedback...',
      success: 'Interview completed!',
      error: 'Failed to complete interview'
    });

    try {
      const res = await finishPromise;
      setSession(res.data);
      setView('results');
    } catch (error) {
      console.error(error);
    }
  };

  const viewPastSession = async (id) => {
    try {
      const res = await api.get(`/api/interview/history/${id}`);
      setSession(res.data);
      setView('results');
    } catch (error) {
      toast.error('Failed to load session details');
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] space-y-6">
      {/* Tab Navigation if in Setup or History */}
      {(view === 'setup' || view === 'history') && (
        <div className="flex justify-center mb-6 pt-2">
          <div className="inline-flex p-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
            <button
              onClick={() => setView('setup')}
              className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors duration-200 ${
                view === 'setup'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {view === 'setup' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-700/90 rounded-xl border border-gray-200/60 dark:border-gray-600/60 shadow-xs"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                New Interview
              </span>
            </button>

            <button
              onClick={() => setView('history')}
              className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors duration-200 ${
                view === 'history'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {view === 'history' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-gray-700/90 rounded-xl border border-gray-200/60 dark:border-gray-600/60 shadow-xs"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <HistoryIcon className="w-4 h-4 mr-2 text-indigo-500" />
                History & Progress
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <AnimatePresence mode="wait">
        {view === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <InterviewSetup onStart={handleStart} loading={loading} />
          </motion.div>
        )}

        {view === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <InterviewActive
              session={session}
              onAnswer={handleAnswer}
              onFinish={handleFinish}
              submitting={loading}
            />
          </motion.div>
        )}

        {view === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <InterviewResults
              session={session}
              onRetake={() => { setSession(null); setView('setup'); }}
              onHistory={() => setView('history')}
            />
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <InterviewHistory
              onViewDetail={viewPastSession}
              onNew={() => setView('setup')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
