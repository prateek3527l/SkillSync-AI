const fs = require('fs');
const path = require('path');

const dirs = [
  'src/assets',
  'src/components',
  'src/components/common',
  'src/components/layout',
  'src/components/dashboard',
  'src/components/profile',
  'src/components/projects',
  'src/components/resume',
  'src/components/interview',
  'src/components/analytics',
  'src/pages',
  'src/hooks',
  'src/context',
  'src/services',
  'src/routes',
  'src/utils',
  'src/styles'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, 'client', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const files = {
  'client/src/App.jsx': `import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;`,

  'client/src/routes/AppRoutes.jsx': `import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import ProjectsPage from '../pages/ProjectsPage';
import ResumePage from '../pages/ResumePage';
import InterviewPage from '../pages/InterviewPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}`,

  'client/src/components/layout/DashboardLayout.jsx': `import { Outlet, Link } from 'react-router-dom';
import { Home, User, Briefcase, FileText, Monitor, BarChart, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SkillSync AI</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
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
          <button className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md">
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
}`,

  'client/src/pages/LandingPage.jsx': `export default function LandingPage() { return <div className="p-8"><h1 className="text-4xl font-bold mb-4">SkillSync AI</h1><p>Landing Page Placeholder</p></div>; }`,
  'client/src/pages/LoginPage.jsx': `export default function LoginPage() { return <div className="p-8"><h1>Login</h1></div>; }`,
  'client/src/pages/RegisterPage.jsx': `export default function RegisterPage() { return <div className="p-8"><h1>Register</h1></div>; }`,
  'client/src/pages/DashboardPage.jsx': `export default function DashboardPage() { return <div><h1 className="text-3xl font-bold">Dashboard</h1><p>Welcome to your dashboard!</p></div>; }`,
  'client/src/pages/ProfilePage.jsx': `export default function ProfilePage() { return <div><h1 className="text-3xl font-bold">Profile</h1></div>; }`,
  'client/src/pages/ProjectsPage.jsx': `export default function ProjectsPage() { return <div><h1 className="text-3xl font-bold">Projects</h1></div>; }`,
  'client/src/pages/ResumePage.jsx': `export default function ResumePage() { return <div><h1 className="text-3xl font-bold">Resume</h1></div>; }`,
  'client/src/pages/InterviewPage.jsx': `export default function InterviewPage() { return <div><h1 className="text-3xl font-bold">Interview Practice</h1></div>; }`,
  'client/src/pages/AnalyticsPage.jsx': `export default function AnalyticsPage() { return <div><h1 className="text-3xl font-bold">Analytics</h1></div>; }`,
  'client/src/pages/SettingsPage.jsx': `export default function SettingsPage() { return <div><h1 className="text-3xl font-bold">Settings</h1></div>; }`,
  'client/src/pages/NotFoundPage.jsx': `export default function NotFoundPage() { return <div className="p-8"><h1>404 - Not Found</h1></div>; }`,
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Frontend boilerplate created!');
