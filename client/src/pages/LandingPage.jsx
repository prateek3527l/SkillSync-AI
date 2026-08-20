import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  BarChart2, 
  Brain, 
  Briefcase, 
  Code2, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  FileText, 
  Monitor, 
  ChevronRight, 
  Play, 
  Sparkles,
  Search,
  Check,
  TrendingUp,
  User,
  Plus
} from 'lucide-react';

const features = [
  { 
    icon: Brain, 
    title: 'AI Mock Interviews', 
    desc: 'Practice with an AI that evaluates technical depth, pacing, and vocabulary, delivering real-time actionable feedback.',
    badge: 'Real-time AI'
  },
  { 
    icon: FileText, 
    title: 'Smart Resume Analysis', 
    desc: 'Instant ATS compatibility scoring, layout optimization tips, and tailwind phrasing suggestions for target jobs.',
    badge: 'ATS Scanner'
  },
  { 
    icon: Briefcase, 
    title: 'Job Tracker Board', 
    desc: 'Organize your pipelines with Kanban boards, interview dates, contact notes, and direct integration with your resume variations.',
    badge: 'Workflow'
  },
  { 
    icon: Code2, 
    title: 'Project Portfolio', 
    desc: 'Curate your finest repos with custom technical breakdown widgets, live link previews, and built-in stack tags.',
    badge: 'Showcase'
  },
  { 
    icon: BarChart2, 
    title: 'Analytics Dashboard', 
    desc: 'Visualize weekly application progress, average mock interview performance curves, and target skill acquisition metrics.',
    badge: 'Insights'
  },
  { 
    icon: Shield, 
    title: 'Shareable Profiles', 
    desc: 'Generate lightweight, professional web portfolios hosted at custom URLs for recruiters. High performance, zero sign-in required.',
    badge: 'Recruiter Ready'
  },
];

