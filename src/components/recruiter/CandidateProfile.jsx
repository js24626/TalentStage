import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { 
  ArrowLeft, Mail, Phone, MapPin, FileText, 
  Calendar, CheckCircle, AlertCircle, Clock 
} from 'lucide-react';
import VideoScreening from '../video/VideoScreening';
import './CandidateProfile.css';

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, jobs } = useStore();
  
  const candidate = candidates.find(c => c.id === parseInt(candidateId));
  
  if (!candidate) {
    return <div className="error-state">Candidate not found</div>;
  }

  const job = jobs.find(j => j.id === candidate.jobId);

  return (
    <div className="candidate-profile">
      <header className="dashboard-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(`/jobs/${job.id}`)}>
            <ArrowLeft size={20} />
            Back to Job
          </button>
        </div>
      </header>

      <main className="candidate-profile-main">
        <div className="container">
          <div className="profile-layout">
            <div className="profile-sidebar">
              <ProfileSummary candidate={candidate} />
              <Timeline timeline={candidate.timeline} />
            </div>
            <div className="profile-content">
              <EvaluationCard candidate={candidate} job={job} />
              <ResumePreview />
              {candidate.videoScreening ? (
                <VideoReview screening={candidate.videoScreening} />
              ) : (
                <VideoScreening candidate={candidate} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileSummary = ({ candidate }) => (
  <div className="profile-card">
    <div className="profile-avatar-large">
      {candidate.name.split(' ').map(n => n[0]).join('')}
    </div>
    <h2>{candidate.name}</h2>
    <p className="profile-title">{candidate.experience} Experience</p>
    
    <div className="profile-contacts">
      <div className="contact-item">
        <Mail size={16} />
        <span>{candidate.email}</span>
      </div>
      <div className="contact-item">
        <Phone size={16} />
        <span>{candidate.phone}</span>
      </div>
      <div className="contact-item">
        <MapPin size={16} />
        <span>{candidate.location}</span>
      </div>
    </div>

    <div className="profile-score-large">
      <div className="score-circle">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#11acc1" 
            strokeWidth="10"
            strokeDasharray={`${candidate.score * 2.827} 282.7`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="score-text">
          <span className="score-number">{candidate.score}</span>
          <span className="score-max">/100</span>
        </div>
      </div>
      <p className="score-label">Overall Score</p>
    </div>

    <div className="profile-skills">
      <h4>Skills</h4>
      <div className="skills-list">
        {candidate.skills.map((skill, idx) => (
          <span key={idx} className="skill-badge">{skill}</span>
        ))}
      </div>
    </div>
  </div>
);

const Timeline = ({ timeline }) => (
  <div className="timeline-card">
    <h3>Activity Timeline</h3>
    <div className="timeline-list">
      {[...timeline].reverse().map((item) => (
        <TimelineItem key={item.id} item={item} />
      ))}
    </div>
  </div>
);

const TimelineItem = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'applied': return <FileText size={16} />;
      case 'screening': return <CheckCircle size={16} />;
      case 'stage_change': return <AlertCircle size={16} />;
      case 'rubric_change': return <FileText size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getColor = () => {
    switch (item.type) {
      case 'applied': return '#6B7280';
      case 'screening': return '#10B981';
      case 'stage_change': return '#4F46E5';
      case 'rubric_change': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="timeline-item">
      <div className="timeline-icon" style={{ background: `${getColor()}20`, color: getColor() }}>
        {getIcon()}
      </div>
      <div className="timeline-content">
        <p className="timeline-event">{item.event}</p>
        <p className="timeline-date">{formatDate(item.date)}</p>
      </div>
    </div>
  );
};

const EvaluationCard = ({ candidate, job }) => (
  <div className="evaluation-card">
    <h3>AI Evaluation</h3>
    <p className="evaluation-subtitle">Based on {job.title} rubric criteria</p>
    
    <div className="evaluation-scores">
      {Object.entries(candidate.evaluation).map(([key, value]) => {
        const criteria = job.rubric.find(r => 
          r.criteria.toLowerCase().replace(/\s+/g, '') === key.toLowerCase().replace(/\s+/g, '')
        );
        const label = criteria ? criteria.criteria : key.replace(/([A-Z])/g, ' $1').trim();
        
        return (
          <div key={key} className="evaluation-item">
            <div className="evaluation-header">
              <span className="evaluation-label">{label}</span>
              <span className="evaluation-value">{value}/100</span>
            </div>
            <div className="evaluation-bar">
              <div 
                className="evaluation-fill" 
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>

    <div className="evaluation-summary">
      <div className="summary-icon">
        <CheckCircle size={24} />
      </div>
      <div className="summary-content">
        <h4>Recommendation</h4>
        <p>
          Strong candidate with excellent scores across all criteria. 
          Particularly strong in {Object.entries(candidate.evaluation)
            .sort((a, b) => b[1] - a[1])[0][0]
            .replace(/([A-Z])/g, ' $1').trim().toLowerCase()}.
        </p>
      </div>
    </div>
  </div>
);

const ResumePreview = () => (
  <div className="resume-card">
    <div className="card-header">
      <h3>Resume</h3>
      <button className="btn btn-secondary btn-sm">
        <FileText size={16} />
        Download
      </button>
    </div>
    <div className="resume-preview">
      <div className="resume-section">
        <h4>Professional Summary</h4>
        <p>
          Experienced frontend developer with a passion for creating 
          beautiful, performant web applications. Specialized in React, 
          TypeScript, and modern web technologies.
        </p>
      </div>
      <div className="resume-section">
        <h4>Work Experience</h4>
        <div className="resume-job">
          <h5>Senior Frontend Developer</h5>
          <p className="resume-company">Tech Corp • 2021 - Present</p>
          <ul>
            <li>Led development of company's flagship SaaS product</li>
            <li>Improved application performance by 40%</li>
            <li>Mentored junior developers</li>
          </ul>
        </div>
      </div>
      <div className="resume-section">
        <h4>Education</h4>
        <div className="resume-education">
          <h5>B.S. Computer Science</h5>
          <p>University of Technology • 2017</p>
        </div>
      </div>
    </div>
  </div>
);

const VideoReview = ({ screening }) => (
  <div className="video-review-card">
    <h3>Video Screening</h3>
    <p className="video-subtitle">Completed on {new Date(screening.submittedDate).toLocaleDateString()}</p>
    
    <div className="video-player-placeholder">
      <div className="play-icon">▶</div>
      <p>Video Recording</p>
    </div>

    <div className="screening-evaluation">
      <h4>AI Analysis</h4>
      <div className="screening-scores">
        {Object.entries(screening.scores).map(([key, value]) => (
          <div key={key} className="screening-score-item">
            <span className="screening-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="screening-value">{value}/100</span>
            <div className="screening-bar">
              <div className="screening-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="screening-recommendation">
        <span className={`recommendation-badge ${screening.recommendation.toLowerCase().replace(' ', '-')}`}>
          {screening.recommendation}
        </span>
      </div>

      <div className="screening-transcript">
        <h5>Transcript</h5>
        <p>{screening.transcript}</p>
      </div>
    </div>
  </div>
);

export default CandidateProfile;