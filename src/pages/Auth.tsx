import { useState } from 'react';
import { useStore } from '../store/useStore';
import { puterClient } from '../lib/puter';
import { FileText, Sparkles } from 'lucide-react';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated, setLoading } = useStore();

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setLoading(true);
    
    try {
      const user = await puterClient.signIn();
      setAuthenticated(true, user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <FileText className="h-16 w-16 text-primary-600" />
              <Sparkles className="h-8 w-8 text-primary-400 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SkillFit</h1>
          <p className="text-xl text-gray-600">AI-Powered Resume Analyzer & Job Matcher</p>
        </div>

        <div className="card shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600">
              Sign in to start analyzing resumes and matching with job descriptions
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In with Puter.js'}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Privacy First:</strong> All your data is stored securely and privately.
              You maintain full ownership and control.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by Puter.js • Serverless • No Backend Required</p>
        </div>
      </div>
    </div>
  );
}



