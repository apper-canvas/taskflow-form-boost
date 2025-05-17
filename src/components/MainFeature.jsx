import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { selectAllProjects } from '../features/projects/projectsSlice';

const MainFeature = ({ onNewProject }) => {
  // Get icons
  const ChartIcon = getIcon('BarChart');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const PlusIcon = getIcon('Plus');
  const ArrowRightIcon = getIcon('ArrowRight');

  // Get projects from Redux store
  const projects = useSelector(selectAllProjects);
  
  // Calculate stats for the feature display
  const totalProjects = projects.length;
  const completedTasks = projects.reduce((sum, project) => sum + (project.completedTasks || 0), 0);
  const totalTasks = projects.reduce((sum, project) => sum + (project.tasks || 0), 0);
  const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Find upcoming deadlines (next 7 days)
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = projects.filter(project => {
    if (!project.dueDate) return false;
    const dueDate = new Date(project.dueDate);
    return dueDate >= today && dueDate <= oneWeekLater;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  // Determine feature state based on data
  let featureState = 'neutral';
  if (overallCompletionRate >= 70) {
    featureState = 'success';
  } else if (upcomingDeadlines.length > 0) {
    featureState = 'warning';
  }
  
  // Get feature colors based on state
  const getBackgroundStyle = () => {
    switch (featureState) {
      case 'success': 
        return 'from-secondary/20 via-secondary/10 to-transparent dark:from-secondary/30 dark:via-secondary/15 dark:to-transparent';
      case 'warning':
        return 'from-amber-500/20 via-amber-500/10 to-transparent dark:from-amber-500/30 dark:via-amber-500/15 dark:to-transparent';
      default:
        return 'from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/15 dark:to-transparent';
    }
  };
  
  // Set title and button based on state
  const getFeatureContent = () => {
    switch (featureState) {
      case 'success':
        return {
          icon: <CheckCircleIcon size={40} className="text-secondary dark:text-secondary-light" />,
          title: "You're making great progress!",
          description: `Overall completion rate: ${overallCompletionRate}%`,
          buttonText: "View Progress Details"
        };
      case 'warning':
        return {
          icon: <ClockIcon size={40} className="text-amber-500" />,
          title: "Upcoming deadlines need attention",
          description: `${upcomingDeadlines.length} project${upcomingDeadlines.length > 1 ? 's' : ''} due in the next 7 days`,
          buttonText: "View Upcoming Deadlines"
        };
      default:
        return {
          icon: <ChartIcon size={40} className="text-primary dark:text-primary-light" />,
          title: "Welcome to your project dashboard",
          description: `You have ${totalProjects} active project${totalProjects !== 1 ? 's' : ''}`,
          buttonText: "Create New Project"
        };
    }
  };
  
  const featureContent = getFeatureContent();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl bg-white/90 dark:bg-surface-800/90 mb-10 shadow-float backdrop-blur-sm border border-white/50 dark:border-surface-700/50`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${getBackgroundStyle()}`} />
      
      <div className="relative p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 md:mb-0">
          <div className="w-16 h-16 rounded-2xl bg-white/70 dark:bg-surface-700/70 flex items-center justify-center shadow-card">
            {featureContent.icon}
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{featureContent.title}</h2>
            <p className="text-surface-600 dark:text-surface-300">{featureContent.description}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewProject}
          className="btn-primary py-3 px-6 flex items-center gap-2"
        >
          {featureState === 'neutral' ? <PlusIcon size={18} /> : <ArrowRightIcon size={18} />}
          {featureContent.buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MainFeature;