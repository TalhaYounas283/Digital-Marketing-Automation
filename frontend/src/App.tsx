import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/features/auth/Login";
import { Register } from "@/features/auth/Register";
import { NotFound } from "@/components/NotFound";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = lazy(() =>
  import("@/features/dashboard/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const CampaignManager = lazy(() =>
  import("@/features/campaigns/CampaignManager").then((m) => ({
    default: m.CampaignManager,
  })),
);
const ContentGenerator = lazy(() =>
  import("@/features/content-studio/ContentGenerator").then((m) => ({
    default: m.ContentGenerator,
  })),
);
const ContentCalendar = lazy(() =>
  import("@/features/calendar/ContentCalendar").then((m) => ({
    default: m.ContentCalendar,
  })),
);
const Templates = lazy(() =>
  import("@/features/templates/Templates").then((m) => ({ default: m.Templates })),
);
const LeadsManager = lazy(() =>
  import("@/features/leads/LeadsManager").then((m) => ({
    default: m.LeadsManager,
  })),
);
const Analytics = lazy(() =>
  import("@/features/analytics/Analytics").then((m) => ({ default: m.Analytics })),
);
const Settings = lazy(() =>
  import("@/features/settings/Settings").then((m) => ({ default: m.Settings })),
);
const Profile = lazy(() =>
  import("@/features/profile/Profile").then((m) => ({ default: m.Profile })),
);
const EmailCampaigns = lazy(() =>
  import("@/features/email/EmailCampaigns").then((m) => ({
    default: m.EmailCampaigns,
  })),
);
const AIInsights = lazy(() =>
  import("@/features/ai-insights/AIInsights").then((m) => ({
    default: m.AIInsights,
  })),
);
const WorkflowBuilder = lazy(() =>
  import("@/features/workflows/WorkflowBuilder").then((m) => ({
    default: m.WorkflowBuilder,
  })),
);
const SentimentAnalysis = lazy(() =>
  import("@/features/sentiment/SentimentAnalysis").then((m) => ({
    default: m.SentimentAnalysis,
  })),
);

const RouteFallback: React.FC = () => (
  <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
    <Loader2 size={20} className="animate-spin" />
    <span className="ml-2 text-sm">Loading…</span>
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<CampaignManager />} />
            <Route path="generate" element={<ContentGenerator />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="templates" element={<Templates />} />
            <Route path="email" element={<EmailCampaigns />} />
            <Route path="leads" element={<LeadsManager />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="insights" element={<AIInsights />} />
            <Route path="workflows" element={<WorkflowBuilder />} />
            <Route path="sentiment" element={<SentimentAnalysis />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
