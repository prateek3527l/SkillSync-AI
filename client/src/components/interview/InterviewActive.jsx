import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, Clock, CheckCircle2, Loader2, Sparkles, Brain, Award } from 'lucide-react';

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

  if (!session) return null;

  const totalQuestions = questions.length || 1;
  const answeredCount = Object.keys(evaluated).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Timer visual threshold calculations
  const targetPerQuestion = 120;
  const timerProgress = Math.min(100, (questionSeconds / targetPerQuestion) * 100);
  const isCritical = questionSeconds >= 120;
  const isWarning = questionSeconds >= 90 && questionSeconds < 120;

  const strokeColor = isCritical
    ? '#ef4444'
    : isWarning
    ? '#f59e0b'
    : '#6366f1';

  const wordsCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. INTERVIEW SESSION HEADER (COCKPIT HEADER) */}
      <header className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 md:p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-100 dark:border-indigo-900/40">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interview Session
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-600/60">
                {session.difficulty}
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {session.targetRole}
              {session.interviewType && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({session.interviewType})
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Question Progress</span>
            <span className="text-sm font-extrabold text-gray-900 dark:text-white font-mono">
              Question {String(currentIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={onFinish}
            className="flex items-center px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shadow-2xs"
          >
            <Flag className="w-3.5 h-3.5 mr-1.5" /> End Interview
          </button>
        </div>
      </header>

      {/* 2. DESKTOP COCKPIT LAYOUT (>=768px TWO COLUMNS) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        {/* MAIN COLUMN (8 Cols) */}
        <main className="md:col-span-8 space-y-6">

          {/* 4. QUESTION PROGRESS */}
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                QUESTION {String(currentIndex + 1).padStart(2, '0')} OF {String(totalQuestions).padStart(2, '0')}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {answeredCount} of {totalQuestions} Completed
              </span>
            </div>

            {/* Segmented Progress bar */}
            <div className="flex space-x-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  title={`Go to Question ${i + 1}`}
                  className={`relative flex-1 h-2.5 rounded-full transition-all duration-300 ${
                    evaluated[i]
                      ? 'bg-emerald-500'
                      : i === currentIndex
                      ? 'bg-indigo-600 shadow-xs'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {i === currentIndex && (
                    <motion.div
                      layoutId="currentIndicator"
                      className="absolute -inset-0.5 rounded-full border border-indigo-500 animate-pulse"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 5. QUESTION CARD WITH ANTIMATEPRESENCE HORIZONTAL SLIDE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 md:p-8 border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-6"
            >
              {/* Question Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 uppercase tracking-wide">
                    Question {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  {currentQuestion?.questionType && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300">
                      {currentQuestion.questionType}
                    </span>
                  )}
                  {session.difficulty && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300">
                      {session.difficulty}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs font-semibold text-gray-400 space-x-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{formatTime(questionSeconds)}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion?.questionText}
                </h2>
              </div>

              {/* 6. ANSWER WORKSPACE & 8. EVALUATION FEEDBACK */}
              {evaluated[currentIndex] ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 pt-2"
                >
                  {/* Preserved Submitted Answer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200/80 dark:border-gray-700/60 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Your Response
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {questions[currentIndex].userAnswer || answer}
                    </p>
                  </div>

                  {/* AI Evaluation Card */}
                  <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1.5 text-emerald-500" /> AI Feedback & Evaluation
                      </p>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                        Evaluated
                      </span>
                    </div>

                    {evaluated[currentIndex].feedback && (
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                        {evaluated[currentIndex].feedback}
                      </p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {[
                        { key: 'technicalScore', label: 'Technical' },
                        { key: 'communicationScore', label: 'Communication' },
                        { key: 'confidenceScore', label: 'Confidence' },
                        { key: 'relevanceScore', label: 'Relevance' }
                      ].filter(({ key }) => evaluated[currentIndex][key] !== undefined).map(({ key, label }) => (
                        <div key={key} className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center shadow-2xs">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</p>
                          <p className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                            {evaluated[currentIndex][key]}<span className="text-xs font-normal text-gray-400">/100</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      YOUR ANSWER
                    </label>
                    <span className="text-xs font-medium text-gray-400 font-mono">
                      {answer.length} chars · {wordsCount} words
                    </span>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={7}
                    disabled={submitting}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type your response clearly. Formulate a structured answer with technical details and practical examples..."
                    className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all disabled:opacity-60"
                  />

                  {/* 7. SUBMIT INTERACTION */}
                  <div className="flex items-center justify-end pt-1">
                    <motion.button
                      whileHover={{ scale: !answer.trim() || submitting ? 1 : 1.01 }}
                      whileTap={{ scale: !answer.trim() || submitting ? 1 : 0.99 }}
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || submitting}
                      className="btn-primary flex items-center text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                          Evaluating your response...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Submit & Evaluate Answer →
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 9. QUESTION NAVIGATION */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0 || submitting}
              className="flex items-center px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center px-5 py-2.5 text-xs font-bold btn-primary rounded-xl shadow-xs disabled:opacity-50"
              >
                Next Question <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="flex items-center px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all"
              >
                <Flag className="w-4 h-4 mr-1.5" /> Finish Interview
              </button>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: INTERVIEW CONTEXT PANEL (4 Cols) */}
        <aside className="md:col-span-4 space-y-6">

          {/* 3. GAMIFIED CIRCULAR TIMER */}
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 text-center space-y-4 border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700/60 pb-3">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-indigo-500" /> Question Timer
              </span>
              <span className="text-gray-400 font-normal">Active</span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-gray-100 dark:stroke-gray-700"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated SVG Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={strokeColor}
                  strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * timerProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  transition={{ ease: "easeInOut", duration: 0.4 }}
                />
              </svg>
              {/* Timer Text in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-mono text-2xl font-black ${
                  isCritical ? 'text-red-600 dark:text-red-400 animate-pulse' :
                  isWarning ? 'text-amber-600 dark:text-amber-400' :
                  'text-gray-900 dark:text-white'
                }`}>
                  {formatTime(questionSeconds)}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                  {isCritical ? 'Pacing Alert' : isWarning ? 'Approaching 2m' : 'Target ~2m'}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
              Total Elapsed: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{formatTime(seconds)}</span>
            </div>
          </div>

          {/* INTERVIEW CONTEXT PANEL */}
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl p-6 space-y-4 border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700/60 pb-3 flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-indigo-500" /> Interview Context
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Target Role</span>
                <span className="font-bold text-gray-900 dark:text-white">{session.targetRole}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                <span className="font-bold text-gray-900 dark:text-white">{session.difficulty}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Questions Completed</span>
                <span className="font-bold text-gray-900 dark:text-white">{answeredCount} / {totalQuestions}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Questions Remaining</span>
                <span className="font-bold text-gray-900 dark:text-white">{totalQuestions - answeredCount}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500 dark:text-gray-400">Completion</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
