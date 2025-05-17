import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import NewProjectModal from '../components/projects/NewProjectModal';
import { selectAllProjects } from '../features/projects/projectsSlice';
import { getIcon } from '../utils/iconUtils';

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const projects = useSelector(selectAllProjects);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const DownloadIcon = getIcon('Download');
  const FolderIcon = getIcon('Folder');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const CheckSquareIcon = getIcon('CheckSquare');
  
  // Stats calculations
  const totalProjects = projects.length;
  const totalTeamMembers = [...new Set(projects.flatMap(p => p.team))].length;
  const totalTasks = projects.reduce((sum, project) => sum + project.tasks, 0);
  const completedTasks = projects.reduce((sum, project) => sum + project.completedTasks, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate total hours (fictional data for demonstration)
  const hoursTracked = projects.reduce((sum, project) => {
    // Generate a consistent but random-looking number of hours per project
    const projectHours = Math.floor(project.tasks * 2.5);
    return sum + projectHours;
  }, 0);
  
  const handleExport = () => {
    toast.info("Exporting dashboard data...");
    setTimeout(() => {
      toast.success("Dashboard data exported successfully!");
    }, 1500);
  };
  
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

const Dashboard = () => {
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
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
      color: "primary"
    },
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Projects */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Projects</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <FolderIcon size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{totalProjects}</span>
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400 mb-1">active projects</span>
          </div>
        </motion.div>
        
        {/* Team Members */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center">
              <UsersIcon size={20} className="text-tertiary" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{totalTeamMembers}</span>
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400 mb-1">across all projects</span>
          </div>
        </motion.div>
        
        {/* Hours Tracked */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hours Tracked</h3>
            <div className="w-10 h-10 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
              <ClockIcon size={20} className="text-secondary" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{hoursTracked}</span>
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400 mb-1">total hours</span>
          </div>
        </motion.div>
        
        {/* Tasks Completed */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tasks Completed</h3>
            <div className="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
              <CheckSquareIcon size={20} className="text-accent" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{completedTasks}/{totalTasks}</span>
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400 mb-1">{completionRate}% completion</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
    { 
      title: "Team Members", 
      value: "24", 
      change: "+12%", 
      icon: UsersIcon,
export default Dashboard;
      color: "tertiary"
    },
    { 
      title: "Hours Tracked", 
      value: "186", 
      change: "-4.3%", 
      isPositive: false,
      icon: ClockIcon,
      color: "secondary"
    },
    { 
      title: "Tasks Completed", 
      value: "64", 
      change: "+23.1%", 
      isPositive: true,
      icon: CheckCircleIcon,
      color: "accent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="btn-outline flex items-center space-x-2">
            <span>Export</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <span>New Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/15 flex items-center justify-center text-${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">{stat.title}</p>
              <span className={`flex items-center text-sm ${stat.isPositive ? 'text-secondary' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />} {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
            <h3 className="text-lg font-semibold">Tasks Completed</h3>
            <div className="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
              <CheckSquareIcon size={20} className="text-accent" />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{completedTasks}/{totalTasks}</span>
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400 mb-1">{completionRate}% completion</span>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="card-glass hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/15 flex items-center justify-center text-${stat.color} mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <div className="flex justify-between items-center">
              <p className="text-surface-600 dark:text-surface-300">{stat.title}</p>
              <span className={`flex items-center text-sm ${stat.isPositive ? 'text-secondary' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />} {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
    </div>