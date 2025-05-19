import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import FloatingActionButton from '../components/FloatingActionButton';

import NewProjectModal from '../components/projects/NewProjectModal';
const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Simulate loading dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Mock data for initial display
        // In a real application, this would fetch data from projectService and taskService
        setTimeout(() => {
          setStats({
            totalProjects: 8,
            activeProjects: 5,
            completedProjects: 3,
            totalTasks: 24,
            pendingTasks: 10,
            completedTasks: 14
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-surface-800 dark:text-surface-100">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-float">
            <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-300">Total Projects</h3>
            <p className="text-3xl font-bold mt-2 text-primary">{stats.totalProjects}</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-float">
            <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-300">Active Projects</h3>
            <p className="text-3xl font-bold mt-2 text-secondary">{stats.activeProjects}</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-float">
            <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-300">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-tertiary">{stats.totalTasks}</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-float">
            <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-300">Completed Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-green-500">{stats.completedTasks}</p>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-surface-800 dark:text-surface-100">Recent Activity</h2>
        
        <div className="p-6 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-float">
          <p className="text-surface-600 dark:text-surface-300 text-center py-8">
            Your recent activity will appear here when you start working on projects and tasks.
          </p>
        </div>
      </div>

      {/* Floating action button for creating new items */}
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;