import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { puterClient } from '../lib/puter';
import { matchResumeToJob, matchResumeToMultipleJobs } from '../lib/jobMatcher';
import { Target, Plus, Trash2, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function JobMatching() {
  const { resumes, jobDescriptions, jobMatches, addJobDescription, deleteJobDescription, addJobMatch, setLoading, selectedResume, setSelectedResume } = useStore();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddJob = async () => {
    if (!jobTitle.trim() || !jobDesc.trim()) {
      setError('Job title and description are required');
      return;
    }

    const requirementsList = requirements
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: jobTitle,
      company: company || 'Unknown Company',
      description: jobDesc,
      requirements: requirementsList,
    };

    addJobDescription(job);

    // Save to Puter storage
    const existingJobs = await puterClient.loadData('jobDescriptions') || [];
    existingJobs.push(job);
    await puterClient.saveData('jobDescriptions', existingJobs);

    // Clear form
    setJobTitle('');
    setCompany('');
    setJobDesc('');
    setRequirements('');
    setError(null);
  };

  const handleMatchJobs = async () => {
    if (resumes.length === 0) {
      setError('Please upload at least one resume first');
      return;
    }

    if (jobDescriptions.length === 0) {
      setError('Please add at least one job description');
      return;
    }

    setIsMatching(true);
    setError(null);
    setLoading(true);

    try {
      // Match selected resume or first resume to all jobs
      const resumeToMatch = selectedResume || resumes[0];
      
      const matches = await matchResumeToMultipleJobs(resumeToMatch, jobDescriptions);
      
      // Save matches
      matches.forEach(match => {
        addJobMatch(match);
      });

      setSelectedResume(resumeToMatch);
    } catch (err: any) {
      setError(err.message || 'Failed to match jobs');
    } finally {
      setIsMatching(false);
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const matchedJobs = jobDescriptions
    .map(job => {
      const match = jobMatches.find(m => m.jobId === job.id && m.resumeId === (selectedResume?.id || resumes[0]?.id));
      return { job, match };
    })
    .filter(({ match }) => match)
    .sort((a, b) => (b.match?.matchScore || 0) - (a.match?.matchScore || 0));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Matching</h1>
        <p className="mt-2 text-gray-600">Add job descriptions and match them with your resume</p>
      </div>

      {/* Resume Selection */}
      {resumes.length > 0 && (
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Resume to Match
          </label>
          <select
            value={selectedResume?.id || resumes[0]?.id || ''}
            onChange={(e) => {
              const resume = resumes.find(r => r.id === e.target.value);
              setSelectedResume(resume || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {resumes.map(resume => (
              <option key={resume.id} value={resume.id}>
                {resume.fileName} {resume.analysis ? `(ATS: ${resume.analysis.atsScore}%)` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Job Description */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Job Description</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Tech Corp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements (one per line)
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="5+ years of experience&#10;Bachelor's degree in Computer Science&#10;Proficient in React and Node.js"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleAddJob}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Job Description</span>
          </button>
        </div>
      </div>

      {/* Match Button */}
      {jobDescriptions.length > 0 && resumes.length > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Match</h3>
              <p className="text-sm text-gray-600 mt-1">
                Match {selectedResume?.fileName || resumes[0]?.fileName} with {jobDescriptions.length} job{jobDescriptions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleMatchJobs}
              disabled={isMatching}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Target className="h-5 w-5" />
              <span>{isMatching ? 'Matching...' : 'Match Jobs'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Job Descriptions List */}
      {jobDescriptions.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Descriptions ({jobDescriptions.length})</h2>
          <div className="space-y-4">
            {jobDescriptions.map(job => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{job.description}</p>
                    {job.requirements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Requirements:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li>+{job.requirements.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      deleteJobDescription(job.id);
                      await puterClient.deleteData(`job_${job.id}`);
                      const existingJobs = await puterClient.loadData('jobDescriptions') || [];
                      const updated = existingJobs.filter((j: any) => j.id !== job.id);
                      await puterClient.saveData('jobDescriptions', updated);
                    }}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Results */}
      {matchedJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Match Results</h2>
          {matchedJobs.map(({ job, match }) => (
            <div key={job.id} className={`card border-2 ${getScoreColor(match!.matchScore)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{match!.matchScore}%</div>
                  <div className="text-sm text-gray-600">Match Score</div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">{match!.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {match!.matchedSkills.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Matched Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match!.matchedSkills.slice(0, 8).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match!.missingSkills.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium text-gray-900">Missing Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match!.missingSkills.slice(0, 8).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {resumes.length > 0 && (
                <Link
                  to={`/analysis/${selectedResume?.id || resumes[0]?.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Resume Analysis →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {resumes.length === 0 && (
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Resumes Available</h3>
          <p className="text-gray-600 mb-6">Upload a resume first to start matching with jobs</p>
          <Link to="/upload" className="btn-primary inline-block">
            Upload Resume
          </Link>
        </div>
      )}

      {jobDescriptions.length === 0 && (
        <div className="card text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Descriptions</h3>
          <p className="text-gray-600">Add job descriptions above to start matching</p>
        </div>
      )}
    </div>
  );
}

