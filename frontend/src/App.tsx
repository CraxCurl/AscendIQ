import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InterviewPrep from './pages/InterviewPrep';
import Landing from './pages/Landing';
import Opportunities from './pages/Opportunities';
import ProfileUpload from './pages/ProfileUpload';
import ResumeOptimization from './pages/ResumeOptimization';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<ProfileUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/resume" element={<ResumeOptimization />} />
          <Route path="/interview" element={<InterviewPrep />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
