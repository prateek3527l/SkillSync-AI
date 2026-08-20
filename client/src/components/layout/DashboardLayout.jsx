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
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            SkillSync <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full">AI</span>
          </span>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden border border-indigo-200/30 dark:border-indigo-800/30">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/5 hover:border-rose-500/10 border border-transparent rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SHELL CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Navbar Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 px-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/10">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">SkillSync AI</span>
          </div>

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-lg border border-slate-200/50 dark:border-slate-800/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-sm animate-fadeIn" onClick={toggleMobileMenu}>
            <div className="w-64 max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col p-6 shadow-xl border-r border-slate-150 dark:border-slate-850" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900 dark:text-white">SkillSync AI</span>
                <button onClick={toggleMobileMenu} className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-100 dark:border-slate-805">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20'
                          : 'text-slate-600 dark:text-slate-400'
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
                  className="flex items-center w-full px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400"
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

    </div>
  );
}