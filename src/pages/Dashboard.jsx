import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import NewProjectModal from '../components/projects/NewProjectModal';
import { selectAllProjects } from '../features/projects/projectsSlice';

const Dashboard = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const projects = useSelector(selectAllProjects);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const DownloadIcon = getIcon('Download');
  const FolderIcon = getIcon('Folder');
  const UsersIcon = getIcon('Users');
  const ClockIcon = getIcon('Clock');
  const CheckSquareIcon = getIcon('CheckSquare');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  
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
  
  // Sample stats for demonstration
  const stats = [
    { 
      title: "Total Projects", 
      value: totalProjects.toString(), 
      change: "+8.1%", 
      isPositive: true,
      icon: FolderIcon,
      color: "primary"
    },
    { 
      title: "Team Members", 
      value: totalTeamMembers.toString(), 
      change: "+12%", 
      isPositive: true,
      icon: UsersIcon,
      color: "tertiary"
    },
    { 
      title: "Hours Tracked", 
      value: hoursTracked.toString(), 
      change: "-4.3%", 
      isPositive: false,
      icon: ClockIcon,
      color: "secondary"
    },
    { 
      title: "Tasks Completed", 
      value: `${completedTasks}/${totalTasks}`, 
      change: "+23.1%", 
      isPositive: true,
      icon: CheckSquareIcon,
      color: "accent"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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
  );
}