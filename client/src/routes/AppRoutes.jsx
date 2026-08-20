import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';

// ─── Eager Imports (Critical path) ───────────────────────────────────────────
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// ─── Lazy Imports (Code split per route) ─────────────────────────────────────
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ResumePage = lazy(() => import('../pages/ResumePage'));
const InterviewPage = lazy(() => import('../pages/InterviewPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const JobsPage = lazy(() => import('../pages/JobsPage'));
const PortfolioSettingsPage = lazy(() => import('../pages/PortfolioSettingsPage'));
const PublicPortfolio = lazy(() => import('../pages/PublicPortfolio'));
const SkillsPage = lazy(() => import('../pages/SkillsPage'));
const RecommendationsPage = lazy(() => import('../pages/RecommendationsPage'));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public Portfolio (no auth needed) */}
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/portfolio-settings" element={<PortfolioSettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}