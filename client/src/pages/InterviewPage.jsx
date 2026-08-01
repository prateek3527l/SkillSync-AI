import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
    <div className="space-y-6">
      {/* Tab Navigation if in Setup or History */}
      {(view === 'setup' || view === 'history') && (
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            onClick={() => setView('setup')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              view === 'setup' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            New Interview
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              view === 'history' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            History & Progress
          </button>
        </div>
      )}

      {view === 'setup' && (
        <InterviewSetup onStart={handleStart} loading={loading} />
      )}
      
      {view === 'active' && (
        <InterviewActive 
          session={session} 
          onAnswer={handleAnswer} 
          onFinish={handleFinish} 
          submitting={loading} 
        />
      )}
      
      {view === 'results' && (
        <InterviewResults 
          session={session} 
          onRetake={() => { setSession(null); setView('setup'); }}
          onHistory={() => setView('history')}
        />
      )}
      
      {view === 'history' && (
        <InterviewHistory 
          onViewDetail={viewPastSession}
          onNew={() => setView('setup')}
        />
      )}
    </div>
  );
}