import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InterviewPrep from './pages/InterviewPrep';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Opportunities from './pages/Opportunities';
import ProfileUpload from './pages/ProfileUpload';
import ResumeOptimization from './pages/ResumeOptimization';
import Roadmap from './pages/Roadmap';
import { AuthProvider } from './auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background text-white">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={<ProtectedRoute><ProfileUpload /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeOptimization /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
