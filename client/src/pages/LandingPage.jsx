import { Link } from 'react-router-dom';
import { Zap, Shield, BarChart2, Brain, Briefcase, Code2, ArrowRight, Star, CheckCircle } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Mock Interviews', desc: 'Practice with an AI that gives real-time feedback on your answers, tone, and technical accuracy.' },
  { icon: FileText, title: 'Smart Resume Analysis', desc: 'Upload your resume and get an instant ATS score, weakness report, and bullet-point improvements.' },
  { icon: Briefcase, title: 'Job Tracker', desc: 'Never lose track of an application again. Kanban, list, or calendar views. Deadline reminders built in.' },
  { icon: Code2, title: 'Project Portfolio', desc: 'Showcase featured projects with tech stacks, GitHub links, and live demos. Auto-generates your public profile.' },
  { icon: BarChart2, title: 'Career Analytics', desc: 'Visual insights into your interview scores, application pipeline, and weekly progress over time.' },
  { icon: Shield, title: 'Public Portfolio', desc: 'Share a recruiter-ready URL like /portfolio/yourname — no login required for them to see your work.' },
];

const stats = [
  { value: '10+', label: 'Career Modules' },
  { value: 'AI', label: 'Powered Analysis' },
  { value: '100%', label: 'Free to Use' },
  { value: '∞', label: 'Practice Sessions' },
];

import { FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">SkillSync AI</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800 mb-8">
              <Star className="w-4 h-4" />
              <span>Your AI-Powered Career Command Center</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              Land your dream job
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                faster with AI
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillSync AI is the complete platform for developers to practice interviews, analyze resumes, track applications, and showcase their work — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transform"
              >
                Start for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/portfolio/alexjohnson"
                className="flex items-center px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                View Demo Portfolio
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-1.5" /> No credit card required</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-1.5" /> Free forever plan</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-1.5" /> AI-powered</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to get hired
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                From your first application to your offer letter — SkillSync AI has a tool for every step of the journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 text-white shadow-2xl shadow-indigo-500/25">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to accelerate your career?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of developers who use SkillSync AI to prepare for interviews, get resume feedback, and track their job search in one beautiful dashboard.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-4 bg-white text-indigo-700 font-bold text-lg rounded-xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-12 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">SkillSync AI</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SkillSync AI. Built with ❤️ for developers.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/login" className="hover:text-gray-900 dark:hover:text-white">Sign In</Link>
              <Link to="/register" className="hover:text-gray-900 dark:hover:text-white">Register</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}