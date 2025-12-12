import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { TrendingUp, AlertCircle, CheckCircle, XCircle, Target } from 'lucide-react';

export default function ResumeAnalysis() {
  const { resumeId } = useParams();
  const { resumes } = useStore();
  
  const resume = resumes.find((r) => r.id === resumeId);

  if (!resume) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Not Found</h2>
        <p className="text-gray-600 mb-4">The requested resume could not be found.</p>
        <Link to="/" className="btn-primary inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const analysis = resume.analysis;
  
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h2>
        <p className="text-gray-600">This resume hasn't been analyzed yet.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{resume.fileName}</h1>
          <p className="mt-1 text-gray-600">
            Uploaded {resume.uploadDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`card ${getScoreBgColor(analysis.atsScore)} border-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ATS Score</h2>
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-bold ${getScoreColor(analysis.atsScore)}`}>
              {analysis.atsScore}
            </span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Applicant Tracking System compatibility score
          </p>
        </div>

        <div className={`card ${getScoreBgColor(analysis.overallScore)} border-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Score</h2>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Overall resume quality and effectiveness
          </p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(analysis.sections).map(([section, data]) => (
            <div key={section} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 capitalize">
                  {section === 'contact' ? 'Contact Information' : section}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                  {data.score >= 70 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{data.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        {analysis.feedback.strengths.length > 0 && (
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Strengths</h2>
            </div>
            <ul className="space-y-2">
              {analysis.feedback.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {analysis.feedback.weaknesses.length > 0 && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Areas for Improvement</h2>
            </div>
            <ul className="space-y-2">
              {analysis.feedback.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {analysis.feedback.suggestions.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
          </div>
          <ul className="space-y-3">
            {analysis.feedback.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="text-primary-600 font-bold mt-0.5">{idx + 1}.</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Found Keywords */}
        {analysis.keywords.found.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keywords Found</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.found.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {analysis.keywords.missing.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.missing.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Consider adding these keywords naturally to improve ATS compatibility
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Link to="/matching" className="btn-primary">
          Match with Jobs
        </Link>
        <Link to="/upload" className="btn-secondary">
          Upload Another Resume
        </Link>
      </div>
    </div>
  );
}



