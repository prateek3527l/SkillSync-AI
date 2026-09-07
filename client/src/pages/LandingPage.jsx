import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  Zap,
  BarChart2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  FileText,
  Monitor,
  Sparkles,
  TrendingUp,
  Award,
  ArrowUpRight,
  ChevronRight,
  Target,
  Brain,
  Layers,
  Clock
} from 'lucide-react';

import stageResumeImg from '../assets/stage_resume_character.jpg';
import stageSkillsImg from '../assets/stage_skills_character.jpg';
import stageInterviewImg from '../assets/stage_interview_character.jpg';
import stageJobsImg from '../assets/stage_jobs_character.jpg';

const JOURNEY_STAGES = [
  {
    id: 'resume',
    step: '01',
    title: 'ATS Resume Analyzer',
    subtitle: 'Resume',
    icon: FileText,
    img: stageResumeImg,
    imgSide: 'left',
    desc: 'Instant ATS compatibility scoring, layout optimization tips, and keyword matching tailored to target tech roles.',
    badge: 'ATS Engine',
    metricLabel: 'ATS Score',
    metricVal: '85%'
  },
  {
    id: 'skills',
    step: '02',
    title: 'Skill Gap Analysis',
    subtitle: 'Skills',
    icon: Award,
    img: stageSkillsImg,
    imgSide: 'right',
    desc: 'Deep structural evaluation of your frontend, backend, and database stack with proficiency level tracking.',
    badge: 'Competency',
    metricLabel: 'Skill Density',
    metricVal: '92%'
  },
  {
    id: 'interview',
    step: '03',
    title: 'AI Mock Interviews',
    subtitle: 'Interview',
    icon: Monitor,
    img: stageInterviewImg,
    imgSide: 'left',
    desc: 'Practice role-specific technical & behavioral questions with real-time feedback on answer depth and pacing.',
    badge: 'AI Coach',
    metricLabel: 'Interview Score',
    metricVal: '88/100'
  },
  {
    id: 'jobs',
    step: '04',
    title: 'Job Application Tracker',
    subtitle: 'Jobs',
    icon: Briefcase,
    img: stageJobsImg,
    imgSide: 'right',
    desc: 'Organize active applications, track target salaries, interview dates, and pipeline stages in one Kanban workspace.',
    badge: 'Pipeline',
    metricLabel: 'Active Applications',
    metricVal: '12 Tracked'
  }
];

