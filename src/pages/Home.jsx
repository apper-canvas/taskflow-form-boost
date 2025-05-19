import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import MainFeature from '../components/MainFeature';
import NewProjectModal from '../components/projects/NewProjectModal';
import { getIcon } from '../utils/iconUtils';
import { fetchAllProjects, selectAllProjects, selectProjectError, selectProjectStatus } from '../features/projects/projectsSlice';

const Home = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const LogoIcon = getIcon('ClipboardList');
  const PlusIcon = getIcon('Plus');
  const DashboardIcon = getIcon('LayoutDashboard');
  const TaskIcon = getIcon('CheckSquare');
  const CalendarIcon = getIcon('Calendar');
  
  // Get projects from Redux store
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects);
  const status = useSelector(selectProjectStatus);
  const error = useSelector(selectProjectError);
  
  // Fetch projects on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProjects());
    }
  }, [dispatch, status]);

  const createNewProject = () => {
    setIsProjectModalOpen(true);
  };
  
  const handleProjectSuccess = () => {
    setIsProjectModalOpen(false);
    if (projects.length > 0) {
      setActiveProject(projects[0]);
    }
  };

  const selectProject = (project) => {
    setActiveProject(project);
    toast.success(`Project "${project.name}" selected`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-tertiary/90 dark:from-primary-dark/90 dark:to-tertiary-dark/90 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Welcome to <span className="gradient-text font-extrabold">TaskFlow</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >Your complete solution for project management, team collaboration, and task tracking - all in one beautiful interface.</motion.p>
        </div>
      </section>
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-4 md:px-8 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <LogoIcon size={28} className="mr-2" />
            <h1 className="text-2xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <span className="hidden md:inline-block mr-1">Dashboard</span>
              <span className="inline-block md:hidden">
                <DashboardIcon size={18} />
              </span>
            </button>
            <button className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <span className="hidden md:inline-block mr-1">Tasks</span>
              <span className="inline-block md:hidden">
                <TaskIcon size={18} />
              </span>
            </button>
            <button className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <span className="hidden md:inline-block mr-1">Calendar</span>
              <span className="inline-block md:hidden">
                <CalendarIcon size={18} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <motion.div 
          className="lg:w-1/3 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button 
              onClick={createNewProject}
              className="btn-primary flex items-center"
            >
              <PlusIcon size={18} className="mr-1" />
              <span>New Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {status === 'loading' && projects.length === 0 ? (
              <div className="p-4 text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <p>Error loading projects: {error}</p>
                <button 
                  onClick={() => dispatch(fetchAllProjects())}
                  className="mt-2 text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-surface-500 mb-2">No projects found</p>
                <button 
                  onClick={createNewProject}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon size={16} className="mr-1" />
                  Create Your First Project
                </button>
              </div>
            ) : (
              projects.map(project => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className={`card cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 ${
                  activeProject?.id === project.id ? 'border-l-primary' : 'border-l-transparent'
                }`}
                onClick={() => selectProject(project)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                    {project.completedTasks}/{project.tasks} tasks
                  </span>
                </div>
                <p className="text-surface-600 dark:text-surface-300 text-sm mb-3">{project.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-surface-500">
                  <div>Due: {new Date(project.dueDate).toLocaleDateString()}</div>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, i) => (
                      <div 
                        key={i}
                        className="w-7 h-7 rounded-full bg-surface-300 dark:bg-surface-600 flex items-center justify-center border-2 border-white dark:border-surface-800 text-xs font-medium"
                      >
                        {member.charAt(0)}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center border-2 border-white dark:border-surface-800 text-xs font-medium">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <div className="lg:w-2/3">
          <MainFeature project={activeProject} />
        </div>
      </main>
      
      {/* Project Modal */}
      <NewProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={handleProjectSuccess} />
    </div>
  );
};

export default Home;