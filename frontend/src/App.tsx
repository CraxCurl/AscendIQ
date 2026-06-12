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
import CareerPath from './pages/CareerPath';
import { AuthProvider } from './auth';
import { AnalysisProvider } from './analysis';
import AnalysisRequired from './components/AnalysisRequired';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthPage } from './components/auth/AuthPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnalysisProvider>
          <div className="min-h-screen bg-background text-white">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              <Route path="/upload" element={<ProtectedRoute><ProfileUpload /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><AnalysisRequired><Dashboard /></AnalysisRequired></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><AnalysisRequired><Roadmap /></AnalysisRequired></ProtectedRoute>} />
              <Route path="/career-path" element={<ProtectedRoute><AnalysisRequired><CareerPath /></AnalysisRequired></ProtectedRoute>} />
              <Route path="/opportunities" element={<ProtectedRoute><AnalysisRequired><Opportunities /></AnalysisRequired></ProtectedRoute>} />
              <Route path="/resume" element={<ProtectedRoute><AnalysisRequired><ResumeOptimization /></AnalysisRequired></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><AnalysisRequired><InterviewPrep /></AnalysisRequired></ProtectedRoute>} />
            </Routes>
          </div>
        </AnalysisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
