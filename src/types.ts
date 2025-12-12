export interface Resume {
  id: string;
  fileName: string;
  uploadDate: Date;
  text: string;
  analysis?: ResumeAnalysis;
}

export interface ResumeAnalysis {
  atsScore: number;
  overallScore: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  sections: {
    contact: { score: number; feedback: string };
    summary: { score: number; feedback: string };
    experience: { score: number; feedback: string };
    skills: { score: number; feedback: string };
    education: { score: number; feedback: string };
  };
  keywords: {
    found: string[];
    missing: string[];
  };
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location?: string;
  matchScore?: number;
}

export interface JobMatch {
  jobId: string;
  resumeId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  analysis: string;
}



