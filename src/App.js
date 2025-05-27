// src/App.js
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './layouts/DashBoard';
import ProtectedRoute from './components/protectedRoutes';
import UpgradePage from './components/UpgradePage';
import Mainbar from './components/MainBar';
import AdminDashboard from './admin/AdminDashboard';
import OpenAIChat from './openai/chatgpt';
import Welcome from './layouts/Welcome';
import OAuthSuccess from './pages/OAuthSuccess';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';
import LogRocket from 'logrocket';

// ✅ LogRocket setup with input masking
LogRocket.init('pjfgjd/notion-c', {
  dom: {
    inputSanitizer: (input) => {
      if (input.type === 'password') {
        return '********';
      }
      return input.value;
    },
  },
});

// ✅ Custom hook to track route navigation
function useLogRocketPageTracking() {
  const location = useLocation();

  useEffect(() => {
    LogRocket.log(`Navigated to ${location.pathname}`);
  }, [location]);
}

export default function App() {
  useLogRocketPageTracking(); // ✅ Call inside main app component

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Dashboard route with nested routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route index element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
        <Route path="pages/:id" element={<Mainbar />} />
        <Route path="upgrade/:id" element={<UpgradePage />} />
        <Route path="chatbot" element={<ProtectedRoute><OpenAIChat /></ProtectedRoute>} />
      </Route>

      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><OpenAIChat /></ProtectedRoute>} />

      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
