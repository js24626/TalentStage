import { describe, it, expect } from 'vitest';
import { useStore } from '../store/store';

describe('Store - Candidate Stage Management', () => {
  it('should update candidate stage and add timeline event', () => {
    const { updateCandidateStage, candidates } = useStore.getState();
    
    const candidateId = 1;
    const initialCandidate = candidates.find(c => c.id === candidateId);
    const initialStage = initialCandidate.stage;
    const initialTimelineLength = initialCandidate.timeline.length;
    
    // Update stage
    updateCandidateStage(candidateId, 'shortlisted');
    
    // Get updated candidate
    const updatedCandidate = useStore.getState().candidates.find(c => c.id === candidateId);
    
    // Assertions
    expect(updatedCandidate.stage).toBe('shortlisted');
    expect(updatedCandidate.stage).not.toBe(initialStage);
    expect(updatedCandidate.timeline.length).toBe(initialTimelineLength + 1);
    expect(updatedCandidate.timeline[updatedCandidate.timeline.length - 1].event).toContain('shortlisted');
  });
});

describe('Store - Rubric Logic', () => {
  it('should update job rubric and validate structure', () => {
    const { updateJobRubric, jobs } = useStore.getState();
    
    const jobId = 1;
    const newRubric = [
      { id: 1, criteria: 'Test Skill', weight: 50, description: 'Test description' },
      { id: 2, criteria: 'Another Skill', weight: 50, description: 'Another description' }
    ];
    
    // Update rubric
    updateJobRubric(jobId, newRubric);
    
    // Get updated job
    const updatedJob = useStore.getState().jobs.find(j => j.id === jobId);
    
    // Assertions
    expect(updatedJob.rubric).toEqual(newRubric);
    expect(updatedJob.rubric.length).toBe(2);
    
    // Validate total weight
    const totalWeight = updatedJob.rubric.reduce((sum, item) => sum + item.weight, 0);
    expect(totalWeight).toBe(100);
  });
});

describe('Store - Assistant Actions', () => {
  it('should shortlist top candidates based on score', () => {
    const { shortlistTopCandidates, candidates } = useStore.getState();
    
    const jobId = 1;
    const jobCandidates = candidates.filter(c => c.jobId === jobId && c.stage === 'applied');
    
    if (jobCandidates.length > 0) {
      // Execute shortlisting
      const shortlisted = shortlistTopCandidates(jobId);
      
      // Assertions
      expect(shortlisted).toBeDefined();
      expect(Array.isArray(shortlisted)).toBe(true);
      
      // Verify candidates were actually moved
      const updatedCandidates = useStore.getState().candidates;
      const shortlistedCandidates = updatedCandidates.filter(
        c => c.jobId === jobId && c.stage === 'shortlisted'
      );
      
      expect(shortlistedCandidates.length).toBeGreaterThan(0);
    }
  });

  it('should generate rubric for a job', () => {
    const { generateRubric, jobs } = useStore.getState();
    
    const jobId = 1;
    const rubric = generateRubric(jobId);
    
    // Assertions
    expect(rubric).toBeDefined();
    expect(Array.isArray(rubric)).toBe(true);
    expect(rubric.length).toBeGreaterThan(0);
    
    // Validate rubric structure
    rubric.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('criteria');
      expect(item).toHaveProperty('weight');
      expect(item).toHaveProperty('description');
    });
    
    // Validate total weight
    const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('should schedule interview and add timeline event', () => {
    const { scheduleInterview, candidates } = useStore.getState();
    
    const candidateId = 1;
    const initialCandidate = candidates.find(c => c.id === candidateId);
    const initialTimelineLength = initialCandidate.timeline.length;
    
    // Schedule interview
    const result = scheduleInterview(candidateId);
    
    // Assertions
    expect(result).toBe(true);
    
    const updatedCandidate = useStore.getState().candidates.find(c => c.id === candidateId);
    expect(updatedCandidate.timeline.length).toBe(initialTimelineLength + 1);
    
    const lastEvent = updatedCandidate.timeline[updatedCandidate.timeline.length - 1];
    expect(lastEvent.event.toLowerCase()).toContain('interview');
  });
});