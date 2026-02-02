import { create } from 'zustand';

// Dummy data
const initialJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Houston, TX',
    status: 'active',
    rubric: [
      { id: 1, criteria: 'Technical Skills', weight: 40, description: 'React, TypeScript, Modern Frontend' },
      { id: 2, criteria: 'Communication', weight: 30, description: 'Clear verbal and written communication' },
      { id: 3, criteria: 'Problem Solving', weight: 30, description: 'Analytical thinking and creativity' }
    ]
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Dubai, UAE',
    status: 'active',
    rubric: [
      { id: 1, criteria: 'Strategic Thinking', weight: 35, description: 'Vision and roadmap planning' },
      { id: 2, criteria: 'Stakeholder Management', weight: 35, description: 'Cross-functional collaboration' },
      { id: 3, criteria: 'Execution', weight: 30, description: 'Delivery and results orientation' }
    ]
  }
];

const initialCandidates = [
  {
    id: 1,
    jobId: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1-555-0123',
    stage: 'applied',
    score: 85,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: '5 years',
    location: 'Austin, TX',
    appliedDate: '2026-01-20',
    resumeUrl: '#',
    evaluation: {
      technical: 88,
      communication: 82,
      problemSolving: 85
    },
    videoScreening: null,
    timeline: [
      { id: 1, event: 'Application submitted', date: '2026-01-20T10:30:00Z', type: 'applied' }
    ]
  },
 
  {
    id: 3,
    jobId: 1,
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0789',
    stage: 'interview',
    score: 78,
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    experience: '3 years',
    location: 'Houston, TX',
    appliedDate: '2026-01-22',
    resumeUrl: '#',
    evaluation: {
      technical: 75,
      communication: 80,
      problemSolving: 79
    },
    videoScreening: null,
    timeline: [
      { id: 1, event: 'Application submitted', date: '2026-01-22T13:45:00Z', type: 'applied' },
      { id: 2, event: 'Moved to interview', date: '2026-01-25T10:30:00Z', type: 'stage_change' }
    ]
  },
  {
    id: 4,
    jobId: 2,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+971-555-1234',
    stage: 'applied',
    score: 88,
    skills: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
    experience: '6 years',
    location: 'Dubai, UAE',
    appliedDate: '2026-01-23',
    resumeUrl: '#',
    evaluation: {
      strategicThinking: 90,
      stakeholderManagement: 85,
      execution: 89
    },
    videoScreening: null,
    timeline: [
      { id: 1, event: 'Application submitted', date: '2026-01-23T08:20:00Z', type: 'applied' }
    ]
  }
];

export const useStore = create((set, get) => ({
  // Data
  jobs: initialJobs,
  candidates: initialCandidates,
  selectedJobId: null,
  selectedCandidateId: null,
  
  // Assistant state
  assistantOpen: false,
  chatMessages: [],
  avatarState: 'idle', // idle, listening, thinking, speaking
  
  // Actions
  setSelectedJob: (jobId) => set({ selectedJobId: jobId }),
  setSelectedCandidate: (candidateId) => set({ selectedCandidateId: candidateId }),
  
  updateCandidateStage: (candidateId, newStage) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              stage: newStage,
              timeline: [
                ...c.timeline,
                {
                  id: c.timeline.length + 1,
                  event: `Moved to ${newStage}`,
                  date: new Date().toISOString(),
                  type: 'stage_change'
                }
              ]
            }
          : c
      )
    }));
  },
  
  updateJobRubric: (jobId, newRubric) => {
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === jobId ? { ...j, rubric: newRubric } : j
      )
    }));
    
    // Add audit event for selected candidate if any
    const selectedCandidateId = get().selectedCandidateId;
    if (selectedCandidateId) {
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === selectedCandidateId
            ? {
                ...c,
                timeline: [
                  ...c.timeline,
                  {
                    id: c.timeline.length + 1,
                    event: 'Evaluation rubric updated',
                    date: new Date().toISOString(),
                    type: 'rubric_change'
                  }
                ]
              }
            : c
        )
      }));
    }
  },
  
  updateVideoScreening: (candidateId, screeningData) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              videoScreening: screeningData,
              timeline: [
                ...c.timeline,
                {
                  id: c.timeline.length + 1,
                  event: 'Video screening submitted',
                  date: new Date().toISOString(),
                  type: 'screening'
                }
              ]
            }
          : c
      )
    }));
  },
  
  addTimelineEvent: (candidateId, event) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              timeline: [
                ...c.timeline,
                {
                  id: c.timeline.length + 1,
                  event: event,
                  date: new Date().toISOString(),
                  type: 'custom'
                }
              ]
            }
          : c
      )
    }));
  },
  
  // Assistant actions
  toggleAssistant: () => set((state) => ({ assistantOpen: !state.assistantOpen })),
  setAvatarState: (state) => set({ avatarState: state }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...message, timestamp: new Date().toISOString() }]
  })),
  
  // AI Actions
  shortlistTopCandidates: (jobId) => {
    const state = get();
    const jobCandidates = state.candidates.filter(c => c.jobId === jobId);
    const sortedCandidates = [...jobCandidates].sort((a, b) => b.score - a.score);
    
    sortedCandidates.slice(0, 2).forEach((candidate) => {
      if (candidate.stage === 'applied') {
        get().updateCandidateStage(candidate.id, 'shortlisted');
      }
    });
    
    return sortedCandidates.slice(0, 2).map(c => c.name);
  },
  
  generateRubric: (jobId) => {
    const state = get();
    const job = state.jobs.find(j => j.id === jobId);
    
    let newRubric = [];
    if (job.title.includes('Frontend') || job.title.includes('Developer')) {
      newRubric = [
        { id: 1, criteria: 'Technical Proficiency', weight: 40, description: 'Modern frameworks and tools' },
        { id: 2, criteria: 'Code Quality', weight: 25, description: 'Clean, maintainable code' },
        { id: 3, criteria: 'Problem Solving', weight: 20, description: 'Debugging and optimization' },
        { id: 4, criteria: 'Communication', weight: 15, description: 'Team collaboration' }
      ];
    } else {
      newRubric = [
        { id: 1, criteria: 'Leadership', weight: 35, description: 'Team and project leadership' },
        { id: 2, criteria: 'Strategic Vision', weight: 30, description: 'Long-term planning' },
        { id: 3, criteria: 'Execution', weight: 35, description: 'Delivery and results' }
      ];
    }
    
    get().updateJobRubric(jobId, newRubric);
    return newRubric;
  },
  
  scheduleInterview: (candidateId) => {
    get().addTimelineEvent(candidateId, 'Interview scheduled for next week');
    return true;
  }
}));