import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, ChevronRight, CheckCircle2, AlertCircle, BarChart2, FileText, Award, Compass, Briefcase, UserCheck } from 'lucide-react';
import buddyAvatar from '../../assets/buddy_mascot.png';

const PAGE_CONFIG = {
  '/dashboard': {
    title: 'Career Command Center',
    peekTip: 'Track your career progress and see what to focus on next.',
    expandedDesc: 'This is your career command center. Here you can track your progress, view recent activity, and decide what to work on next.',
    actions: [
      { label: 'View your analytics', path: '/analytics', icon: BarChart2 },
      { label: 'Analyze your resume', path: '/resume', icon: FileText },
      { label: 'Explore your skills', path: '/skills', icon: Award }
    ]
  },
  '/resume': {
    title: 'Resume Analyzer',
    peekTip: 'Upload your resume and choose a target role to see your skill match and gaps.',
    expandedDesc: 'Upload your resume PDF to extract technical skills, analyze ATS compliance, and identify missing role qualifications.',
    actions: [
      { label: 'Manage your skills', path: '/skills', icon: Award },
      { label: 'View recommendations', path: '/recommendations', icon: Compass }
    ]
  },
  '/skills': {
    title: 'Your Skill Profile',
    peekTip: 'Add technologies you know to power role matching.',
    expandedDesc: 'Keep your technical skills accurate and categorized. Verified skills directly influence your career path recommendations.',
    actions: [
      { label: 'Explore career paths', path: '/recommendations', icon: Compass },
      { label: 'Practice AI interview', path: '/interview', icon: UserCheck }
    ]
  },
  '/recommendations': {
    title: 'Career Recommendations',
    peekTip: 'Explore career paths and see which skills could improve your matches.',
    expandedDesc: 'Discover tailored career trajectories based on your skill inventory and identify strategic learning goals.',
    actions: [
      { label: 'Add missing skills', path: '/skills', icon: Award },
      { label: 'Upload updated resume', path: '/resume', icon: FileText }
    ]
  },
  '/jobs': {
    title: 'Job Tracker',
    peekTip: 'Keep your applications organized and track where each application stands.',
    expandedDesc: 'Track your application status, interview schedules, and follow-up deadlines for all target opportunities.',
    actions: [
      { label: 'Practice interview', path: '/interview', icon: UserCheck },
      { label: 'View analytics', path: '/analytics', icon: BarChart2 }
    ]
  },
  '/interview': {
    title: 'AI Mock Interview',
    peekTip: 'Practice interview questions and review your performance.',
    expandedDesc: 'Simulate realistic technical and behavioral interviews with real-time feedback and score breakdown.',
    actions: [
      { label: 'Track applications', path: '/jobs', icon: Briefcase },
      { label: 'Update project showcase', path: '/projects', icon: Award }
    ]
  },
  '/projects': {
    title: 'Project Showcase',
    peekTip: 'Showcase the projects that demonstrate what you can build.',
    expandedDesc: 'Add high-impact technical projects, repositories, and live links to demonstrate practical capability.',
    actions: [
      { label: 'Update skill profile', path: '/skills', icon: Award },
      { label: 'View career paths', path: '/recommendations', icon: Compass }
    ]
  },
  '/analytics': {
    title: 'Career Analytics',
    peekTip: 'See how your career activity and performance is changing over time.',
    expandedDesc: 'Monitor your weekly skill growth, job response rates, and resume ATS score improvements.',
    actions: [
      { label: 'Career command center', path: '/dashboard', icon: BarChart2 },
      { label: 'Job tracker', path: '/jobs', icon: Briefcase }
    ]
  },
  '/profile': {
    title: 'User Profile',
    peekTip: 'Keep your professional information up to date.',
    expandedDesc: 'Update your contact information, target job title, and bio to maintain an accurate candidate profile.',
    actions: [
      { label: 'Manage settings', path: '/settings', icon: BarChart2 },
      { label: 'Go to dashboard', path: '/dashboard', icon: Compass }
    ]
  },
  '/settings': {
    title: 'Account Settings',
    peekTip: 'Manage your SkillSync preferences and account settings here.',
    expandedDesc: 'Configure account security, notification preferences, and application themes.',
    actions: [
      { label: 'Edit profile', path: '/profile', icon: UserCheck }
    ]
  },
  '/login': {
    title: 'Welcome Back',
    peekTip: 'Sign in to access your career command center.',
    expandedDesc: 'Log in to access your saved resume evaluations, skill tracking, and application pipeline.',
    actions: []
  },
  '/register': {
    title: 'Create Account',
    peekTip: 'Start building your tailored career roadmap.',
    expandedDesc: 'Sign up to unlock AI resume analysis, skill recommendations, and automated career insights.',
    actions: []
  }
};

