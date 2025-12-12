import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { puterClient } from './lib/puter';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobMatching from './pages/JobMatching';
import Auth from './pages/Auth';

function App() {
  const { isAuthenticated, setAuthenticated, setLoading } = useStore();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      setLoading(true);
      try {
        const user = await puterClient.getCurrentUser();
        if (user) {
          setAuthenticated(true, user);
          // Load saved data
          await loadSavedData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuthenticated, setLoading]);

  const loadSavedData = async () => {
    try {
      const savedResumes = await puterClient.loadData('resumes');
      const savedJobs = await puterClient.loadData('jobDescriptions');
      
      if (savedResumes) {
        savedResumes.forEach((r: any) => {
          r.uploadDate = new Date(r.uploadDate);
        });
        useStore.setState({ resumes: savedResumes });
      }
      
      if (savedJobs) {
        useStore.setState({ jobDescriptions: savedJobs });
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/analysis/:resumeId" element={<ResumeAnalysis />} />
          <Route path="/matching" element={<JobMatching />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;



