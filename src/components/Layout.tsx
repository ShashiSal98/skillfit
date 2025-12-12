import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { puterClient } from '../lib/puter';
import { FileText, Upload, Target, Home, LogOut, Trash2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isAuthenticated, setAuthenticated, clearAllData, setLoading } = useStore();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await puterClient.signOut();
      setAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      setLoading(true);
      try {
        await puterClient.deleteData('resumes');
        await puterClient.deleteData('jobDescriptions');
        clearAllData();
        alert('All data has been deleted.');
      } catch (error) {
        console.error('Failed to clear data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/upload', label: 'Upload Resume', icon: Upload },
    { path: '/matching', label: 'Job Matching', icon: Target },
  ];

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">SkillFit</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClearData}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Clear all data"
              >
                <Trash2 className="h-5 w-5" />
                <span className="hidden sm:inline">Clear Data</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}



