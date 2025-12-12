import { ResumeAnalysis } from '../types';

// AI-powered resume analysis using browser-based AI APIs
// In production, this would use Puter.js AI services or WebLLM

export async function analyzeResume(resumeText: string, jobDescription?: string): Promise<ResumeAnalysis> {
  // Extract keywords and skills from resume
  const resumeLower = resumeText.toLowerCase();
  
  // Common resume sections detection
  const hasContact = /(phone|email|address|contact)/i.test(resumeText);
  const hasSummary = /(summary|objective|profile|about)/i.test(resumeText);
  const hasExperience = /(experience|employment|work history|professional)/i.test(resumeText);
  const hasSkills = /(skills|technical|competencies|abilities)/i.test(resumeText);
  const hasEducation = /(education|university|degree|bachelor|master|phd)/i.test(resumeText);
  
  // Extract skills (common technical skills)
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'typescript',
    'sql', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'machine learning', 'ai', 'data science', 'web development',
    'mobile development', 'devops', 'cloud computing', 'databases'
  ];
  
  const foundSkills = commonSkills.filter(skill => resumeLower.includes(skill));
  const missingSkills = jobDescription 
    ? extractKeywordsFromJob(jobDescription).filter(kw => !resumeLower.includes(kw.toLowerCase()))
    : [];
  
  // Calculate section scores
  const contactScore = hasContact ? 100 : 0;
  const summaryScore = hasSummary ? (resumeText.match(/summary|objective|profile/i)?.[0] ? 80 : 60) : 0;
  const experienceScore = hasExperience ? 85 : 0;
  const skillsScore = hasSkills ? Math.min(100, (foundSkills.length / 5) * 100) : 0;
  const educationScore = hasEducation ? 90 : 0;
  
  // Calculate overall ATS score
  const sectionScores = [contactScore, summaryScore, experienceScore, skillsScore, educationScore];
  const atsScore = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);
  
  // Overall score (ATS + content quality)
  const contentQuality = calculateContentQuality(resumeText);
  const overallScore = Math.round((atsScore * 0.7) + (contentQuality * 0.3));
  
  // Generate feedback
  const feedback = generateFeedback(resumeText, {
    contactScore,
    summaryScore,
    experienceScore,
    skillsScore,
    educationScore,
    foundSkills,
    missingSkills,
  });
  
  return {
    atsScore,
    overallScore,
    feedback,
    sections: {
      contact: {
        score: contactScore,
        feedback: hasContact 
          ? 'Contact information is present and clear.'
          : 'Missing contact information. Add phone, email, and location.',
      },
      summary: {
        score: summaryScore,
        feedback: hasSummary
          ? 'Summary section is present. Consider making it more impactful.'
          : 'Add a professional summary or objective statement at the top.',
      },
      experience: {
        score: experienceScore,
        feedback: hasExperience
          ? 'Experience section is well-structured.'
          : 'Ensure your work experience is clearly listed with dates and achievements.',
      },
      skills: {
        score: skillsScore,
        feedback: hasSkills
          ? `Good technical skills listed. Found: ${foundSkills.join(', ')}`
          : 'Add a dedicated skills section highlighting your technical and soft skills.',
      },
      education: {
        score: educationScore,
        feedback: hasEducation
          ? 'Education section is present.'
          : 'Include your educational background with degrees and institutions.',
      },
    },
    keywords: {
      found: foundSkills,
      missing: missingSkills.slice(0, 10), // Limit to top 10 missing
    },
  };
}

function extractKeywordsFromJob(jobDescription: string): string[] {
  const jobLower = jobDescription.toLowerCase();
  const keywords: string[] = [];
  
  const skillPatterns = [
    /\b(javascript|python|java|react|node|typescript|sql|aws|docker|kubernetes|git)\b/g,
    /\b(machine learning|ai|data science|web development|mobile development|devops|cloud computing)\b/g,
  ];
  
  skillPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      keywords.push(...matches.map(m => m.toLowerCase()));
    }
  });
  
  return [...new Set(keywords)];
}

function calculateContentQuality(text: string): number {
  let score = 50;
  
  // Length check
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 300 && wordCount < 1000) score += 10;
  else if (wordCount < 200) score -= 10;
  
  // Action verbs
  const actionVerbs = /(achieved|improved|developed|created|managed|led|increased|reduced|designed|implemented)/gi;
  const verbMatches = text.match(actionVerbs);
  if (verbMatches && verbMatches.length > 5) score += 15;
  
  // Numbers/quantifiable achievements
  const numbers = /\d+/g;
  const numberMatches = text.match(numbers);
  if (numberMatches && numberMatches.length > 3) score += 15;
  
  // Professional language
  const professionalTerms = /(managed|lead|responsible|collaborated|implemented|optimized)/gi;
  const professionalMatches = text.match(professionalTerms);
  if (professionalMatches && professionalMatches.length > 3) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

function generateFeedback(
  text: string,
  metrics: {
    contactScore: number;
    summaryScore: number;
    experienceScore: number;
    skillsScore: number;
    educationScore: number;
    foundSkills: string[];
    missingSkills: string[];
  }
): { strengths: string[]; weaknesses: string[]; suggestions: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  
  if (metrics.contactScore === 100) {
    strengths.push('Contact information is complete and easily accessible');
  } else {
    weaknesses.push('Contact information is missing or incomplete');
    suggestions.push('Add your phone number, email address, and LinkedIn profile');
  }
  
  if (metrics.skillsScore > 70) {
    strengths.push(`Strong technical skills section with ${metrics.foundSkills.length} relevant skills`);
  } else {
    weaknesses.push('Skills section needs improvement');
    suggestions.push('Expand your skills section with relevant technical and soft skills');
  }
  
  if (metrics.experienceScore > 0) {
    strengths.push('Work experience is clearly documented');
  } else {
    weaknesses.push('Missing or unclear work experience section');
    suggestions.push('Format your experience with clear job titles, companies, dates, and bullet points');
  }
  
  if (metrics.missingSkills.length > 0) {
    suggestions.push(`Consider adding these keywords from the job description: ${metrics.missingSkills.slice(0, 5).join(', ')}`);
  }
  
  // Generic suggestions
  suggestions.push('Use action verbs and quantify achievements where possible');
  suggestions.push('Keep formatting consistent and ATS-friendly (avoid complex layouts)');
  suggestions.push('Tailor your resume to match keywords from the job description');
  
  return { strengths, weaknesses, suggestions };
}



