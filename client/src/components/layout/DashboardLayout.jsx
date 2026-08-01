import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, User, Briefcase, FileText, Monitor, BarChart, Settings, LogOut, BriefcaseBusiness, Globe } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SkillSync AI</h2>
        </div>
        
        {user && (
          <div className="px-6 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <User className="w-5 h-5 mr-3" /> Profile
          </Link>
          <Link to="/projects" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Briefcase className="w-5 h-5 mr-3" /> Projects
          </Link>
          <Link to="/resume" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <FileText className="w-5 h-5 mr-3" /> Resume
          </Link>
          <Link to="/jobs" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <BriefcaseBusiness className="w-5 h-5 mr-3" /> Job Tracker
          </Link>
          <Link to="/interview" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Monitor className="w-5 h-5 mr-3" /> Interview
          </Link>
          <Link to="/analytics" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <BarChart className="w-5 h-5 mr-3" /> Analytics
          </Link>
          <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md"
          >
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
        <Outlet />
      </main>
    </div>
  );
}