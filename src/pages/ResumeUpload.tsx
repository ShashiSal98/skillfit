import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { puterClient } from '../lib/puter';
import { extractTextFromPDF } from '../lib/pdfParser';
import { analyzeResume } from '../lib/aiAnalyzer';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addResume, setLoading, setError: setStoreError } = useStore();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setLoading(true);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Failed to extract text from PDF. Please ensure the PDF contains readable text.');
      }

      // Upload file to Puter storage
      const fileUrl = await puterClient.uploadFile(file);

      // Analyze resume
      const analysis = await analyzeResume(resumeText, jobDescription || undefined);

      // Create resume object
      const resume = {
        id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        uploadDate: new Date(),
        text: resumeText,
        analysis,
      };

      // Save to store
      addResume(resume);

      // Save to Puter storage
      const existingResumes = await puterClient.loadData('resumes') || [];
      existingResumes.push(resume);
      await puterClient.saveData('resumes', existingResumes);

      // Navigate to analysis page
      navigate(`/analysis/${resume.id}`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload and analyze resume';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
        <p className="mt-2 text-gray-600">Upload your resume to get AI-powered analysis and ATS scores</p>
      </div>

      <div className="card">
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF only)
          </label>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF files only, max 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Optional Job Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description (Optional)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for targeted analysis..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={6}
          />
          <p className="mt-1 text-xs text-gray-500">
            Adding a job description will provide more targeted feedback and keyword matching
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Upload & Analyze Resume'
          )}
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <FileText className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">ATS Scoring</h3>
          <p className="text-sm text-gray-600">
            Get your resume scored for compatibility with Applicant Tracking Systems
          </p>
        </div>
        
        <div className="card bg-purple-50 border-purple-200">
          <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">AI Feedback</h3>
          <p className="text-sm text-gray-600">
            Receive detailed feedback on strengths, weaknesses, and improvements
          </p>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <Upload className="h-8 w-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
          <p className="text-sm text-gray-600">
            Your data stays private and secure. You own and control everything
          </p>
        </div>
      </div>
    </div>
  );
}



