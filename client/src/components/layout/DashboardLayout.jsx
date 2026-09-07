import { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  FileText,
  Monitor,
  BarChart,
  Settings,
  LogOut,
  BriefcaseBusiness,
  Menu,
  X,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import skillSyncLogo from '../../assets/skillsync_logo.png';
import SkillSyncBuddy from '../common/SkillSyncBuddy';

const navigationLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/skills', label: 'Skill Analysis', icon: Award },
  { path: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { path: '/projects', label: 'Projects', icon: Briefcase },
  { path: '/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/jobs', label: 'Job Tracker', icon: BriefcaseBusiness },
  { path: '/interview', label: 'AI Interview', icon: Monitor },
  { path: '/analytics', label: 'Analytics', icon: BarChart },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex-shrink-0">

        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <img
              src={skillSyncLogo}
              alt="SkillSync AI"
              className="h-9 w-auto object-contain rounded-xl transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* User Profile Info */}
        {user && (
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden border border-indigo-200/40 dark:border-indigo-800/40 flex-shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile Navbar Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 px-4 flex items-center justify-between z-30 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src={skillSyncLogo} alt="SkillSync AI" className="h-8 w-auto object-contain rounded-lg" />
          </Link>

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex bg-slate-950/30 dark:bg-slate-950/70 backdrop-blur-xs" onClick={toggleMobileMenu}>
            <div className="w-64 max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col p-5 shadow-xl border-r border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <img src={skillSyncLogo} alt="SkillSync AI" className="h-8 w-auto object-contain rounded-lg" />
                <button onClick={toggleMobileMenu} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3.5 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN PANEL CONTENT WINDOW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* SKILLSYNC BUDDY GLOBAL ASSISTANT */}
      <SkillSyncBuddy />
    </div>
  );
}