const SPOTLIGHT_DEMOS = {
  resume: {
    title: 'ATS Resume Scanner Output',
    file: 'software_engineering_resume.pdf',
    score: 86,
    badge: 'High Compatibility',
    summary: 'Strong keyword match for Full Stack Developer & Senior Frontend roles.',
    bullets: ['Keyword density optimal for React & Node.js', 'Clean single-column ATS formatting detected', 'Suggested addition: Cloud deployment metrics']
  },
  skills: {
    title: 'Stack Proficiency Matrix',
    file: 'Tech Stack Gap Analysis',
    score: 92,
    badge: '92% Target Coverage',
    summary: 'Frontend and Backend core skills validated against target requirements.',
    bullets: ['React & JavaScript: Advanced', 'Node.js & MongoDB: Intermediate', 'System Design: Action Item Recommended']
  },
  interview: {
    title: 'AI Technical Interview Evaluation',
    file: 'Frontend Architecture Session',
    score: 88,
    badge: 'Evaluated',
    summary: '"Explain state management choices in complex React apps."',
    bullets: ['Technical Score: 90/100', 'Communication Score: 85/100', 'Pacing: Optimal (~2m per question)']
  },
  jobs: {
    title: 'Application Pipeline Sync',
    file: 'Job Application Workspace',
    score: 95,
    badge: 'Active Pipeline',
    summary: '12 Active job applications organized across interview stages.',
    bullets: ['3 In Technical Interview stage', '5 In Recruiter Screen stage', '4 Applications Submitted']
  }
};

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState('dashboard');
  const [demoResumeScore, setDemoResumeScore] = useState(84);
  const [activeStageId, setActiveStageId] = useState('resume');
  const [spotlightStage, setSpotlightStage] = useState('resume');

  // Mouse Parallax for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 12);
    mouseY.set((clientY / innerHeight - 0.5) * 12);
  };

  // Scroll Progress Line Setup
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // IntersectionObserver for Scroll-Linked Highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (['resume', 'skills', 'interview', 'jobs'].includes(id)) {
            setActiveStageId(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    JOURNEY_STAGES.forEach(stage => {
      const el = document.getElementById(stage.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    >

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xs shadow-indigo-600/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              SkillSync <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#journey" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Career Journey</a>
            <a href="#features" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Modules</a>
            <a href="#spotlight" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Spotlight Demo</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-xs px-4 py-2 rounded-xl shadow-xs">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">

        {/* HERO SECTION */}
        <section className="pt-10 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 space-y-6 text-left z-10"
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI-Powered Career Command Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Build the career you're{' '}
                <span className="text-indigo-600 dark:text-indigo-400">
                  ready for.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                SkillSync AI guides your entire technical career path — evaluating your resume, identifying skill gaps, hosting AI mock interviews, and managing job applications in one unified workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  to="/register"
                  className="btn-primary text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md flex items-center justify-center"
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="#journey"
                  className="btn-secondary text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center justify-center"
                >
                  Explore Journey ↓
                </a>
              </div>

              {/* Journey Nodes Visual Indicator in Hero */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Continuous Career Progression</p>
                <div className="flex items-center space-x-2 text-xs font-semibold">
                  {JOURNEY_STAGES.map((s, idx) => (
                    <div key={s.id} className="flex items-center space-x-2">
                      <a href={`#${s.id}`} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <span>{s.subtitle}</span>
                      </a>
                      {idx < JOURNEY_STAGES.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hero Right: Interactive Product Preview with Tilt */}
            <motion.div
              style={{ x: smoothMouseX, y: smoothMouseY }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-6 w-full z-10"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">

                {/* Visual Top Bar */}
                <div className="bg-slate-100/80 dark:bg-slate-950 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-3 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                    skillsync-ai.com/workspace
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Live
                  </span>
                </div>

                {/* Workspace Navigation Tabs */}
                <div className="flex border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold">
                  <button
                    onClick={() => setActivePreviewTab('dashboard')}
                    className={`flex-1 py-2.5 px-3 text-center transition-colors border-b-2 ${activePreviewTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-white/60 dark:bg-slate-900/60' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    Command Center
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('interview')}
                    className={`flex-1 py-2.5 px-3 text-center transition-colors border-b-2 ${activePreviewTab === 'interview' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-white/60 dark:bg-slate-900/60' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    AI Mock Interview
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('resume')}
                    className={`flex-1 py-2.5 px-3 text-center transition-colors border-b-2 ${activePreviewTab === 'resume' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-white/60 dark:bg-slate-900/60' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    ATS Scanner
                  </button>
                </div>

                {/* Interactive Tab Body */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activePreviewTab === 'dashboard' && (
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Career Readiness Overview</h4>
                            <p className="text-[11px] text-slate-400">Live analytics snapshot</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> Active
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">ATS Resume</div>
                            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 font-mono">85%</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Interview Score</div>
                            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 font-mono">78/100</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Target Role</div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">Full Stack</div>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                            <span>EVALUATION PROGRESS</span>
                            <span className="text-indigo-600 dark:text-indigo-400">React & Node Stack</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-indigo-600 rounded-full" initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 0.4 }} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activePreviewTab === 'interview' && (
                      <motion.div
                        key="interview"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 border border-slate-800">
                          <div className="flex items-center space-x-2 text-[10px] text-indigo-400 font-bold uppercase">
                            <Monitor className="w-3.5 h-3.5" />
                            <span>AI Technical Interview Question</span>
                          </div>
                          <p className="text-xs font-medium text-slate-200 leading-relaxed">
                            "Explain state management choices in complex React applications and when to use Context vs Redux."
                          </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                            <span>AI Evaluation Output</span>
                            <span className="text-indigo-600 font-mono font-bold">88/100</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Strong coverage of local component state vs global store patterns.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {activePreviewTab === 'resume' && (
                      <motion.div
                        key="resume"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">resume_software_eng.pdf</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                            PDF Analyzed
                          </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 font-mono">
                            {demoResumeScore}%
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">ATS Compatibility Match</h5>
                            <p className="text-[10px] text-slate-500">High alignment with Full Stack Developer requirements</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* 1. & 2. MAIN "CAREER JOURNEY" SECTION WITH CONNECTED PATH LINE */}
        <section id="journey" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Structured Career Progression</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              From Resume to Offer Acceptance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              SkillSync AI connects every stage of your job search into a single interactive career pipeline.
            </p>
          </div>

          {/* Connected Vertical Timeline Grid */}
          <div className="relative max-w-5xl mx-auto">

            {/* Animated Vertical Path Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 transform -translate-x-1/2 hidden sm:block">
              <motion.div
                className="w-full bg-indigo-600 origin-top"
                style={{ scaleY: pathProgress }}
              />
            </div>

            <div className="space-y-16 sm:space-y-24">
              {JOURNEY_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = activeStageId === stage.id;
                const isIllustrationOnLeft = stage.imgSide === 'left';

                return (
                  <div
                    key={stage.id}
                    id={stage.id}
                    className="relative grid grid-cols-1 sm:grid-cols-12 gap-6 lg:gap-8 items-center"
                  >
                    {/* Character Illustration Accent - Left Position */}
                    {isIllustrationOnLeft && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        animate={{
                          scale: isActive ? 1 : 0.96,
                          opacity: isActive ? 1 : 0.5,
                          y: isActive ? -2 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:flex sm:col-span-5 justify-end pr-4 lg:pr-8"
                      >
                        <div className="w-28 sm:w-36 lg:w-44 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-300">
                          <img
                            src={stage.img}
                            alt={stage.title}
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Node Circle on Central Line */}
                    <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 hidden sm:flex items-center justify-center z-10">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          backgroundColor: isActive ? '#4f46e5' : '#ffffff'
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          isActive
                            ? 'border-indigo-600 shadow-md shadow-indigo-600/40 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold font-mono">{stage.step}</span>
                      </motion.div>
                    </div>

                    {/* Main Stage Content Box */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className={`sm:col-span-7 lg:col-span-6 space-y-4 ${
                        isIllustrationOnLeft
                          ? 'sm:col-start-6 lg:col-start-7 sm:pl-8 lg:pl-12'
                          : 'sm:col-start-1 lg:col-start-1 sm:pr-8 lg:pr-12'
                      }`}
                    >
                      <div className="inline-flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase">
                          Stage {stage.step} • {stage.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {stage.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {stage.desc}
                      </p>

                      {/* Distinctive Visual Card Border Accent */}
                      <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 ${
                        isActive
                          ? 'border-indigo-600/80 dark:border-indigo-500/80 shadow-md shadow-indigo-500/5'
                          : 'border-slate-200/80 dark:border-slate-800 shadow-2xs'
                      }`}>
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400 flex items-center">
                            <Icon className="w-4 h-4 mr-1.5 text-indigo-500" /> {stage.metricLabel}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                            {stage.metricVal}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Character Illustration Accent - Right Position */}
                    {!isIllustrationOnLeft && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        animate={{
                          scale: isActive ? 1 : 0.96,
                          opacity: isActive ? 1 : 0.5,
                          y: isActive ? -2 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:flex sm:col-span-5 sm:col-start-8 justify-start pl-4 lg:pl-8"
                      >
                        <div className="w-28 sm:w-36 lg:w-44 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-300">
                          <img
                            src={stage.img}
                            alt={stage.title}
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        </div>
                      </motion.div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. CORE CAPABILITIES NETWORK GRID */}
        <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Integrated Workspace</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Four Pillars of Career Readiness
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Every feature feeds into your central profile to keep your skill readiness up to date.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JOURNEY_STAGES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.id}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-4 transition-all group relative overflow-hidden"
                  >
                    {/* Corner Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {feat.step}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 9. FEATURE SPOTLIGHT: "FROM RESUME TO INTERVIEW-READY" */}
        <section id="spotlight" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto space-y-12">

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Interactive Spotlight</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                From Resume to Interview-Ready
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Click through the journey stages to preview live SkillSync AI output formats.
              </p>
            </div>

            {/* Stage Selector Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {JOURNEY_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSpotlightStage(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    spotlightStage === s.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {s.step}. {s.subtitle}
                </button>
              ))}
            </div>

            {/* Dynamic Output Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={spotlightStage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Product Module Output
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {SPOTLIGHT_DEMOS[spotlightStage].title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                    {SPOTLIGHT_DEMOS[spotlightStage].badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evaluated Score</span>
                    <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {SPOTLIGHT_DEMOS[spotlightStage].score}%
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {SPOTLIGHT_DEMOS[spotlightStage].summary}
                    </p>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Module Observations</h4>
                    <ul className="space-y-2">
                      {SPOTLIGHT_DEMOS[spotlightStage].bullets.map((b, i) => (
                        <li key={i} className="flex items-center text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link to="/register" className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center">
                    Test With Your Profile <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* 10. DISTINCTIVE CAREER JOURNEY CTA SECTION */}
        <section className="py-20 lg:py-28 px-4 text-center">
          <div className="max-w-4xl mx-auto bg-indigo-600 dark:bg-indigo-950 rounded-3xl p-10 sm:p-14 text-white shadow-xl space-y-6 relative overflow-hidden border border-indigo-500/30">

            {/* Glowing Accent Node */}
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Build the career you're ready for.
            </h2>

            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
              Join SkillSync AI today to analyze your technical resume, identify critical skill gaps, practice AI mock interviews, and manage job applications.
            </p>

            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3.5 bg-white text-indigo-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-colors shadow-md"
              >
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">SkillSync AI</span>
            </div>

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SkillSync AI. All rights reserved.
            </p>

            <div className="flex space-x-4 text-xs font-medium text-slate-500">
              <Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-indigo-600 transition-colors">Register</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
