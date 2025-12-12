import { Resume, JobDescription, JobMatch } from '../types';
import { analyzeResume } from './aiAnalyzer';

export async function matchResumeToJob(
  resume: Resume,
  job: JobDescription
): Promise<JobMatch> {
  // Analyze resume with job context
  const analysis = await analyzeResume(resume.text, job.description);
  
  // Extract keywords from job description
  const jobKeywords = extractJobKeywords(job);
  const resumeKeywords = analysis.keywords.found;
  
  // Find matched and missing skills
  const matchedSkills = resumeKeywords.filter(skill =>
    jobKeywords.some(jobKw => skill.toLowerCase().includes(jobKw.toLowerCase()) || jobKw.toLowerCase().includes(skill.toLowerCase()))
  );
  
  const missingSkills = jobKeywords.filter(jobKw =>
    !resumeKeywords.some(skill => skill.toLowerCase().includes(jobKw.toLowerCase()) || jobKw.toLowerCase().includes(skill.toLowerCase()))
  );
  
  // Calculate match score
  const keywordMatchScore = (matchedSkills.length / Math.max(jobKeywords.length, 1)) * 100;
  const atsScoreWeight = analysis.atsScore * 0.4;
  const keywordWeight = keywordMatchScore * 0.4;
  const requirementsMatchWeight = calculateRequirementsMatch(resume, job) * 20;
  
  const matchScore = Math.round(atsScoreWeight + keywordWeight + requirementsMatchWeight);
  
  // Generate match analysis
  const analysisText = generateMatchAnalysis(resume, job, matchedSkills, missingSkills, matchScore);
  
  return {
    jobId: job.id,
    resumeId: resume.id,
    matchScore: Math.min(100, Math.max(0, matchScore)),
    matchedSkills,
    missingSkills: missingSkills.slice(0, 10),
    analysis: analysisText,
  };
}

function extractJobKeywords(job: JobDescription): string[] {
  const text = `${job.description} ${job.requirements.join(' ')}`.toLowerCase();
  const keywords: string[] = [];
  
  // Technical skills
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'typescript', 'sql',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'web development',
    'mobile development', 'devops', 'cloud computing', 'databases',
    'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'mysql',
    'azure', 'gcp', 'terraform', 'ci/cd', 'microservices', 'api',
  ];
  
  techSkills.forEach(skill => {
    if (text.includes(skill)) {
      keywords.push(skill);
    }
  });
  
  // Extract from requirements
  job.requirements.forEach(req => {
    const reqLower = req.toLowerCase();
    techSkills.forEach(skill => {
      if (reqLower.includes(skill) && !keywords.includes(skill)) {
        keywords.push(skill);
      }
    });
  });
  
  // Extract years of experience
  const expMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?experience/i);
  if (expMatch) {
    keywords.push(`${expMatch[1]} years experience`);
  }
  
  return [...new Set(keywords)];
}

function calculateRequirementsMatch(resume: Resume, job: JobDescription): number {
  const resumeLower = resume.text.toLowerCase();
  let matchedRequirements = 0;
  
  job.requirements.forEach(req => {
    const reqLower = req.toLowerCase();
    // Simple keyword matching
    const reqWords = reqLower.split(/\s+/).filter(w => w.length > 3);
    const matchedWords = reqWords.filter(word => resumeLower.includes(word));
    
    if (matchedWords.length / reqWords.length > 0.3) {
      matchedRequirements++;
    }
  });
  
  return job.requirements.length > 0
    ? (matchedRequirements / job.requirements.length)
    : 0.5;
}

function generateMatchAnalysis(
  resume: Resume,
  job: JobDescription,
  matchedSkills: string[],
  missingSkills: string[],
  matchScore: number
): string {
  let analysis = '';
  
  if (matchScore >= 80) {
    analysis = `Excellent match! Your resume aligns very well with this position. `;
  } else if (matchScore >= 60) {
    analysis = `Good match. Your resume has strong alignment with the job requirements. `;
  } else if (matchScore >= 40) {
    analysis = `Moderate match. There are some gaps between your resume and the job requirements. `;
  } else {
    analysis = `Low match. Your resume needs significant improvements to align with this position. `;
  }
  
  if (matchedSkills.length > 0) {
    analysis += `You have strong alignment with ${matchedSkills.length} required skills: ${matchedSkills.slice(0, 5).join(', ')}. `;
  }
  
  if (missingSkills.length > 0) {
    analysis += `Consider highlighting or adding these skills: ${missingSkills.slice(0, 5).join(', ')}. `;
  }
  
  analysis += `Your ATS score indicates ${matchScore >= 70 ? 'strong' : matchScore >= 50 ? 'moderate' : 'weak'} compatibility with applicant tracking systems.`;
  
  return analysis;
}

export async function matchResumeToMultipleJobs(
  resume: Resume,
  jobs: JobDescription[]
): Promise<JobMatch[]> {
  const matches = await Promise.all(
    jobs.map(job => matchResumeToJob(resume, job))
  );
  
  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}



