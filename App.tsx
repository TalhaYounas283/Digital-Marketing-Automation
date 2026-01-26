import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { CampaignManager } from './components/CampaignManager';
import { ContentGenerator } from './components/ContentGenerator';
import { CompetitorAnalysis } from './components/CompetitorAnalysis';
import { Scheduler } from './components/Scheduler';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { LeadsManager } from './components/LeadsManager';
import { EmailMarketing } from './components/EmailMarketing';
import { AutomationHub } from './components/AutomationHub';
import { Reports } from './components/Reports';
import { Notifications } from './components/Notifications';
import { ActivityLog } from './components/ActivityLog';
import { AudienceBuilder } from './components/AudienceBuilder';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><Layout><CampaignManager /></Layout></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><Layout><ContentGenerator /></Layout></ProtectedRoute>} />
      <Route path="/audience" element={<ProtectedRoute><Layout><AudienceBuilder /></Layout></ProtectedRoute>} />
      <Route path="/competitors" element={<ProtectedRoute><Layout><CompetitorAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/email" element={<ProtectedRoute><Layout><EmailMarketing /></Layout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Layout><LeadsManager /></Layout></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Layout><Scheduler /></Layout></ProtectedRoute>} />
      <Route path="/automation" element={<ProtectedRoute><Layout><AutomationHub /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><Layout><ActivityLog /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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