const steps = [
  {
    num: '01',
    title: 'Import Profile & Codebase',
    desc: 'Link your GitHub or import an existing resume. SkillSync auto-analyzes your existing projects and engineering stack.'
  },
  {
    num: '02',
    title: 'Evaluate Competencies',
    desc: 'Run through specialized behavioral or technical AI mock interviews matching your targeted career paths.'
  },
  {
    num: '03',
    title: 'Bridge Skill Gaps',
    desc: 'Receive localized syllabus guidelines and project prompts specifically designed to strengthen your weaker technical areas.'
  },
  {
    num: '04',
    title: 'Track to Offer',
    desc: 'Deploy polished portfolios, sync tailored resumes to open positions, and track every application status on your Kanban pipeline.'
  }
];

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState('dashboard');
  const [demoResumeScore, setDemoResumeScore] = useState(84);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      
      {/* Dynamic glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[300px] rounded-full bg-indigo-400 blur-[120px] dark:bg-indigo-900" />
        <div className="absolute top-[5%] right-1/4 w-[400px] h-[250px] rounded-full bg-violet-400 blur-[100px] dark:bg-violet-900" />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              SkillSync <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#showcase" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Live Preview</a>
            <Link to="/portfolio/alexjohnson" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Demo Portfolio</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-600/10 active:scale-95 duration-150">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-24">
        
        {/* HERO SECTION */}
        <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/50 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modern Career Platform for Engineers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                Turn your skills into your{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  next opportunity.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                SkillSync AI evaluates your resumes, hosts mock coding interviews with interactive feedback, and manages your applications in one centralized, sleek workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white text-base font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-98 duration-150"
                >
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="#showcase"
                  className="flex items-center justify-center px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-98 duration-150"
                >
                  Explore Features
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2" /> No credit card required</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2" /> Full suite access</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2" /> Resume & Interview modules</span>
              </div>
            </div>

            {/* Hero Right: Product Preview UI mockup */}
            <div className="lg:col-span-6 w-full">
              <div className="relative mx-auto max-w-lg lg:max-w-none bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
                
                {/* Windows/Mac Bar */}
                <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-800" />
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-0.5 rounded border border-slate-200/50 dark:border-slate-800/50">
                    skillsync-ai.com/dashboard
                  </div>
                  <div className="w-8" />
                </div>

                {/* Internal Layout Tabs */}
                <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                  <button 
                    onClick={() => setActivePreviewTab('dashboard')}
                    className={`flex-1 py-3 px-4 text-center font-semibold transition-all border-b-2 ${activePreviewTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                  >
                    Dashboard Preview
                  </button>
                  <button 
                    onClick={() => setActivePreviewTab('interview')}
                    className={`flex-1 py-3 px-4 text-center font-semibold transition-all border-b-2 ${activePreviewTab === 'interview' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                  >
                    AI Mock Interview
                  </button>
                  <button 
                    onClick={() => setActivePreviewTab('resume')}
                    className={`flex-1 py-3 px-4 text-center font-semibold transition-all border-b-2 ${activePreviewTab === 'resume' ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                  >
                    ATS Reviewer
                  </button>
                </div>

                {/* Dashboard Tab Content */}
                {activePreviewTab === 'dashboard' && (
                  <div className="p-5 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Competency Radar</h4>
                        <p className="text-[11px] text-slate-400">Your mock performance history</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12% Growth
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-medium text-slate-400 mb-1">ATS Score</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">87%</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-medium text-slate-400 mb-1">Avg Int.</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">79<span className="text-xs text-slate-400">/100</span></div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-medium text-slate-400 mb-1">Projects</div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">4 Active</div>
                      </div>
                    </div>

                    {/* Progress Chart Replica */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>LATEST SESSION FEEDBACK</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">React & Frontend Architecture</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 pt-1">
                        <span>Communication: Excellent (90)</span>
                        <span>Technical Depth: Proficient (82)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interview Tab Content */}
                {activePreviewTab === 'interview' && (
                  <div className="p-5 space-y-4 animate-fadeIn">
                    <div className="bg-indigo-950 text-indigo-200 p-4 rounded-xl border border-indigo-900/50 space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <div className="flex items-center space-x-2 text-[10px] tracking-wider text-indigo-400 font-bold uppercase">
                        <Monitor className="w-3 h-3 text-red-500" />
                        <span>Interactive AI Audio/Text Module</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-relaxed">
                        "How do you optimize render performance in large-scale React applications containing frequently updating lists?"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-slate-400">AI FEEDBACK & METRICS:</div>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Technical Depth Rating</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Good (85/100)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Suggestion:</span> You accurately detailed virtualization (using react-window) but should mention useMemo and useCallback hooks for memory control.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resume Tab Content */}
                {activePreviewTab === 'resume' && (
                  <div className="p-5 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">resume_v2_senior_se.pdf</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/20">READY FOR ATS</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full border-4 border-indigo-600 flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-900">
                        <span className="text-lg font-black text-slate-800 dark:text-white">88</span>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Resume Health Index</h5>
                        <p className="text-[10px] text-slate-400 leading-normal">ATS compatibility: Strong. Format: Clear. Bullet density: Excellent.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-slate-400">RECOMMENDED TAILORING:</div>
                      <div className="flex items-center justify-between text-[11px] bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-2.5 rounded-lg border border-amber-200/30">
                        <span>Missing key action verbs: "Architected", "Engineered"</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* TRUST / VALUE STRIP */}
        <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              <div className="text-center pt-4 md:pt-0">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">Skill Analysis</div>
                <div className="text-xs text-slate-400 mt-1">Deep inspection of your tech stack</div>
              </div>
              <div className="text-center pt-4 md:pt-0">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">Career Insights</div>
                <div className="text-xs text-slate-400 mt-1">ATS grading & application stats</div>
              </div>
              <div className="text-center pt-4 md:pt-0">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">Personalized Recs</div>
                <div className="text-xs text-slate-400 mt-1">Skill bridging & study resources</div>
              </div>
              <div className="text-center pt-4 md:pt-0">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">AI-Powered Guidance</div>
                <div className="text-xs text-slate-400 mt-1">Simulated interview reviews</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Methodology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              How SkillSync AI Accelerates You
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
              Follow this structured sequence based on features running directly in the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-black text-indigo-100 dark:text-indigo-950 absolute top-4 right-4">{step.num}</div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2 mb-3">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Core Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
                Everything you need to get hired
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
                No mockups, no placeholders. This is the real package to streamline your entire job application cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT SHOWCASE */}
        <section id="showcase" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Interactive Workspace</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Explore the SkillSync Workspace
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
              Inspect how the resume module grades profile uploads, highlights structural weaknesses, and gives clear recommendations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto">
            {/* Top Showcase Toolbar */}
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                <span className="text-xs font-bold text-slate-400 pl-4 tracking-wider uppercase">SkillSync AI Optimizer</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-400">V1.2 Live Model</span>
              </div>
            </div>

            {/* Showcase Main Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Showcase Left Controls */}
              <div className="lg:col-span-4 bg-slate-50/50 dark:bg-slate-950/20 p-6 border-r border-slate-200/80 dark:border-slate-800 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Test Profile Optimizer</label>
                  <p className="text-xs text-slate-400 leading-normal">
                    Adjust the slide bar to view how SkillSync automatically flags weaknesses at lower scores, or grades completed records.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span>ATS Score Mock Slider</span>
                      <span>{demoResumeScore}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="35" 
                      max="100" 
                      value={demoResumeScore}
                      onChange={(e) => setDemoResumeScore(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <button 
                    onClick={() => setResumeUploaded(!resumeUploaded)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center space-x-2 border ${resumeUploaded ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/40' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'}`}
                  >
                    {resumeUploaded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mock Resume Loaded</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Swap to Mock Mode</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Demonstrated</div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-500 mr-2" /> Action Verb Analysis
                    </div>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-500 mr-2" /> ATS Scoring Matrix
                    </div>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-500 mr-2" /> Key Skill Density Metrics
                    </div>
                  </div>
                </div>
              </div>

              {/* Showcase Right Content (Previewing the ATS page) */}
              <div className="lg:col-span-8 p-6 lg:p-8 space-y-6">
                
                {/* Header score card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-950/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">Senior Software Engineer Profile</h3>
                    <p className="text-xs text-slate-400">Evaluated against React, Node.js & AWS positions</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400">ATS GRADE</div>
                      <div className="text-xs text-slate-500">
                        {demoResumeScore >= 80 ? 'Excellent Match' : demoResumeScore >= 65 ? 'Moderate Gaps' : 'Needs Optimization'}
                      </div>
                    </div>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-4 ${demoResumeScore >= 80 ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : demoResumeScore >= 65 ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-rose-500 text-rose-600 dark:text-rose-400'}`}>
                      {demoResumeScore}
                    </div>
                  </div>
                </div>

                {/* ATS Detailed Insights */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Improvements</h4>
                  
                  <div className="space-y-3">
                    {demoResumeScore < 90 && (
                      <div className="flex items-start space-x-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-rose-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Strong Action Verbs Weakness</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Found generic terms ("helped", "worked on") instead of impactful ones ("orchestrated", "refactored").</p>
                        </div>
                      </div>
                    )}

                    {demoResumeScore < 75 && (
                      <div className="flex items-start space-x-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Skill Density Warning (Cloud Infrastructure)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Missing mentions of Docker, Kubernetes, or AWS ECS. Adding these will increase ATS relevance by 18%.</p>
                        </div>
                      </div>
                    )}

                    {demoResumeScore < 55 && (
                      <div className="flex items-start space-x-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-rose-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Contact Details Layout Issue</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Contact info located inside page headers might get bypassed by older ATS scanners.</p>
                        </div>
                      </div>
                    )}

                    {demoResumeScore >= 90 && (
                      <div className="flex items-start space-x-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">ATS Optimized Profile</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Profile score is optimal. Strong metrics-focused description format identified throughout.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 lg:py-28 px-4 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-12 sm:p-16 text-white shadow-xl relative border border-indigo-800/40">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10 leading-tight">
              Your next opportunity starts with knowing what you're capable of.
            </h2>
            <p className="text-indigo-200 text-base mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
              Accelerate your engineering search. Analyze your portfolio, train against professional AI prompts, and land your ideal role today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-4 bg-white text-indigo-900 font-bold text-base rounded-xl hover:bg-slate-100 transition-colors shadow-lg relative z-10 hover:-translate-y-0.5 duration-150"
            >
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/10">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">SkillSync AI</span>
            </div>
            
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SkillSync AI. Built for developers to maximize career trajectory.
            </p>

            <div className="flex space-x-6 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Register</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}