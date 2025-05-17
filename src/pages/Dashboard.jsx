import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import NewProjectModal from '../components/projects/NewProjectModal';
import { selectAllProjects, fetchAllProjects } from '../features/projects/projectsSlice';
import MainFeature from '../components/MainFeature';

const Dashboard = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects);
  
  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchAllProjects()).unwrap();
      } catch (error) {
        toast.error("Failed to load projects: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [dispatch]);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const DownloadIcon = getIcon('Download');
  const FolderIcon = getIcon('Folder');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const CheckSquareIcon = getIcon('CheckSquare');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const LoaderIcon = getIcon('Loader');
  
  // Stats calculations
  const totalProjects = isLoading ? 0 : projects.length;
  const totalTeamMembers = isLoading ? 0 : [...new Set(projects.flatMap(p => p.team || []))].length;
  const totalTasks = isLoading ? 0 : projects.reduce((sum, project) => sum + (project.tasks || 0), 0);
  const completedTasks = isLoading ? 0 : projects.reduce((sum, project) => sum + (project.completedTasks || 0), 0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  const handleExport = () => {
    toast.info("Exporting dashboard data...");
    setTimeout(() => {
      toast.success("Dashboard data exported successfully!");
    }, 1500);
  };
  
  // If we're loading, show a loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="animate-spin h-12 w-12 text-primary" />
      <p className="ml-2 text-xl">Loading dashboard data...</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Feature */}
      <MainFeature onNewProject={() => setIsNewProjectModalOpen(true)} />
      
      <motion.div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon size={18} className="mr-1.5" />
            New Project
          </button>
          <button 
            onClick={handleExport}
            className="btn-outline flex items-center"
          >
            <DownloadIcon size={18} className="mr-1.5" />
            Export
          </button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
        >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4">
              <FolderIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalProjects}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">Total Projects</p>
              <span className="flex items-center text-sm text-secondary">
                <ArrowUpIcon size={14} className="mr-1" /> New
              </span>
            </div>
        </motion.div>

        <motion.div 
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass hover:shadow-lg"
        >
            <div className="w-12 h-12 rounded-xl bg-tertiary/15 flex items-center justify-center text-tertiary mb-4">
              <UsersIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalTeamMembers}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">Team Members</p>
              <span className="flex items-center text-sm text-secondary">
                <ArrowUpIcon size={14} className="mr-1" /> Active
              </span>
            </div>
        </motion.div>

        <motion.div 
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass hover:shadow-lg"
        >
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-4">
              <ClockIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalTasks}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">Total Tasks</p>
            </div>
        </motion.div>

        <motion.div 
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass hover:shadow-lg"
        >
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-accent mb-4">
              <CheckSquareIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{completedTasks}/{totalTasks}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">Tasks Completed</p>
              <span className="flex items-center text-sm text-secondary">
                <ArrowUpIcon size={14} className="mr-1" /> Progress
              </span>
            </div>
        </motion.div>
      
      {/* Projects List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-surface-600 dark:text-surface-400 col-span-full text-center py-8">
              No projects found. Create your first project using the "New Project" button.
            </p>
          ) : (
            projects.map((project, index) => (
              <motion.div 
                key={project.id}
                className="card-glass hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date'}
                  </span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    {project.completedTasks}/{project.tasks} Tasks
                  </span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {(project.team || []).slice(0, 3).map((member, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium border-2 border-white dark:border-surface-800">
                        {member.substring(0, 2)}
                      </div>
                    ))}
                    {(project.team || []).length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-surface-300/20 text-surface-600 dark:text-surface-300 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-surface-800">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {project.progress || 0}% Complete
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      </div>
      
      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
    </div>
  );
}

export default Dashboard;