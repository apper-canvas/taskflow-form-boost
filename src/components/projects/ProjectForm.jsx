import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';

const ProjectForm = ({ project = {}, onSubmit, isLoading = false }) => {
  const LoaderIcon = getIcon('Loader2');
  const CalendarIcon = getIcon('Calendar');
  const UsersIcon = getIcon('Users');
  
  // Form state
  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    dueDate: project.dueDate || '',
    team: project.team ? project.team.join(', ') : ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Process team members
      const teamMembers = formData.team
        .split(',')
        .map(member => member.trim())
        .filter(member => member);
      
      onSubmit({
        ...formData,
        team: teamMembers
      });
    }
  };
  
  // Animation variants
  const inputVariants = {
    error: { x: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } },
    normal: { x: 0 }
  };
  
  // Get min date for due date (today)
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Project Name
        </label>
        <motion.div
          variants={inputVariants}
          animate={errors.name ? 'error' : 'normal'}
        >
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Enter project name"
            disabled={isLoading}
          />
        </motion.div>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <motion.div
          variants={inputVariants}
          animate={errors.description ? 'error' : 'normal'}
        >
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Describe the project"
            disabled={isLoading}
          ></textarea>
        </motion.div>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <div className="relative">
            <motion.div
              variants={inputVariants}
              animate={errors.dueDate ? 'error' : 'normal'}
            >
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
                className={`input-field pl-10 ${errors.dueDate ? 'border-red-500 dark:border-red-400' : ''}`}
                disabled={isLoading}
              />
            </motion.div>
            <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          </div>
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="team" className="block text-sm font-medium">
            Team Members
          </label>
          <div className="relative">
            <input
              type="text"
              id="team"
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Comma-separated names"
              disabled={isLoading}
            />
            <UsersIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          </div>
          <p className="text-xs text-surface-500">Separate team member names with commas</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button
          type="button"
          onClick={() => onSubmit(null)}
          className="btn-outline"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderIcon size={18} className="mr-2 animate-spin" />
              Creating...
            </>
          ) : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;