import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Loader2 } from "lucide-react";

// Lazy Load Pages
const Login = lazy(() =>
  import("./components/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./components/Register").then((module) => ({
    default: module.Register,
  })),
);
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const ContentGenerator = lazy(() =>
  import("./components/ContentGenerator").then((module) => ({
    default: module.ContentGenerator,
  })),
);
const AudienceBuilder = lazy(() =>
  import("./components/AudienceBuilder").then((module) => ({
    default: module.AudienceBuilder,
  })),
);
const CompetitorAnalysis = lazy(() =>
  import("./components/CompetitorAnalysis").then((module) => ({
    default: module.CompetitorAnalysis,
  })),
);
const CampaignManager = lazy(() =>
  import("./components/CampaignManager").then((module) => ({
    default: module.CampaignManager,
  })),
);
const Scheduler = lazy(() =>
  import("./components/Scheduler").then((module) => ({
    default: module.Scheduler,
  })),
);
const Analytics = lazy(() =>
  import("./components/Analytics").then((module) => ({
    default: module.Analytics,
  })),
);
const Reports = lazy(() =>
  import("./components/Reports").then((module) => ({
    default: module.Reports,
  })),
);
const Settings = lazy(() =>
  import("./components/Settings").then((module) => ({
    default: module.Settings,
  })),
);
const LeadsManager = lazy(() =>
  import("./components/LeadsManager").then((module) => ({
    default: module.LeadsManager,
  })),
);
const EmailMarketing = lazy(() =>
  import("./components/EmailMarketing").then((module) => ({
    default: module.EmailMarketing,
  })),
);
const AutomationHub = lazy(() =>
  import("./components/AutomationHub").then((module) => ({
    default: module.AutomationHub,
  })),
);

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <Loader2 className="animate-spin text-indigo-600" size={48} />
  </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Layout>
                <CampaignManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <Layout>
                <ContentGenerator />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/competitors"
          element={
            <ProtectedRoute>
              <Layout>
                <CompetitorAnalysis />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audience"
          element={
            <ProtectedRoute>
              <Layout>
                <AudienceBuilder />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/email"
          element={
            <ProtectedRoute>
              <Layout>
                <EmailMarketing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadsManager />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Layout>
                <Scheduler />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/automation"
          element={
            <ProtectedRoute>
              <Layout>
                <AutomationHub />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

import { HelmetProvider } from "react-helmet-async";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
