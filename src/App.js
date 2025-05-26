// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './layouts/DashBoard';
import ProtectedRoute from './components/protectedRoutes';
import UpgradePage from './components/UpgradePage';
import Mainbar from './components/MainBar'; // Import Mainbar
import AdminDashboard from './admin/AdminDashboard'; // Import AdminDashboard
import OpenAIChat from './openai/chatgpt';
import Welcome from './layouts/Welcome'; // Import Welcome component
import OAuthSuccess from './pages/OAuthSuccess'; // Import OAuthSuccess page
import ForgotPassword from './pages/forgotPassword'; // Import ForgotPassword page
import ResetPassword from './pages/resetPassword'; // Import ResetPassword page

export default function App() {
  return (
    <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard route with nested routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<ProtectedRoute><Welcome /></ProtectedRoute>}></Route>
            <Route path="pages/:id" element={<Mainbar />} /> {/* default dashboard view */}
            <Route path="upgrade/:id" element={<UpgradePage />} /> {/* relative path */}
            <Route path='chatbot' element={<ProtectedRoute><OpenAIChat /></ProtectedRoute>} />
          </Route>
          
          <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path='/chatbot' element={<ProtectedRoute><OpenAIChat /></ProtectedRoute>} />

      <Route path="/oauth-success" element={<OAuthSuccess />} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
