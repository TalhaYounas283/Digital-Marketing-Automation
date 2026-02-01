import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Loader2 } from "lucide-react";

// Lazy Load Components
const Login = lazy(() =>
  import("./components/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("./components/Register").then((m) => ({ default: m.Register })),
);
const Dashboard = lazy(() =>
  import("./components/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const CampaignManager = lazy(() =>
  import("./components/CampaignManager").then((m) => ({
    default: m.CampaignManager,
  })),
);
const ContentGenerator = lazy(() =>
  import("./components/ContentGenerator").then((m) => ({
    default: m.ContentGenerator,
  })),
);
const CompetitorAnalysis = lazy(() =>
  import("./components/CompetitorAnalysis").then((m) => ({
    default: m.CompetitorAnalysis,
  })),
);
const Scheduler = lazy(() =>
  import("./components/Scheduler").then((m) => ({ default: m.Scheduler })),
);
const Analytics = lazy(() =>
  import("./components/Analytics").then((m) => ({ default: m.Analytics })),
);
const Settings = lazy(() =>
  import("./components/Settings").then((m) => ({ default: m.Settings })),
);
const LeadsManager = lazy(() =>
  import("./components/LeadsManager").then((m) => ({
    default: m.LeadsManager,
  })),
);
const EmailMarketing = lazy(() =>
  import("./components/EmailMarketing").then((m) => ({
    default: m.EmailMarketing,
  })),
);
const AutomationHub = lazy(() =>
  import("./components/AutomationHub").then((m) => ({
    default: m.AutomationHub,
  })),
);
const Reports = lazy(() =>
  import("./components/Reports").then((m) => ({ default: m.Reports })),
);
const Notifications = lazy(() =>
  import("./components/Notifications").then((m) => ({
    default: m.Notifications,
  })),
);
const ActivityLog = lazy(() =>
  import("./components/ActivityLog").then((m) => ({ default: m.ActivityLog })),
);
const AudienceBuilder = lazy(() =>
  import("./components/AudienceBuilder").then((m) => ({
    default: m.AudienceBuilder,
  })),
);

// Loading Component
const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center text-slate-400">
    <Loader2 size={40} className="animate-spin text-indigo-500" />
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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
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
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
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
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Layout>
                <ActivityLog />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
