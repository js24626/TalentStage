import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MarketingPage from './components/marketing/MarketingPage';
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import JobDetail from './components/recruiter/JobDetail';
import CandidateProfile from './components/recruiter/CandidateProfile';
import AssistantWidget from './components/assistant/AssistantWidget';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/dashboard" element={<RecruiterDashboard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AssistantWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;