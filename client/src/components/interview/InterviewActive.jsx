import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Flag, Clock, Loader, CheckCircle2, Circle } from 'lucide-react';

export default function InterviewActive({ session, onAnswer, onFinish, submitting }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [evaluated, setEvaluated] = useState({});
  const timerRef = useRef(null);
  const qTimerRef = useRef(null);
  const textareaRef = useRef(null);

  const questions = session?.questions || [];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    setQuestionSeconds(0);
    clearInterval(qTimerRef.current);
    qTimerRef.current = setInterval(() => setQuestionSeconds(s => s + 1), 1000);
    setAnswer(questions[currentIndex]?.userAnswer || '');
    textareaRef.current?.focus();
    return () => clearInterval(qTimerRef.current);
  }, [currentIndex]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    clearInterval(qTimerRef.current);
    const evaluation = await onAnswer(currentIndex, answer, questionSeconds);
    if (evaluation) {
      setEvaluated(prev => ({ ...prev, [currentIndex]: evaluation }));
    }
  };

  const handleNext = async () => {
    if (answer.trim() && !evaluated[currentIndex]) {
      await handleSubmitAnswer();
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const progress = Math.round(((Object.keys(evaluated).length) / questions.length) * 100);

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{session.interviewType} • {session.targetRole}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{session.difficulty} Level</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 text-primary-500" />
            <span className="font-mono text-lg font-bold">{formatTime(seconds)}</span>
          </div>
          <button
            onClick={onFinish}
            className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Flag className="w-4 h-4 mr-1.5" /> End Interview
          </button>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{Object.keys(evaluated).length} answered</span>
        </div>
        <div className="flex space-x-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                evaluated[i] ? 'bg-emerald-500' :
                i === currentIndex ? 'bg-primary-500' :
                'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 capitalize">
            {currentQuestion?.questionType || 'General'}
          </span>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatTime(questionSeconds)}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
          {currentQuestion?.questionText}
        </h2>

        {/* Answer Area */}
        {evaluated[currentIndex] ? (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">YOUR ANSWER</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{questions[currentIndex].userAnswer || 'No answer submitted'}</p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-2">AI FEEDBACK</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{evaluated[currentIndex].feedback}</p>
              <div className="grid grid-cols-2 gap-2">
                {['technicalScore','communicationScore','confidenceScore','relevanceScore'].map(k => (
                  <div key={k} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{k.replace('Score','')}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{evaluated[currentIndex][k] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              rows={7}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... Think out loud, be specific, use examples from your experience."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">{answer.length} characters · {answer.trim().split(/\s+/).filter(Boolean).length} words</p>
              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim() || submitting}
                className="btn-primary flex items-center text-sm disabled:opacity-50"
              >
                {submitting ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {submitting ? 'Evaluating...' : 'Submit & Evaluate'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button onClick={handleNext} disabled={submitting} className="flex items-center btn-primary text-sm">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button onClick={onFinish} className="flex items-center px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Flag className="w-4 h-4 mr-2" /> Finish Interview
          </button>
        )}
      </div>
    </div>
  );
}
