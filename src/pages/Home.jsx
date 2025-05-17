import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';

const Home = () => {
  const [activeProject, setActiveProject] = useState(null);
  const LogoIcon = getIcon('ClipboardList');
  const PlusIcon = getIcon('Plus');
  const DashboardIcon = getIcon('LayoutDashboard');
  const TaskIcon = getIcon('CheckSquare');
  const CalendarIcon = getIcon('Calendar');
  
  const projects = [
    { 
      id: 1, 
      name: "Website Redesign", 
      description: "Complete overhaul of company website with modern design", 
      progress: 75, 
      tasks: 24, 
      completedTasks: 18,
      dueDate: "2023-07-15", 
      team: ["Alex S.", "Jamie L.", "Taylor R."] 
    },
    { 
      id: 2, 
      name: "Mobile App Development", 
      description: "Create iOS and Android versions of customer portal", 
      progress: 45, 
      tasks: 32, 
      completedTasks: 14,
      dueDate: "2023-09-30", 
      team: ["Morgan W.", "Casey P.", "Jordan B.", "Riley T."] 
    },
    { 
      id: 3, 
      name: "Product Launch Campaign", 
      description: "Plan and execute marketing campaign for new product", 
      progress: 30, 
      tasks: 18, 
      completedTasks: 5,
      dueDate: "2023-08-10", 
      team: ["Blake M.", "Avery D."] 
    }
  ];

  const createNewProject = () => {
    toast.info("This would open a new project creation form in a complete app");
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
            {projects.map(project => (
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
            ))}
          </div>
        </motion.div>

        <div className="lg:w-2/3">
          <MainFeature project={activeProject} />
        </div>
      </main>
    </div>
  );
};

export default Home;