const STORAGE_KEY_SEEN = 'skillsync_buddy_seen';

export default function SkillSyncBuddy() {
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const [activeMessage, setActiveMessage] = useState(null);
  const [eventType, setEventType] = useState('info'); // 'info' | 'success' | 'error'

  const getSeenRoutes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SEEN);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const markRouteSeen = (pathname) => {
    try {
      const seen = getSeenRoutes();
      if (!seen.includes(pathname)) {
        seen.push(pathname);
        localStorage.setItem(STORAGE_KEY_SEEN, JSON.stringify(seen));
      }
    } catch (e) {
      // Fail silently
    }
  };

  // Route change handler
  useEffect(() => {
    if (sessionDismissed) return;

    const currentPath = location.pathname;
    const config = PAGE_CONFIG[currentPath] || PAGE_CONFIG['/dashboard'];

    if (config) {
      setActiveMessage(config.peekTip);
      setEventType('info');
      setIsExpanded(false);
      markRouteSeen(currentPath);
    }
  }, [location.pathname, sessionDismissed]);

  // Event listener handler
  const handleBuddyEvent = useCallback((event) => {
    if (!event || !event.detail) return;
    const { message, type } = event.detail;

    if (!message) return;

    let normalizedType = type || 'info';
    let displayMessage = message;

    if (normalizedType === 'error' && (!displayMessage || displayMessage.length > 200)) {
      displayMessage = "Something went wrong. Let's try that again.";
    }

    setActiveMessage(displayMessage);
    setEventType(normalizedType);
    setIsExpanded(false);
    setSessionDismissed(false);
  }, []);

  useEffect(() => {
    window.addEventListener('skillsync_buddy_trigger', handleBuddyEvent);

    const handleMessageAlias = (e) => handleBuddyEvent({ detail: { message: e.detail?.message || e.detail, type: 'info' } });
    const handleSuccessAlias = (e) => handleBuddyEvent({ detail: { message: e.detail?.message || e.detail || 'Action completed successfully.', type: 'success' } });
    const handleErrorAlias = (e) => handleBuddyEvent({ detail: { message: e.detail?.message || e.detail || "Something went wrong. Let's try that again.", type: 'error' } });

    window.addEventListener('skillsync_buddy_message', handleMessageAlias);
    window.addEventListener('skillsync_buddy_success', handleSuccessAlias);
    window.addEventListener('skillsync_buddy_error', handleErrorAlias);

    return () => {
      window.removeEventListener('skillsync_buddy_trigger', handleBuddyEvent);
      window.removeEventListener('skillsync_buddy_message', handleMessageAlias);
      window.removeEventListener('skillsync_buddy_success', handleSuccessAlias);
      window.removeEventListener('skillsync_buddy_error', handleErrorAlias);
    };
  }, [handleBuddyEvent]);

  if (sessionDismissed) {
    return null;
  }

  const handleDismiss = (e) => {
    e.stopPropagation();
    setSessionDismissed(true);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const config = PAGE_CONFIG[location.pathname] || PAGE_CONFIG['/dashboard'];

  return (
    <aside
      aria-label="SkillSync Buddy Assistant"
      className="fixed bottom-0 right-4 sm:right-10 z-50 pointer-events-auto flex flex-col items-end select-none"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* STATE 1: PEEKING STATE — EXACT MATCH TO REFERENCE IMAGE (HEAD + SHOULDERS + WAVING HAND + UPPER TORSO VISIBLE, LOWER BODY CLIPPED BELOW SCREEN) */
          <motion.div
            key="buddy-peek"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-end cursor-pointer group"
            onClick={handleToggleExpand}
          >
            {/* SPEECH BUBBLE ABOVE PEEKING CHARACTER */}
            {activeMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className={`mb-2 max-w-[220px] sm:max-w-[265px] bg-white dark:bg-slate-900 border rounded-2xl px-4 py-3 shadow-xl hover:shadow-2xl transition-all duration-200 relative text-xs text-slate-800 dark:text-slate-100 mr-2 ${
                  eventType === 'success'
                    ? 'border-emerald-200/80 dark:border-emerald-800/80 shadow-emerald-500/10'
                    : eventType === 'error'
                    ? 'border-rose-200/80 dark:border-rose-800/80 shadow-rose-500/10'
                    : 'border-slate-200/90 dark:border-slate-800 shadow-slate-900/5'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {eventType === 'success' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : eventType === 'error' ? (
                    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    {eventType === 'success' && (
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">Nice!</p>
                    )}
                    {eventType === 'error' && (
                      <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-0.5">Something went wrong.</p>
                    )}
                    <p className="text-[11px] font-semibold leading-relaxed tracking-tight text-slate-800 dark:text-slate-100">
                      {activeMessage}
                    </p>
                  </div>
                </div>

                {/* Speech Bubble Pointer */}
                <div className="absolute -bottom-1.5 right-12 w-3 h-3 bg-white dark:bg-slate-900 border-b border-r border-slate-200/90 dark:border-slate-800 rotate-45" />
              </motion.div>
            )}

            {/* PEEKING CLIPPING VIEWPORT — Shows head, face, waving hand, hoodie & chest logo; clips waist/legs below bottom edge */}
            <div className="relative w-40 sm:w-52 h-24 sm:h-32 overflow-hidden flex items-start justify-center group-hover:-translate-y-1.5 transition-transform duration-200">
              <img
                src={buddyAvatar}
                alt="SkillSync Buddy Peeking Mascot"
                className="w-44 sm:w-56 h-44 sm:h-56 object-cover object-top -translate-y-2 drop-shadow-xl"
              />
            </div>
          </motion.div>
        ) : (
          /* STATE 2: EXPANDED CARD STATE — EXACT MATCH TO REFERENCE IMAGE */
          <motion.div
            key="buddy-expanded"
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-[calc(100vw-2rem)] max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-200 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {/* MINIMIZE & CLOSE BUTTONS (TOP RIGHT CORNER AS SHOWN IN REFERENCE) */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5">
              <button
                onClick={handleMinimize}
                aria-label="Minimize SkillSync Buddy"
                title="Minimize"
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Close SkillSync Buddy"
                title="Close"
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* LEFT SIDE: LARGE FULL CHIBI MASCOT (35-45% WIDTH FOCUS) */}
            <div className="w-36 sm:w-48 flex-shrink-0 flex items-center justify-center">
              <img
                src={buddyAvatar}
                alt="SkillSync Buddy Mascot"
                className="w-full h-auto max-h-56 object-contain drop-shadow-lg"
              />
            </div>

            {/* RIGHT SIDE: CONTEXTUAL PAGE TITLE, DESCRIPTION & ACTION PILLS */}
            <div className="flex-1 min-w-0 flex flex-col justify-center space-y-4 pr-1 sm:pr-2">
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {config.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
                  {config.expandedDesc}
                </p>
              </div>

              {/* Contextual Navigation Pill Actions */}
              {config.actions && config.actions.length > 0 && (
                <div className="space-y-2 pt-1">
                  {config.actions.map((action, idx) => {
                    const ActionIcon = action.icon;
                    return (
                      <Link
                        key={idx}
                        to={action.path}
                        onClick={() => setIsExpanded(false)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800/50 transition-all duration-150 group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <ActionIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{action.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
