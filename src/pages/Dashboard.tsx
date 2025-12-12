import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileText, Upload, Target, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { resumes, jobDescriptions, jobMatches } = useStore();

  const avgATSScore = resumes.length > 0
    ? Math.round(resumes.reduce((sum, r) => sum + (r.analysis?.atsScore || 0), 0) / resumes.length)
    : 0;

  const avgMatchScore = jobMatches.length > 0
    ? Math.round(jobMatches.reduce((sum, m) => sum + m.matchScore, 0) / jobMatches.length)
    : 0;

  const stats = [
    {
      label: 'Resumes',
      value: resumes.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/upload',
    },
    {
      label: 'Job Descriptions',
      value: jobDescriptions.length,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/matching',
    },
    {
      label: 'Avg ATS Score',
      value: `${avgATSScore}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/upload',
    },
    {
      label: 'Avg Match Score',
      value: `${avgMatchScore}%`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/matching',
    },
  ];

  const recentResumes = resumes
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your resume analysis and job matches</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/upload"
          className="card hover:shadow-md transition-shadow border-2 border-dashed border-primary-300 hover:border-primary-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-50 p-3 rounded-lg">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Resume</h3>
              <p className="text-sm text-gray-600">Upload and analyze a new resume</p>
            </div>
          </div>
        </Link>

        <Link
          to="/matching"
          className="card hover:shadow-md transition-shadow border-2 border-dashed border-green-300 hover:border-green-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Match Jobs</h3>
              <p className="text-sm text-gray-600">Find jobs that match your resume</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Resumes */}
      {recentResumes.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Resumes</h2>
          <div className="space-y-4">
            {recentResumes.map((resume) => (
              <Link
                key={resume.id}
                to={`/analysis/${resume.id}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                  <p className="text-sm text-gray-500">
                    Uploaded {resume.uploadDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {resume.analysis && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ATS: {resume.analysis.atsScore}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Overall: {resume.analysis.overallScore}%
                      </div>
                    </div>
                  )}
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {resumes.length === 0 && (
        <div className="card text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Resumes Yet</h3>
          <p className="text-gray-600 mb-6">Upload your first resume to get started with AI-powered analysis</p>
          <Link to="/upload" className="btn-primary inline-block">
            Upload Resume
          </Link>
        </div>
      )}
    </div>
  );
}



