import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/features/auth/Login";
import { Register } from "@/features/auth/Register";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { CampaignManager } from "@/features/campaigns/CampaignManager";
import { ContentGenerator } from "@/features/content-studio/ContentGenerator";
import { ContentCalendar } from "@/features/calendar/ContentCalendar";
import { Templates } from "@/features/templates/Templates";
import { LeadsManager } from "@/features/leads/LeadsManager";
import { Analytics } from "@/features/analytics/Analytics";
import { Settings } from "@/features/settings/Settings";
import { Profile } from "@/features/profile/Profile";
import { EmailCampaigns } from "@/features/email/EmailCampaigns";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
