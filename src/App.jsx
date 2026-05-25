import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';

import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Modal from './components/Modal';
import Loader from './components/Loader';

import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import AuditList from './screens/AuditList';
import AuditForm from './screens/AuditForm';
import AuditHistory from './screens/AuditHistory';
import Checklist from './screens/Checklist';
import RedTagList from './screens/RedTagList';
import RedTagForm from './screens/RedTagForm';
import Documents from './screens/Documents';
import Reports from './screens/Reports';
import Profile from './screens/Profile';
import Notifications from './screens/Notifications';
import CAPA from './screens/CAPA';

function ProtectedRoute({ children }) {
  const { state } = useApp();
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { state } = useApp();
  if (state.isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppShell() {
  return (
    <div className="app-frame">
      <div className="phone-shell">
        <StatusBar />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/audit"          element={<ProtectedRoute><AuditList /></ProtectedRoute>} />
          <Route path="/audit/form"     element={<ProtectedRoute><AuditForm /></ProtectedRoute>} />
          <Route path="/audit/history"  element={<ProtectedRoute><AuditHistory /></ProtectedRoute>} />
          <Route path="/checklist"      element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/redtag"         element={<ProtectedRoute><RedTagList /></ProtectedRoute>} />
          <Route path="/redtag/form"    element={<ProtectedRoute><RedTagForm /></ProtectedRoute>} />
          <Route path="/documents"      element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/reports"        element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications"  element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/capa"           element={<ProtectedRoute><CAPA /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <BottomNav />
        <Modal />
        <Toast />
        <Loader />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AppProvider>
  );
}
