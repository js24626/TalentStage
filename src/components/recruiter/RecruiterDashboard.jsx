import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { Briefcase, Users, Clock, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { jobs, candidates } = useStore();

  const stats = {
    totalJobs: jobs.filter(j => j.status === 'active').length,
    totalCandidates: candidates.length,
    shortlisted: candidates.filter(c => c.stage === 'shortlisted').length,
    interviews: candidates.filter(c => c.stage === 'interview').length
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <Sparkles size={28} />
              <span>TalentSage</span>
            </div>
            <nav className="dashboard-nav">
              <a href="/dashboard" className="active">Dashboard</a>
              <a href="/">Marketing</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-title">
            <h1>Recruiter Dashboard</h1>
            <p>Manage your jobs, candidates, and hiring pipeline</p>
          </div>

          <div className="stats-grid">
            <StatCard icon={Briefcase} label="Active Jobs" value={stats.totalJobs} color="#4F46E5" />
            <StatCard icon={Users} label="Total Candidates" value={stats.totalCandidates} color="#10B981" />
            <StatCard icon={Clock} label="Shortlisted" value={stats.shortlisted} color="#F59E0B" />
            <StatCard icon={TrendingUp} label="Interviews" value={stats.interviews} color="#EF4444" />
          </div>

          <div className="jobs-section">
           
            <div className="jobs-list">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} navigate={navigate} candidates={candidates} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}20`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const JobCard = ({ job, navigate, candidates }) => {
  const jobCandidates = candidates.filter(c => c.jobId === job.id);
  const stages = {
    applied: jobCandidates.filter(c => c.stage === 'applied').length,
    shortlisted: jobCandidates.filter(c => c.stage === 'shortlisted').length,
    interview: jobCandidates.filter(c => c.stage === 'interview').length
  };

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="job-header">
        <div>
          <h3>{job.title}</h3>
          <div className="job-meta">
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
          </div>
        </div>
        <ChevronRight size={20} />
      </div>
      <div className="job-pipeline">
        <div className="pipeline-stage">
          <div className="pipeline-value">{stages.applied}</div>
          <div className="pipeline-label">Applied</div>
        </div>
        <div className="pipeline-stage">
          <div className="pipeline-value">{stages.shortlisted}</div>
          <div className="pipeline-label">Shortlisted</div>
        </div>
        <div className="pipeline-stage">
          <div className="pipeline-value">{stages.interview}</div>
          <div className="pipeline-label">Interview</div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;