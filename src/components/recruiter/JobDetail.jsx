import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { ArrowLeft, Edit2, Save, Plus, X, User } from 'lucide-react';
import './JobDetail.css';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, candidates, updateJobRubric, updateCandidateStage } = useStore();
  const [editingRubric, setEditingRubric] = useState(false);
  
  const job = jobs.find(j => j.id === parseInt(jobId));
  const jobCandidates = candidates.filter(c => c.jobId === parseInt(jobId));
  
  if (!job) {
    return <div className="error-state">Job not found</div>;
  }

  return (
    <div className="job-detail">
      <header className="dashboard-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="job-detail-main">
        <div className="container">
          <div className="job-info">
            <h1>{job.title}</h1>
            <div className="job-meta">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span className="status-badge">{job.status}</span>
            </div>
          </div>

          <RubricEditor 
            job={job} 
            editing={editingRubric}
            setEditing={setEditingRubric}
            updateRubric={updateJobRubric}
          />

          <CandidatesList 
            candidates={jobCandidates}
            navigate={navigate}
            updateStage={updateCandidateStage}
          />
        </div>
      </main>
    </div>
  );
};

const RubricEditor = ({ job, editing, setEditing, updateRubric }) => {
  const [rubric, setRubric] = useState(job.rubric);

  const handleSave = () => {
    // Validate total weight = 100
    const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight !== 100) {
      alert('Total weight must equal 100%');
      return;
    }
    updateRubric(job.id, rubric);
    setEditing(false);
  };

  const handleCancel = () => {
    setRubric(job.rubric);
    setEditing(false);
  };

  const updateCriteria = (id, field, value) => {
    setRubric(rubric.map(item => 
      item.id === id ? { ...item, [field]: field === 'weight' ? parseInt(value) || 0 : value } : item
    ));
  };

  const addCriteria = () => {
    const newId = Math.max(...rubric.map(r => r.id), 0) + 1;
    setRubric([...rubric, { id: newId, criteria: 'New Criteria', weight: 10, description: '' }]);
  };

  const removeCriteria = (id) => {
    if (rubric.length > 1) {
      setRubric(rubric.filter(item => item.id !== id));
    }
  };

  const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="rubric-section">
      <div className="section-header">
       
        {!editing ? (
          <button className="btn btn-lg" onClick={() => setEditing(true)}>
            <Edit2 size={16} />
            Edit Rubric
          </button>
        ) : (
          <div className="rubric-actions">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-lg" onClick={handleSave}>
              <Save size={16} />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="rubric-list">
        {rubric.map((item) => (
          <div key={item.id} className="rubric-item">
            {editing ? (
              <>
                <div className="rubric-input-group">
                  <input
                    type="text"
                    value={item.criteria}
                    onChange={(e) => updateCriteria(item.id, 'criteria', e.target.value)}
                    className="rubric-input"
                    placeholder="Criteria name"
                  />
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) => updateCriteria(item.id, 'weight', e.target.value)}
                    className="rubric-weight-input"
                    min="0"
                    max="100"
                  />
                  <span className="weight-label">%</span>
                  {rubric.length > 1 && (
                    <button 
                      className="remove-btn"
                      onClick={() => removeCriteria(item.id)}
                      title="Remove criteria"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateCriteria(item.id, 'description', e.target.value)}
                  className="rubric-input description-input"
                  placeholder="Description"
                />
              </>
            ) : (
              <>
                <div className="rubric-header">
                  <h4>{item.criteria}</h4>
                  <span className="rubric-weight">{item.weight}%</span>
                </div>
                <p className="rubric-description">{item.description}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <>
          <button className="btn  add-btn" onClick={addCriteria}>
            <Plus size={16} />
            Add Criteria
          </button>
          <div className={`weight-total ${totalWeight !== 100 ? 'invalid' : ''}`}>
            Total Weight: {totalWeight}% {totalWeight !== 100 && '(Must be 100%)'}
          </div>
        </>
      )}
    </div>
  );
};

const CandidatesList = ({ candidates, navigate, updateStage }) => {
  const [filterStage, setFilterStage] = useState('all');

  const filteredCandidates = filterStage === 'all' 
    ? candidates 
    : candidates.filter(c => c.stage === filterStage);

  const sortedCandidates = [...filteredCandidates].sort((a, b) => b.score - a.score);

  return (
    <div className="candidates-section">
      <div className="section-header">
        <h2>Candidates ({candidates.length})</h2>
        <div className="stage-filters">
          <button 
            className={`filter-btn ${filterStage === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStage('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filterStage === 'applied' ? 'active' : ''}`}
            onClick={() => setFilterStage('applied')}
          >
            Applied
          </button>
          <button 
            className={`filter-btn ${filterStage === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setFilterStage('shortlisted')}
          >
            Shortlisted
          </button>
          <button 
            className={`filter-btn ${filterStage === 'interview' ? 'active' : ''}`}
            onClick={() => setFilterStage('interview')}
          >
            Interview
          </button>
        </div>
      </div>

      {sortedCandidates.length === 0 ? (
        <div className="empty-state">
          <User size={48} />
          <p>No candidates in this stage</p>
        </div>
      ) : (
        <div className="candidates-list">
          {sortedCandidates.map(candidate => (
            <CandidateCard 
              key={candidate.id}
              candidate={candidate}
              navigate={navigate}
              updateStage={updateStage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CandidateCard = ({ candidate, navigate, updateStage }) => {
  const stageColors = {
    applied: '#ffffff',
    shortlisted: '#F59E0B',
    interview: '#10B981',
    rejected: '#EF4444'
  };

  const handleStageChange = (newStage) => {
    updateStage(candidate.id, newStage);
  };

  return (
    <div className="candidate-card" onClick={() => navigate(`/candidates/${candidate.id}`)}>
      <div className="candidate-header">
        <div className="candidate-avatar">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="candidate-info">
          <h3>{candidate.name}</h3>
          <p className="candidate-meta">{candidate.experience} • {candidate.location}</p>
        </div>
        <div className="candidate-score">
          <div className="score-value">{candidate.score}</div>
          <div className="score-label">Score</div>
        </div>
      </div>

      <div className="candidate-skills">
        {candidate.skills.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="skill-tag">{skill}</span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="skill-tag more">+{candidate.skills.length - 4}</span>
        )}
      </div>

      <div className="candidate-footer" onClick={(e) => e.stopPropagation()}>
        <span 
          className="stage-badge" 
          style={{ background: `${stageColors[candidate.stage]}20`, color: stageColors[candidate.stage] }}
        >
          {candidate.stage}
        </span>
        <select 
          className="stage-select"
          value={candidate.stage}
          onChange={(e) => handleStageChange(e.target.value)}
        >
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

export default JobDetail;