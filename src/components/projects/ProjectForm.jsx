import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { toast } from 'react-toastify';

const ProjectForm = ({ project = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '', team: [] });
  const [errors, setErrors] = useState({});
  const [availableTeamMembers, setAvailableTeamMembers] = useState([
    "Alex S.", "Jamie L.", "Taylor R.", "Morgan W.", "Casey P.", "Jordan B.", "Riley T.", "Blake M.", "Avery D."
  ]);
    description: project.description || '',
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validate = () => {
  const AlertCircleIcon = getIcon('AlertCircle');

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const handleChange = (e) => {
    if (selectedTeamMember && !formData.team.includes(selectedTeamMember)) {
    setFormData(prev => ({
      ...prev,
        team: [...formData.team, selectedTeamMember]
    }));
      setSelectedTeamMember('');
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleSubmit = (e) => {
        .split(',')
        .map(member => member.trim())
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error('Please fix the errors in the form before submitting');
    }
      
      onSubmit({
        ...formData,
        team: teamMembers
      });
        <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="name">
  };
  
  // Animation variants
  const inputVariants = {
    error: { x: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } },
    normal: { x: 0 }
  };
  
  // Get min date for due date (today)
          placeholder="Enter project name"
  
  return (
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircleIcon size={14} className="mr-1" /> {errors.name}</p>
        )}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
        <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="description">
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
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircleIcon size={14} className="mr-1" /> {errors.description}</p>
        )}
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
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircleIcon size={14} className="mr-1" /> {errors.dueDate}</p>
        )}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Describe the project"
            disabled={isLoading}
          ></textarea>
        <div className="flex space-x-2 mb-2">
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.target.value)}
        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium">
            {availableTeamMembers.filter(member => !formData.team.includes(member)).map((member) => (
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
          <p className="text-surface-500 dark:text-surface-400 italic text-sm mt-2">No team members added yet</p>
        
        <div className="space-y-2">
          <label htmlFor="team" className="block text-sm font-medium">
            Team Members
        <motion.button
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