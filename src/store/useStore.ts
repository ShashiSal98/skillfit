import { create } from 'zustand';
import { Resume, JobDescription, JobMatch, ResumeAnalysis } from '../types';

interface AppState {
  // Puter.js auth
  isAuthenticated: boolean;
  user: any | null;
  
  // Resumes
  resumes: Resume[];
  selectedResume: Resume | null;
  
  // Job descriptions
  jobDescriptions: JobDescription[];
  
  // Job matches
  jobMatches: JobMatch[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAuthenticated: (isAuth: boolean, user?: any) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  setSelectedResume: (resume: Resume | null) => void;
  addJobDescription: (job: JobDescription) => void;
  deleteJobDescription: (id: string) => void;
  addJobMatch: (match: JobMatch) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  resumes: [],
  selectedResume: null,
  jobDescriptions: [],
  jobMatches: [],
  isLoading: false,
  error: null,
  
  setAuthenticated: (isAuth, user) => set({ isAuthenticated: isAuth, user }),
  addResume: (resume) => set((state) => ({ resumes: [...state.resumes, resume] })),
  updateResume: (id, updates) => set((state) => ({
    resumes: state.resumes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
  })),
  deleteResume: (id) => set((state) => ({
    resumes: state.resumes.filter((r) => r.id !== id),
    selectedResume: state.selectedResume?.id === id ? null : state.selectedResume,
  })),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  addJobDescription: (job) => set((state) => ({ jobDescriptions: [...state.jobDescriptions, job] })),
  deleteJobDescription: (id) => set((state) => ({
    jobDescriptions: state.jobDescriptions.filter((j) => j.id !== id),
  })),
  addJobMatch: (match) => set((state) => ({ jobMatches: [...state.jobMatches, match] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearAllData: () => set({
    resumes: [],
    selectedResume: null,
    jobDescriptions: [],
    jobMatches: [],
  }),
}));



