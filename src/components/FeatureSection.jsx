import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { selectAllProjects } from '../features/projects/projectsSlice';
import { toast } from 'react-toastify';

const FeatureSection = () => {
  const projects = useSelector(selectAllProjects);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  
  // Icons
  const AlertCircleIcon = getIcon('AlertCircle');
  const ClockIcon = getIcon('Clock');
  const GitPullRequestIcon = getIcon('GitPullRequest');
  const TargetIcon = getIcon('Target');
  const ArrowRightIcon = getIcon('ArrowRight');
  
  useEffect(() => {
    // Find projects that need attention
    const today = new Date();
    
    // Filter projects based on different criteria
    const urgent = projects.filter(project => {
      // Projects with low progress but close deadlines
      if (!project.dueDate) return false;
      const dueDate = new Date(project.dueDate);
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7 && project.progress < 50;
    });
    
    const behindSchedule = projects.filter(project => {
      // Projects significantly behind ideal progress based on timeline
      if (!project.dueDate) return false;
      const dueDate = new Date(project.dueDate);
      const startDate = new Date(project.createdAt);
      const totalDuration = dueDate - startDate;
      const elapsedDuration = today - startDate;
      
      // Calculate expected progress based on timeline
      const expectedProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
      return expectedProgress - project.progress > 20; // More than 20% behind
    });
    
    const lowCompletion = projects.filter(project => {
      // Projects with low task completion rates
      if (!project.tasks || project.tasks === 0) return false;
      const completionRate = (project.completedTasks / project.tasks) * 100;
      return completionRate < 30 && project.tasks > 2; // Less than 30% completed and has multiple tasks
    });
    
    // Combine and deduplicate projects
    const combined = [...urgent, ...behindSchedule, ...lowCompletion];
    const uniqueProjects = combined.filter((project, index, self) => 
      index === self.findIndex((p) => p.id === project.id)
    );
    
    // Sort by urgency (due date) and take up to 3
    const sorted = uniqueProjects.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }).slice(0, 3);
    
    setFeaturedProjects(sorted);
  }, [projects]);
  
  // If no featured projects, don't show the section
  if (featuredProjects.length === 0) {
    return null;
  }
  
  const getIconForProject = (project) => {
    // Determine which icon to show based on project status
    const today = new Date();
    if (!project.dueDate) return AlertCircleIcon;
    
    const dueDate = new Date(project.dueDate);
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) return AlertCircleIcon;
    if (daysLeft <= 7) return ClockIcon;
    if (project.progress < 30) return GitPullRequestIcon;
    return TargetIcon;
  };
  
  const handleViewDetails = (project) => {
    toast.info(`Viewing details for ${project.name}`);
    // In a real implementation, this would navigate to the project detail page
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => {
          const Icon = getIconForProject(project);
          const dueDate = project.dueDate ? new Date(project.dueDate) : null;
          const daysLeft = dueDate ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card-glass hover:shadow-lg border-l-4 border-amber-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 mb-4">
                  <Icon size={24} />
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full">
                  {daysLeft === null ? 'No due date' : daysLeft <= 0 ? 'Overdue!' : `${daysLeft} days left`}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  {project.completedTasks}/{project.tasks} tasks completed
                </span>
                <button 
                  onClick={() => handleViewDetails(project)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center text-sm font-medium"
                >
                  View Details <ArrowRightIcon size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSection;